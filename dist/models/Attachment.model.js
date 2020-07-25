"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var AttachmentSchema = new _mongoose["default"].Schema({
  path: {
    type: String
  },
  dir: {
    type: String
  },
  name: {
    type: String
  },
  extname: {
    type: String
  },
  base: {
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

AttachmentSchema.plugin(_mongoosePaginateV["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Attachment = _mongoose["default"].model("Attachment", AttachmentSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Attachment;
exports["default"] = _default;