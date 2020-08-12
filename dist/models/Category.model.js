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

var _Attachment = _interopRequireDefault(require("./Attachment.model"));

var _Post = _interopRequireDefault(require("./Post.model"));

var _Job = _interopRequireDefault(require("./Job.model"));

var _Category = _interopRequireDefault(require("../services/Category"));

var _Attachment2 = _interopRequireDefault(require("../services/Attachment"));

var _Post2 = _interopRequireDefault(require("../services/Post"));

var _Job2 = _interopRequireDefault(require("../services/Job"));

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

function preFindMethod(_x) {
  return _preFindMethod.apply(this, arguments);
}

function _preFindMethod() {
  _preFindMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(next) {
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
  return _preFindMethod.apply(this, arguments);
}

function preFindOneMethod(_x2) {
  return _preFindOneMethod.apply(this, arguments);
}

function _preFindOneMethod() {
  _preFindOneMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(next) {
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
  return _preFindOneMethod.apply(this, arguments);
}

function preDeleteOneMethod(_x3) {
  return _preDeleteOneMethod.apply(this, arguments);
}

function _preDeleteOneMethod() {
  _preDeleteOneMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(next) {
    var _categoryReadResponse, _categoryReadResponse4, _categoryReadResponse5, _categoryReadResponse6, _categoryReadResponse7;

    var categoryService, attachmentService, postService, jobService, categoryReadResponse, _categoryReadResponse2, _categoryReadResponse3, deleteAttachmentResponse, deletePostsResponse, deleteJobsResponse;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            categoryService = new _Category["default"](this.model);
            attachmentService = new _Attachment2["default"](_Attachment["default"]);
            postService = new _Post2["default"](_Post["default"]);
            jobService = new _Job2["default"](_Job["default"]);
            _context3.next = 6;
            return categoryService.readOne(this.getQuery());

          case 6:
            categoryReadResponse = _context3.sent;

            if (!categoryReadResponse.error) {
              _context3.next = 9;
              break;
            }

            return _context3.abrupt("return", next(categoryReadResponse.errors));

          case 9:
            if (!((_categoryReadResponse = categoryReadResponse.data) === null || _categoryReadResponse === void 0 ? void 0 : _categoryReadResponse.picture)) {
              _context3.next = 15;
              break;
            }

            _context3.next = 12;
            return attachmentService.deleteOne({
              _id: (_categoryReadResponse2 = categoryReadResponse.data) === null || _categoryReadResponse2 === void 0 ? void 0 : (_categoryReadResponse3 = _categoryReadResponse2.picture) === null || _categoryReadResponse3 === void 0 ? void 0 : _categoryReadResponse3._id
            });

          case 12:
            deleteAttachmentResponse = _context3.sent;

            if (!deleteAttachmentResponse.error) {
              _context3.next = 15;
              break;
            }

            return _context3.abrupt("return", next(deleteAttachmentResponse.errors));

          case 15:
            if (!((_categoryReadResponse4 = categoryReadResponse.data) === null || _categoryReadResponse4 === void 0 ? void 0 : (_categoryReadResponse5 = _categoryReadResponse4.posts) === null || _categoryReadResponse5 === void 0 ? void 0 : _categoryReadResponse5.length)) {
              _context3.next = 21;
              break;
            }

            _context3.next = 18;
            return postService.deleteMany({
              _id: {
                $in: categoryReadResponse.data.posts
              }
            });

          case 18:
            deletePostsResponse = _context3.sent;

            if (!deletePostsResponse.error) {
              _context3.next = 21;
              break;
            }

            return _context3.abrupt("return", next(deletePostsResponse.errors));

          case 21:
            if (!((_categoryReadResponse6 = categoryReadResponse.data) === null || _categoryReadResponse6 === void 0 ? void 0 : (_categoryReadResponse7 = _categoryReadResponse6.jobs) === null || _categoryReadResponse7 === void 0 ? void 0 : _categoryReadResponse7.length)) {
              _context3.next = 27;
              break;
            }

            _context3.next = 24;
            return jobService.deleteMany({
              _id: {
                $in: categoryReadResponse.data.jobs
              }
            });

          case 24:
            deleteJobsResponse = _context3.sent;

            if (!deleteJobsResponse.error) {
              _context3.next = 27;
              break;
            }

            return _context3.abrupt("return", next(deleteJobsResponse.errors));

          case 27:
            next();

          case 28:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _preDeleteOneMethod.apply(this, arguments);
}

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