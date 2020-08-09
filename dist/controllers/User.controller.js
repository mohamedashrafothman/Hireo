"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _expressValidator = require("express-validator");

var _lodash = require("lodash");

var _qs = _interopRequireDefault(require("qs"));

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _path = _interopRequireDefault(require("path"));

var _multer = _interopRequireDefault(require("multer"));

var _passport = _interopRequireDefault(require("passport"));

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _User = _interopRequireDefault(require("../models/User.model"));

var _Email = _interopRequireDefault(require("../models/Email.model"));

var _Skill = _interopRequireDefault(require("../models/Skill.model"));

var _Session = _interopRequireDefault(require("../models/Session.model"));

var _Nationality = _interopRequireDefault(require("../models/Nationality.model"));

var _Attachment = _interopRequireDefault(require("../models/Attachment.model"));

var _Conversation = _interopRequireDefault(require("../models/Conversation.model"));

var _User2 = _interopRequireDefault(require("../services/User"));

var _Email2 = _interopRequireDefault(require("../services/Email"));

var _Skill2 = _interopRequireDefault(require("../services/Skill"));

var _Session2 = _interopRequireDefault(require("../services/Session"));

var _Nationality2 = _interopRequireDefault(require("../services/Nationality"));

var _Attachment2 = _interopRequireDefault(require("../services/Attachment"));

