import multer from "multer";
import { isEmpty } from "lodash";
import { body, validationResult } from "express-validator";
import Controller from "../utilities/Controller";

import Post from "../models/Post.model";
import User from "../models/User.model";
import Device from "../models/Device.model";
import Category from "../models/Category.model";
import Attachment from "../models/Attachment.model";

import PostService from "../services/Post";
import UserService from "../services/User";
import DeviceService from "../services/Device";
import CategoryService from "../services/Category";
import AttachmentService from "../services/Attachment";

const postService = new PostService(Post);
const userService = new UserService(User);
const deviceService = new DeviceService(Device);
const categoryService = new CategoryService(Category);
const attachmentService = new AttachmentService(Attachment);

class PostController extends Controller {
	constructor(service) {
		super(service);
		this.browseAllPosts = this.browseAllPosts.bind(this);
		this.getPostPage = this.getPostPage.bind(this);
		this.getPostsList = this.getPostsList.bind(this);
		this.getAddPosts = this.getAddPosts.bind(this);
		this.getEditPosts = this.getEditPosts.bind(this);
		this.uploadAttachment = this.uploadAttachment.bind(this);
		this.addPost = this.addPost.bind(this);
		this.editPost = this.editPost.bind(this);
		this.deletePost = this.deletePost.bind(this);
	}

	validator(method) {
		switch (method) {
		case "add post":
		case "edit post":
			return [
				body("title")
					.notEmpty()
					.withMessage("Post title can't be empty!")
					.trim()
					.escape(),
				body("content")
					.notEmpty()
					.withMessage("Post content can't be empty!")
					.trim()
					.escape(),
				body("category")
					.notEmpty()
					.withMessage("Job category can't be empty!"),
				body("tags")
					.isArray({ min: 1, max: 10 })
					.withMessage("Tags count shall be 10 tag"),
			];
		default:
			return [];
		}
	}

	async browseAllPosts(req, res, next) {
		const { query } = req;

		const recentPostsReadResponse = await this.service.readMany(
			{
				...(query?.q && {
					$or: [
						{
							title: {
								$regex:
									query.q
										.split(" ")
										.filter(Boolean)
										.join("|") || "",
								$options: "i",
							},
						},
						{
							content: {
								$regex:
									query.q
										.split(" ")
										.filter(Boolean)
										.join("|") || "",
								$options: "i",
							},
						},
					],
				}),
				...(query?.tags
					&& query.tags.length && { tags: { $in: query.tags } }),
			},
			{
				select:
					"title tags content thumbnail _id created_by created_at slug",
				populate: [
					{ path: "category", select: "name" },
					{ path: "thumbnail.sm", select: "path name _id" },
					{ path: "thumbnail.md", select: "path name _id" },
					{ path: "thumbnail.lg", select: "path name _id" },
				],
				...query,
			}
		);
		if (recentPostsReadResponse.error) {
			return next(recentPostsReadResponse.errors);
		}

		const getTrendingPostsByViewsResponse = await this.service.getTrendingPostsByViews(
			{ limit: 3, days: 30, query }
		);
		if (getTrendingPostsByViewsResponse.error) {
			return next(getTrendingPostsByViewsResponse.errors);
		}
		const trends = getTrendingPostsByViewsResponse.data.map((item) => ({
			views_count: item.views_count,
			zScore: item.zScore,
			...item.post,
		}));

		const postsTagsReadResponse = await this.service.getTags({});
		if (postsTagsReadResponse.error) {
			return next(postsTagsReadResponse.errors);
		}

		res.render("blog-list", {
			title: "Browse Blog Posts",
			...recentPostsReadResponse,
			data: {
				posts: {
					recent: recentPostsReadResponse.data,
					trends,
				},
				tags: postsTagsReadResponse.data,
			},
			query,
		});
	}

