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

exports.updateProfile = function (req, res, next) {
    if (req.body.id) {
        return User.findById(req.body.id, function (err, user) {
            if (err) {
                return res.status(500).send(err);
            }
            if (!user) {
                return res.status(404).send();
            }
            _.extend(user, req.body.user);
            return user.save(function (err) {
                if (err) {
                    return res.status(500).send(err);
                }
                return res.send(user);
            });
        });
    }
    return res.status(400).send('No user id specified');
};

exports.delete = function (req, res, next) {
    if (req.body.id) {
        return User.findByIdAndRemove(req.body.id, function (err, doc) {
            if (err) {
                return res.status(500).send(err);
            }
            return res.send(doc);
        });
        // console.log('Delete user ' + req.body.id);
    }
    return res.status(400).send('No user specified')
};

exports.unlinkAccount = function (req, res, next) {
    if (req.body.id && req.body.type) {
        return User.findById(req.body.id, function (err, user) {
            if (user[req.body.type]) {
                user[req.body.type] = null;
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
    return res.status(400).send('No user/token type specified');
}