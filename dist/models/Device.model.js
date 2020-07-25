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
var DeviceSchema = new _mongoose["default"].Schema({
  ip: {
    type: String,
    max: 20,
    required: true
  },
  source: {
    type: String,
    required: true
  },
  browser: {
    name: {
      type: String,
      require: true
    },
    version: {
      type: String
    }
  },
  os: {
    type: String
  },
  platform: {
    type: String
  },
  post: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Post"
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

DeviceSchema.plugin(_mongoosePaginateV["default"]);
DeviceSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Device = _mongoose["default"].model("Device", DeviceSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Device;
exports["default"] = _default;