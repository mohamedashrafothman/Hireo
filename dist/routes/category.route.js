"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Category = _interopRequireDefault(require("../controllers/Category.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route(["/", "/list"]).get(_Category["default"].getCategoryList);
router.route("/add").get(_Category["default"].getAddCategory).post(_Category["default"].uploadImage, _Category["default"].validator("add category"), _Category["default"].addCategory);
router.route("/edit/:slug").get(_Category["default"].getEditCategory).post(_Category["default"].uploadImage, _Category["default"].validator("edit category"), _Category["default"].editCategory);
router.route("/delete/:id").get(_Category["default"].deleteCategory); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;