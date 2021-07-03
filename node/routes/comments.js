const express = require('express');
const Joi = require('joi');
const { mysql } = require('../utils/database');
const { authMiddleware } = require('../middleware/auth')

//database setup
const { pool } = require('../utils/database');

const route = express.Router();

const scheme = Joi.object().keys({
    user_id: Joi.number().required(),
    image_id: Joi.number().required(),
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

route.get('/image/:id',   (req, res) => {
    let query = 'select * from comment where image_id=?';
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
route.put('/edit/:id', authMiddleware, (req, res) => {
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
                            console.log(rows[0].user_id)
                            console.log(req.user.user_id)
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
                                                res.send(rows[0]);
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

route.post('/comment', authMiddleware, (req, res) => {

    if(req.user.user_id !== req.body.user_id){
        return res.status(401).send(new Error('Unauthorized post').message);
    }
    let {error} = Joi.validate(req.body, scheme);

    if (error) {
        res.status(400).send(error.details[0].message);
    } else {
        let query = "insert into comment (user_id, image_id, content) values (?, ?, ?)";
        let formatted = mysql.format(query, [req.body.user_id, req.body.image_id, req.body.content]);
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

route.delete('/comment/:id', authMiddleware, (req, res) => {
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
