import app from "express";

import JobController from "../controllers/Job.controller";
import ApplicationController from "../controllers/Application.controller";
import AttachmentController from "../controllers/Attachment.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route(["/", "/list"])
	.get(JobController.getJobsLists);
router
	.route("/add")
	.get(JobController.getAddJob)
	.post(JobController.uploadAttachments,
		JobController.validator("add job"),
		JobController.addJob);
router
	.route("/edit/:slug")
	.get(JobController.getEdit)
	.post(JobController.uploadAttachments,
		JobController.validator("edit job"),
		JobController.editJob);
router
	.route("/delete/:id")
	.get(JobController.deleteJob);
router
	.route("/refresh/:id")
	.get(JobController.refreshJob);
router
	.route("/:slug/applications")
	.get(JobController.getAllJobApplications);
router
	.route("/:job/applications/:application/change-status/:status")
	.get(ApplicationController.changeStatus);
router
	.route("/:job/applications/:application/attachment/:attachment/download")
	.get(AttachmentController.downloadAttachment);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
