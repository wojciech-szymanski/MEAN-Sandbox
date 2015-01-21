var Post = require("../../models/post");
var router = require("express").Router();
var websockets = require("../../websockets");

router.get("/api/posts", function (req, res, next) {
	Post.find()
		.populate("created_by", "username")
		.sort('-date')
		.exec(function (err, posts) {
			if (err) {
				return next(err);
			}
			res.status(200).json(posts);
		})
});

router.post("/api/posts", function (req, res, next) {
	var post = new Post({
		created_by: req.auth.id,
		body: req.body.body
	});
	post.save(function (err, post) {
		if (err) {
			return next(err);
		}
		Post.find({
				"_id": post.id
			})
			.populate("created_by", "username")
			.exec(function (err, post) {
				if (err) {
					return next(err);
				}
				websockets.broadcast("new_post", post[0]);
				res.status(201).json(post[0]);
			});
	});
});

module.exports = router;