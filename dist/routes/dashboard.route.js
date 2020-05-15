"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _permission = _interopRequireDefault(require("permission"));

var _skills = _interopRequireDefault(require("./skills.route"));

var _category = _interopRequireDefault(require("./category.route"));

var _job = _interopRequireDefault(require("./job.route"));

var _application = _interopRequireDefault(require("./application.route"));

var _conversation = _interopRequireDefault(require("./conversation.route"));

var _message = _interopRequireDefault(require("./message.route"));

var _User = _interopRequireDefault(require("../controllers/User.controller"));

var _Attachment = _interopRequireDefault(require("../controllers/Attachment.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route("/").get(function (req, res) {
  res.render("dashboard/dashboard", {
    page_title: "Dashboard"
  });
});
router.route("/settings").get(_User["default"].getSettings);
router.route("/settings/:id/account-info").post(_User["default"].uploadAvatar, _User["default"].validator("account info"), _User["default"].updateAccountInfo);
router.route("/settings/:id/change-password").post(_User["default"].validator("reset password"), _User["default"].updatePassword);
router.route("/settings/:id/profile-info").post((0, _permission["default"])(["freelancer"]), _User["default"].uploadAttachments, _User["default"].validator("profile info"), _User["default"].updateProfileInfo);
router.route("/settings/:id/delete-attachment/:attachment").get((0, _permission["default"])(["freelancer"]), _User["default"].removeProfileAttachment);
router.route("/settings/:id/attachment/:attachment/download").get((0, _permission["default"])(["freelancer"]), _Attachment["default"].downloadAttachment);
router.route(["/users", "/users/list"]).get((0, _permission["default"])(["admin"]), _User["default"].usersList);
router.route("/bookmark/:type/:id").put(_User["default"].bookmarkUser);
router.route("/bookmarks").get(_User["default"].getBookmarkList); //
// ─── NESTING ROUTES ─────────────────────────────────────────────────────────────
//

router.use("/skills", (0, _permission["default"])(["admin"]), _skills["default"]);
router.use("/categories", (0, _permission["default"])(["admin"]), _category["default"]);
router.use("/jobs", (0, _permission["default"])(["admin", "employer"]), _job["default"]);
router.use("/applications", (0, _permission["default"])(["admin", "freelancer"]), _application["default"]);
router.use("/conversations", (0, _permission["default"])(["admin", "freelancer", "employer"]), _conversation["default"]);
router.use("/messages", (0, _permission["default"])(["admin", "freelancer", "employer"]), _message["default"]); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;