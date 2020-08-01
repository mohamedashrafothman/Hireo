"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _Application = _interopRequireDefault(require("../controllers/Application.controller"));

var _Attachment = _interopRequireDefault(require("../controllers/Attachment.controller"));

//
// ─── DEFINING EXPRESS ROUTER ────────────────────────────────────────────────────
//
var router = _express["default"].Router(); //
// ─── ROUTER BREAKPOINTS ─────────────────────────────────────────────────────────
//


router.route(["/", "/list"]).get(_Application["default"].getApplicationsList);
router.route("/:id/withdraw").get(_Application["default"].withdrawApplication);
router.route("/:id/attachment/:attachment/download").get(_Attachment["default"].downloadAttachment); //
// ─── EXPORTING ROUTER ───────────────────────────────────────────────────────────
//

var _default = router;
exports["default"] = _default;