import multer from "multer";
import { isEmpty } from "lodash";
import { body, validationResult } from "express-validator";

import Controller from "../utilities/Controller";
import Helper from "../utilities/Helper";

import JobService from "../services/Job";
import UserService from "../services/User";
import JobTypeService from "../services/JobTypeService";
import CategoryService from "../services/Category";
import AttachmentService from "../services/Attachment";
import ApplicationService from "../services/Application";

const helper = new Helper();

class JobController extends Controller {
	constructor(service) {
		super(service);
		this.addJob = this.addJob.bind(this);
		this.getEdit = this.getEdit.bind(this);
		this.editJob = this.editJob.bind(this);
		this.deleteJob = this.deleteJob.bind(this);
		this.getAddJob = this.getAddJob.bind(this);
		this.refreshJob = this.refreshJob.bind(this);
		this.getJobPage = this.getJobPage.bind(this);
		this.getJobsLists = this.getJobsLists.bind(this);
		this.browseAllJobs = this.browseAllJobs.bind(this);
		this.uploadAttachments = this.uploadAttachments.bind(this);
		this.getAllJobApplications = this.getAllJobApplications.bind(this);
	}

	validator(method) {
		switch (method) {
		case "add job":
		case "edit job":
			return [
				body("title").notEmpty().withMessage("Job title can't be empty!").trim()
					.escape(),
				body("type").notEmpty().withMessage("Job type can't be empty!"),
				body("category").notEmpty().withMessage("Job category can't be empty!"),
				body("location.address").notEmpty().withMessage("Job location can't be empty!").trim()
					.escape(),
				body("salary.min").notEmpty().withMessage("Job minimum salary can't be empty!"),
				body("salary.max")
					.notEmpty()
					.withMessage("Job maximum salary can't be empty!")
					.custom((value, { req }) => Number(value) > Number(req.body["salary.min"]))
					.withMessage("Salary maximum value can't be less than minimum value."),
				body("tags")
					.optional()
					.isArray({ min: 1, max: 10 })
					.withMessage("Skills count shall be between 1 and 10"),
				body("description").optional().trim().escape(),
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
					{ description: { $regex: req.query.q.split(" ").filter(Boolean).join("|") || "", $options: "i" } },
				],
			}),
			...(req.user.role !== "admin" && { created_by: req.user._id }),
		};
		const options = { ...req.query };

		const jobsListResponse = await this.service.readMany(query, options);
		if (jobsListResponse.error) return next(jobsListResponse.errors);

		if (!jobsListResponse.data.length && jobsListResponse.offset === undefined && jobsListResponse.page !== 1) {
			req.flash(
				"info",
				`Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${
					jobsListResponse.pages
				}.`
			);
			return res
				.status(jobsListResponse.statusCode)
				.redirect(`/dashboard/jobs/list?page=${jobsListResponse.pages}`);
		}

		res.render("dashboard/jobs/list", {
			page_title: "Manage All Jobs",
			...jobsListResponse,
			data: { jobs: jobsListResponse.data },
			query: req.query,
		});
	}

	async getAddJob(req, res, next) {
		const categoriesListResponse = await CategoryService.readMany(
			{ parent: { $exists: false }, is_deleted: false },
			{ pagination: false }
		);
		if (categoriesListResponse.error) return next(categoriesListResponse.errors);

		const jobTypeListResponse = await JobTypeService.readMany({}, { select: "name", pagination: false });
		if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

		res.render("dashboard/jobs/add", {
			page_title: "Post a Job",
			data: {
				jobTypes: jobTypeListResponse.data,
				categories: categoriesListResponse.data,
			},
		});
	}

	async uploadAttachments(req, res, next) {
		const storageEngine = AttachmentService.initStorageEngine({
			accept: ["application", "image"],
			square: false,
			fileHashName: false,
			upload_path: `${process.env.UPLOAD_STORAGE}/jobs/${new Date().getFullYear()}/${
				new Date().getMonth() + 1
			}/${new Date().getDate()}/${req.user._id}`,
			upload_base_path: `/${req.user._id}`,
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
			},
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
			const categoriesListResponse = await CategoryService.readMany(
				{ parent: { $exists: false }, is_deleted: false },
				{ pagination: false }
			);
			if (categoriesListResponse.error) return next(categoriesListResponse.errors);

			const jobTypeListResponse = await JobTypeService.readMany({}, { select: "name", pagination: false });
			if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

			return res.render("dashboard/jobs/add", {
				page_title: "Post a Job",
				data: {
					old: req.body,
					jobTypes: jobTypeListResponse.data,
					categories: categoriesListResponse.data,
				},
			});
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = AttachmentService.handelFilesForDBCreation(req.body.files, base);

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await AttachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data[0]);
			}
		}

		req.body = {
			...req.body,
			created_by: req.user._id,
			...(savedAttachments.length && { attachments: savedAttachments.map((attach) => attach._id) }),
		};

		const jobCreationResponse = await this.service.create(req.body);
		if (jobCreationResponse.error) return next(jobCreationResponse.errors);

		const categoryUpdatedResponse = await CategoryService.updateOne(
			{ _id: jobCreationResponse.data.category },
			{ $addToSet: { jobs: jobCreationResponse.data._id } }
		);
		if (categoryUpdatedResponse.error) return categoryUpdatedResponse;

		const updatedUserResponse = await UserService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { jobs: jobCreationResponse.data._id } }
		);
		if (updatedUserResponse.error) return updatedUserResponse;

		req.flash("success", "New Job added successfully");
		res.status(jobCreationResponse.statusCode).redirect("/dashboard/jobs/list");
	}

	async getEdit(req, res, next) {
		const categoriesListResponse = await CategoryService.readMany(
			{ parent: { $exists: false }, is_deleted: false },
			{ pagination: false }
		);
		if (categoriesListResponse.error) return next(categoriesListResponse.errors);

		const jobTypeListResponse = await JobTypeService.readMany({}, { select: "name", pagination: false });
		if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

		const jobResponse = await this.service.readOne({
			slug: req.params.slug,
			...(req.user.role !== "admin" && { created_by: req.user._id }),
		});
		if (jobResponse.error) return next(jobResponse.errors);
		if (isEmpty(jobResponse.data)) return next();

		res.render("dashboard/jobs/edit", {
			page_title: "Edit a Job",
			data: {
				job: jobResponse.data,
				jobTypes: jobTypeListResponse.data,
				categories: categoriesListResponse.data,
			},
		});
	}

	async editJob(req, res, next) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const err = errors.array();
			req.flash("error", err);
			const categoriesListResponse = await CategoryService.readMany(
				{ parent: { $exists: false }, is_deleted: false },
				{ pagination: false }
			);
			if (categoriesListResponse.error) return next(categoriesListResponse.errors);

			const jobTypeListResponse = await JobTypeService.readMany({}, { select: "name", pagination: false });
			if (jobTypeListResponse.error) return next(jobTypeListResponse.errors);

			const jobResponse = await this.service.readOne({
				slug: req.params.slug,
				...(req.user.role !== "admin" && { created_by: req.user._id }),
			});
			if (jobResponse.error) return next(jobResponse.errors);
			if (isEmpty(jobResponse.data)) return next();

			return res.render("dashboard/jobs/edit", {
				page_title: "Edit a Job",
				data: {
					job: jobResponse,
					jobTypes: jobTypeListResponse.data,
					categories: categoriesListResponse.data,
				},
			});
		}

		const savedAttachments = [];
		if (req.body.files.length) {
			const port = req.app.get("port");
			const base = `${req.protocol}://${req.hostname}${port ? `:${port}` : ""}`;

			const files = AttachmentService.handelFilesForDBCreation(req.body.files, base);

			for (let i = 0; i < files.length; i++) {
				const fileCreationResponse = await AttachmentService.create(files[i]);
				if (fileCreationResponse.error) return next(fileCreationResponse.errors);
				savedAttachments.push(fileCreationResponse.data[0]);
			}
		}

		req.body = {
			...req.body,
			created_by: req.user._id,
			...(savedAttachments.length && { attachments: savedAttachments.map((attach) => attach._id) }),
		};

		const { tags } = req.body;
		delete req.body.tags;

		const jobUpdateResponse = await this.service.updateOne(
			{ slug: req.params.slug, ...(req.user.role !== "admin" && { created_by: req.user._id }) },
			{
				$set: req.body,
				$addToSet: { tags },
			}
		);
		if (jobUpdateResponse.error) {
			if (jobUpdateResponse.statusCode === 404) return next();
			return next(jobUpdateResponse.errors);
		}

		const categoryUpdatedResponse = await CategoryService.updateOne(
			{ _id: jobUpdateResponse.data.category },
			{ $addToSet: { jobs: jobUpdateResponse.data._id } }
		);
		if (categoryUpdatedResponse.error) return next(categoryUpdatedResponse.errors);

		const userUpdateResponse = await UserService.updateOne(
			{ _id: req.user._id },
			{ $addToSet: { jobs: jobUpdateResponse.data._id } }
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		req.flash("success", `successfully updated ${jobUpdateResponse.data.title} data.`);
		res.redirect("/dashboard/jobs/list");
	}

	async deleteJob(req, res, next) {
		const jobDeleteResponse = await this.service.deleteOne({ _id: req.params.id });
		if (jobDeleteResponse.error) {
			if (jobDeleteResponse.statusCode === 404) return next();
			return next(jobDeleteResponse.errors);
		}

		const categoryUpdateResponse = await CategoryService.updateOne(
			{ _id: jobDeleteResponse.data.category },
			{ $pull: { jobs: req.params.id } }
		);
		if (categoryUpdateResponse.error) return next(categoryUpdateResponse.errors);

		const applicationDeleteResponse = await ApplicationService.deleteMany({ job: req.params.id });
		if (applicationDeleteResponse.error) return next(applicationDeleteResponse.errors);

		const userUpdateResponse = await UserService.updateMany(
			{
				$or: [
					{ _id: jobDeleteResponse.data.created_by },
					{
						applications: {
							$in: applicationDeleteResponse.data.map((current) => current._id),
						},
					},
					{ "bookmarked.job": req.params._id },
				],
			},
			{
				$pull: {
					jobs: req.params.id,
					applications: {
						$in: applicationDeleteResponse.data.map((current) => current._id),
					},
					"bookmarked.job": req.params.id,
				},
			}
		);
		if (userUpdateResponse.error) return next(userUpdateResponse.errors);

		// concat all of job's attachments ids and applications's attachments ids
		const attachments_ids = [
			...jobDeleteResponse.data.attachments,
			...applicationDeleteResponse.data.map((application) => application.attachment),
		];
		const attachmentDeleteResponse = await AttachmentService.deleteMany({ _id: { $in: attachments_ids } });
		if (attachmentDeleteResponse.error) return next(attachmentDeleteResponse.errors);

		const attachmentFilesDeleteResponse = await AttachmentService.handelFilesForDirDeletion(
			attachmentDeleteResponse.data.map((current) => current.path)
		);
		if (attachmentFilesDeleteResponse.error) return next(attachmentFilesDeleteResponse.errors);

		req.flash("success", `${jobDeleteResponse.data.title} job has been deleted!`);
		res.status(jobDeleteResponse.statusCode).redirect("back");
	}

	async refreshJob(req, res, next) {
		const jobUpdateResponse = await this.service.updateOne(
			{
				_id: req.params.id,
				status: 3,
				...(req.user.role !== "admin" && { created_by: req.user._id }),
			},
			{
				$set: {
					status: 1,
					expiring_at: +new Date() + 1000 * 60 * 60 * 24 * process.env.JOB_EXPERATION_TIME_IN_DAYS,
				},
				$inc: { refresh_count: 1 },
			}
		);
		if (jobUpdateResponse.error) return next(jobUpdateResponse.errors);
		if (isEmpty(jobUpdateResponse.data)) {
			return next();
		}

		req.flash(
			"success",
			`successfully refreshed ${jobUpdateResponse.data.title} job for another ${process.env.JOB_EXPERATION_TIME_IN_DAYS} days.`
		);
		res.redirect("back");
	}

	async getAllJobApplications(req, res, next) {
		const jobReadResponse = await this.service.readOne({ slug: req.params.slug });
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
					select:
						"email slug is_verified account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality ",
					populate: [
						{ path: "profile.nationality", select: "name code -_id" },
						{ path: "account.picture", select: "path name" },
						{ path: "account.picture_sm", select: "path name" },
						{ path: "account.picture_md", select: "path name" },
						{ path: "account.picture_lg", select: "path name" },
					],
				},
			],
			...req.query,
		};

		const applicationReadResponse = await ApplicationService.readMany(query, options);
		if (applicationReadResponse.error) return next(applicationReadResponse.errors);

		if (
			!applicationReadResponse.data.length
			&& applicationReadResponse.offset === undefined
			&& applicationReadResponse.page !== 1
		) {
			req.flash(
				"info",
				`Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${
					applicationReadResponse.pages
				}.`
			);
			return res
				.status(applicationReadResponse.statusCode)
				.redirect(`/dashboard/jobs/${req.params.slug}/list?page=${applicationReadResponse.pages}`);
		}

		if (
			req.user
			&& req.user.role !== "admin"
			&& req.user._id.toString() === jobReadResponse.data.created_by.toString()
		) {
			// mark applications to seen by employer (job creator).
			const applicationSeenResponse = await ApplicationService.updateMany(
				{
					_id: { $in: applicationReadResponse.data.map((current) => current._id) },
					was_seen: false,
					job: jobReadResponse.data._id,
				},
				{ $set: { was_seen: true, seen_at: +new Date() } }
			);
			if (applicationSeenResponse.error) return next(applicationSeenResponse.errors);
		}

		res.render("dashboard/jobs/candidates", {
			page_title: "Manage Candidates",
			...applicationReadResponse,
			data: { job: jobReadResponse.data, applications: applicationReadResponse.data },
			query: req.query,
		});
	}

	async browseAllJobs(req, res, next) {
		const categoryReadResponse = await CategoryService.readMany(
			{
				...(req.query.categories
					&& req.query.categories.length && {
					$or: [{ _id: { $in: req.query.categories } }, { parent: { $in: req.query.categories } }],
				}),
			},
			{ select: "_id", pagination: false }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		const query = {
			is_published: true,
			category: {
				$in: categoryReadResponse.data.map((category) => category._id),
			},
			...(req.query.long
				&& req.query.lat && {
				location: {
					$geoWithin: {
						$centerSphere: [
							[Number(req.query.long), Number(req.query.lat)],
							helper.kmToRadian(process.env.LOCATION_RANGE_IN_KM),
						],
					},
				},
			}), // 10KM / Earth Radius In Miles
			...(req.query.keywords
				&& req.query.keywords.filter(Boolean).length && {
				$or: [
					{
						title: {
							$regex: req.query.keywords.filter(Boolean).join("|") || "",
							$options: "i",
						},
					},
					{
						description: {
							$regex: req.query.keywords.filter(Boolean).join("|") || "",
							$options: "i",
						},
					},
				],
			}),
			...(req.query.salary && {
				"salary.min": {
					$gte: Number(req.query.salary.split(",")[0]),
				},
				"salary.max": {
					$lte: Number(req.query.salary.split(",")[1]),
				},
			}),
			...(req.query.job_types
				&& req.query.job_types.length && {
				type: {
					$in: req.query.job_types,
				},
			}),
			...(req.query.tags
				&& req.query.tags.length && {
				tags: {
					$in: req.query.tags,
				},
			}),
		};
		const options = {
			select:
				"slug title status created_at category location type.name created_by.account.name created_by.is_verified created_by.account.picture created_by.account.picture_sm created_by.account.picture_md created_by.account.picture_lg",
			...req.query,
		};

		const jobReadResponse = await this.service.readMany(query, options);
		if (jobReadResponse.error) return next(jobReadResponse.errors);

		if (!jobReadResponse.data.length && jobReadResponse.offset === undefined && jobReadResponse.page !== 1) {
			req.flash(
				"info",
				`Hey! you asked for page ${req.query.page || 1}. But that dosen't exist. So i put you on page ${
					jobReadResponse.pages
				}.`
			);
			return res.status(jobReadResponse.statusCode).redirect(`/browse/jobs/${jobReadResponse.pages}`);
		}

		const jobTypeReadResponse = await JobTypeService.readMany({}, { select: "name", pagination: false });
		if (jobTypeReadResponse.error) return next(jobTypeReadResponse.errors);

		const jobTagsResponse = await this.service.getTags({});
		if (jobTagsResponse.error) return next(jobTagsResponse.errors);

		const jobMinMaxResponse = await this.service.getMinMax({});
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
				jobs: jobReadResponse.data,
			},
		});
	}

	async getJobPage(req, res, next) {
		const old = req.session.data?.old || null;
		req.session.data = null;

		const jobReadBySlugResponse = await this.service.getBySlug(req.params.slug, req.user);
		if (jobReadBySlugResponse.error) {
			if (jobReadBySlugResponse.statusCode === 404) return next();
			return next(jobReadBySlugResponse.errors);
		}

		const categoryReadResponse = await CategoryService.readMany(
			{
				$or: [
					{ _id: jobReadBySlugResponse.data.category._id },
					{ parent: { $in: jobReadBySlugResponse.data.category.parent } },
				],
			},
			{ select: "_id", pagination: false }
		);
		if (categoryReadResponse.error) return next(categoryReadResponse.errors);

		const jobRelatedResponse = await this.service.readMany(
			{
				_id: { $ne: jobReadBySlugResponse.data._id },
				$or: [
					{
						category: {
							$in: categoryReadResponse.data.map((category) => category._id),
						},
					},
					{ type: jobReadBySlugResponse.data.type._id },
					{
						location: {
							$geoWithin: {
								$centerSphere: [
									[
										jobReadBySlugResponse.data.location.coordinates[0],
										jobReadBySlugResponse.data.location.coordinates[1],
									],
									helper.kmToRadian(process.env.LOCATION_RANGE_IN_KM),
								],
							},
						},
					},
					{ tags: { $in: jobReadBySlugResponse.data.tags } },
					{
						"salary.min": { $gte: jobReadBySlugResponse.data.salary.min },
						"salary.max": { $lte: jobReadBySlugResponse.data.salary.max },
					},
				],
			},
			{
				sort: { create_at: 1 },
				limit: 4,
			}
		);
		if (jobRelatedResponse.error) return next(jobRelatedResponse.errors);

		res.render("job", {
			page_title: `${jobReadBySlugResponse.data.title} Page`,
			data: {
				job: jobReadBySlugResponse.data,
				relatedJobs: jobRelatedResponse.data,
				old,
			},
		});
	}
}

export default new JobController(JobService);
