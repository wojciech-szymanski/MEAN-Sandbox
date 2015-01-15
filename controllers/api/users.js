var User = require("../../models/user");
var router = require("express").Router();
var bcrypt = require("bcrypt");
var jwt = require("jwt-simple");
var config = require("../../config");

router.get("/", function (req, res, next) {
	if (!req.headers["x-auth"]) {
		return res.send(401)
	}
	var token = req.headers["x-auth"];
	var auth_user = jwt.decode(token, config.secret);
	User.findOne({
		"_id": auth_user.id
	}, function (err, user) {
		if (err) {
			return next(err);
		}
		res.status(200).json(user);
	});
});

router.post("/", function (req, res, next) {
	var user = new User({"username": req.body.username});
	bcrypt.hash(req.body.password, 10, function (err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;
		user.save(function (err, user) {
			if (err) {
				return next(err);
			}
			res.send(201);
		});
	});	
});

module.exports = router;