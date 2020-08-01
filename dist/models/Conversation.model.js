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
var ConversationSchema = new _mongoose["default"].Schema({
  users: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  }],
  messages: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Message"
  }],
  is_deleted: {
    type: Boolean,
    "default": false
  },
  deleted_by: {
    type: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "User"
    }],
    validate: [function (val) {
      return val.length <= 2;
    }, "{PATH} exceeds the limit of 2"]
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

ConversationSchema.plugin(_mongoosePaginateV["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Conversation = _mongoose["default"].model("Conversation", ConversationSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Conversation;
exports["default"] = _default;