	async getPostPage(req, res, next) {
		const { slug } = req.params;
		const getSinglePostBySlugResponse = await this.service.getSinglePostPageBySlug(
			slug
		);
		if (getSinglePostBySlugResponse.error) {
			if (getSinglePostBySlugResponse.statusCode === 404) {
				return next();
			}
			return next(getSinglePostBySlugResponse.errors);
		}

		const getTrendingPostsByViewsResponse = await this.service.getTrendingPostsByViews(
			{ limit: 3, days: 7 }
		);
		if (getTrendingPostsByViewsResponse.error) {
			return next(getTrendingPostsByViewsResponse.errors);
		}
		const trends = getTrendingPostsByViewsResponse.data.map((item) => ({
			views_count: item.views_count,
			zScore: item.zScore,
			...item.post,
		}));

		const postsTagsReadResponse = await this.service.getTags({});
		if (postsTagsReadResponse.error) {
			return next(postsTagsReadResponse.errors);
		}

		// checking for user views in last month.
		const client_ip =			req.headers["x-forwarded-for"] || req.connection.remoteAddress;
		const deviceReadResponse = await deviceService.readMany(
			{
				post: getSinglePostBySlugResponse.data.post._id,
				ip: client_ip,
				"browser.name": req.useragent.browser,
				created_at: {
					$gte: new Date(
						new Date().getTime() - 1000 * 60 * 60 * 24 * 1
					), // last day
					$lte: new Date(),
				},
			},
			{ pagination: false }
		);
		if (deviceReadResponse.error) return next(deviceReadResponse.errors);

		if (deviceReadResponse.data.length < 1) {
			const devicesCreateResponse = await deviceService.create({
				post: getSinglePostBySlugResponse.data.post._id,
				ip: client_ip,
				source: req.useragent.source,
				browser: {
					name: req.useragent.browser,
					version: req.useragent.version,
				},
				os: req.useragent.os,
				platform: req.useragent.platform,
			});
			if (devicesCreateResponse.error) {
				return next(devicesCreateResponse.errors);
			}

			const postUpdateResponse = await this.service.updateOne(
				{ _id: getSinglePostBySlugResponse.data.post._id },
				{
					$inc: { "views.count": 1 },
					$addToSet: {
						"views.devices": devicesCreateResponse.data._id,
					},
				}
			);
			if (postUpdateResponse.error) {
				return next(postUpdateResponse.errors);
			}
		}

		res.render("blog-single", {
			page_title: "Blog",
			page_subtitle: "Blog post page",
			data: {
				...getSinglePostBySlugResponse.data,
				trends,
				tags: postsTagsReadResponse.data,
			},
		});
	}

	async getPostsList(req, res, next) {
		const query = {
			...(req.query?.q && {
				$or: [
					{
						title: {
							$regex:
								req.query.q
									.split(" ")
									.filter(Boolean)
									.join("|") || "",
							$options: "i",
						},
					},
					{
						content: {
							$regex:
								req.query.q
									.split(" ")
									.filter(Boolean)
									.join("|") || "",
							$options: "i",
						},
					},
				],
			}),
			...(req.user.role !== "admin" && { created_by: req.user._id }),
		};
		const options = {
			populate: [
				{
					path: "created_by",
					populate: [
						{ path: "account.picture", select: "-_id path" },
						{ path: "account.picture_sm", select: "-_id path" },
						{ path: "account.picture_md", select: "-_id path" },
						{ path: "account.picture_lg", select: "-_id path" },
					],
				},
			],
			...req.query,
		};

		const postsReadResponse = await this.service.readMany(query, options);
		if (postsReadResponse.error) return next(postsReadResponse.errors);

		if (
			!postsReadResponse.data.length
			&& postsReadResponse.offset === undefined
			&& postsReadResponse.page !== 1
		) {
			req.flash(
				"info",
				`Hey! you asked for page ${
					req.query.page || 1
				}. But that doesn't exist. So i put you on page ${
					postsReadResponse.pages
				}.`
			);
			return res
				.status(postsReadResponse.statusCode)
				.redirect(
					`/dashboard/jobs/list?page=${postsReadResponse.pages}`
				);
		}

		res.render("dashboard/blogs/list", {
			page_title: "Manage All Posts",
			...postsReadResponse,
			data: { posts: postsReadResponse.data },
			query: req.query,
		});
	}

