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

var _Job = _interopRequireDefault(require("../models/Job.model"));

var _Job2 = _interopRequireDefault(require("./Job"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var jobService = new _Job2["default"](_Job["default"]);

var ApplicationService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(ApplicationService, _Service);

  var _super = _createSuper(ApplicationService);

  function ApplicationService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, ApplicationService);
    _this = _super.call(this, model);
    _this.isAppliedBefore = _this.isAppliedBefore.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(ApplicationService, [{
    key: "isAppliedBefore",
    value: function () {
      var _isAppliedBefore = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(job_id, created_by_id) {
        var _yield$to, _yield$to2, applicationErrors, application;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awaitToJs["default"])(this.model.findOne({
                  job: job_id,
                  created_by: created_by_id
                }));

              case 2:
                _yield$to = _context.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 2);
                applicationErrors = _yield$to2[0];
                application = _yield$to2[1];

                if (!applicationErrors) {
                  _context.next = 8;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: applicationErrors
                });

              case 8:
                if ((0, _lodash.isEmpty)(application)) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt("return", {
                  error: false,
                  statusCode: 409,
                  data: {
                    isAppliedBefore: true
                  }
                });

              case 10:
                return _context.abrupt("return", {
                  error: false,
                  statusCode: 200,
                  data: {
                    isAppliedBefore: false
                  }
                });

              case 11:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function isAppliedBefore(_x, _x2) {
        return _isAppliedBefore.apply(this, arguments);
      }

      return isAppliedBefore;
    }()
  }, {
    key: "unSeenApplicationsByUser",
    value: function () {
      var _unSeenApplicationsByUser = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2(user) {
        var jobReadResponse, unSeenApplicationsResponse;
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return jobService.readMany(_objectSpread({}, user && user.role !== "admin" && {
                  created_by: user._id
                }), {
                  pagination: false
                });

              case 2:
                jobReadResponse = _context2.sent;

                if (!jobReadResponse.error) {
                  _context2.next = 5;
                  break;
                }

                return _context2.abrupt("return", jobReadResponse);

              case 5:
                _context2.next = 7;
                return this.readMany({
                  job: {
                    $in: jobReadResponse.data.map(function (current) {
                      return current._id;
                    })
                  },
                  was_seen: false
                }, {
                  select: "_id",
                  pagination: false
                });

              case 7:
                unSeenApplicationsResponse = _context2.sent;
                return _context2.abrupt("return", unSeenApplicationsResponse);

              case 9:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function unSeenApplicationsByUser(_x3) {
        return _unSeenApplicationsByUser.apply(this, arguments);
      }

      return unSeenApplicationsByUser;
    }()
  }]);
  return ApplicationService;
}(_Service2["default"]);

exports["default"] = ApplicationService;