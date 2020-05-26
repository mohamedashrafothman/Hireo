import multer from "multer";
import { isEmpty } from "lodash";
import { body, validationResult, sanitizeBody } from "express-validator";
import Controller from "../utilities/Controller";

import Post from "../models/Post.model";
import User from "../models/User.model";
import Category from "../models/Category.model";
import Attachment from "../models/Attachment.model";

import PostService from "../services/Post";
import UserService from "../services/User";
import CategoryService from "../services/Category";
import AttachmentService from "../services/Attachment";

const postService = new PostService(Post);
const userService = new UserService(User);
const categoryService = new CategoryService(Category);
const attachmentService = new AttachmentService(Attachment);

class PostController extends Controller {
	constructor(service) {
		super(service);
	}

	validator(method) {
		switch (method) {
		case "add post":
		case "edit post":
			return [
				sanitizeBody("title"),
				sanitizeBody("content"),
				body("title").notEmpty().withMessage("Post title can't be empty!").trim(),
				body("content").notEmpty().withMessage("Post content can't be empty!").trim(),
				body("category").notEmpty().withMessage("Job category can't be empty!"),
				body("tags").isArray({ min: 1, max: 10 }).withMessage("Tags count shall be between 1 and 10"),
			];
		default:
			return [];
		}
	}

	async getAllPosts(req, res) {
		return res.json({
			title: "index posts list"
		});
	}

	async getPostBySlug(req, res) {
		return res.json({
			title: "get post by slug"
		});
	}

	async getPostsList(req, res, next) {
		const query = {
			...(req.query?.q && {
				$or: [
					{ title: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ content: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } }
				]
			}),
			...(req.user.role !== "admin" && { created_by: req.user._id })
		};
		const options = {
			populate: [
				{
					path: "created_by",
					populate: [
						{ path: "account.picture", select: "-_id path" },
						{ path: "account.picture_sm", select: "-_id path" },
						{ path: "account.picture_md", select: "-_id path" },
						{ path: "account.picture_lg", select: "-_id path" }
					]
				}
			],
			...req.query
		};

		const postsReadResponse = await postService.readMany(query, options);
		if (postsReadResponse.error) return next(postsReadResponse.errors);

