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
var SkillSchema = new _mongoose["default"].Schema({
  name: {
    ar: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    },
    en: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true
    }
  },
  description: {
    ar: {
      type: String,
      required: true,
      index: true
    },
    en: {
      type: String,
      required: true,
      index: true
    }
  },
  slug: {
    type: String,
    slug: "name.en",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  },
  users: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA PLUGIN ──────────────────────────────────────────────────────────────
//

SkillSchema.plugin(_mongoosePaginateV["default"]);
SkillSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Skill = _mongoose["default"].model("Skill", SkillSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Skill;
exports["default"] = _default;