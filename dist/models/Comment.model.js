"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongoose = _interopRequireDefault(require("mongoose"));

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var CommentSchema = new _mongoose["default"].Schema({
  content: {
    type: String,
    required: "path {PATH} is required.",
    validate: [function (val) {
      return val.length <= 500;
    }, "{PATH} exceeds the limit of 500 letter."]
  },
  parent: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Comment"
  },
  children: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Comment"
  }],
  post: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Post",
    required: "path {PATH} is required."
  },
  created_by: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  created_from: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Device"
  },
  is_published: {
    type: Boolean,
    "default": true
  },
  is_deleted: {
    type: Boolean,
    "default": false
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

CommentSchema.plugin(_mongoosePaginateV["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Comment = _mongoose["default"].model("Comment", CommentSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Comment;
exports["default"] = _default;