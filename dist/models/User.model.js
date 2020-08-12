"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongooseSlugUpdater = _interopRequireDefault(require("mongoose-slug-updater"));

var _crypto = _interopRequireDefault(require("crypto"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _validator = require("validator");

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _Skill = _interopRequireDefault(require("./Skill.model"));

var _Attachment = _interopRequireDefault(require("./Attachment.model"));

var _Job = _interopRequireDefault(require("./Job.model"));

var _Application = _interopRequireDefault(require("./Application.model"));

var _Post = _interopRequireDefault(require("./Post.model"));

var _User = _interopRequireDefault(require("../services/User"));

var _Attachment2 = _interopRequireDefault(require("../services/Attachment"));

var _Skill2 = _interopRequireDefault(require("../services/Skill"));

var _Job2 = _interopRequireDefault(require("../services/Job"));

var _Application2 = _interopRequireDefault(require("../services/Application"));

var _Post2 = _interopRequireDefault(require("../services/Post"));

/* eslint-disable import/no-cycle */

/* eslint-disable func-names */
//
// ─── DEFINING SCHEMA ────────────────────────────────────────────────────────────
//
var UserSchema = new _mongoose["default"].Schema({
  password: {
    type: String
  },
  hash: {
    type: String
  },
  is_active: {
    type: Boolean,
    "default": false
  },
  is_verified: {
    type: Boolean,
    "default": false
  },
  slug: {
    type: String,
    slug: "account.name",
    uniqueSlug: true,
    index: true,
    slugPaddingSize: 6
  },
  email: {
    type: String,
    unique: true,
    index: true,
    lowercase: true,
    trim: true,
    validate: [_validator.isEmail, "Invalid Email Address"]
  },
  account: {
    name: {
      type: String,
      trim: true,
      index: true
    },
    username: {
      type: String,
      trim: true,
      unique: true,
      index: true
    },
    gender: String,
    website: String,
    picture: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    },
    picture_sm: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    },
    picture_md: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    },
    picture_lg: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    }
  },
  profile: {
    skills: {
      type: [{
        type: _mongoose["default"].Schema.Types.ObjectId,
        ref: "Skill",
        index: true
      }],
      validate: [function (val) {
        return val.length <= 10;
      }, "{PATH} exceeds the limit of 10"]
    },
    nationality: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Nationality"
    },
    hourly_rate: {
      type: Number,
      "default": 5,
      min: 5,
      max: 300,
      index: true
    },
    tagline: {
      type: String,
      validate: [function (val) {
        return val.length <= 100;
      }, "{PATH} exceeds the limit of 100 letter."],
      index: true
    },
    description: {
      type: String,
      validate: [function (val) {
        return val.length <= 500;
      }, "{PATH} exceeds the limit of 500 letter."]
    },
    social_accounts: {
      dribbble: {
        type: String,
        trim: true
      },
      twitter: {
        type: String,
        trim: true
      },
      behance: {
        type: String,
        trim: true
      },
      github: {
        type: String,
        trim: true
      }
    },
    attachments: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Attachment"
    }]
  },
  bookmarked: {
    freelancer: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: void 0
    }],
    employer: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: void 0
    }],
    job: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Job"
    }]
  },
  jobs: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Job"
  }],
  posts: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Post"
  }],
  applications: [{
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Application"
  }],
  google: String,
  facebook: String,
  tokens: Array,
  resetPasswordToken: {
    type: String,
    "default": undefined
  },
  resetPasswordExpires: {
    type: Date,
    "default": undefined
  },
  role: {
    type: String,
    "default": "freelancer"
  }
}, {
  timestamps: {
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
}); //
// ─── SCHEMA METHODS ─────────────────────────────────────────────────────────────
//

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcryptjs["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.gravatar = function () {
  var size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 200;
  var user = arguments.length > 1 ? arguments[1] : undefined;
  // eslint-disable-next-line no-param-reassign
  if (!user) user = this.email; // default email is this schema email.

  var md5 = _crypto["default"].createHash("md5").update(user).digest("hex");

  return "https://gravatar.com/avatar/".concat(md5, "?s=").concat(size, "&d=retro");
}; //
// ─── SCHEMA PLUGINS AND HOOKS ───────────────────────────────────────────────────
//


