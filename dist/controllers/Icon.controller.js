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

var _Icon = _interopRequireDefault(require("../models/Icon.model"));

var _Icon2 = _interopRequireDefault(require("../services/Icon"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var iconService = new _Icon2["default"](_Icon["default"]);

var IconController = /*#__PURE__*/function (_Controller) {
  (0, _inherits2["default"])(IconController, _Controller);

  var _super = _createSuper(IconController);

  function IconController(service) {
    (0, _classCallCheck2["default"])(this, IconController);
    return _super.call(this, service);
  }

  return IconController;
}(_Controller2["default"]);

var _default = new IconController(iconService);

exports["default"] = _default;