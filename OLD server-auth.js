var express = require("express");
var jwt = require("jwt-simple");
var _ = require("lodash");
var bcrypt = require("bcrypt");
var User = require("./models/user");

var app = express();
app.use(require("body-parser").json());

var users = [{
		"username": "wojtazzz",
		"password": "$2a$10$09viBWIci1ag.NnouD2uv.3.Wg3RJrOsJ0i6TpcWpMaHTaDS34lXy"
	},{
		"username": "kinga",
		"password": "$2a$10$wpKh0KUyg15sQMXOZ3A0TO/ZrXXRd7FgWFazFC.diVWOzOlGQHyxu"
	}];

var secretKey = "supertajnehaslo";

app.post("/session", function (req, res, next) {
	var user = User.findOne({"username":req.body.username}).select("password").exec(function (err, user) {
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
				"username": user.username
			}, secretKey);
			res.status(200).json(token);
		});
	});
});

app.get("/user", function (req, res) {
	var token = req.headers["x-auth"];
	var user = jwt.decode(token, secretKey);
	User.findOne({"username": user.username}, function (err, user) {
		res.status(200).json(user);
	});
});

app.post("/user", function (req, res, next) {
	var user = new User({"username": req.body.username});
	bcrypt.hash(req.body.password, 10, function (err, hash) {
		user.password = hash;
		user.save(function (err, user) {
			if (err) {
				throw next(err);
			}
			res.send(201);
		});
	});
});

app.listen(3000);