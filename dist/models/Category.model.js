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

var _Category = _interopRequireDefault(require("../services/Category"));

var _Attachment = _interopRequireDefault(require("../services/Attachment"));

var _Post = _interopRequireDefault(require("../services/Post"));

var _Job = _interopRequireDefault(require("../services/Job"));

//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var CategorySchema = new _mongoose["default"].Schema({
  name: {
    ar: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    en: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
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
  picture: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Attachment"
  },
  parent: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Category"
  },
  children: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Category"
  }],
  icon: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Icon"
  },
  slug: {
    type: String,
    slug: "name.en",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  },
  jobs: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Job"
  }],
  posts: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Post"
  }],
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
// ─── SCHEMA PLUGIN AND HOOKS ────────────────────────────────────────────────────
//

var preFindMethod = /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            this.populate([{
              path: "children"
            }, {
              path: "icon"
            }, {
              path: "picture",
              select: "path name extname base"
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

var preFindOneMethod = /*#__PURE__*/function () {
  var _ref2 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.populate([{
              path: "parent"
            }, {
              path: "children"
            }, {
              path: "icon"
            }, {
              path: "picture",
              select: "path name extname base"
            }]);
            next();

          case 2:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function preFindOneMethod(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

var preDeleteOneMethod = /*#__PURE__*/function () {
  var _ref3 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(next) {
    var _categoryReadResponse, _categoryReadResponse4, _categoryReadResponse5, _categoryReadResponse7, _categoryReadResponse8;

    var categoryService, categoryReadResponse, _categoryReadResponse2, _categoryReadResponse3, deleteAttachmentResponse, _categoryReadResponse6, deletePostsResponse, _categoryReadResponse9, deleteJobsResponse;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            categoryService = new _Category["default"](this.model);
            _context3.next = 3;
            return categoryService.readOne(this.getQuery());

          case 3:
            categoryReadResponse = _context3.sent;

            if (!(categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : categoryReadResponse.error)) {
              _context3.next = 6;
              break;
            }

            return _context3.abrupt("return", next(categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : categoryReadResponse.errors));

          case 6:
            if (!(categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : (_categoryReadResponse = categoryReadResponse.data) === null || _categoryReadResponse === void 0 ? void 0 : _categoryReadResponse.picture)) {
              _context3.next = 12;
              break;
            }

            _context3.next = 9;
            return _Attachment["default"].deleteOne({
              _id: categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : (_categoryReadResponse2 = categoryReadResponse.data) === null || _categoryReadResponse2 === void 0 ? void 0 : (_categoryReadResponse3 = _categoryReadResponse2.picture) === null || _categoryReadResponse3 === void 0 ? void 0 : _categoryReadResponse3._id
            });

          case 9:
            deleteAttachmentResponse = _context3.sent;

            if (!(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.error)) {
              _context3.next = 12;
              break;
            }

            return _context3.abrupt("return", next(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.errors));

          case 12:
            if (!(categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : (_categoryReadResponse4 = categoryReadResponse.data) === null || _categoryReadResponse4 === void 0 ? void 0 : (_categoryReadResponse5 = _categoryReadResponse4.posts) === null || _categoryReadResponse5 === void 0 ? void 0 : _categoryReadResponse5.length)) {
              _context3.next = 18;
              break;
            }

            _context3.next = 15;
            return _Post["default"].deleteMany({
              _id: {
                $in: categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : (_categoryReadResponse6 = categoryReadResponse.data) === null || _categoryReadResponse6 === void 0 ? void 0 : _categoryReadResponse6.posts
              }
            });

          case 15:
            deletePostsResponse = _context3.sent;

            if (!(deletePostsResponse === null || deletePostsResponse === void 0 ? void 0 : deletePostsResponse.error)) {
              _context3.next = 18;
              break;
            }

            return _context3.abrupt("return", next(deletePostsResponse === null || deletePostsResponse === void 0 ? void 0 : deletePostsResponse.errors));

          case 18:
            if (!(categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : (_categoryReadResponse7 = categoryReadResponse.data) === null || _categoryReadResponse7 === void 0 ? void 0 : (_categoryReadResponse8 = _categoryReadResponse7.jobs) === null || _categoryReadResponse8 === void 0 ? void 0 : _categoryReadResponse8.length)) {
              _context3.next = 24;
              break;
            }

            _context3.next = 21;
            return _Job["default"].deleteMany({
              _id: {
                $in: categoryReadResponse === null || categoryReadResponse === void 0 ? void 0 : (_categoryReadResponse9 = categoryReadResponse.data) === null || _categoryReadResponse9 === void 0 ? void 0 : _categoryReadResponse9.jobs
              }
            });

          case 21:
            deleteJobsResponse = _context3.sent;

            if (!(deleteJobsResponse === null || deleteJobsResponse === void 0 ? void 0 : deleteJobsResponse.error)) {
              _context3.next = 24;
              break;
            }

            return _context3.abrupt("return", next(deleteJobsResponse === null || deleteJobsResponse === void 0 ? void 0 : deleteJobsResponse.errors));

          case 24:
            next();

          case 25:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));

  return function preDeleteOneMethod(_x3) {
    return _ref3.apply(this, arguments);
  };
}();

CategorySchema.plugin(_mongoosePaginateV["default"]);
CategorySchema.plugin(_mongooseSlugUpdater["default"]);
CategorySchema.pre("find", preFindMethod);
CategorySchema.pre("findOne", preFindOneMethod);
CategorySchema.pre("deleteOne", preDeleteOneMethod); //
// ─── SCHEMA MODEL ───────────────────────────────────────────────────────────────
//

var Category = _mongoose["default"].model("Category", CategorySchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = Category;
exports["default"] = _default;