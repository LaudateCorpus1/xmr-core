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
var status_update_constants_1 = require("../../status_update_constants");
var fee_utils_1 = require("../fee_utils");
var errors_1 = require("../errors");
var logger_1 = require("../logger");
var tx_utils_1 = require("../tx_utils/tx_utils");
var amt_utils_1 = require("../amt_utils");
var xmr_str_utils_1 = require("../../../../../xmr-str-utils");
/**
 *
 * @description
 * 1. Recalculates the fee and total amount needed for the transaction to be sent. RCT + non sweeping transactions will have their
 * network fee increased if fee calculation based on the number of outputs needed is higher than the passed-in fee. RCT+ sweeping transactions
 * are just checked if they have enough balance to proceed with the transaction. Non-RCT transactions will have no fee recalculation done on them.
 *
 *
 * 2. The resulting return values from step 1 will then be validated so that the sender has sufficient balances to proceed with sending the transaction.
 * Then, a list of sending targets will be constructed, always consisting of the target address and amount they want to send to, and possibly a change address,
 * if the sum of outs is greater than the amount sent + fee needed, and possibly a fake address + 0 amount to keep output uniformity if no change address
 * was generated.
 *
 *
 * 3. Finally, a list of random outputs is fetched from API to be mixed into the transaction (for generation of the ring signature) to provide anonymity for the sender.
 *
 *
 * NOTE: This function may be called more than once (although I believe two times is the maximum) if the recalculated fee is lower than the
 * actual transaction fee needed when the final fee is calculated from the size of the transaction itself. In the case that the previously mentioned
 * condition is true, then this function will be re-called with the updated higher fee based on the transaction size in kb.
 * @export
 * @param {GetFundTargetsAndFeeParams} params
 */
function getRestOfTxData(params, outputAndAmountSelector) {
    return __awaiter(this, void 0, void 0, function () {
        var senderAddress, targetAddress, mixin, unusedOuts, simplePriority, feelessTotal, feePerKB, networkFee, isRingCT, isSweeping, updateStatus, api, nettype, baseTotalAmount, _a, remainingUnusedOuts, usingOuts, usingOutsAmount, _b, newFee, totalAmount, fundTargets, mixOuts;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    xmr_str_utils_1.JSONPrettyPrint("getRestOfTxData", params, "args");
                    senderAddress = params.senderAddress, targetAddress = params.targetAddress, mixin = params.mixin, unusedOuts = params.unusedOuts, simplePriority = params.simplePriority, feelessTotal = params.feelessTotal, feePerKB = params.feePerKB, networkFee = params.networkFee, isRingCT = params.isRingCT, isSweeping = params.isSweeping, updateStatus = params.updateStatus, api = params.api, nettype = params.nettype;
                    // Now we need to establish some values for balance validation and to construct the transaction
                    updateStatus(status_update_constants_1.sendFundStatus.calculatingFee);
                    baseTotalAmount = amt_utils_1.getBaseTotalAmount(isSweeping, feelessTotal, networkFee);
                    // logger_1.Log.Balance.requiredBase(baseTotalAmount, isSweeping);
                    _a = outputAndAmountSelector(baseTotalAmount, unusedOuts, isRingCT, isSweeping), remainingUnusedOuts = _a.remainingUnusedOuts, usingOuts = _a.usingOuts, usingOutsAmount = _a.usingOutsAmount;
                    _b = tx_utils_1.totalAmtAndEstFee({
                        baseTotalAmount: baseTotalAmount,
                        feelessTotal: feelessTotal,
                        feePerKB: feePerKB,
                        isRingCT: isRingCT,
                        isSweeping: isSweeping,
                        mixin: mixin,
                        networkFee: networkFee,
                        remainingUnusedOuts: remainingUnusedOuts,
                        simplePriority: simplePriority,
                        usingOuts: usingOuts,
                        usingOutsAmount: usingOutsAmount,
                    }), newFee = _b.newFee, totalAmount = _b.totalAmount;
                    // logger_1.Log.Balance.requiredPostRct(totalAmount);
                    fundTargets = tx_utils_1.validateAndConstructFundTargets({
                        senderAddress: senderAddress,
                        targetAddress: targetAddress,
                        feelessTotal: feelessTotal,
                        totalAmount: totalAmount,
                        usingOutsAmount: usingOutsAmount,
                        isRingCT: isRingCT,
                        isSweeping: isSweeping,
                        nettype: nettype,
                    }).fundTargets;
                    // logger_1.Log.Target.display(fundTargets);
                    // check for invalid mixin level
                    if (mixin < 0 || isNaN(mixin)) {
                        throw errors_1.ERR.MIXIN.INVAL;
                    }
                    if (!(mixin > 0)) return [3 /*break*/, 2];
                    updateStatus(status_update_constants_1.sendFundStatus.fetchingDecoyOutputs);
                    return [4 /*yield*/, api.randomOutputs(usingOuts, mixin)];
                case 1:
                    mixOuts = (_c.sent()).amount_outs;
                    xmr_str_utils_1.JSONPrettyPrint("getRestOfTxData", { mixOuts: mixOuts, fundTargets: fundTargets, newFee: newFee, usingOuts: usingOuts }, "ret with mixin > 0");
                    return [2 /*return*/, { mixOuts: mixOuts, fundTargets: fundTargets, newFee: newFee, usingOuts: usingOuts }];
                case 2:
                    xmr_str_utils_1.JSONPrettyPrint("getRestOfTxData", { fundTargets: fundTargets, newFee: newFee, usingOuts: usingOuts }, "ret with mixin = 0");
                    // mixin === 0: -- PSNOTE: is that even allowed?
                    return [2 /*return*/, { mixOuts: undefined, fundTargets: fundTargets, newFee: newFee, usingOuts: usingOuts }];
            }
        });
    });
}
exports.getRestOfTxData = getRestOfTxData;
/**
 * @description Creates the transaction blob and attempts to send it.
 *
 *
 * The transaction blob will be not sent if the resulting fee calculated based on the blobs size
 * is higher than the provided fee to the function, instead itll return a failure result, along
 * with the fee based on the transaction blob.
 *
 *
 * Otherwise, the serialized transaction blob will be sent to the API endpoint, along with
 * a success return value with the fee + transaction blobs' hash
 *
 * @export
 * @param {CreateTxAndAttemptToSendParams} params
 */
