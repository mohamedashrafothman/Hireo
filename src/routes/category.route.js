import app from "express";
import CategoryController from "../controllers/Category.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route(["/", "/list"])
	.get(CategoryController.getCategoryList);
router
	.route("/add")
	.get(CategoryController.getAddCategory)
	.post(CategoryController.uploadImage, CategoryController.validator("add category"), CategoryController.addCategory);
router
	.route("/edit/:slug")
	.get(CategoryController.getEditCategory)
	.post(CategoryController.uploadImage, CategoryController.validator("edit category"), CategoryController.editCategory);
router
	.route("/delete/:id")
	.get(CategoryController.deleteCategory);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
