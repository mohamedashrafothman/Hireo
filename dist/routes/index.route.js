"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _i18n = _interopRequireDefault(require("i18n"));

var _permission = _interopRequireDefault(require("permission"));

var _User = _interopRequireDefault(require("../controllers/User.controller"));

var _Job = _interopRequireDefault(require("../controllers/Job.controller"));

var _Application = _interopRequireDefault(require("../controllers/Application.controller"));

var _Post = _interopRequireDefault(require("../controllers/Post.controller"));

var _Comment = _interopRequireDefault(require("../controllers/Comment.controller"));

var _user = _interopRequireDefault(require("./user.route"));

var _dashboard = _interopRequireDefault(require("./dashboard.route"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route("/").get(function (req, res) {
  res.render("index", {
    page_title: "Home"
  });
});
router.route("/lang/:lang").get(function (req, res) {
  var lang = req.params.lang;

  _i18n["default"].setLocale(res, lang, true);

  res.cookie("lang", lang);
  res.redirect("back");
});
router.route(["/browse/companies"]).get(_User["default"].getCompaniesByFirstLetter);
router.route(["/browse/freelancers"]).get(_User["default"].getFreelancers);
router.route("/browse/jobs").get(_Job["default"].browseAllJobs);
router.route(["/profile/:slug"]).get(_User["default"].getUserProfilePage);
router.route("/job/:slug").get(_Job["default"].getJobPage);
router.route("/job/:id/application/add").post(_User["default"].isAuthenticated, (0, _permission["default"])(["admin", "freelancer"]), _Application["default"].isAppliedBefore, _Application["default"].uploadAttachments, _Application["default"].validator("add application"), _Application["default"].addApplication);
router.route("/browse/posts").get(_Post["default"].browseAllPosts);
router.route("/post/:slug").get(_Post["default"].getPostPage);
router.route(["/post/:id/comments/add", "/post/:id/comments/add/:parent"]).post(_User["default"].isAuthenticated, _Comment["default"].validator("add comment"), _Comment["default"].addComment); //
// ─── NESTING ROUTES ─────────────────────────────────────────────────────────────
//

router.use("/auth", _user["default"]);
router.use("/dashboard", _User["default"].isAuthenticated, _dashboard["default"]); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;