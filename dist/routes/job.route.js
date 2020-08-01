"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Job = _interopRequireDefault(require("../controllers/Job.controller"));

var _Application = _interopRequireDefault(require("../controllers/Application.controller"));

var _Attachment = _interopRequireDefault(require("../controllers/Attachment.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route(["/", "/list"]).get(_Job["default"].getJobsLists);
router.route("/add").get(_Job["default"].getAddJob).post(_Job["default"].uploadAttachments, _Job["default"].validator("add job"), _Job["default"].addJob);
router.route("/edit/:slug").get(_Job["default"].getEdit).post(_Job["default"].uploadAttachments, _Job["default"].validator("edit job"), _Job["default"].editJob);
router.route("/delete/:id").get(_Job["default"].deleteJob);
router.route("/refresh/:id").get(_Job["default"].refreshJob);
router.route("/:slug/applications").get(_Job["default"].getAllJobApplications);
router.route("/:job/applications/:application/change-status/:status").get(_Application["default"].changeStatus);
router.route("/:job/applications/:application/attachment/:attachment/download").get(_Attachment["default"].downloadAttachment); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;