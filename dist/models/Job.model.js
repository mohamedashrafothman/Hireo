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

var _Job = _interopRequireDefault(require("../services/Job"));

var _User = _interopRequireDefault(require("../services/User"));

var _Category = _interopRequireDefault(require("../services/Category"));

var _Application = _interopRequireDefault(require("../services/Application"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

/* eslint-disable import/no-cycle */
//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var JobSchema = new _mongoose["default"].Schema({
  title: {
    type: String,
    required: "Job title is required",
    index: true
  },
  description: {
    type: String,
    index: true
  },
  slug: {
    type: String,
    slug: "title",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  },
  tags: {
    type: [String],
    validate: [function (val) {
      return val.length <= 10;
    }, "{PATH} exceeds the limit of 10"],
    index: true
  },
  salary: {
    min: {
      type: Number,
      required: "Job minimum salary is required"
    },
    max: {
      type: Number,
      required: "Job maximum salary is required"
    }
  },
  location: {
    type: {
      type: String,
      "enum": ["Point"],
      "default": "Point",
      required: true
    },
    address: {
      type: String,
      required: "You must supply a location address"
    },
    coordinates: [{
      type: Number,
      required: "You must supply coordinates",
      index: true
    }] // coordinates[0] => longitude, coordinates[1] => latitude

  },
  type: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "job_type",
    index: true
  },
  attachments: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Attachment"
  }],
  category: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Category",
    index: true
  },
  created_by: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "User"
  },
  applications: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Application"
  }],
  status: {
    type: Number,
    "default": 1
  },
  // 1 => Running, 2 => completed, 3 => Expiring, 4 => Expired.
  is_active: {
    type: Boolean,
    "default": 1
  },
  // 1 => active, 0 => not active
  is_published: {
    type: Boolean,
    "default": 1
  },
  // 1 => published, 0 => no published
  refresh_count: {
    type: Number,
    "default": 0
  },
  expiring_at: {
    type: Date,
    "default": +new Date() + 1000 * 60 * 60 * 24 * Number(process.env.JOB_EXPIRATION_TIME_IN_DAYS)
  } // 30 Days = (ms * sec * min * hours * days)

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
              path: "type"
            }, {
              path: "attachments",
              select: "_id base extname path name"
            }, {
              path: "category",
              select: "_id name parent children"
            }, {
              path: "created_by",
              select: "_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality"
            }, {
              path: "application",
              select: "created_by"
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
    var _readJobResponse$data, _readJobResponse$data2, _readJobResponse$data6, _readJobResponse$data7, _readJobResponse$data10, _readJobResponse$data11, _readJobResponse$data15, _readJobResponse$data16;

    var readJobResponse, _readJobResponse$data3, _readJobResponse$data4, _readJobResponse$data5, updateUserResponse, _readJobResponse$data8, _readJobResponse$data9, deleteAttachmentResponse, _readJobResponse$data12, _readJobResponse$data13, _readJobResponse$data14, updateCategoryResponse, _readJobResponse$data17, _readJobResponse$data18, deleteApplicationResponse;

    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _Job["default"].readOne(this.getQuery());

          case 2:
            readJobResponse = _context2.sent;

            if (!(readJobResponse === null || readJobResponse === void 0 ? void 0 : readJobResponse.error)) {
              _context2.next = 5;
              break;
            }

            return _context2.abrupt("return", next(readJobResponse === null || readJobResponse === void 0 ? void 0 : readJobResponse.errors));

          case 5:
            if (!(readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data = readJobResponse.data) === null || _readJobResponse$data === void 0 ? void 0 : (_readJobResponse$data2 = _readJobResponse$data.created_by) === null || _readJobResponse$data2 === void 0 ? void 0 : _readJobResponse$data2._id)) {
              _context2.next = 11;
              break;
            }

            _context2.next = 8;
            return _User["default"].updateOne({
              _id: readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data3 = readJobResponse.data) === null || _readJobResponse$data3 === void 0 ? void 0 : (_readJobResponse$data4 = _readJobResponse$data3.created_by) === null || _readJobResponse$data4 === void 0 ? void 0 : _readJobResponse$data4._id
            }, {
              $pull: {
                jobs: readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data5 = readJobResponse.data) === null || _readJobResponse$data5 === void 0 ? void 0 : _readJobResponse$data5._id
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
            if (!(readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data6 = readJobResponse.data) === null || _readJobResponse$data6 === void 0 ? void 0 : (_readJobResponse$data7 = _readJobResponse$data6.attachments) === null || _readJobResponse$data7 === void 0 ? void 0 : _readJobResponse$data7.length)) {
              _context2.next = 17;
              break;
            }

            _context2.next = 14;
            return _Attachment["default"].deleteMany({
              _id: {
                $in: readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data8 = readJobResponse.data) === null || _readJobResponse$data8 === void 0 ? void 0 : (_readJobResponse$data9 = _readJobResponse$data8.attachments) === null || _readJobResponse$data9 === void 0 ? void 0 : _readJobResponse$data9.map(function (attachment) {
                  return attachment._id;
                })
              }
            });

          case 14:
            deleteAttachmentResponse = _context2.sent;

            if (!(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.error)) {
              _context2.next = 17;
              break;
            }

            return _context2.abrupt("return", next(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.errors));

          case 17:
            if (!(readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data10 = readJobResponse.data) === null || _readJobResponse$data10 === void 0 ? void 0 : (_readJobResponse$data11 = _readJobResponse$data10.category) === null || _readJobResponse$data11 === void 0 ? void 0 : _readJobResponse$data11._id)) {
              _context2.next = 23;
              break;
            }

            _context2.next = 20;
            return _Category["default"].updateOne({
              _id: readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data12 = readJobResponse.data) === null || _readJobResponse$data12 === void 0 ? void 0 : _readJobResponse$data12._id
            }, {
              $pull: {
                jobs: readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data13 = readJobResponse.data) === null || _readJobResponse$data13 === void 0 ? void 0 : (_readJobResponse$data14 = _readJobResponse$data13.category) === null || _readJobResponse$data14 === void 0 ? void 0 : _readJobResponse$data14._id
              }
            });

          case 20:
            updateCategoryResponse = _context2.sent;

            if (!(updateCategoryResponse === null || updateCategoryResponse === void 0 ? void 0 : updateCategoryResponse.error)) {
              _context2.next = 23;
              break;
            }

            return _context2.abrupt("return", next(updateCategoryResponse === null || updateCategoryResponse === void 0 ? void 0 : updateCategoryResponse.errors));

          case 23:
            if (!(readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data15 = readJobResponse.data) === null || _readJobResponse$data15 === void 0 ? void 0 : (_readJobResponse$data16 = _readJobResponse$data15.applications) === null || _readJobResponse$data16 === void 0 ? void 0 : _readJobResponse$data16.length)) {
              _context2.next = 29;
              break;
            }

            _context2.next = 26;
            return _Application["default"].deleteMany({
              _id: {
                $in: readJobResponse === null || readJobResponse === void 0 ? void 0 : (_readJobResponse$data17 = readJobResponse.data) === null || _readJobResponse$data17 === void 0 ? void 0 : (_readJobResponse$data18 = _readJobResponse$data17.applications) === null || _readJobResponse$data18 === void 0 ? void 0 : _readJobResponse$data18.map(function (application) {
                  return application._id;
                })
              }
            });

          case 26:
            deleteApplicationResponse = _context2.sent;

            if (!(deleteApplicationResponse === null || deleteApplicationResponse === void 0 ? void 0 : deleteApplicationResponse.error)) {
              _context2.next = 29;
              break;
            }

            return _context2.abrupt("return", next(deleteApplicationResponse === null || deleteApplicationResponse === void 0 ? void 0 : deleteApplicationResponse.errors));

          case 29:
            next();

          case 30:
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

JobSchema.plugin(_mongoosePaginateV["default"]);
JobSchema.plugin(_mongooseSlugUpdater["default"]);
JobSchema.pre("find", preFindMethod);
JobSchema.pre("findOne", preFindMethod);
JobSchema.pre("deleteOne", preDeleteOneMethod); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Job = _mongoose["default"].model("Job", JobSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Job;
exports["default"] = _default;