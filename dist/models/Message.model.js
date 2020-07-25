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
var MessageSchema = new _mongoose["default"].Schema({
  user: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  conversation: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Conversation",
    required: true,
    index: true
  },
  content: {
    type: String,
    max: 255,
    required: true,
    trim: true
  },
  was_read: {
    type: Boolean,
    "default": false
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

MessageSchema.plugin(_mongoosePaginateV["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Message = _mongoose["default"].model("Message", MessageSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Message;
exports["default"] = _default;