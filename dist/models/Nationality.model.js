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
var NationalitySchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    required: "Nationality name is required."
  },
  code: {
    type: String,
    trim: true,
    unique: true,
    index: true,
    required: "Nationality code is required."
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//

NationalitySchema.plugin(_mongoosePaginateV["default"]); //
// ─── SCHEMA model ───────────────────────────────────────────────────────────────
//

var Nationality = _mongoose["default"].model("Nationality", NationalitySchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Nationality;
exports["default"] = _default;