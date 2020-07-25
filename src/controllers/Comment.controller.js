import { body, validationResult, sanitizeBody } from "express-validator";

import Controller from "../utilities/Controller";

import Post from "../models/Post.model";
import Device from "../models/Device.model";
import Comment from "../models/Comment.model";

import PostService from "../services/Post";
import DeviceService from "../services/Device";
import CommentService from "../services/Comment";

const postService = new PostService(Post);
const deviceService = new DeviceService(Device);
const commentService = new CommentService(Comment);

class CommentController extends Controller {
	constructor(service) {
		super(service);
	}

	validator(method) {
		switch (method) {
		case "add comment":
		case "edit comment":
			return [
				sanitizeBody("content"),
				body("content")
					.notEmpty()
					.withMessage("Comment's content can't be empty!")
					.isLength({ max: 500 })
					.withMessage("Comment's content exceeds the limit of 500 letter!")
					.trim()
			];
		default:
			return [];
		}
	}

	async addComment(req, res, next) {
		const { id: post_id, parent = null } = req.params;
		const client_ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			return res.redirect("back");
		}

		// TODO:
		// 1- create new comment document. [DONE]
		// 3- make sure if the comment is parent or it's a replay to another comment. [Important]
		// 4- create device document with the user device information. [DONE]
		// 4- update the comment document to add device document id. [DONE]
		// 5- add comment document id to the post document. [DONE]
		// 5- return back to single post page. [DONE]

		// creating the comment doc.
		const commentCreateResponse = await commentService.create({
			...req.body,
			created_by: req.user._id,
			post: post_id,
			...(parent && { parent: [parent] })
		});
		if (commentCreateResponse.error) return next(commentCreateResponse.errors);

		// creating the device doc where the comment added from.
		const deviceCreateResponse = await deviceService.create({
			ip: client_ip,
			source: req.useragent.source,
			browser: { name: req.useragent.browser, version: req.useragent.version },
			os: req.useragent.os,
			platform: req.useragent.platform
		});
		if (deviceCreateResponse.error) return next(deviceCreateResponse.errors);

		// Adding the device doc _id to the comment doc.
		const commentUpdateResponse = await commentService.updateOne(
			{ _id: commentCreateResponse.data._id },
			{ $set: { created_from: deviceCreateResponse.data._id } }
		);
		if (commentUpdateResponse.error) return next(commentUpdateResponse.errors);

		// Adding the comment doc _id to the post doc.
		const postUpdateResponse = await postService.updateOne(
			{ _id: post_id },
			{ $push: { comments: commentCreateResponse.data._id } }
		);
		if (postUpdateResponse.error) return next(postUpdateResponse.errors);

		res.redirect("back");
	}

	async editComment(req, res) {
		res.json({ title: "edit comment page" });
	}

	async deleteComment(req, res) {
		res.json({ title: "delete comment page" });
	}
}

export default new CommentController(commentService);
