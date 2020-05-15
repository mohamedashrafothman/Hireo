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
var IconSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    index: true
  },
  type: {
    type: String,
    index: true
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

IconSchema.plugin(_mongoosePaginateV["default"]);
IconSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Icon = _mongoose["default"].model("Icon", IconSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Icon;
exports["default"] = _default;