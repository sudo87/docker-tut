// users.js
//
// Defines the users api. Add to a server by calling:
// require('./users')
'use strict';

// only export - adds the API to the app with the given options.
module.exports = (app, options) => {

    app.get('/users', (req, res, next) => {
        options.repository.getUsers().then((users) => {
            res.status(200).send(users.map((user) => { return {
                email: user.email,
                phoneNumber: user.phone_number
            };
            }));
        })
        .catch(next);
    });

    app.get('/search', (req,res, next) => {

        // get the email
        var email = req.query.email;
        if(!email){
            throw new Error("When searching for the user email must be specified");
        }

        // Get the user from the repo.
        options.repository.getUserByEmail(email).then((user) => {
            if(!user){
                res.status(404).send('User not found.');
            } else {
                res.status(200).send({
                    email: user.email,
                    phoneNumber: user.phone_number
                });
            }
        })
        .catch(next);
    });
};
