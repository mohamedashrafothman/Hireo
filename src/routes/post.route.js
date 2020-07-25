import app from "express";
import PostsController from "../controllers/Post.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route(["/", "/list"])
	.get(PostsController.getPostsList);

router
	.route("/add")
	.get(PostsController.getAddPosts)
	.post(
		PostsController.uploadAttachment,
		PostsController.validator("add post"),
		PostsController.addPost
	);

router
	.route("/edit/:slug")
	.get(PostsController.getEditPosts)
	.post(
		PostsController.uploadAttachment,
		PostsController.validator("edit post"),
		PostsController.editPost
	);

router
	.route("/delete/:id")
	.get(PostsController.deletePost);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