		if (!postsReadResponse.data.length && postsReadResponse.offset === undefined && postsReadResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${postsReadResponse.pages}.`);
			return res.status(postsReadResponse.statusCode).redirect(`/dashboard/jobs/list?page=${postsReadResponse.pages}`);
		}

		res.render("dashboard/blogs/list", {
			page_title: "Manage All Posts",
			...postsReadResponse,
			data: { posts: postsReadResponse.data },
			query: req.query
		});
	}

	async getAddPosts(req, res, next) {
		const categoriesListResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				select: "id childs icon name",
				populate: [{ path: "childs", select: "name" }, { path: "icon", select: "name type -_id" }],
				pagination: false
			}
		);
		if (categoriesListResponse.error) return next(categoriesListResponse.errors);

		res.render("dashboard/blogs/add", {
			page_title: "Add New Post",
			data: {
				categories: categoriesListResponse.data
			}
		});
	}

	async getEditPosts(req, res, next) {
		const { slug } = req.params;

		const categoriesListResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				select: "id childs icon name",
				populate: [{ path: "childs", select: "name" }, { path: "icon", select: "name type -_id" }],
				pagination: false
			}
		);
		if (categoriesListResponse.error) return next(categoriesListResponse.errors);

		const postReadResponse = await postService.readOne({
			slug,
			...(req.user.role !== "admin" && { created_by: req.user._id })
		});
		if (postReadResponse.error) return next(postReadResponse.errors);
		if (isEmpty(postReadResponse.data)) return next();

		res.render("dashboard/blogs/edit", {
			page_title: "Edit a Post",
			data: {
				categories: categoriesListResponse.data,
				post: postReadResponse.data
			}
		});
	}

	async uploadAttachment(req, res, next) {
		const storageEngine = attachmentService.initStorageEngine({
			accept: ["image"],
			square: false,
			responsive: true,
			fileHashName: true,
			quality: 2,
			upload_path: `${process.env.UPLOAD_STORAGE}/posts/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${req.user._id}`,
			upload_base_path: `/${req.user._id}`
		});

		const attachmentUpload = multer({
			storage: storageEngine,
			limits: {
				files: 1, // allow only 2 files per request
				fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
			},
			fileFilter: (request, file, cb) => {
				// supported image file mimetypes
				const isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);
				if (isFileTypeValid) {
					// allow supported image files
					cb(null, true);
				} else {
					// throw error for invalid files
					cb(new Error("That fileType isn't allowed! "));
				}
			}
		});

		attachmentUpload.array("thumbnail")(req, res, async (err) => {
			if (err) {
				req.flash("error", err.message);
				return res.redirect("back");
			}
			req.body.files = req.files;
			next();
		});
	}

	async addPost(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			const categoriesListResponse = await categoryService.readMany(
				{ parent: { $size: 0 } },
				{
					select: "id childs icon name",
					populate: [{ path: "childs", select: "name" }, { path: "icon", select: "name type -_id" }],
					pagination: false
				}
			);
			if (categoriesListResponse.error) return next(categoriesListResponse.errors);

			return res.render("dashboard/blogs/add", {
				page_title: "Add new Post",
				data: {
					old: req.body,
					categories: categoriesListResponse.data
				}
			});
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = attachmentService.handelFilesForDBCreation(req.body.files, base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}

			req.body = {
				...req.body,
				thumbnail_lg: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id : null,
				thumbnail_md: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_md\.(.+)$/i))[0]._id : null,
				thumbnail_sm: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_sm\.(.+)$/i))[0]._id : null,
				thumbnail: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id : savedAttachments[0]._id
			};
		}

		req.body = {
			...req.body,
			created_by: req.user._id
		};

		const postCreateResponse = await postService.create(req.body);
		if (postCreateResponse.error) return next(postCreateResponse.errors);

		const categoryUpdatedResponse = await categoryService.updateOne(
			{ _id: postCreateResponse.data.category },
			{ $addToSet: { posts: postCreateResponse.data._id } }
		);
		if (categoryUpdatedResponse.error) return categoryUpdatedResponse;

		const updatedUserResponse = await userService.updateOne(
			{ _id: postCreateResponse.data.created_by },
			{ $addToSet: { posts: postCreateResponse.data._id } }
		);
		if (updatedUserResponse.error) return updatedUserResponse;

		req.flash("success", "New Post added successfully");
		res.status(postCreateResponse.statusCode).redirect("/dashboard/posts/list");
	}

	async editPost(req, res, next) {
		const { slug } = req.params;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);

			const categoriesListResponse = await categoryService.readMany(
				{ parent: { $size: 0 } },
				{
					select: "id childs icon name",
					populate: [{ path: "childs", select: "name" }, { path: "icon", select: "name type -_id" }],
					pagination: false
				}
			);
			if (categoriesListResponse.error) return next(categoriesListResponse.errors);

			const postReadResponse = await postService.readOne({
				slug,
				...(req.user.role !== "admin" && { created_by: req.user._id })
			});
			if (postReadResponse.error) return next(postReadResponse.errors);
			if (isEmpty(postReadResponse.data)) return next();

			return res.render("dashboard/blogs/edit", {
				page_title: "Edit a Post",
				data: {
					old: req.body,
					post: postReadResponse.data,
					categories: categoriesListResponse.data
				}
			});
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = attachmentService.handelFilesForDBCreation(req.body.files, base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}

			req.body = {
				...req.body,
				thumbnail_lg: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id : null,
				thumbnail_md: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_md\.(.+)$/i))[0]._id : null,
				thumbnail_sm: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_sm\.(.+)$/i))[0]._id : null,
				thumbnail: attachmentService.options.responsive ? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id : savedAttachments[0]._id
			};
		}

		req.body = {
			...req.body,
			created_by: req.user._id
		};

		const postUpdateResponse = await postService.updateOne(
			{ slug, ...(req.user.role !== "admin" && { created_at: req.user._id }) },
			{ $set: req.body }
		);
		if (postUpdateResponse.error) {
			if (postUpdateResponse.statusCode === 404) return next();
			return next(postUpdateResponse.errors);
		}

		const categoryUpdateResponse = await categoryService.updateOne(
			{ _id: postUpdateResponse.data.category },
			{ $addToSet: { posts: postUpdateResponse.data._id } }
		);
		if (categoryUpdateResponse.error) return next(categoryUpdateResponse.errors);

		const userUpdateResponse = await userService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { posts: postUpdateResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		req.flash("success", `successfully updated ${postUpdateResponse.data.title} data.`);
		res.status(postUpdateResponse.statusCode).redirect("/dashboard/posts/list");
	}

	async deletePost(req, res, next) {
		const { id } = req.params;

		const postDeleteResponse = await postService.deleteOne({ _id: id });
		if (postDeleteResponse.error) {
			if (postDeleteResponse.statusCode === 404) return next();
			return next(postDeleteResponse.errors);
		}

		const categoryUpdateResponse = await categoryService.updateOne(
			{ _id: postDeleteResponse.data.category },
			{ $pull: { posts: postDeleteResponse.data._id } }
		);
		if (categoryUpdateResponse.error) return next(categoryUpdateResponse.errors);

		const userUpdateResponse = await userService.updateOne(
			{ _id: postDeleteResponse.data.created_by },
			{ $pull: { posts: postDeleteResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		const attachments_ids = [
			postDeleteResponse.data.thumbnail,
			postDeleteResponse.data.thumbnail_lg,
			postDeleteResponse.data.thumbnail_md,
			postDeleteResponse.data.thumbnail_sm
		];

		const attachmentDeleteResponse = await attachmentService.deleteMany({ _id: { $in: attachments_ids } });
		if (attachmentDeleteResponse.error) return next(attachmentDeleteResponse.errors);

		const attachmentFilesDeleteResponse = await attachmentService.handelFilesForDirDeletion(
			attachmentDeleteResponse.data.map((current) => current.path)
		);
		if (attachmentFilesDeleteResponse.error) return next(attachmentFilesDeleteResponse.errors);

		req.flash("success", `${postDeleteResponse.data.title} Blog Post has been deleted!`);
		res.status(postDeleteResponse.statusCode).redirect("back");
	}
}

export default new PostController(postService);
