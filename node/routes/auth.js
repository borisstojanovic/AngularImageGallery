const express = require('express');
const { mysql } = require('../utils/database');
const { pool } = require('../utils/database');
const Joi = require('joi');
const fs = require('fs');
const { cloudinary } = require('../utils/cloudinary');
const route = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const config = require('../utils/auth')
let jwt = require("jsonwebtoken");
const authJwt = require("../middleware/authJwt");

//multer setup
const uploads = require('./uploads');
const images = uploads.images;

const scheme = Joi.object().keys({
    username: Joi.string().trim().min(3).max(12).required(),
    password: Joi.string().min(3).max(24).required()
})

const schemeRegister = Joi.object().keys({
    username: Joi.string().trim().min(6).max(24).required(),
    email: Joi.string().trim().min(6).max(45).required(),
    password: Joi.string().min(6).max(24).required(),
    password2: Joi.string().min(6).max(24).required(),
});

route.post("/signin", bodyParser.json(), (req, res, next) => {
    let {error} = Joi.validate(req.body, scheme);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let query = 'select * from user where username=?';
    let formatted = mysql.format(query, [req.body.username]);
    pool.query(formatted, (err, rows) => {
        if(err) return res.status(500).send("Server Error");
        else if(rows.length === 0)return res.status(404).send({message: "User Doesn't Exist!"});
        else{
            let hash = rows[0].password.toString();

            bcrypt.compare(req.body.password, hash, (err, response) => {
                if(response === true){
                    rows[0].accessToken = jwt.sign({id: rows[0].id}, config.secret, {
                        expiresIn: 86400 // 24 hours
                    });
                    res.status(200).send(rows[0]);
                }else if(err) res.status(500).send("Server Error");
                else res.status(403).send("Wrong Password")
            })
        }
    })
});

const removefile = function(path){
    fs.unlink(path, (err) => {
        if(err){
            throw new Error(err.message);
        }
    })
}

route.post("/register", images.single('image'), (req, res) => {
    let {error} = Joi.validate(req.body, schemeRegister);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }
    const {username, password, password2} = req.body;

    if(password !== password2){
        return res.status(400).json({message: "Passwords do not match!"});
    }

    let query = "select * from user where username=? or email=?";
    let formated = mysql.format(query, [username, req.body.email]);

    pool.query(formated, (err, rows) => {
        if (err)
            return res.status(500).send("Server failure!");
        else {
            if(rows[0] !== undefined) {
                if(rows[0].email === req.body.email){
                    return res.status(400).send({message: "Email already in use!"});
                }else{
                    return res.status(400).send({message: "Username already in use!"});
                }
            }else{
                let query2 = "insert into user (username, password, email, path) values (?, ?, ?, ?)";
                bcrypt.hash(password, saltRounds, async (err, hash) => {
                    if(err) return res.status(500).send(err)

                    let path = "";
                    if(req.file !== undefined){
                        path = req.file.path;
                        let uploadedResponse = null
                        await cloudinary.uploader.upload(path).then(response => {
                            uploadedResponse = response;
                            removefile(path); //posto je snimljen na cdn brisem ga iz fs-a
                            path = uploadedResponse.public_id; //postavljam path na URL koji vraca upload
                            let formatted2 = mysql.format(query2, [username, hash, req.body.email, path]);
                            pool.query(formatted2, (err, response) => {
                                if(err) res.status(500).send(err);
                                else res.status(200).send(response[0]);
                            })
                        }).catch( error => {
                            removefile(path);
                            return res.status(400).send(error);
                        })

                    }
                })
            }
        }
    });

});

route.get("/user", [authJwt.verifyToken], (req, res) => {
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
