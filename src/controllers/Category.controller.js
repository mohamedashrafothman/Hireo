import multer from "multer";
import { isEmpty } from "lodash";
import { body, validationResult } from "express-validator";
import Controller from "../utilities/Controller";

import IconService from "../services/Icon";
import CategoryService from "../services/Category";
import AttachmentService from "../services/Attachment";

class CategoryController extends Controller {
	constructor(service) {
		super(service);
		this.uploadImage = this.uploadImage.bind(this);
		this.addCategory = this.addCategory.bind(this);
		this.editCategory = this.editCategory.bind(this);
		this.getAddCategory = this.getAddCategory.bind(this);
		this.deleteCategory = this.deleteCategory.bind(this);
		this.getEditCategory = this.getEditCategory.bind(this);
		this.getCategoryList = this.getCategoryList.bind(this);
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
				body("icon")
					.if((value, { req }) => !req.body.parent)
					.notEmpty()
					.withMessage("For parent categories you must add an icon."),
			];
		default:
			return [];
		}
	}

	async getAddCategory(req, res, next) {
		const categoryReadResponse = await this.service.readMany(
			{ is_deleted: false },
			{ pagination: false, sort: { created_at: "asc" } }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		const iconReadResponse = await IconService.readMany({}, { pagination: false });
		if (iconReadResponse.error) return next(iconReadResponse.errors);

		res.render("dashboard/categories/add", {
			page_title: "Add a Category",
			data: {
				categories: categoryReadResponse.data,
				icons: iconReadResponse.data,
			},
		});
	}

	async getEditCategory(req, res, next) {
		const categoryReadResponse = await this.service.readOne({ slug: req.params.slug, is_deleted: false });
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);
		if (isEmpty(categoryReadResponse.data)) return next();

		const categoriesReadResponse = await this.service.readMany(
			{ _id: { $ne: categoryReadResponse.data._id } },
			{ pagination: false, sort: { created_at: "asc" } }
		);
		if (categoriesReadResponse.error) return next(categoriesReadResponse.errors);

		const iconsReadResponse = await IconService.readMany({}, { pagination: false });
		if (iconsReadResponse.error) return next(iconsReadResponse.errors);

		res.render("dashboard/categories/edit", {
			page_title: "Edit a Category",
			data: {
				category: categoryReadResponse.data,
				categories: categoriesReadResponse.data,
				icons: iconsReadResponse.data,
			},
		});
	}

	async getCategoryList(req, res, next) {
		const categoryReadResponse = await this.service.readMany(
			{ parent: { $exists: false } },
			{ pagination: false, sort: { created_at: "asc" } }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		res.render("dashboard/categories/list", {
			page_title: "Manage All Categories",
			data: {
				categories: categoryReadResponse.data,
			},
		});
	}

	async uploadImage(req, res, next) {
		const storageEngine = AttachmentService.initStorageEngine({
			accept: ["image"],
			square: true,
			quality: 50,
			fileHashName: true,
			upload_path: `${process.env.UPLOAD_STORAGE}/categories`,
			upload_base_path: "",
		});

		const imageUpload = multer({
			storage: storageEngine,
			limits: {
				files: 1, // allow only 1 file per request
				fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
			},
			fileFilter: (request, file, cb) => {
				// supported image file mimeTypes
				const isFileTypeValid = file.mimetype.startsWith(storageEngine.options.accept);
				if (isFileTypeValid) {
					// allow supported image files
					cb(null, true);
				} else {
					// throw error for invalid files
					cb(new Error("That fileType isn't allowed! "));
				}
			},
		});

		imageUpload.single("picture")(req, res, async (err) => {
			if (err) {
				const categoryReadResponse = await this.service.readMany(
					{},
					{ pagination: false, sort: { created_at: "asc" } }
				);
				if (categoryReadResponse.error) return next(categoryReadResponse.errors);

				const iconReadResponse = await IconService.readMany({}, { pagination: false });
				if (iconReadResponse.error) return next(iconReadResponse.errors);

				req.flash("error", err.message);
				return res.render("dashboard/categories/add", {
					page_title: "Add a Category",
					data: {
						old: req.body,
						categories: categoryReadResponse.data,
						icons: iconReadResponse.data,
					},
					flashes: req.flash(),
				});
			}
			req.body.files = [req.file];
			next();
		});
	}

	async addCategory(req, res, next) {
		if (!req.body.parent) delete req.body.parent;
		if (!req.body.icon) delete req.body.icon;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const categoryReadResponse = await this.service.readMany(
				{},
				{ pagination: false, sort: { created_at: "asc" } }
			);
			if (categoryReadResponse.error) return next(categoryReadResponse.errors);

			const iconReadResponse = await IconService.readMany({}, { pagination: false });
			if (iconReadResponse.error) return next(iconReadResponse.errors);

			const err = errors.array();
			req.flash("error", err);
			return res.render("dashboard/categories/add", {
				page_title: "Add a Category",
				data: {
					old: req.body,
					categories: categoryReadResponse.data,
					icons: iconReadResponse.data,
				},
				flashes: req.flash(),
			});
		}

		const savedAttachments = [];
		if (req.body.files.filter(Boolean).length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = AttachmentService.handelFilesForDBCreation(req.body.files.filter(Boolean), base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await AttachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}
			req.body = { ...req.body, picture: savedAttachments[0]._id };
		}

		const categoryCreationResponse = await this.service.addCategory(req.body);
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
		if (!req.body.parent) delete req.body.parent;
		if (!req.body.icon) delete req.body.icon;

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const categoryReadResponse = await this.service.readMany(
				{},
				{ pagination: false, sort: { created_at: "asc" } }
			);
			if (categoryReadResponse.error) return next(categoryReadResponse.errors);

			const iconReadResponse = await IconService.readMany({}, { pagination: false });
			if (iconReadResponse.error) return next(iconReadResponse.errors);

			const err = errors.array();
			req.flash("error", err);
			return res.render("dashboard/categories/edit", {
				page_title: "Edit a Category",
				data: {
					old: req.body,
					categories: categoryReadResponse.data,
					icons: iconReadResponse.data,
				},
				flashes: req.flash(),
			});
		}

		const savedAttachments = [];
		if (req.body.files.filter(Boolean).length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = AttachmentService.handelFilesForDBCreation(req.body.files.filter(Boolean), base)[0];

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await AttachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data);
			}
			req.body = { ...req.body, picture: savedAttachments[0]._id };
		}

		const categoryUpdateResponse = await this.service.editCategory({ slug: req.params.slug }, req.body);
		if (categoryUpdateResponse.error) return next(categoryUpdateResponse.errors);

		req.flash("success", "successfully updated category.");
		res.status(categoryUpdateResponse.statusCode).redirect("/dashboard/categories/list");
	}

	async deleteCategory(req, res, next) {
		const categoryDeletionResponse = await this.service.deleteCategory({ _id: req.params.id });
		if (categoryDeletionResponse.error) return next(categoryDeletionResponse.errors);

		req.flash("success", "Category successfully deleted");
		res.status(categoryDeletionResponse.statusCode).redirect("/dashboard/categories/list");
	}
}

export default new CategoryController(CategoryService);
