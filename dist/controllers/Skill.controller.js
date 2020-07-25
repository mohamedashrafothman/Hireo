"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = require("lodash");

var _expressValidator = require("express-validator");

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Skill = _interopRequireDefault(require("../services/Skill"));

var _User = _interopRequireDefault(require("../services/User"));

var _Skill2 = _interopRequireDefault(require("../models/Skill.model"));

var _User2 = _interopRequireDefault(require("../models/User.model"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var skillService = new _Skill["default"](_Skill2["default"]);
var userService = new _User["default"](_User2["default"]);

var SkillController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(SkillController, _Controller);

  var _super = _createSuper(SkillController);

  function SkillController(service) {
    (0, _classCallCheck2["default"])(this, SkillController);
    return _super.call(this, service);
  }

  (0, _createClass2["default"])(SkillController, [{
    key: "validator",
    value: function validator(method) {
      switch (method) {
        case "add skill":
        case "edit skill":
          return [(0, _expressValidator.body)("name.en").notEmpty().withMessage("Skill english name can't be empty!").trim(), (0, _expressValidator.body)("name.ar").notEmpty().withMessage("Skill arabic name can't be empty!").trim(), (0, _expressValidator.body)("description.en").notEmpty().withMessage("Skill english description can't be empty!").trim(), (0, _expressValidator.body)("description.ar").notEmpty().withMessage("Skill arabic description can't be empty!").trim(), (0, _expressValidator.sanitizeBody)("name.en"), (0, _expressValidator.sanitizeBody)("name.ar"), (0, _expressValidator.sanitizeBody)("description.en"), (0, _expressValidator.sanitizeBody)("description.ar")];

        default:
          return [];
      }
    }
  }, {
    key: "getSkillsList",
    value: function () {
      var _getSkillsList = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(req, res, next) {
        var _req$query;

        var query, options, skillsListResponse;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = _objectSpread({}, ((_req$query = req.query) === null || _req$query === void 0 ? void 0 : _req$query.q) && {
                  $or: [{
                    "name.en": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "name.ar": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "description.en": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }, {
                    "description.ar": {
                      $regex: req.query.q.split(" ").filter(Boolean).join("|") || "",
                      $options: "i"
                    }
                  }]
                });
                options = _objectSpread({}, req.query);
                _context.next = 4;
                return skillService.readMany(query, options);

              case 4:
                skillsListResponse = _context.sent;

                if (!skillsListResponse.error) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", next(skillsListResponse.errors));

              case 7:
                if (!(!skillsListResponse.data.length && skillsListResponse.offset === undefined && skillsListResponse.page !== 1)) {
                  _context.next = 10;
                  break;
                }

                req.flash("info", "Hey! you asked for page ".concat(req.query.page || 1, ". But that dosen't exist. So i put you on page ").concat(skillsListResponse.pages, "."));
                return _context.abrupt("return", res.status(skillsListResponse.statusCode).redirect("/dashboard/skills/list?page=".concat(skillsListResponse.pages)));

              case 10:
                res.render("dashboard/skills/list", _objectSpread(_objectSpread({
                  page_title: "Manage All Skills"
                }, skillsListResponse), {}, {
                  data: {
                    skills: skillsListResponse.data
                  },
                  query: req.query
                }));

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getSkillsList(_x, _x2, _x3) {
        return _getSkillsList.apply(this, arguments);
      }

      return getSkillsList;
    }()
  }, {
    key: "getAddSkills",
    value: function () {
      var _getAddSkills = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(req, res) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                res.render("dashboard/skills/add", {
                  page_title: "Add a Skill"
                });

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function getAddSkills(_x4, _x5) {
        return _getAddSkills.apply(this, arguments);
      }

      return getAddSkills;
    }()
  }, {
    key: "getEditSkills",
    value: function () {
      var _getEditSkills = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(req, res, next) {
        var skillToEditResponse;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return skillService.readOne({
                  slug: req.params.slug
                });

              case 2:
                skillToEditResponse = _context3.sent;

                if (!skillToEditResponse.error) {
                  _context3.next = 5;
                  break;
                }

                return _context3.abrupt("return", next(skillToEditResponse.errors));

              case 5:
                res.status(skillToEditResponse.statusCode).render("dashboard/skills/edit", {
                  page_title: "Edit a Skill",
                  data: {
                    skill: skillToEditResponse.data
                  }
                });

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3);
      }));

      function getEditSkills(_x6, _x7, _x8) {
        return _getEditSkills.apply(this, arguments);
      }

      return getEditSkills;
    }()
  }, {
    key: "addSkill",
    value: function () {
      var _addSkill = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee4(req, res, next) {
        var errors, err, skillExistResponse, skillAddedResponse;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context4.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context4.abrupt("return", res.render("dashboard/skills/add", {
                  page_title: "Add a Skill",
                  data: {
                    old: req.body
                  },
                  flashes: req.flash()
                }));

              case 5:
                _context4.next = 7;
                return skillService.readOne({
                  "name.en": req.body["name.en"]
                });

              case 7:
                skillExistResponse = _context4.sent;

                if (!skillExistResponse.error) {
                  _context4.next = 10;
                  break;
                }

                return _context4.abrupt("return", next(skillExistResponse.errors));

              case 10:
                if ((0, _lodash.isEmpty)(skillExistResponse.data)) {
                  _context4.next = 13;
                  break;
                }

                req.flash("error", "There is a skill stored before with this name.");
                return _context4.abrupt("return", res.status(404).redirect("/dashboard/skills/list"));

              case 13:
                _context4.next = 15;
                return skillService.create(req.body);

              case 15:
                skillAddedResponse = _context4.sent;

                if (!skillAddedResponse.error) {
                  _context4.next = 18;
                  break;
                }

                return _context4.abrupt("return", next(skillAddedResponse.errors));

              case 18:
                req.flash("success", "New Skill added successfully");
                res.status(skillAddedResponse.statusCode).redirect("/dashboard/skills/list");

              case 20:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4);
      }));

      function addSkill(_x9, _x10, _x11) {
        return _addSkill.apply(this, arguments);
      }

      return addSkill;
    }()
  }, {
    key: "editSkill",
    value: function () {
      var _editSkill = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee5(req, res, next) {
        var errors, err, skillEditingResponse;
        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                errors = (0, _expressValidator.validationResult)(req);

                if (errors.isEmpty()) {
                  _context5.next = 5;
                  break;
                }

                err = errors.array();
                req.flash("error", err);
                return _context5.abrupt("return", res.redirect("back"));

              case 5:
                _context5.next = 7;
                return skillService.updateOne({
                  slug: req.params.slug
                }, {
                  $set: req.body
                });

              case 7:
                skillEditingResponse = _context5.sent;

                if (!skillEditingResponse.error) {
                  _context5.next = 10;
                  break;
                }

                return _context5.abrupt("return", next(skillEditingResponse.errors));

              case 10:
                req.flash("success", "successfully updated ".concat(skillEditingResponse.data.name.en, " data."));
                res.status(skillEditingResponse).redirect("/dashboard/skills/list");

              case 12:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5);
      }));

      function editSkill(_x12, _x13, _x14) {
        return _editSkill.apply(this, arguments);
      }

      return editSkill;
    }()
  }, {
    key: "deleteSkills",
    value: function () {
      var _deleteSkills = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee6(req, res, next) {
        var skillDeletionRespose, userSkillDeletionRespose;
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                _context6.next = 2;
                return skillService.deleteOne({
                  _id: req.params.id
                });

              case 2:
                skillDeletionRespose = _context6.sent;

                if (!skillDeletionRespose.error) {
                  _context6.next = 5;
                  break;
                }

                return _context6.abrupt("return", next(skillDeletionRespose.errors));

              case 5:
                _context6.next = 7;
                return userService.updateMany({
                  "profile.skills": skillDeletionRespose.data._id
                }, {
                  $pull: {
                    "profile.skills": skillDeletionRespose.data._id
                  }
                });

              case 7:
                userSkillDeletionRespose = _context6.sent;

                if (!userSkillDeletionRespose.error) {
                  _context6.next = 10;
                  break;
                }

                return _context6.abrupt("return", next(userSkillDeletionRespose.errors));

              case 10:
                req.flash("success", "Successfully deleted ".concat(skillDeletionRespose.data.name.en));
                res.status(skillDeletionRespose.statusCode).redirect("/dashboard/skills/list");

              case 12:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6);
      }));

      function deleteSkills(_x15, _x16, _x17) {
        return _deleteSkills.apply(this, arguments);
      }

      return deleteSkills;
    }()
  }]);
  return SkillController;
}(_Controller2["default"]);

var _default = new SkillController(_Skill["default"]);

exports["default"] = _default;