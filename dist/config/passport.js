"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _passport = _interopRequireDefault(require("passport"));

var _passportLocal = _interopRequireDefault(require("passport-local"));

var _passportFacebook = _interopRequireDefault(require("passport-facebook"));

var _passportGoogleOauth = _interopRequireDefault(require("passport-google-oauth20"));

var _User = _interopRequireDefault(require("../models/User.model"));

var _User2 = _interopRequireDefault(require("../services/User"));

var _User3 = _interopRequireDefault(require("../controllers/User.controller"));

var userService = new _User2["default"](_User["default"]); //
// ─── SERIALIZE AND DESERIALIZE ──────────────────────────────────────────────────
//

_passport["default"].serializeUser(function (user, done) {
  done(null, user.id);
});

_passport["default"].deserializeUser( /*#__PURE__*/function () {
  var _ref = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(id, done) {
    var userDeserializeResponse;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return userService.deserialize(id);

          case 2:
            userDeserializeResponse = _context.sent;
            done(userDeserializeResponse.errors, userDeserializeResponse.data);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}()); //
// ─── SIGN IN USING EMAIL AND PASSWORD ───────────────────────────────────────────
//


_passport["default"].use(new _passportLocal["default"]({
  usernameField: "email",
  passwordField: "password"
}, _User3["default"].passportLocalStrategy)); //
// ─── SIGN IN USING FACEBOOK ─────────────────────────────────────────────────────
//


_passport["default"].use(new _passportFacebook["default"]({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ["name", "email", "link", "locale", "timezone", "gender"],
  passReqToCallback: true
}, _User3["default"].passportFacebookStrategy)); //
// ─── SIGN IN USING GOOGLE ───────────────────────────────────────────────────────
//


_passport["default"].use(new _passportGoogleOauth["default"]({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  scope: ["r_basicprofile", "r_emailaddress"],
  passReqToCallback: true
}, _User3["default"].passportGoogleStrategy));