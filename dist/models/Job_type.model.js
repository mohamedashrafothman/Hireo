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
var JobTypeSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    unique: true,
    index: true,
    required: "Job Type name is required"
  },
  slug: {
    type: String,
    slug: "name",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

JobTypeSchema.plugin(_mongoosePaginateV["default"]);
JobTypeSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var job_type = _mongoose["default"].model("job_type", JobTypeSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = job_type;
exports["default"] = _default;