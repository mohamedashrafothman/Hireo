import path from "path";
import { isEmpty } from "lodash";
import multer from "multer";
import { body, validationResult } from "express-validator";

import Controller from "../utilities/Controller";

import Job from "../models/Job.model";
import User from "../models/User.model";
import Attachment from "../models/Attachment.model";
import Application from "../models/Application.model";

import JobService from "../services/Job";
import UserService from "../services/User";
import AttachmentService from "../services/Attachment";
import ApplicationService from "../services/Application";

const jobService = new JobService(Job);
const userService = new UserService(User);
const attachmentService = new AttachmentService(Attachment);
const applicationService = new ApplicationService(Application);

class ApplicationController extends Controller {
	constructor(service) {
		super(service);
		this.getApplicationsList = this.getApplicationsList.bind(this);
		this.uploadAttachments = this.uploadAttachments.bind(this);
		this.isAppliedBefore = this.isAppliedBefore.bind(this);
		this.addApplication = this.addApplication.bind(this);
		this.changeStatus = this.changeStatus.bind(this);
		this.downloadAttachment = this.downloadAttachment.bind(this);
		this.withdrawApplication = this.withdrawApplication.bind(this);
	}

	validator(method) {
		switch (method) {
		case "add application":
		case "edit application":
			return [
				body("name")
					.notEmpty()
					.withMessage("Name can't be empty!")
					.trim()
					.escape(),
				body("email")
					.notEmpty()
					.withMessage("Email must supply an E-mail.")
					.isEmail()
					.withMessage("Email must be in an E-mail format.")
					.trim()
					.normalizeEmail(),
			];
		default:
			return [];
		}
	}

	async getApplicationsList(req, res, next) {
		const query = {
			...(req.query?.q && {
				$or: [
					{ status: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ seen_at: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "job.title": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ "created_by.email": { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } }
				]
			}),
			...(req.user && req.user.role !== "admin" && { created_by: req.user._id })
		};
		const options = {
			populate: [
				{
					path: "job",
					select: "created_by title slug status",
					populate: {
						path: "created_by",
						select: "email account.picture account.picture_sm account.picture_md account.picture_lg",
					}
				}
			],
			...req.query
		};

		const applicationReadResponse = await this.service.readMany(query, options);
		if (applicationReadResponse.error) return next(applicationReadResponse.errors);

		if (!applicationReadResponse.data.length && applicationReadResponse.offset === undefined && applicationReadResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${applicationReadResponse.pages}.`);
			return res.status(applicationReadResponse.statusCode).redirect(`/dashboard/applications/list?page=${applicationReadResponse.pages}`);
		}

		res.render("dashboard/applications/list", {
			page_title: "Manage All Applications",
			...applicationReadResponse,
			data: { applications: applicationReadResponse.data },
			query: req.query
		});
	}

	async uploadAttachments(req, res, next) {
		const storageEngine = attachmentService.initStorageEngine({
			accept: ["application", "image"],
			square: false,
			fileHashName: false,
			upload_path: `${process.env.UPLOAD_STORAGE}/applications/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${req.params.id}/${req.user._id}`,
			upload_base_path: `/${req.user._id}`
		});

		const attachmentUpload = multer({
			storage: storageEngine,
			limits: {
				files: 1, // allow only 1 files per Application
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
					cb(new Error("That fileType isn't allowed!"));
				}
			}
		});

		attachmentUpload.array("attachments")(req, res, async (err) => {
			if (err) {
				req.flash("error", err.message);
				return res.redirect("back");
			}
			req.body.files = req.files;
			next();
		});
	}

	async isAppliedBefore(req, res, next) {
		const isAppliedBeforeResponse = await this.service.isAppliedBefore(req.params.id, req.user._id);
		if (isAppliedBeforeResponse.error) return next(isAppliedBeforeResponse.errors);
		if (isAppliedBeforeResponse.data.isAppliedBefore) {
			req.flash("info", "You can't add more than one application to the job.");
			req.session.data = { old: req.body };
			return res.status(isAppliedBeforeResponse.statusCode).redirect("back");
		}

		next();
	}

	async addApplication(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			req.session.data = { old: req.body };
			return res.redirect("back");
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = attachmentService.handelFilesForDBCreation(req.body.files, base);

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await attachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data[0]);
			}
		}

		req.body = {
			...req.body,
			created_by: req.user._id,
			job: req.params.id,
			...(savedAttachments.length && { attachment: savedAttachments.map((attach) => attach._id) })
		};

		const applicationCreationResponse = await this.service.create(req.body);
		if (applicationCreationResponse.error) return next(applicationCreationResponse.errors);

		const jobUpdateResponse = await jobService.updateOne(
			{ _id: req.params.id },
			{ $addToSet: { applications: applicationCreationResponse.data._id } }
		);
		if (jobUpdateResponse.error) return next(jobUpdateResponse.errors);

		const userUpdateResponse = await userService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { applications: applicationCreationResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		req.flash("success", `Successfuly applied to ${jobUpdateResponse.data.title} Job`);
		res.status(applicationCreationResponse.statusCode).redirect("back");
	}

	async changeStatus(req, res, next) {
		const { application, job, status } = req.params;

		const applicationUpdateResponse = await this.service.updateOne(
			{ _id: application, job },
			{ $set: { status } }
		);
		if (applicationUpdateResponse.error) {
			if (isEmpty(applicationUpdateResponse.data)) return next();
			return next(applicationUpdateResponse.errors);
		}

		if (status === 4) {
			const applicationRejectResponse = await this.service.updateMany(
				{
					_id: { $ne: application },
					job,
					status: { $in: [1, 2] }
				},
				{ $set: { status: 3 } }
			);
			if (applicationRejectResponse.error) return next(applicationRejectResponse.errors);

			const jobUpdateResponse = await jobService.updateOne(
				{ _id: job, status: { $nin: [2] } },
				{ $set: { status: 2 } }
			);
			if (jobUpdateResponse.error) return next(jobUpdateResponse.errors);
		}

		let message = "";
		switch (status) {
		case "1":
			message = "Application Status has been set to Waiting.";
			break;
		case "2":
			message = "Application Status has been set to Withdrawn.";
			break;
		case "3":
			message = "Application Status has been set to Rejected.";
			break;
		case "4":
			message = "Application Status has been set to Accepted.";
			break;
		default:
			message = "Application Status has been changed successfully.";
			break;
		}

		req.flash("success", message);
		res.status(applicationUpdateResponse.statusCode).redirect("back");
	}

	async downloadAttachment(req, res, next) {
		const { attachment } = req.params;

		const attachmentReadResponse = await attachmentService.readOne({ _id: attachment });
		if (attachmentReadResponse.error) {
			if (isEmpty(attachmentReadResponse.data)) return next();
			return next(attachmentReadResponse.errors);
		}

		const storage_path_array = process.env.UPLOAD_STORAGE.split("/");
		const storage_path = storage_path_array.slice(0, storage_path_array.length - 1).join("/");
		res.download(path.resolve(__dirname, `../../${storage_path}`, attachmentReadResponse.data.path), attachmentReadResponse.data.name);
	}

	async withdrawApplication(req, res, next) {
		const { id } = req.params;

		const applicationUpdateResponse = await this.service.updateOne(
			{ _id: id, status: 1 },
			{ $set: { status: 2 } }
		);
		if (applicationUpdateResponse.error) return next(applicationUpdateResponse.errors);

		req.flash("success", "successfully withdrawn the application.");
		res.status(applicationUpdateResponse.statusCode).redirect("back");
	}
}

export default new ApplicationController(applicationService);
