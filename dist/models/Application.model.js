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
var ApplicationSchema = new _mongoose["default"].Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  status: {
    type: Number,
    "default": 1
  },
  // 1 => Waiting, 2 => Withdrawn, 3 => Rejected, 4 => Accepted.
  attachment: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Attachment"
  },
  job: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Job"
  },
  created_by: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  was_seen: {
    type: Boolean,
    "default": 0
  },
  // check if the application seen by the job creator.
  seen_at: {
    type: Date,
    "default": undefined
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

ApplicationSchema.plugin(_mongoosePaginateV["default"]);
ApplicationSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Application = _mongoose["default"].model("Application", ApplicationSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Application;
exports["default"] = _default;