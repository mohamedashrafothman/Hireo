"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Post = _interopRequireDefault(require("../controllers/Post.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route(["/", "/list"]).get(_Post["default"].getPostsList);
router.route("/add").get(_Post["default"].getAddPosts).post(_Post["default"].uploadAttachment, _Post["default"].validator("add post"), _Post["default"].addPost);
router.route("/edit/:slug").get(_Post["default"].getEditPosts).post(_Post["default"].uploadAttachment, _Post["default"].validator("edit post"), _Post["default"].editPost);
router.route("/delete/:id").get(_Post["default"].deletePost); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;