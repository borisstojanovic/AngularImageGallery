const express = require('express');
const Joi = require('joi');
const { mysql } = require('../utils/database');
const fs = require('fs');
const { cloudinary } = require('../utils/cloudinary');
const authJwt = require("../middleware/authJwt");

//multer setup
const uploads = require('./uploads');
const images = uploads.images;

//database setup
const { pool } = require('../utils/database');

const route = express.Router();

const scheme = Joi.object().keys({
    owner_id: Joi.number().required(),
    description: Joi.string().max(256).required(),
    title: Joi.string().max(128).required(),
});

const removefile = function(path){
    fs.unlink(path, (err) => {
        if(err){
            throw new Error(err.message);
        }
    })
}

function isLike(user_id, image_id) {
    let query = 'select * from `like` where user_id=? and image_id=?'
    let formatted = mysql.format(query, [user_id, image_id])
    return new Promise((resolve, reject) => {
        pool.query(formatted, (err, response) => {
            if(err) reject(err)
            else{
                if(response[0]){
                    if(response[0].is_like) resolve(true);
                    else resolve(false);
                }
                else resolve(null);
            }
        })
    })
}

function isFavorite(user_id, image_id) {
    let query = 'select * from favorite where user_id=? and image_id=?'
    let formatted = mysql.format(query, [user_id, image_id])
    return new Promise((resolve, reject) => {
        pool.query(formatted, (err, response) => {
            if(err) reject(err)
            else{
                if(response[0]) resolve(true)
                else resolve(false);
            }
        })
    })
}

function getUser(id) {
    let query = 'select * from user where id=?'
    let formatted = mysql.format(query, id)
    return new Promise((resolve, reject) => {
        pool.query(formatted, (err, response) => {
            if(err){
                reject(err)
            }else{
                resolve(response[0])
            }
        })
    })
}

