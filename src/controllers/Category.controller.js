import multer from "multer";
import { body, validationResult, sanitizeBody } from "express-validator";
import Controller from "../utilities/Controller";

import CategoryService from "../services/Category";
import IconService from "../services/Icon";
import AttachmentService from "../services/Attachment";

import Category from "../models/Category.model";
import Icon from "../models/Icon.model";
import Attachment from "../models/Attachment.model";

const categoryService = new CategoryService(Category);
const iconService = new IconService(Icon);
const attachmentService = new AttachmentService(Attachment);

class CategoryController extends Controller {
	constructor(service) {
		super(service);
	}

	validator(method) {
		switch (method) {
		case "add category":
		case "edit category":
			return [
				body("name.en").notEmpty().withMessage("Skill english name can't be empty!").trim(),
				body("name.ar").notEmpty().withMessage("Skill arabic name can't be empty!").trim(),
				body("description.en").notEmpty().withMessage("Skill english description can't be empty!").trim(),
				body("description.ar").notEmpty().withMessage("Skill arabic description can't be empty!").trim(),
				body("icon").if((value, { req }) => !req.body.parent).notEmpty().withMessage("For parent categories you must add an icon."),
				sanitizeBody("name.en"),
				sanitizeBody("name.ar"),
				sanitizeBody("description.en"),
				sanitizeBody("description.ar")
			];
		default:
			return [];
		}
	}

	async getAddCategory(req, res, next) {
		const categoryReadResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{ pagination: false }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		const iconReadResponse = await iconService.readMany(
			{},
			{ pagination: false }
		);
		if (iconReadResponse.error) return next(iconReadResponse.errors);

		res.render("dashboard/categories/add", {
			page_title: "Add a Category",
			data: {
				categories: categoryReadResponse.data,
				icons: iconReadResponse.data
			}
		});
	}

	async getEditCategory(req, res, next) {
		const { slug } = req.params;
		const categoryReadResponse = await categoryService.getEditCategoryData(slug);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		const categoriesReadResponse = await categoryService.readMany(
			{ parent: { $size: 0 }, _id: { $ne: categoryReadResponse.data._id } },
			{ pagination: false }
		);
		if (categoriesReadResponse.error) return next(categoriesReadResponse.errors);

		const iconsReadResponse = await iconService.readMany(
			{},
			{ pagination: false }
		);
		if (iconsReadResponse.error) return next(iconsReadResponse.errors);

		res.render("dashboard/categories/edit", {
			page_title: "Edit a Category",
			data: {
				category: categoryReadResponse.data,
				categories: categoriesReadResponse.data,
				icons: iconsReadResponse.data,
			}
		});
	}

	async getCategoryList(req, res, next) {
		const categoryReadResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{ populate: "children icon" }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		res.render("dashboard/categories/list", {
			page_title: "Manage All Categories",
			data: {
				categories: categoryReadResponse.data
			}
		});
	}

	async uploadImage(req, res, next) {
		const storageEngine = attachmentService.initStorageEngine({
			accept: ["image"],
			square: true,
			quality: 50,
			fileHashName: true,
			upload_path: `${process.env.UPLOAD_STORAGE}/categories`,
			upload_base_path: ""
		});

		const imageUpload = multer({
			storage: storageEngine,
			limits: {
				files: 1, // allow only 1 file per request
				fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
			},
			fileFilter: (request, file, cb) => {
				// supported image file mimetypes
				const isFileTypeValid = file.mimetype.startsWith(storageEngine.options.accept);
				if (isFileTypeValid) {
					// allow supported image files
					cb(null, true);
				} else {
					// throw error for invalid files
					cb(new Error("That fileType isn't allowed! "));
				}
			}
		});

		imageUpload.single("picture")(req, res, async (err) => {
			if (err) {
				const categoryReadResponse = await categoryService.readMany(
					{ parent: { $size: 0 } },
					{ pagination: false }
				);
				if (categoryReadResponse.error) return next(categoryReadResponse.errors);

				const iconReadResponse = await iconService.readMany(
					{},
					{ pagination: false }
				);
				if (iconReadResponse.error) return next(iconReadResponse.errors);

				req.flash("error", err.message);
				return res.render("dashboard/categories/add", {
					page_title: "Add a Category",
					data: {
						old: req.body,
						categories: categoryReadResponse.data,
						icons: iconReadResponse.data
					},
					flashes: req.flash(),
				});
			}
			req.body.files = [req.file];
			next();
		});
	}

