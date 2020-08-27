"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongooseSlugUpdater = _interopRequireDefault(require("mongoose-slug-updater"));

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Skill = _interopRequireDefault(require("../services/Skill"));

var _User = _interopRequireDefault(require("../services/User"));

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
// ─── SCHEMA PLUGIN AND HOOKS ────────────────────────────────────────────────────
//

var preDeleteOneMethod = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    var _skillReadResponse$da, _skillReadResponse$da2;

    var skillReadResponse, _skillReadResponse$da3, _skillReadResponse$da4, updateUserResponse;

    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _Skill["default"].readOne(this.getQuery());

          case 2:
            skillReadResponse = _context.sent;

            if (!(skillReadResponse === null || skillReadResponse === void 0 ? void 0 : skillReadResponse.error)) {
              _context.next = 5;
              break;
            }

            return _context.abrupt("return", next(skillReadResponse === null || skillReadResponse === void 0 ? void 0 : skillReadResponse.errors));

          case 5:
            if (!(skillReadResponse === null || skillReadResponse === void 0 ? void 0 : (_skillReadResponse$da = skillReadResponse.data) === null || _skillReadResponse$da === void 0 ? void 0 : (_skillReadResponse$da2 = _skillReadResponse$da.users) === null || _skillReadResponse$da2 === void 0 ? void 0 : _skillReadResponse$da2.length)) {
              _context.next = 11;
              break;
            }

            _context.next = 8;
            return _User["default"].updateMany({
              "profile.skills": skillReadResponse === null || skillReadResponse === void 0 ? void 0 : (_skillReadResponse$da3 = skillReadResponse.data) === null || _skillReadResponse$da3 === void 0 ? void 0 : _skillReadResponse$da3._id
            }, {
              $pull: {
                "profile.skills": skillReadResponse === null || skillReadResponse === void 0 ? void 0 : (_skillReadResponse$da4 = skillReadResponse.data) === null || _skillReadResponse$da4 === void 0 ? void 0 : _skillReadResponse$da4._id
              }
            });

          case 8:
            updateUserResponse = _context.sent;

            if (!updateUserResponse.error) {
              _context.next = 11;
              break;
            }

            return _context.abrupt("return", next(updateUserResponse.errors));

          case 11:
            next();

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function preDeleteOneMethod(_x) {
    return _ref.apply(this, arguments);
  };
}();

SkillSchema.plugin(_mongoosePaginateV["default"]);
SkillSchema.plugin(_mongooseSlugUpdater["default"]);
SkillSchema.pre("deleteOne", preDeleteOneMethod); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Skill = _mongoose["default"].model("Skill", SkillSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Skill;
exports["default"] = _default;