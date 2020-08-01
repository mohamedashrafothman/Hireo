"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _assertThisInitialized2 = _interopRequireDefault(require("@babel/runtime/helpers/assertThisInitialized"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _pug = _interopRequireDefault(require("pug"));

var _juice = _interopRequireDefault(require("juice"));

var _nodemailer = _interopRequireDefault(require("nodemailer"));

var _htmlToText = _interopRequireDefault(require("html-to-text"));

var _awaitToJs = _interopRequireDefault(require("await-to-js"));

var _Service2 = _interopRequireDefault(require("../utilities/Service"));

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2["default"])(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2["default"])(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2["default"])(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var EmailService = /*#__PURE__*/function (_Service) {
  (0, _inherits2["default"])(EmailService, _Service);

  var _super = _createSuper(EmailService);

  function EmailService(model) {
    var _this;

    (0, _classCallCheck2["default"])(this, EmailService);
    _this = _super.call(this, model);
    _this._HTMLGenerator = _this._HTMLGenerator.bind((0, _assertThisInitialized2["default"])(_this));
    _this._transporter = _this._transporter.bind((0, _assertThisInitialized2["default"])(_this));
    _this.send = _this.send.bind((0, _assertThisInitialized2["default"])(_this));
    return _this;
  }

  (0, _createClass2["default"])(EmailService, [{
    key: "_HTMLGenerator",
    value: function _HTMLGenerator() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      return (0, _juice["default"])(_pug["default"].renderFile("".concat(process.cwd(), "/views/emails/").concat(options.filename, ".pug"), options));
    }
  }, {
    key: "_transporter",
    value: function _transporter(options) {
      var html = this._HTMLGenerator(options);

      var text = _htmlToText["default"].fromString(html);

      this.mailOptions = {
        from: options.from,
        to: options.to.email,
        subject: options.subject,
        html: html,
        text: text
      };
      return _nodemailer["default"].createTransport({
        host: String(process.env.MAIL_HOST),
        port: Number(process.env.MAIL_PORT),
        secure: false,
        // true for 465, false for other ports
        auth: {
          user: String(process.env.MAIL_USER),
          // generated ethereal user
          pass: String(process.env.MAIL_PASS) // generated ethereal password

        },
        tls: {
          rejectUnautherized: false
        }
      }).sendMail(this.mailOptions);
    }
  }, {
    key: "send",
    value: function () {
      var _send = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(data) {
        var _yield$to, _yield$to2, sendEmailError, _yield$to3, _yield$to4, err, createdEmail;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return (0, _awaitToJs["default"])(this._transporter(data));

              case 2:
                _yield$to = _context.sent;
                _yield$to2 = (0, _slicedToArray2["default"])(_yield$to, 1);
                sendEmailError = _yield$to2[0];

                if (!sendEmailError) {
                  _context.next = 7;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: sendEmailError
                });

              case 7:
                _context.next = 9;
                return (0, _awaitToJs["default"])(this.create(this.mailOptions));

              case 9:
                _yield$to3 = _context.sent;
                _yield$to4 = (0, _slicedToArray2["default"])(_yield$to3, 2);
                err = _yield$to4[0];
                createdEmail = _yield$to4[1];

                if (!err) {
                  _context.next = 15;
                  break;
                }

                return _context.abrupt("return", {
                  error: true,
                  statusCode: 500,
                  errors: err
                });

              case 15:
                return _context.abrupt("return", createdEmail);

              case 16:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function send(_x) {
        return _send.apply(this, arguments);
      }

      return send;
    }()
  }]);
  return EmailService;
}(_Service2["default"]);

exports["default"] = EmailService;