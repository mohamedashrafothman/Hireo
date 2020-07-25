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
var SessionSchema = new _mongoose["default"].Schema({}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

SessionSchema.plugin(_mongoosePaginateV["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Session = _mongoose["default"].model("Session", SessionSchema, process.env.SESSION_DATABASE_COLLECTION_NAME); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Session;
exports["default"] = _default;