var preSaveMethod = function preSaveMethod(next) {
  var user = this;
  if (!user.isModified("password")) return next();

  _bcryptjs["default"].genSalt(Number(process.env.PASSWORD_HASH_ROUNDS), function (err, salt) {
    if (err) return next(err);

    _bcryptjs["default"].hash(user.password, salt, /*#__PURE__*/function () {
      var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(err2, hash) {
        var RandomBytes;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!err2) {
                  _context.next = 2;
                  break;
                }

                return _context.abrupt("return", next(err2));

              case 2:
                _context.next = 4;
                return _crypto["default"].randomBytes(16).toString("hex");

              case 4:
                RandomBytes = _context.sent;
                user.password = hash;
                user.hash = RandomBytes;
                next();

              case 8:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }());
  });
};

function preFindMethod(_x3) {
  return _preFindMethod.apply(this, arguments);
}

function _preFindMethod() {
  _preFindMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(next) {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            this.populate([{
              path: "profile.skills"
            }, {
              path: "profile.nationality",
              select: "code name"
            }, {
              path: "profile.attachments",
              select: "path name extname base"
            }, {
              path: "account.picture",
              select: "path name extname base"
            }, {
              path: "account.picture_sm",
              select: "path name extname base"
            }, {
              path: "account.picture_md",
              select: "path name extname base"
            }, {
              path: "account.picture_lg",
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
  return _preFindMethod.apply(this, arguments);
}

function preFindOneMethod(_x4) {
  return _preFindOneMethod.apply(this, arguments);
}

function _preFindOneMethod() {
  _preFindOneMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(next) {
    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            this.populate([{
              path: "profile.skills"
            }, {
              path: "profile.nationality",
              select: "code name"
            }, {
              path: "profile.attachments",
              select: "path name extname base"
            }, {
              path: "account.picture",
              select: "path name extname base"
            }, {
              path: "account.picture_sm",
              select: "path name extname base"
            }, {
              path: "account.picture_md",
              select: "path name extname base"
            }, {
              path: "account.picture_lg",
              select: "path name extname base"
            }, {
              path: "bookmarked.job"
            }, {
              path: "bookmarked.freelancer"
            }, {
              path: "bookmarked.employer"
            }]);
            next();

          case 2:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this);
  }));
  return _preFindOneMethod.apply(this, arguments);
}

function preDeleteOneMethod(_x5) {
  return _preDeleteOneMethod.apply(this, arguments);
}

function _preDeleteOneMethod() {
  _preDeleteOneMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(next) {
    var _readUserResponse$dat, _readUserResponse$dat2, _readUserResponse$dat3, _readUserResponse$dat4, _readUserResponse$dat5, _readUserResponse$dat6, _readUserResponse$dat12, _readUserResponse$dat13, _readUserResponse$dat14, _readUserResponse$dat15, _readUserResponse$dat16, _readUserResponse$dat17, _readUserResponse$dat18, _readUserResponse$dat19, _readUserResponse$dat20, _readUserResponse$dat21, _readUserResponse$dat22, _readUserResponse$dat34, _readUserResponse$dat35, _readUserResponse$dat36, _readUserResponse$dat40, _readUserResponse$dat41, _readUserResponse$dat43, _readUserResponse$dat44, _readUserResponse$dat46, _readUserResponse$dat47;

    var userService, attachmentService, skillService, jobService, applicationService, postService, readUserResponse, _readUserResponse$dat7, _readUserResponse$dat8, _readUserResponse$dat9, _readUserResponse$dat10, _readUserResponse$dat11, updateUserResponse, _readUserResponse$dat23, _readUserResponse$dat24, _readUserResponse$dat25, _readUserResponse$dat26, _readUserResponse$dat27, _readUserResponse$dat28, _readUserResponse$dat29, _readUserResponse$dat30, _readUserResponse$dat31, _readUserResponse$dat32, _readUserResponse$dat33, attachmentIds, deleteAttachmentResponse, _readUserResponse$dat37, _readUserResponse$dat38, _readUserResponse$dat39, updateSkillResponse, _readUserResponse$dat42, deleteJobsResponse, _readUserResponse$dat45, deleteApplicationsResponse, _readUserResponse$dat48, deletePostsResponse;

    return _regenerator["default"].wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            userService = new _User["default"](this.model);
            attachmentService = new _Attachment2["default"](_Attachment["default"]);
            skillService = new _Skill2["default"](_Skill["default"]);
            jobService = new _Job2["default"](_Job["default"]);
            applicationService = new _Application2["default"](_Application["default"]);
            postService = new _Post2["default"](_Post["default"]);
            _context4.next = 8;
            return userService.readOne(this.getQuery());

          case 8:
            readUserResponse = _context4.sent;

            if (!(readUserResponse === null || readUserResponse === void 0 ? void 0 : readUserResponse.error)) {
              _context4.next = 11;
              break;
            }

            return _context4.abrupt("return", next(readUserResponse === null || readUserResponse === void 0 ? void 0 : readUserResponse.errors));

          case 11:
            if (!((readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat = readUserResponse.data) === null || _readUserResponse$dat === void 0 ? void 0 : (_readUserResponse$dat2 = _readUserResponse$dat.bookmarked) === null || _readUserResponse$dat2 === void 0 ? void 0 : (_readUserResponse$dat3 = _readUserResponse$dat2.freelancer) === null || _readUserResponse$dat3 === void 0 ? void 0 : _readUserResponse$dat3.length) || (readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat4 = readUserResponse.data) === null || _readUserResponse$dat4 === void 0 ? void 0 : (_readUserResponse$dat5 = _readUserResponse$dat4.bookmarked) === null || _readUserResponse$dat5 === void 0 ? void 0 : (_readUserResponse$dat6 = _readUserResponse$dat5.employer) === null || _readUserResponse$dat6 === void 0 ? void 0 : _readUserResponse$dat6.length))) {
              _context4.next = 17;
              break;
            }

            _context4.next = 14;
            return userService.updateMany((0, _defineProperty2["default"])({
              _id: {
                $ne: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat7 = readUserResponse.data) === null || _readUserResponse$dat7 === void 0 ? void 0 : _readUserResponse$dat7._id
              }
            }, "bookmarked.".concat(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat8 = readUserResponse.data) === null || _readUserResponse$dat8 === void 0 ? void 0 : _readUserResponse$dat8.role), readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat9 = readUserResponse.data) === null || _readUserResponse$dat9 === void 0 ? void 0 : _readUserResponse$dat9._id), {
              $pull: (0, _defineProperty2["default"])({}, "bookmarked.".concat(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat10 = readUserResponse.data) === null || _readUserResponse$dat10 === void 0 ? void 0 : _readUserResponse$dat10.role), readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat11 = readUserResponse.data) === null || _readUserResponse$dat11 === void 0 ? void 0 : _readUserResponse$dat11._id)
            });

          case 14:
            updateUserResponse = _context4.sent;

            if (!(updateUserResponse === null || updateUserResponse === void 0 ? void 0 : updateUserResponse.error)) {
              _context4.next = 17;
              break;
            }

            return _context4.abrupt("return", next(updateUserResponse === null || updateUserResponse === void 0 ? void 0 : updateUserResponse.errors));

          case 17:
            if (!((readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat12 = readUserResponse.data) === null || _readUserResponse$dat12 === void 0 ? void 0 : (_readUserResponse$dat13 = _readUserResponse$dat12.account) === null || _readUserResponse$dat13 === void 0 ? void 0 : _readUserResponse$dat13.picture) || (readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat14 = readUserResponse.data) === null || _readUserResponse$dat14 === void 0 ? void 0 : (_readUserResponse$dat15 = _readUserResponse$dat14.account) === null || _readUserResponse$dat15 === void 0 ? void 0 : _readUserResponse$dat15.picture_sm) || (readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat16 = readUserResponse.data) === null || _readUserResponse$dat16 === void 0 ? void 0 : (_readUserResponse$dat17 = _readUserResponse$dat16.account) === null || _readUserResponse$dat17 === void 0 ? void 0 : _readUserResponse$dat17.picture_md) || (readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat18 = readUserResponse.data) === null || _readUserResponse$dat18 === void 0 ? void 0 : (_readUserResponse$dat19 = _readUserResponse$dat18.account) === null || _readUserResponse$dat19 === void 0 ? void 0 : _readUserResponse$dat19.picture_lg) || (readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat20 = readUserResponse.data) === null || _readUserResponse$dat20 === void 0 ? void 0 : (_readUserResponse$dat21 = _readUserResponse$dat20.profile) === null || _readUserResponse$dat21 === void 0 ? void 0 : (_readUserResponse$dat22 = _readUserResponse$dat21.attachments) === null || _readUserResponse$dat22 === void 0 ? void 0 : _readUserResponse$dat22.length))) {
              _context4.next = 24;
              break;
            }

            attachmentIds = [readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat23 = readUserResponse.data) === null || _readUserResponse$dat23 === void 0 ? void 0 : (_readUserResponse$dat24 = _readUserResponse$dat23.account) === null || _readUserResponse$dat24 === void 0 ? void 0 : _readUserResponse$dat24.picture._id, readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat25 = readUserResponse.data) === null || _readUserResponse$dat25 === void 0 ? void 0 : (_readUserResponse$dat26 = _readUserResponse$dat25.account) === null || _readUserResponse$dat26 === void 0 ? void 0 : _readUserResponse$dat26.picture_sm._id, readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat27 = readUserResponse.data) === null || _readUserResponse$dat27 === void 0 ? void 0 : (_readUserResponse$dat28 = _readUserResponse$dat27.account) === null || _readUserResponse$dat28 === void 0 ? void 0 : _readUserResponse$dat28.picture_md._id, readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat29 = readUserResponse.data) === null || _readUserResponse$dat29 === void 0 ? void 0 : (_readUserResponse$dat30 = _readUserResponse$dat29.account) === null || _readUserResponse$dat30 === void 0 ? void 0 : _readUserResponse$dat30.picture_lg._id].concat((0, _toConsumableArray2["default"])(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat31 = readUserResponse.data) === null || _readUserResponse$dat31 === void 0 ? void 0 : (_readUserResponse$dat32 = _readUserResponse$dat31.profile) === null || _readUserResponse$dat32 === void 0 ? void 0 : (_readUserResponse$dat33 = _readUserResponse$dat32.attachments) === null || _readUserResponse$dat33 === void 0 ? void 0 : _readUserResponse$dat33.map(function (attachment) {
              return attachment._id;
            })));
            _context4.next = 21;
            return attachmentService.deleteMany({
              _id: {
                $in: attachmentIds
              }
            });

          case 21:
            deleteAttachmentResponse = _context4.sent;

            if (!(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.error)) {
              _context4.next = 24;
              break;
            }

            return _context4.abrupt("return", next(deleteAttachmentResponse === null || deleteAttachmentResponse === void 0 ? void 0 : deleteAttachmentResponse.errors));

          case 24:
            if (!(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat34 = readUserResponse.data) === null || _readUserResponse$dat34 === void 0 ? void 0 : (_readUserResponse$dat35 = _readUserResponse$dat34.profile) === null || _readUserResponse$dat35 === void 0 ? void 0 : (_readUserResponse$dat36 = _readUserResponse$dat35.skills) === null || _readUserResponse$dat36 === void 0 ? void 0 : _readUserResponse$dat36.length)) {
              _context4.next = 30;
              break;
            }

            _context4.next = 27;
            return skillService.updateMany({
              _id: {
                $in: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat37 = readUserResponse.data) === null || _readUserResponse$dat37 === void 0 ? void 0 : (_readUserResponse$dat38 = _readUserResponse$dat37.profile) === null || _readUserResponse$dat38 === void 0 ? void 0 : _readUserResponse$dat38.skills.map(function (skill) {
                  return skill._id;
                })
              }
            }, {
              $pull: {
                users: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat39 = readUserResponse.data) === null || _readUserResponse$dat39 === void 0 ? void 0 : _readUserResponse$dat39._id
              }
            });

          case 27:
            updateSkillResponse = _context4.sent;

            if (!(updateSkillResponse === null || updateSkillResponse === void 0 ? void 0 : updateSkillResponse.error)) {
              _context4.next = 30;
              break;
            }

            return _context4.abrupt("return", next(updateSkillResponse === null || updateSkillResponse === void 0 ? void 0 : updateSkillResponse.errors));

          case 30:
            if (!(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat40 = readUserResponse.data) === null || _readUserResponse$dat40 === void 0 ? void 0 : (_readUserResponse$dat41 = _readUserResponse$dat40.jobs) === null || _readUserResponse$dat41 === void 0 ? void 0 : _readUserResponse$dat41.length)) {
              _context4.next = 36;
              break;
            }

            _context4.next = 33;
            return jobService.deleteMany({
              created_by: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat42 = readUserResponse.data) === null || _readUserResponse$dat42 === void 0 ? void 0 : _readUserResponse$dat42._id
            });

          case 33:
            deleteJobsResponse = _context4.sent;

            if (!(deleteJobsResponse === null || deleteJobsResponse === void 0 ? void 0 : deleteJobsResponse.error)) {
              _context4.next = 36;
              break;
            }

            return _context4.abrupt("return", next(deleteJobsResponse === null || deleteJobsResponse === void 0 ? void 0 : deleteJobsResponse.errors));

          case 36:
            if (!(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat43 = readUserResponse.data) === null || _readUserResponse$dat43 === void 0 ? void 0 : (_readUserResponse$dat44 = _readUserResponse$dat43.applications) === null || _readUserResponse$dat44 === void 0 ? void 0 : _readUserResponse$dat44.length)) {
              _context4.next = 42;
              break;
            }

            _context4.next = 39;
            return applicationService.deleteMany({
              created_by: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat45 = readUserResponse.data) === null || _readUserResponse$dat45 === void 0 ? void 0 : _readUserResponse$dat45._id
            });

          case 39:
            deleteApplicationsResponse = _context4.sent;

            if (!(deleteApplicationsResponse === null || deleteApplicationsResponse === void 0 ? void 0 : deleteApplicationsResponse.error)) {
              _context4.next = 42;
              break;
            }

            return _context4.abrupt("return", next(deleteApplicationsResponse === null || deleteApplicationsResponse === void 0 ? void 0 : deleteApplicationsResponse.errors));

          case 42:
            if (!(readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat46 = readUserResponse.data) === null || _readUserResponse$dat46 === void 0 ? void 0 : (_readUserResponse$dat47 = _readUserResponse$dat46.posts) === null || _readUserResponse$dat47 === void 0 ? void 0 : _readUserResponse$dat47.length)) {
              _context4.next = 48;
              break;
            }

            _context4.next = 45;
            return postService.deleteMany({
              created_by: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat48 = readUserResponse.data) === null || _readUserResponse$dat48 === void 0 ? void 0 : _readUserResponse$dat48._id
            });

          case 45:
            deletePostsResponse = _context4.sent;

            if (!(deletePostsResponse === null || deletePostsResponse === void 0 ? void 0 : deletePostsResponse.error)) {
              _context4.next = 48;
              break;
            }

            return _context4.abrupt("return", next(deletePostsResponse === null || deletePostsResponse === void 0 ? void 0 : deletePostsResponse.errors));

          case 48:
            next();

          case 49:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this);
  }));
  return _preDeleteOneMethod.apply(this, arguments);
}

