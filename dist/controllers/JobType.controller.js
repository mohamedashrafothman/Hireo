"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _Controller2 = _interopRequireDefault(require("../utilities/Controller"));

var _Job_type = _interopRequireDefault(require("../models/Job_type.model"));

var _JobTypeService = _interopRequireDefault(require("../services/JobTypeService"));

function _createSuper(Derived) { return function () { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var jobTypeService = new _JobTypeService["default"](_Job_type["default"]);

var JobTypeController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(JobTypeController, _Controller);

  var _super = _createSuper(JobTypeController);

  function JobTypeController(service) {
    (0, _classCallCheck2["default"])(this, JobTypeController);
    return _super.call(this, service);
  }

  return JobTypeController;
}(_Controller2["default"]);

var _default = new JobTypeController(jobTypeService);

exports["default"] = _default;