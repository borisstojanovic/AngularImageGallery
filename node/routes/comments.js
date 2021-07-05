const express = require('express');
const Joi = require('joi');
const { mysql } = require('../utils/database');
const { authMiddleware } = require('../middleware/auth')
const authJwt = require("../middleware/authJwt");

//database setup
const { pool } = require('../utils/database');

const route = express.Router();

const scheme = Joi.object().keys({
    image_id: Joi.number().required(),
    comment_id: Joi.number(),
    content: Joi.string().max(256).required(),
});

route.get('/all',   (req, res) => {
    pool.query('select * from comment', (err, rows) => {
        if(err){
            res.status(500).send(err.sqlMessage);
        }else{
            res.send(rows);
        }
    });
});

const getUser = (id) => {
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

const getChildren = (id) => {
    let query = 'select * from comment where comment_id=?'
    let formatted = mysql.format(query, id)
    return new Promise((resolve, reject) => {
        pool.query(formatted, (err, rows) => {
            if(err){
                reject(err);
            }else{
                resolve(rows);
            }
        })
    })
}

/*
route.get('/image/paginated/:id/:page/:size',   (req, res) => {
    let size = req.params.size;
    let start = (req.params.page - 1) * size;
    let query = 'select * from comment where image_id=? order by date_created limit ?,?';
    let formatted = mysql.format(query, [req.params.id, start, parseInt(size)]);
    pool.query(formatted, async (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage);
        }
        else {

            //get user info for each comment
            for(const row of rows){
                await getUser(row.user_id)
                    .then((user) => row.user = user)
                    .catch((err) => {return res.status(500).send(err)});
            }

            //recursively check all parents
            //add the child to children of comment with comment.id = child.comment_id
            //recursion is possible because query retrieved comments sorted
            //by time created so each comment must have a parent
            let recursive = (child, parents) => {
                for (let value in parents) {
                    let parent = parents[value];
                    if (parent.id === child.comment_id) {
                        parent.children[child.id] = child;
                        return;
                    }

                    if(parent.children){
                        recursive(child, parent.children);
                    }
                }
            }
            let parents = {}, comment;
            for (let i = 0; i < rows.length; i++) {
                comment = rows[i];
                comment.children = {};
                let parentId = comment.comment_id;
                //if the comment doesn't have a parent comment then it is a parent
                if (!parentId) {
                    parents[comment.id] = comment;
                    continue;
                }
                recursive(comment, parents)
            }
            res.status(200).send(parents);
        }
    });
});


 */

route.get('/image/paginated/:id/:page/:size',   (req, res) => {
    let size = req.params.size;
    let start = (req.params.page - 1) * size;
    let query = 'select * from comment where image_id=? and comment_id is null order by date_created limit ?,?';
    let formatted = mysql.format(query, [req.params.id, start, parseInt(size)]);
    pool.query(formatted, async (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage);
        }
        else {
            //get user info for each comment
            //get all children for each parent comment
            for(const row of rows){
                await getUser(row.user_id)
                    .then((user) => row.user = user)
                    .catch((err) => {return res.status(500).send(err)});
                await getChildren(row.id)
                    .then((children) => row.children = children)
                    .catch((err) => {return res.status(500).send(err)})
            }
            res.status(200).send(rows);
        }
    });
});
route.get('/user/:id', async (req, res) => {

    let query = 'select * from comment where user_id=?';
    let formatted = mysql.format(query, [req.params.id]);
    pool.query(formatted, async (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage);
        }
        else {
            res.send(rows);
        }
    });
});

route.get('/comment/:id', (req, res) => {
    let query = 'select * from comment where id=?';
    let formated = mysql.format(query, [req.params.id]);
    pool.query(formated, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            res.send(rows[0]);
        }
    });
});

//sluzi samo da se promeni content
route.put('/edit/:id', [authJwt.verifyToken], (req, res) => {
    if(req.body === undefined){
        res.status(400).send(new Error('Body empty error').message);
    } else {
        let {error} = Joi.validate(req.body, scheme);
        if (error) {
            res.status(400).send(error.details[0].message);
        }
        else {
            let searchQuery = 'select * from comment where id=?';
            let searchFormatted = mysql.format(searchQuery, [req.params.id]);
            pool.query(searchFormatted, (err, rows) => {
                if (err)
                    res.status(500).send(err.message);
                else {
                    if (rows[0] === undefined)
                        res.status(400).send(new Error('Comment doesn\'t exist').nessage);
                    else {
                        if(req.user.user_id !== rows[0].user_id){
                            res.status(401).send(new Error('Unauthorized edit').message);
                        }else{
                            let query = "update comment set content=? where id=?";
                            let formated = mysql.format(query, [req.body.content, req.params.id]);

                            pool.query(formated, (err, response) => {
                                if (err)
                                    res.status(500).send(err.message);
                                else {
                                    query = 'select * from comment where id=?';
                                    formated = mysql.format(query, [req.params.id]);
                                    pool.query(formated, (err, rows) => {
                                        if (err)
                                            res.status(500).send(err.message);
                                        else {
                                            if (rows[0] === undefined)
                                                res.status(400).send(new Error('Comment doesn\'t exist').message);
                                            else {
                                                res.status(200).send(rows[0]);
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            })
        }
    }
});

route.post('/comment', [authJwt.verifyToken], (req, res) => {

    let {error} = Joi.validate(req.body, scheme);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        let query = "";
        let formatted = "";
        if(req.body.comment_id){
            query = "insert into comment (user_id, image_id, content, comment_id) values (?, ?, ?, ?)";
            formatted = mysql.format(query, [req.user.user_id, req.body.image_id, req.body.content, req.body.comment_id]);
        }else{
            query = "insert into comment (user_id, image_id, content) values (?, ?, ?)"
            formatted = mysql.format(query, [req.user.user_id, req.body.image_id, req.body.content]);
        }

        pool.query(formatted, (err, row) => {
            if (err)
                res.status(500).send(err.sqlMessage);
            else {
                let query = "select * from comment where id=?";
                let formatted = mysql.format(query, [row.insertId]);
                pool.query(formatted, (err, rows) => {
                    if(err){
                        res.status(500).send(err.sqlMessage);
                    }else{
                        res.status(200).send(rows[0]);
                    }
                });
            }
        });
    }
});

route.delete('/comment/:id', [authJwt.verifyToken], (req, res) => {
    let query = 'select * from comment where id=?';
    let formatted = mysql.format(query, [req.params.id]);
    pool.query(formatted, (err, rows) => {
        if(err){
            res.status(500).send(err.sqlMessage);
        }else{
            let comment = rows[0];
            if(comment.user_id !== req.user.user_id){
                res.status(401).send(new Error('Unauthorized delete'));
            }else {
                query = 'delete from comment where id=?';
                let formated = mysql.format(query, [req.params.id]);
                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else {
                        res.status(200).send(comment);
                    }
                });
            }
        }
    });

});

module.exports = route;
