import multer from "multer";
import { isEmpty } from "lodash";
import { body, validationResult, sanitizeBody } from "express-validator";

import Controller from "../utilities/Controller";
import Helper from "../utilities/Helper";

import Job from "../models/Job.model";
import User from "../models/User.model";
import JobType from "../models/Job_type.model";
import Category from "../models/Category.model";
import Attachment from "../models/Attachment.model";
import Application from "../models/Application.model";

import JobService from "../services/Job";
import UserService from "../services/User";
import JobTypeService from "../services/JobTypeService";
import CategoryService from "../services/Category";
import AttachmentService from "../services/Attachment";
import ApplicationService from "../services/Application";

const jobService = new JobService(Job);
const userService = new UserService(User);
const jobTypeService = new JobTypeService(JobType);
const categoryService = new CategoryService(Category);
const attachmentService = new AttachmentService(Attachment);
const applicationService = new ApplicationService(Application);

const helper = new Helper();

class JobController extends Controller {
	constructor(service) {
		super(service);
	}

	validator(method) {
		switch (method) {
		case "add job":
		case "edit job":
			return [
				sanitizeBody("title"),
				sanitizeBody("location.address"),
				sanitizeBody("description"),
				body("title")
					.notEmpty()
					.withMessage("Job title can't be empty!"),
				body("type")
					.notEmpty()
					.withMessage("Job type can't be empty!"),
				body("category")
					.notEmpty()
					.withMessage("Job category can't be empty!"),
				body("location.address")
					.notEmpty()
					.withMessage("Job location can't be empty!"),
				body("salary.min")
					.notEmpty()
					.withMessage("Job minimum salary can't be empty!"),
				body("salary.max")
					.notEmpty()
					.withMessage("Job maximum salary can't be empty!")
					.custom((value, { req }) => Number(value) > Number(req.body["salary.min"]))
					.withMessage("Salary maxmum value can't be less than minimum value."),
				body("tags")
					.optional()
					.isArray({ min: 1, max: 10 })
					.withMessage("Skills count shall be between 1 and 10"),
			];
		default:
			return [];
		}
	}