function createTxAndAttemptToSend(params) {
    return __awaiter(this, void 0, void 0, function () {
        var senderAddress, senderPrivateKeys, simplePriority, feePerKB, networkFee, updateStatus, api, _a, numOfKB, serializedSignedTx, txHash, txFee;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    senderAddress = params.senderAddress, senderPrivateKeys = params.senderPrivateKeys, simplePriority = params.simplePriority, feePerKB = params.feePerKB, networkFee = params.networkFee, updateStatus = params.updateStatus, api = params.api;
                    updateStatus(status_update_constants_1.sendFundStatus.constructingTransaction);
                    return [4 /*yield*/, tx_utils_1.constructTx(params)];
                case 1:
                    _a = _b.sent(), numOfKB = _a.numOfKB, serializedSignedTx = _a.serializedSignedTx, txHash = _a.txHash;
                    txFee = fee_utils_1.calculateFeeKb(feePerKB, numOfKB, fee_utils_1.multiplyFeePriority(simplePriority));
                    // if we need a higher fee
                    if (txFee.compare(networkFee) > 0) {
                        // logger_1.Log.Fee.estLowerThanReal(networkFee, txFee);
                        return [2 /*return*/, { success: false, txFee: txFee, txHash: txHash }];
                    }
                    // generated with correct per-kb fee
                    // logger_1.Log.Fee.successfulTx(networkFee);
                    updateStatus(status_update_constants_1.sendFundStatus.submittingTransaction);
                    xmr_str_utils_1.JSONPrettyPrint("createTxAndAttemptToSend", {
                        senderAddress: senderAddress,
                        viewKey: senderPrivateKeys.view,
                        serializedSignedTx: serializedSignedTx,
                    }, "pre submitSerializedSignedTransaction");
                    return [4 /*yield*/, api.submitSerializedSignedTransaction(senderAddress, senderPrivateKeys.view, serializedSignedTx)];
                case 2:
                    _b.sent();
                    return [2 /*return*/, { success: true, txFee: networkFee, txHash: txHash }];
            }
        });
    });
}
exports.createTxAndAttemptToSend = createTxAndAttemptToSend;
//# sourceMappingURL=construct_tx_and_send.js.map
