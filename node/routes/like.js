const express = require('express');
const { mysql } = require('../utils/database');
const authJwt = require("../middleware/authJwt");
const bodyParser = require('body-parser');

//database setup
const { pool } = require('../utils/database');

const route = express.Router();

route.get('/all',   (req, res) => {
    let query = 'select * from `like` where user_id=?';
    let formatted = mysql.format(query, [req.user.user_id]);
    pool.query(formatted, (err, rows) => {
        if(err){
            res.status(500).send(err.sqlMessage);
        }else{
            res.send(rows);
        }
    });
});

/**
 * Add a new like to the database or update an existing entry
 * Body params are user_id, image_id and is_like(boolean that determines if it is a like or a dislike)
 * Returns the created or updated like
 */
route.post('/add', [authJwt.verifyToken], bodyParser.json(), (req, res) => {

    if(req.user.user_id !== req.body.user_id){
        return res.status(401).send(new Error('Unauthorized post').message);
    }

    let query = "INSERT INTO `like` (user_id, image_id, is_like) VALUES(?, ?, ?) ON DUPLICATE KEY UPDATE is_like=?";
    let formatted = mysql.format(query, [req.body.user_id, req.body.image_id, req.body.is_like, req.body.is_like]);
    pool.query(formatted, (err, row) => {
        if (err) res.status(500).send(err.sqlMessage);
        else{
            let query = 'select * from `like` where user_id=? and image_id=?';
            let formatted = mysql.format(query, [req.body.user_id, req.body.image_id]);
            pool.query(formatted, (err, rows) => {
                if(err) res.status(500).send(err.sqlMessage);
                else res.status(200).send(rows[0]);
            })
        }
    });
});

/**
 * Deletes the like matching userId and imageId parameters
 * Returns the deleted like
 */
route.delete('/remove/:userId/:imageId', [authJwt.verifyToken], (req, res) => {
    let query = 'select * from `like` where user_id=? and image_id=?';
    let formatted = mysql.format(query, [req.params.userId, req.params.imageId]);
    pool.query(formatted, (err, rows) => {
        if(err){
            res.status(500).send(err.sqlMessage);
        }else{
            let like = rows[0];
            if(like.user_id !== req.user.user_id){
                res.status(401).send(new Error('Unauthorized delete'));
            }else {
                if(rows.length === 0){
                    return res.status(404).send("No Like In Database");
                }
                query = 'delete from `like` where user_id=? and image_id=?';
                let formated = mysql.format(query, [req.params.userId, req.params.imageId]);
                pool.query(formated, (err, rows) => {
                    if (err)
                        res.status(500).send(err.sqlMessage);
                    else
                        res.status(200).send(like);
                });
            }
        }
    });

});

module.exports = route;
