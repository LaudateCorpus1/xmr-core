"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request_utils_1 = require("./request-utils");
var mymonero_config_1 = require("../mymonero-config");
var xmr_constants_1 = require("../../../xmr-constants");
var response_parsers_1 = require("./response-parsers");
var biginteger_1 = require("../../../biginteger");
var xmr_crypto_utils_1 = require("../../../xmr-crypto-utils");
var xmr_str_utils_1 = require("../../../xmr-str-utils");
var MyMoneroApi = /** @class */ (function () {
    function MyMoneroApi() {
    }
    MyMoneroApi.login = function (address, privViewKey) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = {
                            address: address,
                            view_key: privViewKey,
                            create_account: true,
                        };
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "login", parameters)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, data.new_address];
                }
            });
        });
    };
    MyMoneroApi.addressInfo = function (address, privViewKey, pubSpendKey, privSpendKey, hwdev) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, data, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        parameters = {
                            address: address,
                            view_key: privViewKey,
                        };
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "get_address_info", parameters)];
                    case 1:
                        data = _d.sent();
                        _a = response_parsers_1.parseAddressInfo;
                        _b = [address,
                            data];
                        if (!xmr_crypto_utils_1.isRealDevice(hwdev)) return [3 /*break*/, 3];
                        return [4 /*yield*/, hwdev.get_secret_keys()];
                    case 2:
                        _c = (_d.sent()).viewKey;
                        return [3 /*break*/, 4];
                    case 3:
                        _c = privViewKey;
                        _d.label = 4;
                    case 4: return [2 /*return*/, _a.apply(void 0, _b.concat([_c, pubSpendKey,
                            privSpendKey,
                            hwdev]))];
                }
            });
        });
    };
    MyMoneroApi.addressTransactions = function (address, privViewKey, pubSpendKey, privSpendKey, hwdev) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, data, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        parameters = {
                            address: address,
                            view_key: privViewKey,
                        };
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "get_address_txs", parameters)];
                    case 1:
                        data = _d.sent();
                        _a = response_parsers_1.parseAddressTransactions;
                        _b = [address,
                            data];
                        if (!xmr_crypto_utils_1.isRealDevice(hwdev)) return [3 /*break*/, 3];
                        return [4 /*yield*/, hwdev.get_secret_keys()];
                    case 2:
                        _c = (_d.sent()).viewKey;
                        return [3 /*break*/, 4];
                    case 3:
                        _c = privViewKey;
                        _d.label = 4;
                    case 4: return [2 /*return*/, _a.apply(void 0, _b.concat([_c, pubSpendKey,
                            privSpendKey,
                            hwdev]))];
                }
            });
        });
    };
    // Getting wallet txs import info
    MyMoneroApi.importRequestInfoAndStatus = function (address, privViewKey) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = request_utils_1.withUserAgentParams({
                            address: address,
                            view_key: privViewKey,
                        });
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "import_wallet_request", parameters)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, {
                                payment_id: data.payment_id,
                                payment_address: data.payment_address,
                                import_fee: new biginteger_1.BigInt(data.import_fee),
                                feeReceiptStatus: data.feeReceiptStatus,
                            }];
                }
            });
        });
    };
    // Getting outputs for sending funds
    MyMoneroApi.unspentOutputs = function (address, privViewKey, pubSpendKey, privSpendKey, mixinNumber, hwdev) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, data, _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        xmr_str_utils_1.JSONPrettyPrint("unspentOutputs", {
                            address: address,
                            privViewKey: privViewKey,
                            pubSpendKey: pubSpendKey,
                            privSpendKey: privSpendKey,
                            mixinNumber: mixinNumber,
                        }, "args");
                        parameters = request_utils_1.withUserAgentParams({
                            address: address,
                            view_key: privViewKey,
                            amount: "0",
                            mixin: mixinNumber,
                            use_dust: true,
                            dust_threshold: xmr_constants_1.config.dustThreshold.toString(),
                        });
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "get_unspent_outs", parameters)];
                    case 1:
                        data = _d.sent();
                        xmr_str_utils_1.JSONPrettyPrint("unspentOutputs", {
                            parameters: parameters,
                            data: data,
                        }, "pre_parseUnspentOutputs_dataAndParams");
                        _a = response_parsers_1.parseUnspentOutputs;
                        _b = [address,
                            data];
                        if (!xmr_crypto_utils_1.isRealDevice(hwdev)) return [3 /*break*/, 3];
                        return [4 /*yield*/, hwdev.get_secret_keys()];
                    case 2:
                        _c = (_d.sent()).viewKey;
                        return [3 /*break*/, 4];
                    case 3:
                        _c = privViewKey;
                        _d.label = 4;
                    case 4: return [2 /*return*/, _a.apply(void 0, _b.concat([_c, pubSpendKey,
                            privSpendKey,
                            hwdev]))];
                }
            });
        });
    };
    MyMoneroApi.randomOutputs = function (usingOuts, mixin) {
        return __awaiter(this, void 0, void 0, function () {
            var amounts, parameters, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        xmr_str_utils_1.JSONPrettyPrint("randomOutputs", { usingOuts: usingOuts, mixin: mixin }, "args");
                        if (mixin < 0 || isNaN(mixin)) {
                            throw Error("Invalid mixin - must be >= 0");
                        }
                        amounts = usingOuts.map(function (o) { return (o.rct ? "0" : o.amount.toString()); });
                        parameters = request_utils_1.withUserAgentParams({
                            amounts: amounts,
                            count: mixin + 1,
                        });
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "get_random_outs", parameters)];
                    case 1:
                        data = _a.sent();
                        xmr_str_utils_1.JSONPrettyPrint("randomOutputs", { amount_outs: data.amount_outs }, "ret");
                        return [2 /*return*/, { amount_outs: data.amount_outs }];
                }
            });
        });
    };
    MyMoneroApi.submitSerializedSignedTransaction = function (address, privViewKey, serializedSignedTx) {
        return __awaiter(this, void 0, void 0, function () {
            var parameters, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parameters = request_utils_1.withUserAgentParams({
                            address: address,
                            view_key: privViewKey,
                            tx: serializedSignedTx,
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request_utils_1.makeRequest(mymonero_config_1.myMoneroConfig.hostName, "submit_raw_tx", parameters)];
                    case 2: return [2 /*return*/, _a.sent()];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [2 /*return*/, Error("Something unexpected occurred when submitting your transaction: " +
                                e_1)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return MyMoneroApi;
}());
exports.MyMoneroApi = MyMoneroApi;
//# sourceMappingURL=host-api.js.map