route.get('/all', [authJwt.deserializeUser],  (req, res) => {
    let query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
        "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
        "images.id = like.image_id group by images.id";
    pool.query(query, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            for (const row of rows) {
                row.path = cloudinary.url(row.path);
                await getUser(row.owner_id).then(response => {
                    row.user = response;
                }).catch( err => {
                    return res.status(400).send(err.message);
                });
                if(req.user){
                    await isFavorite(req.user.user_id, row.id).then(response => {
                        row.isFavorite = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                    await isLike(req.user.user_id, row.id).then(response => {
                        row.isLike = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                }
            }
            res.send(rows);
        }
     });
});

route.get('/count', (req, res) => {
    let query = 'select count(*) from images';
    pool.query(query, async (err, count) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else
            res.send(count);
    });
})

/**
 * Returns all images paginated using the page and size query params
 */
route.get('/paginated/:page/:size', [authJwt.deserializeUser],   (req, res) => {
    let size = req.params.size;
    let start = (req.params.page - 1) * size;
    let query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
        "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
        "images.id = like.image_id group by images.id order by time limit ?,?";
    let formatted = mysql.format(query, [start, parseInt(size)]);
    pool.query(formatted, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            for (const row of rows) {
                row.path = cloudinary.url(row.path);
                await getUser(row.owner_id).then( response => {
                    row.user = response;
                }).catch( err => {
                    return res.status(400).send(err.message)
                });
                if(req.user) {
                    await isFavorite(req.user.user_id, row.id).then(response => {
                        row.isFavorite = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                    await isLike(req.user.user_id, row.id).then(response => {
                        row.isLike = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                }else{
                    row.isFavorite = false;
                    row.isLike = null;
                }
            }
            res.send(rows);
        }
    });
});

/**
 * Returns all images paginated using the page and size query params
 * The sort parameter can be views, newest or likes
 */
route.get('/paginated/:page/:size/:sort', [authJwt.deserializeUser],   (req, res) => {
    let size = req.params.size;
    let start = (req.params.page - 1) * size;
    let sort = req.params.sort;
    let query = '';
    let formatted = '';
    if(sort === 'likes'){
        query = 'SELECT images.*, COUNT(case when is_like=1 then 1 else NULL end) AS likes, COUNT(case when is_like=0 then 1 else NULL end) as dislikes '+
            'FROM images LEFT JOIN `like` ON images.id = like.image_id GROUP BY images.id ORDER BY likes - dislikes desc, time desc limit ?,?';
    }else if (sort === 'views'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id group by images.id order by views desc, time desc limit ?,?";
    }else if (sort === 'newest'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id group by images.id order by time desc, views desc limit ?,?";
    }else{
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id group by images.id limit ?,?";
    }
    formatted = mysql.format(query, [start, parseInt(size)]);
    pool.query(formatted, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            for (const row of rows) {
                row.path = cloudinary.url(row.path);
                await getUser(row.owner_id).then( response => {
                    row.user = response;
                }).catch( err => {
                    return res.status(400).send(err.message)
                });
                if(req.user) {
                    await isFavorite(req.user.user_id, row.id).then(response => {
                        row.isFavorite = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                    await isLike(req.user.user_id, row.id).then(response => {
                        row.isLike = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                }else{
                    row.isFavorite = false;
                    row.isLike = null;
                }
            }
            res.send(rows);
        }
    });
});

/**
 * used to search all images by their titles
 * pass title parameter to match the titles
 * pass page and size parameters for pagination
 * sort param can be views, likes or newest
 *
 * returns rows matching the given parameters
 */
route.get('/getAllByTitle/:title/:page/:size/:sort', [authJwt.deserializeUser],  (req, res) => {
    let title = req.params.title;
    let size = req.params.size;
    let start = (req.params.page - 1) * size;
    let sort = req.params.sort;
    let query = '';
    let formatted = '';
    if(sort === 'likes'){
        query = 'SELECT images.*, COUNT(case when is_like=1 then 1 else NULL end) AS likes, COUNT(case when is_like=0 then 1 else NULL end) AS dislikes '+
            'FROM images LEFT JOIN `like` ON images.id = like.image_id WHERE title like ? GROUP BY images.id ORDER BY likes-dislikes desc, time desc limit ?,?';
    }else if (sort === 'views'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id where title like ? group by images.id order by views desc, time desc limit ?,?";
    }else if (sort === 'newest'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id where title like ? group by images.id order by time desc, views desc limit ?,?";
    }else{
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id where title like ? group by images.id limit ?,?";
    }
    formatted = mysql.format(query, ['%' + title + '%', start, parseInt(size)]);
    pool.query(formatted, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            for (const row of rows) {
                row.path = cloudinary.url(row.path);
                await getUser(row.owner_id).then( response => {
                    row.user = response;
                }).catch( err => {
                    return res.status(400).send(err.message)
                });
                if(req.user) {
                    await isFavorite(req.user.user_id, row.id).then(response => {
                        row.isFavorite = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                    await isLike(req.user.user_id, row.id).then(response => {
                        row.isLike = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                }
            }
            res.send(rows);
        }
    });
});

/**
 * used to search all images by their owners username
 * pass title parameter to match the titles
 * pass page and size parameters for pagination
 *
 * returns rows matching the given parameters
 */
route.get('/getAllForUser/:username/:page/:size/:sort', [authJwt.deserializeUser],   (req, res) => {
    let username = req.params.username;
    let size = req.params.size;
    let start = (req.params.page - 1) * size;
    let sort = req.params.sort;
    let query = "";
    if(sort === 'likes'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes, \n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on \n" +
            "images.id = like.image_id left join user on images.owner_id = user.id \n" +
            "where user.username = ? group by images.id order by likes - dislikes desc limit ?,?";
    }else if(sort === 'views'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id left join user on images.owner_id = user.id\n" +
            "where user.username = ? group by images.id order by views desc, time desc limit ?,?";
    }else if(sort === 'newest'){
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id left join user on images.owner_id = user.id\n" +
            "where user.username = ? group by images.id order by time desc, views desc limit ?,?";
    }else{
        query = "select images.*, count(case when like.is_like=1 then 1 else NULL end) as likes,\n" +
            "count(case when like.is_like=0 then 1 else NULL end) as dislikes from images left join `like` on\n" +
            "images.id = like.image_id left join user on images.owner_id = user.id\n" +
            "where user.username = ? group by images.id limit ?,?";
    }
    let formatted = mysql.format(query, [username, start, parseInt(size)]);
    pool.query(formatted, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            for (const row of rows) {
                row.path = cloudinary.url(row.path);
                await getUser(row.owner_id).then( response => {
                    row.user = response;
                }).catch( err => {
                    return res.status(400).send(err.message)
                });
                if(req.user) {
                    await isFavorite(req.user.user_id, row.id).then(response => {
                        row.isFavorite = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                    await isLike(req.user.user_id, row.id).then(response => {
                        row.isLike = response;
                    }).catch(err => {
                        return res.status(400).send(err.message);
                    })
                }
            }
            res.send(rows);
        }
    });
});

route.post('/add', images.single('image'), [authJwt.verifyToken], async (req, res) => {
    if(req.file === undefined){
        res.status(400).send(new Error('Please submit a file').message);
    }else {
        let {error} = Joi.validate(req.body, scheme);
        if(req.user.user_id !== parseInt(req.body.owner_id)){
            removefile(req.file.path);
            return res.status(401).send(new Error('Unauthorized edit').sqlMessage);
        }
        if (error) {
            removefile(req.file.path);
            res.status(400).send(error.details[0].message);
        } else {
            let query = "insert into images (title, owner_id, description, path) values (?, ?, ?, ?)";
            let path = req.file.path;
            let uploadedResponse = null
            await cloudinary.uploader.upload(path).then(response => {
                uploadedResponse = response;
            }).catch( error => {
                res.status(400).send(error.sqlMessage);
            })
            removefile(path); //posto je snimljen na cdn brisem ga iz fs-a
            path = uploadedResponse.public_id; //postavljam path na URL koji vraca upload
            let formatted = mysql.format(query, [req.body.title, req.body.owner_id, req.body.description, path]);

            pool.query(formatted, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from images where id=?';
                    formatted = mysql.format(query, [response.insertId]);
                    pool.query(formatted, async (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else {
                            rows[0].path = cloudinary.url(rows[0].path);
                            await getUser(rows[0].owner_id).then( response => {
                                rows[0].user = response;
                            }).catch( err => {
                                return res.status(400).send(err.message)
                            });
                            await isFavorite(req.user.user_id, rows[0].id).then(response => {
                                rows[0].isFavorite = response;
                            }).catch(err => {
                                return res.status(400).send(err.message);
                            })
                            await isLike(req.user.user_id, rows[0].id).then(response => {
                                rows[0].isLike = response;
                            }).catch(err => {
                                return res.status(400).send(err.message);
                            })
                            res.send(rows[0]);
                        }
                    });
                }
            });
        }
    }
});

route.get('/:id', [authJwt.verifyToken], (req, res) => {
    let query = 'select * from images where id=?';
    let formated = mysql.format(query, [req.params.id]);

    pool.query(formated, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            if(rows[0] !== undefined) {
                rows[0].path = cloudinary.url(rows[0].path);
            }
            await getUser(rows[0].owner_id).then( response => {
                rows[0].user = response;
            }).catch( err => {
                return res.status(400).send(err.message)
            });
            await isFavorite(req.user.user_id, rows[0].id).then(response => {
                rows[0].isFavorite = response;
            }).catch(err => {
                return res.status(400).send(err.message);
            })
            await isLike(req.user.user_id, rows[0].id).then(response => {
                rows[0].isLike = response;
            }).catch(err => {
                return res.status(400).send(err.message);
            })
            res.send(rows[0]);
        }
    });
});

/**
 * Used when changing only the title and description without the image path
 */
route.put('/edit/:id', [authJwt.verifyToken], images.none(), (req, res) => {
    if(req.body === undefined){
        res.status(400).send(new Error('Body empty error').sqlMessage);
    } else {
        let {error} = Joi.validate(req.body, scheme);
        if(req.user.user_id !== parseInt(req.body.owner_id)){
            return res.status(401).send(new Error('Unauthorized edit').sqlMessage);
        }
        if (error)
            res.status(400).send(error.details[0].message);
        else {
            let query = "update images set owner_id=?, description=?, title=? where id=?";
            let formated = mysql.format(query, [req.body.owner_id, req.body.description, req.body.title, req.params.id]);

            pool.query(formated, (err, response) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    query = 'select * from images where id=?';
                    formated = mysql.format(query, [req.params.id]);

                    pool.query(formated, async (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else {
                            if (rows[0] === undefined)
                                res.status(400).send(new Error('Image doesn\'t exist').sqlMessage);
                            else {
                                rows[0].path = cloudinary.url(rows[0].path);
                                await getUser(rows[0].owner_id).then( response => {
                                    rows[0].user = response;
                                }).catch( err => {
                                    return res.status(400).send(err.message)
                                });
                                await isFavorite(req.user.user_id, rows[0].id).then(response => {
                                    rows[0].isFavorite = response;
                                }).catch(err => {
                                    return res.status(400).send(err.message);
                                })
                                await isLike(req.user.user_id, rows[0].id).then(response => {
                                    rows[0].isLike = response;
                                }).catch(err => {
                                    return res.status(400).send(err.message);
                                })
                                res.send(rows[0]);
                            }
                        }
                    })
                }
            })
        }
    }
});

const uploadToCloudinary = function(image) {
    return new Promise((resolve, reject) => {
        let response = cloudinary.uploader.upload(image, (err, url) => {
            if (err) return reject(err);
            return resolve(response);
        })
    });
}

/**
 * Edits the image matching the id passed as the query parameter
 * Used when changing the image path at the same time as the other fields
 */
route.put('/update/:id', [authJwt.verifyToken], images.single('image'), async (req, res) => {
    if(req.file === undefined){
        res.status(400).send(new Error('Please submit a file').sqlMessage);
    }else {
        let {error} = Joi.validate(req.body, scheme);
        if(req.user.user_id !== parseInt(req.body.owner_id)){
            removefile(req.file.path);
            return res.status(401).send(new Error('Unauthorized edit').sqlMessage);
        }
        if (error) {
            removefile(req.file.path);
            res.status(400).send(error.details[0].message);
        } else {
            let path = req.file.path;
            let oldpath = req.file.path;
            let queryselectpath = 'select path from images where id=?';
            let formatedselectpath = mysql.format(queryselectpath, [req.params.id]);
            pool.query(formatedselectpath, (err, row) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else {
                    if (row[0] !== undefined) {
                        oldpath = row[0].path.toString();
                    } else {
                        //pokusava da promeni red koji ne postoji u bazi
                        res.status(400).send(new Error('Image doesn\'t exist').sqlMessage);
                    }
                }
            })
            let uploadedResponse = null;
            await uploadToCloudinary(path).then(response => {
                uploadedResponse = response;
            }).catch(err=>{
                res.sendStatus(500);
            })
            path = uploadedResponse.public_id;
            removefile(req.file.path);
            let query = "update images set title=?, owner_id=?, description=?, path=? where id=?";
            let formated = mysql.format(query, [req.body.title, req.body.owner_id, req.body.description, path, req.params.id]);

            pool.query(formated, (err, response) => {
                if (err) {
                    //remove the new image from cloudinary if query fails
                    cloudinary.uploader.destroy(path, function (error, result) {});
                    res.status(500).send(err.sqlMessage);
                } else {
                    //remove old image from cloudinary if query succeeds
                    cloudinary.uploader.destroy(oldpath, function (error, result) {});
                    query = 'select * from images where id=?';
                    formated = mysql.format(query, [req.params.id]);

                    pool.query(formated, async (err, rows) => {
                        if (err)
                            res.status(500).send(err.sqlMessage);
                        else {
                            if(rows[0] === undefined){
                                cloudinary.uploader.destroy(path, function (error, result) {});
                                res.status(400).send(new Error('Image doesn\'t exist').sqlMessage);
                            }else {
                                rows[0].path = cloudinary.url(rows[0].path);
                                await getUser(rows[0].owner_id).then( response => {
                                    rows[0].user = response;
                                }).catch( err => {
                                    return res.status(400).send(err.message)
                                });
                                await isFavorite(req.user.user_id, rows[0].id).then(response => {
                                    rows[0].isFavorite = response;
                                }).catch(err => {
                                    return res.status(400).send(err.message);
                                })
                                await isLike(req.user.user_id, rows[0].id).then(response => {
                                    rows[0].isLike = response;
                                }).catch(err => {
                                    return res.status(400).send(err.message);
                                })
                                res.send(rows[0]);
                            }
                        }
                    });
                }
            });
        }
    }
});

/**
 * Increments the views counter for the image matching the :id query parameter
 */
route.put('/incrementViews/:id', (req, res) => {
    let query = 'update images set views=views+1 where id=?';
    let formatted = mysql.format(query, [req.params.id]);
    pool.query(formatted, (err, response) => {
        if(err)
            res.status(500).send(err.sqlMessage)
        else
            res.status(200).send(response)
    })
})

/**
 * Deletes the image with the id matching the query parameter
 *
 * Returns the image if successful, otherwise returns the sql error
 */
route.delete('/delete/:id', [authJwt.verifyToken], (req, res) => {
    let query = 'select * from images where id=?';
    let formated = mysql.format(query, [req.params.id]);
    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let image = rows[0];
            if(image !== undefined) {
                cloudinary.uploader.destroy(image.path, function (error, result) {
                    console.log(result, error)
                });
                image.path = cloudinary.url(image.path);
            }
            let query = 'delete from images where id=?';
            let formated = mysql.format(query, [req.params.id]);

            pool.query(formated, (err, rows) => {
                if (err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.send(image);
            });
        }
    });
});

module.exports = route;
