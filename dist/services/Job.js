"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _lodash = require("lodash");

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _Service2 = _interopRequireDefault(require("../utilities/Service"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var JobService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(JobService, _Service);

  var _super = _createSuper(JobService);

  function JobService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, JobService);
    _this = _super.call(this, model);
    _this.getMinMax = _this.getMinMax.bind((0, _assertThisInitialized2["default"])(_this));
    _this.getTags = _this.getTags.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(JobService, [{
    key: "getMinMax",
    value: function () {
      var _getMinMax = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(match_query) {
        var _yield$to, _yield$to2, minMaxErrors, minMax;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awaitToJs["default"])(this.model.aggregate([{
                  $match: match_query
                }, {
                  $project: {
                    "salary.min": 1,
                    "salary.max": 1
                  }
                }, {
                  $group: {
                    _id: "$_id",
                    minValue: {
                      $min: "$salary.min"
                    },
                    maxValue: {
                      $max: "$salary.max"
                    }
                  }
                }, {
                  $group: {
                    _id: null,
                    minValue: {
                      $min: "$minValue"
                    },
                    maxValue: {
                      $max: "$maxValue"
                    }
                  }
                }]));

              case 2:
                _yield$to = _context.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
                minMaxErrors = _yield$to2[0];
                minMax = _yield$to2[1];

                if (!minMaxErrors) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: minMaxErrors
                });

              case 8:
                return _context.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: minMax
                });

              case 9:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function getMinMax(_x) {
        return _getMinMax.apply(this, arguments);
      }

      return getMinMax;
    }()
  }, {
    key: "getTags",
    value: function () {
      var _getTags = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(match_query) {
        var _yield$to3, _yield$to4, tagsErrors, tags;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return (0, _awaitToJs["default"])(this.model.aggregate([{
                  $match: match_query
                }, {
                  $project: {
                    tags: 1
                  }
                }, {
                  $unwind: "$tags"
                }, {
                  $group: {
                    _id: "$tags",
                    count: {
                      $sum: 1
                    }
                  }
                }, {
                  $project: {
                    _id: 0,
                    name: "$_id",
                    count: 1
                  }
                }, {
                  $sort: {
                    count: -1
                  }
                }]));

              case 2:
                _yield$to3 = _context2.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 2);
                tagsErrors = _yield$to4[0];
                tags = _yield$to4[1];

                if (!tagsErrors) {
                  _context2.next = 8;
                  break;
                }

                return _context2.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: tagsErrors
                });

              case 8:
                return _context2.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: tags
                });

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function getTags(_x2) {
        return _getTags.apply(this, arguments);
      }

      return getTags;
    }()
  }, {
    key: "getBySlug",
    value: function () {
      var _getBySlug = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3(slug, logged_in_user) {
        var _yield$to5, _yield$to6, jobErrors, job;

        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  slug: slug,
                  $or: [{
                    is_published: true
                  }, _objectSpread({}, logged_in_user && {
                    created_by: logged_in_user._id
                  })]
                }).populate({
                  path: "created_by",
                  select: "_id rating email is_verified slug account.name account.picture account.picture_sm account.picture_md account.picture_lg profile.nationality",
                  populate: [{
                    path: "profile.nationality",
                    select: "name code -_id"
                  }, {
                    path: "account.picture",
                    select: "path -_id"
                  }, {
                    path: "account.picture_sm",
                    select: "path -_id"
                  }, {
                    path: "account.picture_md",
                    select: "path -_id"
                  }, {
                    path: "account.picture_lg",
                    select: "path -_id"
                  }]
                }).populate({
                  path: "category",
                  select: "name parent children"
                }).populate({
                  path: "type",
                  select: "name slug"
                }).populate({
                  path: "applications",
                  select: "created_by"
                }).populate({
                  path: "attachments",
                  select: "_id base extname path name"
                }));

              case 2:
                _yield$to5 = _context3.sent;
                _yield$to6 = (0, _slicedToArray2["default"])(_yield$to5, 2);
                jobErrors = _yield$to6[0];
                job = _yield$to6[1];

                if (!jobErrors) {
                  _context3.next = 8;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: jobErrors
                });

              case 8:
                if (!(0, _lodash.isEmpty)(job)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("return", {
                  error: true,
                  statusCode: 404,
                  errors: ["Not Found!"]
                });

              case 10:
                return _context3.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: job
                });

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function getBySlug(_x3, _x4) {
        return _getBySlug.apply(this, arguments);
      }

      return getBySlug;
    }()
  }]);
  return JobService;
}(_Service2["default"]);

exports["default"] = JobService;