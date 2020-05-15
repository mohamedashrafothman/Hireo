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
var CategorySchema = new _mongoose["default"].Schema({
  name: {
    ar: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    en: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    }
  },
  description: {
    ar: {
      type: String,
      required: true,
      index: true
    },
    en: {
      type: String,
      required: true,
      index: true
    }
  },
  picture: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Attachment"
  },
  parent: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Category"
  }],
  childs: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Category"
  }],
  icon: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Icon"
  },
  slug: {
    type: String,
    slug: "name.en",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  },
  jobs: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Job"
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

CategorySchema.plugin(_mongoosePaginateV["default"]);
CategorySchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Category = _mongoose["default"].model("Category", CategorySchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Category;
exports["default"] = _default;