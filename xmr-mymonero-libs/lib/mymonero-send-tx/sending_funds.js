"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fee_utils_1 = require("./internal_libs/fee_utils");
var mixin_utils_1 = require("./mixin_utils");
var status_update_constants_1 = require("./status_update_constants");
var errors_1 = require("./internal_libs/errors");
var logger_1 = require("./internal_libs/logger");
var parse_target_1 = require("./internal_libs/parse_target");
var pid_utils_1 = require("./internal_libs/pid_utils");
var construct_tx_and_send_1 = require("./internal_libs/construct_tx_and_send");
var biginteger_1 = require("@xmr-core/biginteger");
var xmr_transaction_1 = require("@xmr-core/xmr-transaction");
var xmr_money_1 = require("@xmr-core/xmr-money");
var __1 = require("../");
var output_selection_1 = require("./internal_libs/output_selection");
var xmr_crypto_utils_1 = require("@xmr-core/xmr-crypto-utils");
var xmr_str_utils_1 = require("@xmr-core/xmr-str-utils");
function estimatedTransactionNetworkFee(nonZeroMixin, feePerKB, simplePriority) {
    var numOfInputs = 2; // this might change -- might select inputs
    var numOfOutputs = 1 /*dest*/ + 1 /*change*/ + 0; /*no mymonero fee presently*/
    // TODO: update est tx size for bulletproofs
    // TODO: normalize est tx size fn naming
    var estimatedTxSize = xmr_transaction_1.estimateRctSize(numOfInputs, nonZeroMixin, numOfOutputs);
    var estFee = fee_utils_1.calculateFee(feePerKB, estimatedTxSize, fee_utils_1.multiplyFeePriority(simplePriority));
    return estFee;
}
exports.estimatedTransactionNetworkFee = estimatedTransactionNetworkFee;
function sendFundsSimple(targetAddress, amount, pid, updateStatus, hwdev) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, spend_public_key, view_public_key, address, senderPrivateKeys, _b, senderPublicKeys;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!xmr_crypto_utils_1.isRealDevice(hwdev)) {
                        throw Error("[sendFundsSimple] This function can only be used with a real hardware device");
                    }
                    return [4 /*yield*/, hwdev.get_public_address()];
                case 1:
                    _a = _c.sent(), spend_public_key = _a.spend_public_key, view_public_key = _a.view_public_key;
                    return [4 /*yield*/, xmr_crypto_utils_1.getAddressString(hwdev)];
                case 2:
                    address = _c.sent();
                    _b = {};
                    return [4 /*yield*/, hwdev.get_secret_keys()];
                case 3:
                    _b.spend = (_c.sent()).spendKey;
                    return [4 /*yield*/, hwdev.export_private_view_key()];
                case 4:
                    senderPrivateKeys = (_b.view = _c.sent(),
                        _b);
                    senderPublicKeys = {
                        spend: spend_public_key,
                        view: view_public_key,
                    };
                    return [4 /*yield*/, sendFunds(targetAddress, xmr_crypto_utils_1.NetType.MAINNET, amount, false, address, senderPrivateKeys, senderPublicKeys, pid, mixin_utils_1.fixedMixin(), fee_utils_1.DEFAULT_FEE_PRIORITY, hwdev, updateStatus)];
                case 5: return [2 /*return*/, _c.sent()];
            }
        });
    });
}
exports.sendFundsSimple = sendFundsSimple;
function sendFundsRawKeys(targetAddress, amount, senderAddress, senderPrivateKeys, senderPublicKeys, updateStatus) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, sendFunds(targetAddress, xmr_crypto_utils_1.NetType.MAINNET, amount, false, senderAddress, senderPrivateKeys, senderPublicKeys, null, mixin_utils_1.fixedMixin(), fee_utils_1.DEFAULT_FEE_PRIORITY, new xmr_crypto_utils_1.DefaultDevice(), updateStatus)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.sendFundsRawKeys = sendFundsRawKeys;
function sendFunds(targetAddress, // currency-ready wallet address, but not an OpenAlias address (resolve before calling)
nettype, amountOrZeroWhenSweep, // n value will be ignored for sweep
isSweeping, // send true to sweep - amountorZeroWhenSweep will be ignored
senderAddress, senderPrivateKeys, senderPublicKeys, pidToParse, mixin, simplePriority, hwdev, updateStatus, outputAndAmountSelector, api) {
    if (outputAndAmountSelector === void 0) { outputAndAmountSelector = output_selection_1.selectOutputsAndAmountForMixin; }
    if (api === void 0) { api = __1.MyMoneroApi; }
    return __awaiter(this, void 0, void 0, function () {
        var isRingCT, targetAmount, target, singleTarget, address, amount, feelessTotal, pidData, _a, feePerKB, unusedOuts, minNetworkTxSizeKb, estMinNetworkFee, senderkeys, targetData, feeMeta, txMeta, externApis, networkFee, _b, mixOuts, fundTargets, newFee, usingOuts, _c, txFee, txHash, success, sentAmount;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    xmr_str_utils_1.JSONPrettyPrint("sendFunds", {
                        targetAddress: targetAddress,
                        nettype: nettype,
                        amountOrZeroWhenSweep: amountOrZeroWhenSweep,
                        isSweeping: isSweeping,
                        senderAddress: senderAddress,
                        senderPrivateKeys: senderPrivateKeys,
                        senderPublicKeys: senderPublicKeys,
                        pidToParse: pidToParse,
                        mixin: mixin,
                        simplePriority: simplePriority,
                    }, "args");
                    isRingCT = true;
                    if (mixin < mixin_utils_1.minMixin()) {
                        throw errors_1.ERR.RING.INSUFF;
                    }
                    targetAmount = isSweeping ? 0 : amountOrZeroWhenSweep;
                    target = {
                        address: targetAddress,
                        amount: targetAmount,
                    };
                    singleTarget = parse_target_1.parseTargets([target], // requires a list of descriptions - but SendFunds was
                    // not written with multiple target support as MyMonero does not yet support it
                    nettype)[0];
                    if (!singleTarget) {
                        throw errors_1.ERR.DEST.INVAL;
                    }
                    address = singleTarget.address, amount = singleTarget.amount;
                    feelessTotal = new biginteger_1.BigInt(amount);
                    logger_1.Log.Amount.beforeFee(feelessTotal, isSweeping);
                    if (!isSweeping && feelessTotal.compare(0) <= 0) {
                        throw errors_1.ERR.AMT.INSUFF;
                    }
                    pidData = pid_utils_1.checkAddressAndPidValidity(address, nettype, pidToParse);
                    updateStatus(status_update_constants_1.sendFundStatus.fetchingLatestBalance);
                    return [4 /*yield*/, api.unspentOutputs(senderAddress, senderPrivateKeys.view, senderPublicKeys.spend, senderPrivateKeys.spend, mixin, hwdev)];
                case 1:
                    _a = _d.sent(), feePerKB = _a.per_kb_fee, unusedOuts = _a.unusedOuts;
                    minNetworkTxSizeKb = 13;
                    estMinNetworkFee = fee_utils_1.calculateFeeKb(feePerKB, minNetworkTxSizeKb, fee_utils_1.multiplyFeePriority(simplePriority));
                    senderkeys = {
                        senderAddress: senderAddress,
                        senderPublicKeys: senderPublicKeys,
                        senderPrivateKeys: senderPrivateKeys,
                    };
                    targetData = {
                        targetAddress: targetAddress,
                        targetAmount: targetAmount,
                    };
                    feeMeta = {
                        simplePriority: simplePriority,
                        feelessTotal: feelessTotal,
                        feePerKB: feePerKB,
                    };
                    txMeta = {
                        isRingCT: isRingCT,
                        isSweeping: isSweeping,
                        nettype: nettype,
                    };
                    externApis = {
                        updateStatus: updateStatus,
                        api: api,
                    };
                    networkFee = estMinNetworkFee;
                    _d.label = 2;
                case 2:
                    if (!true) return [3 /*break*/, 5];
                    return [4 /*yield*/, construct_tx_and_send_1.getRestOfTxData(__assign({}, senderkeys, targetData, { mixin: mixin,
                            unusedOuts: unusedOuts }, feeMeta, { networkFee: networkFee }, txMeta, externApis), outputAndAmountSelector)];
                case 3:
                    _b = _d.sent(), mixOuts = _b.mixOuts, fundTargets = _b.fundTargets, newFee = _b.newFee, usingOuts = _b.usingOuts;
                    networkFee = newFee; // reassign network fee to the new fee returned
                    return [4 /*yield*/, construct_tx_and_send_1.createTxAndAttemptToSend(__assign({}, senderkeys, targetData, { fundTargets: fundTargets }, pidData, { mixin: mixin,
                            mixOuts: mixOuts,
                            usingOuts: usingOuts }, feeMeta, { networkFee: networkFee }, txMeta, externApis, { hwdev: hwdev }))];
                case 4:
                    _c = _d.sent(), txFee = _c.txFee, txHash = _c.txHash, success = _c.success;
                    if (success) {
                        sentAmount = isSweeping
                            ? parseFloat(xmr_money_1.formatMoneyFull(feelessTotal))
                            : targetAmount;
                        return [2 /*return*/, {
                                pid: pidData.pid,
                                sentAmount: sentAmount,
                                targetAddress: targetAddress,
                                txFee: txFee,
                                txHash: txHash,
                            }];
                    }
                    else {
                        // if the function call failed
                        // means that we need a higher fee that was returned
                        // so reassign network fee to it
                        networkFee = txFee;
                    }
                    return [3 /*break*/, 2];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.sendFunds = sendFunds;
//# sourceMappingURL=sending_funds.js.map