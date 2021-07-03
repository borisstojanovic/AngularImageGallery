const passport = require('passport')
const LocalStrategy = require('passport-local')
const { mysql } = require('../utils/database')
const { pool } = require('../utils/database')
const bcrypt = require('bcrypt')

passport.use(new LocalStrategy(
    function(username, password, done) {
        let query = 'select * from user where username = ?'
        let formatted = mysql.format(query, username);
        pool.query(formatted, (err, rows) => {
            if (err) {
                return done(err)
            }
            if (rows.length === 0) {
                return done(null, false)
            }
            let hash = rows[0].password.toString()

            let id = rows[0].id

            bcrypt.compare(password, hash, (err, response) => {
                if(response === true){
                    return done(null, {user_id: id})
                }
                if(err){
                    return done(err, false)
                }
                return  done(new Error('Wrong Password'), false)
            })

        });
    }
));

passport.serializeUser(function(user_id, done) {
    done(null, user_id);
});

passport.deserializeUser(function(user_id, done) {
    done(null, user_id)
});

module.exports = { passport }