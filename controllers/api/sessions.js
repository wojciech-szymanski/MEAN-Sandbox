var User = require("../../models/user");
var router = require("express").Router();
var bcrypt = require("bcrypt");
var jwt = require("jwt-simple");
var config = require("../../config");

router.post("/", function (req, res, next) {
	var user = User.findOne({"username":req.body.username}).select("password").select("username").exec(function (err, user) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.send(401);
		}
		bcrypt.compare(req.body.password, user.password, function (err, valid) {
			if (err) {
				return next(err);
			}
			if (!valid) {
				return res.send(401);
			}
			var token = jwt.encode({
				"id":user._id
			}, config.secret);
			res.status(200).json({"token":token});
		});
	});
});

module.exports = router;