const express = require('express');
const { mysql } = require('../utils/database');
const { pool } = require('../utils/database');
const Joi = require('joi');
const route = express.Router();
const { passport } = require('../middleware/passport')
const { authMiddleware } = require('../middleware/auth')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const saltRounds = 10

const scheme = Joi.object().keys({
    username: Joi.string().trim().min(3).max(12).required(),
    password: Joi.string().min(3).max(24).required()
})

const schemeRegister = Joi.object().keys({
    username: Joi.string().trim().min(3).max(12).required(),
    password: Joi.string().min(3).max(24).required(),
    password2: Joi.string().min(3).max(24).required(),
});

route.post("/signin", bodyParser.json(), (req, res, next) => {
    let {error} = Joi.validate(req.body, scheme);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            return res.status(400).send(err.message);
        }

        if (!user) {
            return res.status(400).send([user, "Cannot log in", info]);
        }

        req.login(user, err => {
            if(err){
                res.send(err)
            }
            let query = 'select * from user where id=?';
            let formated = mysql.format(query, user.user_id);

            pool.query(formated, (err, rows) => {
                if (err) {
                    res.status(500).send(err.sqlMessage);
                }
                else {
                    return res.send(rows[0]);
                }
            });
        });
    })(req, res, next);
});

route.post("/register", bodyParser.json(), (req, res) => {
    let {error} = Joi.validate(req.body, schemeRegister);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const {username, password, password2} = req.body;

    if(password !== password2){
        return res.status(400).send('Passwords do not match');
    }

    let query = "select * from user where username=?";
    let formated = mysql.format(query, username);

    pool.query(formated, (err, rows) => {
        if (err)
            return res.status(500).send(err.sqlMessage);
        else {
            if(rows[0] !== undefined) {
                return res.status(400).send('Username already exists')
            }
        }
    });
    let query2 = "insert into user (username, password) values (?, ?)";
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if(err){
            return res.send(err)
        }
        let formatted2 = mysql.format(query2, [username, hash]);
        pool.query(formatted2, (err, response) => {
            if (err) {
                res.status(500).send(err.sqlMessage);
            }
            else {
                res.send(response[0]);
            }
        })
    })

});

route.get("/logout", function(req, res) {
    req.logout();
    console.log("logged out");
    return res.send();
});

route.get("/user", authMiddleware, (req, res) => {
    let user = req.session.passport.user.user_id;
    let query = 'select * from user where id=?';
    let formated = mysql.format(query, user);

    pool.query(formated, (err, rows) => {
        if (err)
            res.status(500).send(err.sqlMessage);
        else {
            return res.send(rows[0]);
        }
    });
})

module.exports = route;
