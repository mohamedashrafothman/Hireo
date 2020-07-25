import app from "express";
import i18n from "i18n";
import permission from "permission";
import UserController from "../controllers/User.controller";
import JobController from "../controllers/Job.controller";
import ApplicationController from "../controllers/Application.controller";
import PostController from "../controllers/Post.controller";
import CommentController from "../controllers/Comment.controller";
import userRouter from "./user.route";
import dashboardRouter from "./dashboard.route";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route("/")
	.get((req, res) => {
		res.render("index", {
			page_title: "Home"
		});
	});
router
	.route("/lang/:lang")
	.get((req, res) => {
		const {
			lang
		} = req.params;
		i18n.setLocale(res, lang, true);
		res.cookie("lang", lang);
		res.redirect("back");
	});

router
	.route(["/browse/companies"])
	.get(UserController.getCompaniesByFirstLetter);
router
	.route(["/browse/freelancers"])
	.get(UserController.getFreelancers);
router
	.route("/browse/jobs")
	.get(JobController.browseAllJobs);

router
	.route(["/profile/:slug"])
	.get(UserController.getUserProfilePage);

router
	.route("/job/:slug")
	.get(JobController.getJobPage);
router
	.route("/job/:id/application/add")
	.post(
		UserController.isAuthenticated,
		permission(["admin", "freelancer"]),
		ApplicationController.isAppliedBefore,
		ApplicationController.uploadAttachments,
		ApplicationController.validator("add application"),
		ApplicationController.addApplication
	);

router
	.route("/browse/posts")
	.get(PostController.browseAllPosts);
router
	.route("/post/:slug")
	.get(PostController.getPostPage);

router
	.route(["/post/:id/comments/add", "/post/:id/comments/add/:parent"])
	.post(UserController.isAuthenticated, CommentController.validator("add comment"), CommentController.addComment);

//
// ─── NESTING ROUTES ─────────────────────────────────────────────────────────────
//
router.use("/auth", userRouter);
router.use("/dashboard", UserController.isAuthenticated, dashboardRouter);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
