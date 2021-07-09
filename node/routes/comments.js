const express = require('express');
const Joi = require('joi');
const { mysql } = require('../utils/database');
const authJwt = require("../middleware/authJwt");
const { cloudinary } = require('../utils/cloudinary');

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

const getChildren = (id) => {
    let query = 'select comment.*, user.username, user.path from comment left join user on comment.user_id = user.id where comment.comment_id=? order by comment.id desc'
    let formatted = mysql.format(query, id)
    return new Promise((resolve, reject) => {
        pool.query(formatted, (err, rows) => {
            if(err){
                reject(err);
            }else{
                for(const row of rows){
                    if(row.path && row.path.length > 0){
                        row.path = cloudinary.url(row.path);
                    }
                }
                resolve(rows);
            }
        })
    })
}

/**
 * used for comment pagination
 * query param :id is the id of the image that the comments belong to
 * query param :startId is the last id from the previous page, this way even on deletes or inserts page order is maintained
 * for first request pass in startId = 0
 * query param :size is the number of elements that will be returned
 */
route.get('/image/paginated/:id/:startId/:size',   (req, res) => {
    let size = req.params.size;
    let start = req.params.startId;
    let query = "";
    let formatted = "";
    if(parseInt(start) === 0){
        query = 'select c.*, u.username, u.path from comment c left join user u on c.user_id = u.id where c.image_id=? and c.comment_id is null order by c.id desc limit ?';
        formatted = mysql.format(query, [req.params.id, parseInt(size)]);
    }else{
        query = 'select c.*, u.username, u.path from comment c left join user u on c.user_id = u.id where c.image_id=? and c.comment_id is null and c.id<? order by c.id desc limit ?';
        formatted = mysql.format(query, [req.params.id, parseInt(start), parseInt(size)]);
    }
    pool.query(formatted, async (err, rows) => {
        if (err) {
            res.status(500).send(err.sqlMessage);
        }
        else {
            //get user info for each comment
            //get all children for each parent comment
            for(const row of rows){
                if(row.path && row.path.length > 0){
                    row.path = cloudinary.url(row.path);
                }
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
    let query = 'select c.*, u.username, u.path from comment c left join user u on u.id = c.user_id where c.id=?';
    let formated = mysql.format(query, [req.params.id]);
    pool.query(formated, async (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            if(rows[0].path && rows[0].path.length > 0){
                rows[0].path = cloudinary.url(rows[0].path);
            }
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
                                    query = 'select c.*, u.username, u.path from comment c left join user u on u.id = c.user_id where c.id=?';
                                    formated = mysql.format(query, [req.params.id]);
                                    pool.query(formated, (err, rows) => {
                                        if (err)
                                            res.status(500).send(err.message);
                                        else {
                                            if (rows[0] === undefined)
                                                res.status(400).send(new Error('Comment doesn\'t exist').message);
                                            else {
                                                if(rows[0].path && rows[0].path.length > 0){
                                                    rows[0].path = cloudinary.url(rows[0].path);
                                                }
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
                let query = "select c.*, u.username, u.path from comment c left join user u on c.user_id=u.id where c.id=?";
                let formatted = mysql.format(query, [row.insertId]);
                pool.query(formatted, (err, rows) => {
                    if(err){
                        res.status(500).send(err.sqlMessage);
                    }else{
                        if(rows[0].path && rows[0].path.length>0){
                            rows[0].path = cloudinary.url(rows[0].path);
                        }
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
            if(comment === undefined){
                return res.status(404).send("Comment doesn't exist");
            }
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