function preFindOneAndUpdateMethod(_x6) {
  return _preFindOneAndUpdateMethod.apply(this, arguments);
}

function _preFindOneAndUpdateMethod() {
  _preFindOneAndUpdateMethod = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(next) {
    var _readUserResponse$dat49, _readUserResponse$dat50;

    var userService, skillService, readUserResponse, skillsRemoveUserResponse;
    return _regenerator["default"].wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            userService = new _User["default"](this.model);
            skillService = new _Skill2["default"](_Skill["default"]);
            _context5.next = 4;
            return userService.readOne(this.getQuery());

          case 4:
            readUserResponse = _context5.sent;

            if (!(readUserResponse === null || readUserResponse === void 0 ? void 0 : readUserResponse.error)) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", next(readUserResponse === null || readUserResponse === void 0 ? void 0 : readUserResponse.errors));

          case 7:
            _context5.next = 9;
            return skillService.updateMany({
              users: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat49 = readUserResponse.data) === null || _readUserResponse$dat49 === void 0 ? void 0 : _readUserResponse$dat49._id
            }, {
              $pull: {
                users: readUserResponse === null || readUserResponse === void 0 ? void 0 : (_readUserResponse$dat50 = readUserResponse.data) === null || _readUserResponse$dat50 === void 0 ? void 0 : _readUserResponse$dat50._id
              }
            });

          case 9:
            skillsRemoveUserResponse = _context5.sent;

            if (!skillsRemoveUserResponse.error) {
              _context5.next = 12;
              break;
            }

            return _context5.abrupt("return", next(skillsRemoveUserResponse.errors));

          case 12:
            next();

          case 13:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this);
  }));
  return _preFindOneAndUpdateMethod.apply(this, arguments);
}

UserSchema.plugin(_mongoosePaginateV["default"]);
UserSchema.plugin(_mongooseSlugUpdater["default"]);
UserSchema.pre("save", preSaveMethod);
UserSchema.pre("find", preFindMethod);
UserSchema.pre("findOne", preFindOneMethod);
UserSchema.pre("deleteOne", preDeleteOneMethod);
UserSchema.pre("findOneAndUpdate", preFindOneAndUpdateMethod); //
// ─── SCHEMA model ───────────────────────────────────────────────────────────────
//

var User = _mongoose["default"].model("User", UserSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = User;
exports["default"] = _default;