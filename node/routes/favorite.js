const express = require('express');
const { mysql } = require('../utils/database');
const { authMiddleware } = require('../middleware/auth')
const authJwt = require("../middleware/authJwt");

//database setup
const { pool } = require('../utils/database');

const route = express.Router();

route.get('/all',   (req, res) => {
    let query = 'select * from favorite where user_id=?';
    let formatted = mysql.format(query, [req.user.user_id]);
    pool.query(formatted, (err, rows) => {
        if(err){
            res.status(500).send(err.sqlMessage);
        }else{
            res.send(rows);
        }
    });
});

route.post('/add', [authJwt.verifyToken], (req, res) => {

    if(req.user.user_id !== req.body.user_id){
        return res.status(401).send(new Error('Unauthorized post').message);
    }
    let query = "insert into favorite (user_id, image_id) values (?, ?)";
    let formatted = mysql.format(query, [req.body.user_id, req.body.image_id]);
    pool.query(formatted, (err, row) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            let query = "select * from favorite where user_id=? and image_id=?";
            let formatted = mysql.format(query, [req.body.user_id, req.body.image_id]);
            pool.query(formatted, (err, rows) => {
                if(err)
                    res.status(500).send(err.sqlMessage);
                else
                    res.status(200).send(rows[0]);
            });
        }
    });
});

/**
 * Deletes the favorite matching userId and imageId parameters
 */
route.delete('/:userId/:imageId', [authJwt.verifyToken], (req, res) => {
    let query = 'select * from favorite where user_id=? and image_id=?';
    let formatted = mysql.format(query, [req.params.userId, req.params.imageId]);
    pool.query(formatted, (err, rows) => {
        if(err){
            res.status(500).send(err.sqlMessage);
        }else{
            let favorite = rows[0];
            if(favorite.user_id !== req.user.user_id){
                res.status(401).send(new Error('Unauthorized delete'));
            }else {
                query = 'delete from favorite where user_id=? and image_id=?';
                let formated = mysql.format(query, [req.params.userId, req.params.imageId]);
                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else {
                        res.status(200).send(favorite);
                    }
                });
            }
        }
    });

});

module.exports = route;
