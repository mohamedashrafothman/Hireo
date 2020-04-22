import app from "express";
import SkillsController from "../controllers/Skill.controller";

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
const router = app.Router();

//
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//
router
	.route(["/", "/list"])
	.get(SkillsController.getSkillsList);
router
	.route("/add")
	.get(SkillsController.getAddSkills)
	.post(SkillsController.validator("add skill"), SkillsController.addSkill);
router
	.route("/edit/:slug")
	.get(SkillsController.getEditSkills)
	.post(SkillsController.validator("edit skill"), SkillsController.editSkill);
router
	.route("/delete/:id")
	.get(SkillsController.deleteSkills);

//
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//
export default router;
