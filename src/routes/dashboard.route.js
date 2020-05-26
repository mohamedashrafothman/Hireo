import app from "express";
import permission from "permission";
import skillsRouter from "./skills.route";
import categoriesRouter from "./category.route";
import jobsRoutes from "./job.route";
import applicationsRoutes from "./application.route";
import conversationsRoutes from "./conversation.route";
import messagesRoutes from "./message.route";
import postsRoutes from "./post.route";
import UserController from "../controllers/User.controller";
import AttachmentController from "../controllers/Attachment.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route("/")
	.get((req, res) => { res.render("dashboard/dashboard", { page_title: "Dashboard" }); });

router
	.route("/settings")
	.get(UserController.getSettings);
router
	.route("/settings/:id/account-info")
	.post(UserController.uploadAvatar, UserController.validator("account info"), UserController.updateAccountInfo);
router
	.route("/settings/:id/change-password")
	.post(UserController.validator("reset password"), UserController.updatePassword);

router
	.route("/settings/:id/profile-info")
	.post(permission(["freelancer"]), UserController.uploadAttachments, UserController.validator("profile info"), UserController.updateProfileInfo);
router
	.route("/settings/:id/delete-attachment/:attachment")
	.get(permission(["freelancer"]), UserController.removeProfileAttachment);
router
	.route("/settings/:id/attachment/:attachment/download")
	.get(permission(["freelancer"]), AttachmentController.downloadAttachment);
router
	.route(["/users", "/users/list"])
	.get(permission(["admin"]), UserController.usersList);
router
	.route("/bookmark/:type/:id")
	.put(UserController.bookmarkUser);

router
	.route("/bookmarks")
	.get(UserController.getBookmarkList);

//
// ─── NESTING ROUTES ─────────────────────────────────────────────────────────────
//
router.use("/skills", permission(["admin"]), skillsRouter);
router.use("/categories", permission(["admin"]), categoriesRouter);
router.use("/jobs", permission(["admin", "employer"]), jobsRoutes);
router.use("/applications", permission(["admin", "freelancer"]), applicationsRoutes);
router.use("/conversations", permission(["admin", "freelancer", "employer"]), conversationsRoutes);
router.use("/messages", permission(["admin", "freelancer", "employer"]), messagesRoutes);
router.use("/posts", permission(["admin", "employer"]), postsRoutes);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
