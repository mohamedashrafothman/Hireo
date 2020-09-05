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

var _Application = _interopRequireDefault(require("../services/Application"));

var _User = _interopRequireDefault(require("../services/User"));

var _Job = _interopRequireDefault(require("../services/Job"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

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

var preFindMethod = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.populate([{
              path: "attachments",
              select: "_id base extname path name"
            }, {
              path: "job",
              select: "created_by title slug status"
            }, {
              path: "created_by",
              select: "_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality"
            }]);
            next();

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function preFindMethod(_x) {
    return _ref.apply(this, arguments);
  };
}();

var preDeleteOneMethod = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(next) {
    var _readApplicationRespo, _readApplicationRespo2, _readApplicationRespo6, _readApplicationRespo10;

    var readApplicationResponse, _readApplicationRespo3, _readApplicationRespo4, _readApplicationRespo5, updateUserResponse, _readApplicationRespo7, _readApplicationRespo8, _readApplicationRespo9, updateJobResponse, _readApplicationRespo11, _readApplicationRespo12, deleteAttachmentResponse;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _Application["default"].readOne(this.getQuery());

          case 2:
            readApplicationResponse = _context2.sent;

            if (!(readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : readApplicationResponse.error)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", next(readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : readApplicationResponse.errors));

          case 5:
            if (!(readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo = readApplicationResponse.data) === null || _readApplicationRespo === void 0 ? void 0 : (_readApplicationRespo2 = _readApplicationRespo.created_by) === null || _readApplicationRespo2 === void 0 ? void 0 : _readApplicationRespo2._id)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 8;
            return _User["default"].updateOne({
              _id: readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo3 = readApplicationResponse.data) === null || _readApplicationRespo3 === void 0 ? void 0 : (_readApplicationRespo4 = _readApplicationRespo3.created_by) === null || _readApplicationRespo4 === void 0 ? void 0 : _readApplicationRespo4._id
            }, {
              $pull: {
                applications: readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo5 = readApplicationResponse.data) === null || _readApplicationRespo5 === void 0 ? void 0 : _readApplicationRespo5._id
              }
            });

          case 8:
            updateUserResponse = _context2.sent;

            if (!(updateUserResponse === null || updateUserResponse === void 0 ? void 0 : updateUserResponse.error)) {
              _context2.next = 11;
              break;
            }

            return _context2.abrupt("return", next(updateUserResponse === null || updateUserResponse === void 0 ? void 0 : updateUserResponse.errors));

          case 11:
            if (!(readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo6 = readApplicationResponse.data) === null || _readApplicationRespo6 === void 0 ? void 0 : _readApplicationRespo6.job._id)) {
              _context2.next = 17;
              break;
            }

            _context2.next = 14;
            return _Job["default"].updateOne({
              _id: readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo7 = readApplicationResponse.data) === null || _readApplicationRespo7 === void 0 ? void 0 : (_readApplicationRespo8 = _readApplicationRespo7.job) === null || _readApplicationRespo8 === void 0 ? void 0 : _readApplicationRespo8._id
            }, {
              $pull: {
                applications: readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo9 = readApplicationResponse.data) === null || _readApplicationRespo9 === void 0 ? void 0 : _readApplicationRespo9.id
              }
            });

          case 14:
            updateJobResponse = _context2.sent;

            if (!(updateJobResponse === null || updateJobResponse === void 0 ? void 0 : updateJobResponse.error)) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", next(updateJobResponse === null || updateJobResponse === void 0 ? void 0 : updateJobResponse.errors));

          case 17:
            if (!(readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo10 = readApplicationResponse.data) === null || _readApplicationRespo10 === void 0 ? void 0 : _readApplicationRespo10.attachments)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 20;
            return _Attachment["default"].deleteMany({
              _id: readApplicationResponse === null || readApplicationResponse === void 0 ? void 0 : (_readApplicationRespo11 = readApplicationResponse.data) === null || _readApplicationRespo11 === void 0 ? void 0 : (_readApplicationRespo12 = _readApplicationRespo11.attachment) === null || _readApplicationRespo12 === void 0 ? void 0 : _readApplicationRespo12._id
            });

          case 20:
            deleteAttachmentResponse = _context2.sent;

            if (!(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.error)) {
              _context2.next = 23;
              break;
            }

            return _context2.abrupt("return", next(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.errors));

          case 23:
            next();

          case 24:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function preDeleteOneMethod(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

ApplicationSchema.plugin(_mongoosePaginateV["default"]);
ApplicationSchema.plugin(_mongooseSlugUpdater["default"]);
ApplicationSchema.pre("find", preFindMethod);
ApplicationSchema.pre("findOne", preFindMethod);
ApplicationSchema.pre("deleteOne", preDeleteOneMethod); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Application = _mongoose["default"].model("Application", ApplicationSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Application;
exports["default"] = _default;