	async getJobsLists(req, res, next) {
		const query = {
			...(req.query?.q && {
				$or: [
					{ title: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					// { status: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
					{ description: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } }
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

		const jobsListResponse = await jobService.readMany(query, options);
		if (jobsListResponse.error) return next(jobsListResponse.errors);

		if (!jobsListResponse.data.length && jobsListResponse.offset === undefined && jobsListResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${jobsListResponse.pages}.`);
			return res.status(jobsListResponse.statusCode).redirect(`/dashboard/jobs/list?page=${jobsListResponse.pages}`);
		}

		res.render("dashboard/jobs/list", {
			page_title: "Manage All Jobs",
			...jobsListResponse,
			data: { jobs: jobsListResponse.data },
			query: req.query
		});
	}

	async getAddJob(req, res, next) {
		const categoriesListResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				select: "id childs icon name",
				populate: [{ path: "childs", select: "name" }, { path: "icon", select: "name type -_id" }],
				pagination: false
			}
		);
		if (categoriesListResponse.error) return next(categoriesListResponse.errors);

		const jobTypeListResponse = await jobTypeService.readMany(
			{},
			{ select: "name", pagination: false }
		);
		if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

		res.render("dashboard/jobs/add", {
			page_title: "Post a Job",
			data: {
				jobTypes: jobTypeListResponse.data,
				categories: categoriesListResponse.data
			}
		});
	}

	async uploadAttachments(req, res, next) {
		const storageEngine = attachmentService.initStorageEngine({
			accept: ["application", "image"],
			square: false,
			fileHashName: false,
			upload_path: `${process.env.UPLOAD_STORAGE}/jobs/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${new Date().getDate()}/${req.user._id}`,
			upload_base_path: `/${req.user._id}`
		});

		const attachmentUpload = multer({
			storage: storageEngine,
			limits: {
				files: 2, // allow only 2 files per request
				fileSize: 1024 * 1024 * Number(process.env.ATTATCHMENT_MAX_SIZE_IN_MB), // 5 MB (max file size)
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

		attachmentUpload.array("attachments")(req, res, async (err) => {
			if (err) {
				req.flash("error", err.message);
				return res.redirect("back");
			}
			req.body.files = req.files;
			next();
		});
	}

	async addJob(req, res, next) {
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

			const jobTypeListResponse = await jobTypeService.readMany({}, { select: "name", pagination: false });
			if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

			return res.render("dashboard/jobs/add", {
				page_title: "Post a Job",
				data: {
					old: req.body,
					jobTypes: jobTypeListResponse.data,
					categories: categoriesListResponse.data
				}
			});
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
			...(savedAttachments.length && { attachments: savedAttachments.map((attach) => attach._id) })
		};

		const jobCreationResponse = await jobService.create(req.body);
		if (jobCreationResponse.error) return next(jobCreationResponse.errors);

		const categoryUpdatedResponse = await categoryService.updateOne(
			{ _id: jobCreationResponse.data.category },
			{ $addToSet: { jobs: jobCreationResponse.data._id } }
		);
		if (categoryUpdatedResponse.error) return categoryUpdatedResponse;

		const updatedUserResponse = await userService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { jobs: jobCreationResponse.data._id } }
		);
		if (updatedUserResponse.error) return updatedUserResponse;

		req.flash("success", "New Job added successfully");
		res.status(jobCreationResponse.statusCode).redirect("/dashboard/jobs/list");
	}

	async getEdit(req, res, next) {
		const categoriesListResponse = await categoryService.readMany(
			{ parent: { $size: 0 } },
			{
				select: "id childs icon name",
				populate: [{ path: "childs", select: "name" }, { path: "icon", select: "name type -_id" }],
				pagination: false
			}
		);
		if (categoriesListResponse.error) return next(categoriesListResponse.errors);

		const jobTypeListResponse = await jobTypeService.readMany(
			{},
			{ select: "name", pagination: false }
		);
		if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

		const jobResponse = await jobService.readOne({
			slug: req.params.slug,
			...(req.user.role !== "admin" && { created_by: req.user._id })
		});
		if (jobResponse.error) return next(jobResponse.errors);
		if (isEmpty(jobResponse.data)) return next();

		res.render("dashboard/jobs/edit", {
			page_title: "Edit a Job",
			data: {
				job: jobResponse.data,
				jobTypes: jobTypeListResponse.data,
				categories: categoriesListResponse.data
			}
		});
	}

	async editJob(req, res, next) {
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

			const jobTypeListResponse = await jobTypeService.readMany(
				{},
				{ select: "name", pagination: false }
			);
			if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

			const jobResponse = await jobService.readOne({
				slug: req.params.slug,
				...(req.user.role !== "admin" && { created_by: req.user._id })
			});
			if (jobResponse.error) return next(jobResponse.errors);
			if (isEmpty(jobResponse.data)) return next();

			return res.render("dashboard/jobs/add", {
				page_title: "Edit a Job",
				data: {
					job: jobResponse,
					jobTypes: jobTypeListResponse.data,
					categories: categoriesListResponse.data
				}
			});
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
			...(savedAttachments.length && { attachments: savedAttachments.map((attach) => attach._id) })
		};

		const jobUpdateResponse = await jobService.updateOne(
			{ slug: req.params.slug, ...(req.user.role !== "admin" && { created_by: req.user._id }) },
			{ $set: req.body }
		);
		if (jobUpdateResponse.error) {
			if (jobUpdateResponse.statusCode === 404) {
				return next();
			}
			return next(jobUpdateResponse.errors);
		}

		const categoryUpdatedResponse = await categoryService.updateOne(
			{ _id: jobUpdateResponse.data.category },
			{ $addToSet: { jobs: jobUpdateResponse.data._id } }
		);
		if (categoryUpdatedResponse.error) return next(categoryUpdatedResponse.errors);

		const userUpdateResponse = await userService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { jobs: jobUpdateResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		req.flash("success", `successfully updated ${jobUpdateResponse.data.title} data.`);
		res.redirect("/dashboard/jobs/list");
	}

	async deleteJob(req, res, next) {
		const jobDeleteResponse = await jobService.deleteOne({ _id: req.params.id });
		if (jobDeleteResponse.error) {
			if (jobDeleteResponse.statusCode === 404) return next();
			return next(jobDeleteResponse.errors);
		}

		const categoryUpdateResponse = await categoryService.updateOne(
			{ _id: jobDeleteResponse.data.category },
			{ $pull: { jobs: req.params.id } }
		);
		if (categoryUpdateResponse.error) return next(categoryUpdateResponse.errors);

		const applicationDeleteResponse = await applicationService.deleteMany({ job: req.params.id });
		if (applicationDeleteResponse.error) return next(applicationDeleteResponse.errors);

		const userUpdateResponse = await userService.updateMany(
			{
				$or: [
					{ _id: jobDeleteResponse.data.created_by },
					{
						applications: {
							$in: applicationDeleteResponse.data.map((current) => current._id)
						}
					},
					{ "bookmarked.job": req.params._id }
				]
			},
			{
				$pull: {
					jobs: req.params.id,
					applications: {
						$in: applicationDeleteResponse.data.map((current) => current._id)
					},
					"bookmarked.job": req.params.id
				}
			}
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		// concat all of job's attachments ids and applications's attachments ids
		const attachments_ids = [
			...jobDeleteResponse.data.attachments,
			...applicationDeleteResponse.data.map((application) => application.attachment)
		];
		const attachmentDeleteResponse = await attachmentService.deleteMany({ _id: { $in: attachments_ids } });
		if (attachmentDeleteResponse.error) return next(attachmentDeleteResponse.errors);

		const attachmentFilesDeleteResponse = await attachmentService.handelFilesForDirDeletion(
			attachmentDeleteResponse.data.map((current) => current.path)
		);
		if (attachmentFilesDeleteResponse.error) return next(attachmentFilesDeleteResponse.errors);

		req.flash("success", `${jobDeleteResponse.data.title} job has been deleted!`);
		res.status(jobDeleteResponse.statusCode).redirect("back");
	}

	async refreshJob(req, res, next) {
		const jobUpdateResponse = await jobService.updateOne(
			{
				_id: req.params.id,
				status: 3,
				...(req.user.role !== "admin" && { created_by: req.user._id })
			},
			{
				$set: { status: 1, expiring_at: +new Date() + 1000 * 60 * 60 * 24 * process.env.JOB_EXPERATION_TIME_IN_DAYS },
				$inc: { refresh_count: 1 }
			},
		);
		if (jobUpdateResponse.error) return next(jobUpdateResponse.errors);
		if (isEmpty(jobUpdateResponse.data)) {
			return next();
		}

		req.flash("success", `successfully refreshed ${jobUpdateResponse.data.title} job for another ${process.env.JOB_EXPERATION_TIME_IN_DAYS} days.`);
		res.redirect("back");
	}

	async getAllJobApplications(req, res, next) {
		const jobReadResponse = await jobService.readOne({ slug: req.params.slug });
		if (jobReadResponse.error) return next(jobReadResponse.errors);
		if (isEmpty(jobReadResponse.data)) return next();

		const query = { job: jobReadResponse.data._id };
		const options = {
			select: "name email status attachment job created_by",
			populate: [
				{ path: "attachment", select: "path name extname" },
				{ path: "job", select: "title slug" },
				{
					path: "created_by",
					select: "email slug is_verified account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality ",
					populate: [
						{ path: "profile.nationality", select: "name code -_id" },
						{ path: "account.picture", select: "path name" },
						{ path: "account.picture_sm", select: "path name" },
						{ path: "account.picture_md", select: "path name" },
						{ path: "account.picture_lg", select: "path name" },
					]
				}
			],
			...req.query
		};

		const applicationReadResponse = await applicationService.readMany(query, options);
		if (applicationReadResponse.error) return next(applicationReadResponse.errors);

		if (!applicationReadResponse.data.length && applicationReadResponse.offset === undefined && applicationReadResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${applicationReadResponse.pages}.`);
			return res.status(applicationReadResponse.statusCode).redirect(`/dashboard/jobs/${req.params.slug}/list?page=${applicationReadResponse.pages}`);
		}

		if (req.user && req.user.role !== "admin" && req.user._id.toString() === jobReadResponse.data.created_by.toString()) {
			// mark applications to seen by employer (job creator).
			const applicationSeenResponse = await applicationService.updateMany(
				{
					_id: { $in: applicationReadResponse.data.map((current) => current._id) },
					was_seen: false,
					job: jobReadResponse.data._id
				},
				{ $set: { was_seen: true, seen_at: +new Date() } }
			);
			if (applicationSeenResponse.error) return next(applicationSeenResponse.errors);
		}

		res.render("dashboard/jobs/candidates", {
			page_title: "Manage Candidates",
			...applicationReadResponse,
			data: { job: jobReadResponse.data, applications: applicationReadResponse.data },
			query: req.query
		});
	}

	async browseAllJobs(req, res, next) {
		const categoryReadResponse = await categoryService.readMany(
			{
				...(
					req.query.categories
					&& req.query.categories.length
					&& { $or: [{ _id: { $in: req.query.categories } }, { parent: { $elemMatch: { $in: req.query.categories } } }] }
				)
			},
			{ select: "_id", pagination: false }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.erros);

		const query = {
			is_published: true,
			category: {
				$in: categoryReadResponse.data.map((category) => category._id)
			},
			...(
				req.query.long
				&& req.query.lat
				&& {
					location: {
						$geoWithin: {
							$centerSphere: [
								[Number(req.query.long), Number(req.query.lat)], helper.kmToRadian(process.env.LOCATION_RANGE_IN_KM)
							]
						}
					}
				}), // 10KM / Earth Radius In Miles
			...(
				req.query.keywords
				&& req.query.keywords.filter(Boolean).length
				&& {
					$or: [{
						title: {
							$regex: req.query.keywords.filter(Boolean).join("|") || "",
							$options: "i"
						}
					}, {
						description: {
							$regex: req.query.keywords.filter(Boolean).join("|") || "",
							$options: "i"
						}
					}]
				}),
			...(
				req.query.salary
				&& {
					"salary.min": {
						$gte: Number(req.query.salary.split(",")[0])
					},
					"salary.max": {
						$lte: Number(req.query.salary.split(",")[1])
					}
				}),
			...(
				req.query.job_types
				&& req.query.job_types.length
				&& {
					type: {
						$in: req.query.job_types
					}
				}),
			...(
				req.query.tags
				&& req.query.tags.length
				&& {
					tags: {
						$in: req.query.tags
					}
				})
		};
		const options = {
			select: "slug title status created_at category location type.name created_by.account.name created_by.is_verified created_by.account.picture created_by.account.picture_sm created_by.account.picture_md created_by.account.picture_lg",
			populate: [
				{ path: "created_by", populate: [{ path: "account.picture", select: "path -_id" }, { path: "account.picture_sm", select: "path -_id" }, { path: "account.picture_md", select: "path -_id" }, { path: "account.picture_lg", select: "path -_id" }] },
				{ path: "type" },
				{ path: "category" }
			],
			...req.query
		};


		const jobReadResponse = await jobService.readMany(query, options);
		if (jobReadResponse.error) return next(jobReadResponse.errors);
		// return res.json(jobReadResponse);

		if (!jobReadResponse.data.length && jobReadResponse.offset === undefined && jobReadResponse.page !== 1) {
			req.flash("info", `Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${jobReadResponse.pages}.`);
			return res.status(jobReadResponse.statusCode).redirect(`/browse/jobs/${jobReadResponse.pages}`);
		}

		const jobTypeReadResponse = await jobTypeService.readMany(
			{},
			{ select: "name", pagination: false }
		);
		if (jobTypeReadResponse.error) return next(jobTypeReadResponse.errors);

		const jobTagsResponse = await jobService.getTags({});
		if (jobTagsResponse.error) return next(jobTagsResponse.errors);

		const jobMinMaxResponse = await jobService.getMinMax({});
		if (jobMinMaxResponse.error) return next(jobMinMaxResponse.errors);

		res.render("jobs-list", {
			page_title: "Browse Jobs",
			...jobReadResponse,
			query: req.query,
			full_url: helper.fullUrl(req),
			data: {
				jobTypes: jobTypeReadResponse.data,
				tags: jobTagsResponse.data,
				min_price: jobMinMaxResponse?.data[0]?.minValue || 0,
				max_price: jobMinMaxResponse?.data[0]?.maxValue || 1,
				jobs: jobReadResponse.data
			},
		});
	}

	async getJobPage(req, res, next) {
		const old = req.session.data?.old || null;
		req.session.data = null;

		const jobReadBySlugResponse = await jobService.getBySlug(req.params.slug, req.user);
		if (jobReadBySlugResponse.error) {
			if (jobReadBySlugResponse.statusCode === 404) return next();
			return next(jobReadBySlugResponse.errors);
		}

		const categoryReadResponse = await categoryService.readMany(
			{
				$or: [
					{ _id: jobReadBySlugResponse.data.category._id },
					{ parent: { $elemMatch: { $in: jobReadBySlugResponse.data.category.parent } } }
				]
			},
			{ select: "_id", pagination: false }
		);
		if (categoryService.error) return next(categoryReadResponse.errors);

		const jobRelatedResponse = await jobService.readMany(
			{
				_id: { $ne: jobReadBySlugResponse.data._id },
				$or: [
					{
						category: {
							$in: categoryReadResponse.data.map((category) => category._id)
						}
					},
					{ type: jobReadBySlugResponse.data.type._id },
					{ location: { $geoWithin: { $centerSphere: [[jobReadBySlugResponse.data.location.coordinates[0], jobReadBySlugResponse.data.location.coordinates[1]], helper.kmToRadian(process.env.LOCATION_RANGE_IN_KM)] } } },
					{ tags: { $in: jobReadBySlugResponse.data.tags } },
					{ "salary.min": { $gte: jobReadBySlugResponse.data.salary.min }, "salary.max": { $lte: jobReadBySlugResponse.data.salary.max } }
				]
			},
			{
				populate: [
					{
						path: "created_by",
						select: "_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality",
						populate: [
							{ path: "profile.nationality", select: "name code -_id" },
							{ path: "account.picture", select: "path -_id" },
							{ path: "account.picture_sm", select: "path -_id" },
							{ path: "account.picture_md", select: "path -_id" },
							{ path: "account.picture_lg", select: "path -_id" }
						]
					},
					{
						path: "attachments",
						select: "_id path name extname base"
					}
				],
				sort: { create_at: 1 },
				limit: 4
			}
		);
		if (jobRelatedResponse.error) return next(jobRelatedResponse.errors);

		res.render("job", {
			page_title: `${jobReadBySlugResponse.data.title} Page`,
			data: {
				job: jobReadBySlugResponse.data,
				relatedJobs: jobRelatedResponse.data,
				old
			}
		});
	}
}

export default new JobController(jobService);
