var User = require('../models/User');
var _ = require('lodash');

exports.all = function (req, res, next) {
    return User.find({}, function (err, users) {
        if (err) {
            return res.status(500).send(err);
        }
        return res.send(users);
    });
};

exports.delete = function (req, res, next) {
    if (req.body.id) {
        User.findByIdAndRemove(req.body.id, function (err, doc) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(doc);
        });
        // console.log('Delete user ' + req.body.id);
    }
};

exports.unlinkAccount = function (req, res, next) {
    if (req.body.id && req.body.type) {
        return User.findById(req.body.id, function (err, user) {
            if (user[req.body.type]) {
                delete user[req.body.type];
                user.markModified(req.body.type);
            }

            _.remove(user.tokens, { kind: req.body.type });

            user.markModified('tokens');

            user.save(function (err, u, numAffected) {

                console.log('RemoveToken ' + numAffected);

                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(u);
            });
        });
        // console.log('remove ' + req.body.type + ' token.');
    }
    return res.status(400).send();
}