var _Conversation2 = _interopRequireDefault(require("../services/Conversation"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var userService = new _User2["default"](_User["default"]);
var emailService = new _Email2["default"](_Email["default"]);
var skillService = new _Skill2["default"](_Skill["default"]);
var sessionService = new _Session2["default"](_Session["default"]);
var nationalityService = new _Nationality2["default"](_Nationality["default"]);
var conversationService = new _Conversation2["default"](_Conversation["default"]);
var avatarAttachmentService = new _Attachment2["default"](_Attachment["default"]);
var profileInfoAttachmentService = new _Attachment2["default"](_Attachment["default"]);

var UserController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(UserController, _Controller);

  var _super = _createSuper(UserController);

  function UserController(service) {
    var _this;

    (0, _classCallCheck2["default"])(this, UserController);
    _this = _super.call(this, service);
    _this.getOauthUnlink = _this.getOauthUnlink.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getUserProfilePage = _this.getUserProfilePage.bind((0, _assertThisInitialized2["default"])(_this));
    _this.registerUser = _this.registerUser.bind((0, _assertThisInitialized2["default"])(_this));
    _this.verifyUser = _this.verifyUser.bind((0, _assertThisInitialized2["default"])(_this));
    _this.loginUser = _this.loginUser.bind((0, _assertThisInitialized2["default"])(_this));
    _this.forgotPassword = _this.forgotPassword.bind((0, _assertThisInitialized2["default"])(_this));
    _this.resetPassword = _this.resetPassword.bind((0, _assertThisInitialized2["default"])(_this));
    _this.logoutUser = _this.logoutUser.bind((0, _assertThisInitialized2["default"])(_this));
    _this.deleteUser = _this.deleteUser.bind((0, _assertThisInitialized2["default"])(_this));
    _this.changeAvailabilityStatus = _this.changeAvailabilityStatus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.passportLocalStrategy = _this.passportLocalStrategy.bind((0, _assertThisInitialized2["default"])(_this));
    _this.passportGoogleStrategy = _this.passportGoogleStrategy.bind((0, _assertThisInitialized2["default"])(_this));
    _this.passportFacebookStrategy = _this.passportFacebookStrategy.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getSettings = _this.getSettings.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updatePassword = _this.updatePassword.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updateAccountInfo = _this.updateAccountInfo.bind((0, _assertThisInitialized2["default"])(_this));
    _this.updateProfileInfo = _this.updateProfileInfo.bind((0, _assertThisInitialized2["default"])(_this));
    _this.removeProfileAttachment = _this.removeProfileAttachment.bind((0, _assertThisInitialized2["default"])(_this));
    _this.bookmarkUser = _this.bookmarkUser.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getBookmarkList = _this.getBookmarkList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.usersList = _this.usersList.bind((0, _assertThisInitialized2["default"])(_this));
    _this.changeVerificationStatus = _this.changeVerificationStatus.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getCompaniesByFirstLetter = _this.getCompaniesByFirstLetter.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getFreelancers = _this.getFreelancers.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(UserController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "register":
          return [(0, _expressValidator.body)("email").notEmpty().withMessage("Email must supply an E-mail.").isEmail().withMessage("Email must be in an E-mail format.").trim().normalizeEmail(), (0, _expressValidator.body)("role").notEmpty().withMessage("You must choose an account type!"), (0, _expressValidator.body)("account.name").notEmpty().withMessage("You must supply a name!").trim().escape(), (0, _expressValidator.body)("account.username").notEmpty().withMessage("You must supply a username!").trim().escape(), (0, _expressValidator.body)("password").notEmpty().withMessage("Password can't be blank!").isLength({
            min: Number(process.env.MINIMUM_PASSWORD_LENGTH)
          }).withMessage("Password must be at least ".concat(Number(process.env.MINIMUM_PASSWORD_LENGTH), " chars long")).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage("Password must include one lowercase character, one uppercase character, a number, and a special character."), (0, _expressValidator.body)("confirmPassword").notEmpty().withMessage("Confirm password cannot be blank!").custom(function (value, _ref) {
            var req = _ref.req;
            return value === req.body.password;
          }).withMessage("Your passwords don't match!")];

        case "login":
          return [(0, _expressValidator.body)("email").notEmpty().withMessage("You must be supply an Email!").isEmail().withMessage("Email must be in an E-mail format.").trim().normalizeEmail(), (0, _expressValidator.body)("password").notEmpty().withMessage("Password cannot be Blank!"), (0, _expressValidator.body)("remember").optional().toBoolean()];

        case "forgot password":
          return [(0, _expressValidator.body)("email").notEmpty().withMessage("You must be supply an Email!").isEmail().withMessage("Email must be in an E-mail format.").trim().normalizeEmail()];

        case "reset password":
          return [(0, _expressValidator.body)("password").notEmpty().withMessage("Password can't be blank!").isLength({
            min: Number(process.env.MINIMUM_PASSWORD_LENGTH)
          }).withMessage("Password must be at least ".concat(Number(process.env.MINIMUM_PASSWORD_LENGTH), " chars long")).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i").withMessage("Password must include one lowercase character, one uppercase character, a number, and a special character."), (0, _expressValidator.body)("confirmPassword").notEmpty().withMessage("Confirm password cannot be blank!").custom(function (value, _ref2) {
            var req = _ref2.req;
            return value === req.body.password;
          }).withMessage("Your passwords don't match!")];

        case "account info":
          return [(0, _expressValidator.body)("account.name").notEmpty().withMessage("Name field can't be blank.").trim().escape(), (0, _expressValidator.body)("account.username").notEmpty().withMessage("Username field can't be blank.").trim().escape()];

        case "profile info":
          return [(0, _expressValidator.body)("profile.description").notEmpty().withMessage("Description field can't be blank!").isLength({
            max: 500
          }).withMessage("Description can't be more that 500 letter.").trim().escape(), (0, _expressValidator.body)("profile.tagline").notEmpty().withMessage("Tagline field can't be blank!").trim().escape(), (0, _expressValidator.body)("profile.nationality").notEmpty().withMessage("Nationality field can't be blank!"), (0, _expressValidator.body)("profile.hourly_rate")["if"](function (value, _ref3) {
            var req = _ref3.req;
            return req.user.role !== "admin" || req.user.role !== "employer";
          }).notEmpty().withMessage("Hourly Rate field can't be blank!").isInt({
            min: 5,
            max: 300
          }).withMessage("Hourly Rate shall be between 5$ and 200$"), (0, _expressValidator.body)("profile.skills")["if"](function (value, _ref4) {
            var req = _ref4.req;
            return req.user.role !== "admin" || req.user.role !== "employer";
          }).notEmpty().withMessage("Skills field can't be blank!").isArray({
            min: 1,
            max: 10
          }).withMessage("Skills count shall be between 1 and 10")];

        default:
          return [];
      }
    }
  }, {
    key: "redirectToLogin",
    value: function () {
      var _redirectToLogin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res) {
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                res.redirect("/auth/login");

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function redirectToLogin(_x, _x2) {
        return _redirectToLogin.apply(this, arguments);
      }

      return redirectToLogin;
    }()
  }, {
    key: "isLoggedIn",
    value: function () {
      var _isLoggedIn = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res, next) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!req.user) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return", res.redirect("/"));

              case 2:
                next();

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function isLoggedIn(_x3, _x4, _x5) {
        return _isLoggedIn.apply(this, arguments);
      }

      return isLoggedIn;
    }()
  }, {
    key: "getRegistration",
    value: function () {
      var _getRegistration = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res) {
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                res.render("auth/register", {
                  page_title: "register"
                });

              case 1:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getRegistration(_x6, _x7) {
        return _getRegistration.apply(this, arguments);
      }

      return getRegistration;
    }()
  }, {
    key: "getLogin",
    value: function () {
      var _getLogin = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res) {
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                res.render("auth/login", {
                  page_title: "login"
                });

              case 1:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function getLogin(_x8, _x9) {
        return _getLogin.apply(this, arguments);
      }

      return getLogin;
    }()
  }, {
    key: "getForgotPassword",
    value: function () {
      var _getForgotPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res) {
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                res.render("auth/forgot", {
                  page_title: "Forgot Password"
                });

              case 1:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function getForgotPassword(_x10, _x11) {
        return _getForgotPassword.apply(this, arguments);
      }

      return getForgotPassword;
    }()
  }, {
    key: "getResetPassword",
    value: function () {
      var _getResetPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res) {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                res.render("auth/reset-password", {
                  title: "Reset Password"
                });

              case 1:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function getResetPassword(_x12, _x13) {
        return _getResetPassword.apply(this, arguments);
      }

      return getResetPassword;
    }()
  }, {
    key: "getOauthUnlink",
    value: function () {
      var _getOauthUnlink = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee7(req, res, next) {
        var provider, userUnlinkResponse;
        return _regenerator["default"].wrap(function _callee7$(_context7) {
          while (1) {
            switch (_context7.prev = _context7.next) {
              case 0:
                provider = req.params.provider;
                _context7.next = 3;
                return this.service.updateOne({
                  _id: "5e60390a9557170448f39503"
                }, {
                  $set: (0, _defineProperty2["default"])({}, provider, undefined),
                  $pull: {
                    tokens: {
                      kind: provider
                    }
                  }
                });

              case 3:
                userUnlinkResponse = _context7.sent;

                if (!userUnlinkResponse.error) {
                  _context7.next = 6;
                  break;
                }

                return _context7.abrupt("return", next(userUnlinkResponse.errors));

              case 6:
                req.flash("success", "".concat(provider, " account has been unlinked."));
                res.status(userUnlinkResponse.statusCode).redirect("/auth/profile/".concat(userUnlinkResponse.data.slug));

              case 8:
              case "end":
                return _context7.stop();
            }
          }
        }, _callee7, this);
      }));

      function getOauthUnlink(_x14, _x15, _x16) {
        return _getOauthUnlink.apply(this, arguments);
      }

      return getOauthUnlink;
    }()
  }, {
    key: "getUserProfilePage",
    value: function () {
      var _getUserProfilePage = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee8(req, res, next) {
        var old, userBySlugResponse;
        return _regenerator["default"].wrap(function _callee8$(_context8) {
          while (1) {
            switch (_context8.prev = _context8.next) {
              case 0:
                old = req.session.data && req.session.data.old ? req.session.data.old : null;
                req.session.data = null;
                _context8.next = 4;
                return this.service.getUserBySlug(req.params.slug);

              case 4:
                userBySlugResponse = _context8.sent;

                if (!userBySlugResponse.error) {
                  _context8.next = 9;
                  break;
                }

                if (!(userBySlugResponse.statusCode === 404)) {
                  _context8.next = 8;
                  break;
                }

                return _context8.abrupt("return", next());

              case 8:
                return _context8.abrupt("return", next(userBySlugResponse.errors));

              case 9:
                res.render("profile", {
                  page_title: "".concat(userBySlugResponse.data.account.name, " Profile"),
                  data: {
                    user: userBySlugResponse.data,
                    old: old
                  }
                });

              case 10:
              case "end":
                return _context8.stop();
            }
          }
        }, _callee8, this);
      }));

      function getUserProfilePage(_x17, _x18, _x19) {
        return _getUserProfilePage.apply(this, arguments);
      }

      return getUserProfilePage;
    }()
  }, {
    key: "oauthRedirect",
    value: function () {
      var _oauthRedirect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee9(req, res) {
        return _regenerator["default"].wrap(function _callee9$(_context9) {
          while (1) {
            switch (_context9.prev = _context9.next) {
              case 0:
                req.flash("success", "Successfully login process.");
                res.redirect("/");

              case 2:
              case "end":
                return _context9.stop();
            }
          }
        }, _callee9);
      }));

      function oauthRedirect(_x20, _x21) {
        return _oauthRedirect.apply(this, arguments);
      }

      return oauthRedirect;
    }()
  }, {
    key: "registerUser",
    value: function () {
      var _registerUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee10(req, res, next) {
        var errors, err, userRegisterResponse, userValidateEmailResponse;
        return _regenerator["default"].wrap(function _callee10$(_context10) {
          while (1) {
            switch (_context10.prev = _context10.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context10.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context10.abrupt("return", res.render("auth/register", {
                  page_title: "Register",
                  data: {
                    old: req.body
                  },
                  flashes: req.flash()
                }));

              case 5:
                _context10.next = 7;
                return this.service.register(req.body);

              case 7:
                userRegisterResponse = _context10.sent;

                if (!userRegisterResponse.error) {
                  _context10.next = 13;
                  break;
                }

                if (!(userRegisterResponse.statusCode === 202)) {
                  _context10.next = 12;
                  break;
                }

                req.flash("error", userRegisterResponse.errors);
                return _context10.abrupt("return", res.status(userRegisterResponse.statusCode).redirect("/auth/register"));

              case 12:
                return _context10.abrupt("return", next(userRegisterResponse.errors));

              case 13:
                _context10.next = 15;
                return emailService.send({
                  subject: "[".concat(process.env.SITE_NAME, "] Verify User Account"),
                  validateURL: "http://".concat(req.headers.host, "/auth/verify/").concat(userRegisterResponse.data.email, "/").concat(userRegisterResponse.data.hash),
                  to: userRegisterResponse.data,
                  filename: "verify-user",
                  from: String(process.env.MAIL_SENDER)
                });

              case 15:
                userValidateEmailResponse = _context10.sent;

                if (!userValidateEmailResponse.error) {
                  _context10.next = 18;
                  break;
                }

                return _context10.abrupt("return", next(userValidateEmailResponse.errors));

              case 18:
                req.flash("success", "You are registration process, Check your E-mail address to verify your account before you login.");
                res.status(userValidateEmailResponse.statusCode).redirect("/");

              case 20:
              case "end":
                return _context10.stop();
            }
          }
        }, _callee10, this);
      }));

      function registerUser(_x22, _x23, _x24) {
        return _registerUser.apply(this, arguments);
      }

      return registerUser;
    }()
  }, {
    key: "verifyUser",
    value: function () {
      var _verifyUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee11(req, res, next) {
        var userVerifyResponse;
        return _regenerator["default"].wrap(function _callee11$(_context11) {
          while (1) {
            switch (_context11.prev = _context11.next) {
              case 0:
                _context11.next = 2;
                return this.service.verify(req.params);

              case 2:
                userVerifyResponse = _context11.sent;

                if (!userVerifyResponse.error) {
                  _context11.next = 8;
                  break;
                }

                if (!(userVerifyResponse.statusCode === 404)) {
                  _context11.next = 7;
                  break;
                }

                req.flash("error", userVerifyResponse.errors);
                return _context11.abrupt("return", res.status(userVerifyResponse.statusCode).redirect("/auth/register"));

              case 7:
                return _context11.abrupt("return", next(userVerifyResponse.errors));

              case 8:
                req.flash("success", "Your account has been Verified");
                res.status(userVerifyResponse.statusCode).redirect("/auth/login");

              case 10:
              case "end":
                return _context11.stop();
            }
          }
        }, _callee11, this);
      }));

      function verifyUser(_x25, _x26, _x27) {
        return _verifyUser.apply(this, arguments);
      }

      return verifyUser;
    }()
  }, {
    key: "loginUser",
    value: function () {
      var _loginUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee14(req, res, next) {
        var _this2 = this;

        var errors, err;
        return _regenerator["default"].wrap(function _callee14$(_context14) {
          while (1) {
            switch (_context14.prev = _context14.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context14.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context14.abrupt("return", res.render("auth/login", {
                  page_title: "login",
                  data: {
                    old: req.body
                  },
                  flashes: req.flash()
                }));

              case 5:
                _passport["default"].authenticate("local", /*#__PURE__*/function () {
                  var _ref5 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee13(err, user, info) {
                    return _regenerator["default"].wrap(function _callee13$(_context13) {
                      while (1) {
                        switch (_context13.prev = _context13.next) {
                          case 0:
                            if (err) next(err);

                            if (user) {
                              _context13.next = 4;
                              break;
                            }

                            req.flash("error", info);
                            return _context13.abrupt("return", res.render("auth/login", {
                              page_title: "login",
                              data: {
                                old: req.body
                              },
                              flashes: req.flash()
                            }));

                          case 4:
                            req.login(user, /*#__PURE__*/function () {
                              var _ref6 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee12(loginError) {
                                var expire, userUpdateResponse, userUpdatedResponse, conversationsReadResponse, _req$app$get, io, returnTo;

                                return _regenerator["default"].wrap(function _callee12$(_context12) {
                                  while (1) {
                                    switch (_context12.prev = _context12.next) {
                                      case 0:
                                        if (!loginError) {
                                          _context12.next = 2;
                                          break;
                                        }

                                        return _context12.abrupt("return", next());

                                      case 2:
                                        if (req.body.remember) {
                                          expire = 1000 * 60 * 60 * process.env.COOKIES_MAX_AGE_IN_HOURS;
                                          req.session.cookie.expires = new Date(Date.now() + expire);
                                          req.session.cookie.maxAge = expire;
                                        } else {
                                          req.session.cookie.expires = false;
                                        } // updated logged in user.


                                        _context12.next = 5;
                                        return _this2.service.updateOne({
                                          email: user.email,
                                          is_active: 0
                                        }, {
                                          $set: {
                                            is_active: 1
                                          }
                                        });

                                      case 5:
                                        userUpdateResponse = _context12.sent;

                                        if (!userUpdateResponse.error) {
                                          _context12.next = 8;
                                          break;
                                        }

                                        return _context12.abrupt("return", next(userUpdateResponse.errors));

                                      case 8:
                                        _context12.next = 10;
                                        return _this2.service.readOne({
                                          _id: user._id
                                        });

                                      case 10:
                                        userUpdatedResponse = _context12.sent;

                                        if (!userUpdatedResponse.error) {
                                          _context12.next = 13;
                                          break;
                                        }

                                        return _context12.abrupt("return", next(userUpdatedResponse.errors));

                                      case 13:
                                        _context12.next = 15;
                                        return conversationService.readMany({
                                          users: userUpdatedResponse.data._id
                                        }, {
                                          pagination: false,
                                          select: "_id"
                                        });

                                      case 15:
                                        conversationsReadResponse = _context12.sent;

                                        if (!conversationsReadResponse.error) {
                                          _context12.next = 18;
                                          break;
                                        }

                                        return _context12.abrupt("return", next(conversationsReadResponse.errors));

                                      case 18:
                                        // Emit to user conversations channels, to notify other users.
                                        if (!(0, _lodash.isEmpty)(conversationsReadResponse.data)) {
                                          _req$app$get = req.app.get("io"), io = _req$app$get.io;
                                          conversationsReadResponse.data.forEach(function (conversation) {
                                            io.sockets["in"](conversation._id).emit("user/change_online_status", {
                                              id: userUpdatedResponse.data._id,
                                              is_active: userUpdatedResponse.data.is_active,
                                              name: userUpdatedResponse.data.account.name
                                            });
                                          });
                                        }

                                        returnTo = req.session.returnTo || "/";
                                        req.flash("success", "Successfully login process.");
                                        res.status(userUpdateResponse.statusCode).redirect(returnTo);

                                      case 22:
                                      case "end":
                                        return _context12.stop();
                                    }
                                  }
                                }, _callee12);
                              }));

                              return function (_x34) {
                                return _ref6.apply(this, arguments);
                              };
                            }());

                          case 5:
                          case "end":
                            return _context13.stop();
                        }
                      }
                    }, _callee13);
                  }));

                  return function (_x31, _x32, _x33) {
                    return _ref5.apply(this, arguments);
                  };
                }())(req, res, next);

              case 6:
              case "end":
                return _context14.stop();
            }
          }
        }, _callee14);
      }));

      function loginUser(_x28, _x29, _x30) {
        return _loginUser.apply(this, arguments);
      }

      return loginUser;
    }()
  }, {
    key: "forgotPassword",
    value: function () {
      var _forgotPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee15(req, res, next) {
        var errors, err, userForgotPasswordResponse, userUpdatePasswordEmailResponse;
        return _regenerator["default"].wrap(function _callee15$(_context15) {
          while (1) {
            switch (_context15.prev = _context15.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context15.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context15.abrupt("return", res.render("auth/forgot", {
                  page_title: "Forgot Password",
                  data: {
                    old: req.body
                  },
                  flashes: req.flash()
                }));

              case 5:
                _context15.next = 7;
                return this.service.forgotPassword(req.body);

              case 7:
                userForgotPasswordResponse = _context15.sent;

                if (!userForgotPasswordResponse.error) {
                  _context15.next = 11;
                  break;
                }

                if (userForgotPasswordResponse.statusCode === 404) {
                  req.flash("error", userForgotPasswordResponse.errors);
                  res.status(userForgotPasswordResponse.statusCode).redirect("/auth/forgot");
                }

                return _context15.abrupt("return", next(userForgotPasswordResponse.errors));

              case 11:
                _context15.next = 13;
                return emailService.send({
                  subject: "[".concat(process.env.SITE_NAME, "] Resetting Password."),
                  resetURL: "http://".concat(req.headers.host, "/auth/reset/").concat(userForgotPasswordResponse.data.resetPasswordToken),
                  to: userForgotPasswordResponse.data,
                  filename: "password-reset",
                  from: String(process.env.MAIL_SENDER)
                });

              case 13:
                userUpdatePasswordEmailResponse = _context15.sent;

                if (!userUpdatePasswordEmailResponse.error) {
                  _context15.next = 16;
                  break;
                }

                return _context15.abrupt("return", next(userUpdatePasswordEmailResponse.errors));

              case 16:
                req.flash("success", "You have been emailed a password link.");
                res.status(userUpdatePasswordEmailResponse.statusCode).redirect("/auth/login");

              case 18:
              case "end":
                return _context15.stop();
            }
          }
        }, _callee15, this);
      }));

      function forgotPassword(_x35, _x36, _x37) {
        return _forgotPassword.apply(this, arguments);
      }

      return forgotPassword;
    }()
  }, {
    key: "resetPassword",
    value: function () {
      var _resetPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee16(req, res, next) {
        var errors, err, userResetPasswordResponse, userResetPasswordEmailResponse;
        return _regenerator["default"].wrap(function _callee16$(_context16) {
          while (1) {
            switch (_context16.prev = _context16.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context16.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context16.abrupt("return", res.render("auth/reset-password", {
                  page_title: "reset password",
                  data: {
                    old: req.body
                  },
                  flashes: req.flash()
                }));

              case 5:
                _context16.next = 7;
                return this.service.resetPassword(req.body, req.params);

              case 7:
                userResetPasswordResponse = _context16.sent;

                if (!userResetPasswordResponse.error) {
                  _context16.next = 13;
                  break;
                }

                if (!(userResetPasswordResponse.statusCode === 404)) {
                  _context16.next = 12;
                  break;
                }

                req.flash("error", userResetPasswordResponse.errors);
                return _context16.abrupt("return", res.status(userResetPasswordResponse.statusCode).redirect("/auth/login"));

              case 12:
                return _context16.abrupt("return", next(userResetPasswordResponse.errors));

              case 13:
                _context16.next = 15;
                return emailService.send({
                  filename: "password-updated",
                  subject: "[".concat(process.env.SITE_NAME, "] Resetting Password Confirmation."),
                  to: userResetPasswordResponse.data,
                  from: String(process.env.MAIL_SENDER),
                  email: userResetPasswordResponse.data.email,
                  siteName: process.env.SITE_NAME
                });

              case 15:
                userResetPasswordEmailResponse = _context16.sent;

                if (!userResetPasswordEmailResponse.error) {
                  _context16.next = 18;
                  break;
                }

                return _context16.abrupt("return", next(userResetPasswordEmailResponse.errors));

              case 18:
                req.flash("success", "successfully updated password");
                res.status(userResetPasswordEmailResponse.statusCode).redirect("/auth/login");

              case 20:
              case "end":
                return _context16.stop();
            }
          }
        }, _callee16, this);
      }));

      function resetPassword(_x38, _x39, _x40) {
        return _resetPassword.apply(this, arguments);
      }

      return resetPassword;
    }()
  }, {
    key: "logoutUser",
    value: function () {
      var _logoutUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee17(req, res, next) {
        var _id, userUpdateResponse, conversationsReadResponse, _req$app$get2, io;

        return _regenerator["default"].wrap(function _callee17$(_context17) {
          while (1) {
            switch (_context17.prev = _context17.next) {
              case 0:
                _id = req.user._id;
                _context17.next = 3;
                return this.service.updateOne({
                  _id: _id
                }, {
                  $set: {
                    is_active: 0
                  }
                });

              case 3:
                userUpdateResponse = _context17.sent;

                if (!userUpdateResponse.error) {
                  _context17.next = 6;
                  break;
                }

                return _context17.abrupt("return", next(userUpdateResponse.errors));

              case 6:
                req.logout();
                req.user = null; // Get all conversations belongs to user.

                _context17.next = 10;
                return conversationService.readMany({
                  users: userUpdateResponse.data._id
                }, {
                  pagination: false,
                  select: "_id"
                });

              case 10:
                conversationsReadResponse = _context17.sent;

                if (!conversationsReadResponse.error) {
                  _context17.next = 13;
                  break;
                }

                return _context17.abrupt("return", next(conversationsReadResponse.errors));

              case 13:
                // Emit to user conversations channels, to notify other users.
                if (!(0, _lodash.isEmpty)(conversationsReadResponse.data)) {
                  _req$app$get2 = req.app.get("io"), io = _req$app$get2.io;
                  conversationsReadResponse.data.forEach(function (conversation) {
                    io.sockets["in"](conversation._id).emit("user/change_online_status", {
                      id: userUpdateResponse.data._id,
                      is_active: userUpdateResponse.data.is_active,
                      name: userUpdateResponse.data.account.name
                    });
                  });
                }

                req.flash("success", "Successfully logout process.");
                res.redirect("/");

              case 16:
              case "end":
                return _context17.stop();
            }
          }
        }, _callee17, this);
      }));

      function logoutUser(_x41, _x42, _x43) {
        return _logoutUser.apply(this, arguments);
      }

      return logoutUser;
    }()
  }, {
    key: "deleteUser",
    value: function () {
      var _deleteUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee18(req, res, next) {
        var id, userDeleteResponse, searchInBookmarksResponse, attachmentService, userAttachmentDeleteResponse, userAttachmentDeleteFilesResponse, userDeleteSkillsResponse;
        return _regenerator["default"].wrap(function _callee18$(_context18) {
          while (1) {
            switch (_context18.prev = _context18.next) {
              case 0:
                // Delete user record from user collection.
                id = req.params.id || req.user._id;
                _context18.next = 3;
                return this.service.deleteOne({
                  _id: id
                });

              case 3:
                userDeleteResponse = _context18.sent;

                if (!userDeleteResponse.error) {
                  _context18.next = 6;
                  break;
                }

                return _context18.abrupt("return", next(userDeleteResponse.errors));

              case 6:
                _context18.next = 8;
                return this.service.updateMany((0, _defineProperty2["default"])({
                  _id: {
                    $ne: id
                  }
                }, "bookmarked.".concat(userDeleteResponse.data.role), userDeleteResponse.data._id), {
                  $pull: (0, _defineProperty2["default"])({}, "bookmarked.".concat(userDeleteResponse.data.role), userDeleteResponse.data._id)
                });

              case 8:
                searchInBookmarksResponse = _context18.sent;

                if (!searchInBookmarksResponse.error) {
                  _context18.next = 11;
                  break;
                }

                return _context18.abrupt("return", next(searchInBookmarksResponse.errors));

              case 11:
                // Remove any attachments belongs to user from attachment collection.
                attachmentService = new _Attachment2["default"](_Attachment["default"]);
                _context18.next = 14;
                return attachmentService.deleteMany({
                  _id: {
                    $in: [].concat((0, _toConsumableArray2["default"])(userDeleteResponse.data.profile.attachments), [userDeleteResponse.data.account.picture, userDeleteResponse.data.account.picture_sm, userDeleteResponse.data.account.picture_md, userDeleteResponse.data.account.picture_lg]).filter(Boolean)
                  }
                }, {
                  pagination: false
                });

              case 14:
                userAttachmentDeleteResponse = _context18.sent;

                if (!userAttachmentDeleteResponse.error) {
                  _context18.next = 17;
                  break;
                }

                return _context18.abrupt("return", next(userAttachmentDeleteResponse.errors));

              case 17:
                _context18.next = 19;
                return attachmentService.handelFilesForDirDeletion(userAttachmentDeleteResponse.data.map(function (attachment) {
                  return attachment.path;
                }));

              case 19:
                userAttachmentDeleteFilesResponse = _context18.sent;

                if (!userAttachmentDeleteFilesResponse.error) {
                  _context18.next = 22;
                  break;
                }

                return _context18.abrupt("return", next(userAttachmentDeleteFilesResponse.errors));

              case 22:
                _context18.next = 24;
                return skillService.updateMany({
                  _id: {
                    $in: userDeleteResponse.data.profile.skills
                  }
                }, {
                  $pull: {
                    users: userDeleteResponse.data._id
                  }
                });

              case 24:
                userDeleteSkillsResponse = _context18.sent;

                if (!userDeleteSkillsResponse.error) {
                  _context18.next = 27;
                  break;
                }

                return _context18.abrupt("return", next(userDeleteSkillsResponse.errors));

              case 27:
                // TODO: Delete all job created by deleted user.
                // TODO: Delete all Applications belongs to deleted job and deleted user.
                req.flash("success", "".concat(userDeleteResponse.data.account.name, "'s Account deleted."));
                res.status(userDeleteResponse.statusCode).redirect("/");

              case 29:
              case "end":
                return _context18.stop();
            }
          }
        }, _callee18, this);
      }));

      function deleteUser(_x44, _x45, _x46) {
        return _deleteUser.apply(this, arguments);
      }

      return deleteUser;
    }()
  }, {
    key: "changeAvailabilityStatus",
    value: function () {
      var _changeAvailabilityStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee19(req, res, next) {
        var userChangeAvailabilityResponse, conversationsReadResponse, _req$app$get3, io;

        return _regenerator["default"].wrap(function _callee19$(_context19) {
          while (1) {
            switch (_context19.prev = _context19.next) {
              case 0:
                _context19.next = 2;
                return this.service.updateOne({
                  _id: req.user._id
                }, {
                  $set: {
                    is_active: !req.user.is_active
                  }
                });

              case 2:
                userChangeAvailabilityResponse = _context19.sent;

                if (!userChangeAvailabilityResponse.error) {
                  _context19.next = 5;
                  break;
                }

                return _context19.abrupt("return", next(userChangeAvailabilityResponse.errors));

              case 5:
                _context19.next = 7;
                return conversationService.readMany({
                  users: userChangeAvailabilityResponse.data._id
                }, {
                  pagination: false,
                  select: "_id"
                });

              case 7:
                conversationsReadResponse = _context19.sent;

                if (!conversationsReadResponse.error) {
                  _context19.next = 10;
                  break;
                }

                return _context19.abrupt("return", next(conversationsReadResponse.errors));

              case 10:
                // Emit to user conversations channels, to notify other users.
                if (!(0, _lodash.isEmpty)(conversationsReadResponse.data)) {
                  _req$app$get3 = req.app.get("io"), io = _req$app$get3.io;
                  conversationsReadResponse.data.forEach(function (conversation) {
                    io.sockets["in"](conversation._id).emit(userChangeAvailabilityResponse.data.is_active ? "user/change_online_status" : "user/change_online_status", {
                      id: userChangeAvailabilityResponse.data._id,
                      is_active: userChangeAvailabilityResponse.data.is_active,
                      name: userChangeAvailabilityResponse.data.account.name
                    });
                  });
                }

                res.json(userChangeAvailabilityResponse.data.is_active);

              case 12:
              case "end":
                return _context19.stop();
            }
          }
        }, _callee19, this);
      }));

      function changeAvailabilityStatus(_x47, _x48, _x49) {
        return _changeAvailabilityStatus.apply(this, arguments);
      }

      return changeAvailabilityStatus;
    }()
  }, {
    key: "isAuthenticated",
    value: function () {
      var _isAuthenticated = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee20(req, res, next) {
        return _regenerator["default"].wrap(function _callee20$(_context20) {
          while (1) {
            switch (_context20.prev = _context20.next) {
              case 0:
                if (!req.isAuthenticated()) {
                  _context20.next = 2;
                  break;
                }

                return _context20.abrupt("return", next());

              case 2:
                req.flash("error", "make sure you are logged in first!");
                res.redirect("/auth/login");

              case 4:
              case "end":
                return _context20.stop();
            }
          }
        }, _callee20);
      }));

      function isAuthenticated(_x50, _x51, _x52) {
        return _isAuthenticated.apply(this, arguments);
      }

      return isAuthenticated;
    }()
  }, {
    key: "isAuthorized",
    value: function () {
      var _isAuthorized = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee21(req, res, next) {
        var provider, token;
        return _regenerator["default"].wrap(function _callee21$(_context21) {
          while (1) {
            switch (_context21.prev = _context21.next) {
              case 0:
                provider = req.path.split("/").slice(-1)[0];
                token = req.user.tokens.find(function (userToken) {
                  return userToken.kind === provider;
                });

                if (token) {
                  next();
                } else {
                  res.redirect("/auth/".concat(provider));
                }

              case 3:
              case "end":
                return _context21.stop();
            }
          }
        }, _callee21);
      }));

      function isAuthorized(_x53, _x54, _x55) {
        return _isAuthorized.apply(this, arguments);
      }

      return isAuthorized;
    }()
  }, {
    key: "passportLocalStrategy",
    value: function () {
      var _passportLocalStrategy = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee22(email, password, done) {
        var _yield$this$service$r, user, err;

        return _regenerator["default"].wrap(function _callee22$(_context22) {
          while (1) {
            switch (_context22.prev = _context22.next) {
              case 0:
                _context22.next = 2;
                return this.service.readOne({
                  email: email.toLowerCase()
                });

              case 2:
                _yield$this$service$r = _context22.sent;
                user = _yield$this$service$r.data;
                err = _yield$this$service$r.errors;
                if (err) done(err);

                if (user) {
                  _context22.next = 8;
                  break;
                }

                return _context22.abrupt("return", done(null, false, {
                  msg: "Email ".concat(email, " not found.")
                }));

              case 8:
                user.comparePassword(password, function (comparePasswordError, isMatch) {
                  if (comparePasswordError) return done(comparePasswordError);
                  if (isMatch) return done(null, user);
                  return done(null, false, {
                    msg: "Invalid email or password."
                  });
                });

              case 9:
              case "end":
                return _context22.stop();
            }
          }
        }, _callee22, this);
      }));

      function passportLocalStrategy(_x56, _x57, _x58) {
        return _passportLocalStrategy.apply(this, arguments);
      }

      return passportLocalStrategy;
    }()
  }, {
    key: "passportGoogleStrategy",
    value: function () {
      var _passportGoogleStrategy = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee23(req, accessToken, refreshToken, profile, done) {
        var _yield$this$service$r2, existsUser, existsErr, _yield$this$service$r3, user, err, _yield$to, _yield$to2, saveError, _yield$this$service$r4, _existsUser, _existsErr, _yield$this$service$u, updatedUser, updatedErr, _yield$this$service$r5, existsEmail, existsEmailErr, _user, _yield$this$service$c, newUser, newUserErr;

        return _regenerator["default"].wrap(function _callee23$(_context23) {
          while (1) {
            switch (_context23.prev = _context23.next) {
              case 0:
                if (!req.user) {
                  _context23.next = 40;
                  break;
                }

                _context23.next = 3;
                return this.service.readOne({
                  google: profile.id
                });

              case 3:
                _yield$this$service$r2 = _context23.sent;
                existsUser = _yield$this$service$r2.data;
                existsErr = _yield$this$service$r2.errors;

                if (!existsErr) {
                  _context23.next = 8;
                  break;
                }

                return _context23.abrupt("return", done(existsErr));

              case 8:
                if (!existsUser) {
                  _context23.next = 14;
                  break;
                }

                req.flash("error", "There is already a Google account that belongs to you");
                req.flash("info", "Redirect to <strong><a href=\"http://".concat(req.headers.host, "/auth/forgot\">Forgot Password?</a></strong> to reset your password."));
                done(existsErr);
                _context23.next = 38;
                break;

              case 14:
                _context23.next = 16;
                return this.service.readOne({
                  _id: req.user.id
                });

              case 16:
                _yield$this$service$r3 = _context23.sent;
                user = _yield$this$service$r3.data;
                err = _yield$this$service$r3.errors;

                if (!err) {
                  _context23.next = 21;
                  break;
                }

                return _context23.abrupt("return", done(err));

              case 21:
                user.tokens.push({
                  kind: "google",
                  accessToken: accessToken
                });
                user.google = profile.id;
                user.account.username = user.account.username || "".concat(profile.name.givenName, " ").concat(profile.name.familyName) || "".concat(profile._json.name.givenName, " ").concat(profile._json.name.familyName);
                user.account.name = user.account.name || profile.displayName;
                user.account.picture = user.account.picture || profile._json.image.url;
                user.account.gender = user.account.gender || profile._json.gender;
                user.is_verified = 1;
                user.is_active = 1;
                _context23.next = 31;
                return (0, _awaitToJs["default"])(user.save());

              case 31:
                _yield$to = _context23.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 1);
                saveError = _yield$to2[0];

                if (!saveError) {
                  _context23.next = 36;
                  break;
                }

                return _context23.abrupt("return", done(saveError));

              case 36:
                req.flash("success", "Google account has been linked.");
                done(saveError, user);

              case 38:
                _context23.next = 76;
                break;

              case 40:
                _context23.next = 42;
                return this.service.readOne({
                  google: profile.id
                });

              case 42:
                _yield$this$service$r4 = _context23.sent;
                _existsUser = _yield$this$service$r4.data;
                _existsErr = _yield$this$service$r4.errors;

                if (!_existsErr) {
                  _context23.next = 47;
                  break;
                }

                return _context23.abrupt("return", done(_existsErr));

              case 47:
                if (!_existsUser) {
                  _context23.next = 56;
                  break;
                }

                _context23.next = 50;
                return this.service.updateOne({
                  _id: _existsUser._id
                }, {
                  $set: {
                    is_active: 1,
                    is_verified: 1
                  }
                });

              case 50:
                _yield$this$service$u = _context23.sent;
                updatedUser = _yield$this$service$u.data;
                updatedErr = _yield$this$service$u.errors;

                if (!updatedErr) {
                  _context23.next = 55;
                  break;
                }

                return _context23.abrupt("return", done(updatedErr));

              case 55:
                return _context23.abrupt("return", done(updatedErr, updatedUser));

              case 56:
                _context23.next = 58;
                return this.service.readOne({
                  email: profile._json.email
                });

              case 58:
                _yield$this$service$r5 = _context23.sent;
                existsEmail = _yield$this$service$r5.data;
                existsEmailErr = _yield$this$service$r5.errors;

                if (!existsEmailErr) {
                  _context23.next = 63;
                  break;
                }

                return _context23.abrupt("return", done(existsEmailErr));

              case 63:
                if (!existsEmail) {
                  _context23.next = 69;
                  break;
                }

                req.flash("error", "There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.");
                req.flash("info", "Redirect to <a href=\"http://".concat(req.headers.host, "/auth/forgot\">Forgot Password?</a> page to reset your password."));
                done(existsEmailErr);
                _context23.next = 76;
                break;

              case 69:
                _user = {
                  tokens: [{
                    kind: "google",
                    accessToken: accessToken
                  }],
                  email: profile.emails[0].value,
                  google: profile.id,
                  account: {
                    username: "".concat(profile.name.givenName, " ").concat(profile.name.familyName) || "".concat(profile._json.name.givenName, " ").concat(profile._json.name.familyName),
                    name: profile.displayName,
                    picture: profile._json.image ? profile._json.image.url : profile._json.picture,
                    gender: profile._json.gender || profile.gender
                  },
                  is_active: 1,
                  is_verififed: 1
                };
                _context23.next = 72;
                return this.service.create(_user);

              case 72:
                _yield$this$service$c = _context23.sent;
                newUser = _yield$this$service$c.data;
                newUserErr = _yield$this$service$c.errors;
                done(newUserErr, newUser);

              case 76:
              case "end":
                return _context23.stop();
            }
          }
        }, _callee23, this);
      }));

      function passportGoogleStrategy(_x59, _x60, _x61, _x62, _x63) {
        return _passportGoogleStrategy.apply(this, arguments);
      }

      return passportGoogleStrategy;
    }()
  }, {
    key: "passportFacebookStrategy",
    value: function () {
      var _passportFacebookStrategy = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee24(req, accessToken, refreshToken, profile, done) {
        var _yield$this$service$r6, existsUser, existsErr, _yield$this$service$r7, user, err, _yield$to3, _yield$to4, saveError, _yield$this$service$r8, _existsUser2, _existsErr2, _yield$this$service$u2, updatedUser, updatedErr, _yield$this$service$r9, existsEmail, existsEmailErr, _user2, _yield$this$service$c2, newUser, newUserErr;

        return _regenerator["default"].wrap(function _callee24$(_context24) {
          while (1) {
            switch (_context24.prev = _context24.next) {
              case 0:
                if (!req.user) {
                  _context24.next = 39;
                  break;
                }

                _context24.next = 3;
                return this.service.readOne({
                  facebook: profile.id
                });

              case 3:
                _yield$this$service$r6 = _context24.sent;
                existsUser = _yield$this$service$r6.data;
                existsErr = _yield$this$service$r6.errors;

                if (!existsErr) {
                  _context24.next = 8;
                  break;
                }

                return _context24.abrupt("return", done(existsErr));

              case 8:
                if (!existsUser) {
                  _context24.next = 14;
                  break;
                }

                req.flash("error", "There is already a Facebook account that belongs to you. Sign in with that account then link it with your current account.");
                req.flash("info", "Redirect to <strong><a href=\"http://".concat(req.headers.host, "/auth/forgot\">Forgot Password?</a></strong> page to reset your password."));
                done(existsErr);
                _context24.next = 37;
                break;

              case 14:
                _context24.next = 16;
                return this.service.readOne({
                  _id: req.user.id
                });

              case 16:
                _yield$this$service$r7 = _context24.sent;
                user = _yield$this$service$r7.data;
                err = _yield$this$service$r7.erorrs;

                if (!err) {
                  _context24.next = 21;
                  break;
                }

                return _context24.abrupt("return", done(err));

              case 21:
                user.tokens.push({
                  kind: "facebook",
                  accessToken: accessToken
                });
                user.facebook = profile.id;
                user.account.gender = user.account.gender || profile._json.gender;
                user.account.name = user.account.name || "".concat(profile.name.givenName, " ").concat(profile.name.familyName);
                user.account.picture = user.account.picture || "https://graph.facebook.com/".concat(profile.id, "/picture?type=large");
                user.is_verified = 1;
                user.is_active = 1;
                _context24.next = 30;
                return (0, _awaitToJs["default"])(user.save());

              case 30:
                _yield$to3 = _context24.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 1);
                saveError = _yield$to4[0];

                if (!saveError) {
                  _context24.next = 35;
                  break;
                }

                return _context24.abrupt("return", done(saveError));

              case 35:
                req.flash("success", "Facebook account has been linked.");
                done(null, user);

              case 37:
                _context24.next = 75;
                break;

              case 39:
                _context24.next = 41;
                return this.service.readOne({
                  facebook: profile.id
                });

              case 41:
                _yield$this$service$r8 = _context24.sent;
                _existsUser2 = _yield$this$service$r8.data;
                _existsErr2 = _yield$this$service$r8.errors;

                if (!_existsErr2) {
                  _context24.next = 46;
                  break;
                }

                return _context24.abrupt("return", done(_existsErr2));

              case 46:
                if (!_existsUser2) {
                  _context24.next = 55;
                  break;
                }

                _context24.next = 49;
                return this.service.updateOne({
                  _id: _existsUser2._id
                }, {
                  $set: {
                    is_active: 1,
                    is_verified: 1
                  }
                });

              case 49:
                _yield$this$service$u2 = _context24.sent;
                updatedUser = _yield$this$service$u2.data;
                updatedErr = _yield$this$service$u2.errors;

                if (!updatedErr) {
                  _context24.next = 54;
                  break;
                }

                return _context24.abrupt("return", done(updatedErr));

              case 54:
                return _context24.abrupt("return", done(updatedErr, updatedUser));

              case 55:
                _context24.next = 57;
                return this.service.readOne({
                  email: profile._json.email
                });

              case 57:
                _yield$this$service$r9 = _context24.sent;
                existsEmail = _yield$this$service$r9.data;
                existsEmailErr = _yield$this$service$r9.errors;

                if (!existsEmailErr) {
                  _context24.next = 62;
                  break;
                }

                return _context24.abrupt("return", done(existsEmailErr));

              case 62:
                if (!existsEmail) {
                  _context24.next = 68;
                  break;
                }

                req.flash("error", "There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.");
                req.flash("info", "Redirect to <strong><a href=\"http://".concat(req.headers.host, "/auth/forgot\">Forgot Password?</a></strong> to reset your password."));
                done(null);
                _context24.next = 75;
                break;

              case 68:
                _user2 = {
                  tokens: [{
                    kind: "facebook",
                    accessToken: accessToken
                  }],
                  email: profile._json.email,
                  facebook: profile.id,
                  gender: profile.gender || profile._json.gender,
                  account: {
                    username: profile.username || "".concat(profile.name.givenName, " ").concat(profile.name.middleName, " ").concat(profile.name.familyName) || "".concat(profile._json.first_name, " ").concat(profile._json.middle_name, " ").concat(profile._json.last_name),
                    name: "".concat(profile.name.givenName, " ").concat(profile.name.familyName),
                    picture: "https://graph.facebook.com/".concat(profile.id, "/picture?type=large")
                  },
                  is_active: 1,
                  is_verified: 1
                };
                _context24.next = 71;
                return this.service.create(_user2);

              case 71:
                _yield$this$service$c2 = _context24.sent;
                newUser = _yield$this$service$c2.data;
                newUserErr = _yield$this$service$c2.errors;
                done(newUserErr, newUser);

              case 75:
              case "end":
                return _context24.stop();
            }
          }
        }, _callee24, this);
      }));

      function passportFacebookStrategy(_x64, _x65, _x66, _x67, _x68) {
        return _passportFacebookStrategy.apply(this, arguments);
      }

      return passportFacebookStrategy;
    }()
  }, {
    key: "getSettings",
    value: function () {
      var _getSettings = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee25(req, res, next) {
        var _yield$skillService$r, skills, skillsError, skillsErrors, _yield$nationalitySer, nations, nationsError, nationsErrors, _yield$this$service$g, user, userError, userErrors;

        return _regenerator["default"].wrap(function _callee25$(_context25) {
          while (1) {
            switch (_context25.prev = _context25.next) {
              case 0:
                _context25.next = 2;
                return skillService.readMany({}, {
                  pagination: false,
                  select: "_id name"
                });

              case 2:
                _yield$skillService$r = _context25.sent;
                skills = _yield$skillService$r.data;
                skillsError = _yield$skillService$r.error;
                skillsErrors = _yield$skillService$r.errors;

                if (!skillsError) {
                  _context25.next = 8;
                  break;
                }

                return _context25.abrupt("return", next(skillsErrors));

              case 8:
                _context25.next = 10;
                return nationalityService.readMany({}, {
                  pagination: false,
                  select: "_id name"
                });

              case 10:
                _yield$nationalitySer = _context25.sent;
                nations = _yield$nationalitySer.data;
                nationsError = _yield$nationalitySer.error;
                nationsErrors = _yield$nationalitySer.errors;

                if (!nationsError) {
                  _context25.next = 16;
                  break;
                }

                return _context25.abrupt("return", next(nationsErrors));

              case 16:
                _context25.next = 18;
                return this.service.getSettingsUserData(req.user._id);

              case 18:
                _yield$this$service$g = _context25.sent;
                user = _yield$this$service$g.data;
                userError = _yield$this$service$g.error;
                userErrors = _yield$this$service$g.errors;

                if (!userError) {
                  _context25.next = 24;
                  break;
                }

                return _context25.abrupt("return", next(userErrors));

              case 24:
                res.render("dashboard/settings", {
                  page_title: "Settings",
                  data: {
                    user: user,
                    skills: skills,
                    nations: nations
                  }
                });

              case 25:
              case "end":
                return _context25.stop();
            }
          }
        }, _callee25, this);
      }));

      function getSettings(_x69, _x70, _x71) {
        return _getSettings.apply(this, arguments);
      }

      return getSettings;
    }()
  }, {
    key: "updatePassword",
    value: function () {
      var _updatePassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee26(req, res, next) {
        var errors, err, id, _req$app$get4, io, userUpdatePasswordResponse, userUpdatePasswordEmailResponse, sessionsReadResponse, otherDevicesSockets;

        return _regenerator["default"].wrap(function _callee26$(_context26) {
          while (1) {
            switch (_context26.prev = _context26.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context26.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context26.abrupt("return", res.redirect("back"));

              case 5:
                id = req.params.id;
                _req$app$get4 = req.app.get("io"), io = _req$app$get4.io;
                _context26.next = 9;
                return this.service.updatePassword(id, req.body);

              case 9:
                userUpdatePasswordResponse = _context26.sent;

                if (!userUpdatePasswordResponse.error) {
                  _context26.next = 13;
                  break;
                }

                if (userUpdatePasswordResponse.statusCode === 404) {
                  req.flash("error", userUpdatePasswordResponse.errors);
                  res.status(userUpdatePasswordResponse.statusCode).redirect("/");
                }

                return _context26.abrupt("return", next(userUpdatePasswordResponse.errors));

              case 13:
                _context26.next = 15;
                return emailService.send({
                  filename: "password-updated",
                  subject: "[".concat(process.env.SITE_NAME, "] Updating Password Confirmation."),
                  to: userUpdatePasswordResponse.data,
                  from: String(process.env.MAIL_SENDER),
                  email: userUpdatePasswordResponse.data.email,
                  siteName: process.env.SITE_NAME
                });

              case 15:
                userUpdatePasswordEmailResponse = _context26.sent;

                if (!userUpdatePasswordEmailResponse.error) {
                  _context26.next = 18;
                  break;
                }

                return _context26.abrupt("return", next(userUpdatePasswordEmailResponse.errors));

              case 18:
                if (!req.body.loggingOutFromOtherDevices) {
                  _context26.next = 27;
                  break;
                }

                _context26.next = 21;
                return sessionService.deleteMany({
                  "session.passport.user": String(id)
                }, {
                  pagination: false
                });

              case 21:
                sessionsReadResponse = _context26.sent;

                if (!sessionsReadResponse.error) {
                  _context26.next = 24;
                  break;
                }

                return _context26.abrupt("return", next(sessionsReadResponse.errors));

              case 24:
                sessionsReadResponse.data = sessionsReadResponse.data.map(function (data) {
                  return JSON.parse(JSON.stringify(data));
                }); // reload all other devices, using socket id.

                otherDevicesSockets = sessionsReadResponse.data.map(function (current) {
                  return current.session.socketio;
                }).filter(function (current) {
                  return current !== req.session.socketio;
                });
                otherDevicesSockets.forEach(function (socket) {
                  io.sockets.to(socket).emit("user/logout_from_devices");
                });

              case 27:
                req.flash("success", "successfully updated password");
                res.status(userUpdatePasswordEmailResponse.statusCode).redirect("back");

              case 29:
              case "end":
                return _context26.stop();
            }
          }
        }, _callee26, this);
      }));

      function updatePassword(_x72, _x73, _x74) {
        return _updatePassword.apply(this, arguments);
      }

      return updatePassword;
    }()
  }, {
    key: "uploadAvatar",
    value: function () {
      var _uploadAvatar = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee28(req, res, next) {
        var storageEngine, avatarUpload;
        return _regenerator["default"].wrap(function _callee28$(_context28) {
          while (1) {
            switch (_context28.prev = _context28.next) {
              case 0:
                storageEngine = avatarAttachmentService.initStorageEngine({
                  responsive: true,
                  accept: ["image"],
                  fileHashName: true,
                  quality: 2,
                  upload_path: "".concat(process.env.UPLOAD_STORAGE, "/avatars/").concat(req.user._id),
                  upload_base_path: "/".concat(req.user._id)
                });
                avatarUpload = (0, _multer["default"])({
                  storage: storageEngine,
                  limits: {
                    files: 1,
                    // allow only 1 file per request
                    fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB) // 5 MB (max file size)

                  },
                  fileFilter: function fileFilter(request, file, cb) {
                    // supported image file mimetypes
                    var isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);

                    if (isFileTypeValid) {
                      // allow supported image files
                      cb(null, true);
                    } else {
                      // throw error for invalid files
                      cb(new Error("That fileType isn't allowed! "));
                    }
                  }
                });
                avatarUpload.array("avatar")(req, res, /*#__PURE__*/function () {
                  var _ref7 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee27(err) {
                    return _regenerator["default"].wrap(function _callee27$(_context27) {
                      while (1) {
                        switch (_context27.prev = _context27.next) {
                          case 0:
                            if (!err) {
                              _context27.next = 3;
                              break;
                            }

                            req.flash("error", err.message);
                            return _context27.abrupt("return", res.redirect("back"));

                          case 3:
                            req.body.files = req.files;
                            next();

                          case 5:
                          case "end":
                            return _context27.stop();
                        }
                      }
                    }, _callee27);
                  }));

                  return function (_x78) {
                    return _ref7.apply(this, arguments);
                  };
                }());

              case 3:
              case "end":
                return _context28.stop();
            }
          }
        }, _callee28);
      }));

      function uploadAvatar(_x75, _x76, _x77) {
        return _uploadAvatar.apply(this, arguments);
      }

      return uploadAvatar;
    }()
  }, {
    key: "updateAccountInfo",
    value: function () {
      var _updateAccountInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee29(req, res, next) {
        var errors, err, savedAttachments, port, base, files, i, fileCreationResponse, userUpdateAccountInfoResponse;
        return _regenerator["default"].wrap(function _callee29$(_context29) {
          while (1) {
            switch (_context29.prev = _context29.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context29.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context29.abrupt("return", res.redirect("back"));

              case 5:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context29.next = 22;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = avatarAttachmentService.handelFilesForDBCreation(req.body.files, base)[0];
                i = 0;

              case 11:
                if (!(i < files.length)) {
                  _context29.next = 21;
                  break;
                }

                _context29.next = 14;
                return avatarAttachmentService.create(files[i]);

              case 14:
                fileCreationResponse = _context29.sent;

                if (!fileCreationResponse.error) {
                  _context29.next = 17;
                  break;
                }

                return _context29.abrupt("return", next(fileCreationResponse.errors));

              case 17:
                savedAttachments.push(fileCreationResponse.data);

              case 18:
                i++;
                _context29.next = 11;
                break;

              case 21:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  "account.picture_lg": avatarAttachmentService.options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_lg\.(.+)$/i);
                  })[0]._id : null,
                  "account.picture_md": avatarAttachmentService.options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_md\.(.+)$/i);
                  })[0]._id : null,
                  "account.picture_sm": avatarAttachmentService.options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_sm\.(.+)$/i);
                  })[0]._id : null,
                  "account.picture": avatarAttachmentService.options.responsive ? savedAttachments.filter(function (file) {
                    return file.path.match(/^(.+?)_lg\.(.+)$/i);
                  })[0]._id : savedAttachments[0]._id
                });

              case 22:
                _context29.next = 24;
                return this.service.updateOne({
                  _id: req.params.id
                }, {
                  $set: req.body
                });

              case 24:
                userUpdateAccountInfoResponse = _context29.sent;

                if (!userUpdateAccountInfoResponse.error) {
                  _context29.next = 27;
                  break;
                }

                return _context29.abrupt("return", next(userUpdateAccountInfoResponse.errors));

              case 27:
                req.flash("success", "successfully updated your account data.");
                res.status(userUpdateAccountInfoResponse.statusCode).redirect("/dashboard/settings");

              case 29:
              case "end":
                return _context29.stop();
            }
          }
        }, _callee29, this);
      }));

      function updateAccountInfo(_x79, _x80, _x81) {
        return _updateAccountInfo.apply(this, arguments);
      }

      return updateAccountInfo;
    }()
  }, {
    key: "uploadAttachments",
    value: function () {
      var _uploadAttachments = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee31(req, res, next) {
        var storageEngine, attachmentUpload;
        return _regenerator["default"].wrap(function _callee31$(_context31) {
          while (1) {
            switch (_context31.prev = _context31.next) {
              case 0:
                storageEngine = profileInfoAttachmentService.initStorageEngine({
                  accept: ["application", "image"],
                  square: false,
                  fileHashName: false,
                  upload_path: "".concat(process.env.UPLOAD_STORAGE, "/freelancers-attachments/").concat(new Date().getFullYear(), "/").concat(new Date().getMonth() + 1, "/").concat(new Date().getDate(), "/").concat(req.user._id),
                  upload_base_path: "/".concat(req.user._id)
                });
                attachmentUpload = (0, _multer["default"])({
                  storage: storageEngine,
                  limits: {
                    files: 2,
                    // allow only 2 files per request
                    fileSize: 1024 * 1024 * Number(process.env.ATTACHMENT_MAX_SIZE_IN_MB) // 5 MB (max file size)

                  },
                  fileFilter: function fileFilter(request, file, cb) {
                    // supported image file mimetypes
                    var isFileTypeValid = storageEngine.options.accept.includes(file.mimetype.split("/")[0]);

                    if (isFileTypeValid) {
                      // allow supported image files
                      cb(null, true);
                    } else {
                      // throw error for invalid files
                      cb(new Error("That fileType isn't allowed! "));
                    }
                  }
                });
                attachmentUpload.array("attachments")(req, res, /*#__PURE__*/function () {
                  var _ref8 = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee30(err) {
                    return _regenerator["default"].wrap(function _callee30$(_context30) {
                      while (1) {
                        switch (_context30.prev = _context30.next) {
                          case 0:
                            if (!err) {
                              _context30.next = 3;
                              break;
                            }

                            req.flash("error", err.message);
                            return _context30.abrupt("return", res.redirect("back"));

                          case 3:
                            req.body.files = req.files;
                            next();

                          case 5:
                          case "end":
                            return _context30.stop();
                        }
                      }
                    }, _callee30);
                  }));

                  return function (_x85) {
                    return _ref8.apply(this, arguments);
                  };
                }());

              case 3:
              case "end":
                return _context31.stop();
            }
          }
        }, _callee31);
      }));

      function uploadAttachments(_x82, _x83, _x84) {
        return _uploadAttachments.apply(this, arguments);
      }

      return uploadAttachments;
    }()
  }, {
    key: "updateProfileInfo",
    value: function () {
      var _updateProfileInfo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee32(req, res, next) {
        var errors, err, savedAttachments, port, base, files, i, fileCreationResponse, userUpdateProfileInfoResponse, skillsRemoveUserResponse, skillsAddUserResponse;
        return _regenerator["default"].wrap(function _callee32$(_context32) {
          while (1) {
            switch (_context32.prev = _context32.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context32.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context32.abrupt("return", res.redirect("back"));

              case 5:
                savedAttachments = [];

                if (!req.body.files.length) {
                  _context32.next = 22;
                  break;
                }

                port = req.app.get("port");
                base = "".concat(req.protocol, "://").concat(req.hostname).concat(port ? ":".concat(port) : "");
                files = profileInfoAttachmentService.handelFilesForDBCreation(req.body.files, base);
                i = 0;

              case 11:
                if (!(i < files.length)) {
                  _context32.next = 21;
                  break;
                }

                _context32.next = 14;
                return profileInfoAttachmentService.create(files[i]);

              case 14:
                fileCreationResponse = _context32.sent;

                if (!fileCreationResponse.error) {
                  _context32.next = 17;
                  break;
                }

                return _context32.abrupt("return", next(fileCreationResponse.errors));

              case 17:
                savedAttachments.push(fileCreationResponse.data[0]);

              case 18:
                i++;
                _context32.next = 11;
                break;

              case 21:
                req.body = _objectSpread(_objectSpread({}, req.body), {}, {
                  "profile.attachments": [].concat((0, _toConsumableArray2["default"])(req.user.profile.attachments), (0, _toConsumableArray2["default"])(savedAttachments.map(function (attach) {
                    return attach._id;
                  })))
                });

              case 22:
                _context32.next = 24;
                return this.service.updateOne({
                  _id: req.params.id
                }, {
                  $set: req.body
                });

              case 24:
                userUpdateProfileInfoResponse = _context32.sent;

                if (!userUpdateProfileInfoResponse.error) {
                  _context32.next = 27;
                  break;
                }

                return _context32.abrupt("return", next(userUpdateProfileInfoResponse.errors));

              case 27:
                _context32.next = 29;
                return skillService.updateMany({
                  users: req.params.id
                }, {
                  $pull: {
                    users: req.params.id
                  }
                });

              case 29:
                skillsRemoveUserResponse = _context32.sent;

                if (!skillsRemoveUserResponse.error) {
                  _context32.next = 32;
                  break;
                }

                return _context32.abrupt("return", next(skillsRemoveUserResponse.errors));

              case 32:
                _context32.next = 34;
                return skillService.updateMany({
                  _id: {
                    $in: userUpdateProfileInfoResponse.data.profile.skills
                  }
                }, {
                  $addToSet: {
                    users: userUpdateProfileInfoResponse.data._id
                  }
                });

              case 34:
                skillsAddUserResponse = _context32.sent;

                if (!skillsAddUserResponse.error) {
                  _context32.next = 37;
                  break;
                }

                return _context32.abrupt("return", next(skillsAddUserResponse.errors));

              case 37:
                req.flash("success", "successfully updated your account data.");
                res.status(userUpdateProfileInfoResponse.statusCode).redirect("/dashboard/settings");

              case 39:
              case "end":
                return _context32.stop();
            }
          }
        }, _callee32, this);
      }));

      function updateProfileInfo(_x86, _x87, _x88) {
        return _updateProfileInfo.apply(this, arguments);
      }

      return updateProfileInfo;
    }()
  }, {
    key: "removeProfileAttachment",
    value: function () {
      var _removeProfileAttachment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee33(req, res, next) {
        var attachmentService, attachmentDeleteRespose, attachmentDeleteFilesResponse, userUpdateProfileAttachment;
        return _regenerator["default"].wrap(function _callee33$(_context33) {
          while (1) {
            switch (_context33.prev = _context33.next) {
              case 0:
                attachmentService = new _Attachment2["default"](_Attachment["default"]);
                _context33.next = 3;
                return attachmentService.deleteOne({
                  _id: req.params.attachment
                });

              case 3:
                attachmentDeleteRespose = _context33.sent;

                if (!attachmentDeleteRespose.error) {
                  _context33.next = 6;
                  break;
                }

                return _context33.abrupt("return", next(attachmentDeleteRespose.errors));

              case 6:
                _context33.next = 8;
                return attachmentService.handelFilesForDirDeletion([attachmentDeleteRespose.data.path]);

              case 8:
                attachmentDeleteFilesResponse = _context33.sent;

                if (!attachmentDeleteFilesResponse.error) {
                  _context33.next = 11;
                  break;
                }

                return _context33.abrupt("return", next(attachmentDeleteFilesResponse.errors));

              case 11:
                _context33.next = 13;
                return this.service.updateOne({
                  _id: req.params.id,
                  "profile.attachment": attachmentDeleteRespose.data._id
                }, {
                  $pull: {
                    "profile.attachment": attachmentDeleteRespose.data._id
                  }
                });

              case 13:
                userUpdateProfileAttachment = _context33.sent;

                if (!userUpdateProfileAttachment.error) {
                  _context33.next = 16;
                  break;
                }

                return _context33.abrupt("return", next(userUpdateProfileAttachment.errors));

              case 16:
                req.flash("success", "Attachment removed successfully.");
                res.status(userUpdateProfileAttachment.statusCode).redirect("back");

              case 18:
              case "end":
                return _context33.stop();
            }
          }
        }, _callee33, this);
      }));

      function removeProfileAttachment(_x89, _x90, _x91) {
        return _removeProfileAttachment.apply(this, arguments);
      }

      return removeProfileAttachment;
    }()
  }, {
    key: "downloadProfileAttachment",
    value: function () {
      var _downloadProfileAttachment = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee34(req, res, next) {
        var attachment, attachmentDownloadResponse, storage_path_array, storage_path;
        return _regenerator["default"].wrap(function _callee34$(_context34) {
          while (1) {
            switch (_context34.prev = _context34.next) {
              case 0:
                attachment = req.params.attachment;
                _context34.next = 3;
                return profileInfoAttachmentService.readOne({
                  _id: attachment
                });

              case 3:
                attachmentDownloadResponse = _context34.sent;

                if (!attachmentDownloadResponse.error) {
                  _context34.next = 6;
                  break;
                }

                return _context34.abrupt("return", next(attachmentDownloadResponse.errors));

              case 6:
                storage_path_array = process.env.UPLOAD_STORAGE.split("");
                storage_path = storage_path_array.slice(0, storage_path_array.length - 1).join("/");
                res.download(_path["default"].resolve(__dirname, "../../".concat(storage_path), attachmentDownloadResponse.data.path), attachmentDownloadResponse.data.name);

              case 9:
              case "end":
                return _context34.stop();
            }
          }
        }, _callee34);
      }));

      function downloadProfileAttachment(_x92, _x93, _x94) {
        return _downloadProfileAttachment.apply(this, arguments);
      }

      return downloadProfileAttachment;
    }()
  }, {
    key: "bookmarkUser",
    value: function () {
      var _bookmarkUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee35(req, res, next) {
        var _req$params, type, id, bookmarked, operator, userBookmarkResponse;

        return _regenerator["default"].wrap(function _callee35$(_context35) {
          while (1) {
            switch (_context35.prev = _context35.next) {
              case 0:
                _req$params = req.params, type = _req$params.type, id = _req$params.id;
                bookmarked = req.user.bookmarked[type].map(function (obj) {
                  return obj.toString();
                });
                operator = bookmarked.includes(id) ? "$pull" : "$addToSet";
                _context35.next = 5;
                return this.service.updateOne({
                  _id: req.user._id
                }, (0, _defineProperty2["default"])({}, operator, (0, _defineProperty2["default"])({}, "bookmarked.".concat(type), id)));

              case 5:
                userBookmarkResponse = _context35.sent;

                if (!userBookmarkResponse.error) {
                  _context35.next = 8;
                  break;
                }

                return _context35.abrupt("return", next(userBookmarkResponse.errors));

              case 8:
                res.status(userBookmarkResponse.statusCode).json(userBookmarkResponse.data.bookmarked[type]);

              case 9:
              case "end":
                return _context35.stop();
            }
          }
        }, _callee35, this);
      }));

      function bookmarkUser(_x95, _x96, _x97) {
        return _bookmarkUser.apply(this, arguments);
      }

      return bookmarkUser;
    }()
  }, {
    key: "getBookmarkList",
    value: function () {
      var _getBookmarkList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee36(req, res, next) {
        var userBookmarkedList;
        return _regenerator["default"].wrap(function _callee36$(_context36) {
          while (1) {
            switch (_context36.prev = _context36.next) {
              case 0:
                _context36.next = 2;
                return this.service.getBookmarked(req.user._id);

              case 2:
                userBookmarkedList = _context36.sent;

                if (!userBookmarkedList.error) {
                  _context36.next = 5;
                  break;
                }

                return _context36.abrupt("return", next(userBookmarkedList.errors));

              case 5:
                // return res.json(userBookmarkedList.data);
                res.render("dashboard/bookmarks", {
                  page_title: "My Bookmarks",
                  data: userBookmarkedList.data
                });

              case 6:
              case "end":
                return _context36.stop();
            }
          }
        }, _callee36, this);
      }));

      function getBookmarkList(_x98, _x99, _x100) {
        return _getBookmarkList.apply(this, arguments);
      }

      return getBookmarkList;
    }()
  }, {
    key: "usersList",
    value: function () {
      var _usersList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee37(req, res, next) {
        var _req$query;

        var _req$query$page, page, query, options, userListResponse;

        return _regenerator["default"].wrap(function _callee37$(_context37) {
          while (1) {
            switch (_context37.prev = _context37.next) {
              case 0:
                _req$query$page = req.query.page, page = _req$query$page === void 0 ? 1 : _req$query$page;
                query = _objectSpread(_objectSpread({}, ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.q) && {
                  $or: [{
                    email: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    role: {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "account.name": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "account.username": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "account.gender": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "account.website": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "profile.tagline": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "profile.description": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                }), {}, {
                  role: {
                    $nin: ["admin"]
                  }
                });
                options = _objectSpread(_objectSpread({}, req.query), {}, {
                  page: page
                });
                _context37.next = 5;
                return this.service.readMany(query, options);

              case 5:
                userListResponse = _context37.sent;

                if (!userListResponse.error) {
                  _context37.next = 8;
                  break;
                }

                return _context37.abrupt("return", next(userListResponse.errors));

              case 8:
                if (!(!userListResponse.data.length && userListResponse.offset === undefined && userListResponse.page !== 1)) {
                  _context37.next = 11;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(page, ". But that dosen't exist. So i put you on page ").concat(userListResponse.pages, "."));
                return _context37.abrupt("return", res.status(userListResponse.statusCode).redirect("/dashboard/users/list?page=".concat(userListResponse.pages)));

              case 11:
                res.render("dashboard/users/list", _objectSpread(_objectSpread({
                  page_title: "Manage All Users"
                }, userListResponse), {}, {
                  data: {
                    users: userListResponse.data
                  },
                  query: req.query
                }));

              case 12:
              case "end":
                return _context37.stop();
            }
          }
        }, _callee37, this);
      }));

      function usersList(_x101, _x102, _x103) {
        return _usersList.apply(this, arguments);
      }

      return usersList;
    }()
  }, {
    key: "changeVerificationStatus",
    value: function () {
      var _changeVerificationStatus = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee38(req, res, next) {
        var id, userReadResponse, userChangeVerificationResponse;
        return _regenerator["default"].wrap(function _callee38$(_context38) {
          while (1) {
            switch (_context38.prev = _context38.next) {
              case 0:
                id = req.params.id;
                _context38.next = 3;
                return this.service.readOne({
                  _id: id
                });

              case 3:
                userReadResponse = _context38.sent;

                if (!userReadResponse.error) {
                  _context38.next = 6;
                  break;
                }

                return _context38.abrupt("return", next(userReadResponse.errors));

              case 6:
                _context38.next = 8;
                return this.service.updateOne({
                  _id: id
                }, {
                  $set: {
                    is_verified: !userReadResponse.data.is_verified
                  }
                });

              case 8:
                userChangeVerificationResponse = _context38.sent;

                if (!userChangeVerificationResponse.error) {
                  _context38.next = 11;
                  break;
                }

                return _context38.abrupt("return", next(userChangeVerificationResponse.errors));

              case 11:
                req.flash("success", "".concat(userChangeVerificationResponse.data.account.name, "'s verification status has been changed!"));
                res.redirect("back");

              case 13:
              case "end":
                return _context38.stop();
            }
          }
        }, _callee38, this);
      }));

      function changeVerificationStatus(_x104, _x105, _x106) {
        return _changeVerificationStatus.apply(this, arguments);
      }

      return changeVerificationStatus;
    }()
  }, {
    key: "getCompaniesByFirstLetter",
    value: function () {
      var _getCompaniesByFirstLetter = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee39(req, res, next) {
        var _req$query2, _req$query2$letter, letter, _req$query2$page, page, query, options, companiesByFirstLetterResponse;

        return _regenerator["default"].wrap(function _callee39$(_context39) {
          while (1) {
            switch (_context39.prev = _context39.next) {
              case 0:
                _req$query2 = req.query, _req$query2$letter = _req$query2.letter, letter = _req$query2$letter === void 0 ? "a" : _req$query2$letter, _req$query2$page = _req$query2.page, page = _req$query2$page === void 0 ? 1 : _req$query2$page;
                query = {
                  role: "employer",
                  "account.name": {
                    $regex: letter,
                    $options: "i"
                  }
                };
                options = _objectSpread(_objectSpread({
                  select: "email account.name account.picture account.picture_sm account.picture_md account.picture_lg slug"
                }, req.query), {}, {
                  page: page
                });
                _context39.next = 5;
                return this.service.readMany(query, options);

              case 5:
                companiesByFirstLetterResponse = _context39.sent;

                if (!companiesByFirstLetterResponse.error) {
                  _context39.next = 8;
                  break;
                }

                return _context39.abrupt("return", next(companiesByFirstLetterResponse.errors));

              case 8:
                if (!(!companiesByFirstLetterResponse.data.length && companiesByFirstLetterResponse.offset === undefined && companiesByFirstLetterResponse.page !== 1)) {
                  _context39.next = 11;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(page, ". But that doesn't exist. So i put you on page ").concat(companiesByFirstLetterResponse.pages, "."));
                return _context39.abrupt("return", res.status(companiesByFirstLetterResponse.statusCode).redirect("/browse/companies?".concat(_qs["default"].stringify((0, _lodash.assignIn)(req.query, _qs["default"].parse({
                  letter: letter,
                  page: companiesByFirstLetterResponse.pages
                }))))));

              case 11:
                res.render("companies-list", _objectSpread(_objectSpread({
                  page_title: "Browse Companies"
                }, companiesByFirstLetterResponse), {}, {
                  data: {
                    companies: companiesByFirstLetterResponse.data
                  },
                  query: _objectSpread(_objectSpread({}, req.query), {}, {
                    letter: letter,
                    page: page
                  })
                }));

              case 12:
              case "end":
                return _context39.stop();
            }
          }
        }, _callee39, this);
      }));

      function getCompaniesByFirstLetter(_x107, _x108, _x109) {
        return _getCompaniesByFirstLetter.apply(this, arguments);
      }

      return getCompaniesByFirstLetter;
    }()
  }, {
    key: "getFreelancers",
    value: function () {
      var _getFreelancers = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee40(req, res, next) {
        var _req$query3, _req$query3$page, page, hourly_rate, keywords, skills, query, options, freelancersResponse, skillsResponse;

        return _regenerator["default"].wrap(function _callee40$(_context40) {
          while (1) {
            switch (_context40.prev = _context40.next) {
              case 0:
                // TODO: adding functionality for sorting by stars rate.
                _req$query3 = req.query, _req$query3$page = _req$query3.page, page = _req$query3$page === void 0 ? 1 : _req$query3$page, hourly_rate = _req$query3.hourly_rate, keywords = _req$query3.keywords, skills = _req$query3.skills;
                query = _objectSpread(_objectSpread(_objectSpread({
                  role: "freelancer"
                }, hourly_rate && {
                  "profile.hourly_rate": {
                    $gte: Number(hourly_rate.split(",")[0]),
                    $lte: Number(hourly_rate.split(",")[1])
                  }
                }), keywords && keywords.filter(Boolean).length && {
                  $or: [{
                    "account.name": {
                      $regex: keywords.filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "profile.description": {
                      $regex: keywords.filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "profile.tagline": {
                      $regex: keywords.filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                }), skills && skills.filter(Boolean).length && {
                  "profile.skills": {
                    $in: skills.filter(Boolean)
                  }
                });
                options = _objectSpread(_objectSpread({
                  limit: 6
                }, req.query), {}, {
                  page: page
                });
                _context40.next = 5;
                return this.service.readMany(query, options);

              case 5:
                freelancersResponse = _context40.sent;

                if (!freelancersResponse.error) {
                  _context40.next = 8;
                  break;
                }

                return _context40.abrupt("return", next(freelancersResponse.errors));

              case 8:
                if (!(!freelancersResponse.data.length && freelancersResponse.offset === undefined && freelancersResponse.page !== 1)) {
                  _context40.next = 11;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(page, ". But that dosen't exist. So i put you on page ").concat(freelancersResponse.pages, "."));
                return _context40.abrupt("return", res.status(freelancersResponse.statusCode).redirect("/browse/freelancers?".concat(_qs["default"].stringify((0, _lodash.assignIn)(req.query, _qs["default"].parse({
                  page: freelancersResponse.pages
                }))))));

              case 11:
                _context40.next = 13;
                return skillService.readMany({}, {
                  sort: {
                    users: -1
                  }
                });

              case 13:
                skillsResponse = _context40.sent;

                if (!skillsResponse.error) {
                  _context40.next = 16;
                  break;
                }

                return _context40.abrupt("return", next(skillsResponse.errors));

              case 16:
                res.render("freelancers-list", _objectSpread(_objectSpread({
                  page_title: "Find A Freelancer"
                }, freelancersResponse), {}, {
                  data: {
                    freelancers: freelancersResponse.data,
                    skills: skillsResponse.data
                  },
                  query: _objectSpread(_objectSpread({}, req.query), {}, {
                    page: page
                  })
                }));

              case 17:
              case "end":
                return _context40.stop();
            }
          }
        }, _callee40, this);
      }));

      function getFreelancers(_x110, _x111, _x112) {
        return _getFreelancers.apply(this, arguments);
      }

      return getFreelancers;
    }()
  }]);
  return UserController;
}(_Controller2["default"]);

var _default = new UserController(userService);

exports["default"] = _default;