	async getAddPosts(req, res, next) {
		const categoriesListResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				select: "id children icon name",
				populate: [
					{ path: "children", select: "name" },
					{ path: "icon", select: "name type -_id" },
				],
				pagination: false,
			}
		);
		if (categoriesListResponse.error) {
			return next(categoriesListResponse.errors);
		}

		res.render("dashboard/blogs/add", {
			page_title: "Add New Post",
			data: {
				categories: categoriesListResponse.data,
			},
		});
	}

	async getEditPosts(req, res, next) {
		const { slug } = req.params;

		const categoriesListResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				select: "id children icon name",
				populate: [
					{ path: "children", select: "name" },
					{ path: "icon", select: "name type -_id" },
				],
				pagination: false,
			}
		);
		if (categoriesListResponse.error) {
			return next(categoriesListResponse.errors);
		}

		const postReadResponse = await this.service.readOne({
			slug,
			...(req.user.role !== "admin" && { created_by: req.user._id }),
		});
		if (postReadResponse.error) return next(postReadResponse.errors);
		if (isEmpty(postReadResponse.data)) return next();

		res.render("dashboard/blogs/edit", {
			page_title: "Edit a Post",
			data: {
				categories: categoriesListResponse.data,
				post: postReadResponse.data,
			},
		});
	}

	async uploadAttachment(req, res, next) {
		const storageEngine = attachmentService.initStorageEngine({
			accept: ["image"],
			square: false,
			responsive: true,
			fileHashName: true,
			quality: 2,
			upload_path: `${
				process.env.UPLOAD_STORAGE
			}/posts/${new Date().getFullYear()}/${
				new Date().getMonth() + 1
			}/${new Date().getDate()}/${req.user._id}`,
			upload_base_path: `/${req.user._id}`,
		});

		const attachmentUpload = multer({
			storage: storageEngine,
			limits: {
				files: 1, // allow only 2 files per request
				fileSize:
					1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
			},
			fileFilter: (request, file, cb) => {
				// supported image file mimeTypes
				const isFileTypeValid = storageEngine.options.accept.includes(
					file.mimetype.split("/")[0]
				);
				if (isFileTypeValid) {
					// allow supported image files
					cb(null, true);
				} else {
					// throw error for invalid files
					cb(new Error("That fileType isn't allowed! "));
				}
			},
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
					select: "id children icon name",
					populate: [
						{ path: "children", select: "name" },
						{ path: "icon", select: "name type -_id" },
					],
					pagination: false,
				}
			);
			if (categoriesListResponse.error) {
				return next(categoriesListResponse.errors);
			}

			return res.render("dashboard/blogs/add", {
				page_title: "Add new Post",
				data: {
					old: req.body,
					categories: categoriesListResponse.data,
				},
			});
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${
				port ? `:${port}` : ""
			}`;

			const files = attachmentService.handelFilesForDBCreation(
				req.body.files,
				base
			)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(
					files[i]
				);
				if (fileCreationResponse.error) {
					return next(fileCreationResponse.errors);
				}
				savedAttachments.push(fileCreationResponse.data);
			}

			req.body = {
				...req.body,
				"thumbnail.lg": attachmentService.options.responsive
					? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id
					: null,
				"thumbnail.md": attachmentService.options.responsive
					? savedAttachments.filter((file) => file.path.match(/^(.+?)_md\.(.+)$/i))[0]._id
					: null,
				"thumbnail.sm": attachmentService.options.responsive
					? savedAttachments.filter((file) => file.path.match(/^(.+?)_sm\.(.+)$/i))[0]._id
					: null,
			};
		}

		req.body = {
			...req.body,
			tags: req.body.tags.filter(Boolean), // remove null values from array
			created_by: req.user._id,
		};

		const postCreateResponse = await this.service.create(req.body);
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
		res.status(postCreateResponse.statusCode).redirect(
			"/dashboard/posts/list"
		);
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
					select: "id children icon name",
					populate: [
						{ path: "children", select: "name" },
						{ path: "icon", select: "name type -_id" },
					],
					pagination: false,
				}
			);
			if (categoriesListResponse.error) {
				return next(categoriesListResponse.errors);
			}

			const postReadResponse = await this.service.readOne({
				slug,
				...(req.user.role !== "admin" && { created_by: req.user._id }),
			});
			if (postReadResponse.error) return next(postReadResponse.errors);
			if (isEmpty(postReadResponse.data)) return next();

			return res.render("dashboard/blogs/edit", {
				page_title: "Edit a Post",
				data: {
					old: req.body,
					post: postReadResponse.data,
					categories: categoriesListResponse.data,
				},
			});
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${
				port ? `:${port}` : ""
			}`;

			const files = attachmentService.handelFilesForDBCreation(
				req.body.files,
				base
			)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(
					files[i]
				);
				if (fileCreationResponse.error) {
					return next(fileCreationResponse.errors);
				}
				savedAttachments.push(fileCreationResponse.data);
			}

			req.body = {
				...req.body,
				"thumbnail.lg": attachmentService.options.responsive
					? savedAttachments.filter((file) => file.path.match(/^(.+?)_lg\.(.+)$/i))[0]._id
					: null,
				"thumbnail.md": attachmentService.options.responsive
					? savedAttachments.filter((file) => file.path.match(/^(.+?)_md\.(.+)$/i))[0]._id
					: null,
				"thumbnail.sm": attachmentService.options.responsive
					? savedAttachments.filter((file) => file.path.match(/^(.+?)_sm\.(.+)$/i))[0]._id
					: null,
			};
		}

		req.body = {
			...req.body,
			created_by: req.user._id,
		};

		const { tags } = req.body;
		delete req.body.tags;

		const postUpdateResponse = await this.service.updateOne(
			{
				slug,
				...(req.user.role !== "admin" && { created_at: req.user._id }),
			},
			{
				$set: req.body,
				$addToSet: { tags },
			}
		);
		if (postUpdateResponse.error) {
			if (postUpdateResponse.statusCode === 404) return next();
			return next(postUpdateResponse.errors);
		}

		const categoryUpdateResponse = await categoryService.updateOne(
			{ _id: postUpdateResponse.data.category },
			{ $addToSet: { posts: postUpdateResponse.data._id } }
		);
		if (categoryUpdateResponse.error) {
			return next(categoryUpdateResponse.errors);
		}

		const userUpdateResponse = await userService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { posts: postUpdateResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		req.flash(
			"success",
			`successfully updated ${postUpdateResponse.data.title} data.`
		);
		res.status(postUpdateResponse.statusCode).redirect(
			"/dashboard/posts/list"
		);
	}

	async deletePost(req, res, next) {
		const { id } = req.params;

		const postDeleteResponse = await this.service.deleteOne({ _id: id });
		if (postDeleteResponse.error) {
			if (postDeleteResponse.statusCode === 404) return next();
			return next(postDeleteResponse.errors);
		}

		const categoryUpdateResponse = await categoryService.updateOne(
			{ _id: postDeleteResponse.data.category },
			{ $pull: { posts: postDeleteResponse.data._id } }
		);
		if (categoryUpdateResponse.error) {
			return next(categoryUpdateResponse.errors);
		}

		const userUpdateResponse = await userService.updateOne(
			{ _id: postDeleteResponse.data.created_by },
			{ $pull: { posts: postDeleteResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		const attachments_ids = [
			postDeleteResponse.data.thumbnail.lg,
			postDeleteResponse.data.thumbnail.md,
			postDeleteResponse.data.thumbnail.sm,
		];

		const attachmentDeleteResponse = await attachmentService.deleteMany({
			_id: { $in: attachments_ids },
		});
		if (attachmentDeleteResponse.error) {
			return next(attachmentDeleteResponse.errors);
		}

		const attachmentFilesDeleteResponse = await attachmentService.handelFilesForDirDeletion(
			attachmentDeleteResponse.data.map((current) => current.path)
		);
		if (attachmentFilesDeleteResponse.error) {
			return next(attachmentFilesDeleteResponse.errors);
		}

		// Delete all views documents
		const devicesDeleteResponse = await deviceService.deleteMany({
			post: postDeleteResponse.data._id,
		});
		if (devicesDeleteResponse.error) {
			return next(devicesDeleteResponse.errors);
		}

		req.flash(
			"success",
			`${postDeleteResponse.data.title} Blog Post has been deleted!`
		);
		res.status(postDeleteResponse.statusCode).redirect("back");
	}
}

export default new PostController(postService);
