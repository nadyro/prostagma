var mongoose = require('mongoose');

function db_connect() {
    mongoose.connect('mongodb://localhost/prostagma', { useNewUrlParser: true });
    var db = mongoose.connection;
    return (db);
}
exports.connect = async function (req, res) {
    var authResults;
    try {
        mongoose.connect('mongodb://localhost/prostagma', { useNewUrlParser: true });
        var db = mongoose.connection;
        console.log(req.body);
        console.log("Attempting to login...");
        db.on('error', function (err) {
            console.error(err);
        });
        db.once('open', function (success) {
            var collection = db.collection('users');
            collection.findOne({ email: req.body.email }, (function (err, docs) {
                if (docs) {
                    console.log(docs.password);
                    if (docs.password === req.body.password) {
                        console.log("Login Successful");
                        authResults = {
                            expiresIn: 7200,
                            accessToken: 'fdp',
                            user: docs
                        }
                        return (res.status(200).json({
                            status: 200,
                            authResults: authResults
                        }));
                    }
                }
                else {
                    console.log("This email doesn't exist in our database.");
                    authResults = 0;
                }
                db.close();
            }))
        })
        // return (res.status(200).json({
        //     status: 200,
        //     authResults: authResults
        // }));
    }
    catch (e) {
        throw Error(e);
    }
}
exports.getUserByEmail = async function (req, res) {
    try {
        var db = db_connect();
        db.on('error', function (err) {
            console.error(err);
        });
        db.once('open', function (success) {
            console.log(req.body)
            var collection = db.collection('users');
            collection.findOne({ email: req.body.email }, function (err, docs) {
                if (docs) {
                    console.log(docs);
                    return (res.status(200).json({
                        status: 200,
                        user: docs
                    }))
                }
                else {
                    return (res.status(400).json({
                        status: 400,
                        message: 'User not found'
                    }))
                }
            })
        })
    }
    catch (e) {
        throw Error(e);
    }
}
exports.getUsers = async function (req, res) {
    try {
        var db = db_connect();
        db.on('error', function (err) {
            console.error(err);
        });
        db.once('open', function (success) {
            console.log(req.body);
            var collection = db.collection('users');
            var docs = collection.find({}).toArray(function (err, docs) {
                if (docs) {
                    console.log(docs);
                    return (res.status(200).json({
                        status: 200,
                        users: docs
                    }))
                }
                else {
                    return (res.status(400).json({
                        status: 400,
                        message: 'Something went wrong'
                    }));
                }
            });
        })
    }
    catch (e) {
        throw Error(e);
    }
}
exports.saveUser = async function (req, res) {
    try {
        console.log(req.body);
        mongoose.connect('mongodb://localhost/prostagma', { useNewUrlParser: true });
        var db = mongoose.connection;
        db.on('error', function (err) {
            console.error(err);
        });
        db.once('open', function (success) {
            console.log('connected');
        });
        var Schema = mongoose.Schema;
        var userSchema = new Schema({
            name: String,
            surname: String,
            email: String,
            password: String,
            birthday: Date,
            gender: Number,
            gender_specified: String,
            address: String,
            zip: Number,
            city: String,
            username: String
        })
        var User = mongoose.model('User', userSchema);
        var newUser = new User({
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password,
            birthday: req.body.birthday,
            gender: req.body.gender,
            gender_specified: req.body.gender_specified,
            address: req.body.address,
            zip: req.body.zip,
            city: req.body.city,
            username: req.body.username
        })
        newUser.save(function (err, data) {
            if (err) {
                console.error(err);
            }
            else {
                console.log('Saved : ', data);
            }
        })
    }
    catch (e) {
        throw Error(e);
    }
}