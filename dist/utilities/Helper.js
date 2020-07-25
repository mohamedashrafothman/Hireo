"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _crypto = _interopRequireDefault(require("crypto"));

var _url = _interopRequireDefault(require("url"));

var Helper = /*#__PURE__*/function () {
  function Helper() {
    (0, _classCallCheck2["default"])(this, Helper);
    this.dump = this.dump.bind(this);
    this.staticMap = this.staticMap.bind(this);
    this.urlSegment = this.urlSegment.bind(this);
    this.createRandomToken = this.createRandomToken.bind(this);
    this.fullUrl = this.fullUrl.bind(this);
    this.kmToRadian = this.kmToRadian.bind(this);
    this.milesToRadian = this.milesToRadian.bind(this);
    this.nFormatter = this.nFormatter.bind(this);
  }

  (0, _createClass2["default"])(Helper, [{
    key: "dump",
    value: function dump(obj) {
      return JSON.stringify(obj, null, 2);
    }
  }, {
    key: "staticMap",
    value: function staticMap(_ref) {
      var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
          lng = _ref2[0],
          lat = _ref2[1];

      return "https://maps.googleapis.com/maps/api/staticmap?center=".concat(lat, ",").concat(lng, "&zoom=14&size=800x150&key=").concat(process.env.MAP_KEY, "&markers=").concat(lat, ",").concat(lng, "&scale=2");
    }
  }, {
    key: "urlSegment",
    value: function urlSegment(req) {
      return req.path.split("/");
    }
  }, {
    key: "createRandomToken",
    value: function createRandomToken(byteNum) {
      return _crypto["default"].randomBytes(byteNum).toString("hex");
    }
  }, {
    key: "fullUrl",
    value: function fullUrl(req) {
      return _url["default"].format({
        protocol: req.protocol,
        host: req.get("host"),
        pathname: req.originalUrl
      });
    }
  }, {
    key: "kmToRadian",
    value: function kmToRadian(km) {
      return km / 6378;
    }
  }, {
    key: "milesToRadian",
    value: function milesToRadian(miles) {
      return miles / 3963;
    }
  }, {
    key: "nFormatter",
    value: function nFormatter(num, digits) {
      var si = [{
        value: 1,
        symbol: ""
      }, {
        value: 1E3,
        symbol: "k"
      }, {
        value: 1E6,
        symbol: "M"
      }, {
        value: 1E9,
        symbol: "G"
      }, {
        value: 1E12,
        symbol: "T"
      }, {
        value: 1E15,
        symbol: "P"
      }, {
        value: 1E18,
        symbol: "E"
      }];
      var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var i;

      for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
          break;
        }
      }

      return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
    }
  }]);
  return Helper;
}();

exports["default"] = Helper;