"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongooseSlugUpdater = _interopRequireDefault(require("mongoose-slug-updater"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongoose = _interopRequireDefault(require("mongoose"));

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var PostSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: "Post title is required",
    index: true
  },
  slug: {
    type: String,
    slug: "title",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  },
  tags: {
    type: [String],
    validate: [function (val) {
      return val.length <= 10;
    }, "{PATH} exceeds the limit of 10"],
    index: true
  },
  content: {
    type: String,
    required: "Post content is required"
  },
  category: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Category"
  },
  status: {
    type: Number,
    "default": 1
  },
  // 1 => published, 2 => Drafted.
  created_by: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  thumbnail: {
    sm: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    },
    md: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    },
    lg: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    }
  },
  views: {
    count: {
      type: Number
    },
    devices: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Device"
    }]
  },
  comments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Comment"
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

PostSchema.plugin(_mongoosePaginateV["default"]);
PostSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Post = _mongoose["default"].model("Post", PostSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Post;
exports["default"] = _default;