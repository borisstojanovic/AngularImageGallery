const express = require('express');
const Joi = require('joi');
const { mysql } = require('../utils/database');
const fs = require('fs');
const { cloudinary } = require('../utils/cloudinary');
const { authMiddleware } = require('../middleware/auth')

//multer setup
const uploads = require('./uploads');
const images = uploads.images;

//database setup
const { pool } = require('../utils/database');

const route = express.Router();

const scheme = Joi.object().keys({
    owner_id: Joi.number().required(),
    description: Joi.string().max(128).required(),
});

const removefile = function(path){
    fs.unlink(path, (err) => {
        if(err){
            throw new Error(err.message);
        }
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

route.get('/images',   (req, res) => {
     pool.query('select * from images', async (err, rows) => {
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
            }
            res.send(rows);
        }
    });
});

route.get('/images/:id', authMiddleware,   (req, res) => {
    let query = 'select * from images where owner_id=?';
    let formatted = mysql.format(query, [req.params.id]);
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
            }
            res.send(rows);
        }
    });
});

route.post('/images', images.single('image'), authMiddleware, async (req, res) => {
    if(req.file === undefined){
        res.status(400).send(new Error('Please submit a file').message);
    }else {
        let {error} = Joi.validate(req.body, scheme);
        if(req.user.user_id !== parseInt(req.body.owner_id)){
            console.log(req.body.owner_id)
            removefile(req.file.path);
            return res.status(401).send(new Error('Unauthorized edit').sqlMessage);
        }
        if (error) {
            removefile(req.file.path);
            res.status(400).send(error.details[0].message);
        } else {
            let query = "insert into images (owner_id, description, path) values (?, ?, ?)";
            let path = req.file.path;
            let uploadedResponse = null
            await cloudinary.uploader.upload(path).then(response => {
                uploadedResponse = response;
            }).catch( error => {
                res.status(400).send(error.sqlMessage);
            })
            removefile(path); //posto je snimljen na cdn brisem ga iz fs-a
            path = uploadedResponse.public_id; //postavljam path na URL koji vraca upload
            let formatted = mysql.format(query, [req.body.owner_id, req.body.description, path]);

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
                            res.send(rows[0]);
                        }
                    });
                }
            });
        }
    }
});

route.get('/image/:id', authMiddleware, (req, res) => {
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
            res.send(rows[0]);
        }
    });
});

//sluzi samo da se promene username i description
route.put('/edit/:id', authMiddleware, images.none(), (req, res) => {
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
            let query = "update images set owner_id=?, description=? where id=?";
            let formated = mysql.format(query, [req.body.owner_id, req.body.description, req.params.id]);

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

route.put('/image/:id', authMiddleware, images.single('image'), async (req, res) => {
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
            let query = "update images set owner_id=?, description=?, path=? where id=?";
            let formated = mysql.format(query, [req.body.owner_id, req.body.description, path, req.params.id]);

            pool.query(formated, (err, response) => {
                if (err) {
                    cloudinary.uploader.destroy(path, function (error, result) {});
                    res.status(500).send(err.sqlMessage);
                } else {
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
                                res.send(rows[0]);
                            }
                        }
                    });
                }
            });
        }
    }
});

route.delete('/image/:id', authMiddleware, (req, res) => {
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
