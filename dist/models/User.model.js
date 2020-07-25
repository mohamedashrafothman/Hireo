"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _mongooseSlugUpdater = _interopRequireDefault(require("mongoose-slug-updater"));

var _crypto = _interopRequireDefault(require("crypto"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

var _validator = require("validator");

var _mongoosePaginateV = _interopRequireDefault(require("mongoose-paginate-v2"));

var _mongoose = _interopRequireDefault(require("mongoose"));

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
    skills: [{
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Skill",
      index: true
    }],
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
// ─── SCHEMA HOOKS ───────────────────────────────────────────────────────────────
//

UserSchema.pre("save", function (next) {
  var user = this; // skip it stop this function from running

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
}); //
// ─── SCHEMA METHODS ─────────────────────────────────────────────────────────────
//

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  _bcryptjs["default"].compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

UserSchema.methods.gravatar = function (size, user) {
  if (!size) size = 200; // default size.

  if (!user) user = this.email; // default email is this schema email.

  var md5 = _crypto["default"].createHash("md5").update(user).digest("hex");

  return "https://gravatar.com/avatar/".concat(md5, "?s=").concat(size, "&d=retro");
}; //
// ─── SCHEMA PLUGINS ─────────────────────────────────────────────────────────────
//


UserSchema.plugin(_mongoosePaginateV["default"]);
UserSchema.plugin(_mongooseSlugUpdater["default"]); //
// ─── SCHEMA model ───────────────────────────────────────────────────────────────
//

var User = _mongoose["default"].model("User", UserSchema); //
// ─── EXPORTING SCHEMA ───────────────────────────────────────────────────────────
//


var _default = User;
exports["default"] = _default;