	async addCategory(req, res, next) {
		if (req.body.parent) {
			if (req.body.icon) delete req.body.icon;
			if (req.file) delete req.file;
			if (req.body.file) delete req.body.file;
		}
		if (!req.body.parent) delete req.body.parent;
		if (!req.body.icon) delete req.body.icon;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const categoryReadResponse = await categoryService.readMany(
				{ parent: { $size: 0 } },
				{ pagination: false }
			);
			if (categoryReadResponse.error) return next(categoryReadResponse.errors);

			const iconReadResponse = await iconService.readMany(
				{},
				{ pagination: false }
			);
			if (iconReadResponse.error) return next(iconReadResponse.errors);

			const err = errors.array();
			req.flash("error", err);
			return res.render("dashboard/categories/add", {
				page_title: "Add a Category",
				data: {
					old: req.body,
					categories: categoryReadResponse.data,
					icons: iconReadResponse.data
				},
				flashes: req.flash(),
			});
		}

		const savedAttachments = [];
		if (req.body.files.filter(Boolean).length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = attachmentService.handelFilesForDBCreation(req.body.files.filter(Boolean), base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}
			req.body = { ...req.body, picture: savedAttachments[0]._id };
		}

		const categoryCreationResponse = await categoryService.addCategory(req.body);
		if (categoryCreationResponse.error) {
			if (categoryCreationResponse.statusCode === 202) {
				req.flash("error", categoryCreationResponse.errors);
				return res.status(categoryCreationResponse.statusCode).redirect("/dashboard/categories/list");
			}
			return next(categoryCreationResponse.errors);
		}

		req.flash("success", "New Category added successfully");
		res.status(categoryCreationResponse.statusCode).redirect("/dashboard/categories/list");
	}

	async editCategory(req, res, next) {
		if (req.body.parent) {
			if (req.body.icon) delete req.body.icon;
			if (req.file) delete req.file;
			if (req.body.file) delete req.body.file;
		}
		if (!req.body.parent) delete req.body.parent;
		if (!req.body.icon) delete req.body.icon;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const categoryReadResponse = await categoryService.readMany(
				{ parent: { $size: 0 } },
				{ pagination: false }
			);
			if (categoryReadResponse.error) return next(categoryReadResponse.errors);

			const iconReadResponse = await iconService.readMany(
				{},
				{ pagination: false }
			);
			if (iconReadResponse.error) return next(iconReadResponse.errors);

			const err = errors.array();
			req.flash("error", err);
			return res.render("dashboard/categories/edit", {
				page_title: "Edit a Category",
				data: {
					old: req.body,
					categories: categoryReadResponse.data,
					icons: iconReadResponse.data
				},
				flashes: req.flash(),
			});
		}

		const savedAttachments = [];
		if (req.body.files.filter(Boolean).length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = attachmentService.handelFilesForDBCreation(req.body.files.filter(Boolean), base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}
			req.body = { ...req.body, picture: savedAttachments[0]._id };
		}

		if (req.body.parent) delete req.body.parent;

		const categoryUpdateResponse = await categoryService.editCategory(req.params.slug, req.body);
		if (categoryUpdateResponse.error) return next(categoryUpdateResponse.errors);

		req.flash("success", "successfully updated category.");
		res.status(categoryUpdateResponse.statusCode).redirect("/dashboard/categories/list");
	}

	async deleteCategory(req, res, next) {
		const { id } = req.params;
		const categoryDeletionResponse = await categoryService.deleteCategory(id);
		if (categoryDeletionResponse.error) return next(categoryDeletionResponse.errors);

		// return res.json(categoryDeletionResponse.data.filter((attach) => attach.picture).map((attach) => attach.picture));

		const categoryAttachmentDeleteIds = categoryDeletionResponse.data.filter((attach) => attach.picture).map((attach) => attach.picture);
		if (categoryAttachmentDeleteIds.length) {
			// Remove any attachments belongs to category from attachment colection.
			const categoryAttachmentDeleteRespose = await attachmentService.deleteMany(
				{ _id: { $in: categoryAttachmentDeleteIds } },
				{ pagination: false }
			);
			if (categoryAttachmentDeleteRespose.error) return next(categoryAttachmentDeleteRespose.errors);

			// Remove any attachments belongs to category from project folder directory.
			const categoryAttachmentDeleteFilesResponse = await attachmentService.handelFilesForDirDeletion(
				categoryAttachmentDeleteRespose.data.map((attach) => attach.path)
			);
			if (categoryAttachmentDeleteFilesResponse.error) return next(categoryAttachmentDeleteFilesResponse.errors);
		}

		req.flash("success", "Category successfully deleted");
		res.status(categoryDeletionResponse.statusCode).redirect("/dashboard/categories/list");
	}
}

export default new CategoryController(categoryService);
