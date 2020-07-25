"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Skill = _interopRequireDefault(require("../controllers/Skill.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route(["/", "/list"]).get(_Skill["default"].getSkillsList);
router.route("/add").get(_Skill["default"].getAddSkills).post(_Skill["default"].validator("add skill"), _Skill["default"].addSkill);
router.route("/edit/:slug").get(_Skill["default"].getEditSkills).post(_Skill["default"].validator("edit skill"), _Skill["default"].editSkill);
router.route("/delete/:id").get(_Skill["default"].deleteSkills); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;