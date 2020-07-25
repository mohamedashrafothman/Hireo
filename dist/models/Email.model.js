"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongooseSlugUpdater = _interopRequireDefault(require("mongoose-slug-updater"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _validator = _interopRequireDefault(require("validator"));

var _mongoose = _interopRequireDefault(require("mongoose"));

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var EmailSchema = new _mongoose["default"].Schema({
  from: {
    type: String,
    index: true,
    lowercase: true,
    trim: true,
    validate: [_validator["default"].isEmail, "Invalid Email Address"]
  },
  to: [{
    type: String,
    index: true,
    lowercase: true,
    trim: true,
    validate: [_validator["default"].isEmail, "Invalid Email Address"]
  }],
  subject: {
    type: String,
    required: true
  },
  html: {
    type: String
  },
  text: {
    type: String
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//

EmailSchema.plugin(_mongoosePaginateV["default"]);
EmailSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Email = _mongoose["default"].model("Email", EmailSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Email;
exports["default"] = _default;