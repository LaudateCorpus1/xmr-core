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
var key_utils_1 = require("../key_utils");
var errors_1 = require("../errors");
var logger_1 = require("../logger");
var arr_utils_1 = require("../arr_utils");
var fee_utils_1 = require("../fee_utils");
var biginteger_1 = require("xmr-core/biginteger");
var xmr_transaction_1 = require("xmr-core/xmr-transaction");
var xmr_fast_hash_1 = require("xmr-core/xmr-fast-hash");
var xmr_crypto_utils_1 = require("xmr-core/xmr-crypto-utils");
var xmr_constants_1 = require("xmr-core/xmr-constants");
var xmr_money_1 = require("xmr-core/xmr-money");
var xmr_crypto_utils_2 = require("xmr-core/xmr-crypto-utils");
var xmr_str_utils_1 = require("xmr-core/xmr-str-utils");
// #region totalAmtAndEstFee
/**
 * @description
 * Recalculates the fee and total amount needed for the transaction to be sent. RCT + non sweeping transactions will have their
 * network fee increased if fee calculation based on the number of outputs needed is higher than the passed-in fee. RCT+ sweeping transactions
 * are just checked if they have enough balance to proceed with the transaction. Non-RCT transactions will have no fee recalculation done on them.

 * @export
 * @param {TotalAmtAndEstFeeParams} params
 * @returns
 */
function totalAmtAndEstFee(params) {
    var baseTotalAmount = params.baseTotalAmount, networkFee = params.networkFee, isRingCT = params.isRingCT, usingOuts = params.usingOuts;
    if (!isRingCT) {
        return { newFee: networkFee, totalAmount: baseTotalAmount };
    }
    /* if (usingOuts.length > 1 && isRingCT )*/
    var _a = estRctFeeAndAmt(params), newFee = _a.newFee, totalAmount = _a.totalAmount;
    logger_1.Log.Fee.basedOnInputs(newFee, usingOuts);
    return { newFee: newFee, totalAmount: totalAmount };
}
exports.totalAmtAndEstFee = totalAmtAndEstFee;
function estRctFeeAndAmt(params) {
    var mixin = params.mixin, usingOuts = params.usingOuts, usingOutsAmount = params.usingOutsAmount, simplePriority = params.simplePriority, feePerKB = params.feePerKB, // obtained from server, so passed in
    networkFee = params.networkFee, isSweeping = params.isSweeping;
    var feeBasedOnOuts = fee_utils_1.calculateFee(feePerKB, xmr_transaction_1.estimateRctSize(usingOuts.length, mixin, 2), fee_utils_1.multiplyFeePriority(simplePriority));
    // if newNeededFee < neededFee, use neededFee instead
    //(should only happen on the 2nd or later times through(due to estimated fee being too low))
    if (feeBasedOnOuts.compare(networkFee) < 0) {
        feeBasedOnOuts = networkFee;
    }
    var _a = isSweeping
        ? estRctSwpingAmt(usingOutsAmount, feeBasedOnOuts)
        : estRctNonSwpAmt(params, feeBasedOnOuts), totalAmount = _a[0], newFee = _a[1];
    return { totalAmount: totalAmount, newFee: newFee };
}
function estRctSwpingAmt(usingOutsAmount, fee) {
    /*
    // When/if sending to multiple destinations supported, uncomment and port this:
    if (dsts.length !== 1) {
        deferred.reject("Sweeping to multiple accounts is not allowed");
        return;
    }
    */
    // feeless total is equivalent to all outputs (since its a sweeping tx)
    // subtracted from the newNeededFee  (either from min tx cost or calculated cost based on outputs)
    var _feelessTotal = usingOutsAmount.subtract(fee);
    // if the feeless total is less than 0 (so sum of all outputs is still less than network fee)
    // then reject tx
    if (_feelessTotal.compare(0) < 1) {
        throw errors_1.ERR.BAL.insuff(usingOutsAmount, fee);
    }
    // otherwise make the total amount the feeless total + the new fee
    var totalAmount = _feelessTotal.add(fee);
    return [totalAmount, fee];
}
function estRctNonSwpAmt(params, fee) {
    var mixin = params.mixin, remainingUnusedOuts = params.remainingUnusedOuts, usingOuts = params.usingOuts, usingOutsAmount = params.usingOutsAmount, simplePriority = params.simplePriority, feelessTotal = params.feelessTotal, feePerKB = params.feePerKB;
    // make the current total amount equivalent to the feeless total and the new needed fee
    var currTotalAmount = feelessTotal.add(fee);
    // add outputs 1 at a time till we either have them all or can meet the fee
    // this case can happen when the fee calculated via outs size
    // is greater than the minimum tx fee size,
    // requiring a higher fee, so more outputs (if available)
    // need to be selected to fufill the difference
    var newFee = fee;
    while (usingOutsAmount.compare(currTotalAmount) < 0 &&
        remainingUnusedOuts.length > 0) {
        var out = arr_utils_1.popRandElement(remainingUnusedOuts);
        logger_1.Log.Output.display(out);
        // and recalculate invalidated values
        newFee = fee_utils_1.calculateFee(feePerKB, xmr_transaction_1.estimateRctSize(usingOuts.length, mixin, 2), fee_utils_1.multiplyFeePriority(simplePriority));
        currTotalAmount = feelessTotal.add(newFee);
    }
    var totalAmount = currTotalAmount;
    return [totalAmount, newFee];
}
// #endregion totalAmtAndEstFee
// #region validateAndConstructFundTargets
/**
 * @description
 * 1. Validates the total amount needed for the tx against the available amounts via the sum of all outputs
 * to see if the sender has sufficient funds.
 *
 * 2. Then, a list of sending targets will be constructed, always consisting of the target address and amount they want to send to, and possibly a change address,
 * if the sum of outs is greater than the amount sent + fee needed, and possibly a fake address + 0 amount to keep output uniformity if no change address
 * was generated.
 *
 * @export
 * @param {ConstructFundTargetsParams} params
 * @returns
 */
function validateAndConstructFundTargets(params) {
    var senderAddress = params.senderAddress, targetAddress = params.targetAddress, feelessTotal = params.feelessTotal, totalAmount = params.totalAmount, usingOutsAmount = params.usingOutsAmount, isSweeping = params.isSweeping, isRingCT = params.isRingCT, nettype = params.nettype;
    // Now we can validate available balance with usingOutsAmount (TODO? maybe this check can be done before selecting outputs?)
    var outsCmpToTotalAmounts = usingOutsAmount.compare(totalAmount);
    var outsLessThanTotal = outsCmpToTotalAmounts < 0;
    var outsGreaterThanTotal = outsCmpToTotalAmounts > 0;
    var outsEqualToTotal = outsCmpToTotalAmounts === 0;
    // what follows is comparision of the sum of outs amounts
    // vs the total amount actually needed
    // while also building up a list of addresses to send to
    // along with the amounts
    if (outsLessThanTotal) {
        throw errors_1.ERR.BAL.insuff(usingOutsAmount, totalAmount);
    }
    // Now we can put together the list of fund transfers we need to perform
    // excluding the tx fee
    // since that is included in the tx in its own field
    var fundTargets = []; // to build…
    // I. the actual transaction the user is asking to do
    fundTargets.push({
        address: targetAddress,
        amount: feelessTotal,
    });
    // the fee that the hosting provider charges
    // NOTE: The fee has been removed for RCT until a later date
    // fundTransferDescriptions.push({
    //			 address: hostedMoneroAPIClient.HostingServiceFeeDepositAddress(),
    //			 amount: hostingService_chargeAmount
    // })
    // some amount of the total outputs will likely need to be returned to the user as "change":
    if (outsGreaterThanTotal) {
        if (isSweeping) {
            throw errors_1.ERR.SWEEP.TOTAL_NEQ_OUTS;
        }
        // where the change amount is whats left after sending to other addresses + fee
        var changeAmount = usingOutsAmount.subtract(totalAmount);
        logger_1.Log.Amount.change(changeAmount);
        if (isRingCT) {
            // for RCT we don't presently care about dustiness so add entire change amount
            logger_1.Log.Amount.toSelf(changeAmount, senderAddress);
            fundTargets.push({
                address: senderAddress,
                amount: changeAmount,
            });
        }
        else {
            // pre-ringct
            // do not give ourselves change < dust threshold
            var _a = changeAmount.divRem(xmr_constants_1.config.dustThreshold), quotient = _a[0], remainder = _a[1];
            logger_1.Log.Amount.changeAmountDivRem([quotient, remainder]);
            if (!remainder.isZero()) {
                // miners will add dusty change to fee
                logger_1.Log.Fee.belowDustThreshold(remainder);
            }
            if (!quotient.isZero()) {
                // send non-dusty change to our address
                var usableChange = quotient.multiply(xmr_constants_1.config.dustThreshold);
                logger_1.Log.Amount.toSelf(usableChange, senderAddress);
                fundTargets.push({
                    address: senderAddress,
                    amount: usableChange,
                });
            }
        }
    }
    else if (outsEqualToTotal) {
        // if outputs are equivalent to the total amount
        // this should always fire when sweeping
        // since we want to spend all outputs anyway
        if (isRingCT) {
            // then create random destination to keep 2 outputs always in case of 0 change
            // so we dont create 1 output (outlier)
            var fakeAddress = xmr_crypto_utils_1.create_address(xmr_crypto_utils_1.random_scalar(), nettype)
                .public_addr;
            logger_1.Log.Output.uniformity(fakeAddress);
            fundTargets.push({
                address: fakeAddress,
                amount: biginteger_1.BigInt.ZERO,
            });
        }
    }
    return { fundTargets: fundTargets };
}
exports.validateAndConstructFundTargets = validateAndConstructFundTargets;
// #endregion validateAndConstructFundTargets
//#region constructTx
function constructTx(params) {
    return __awaiter(this, void 0, void 0, function () {
        var signedTx, _a, serializedSignedTx, txHash, numOfKB;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, makeSignedTx(params)];
                case 1:
                    signedTx = (_b.sent()).signedTx;
                    xmr_str_utils_1.JSONPrettyPrint("constructTx", { signedTx: signedTx }, "signedTx");
                    _a = getSerializedTxAndHash(signedTx), serializedSignedTx = _a.serializedSignedTx, txHash = _a.txHash;
                    xmr_str_utils_1.JSONPrettyPrint("constructTx", { serializedSignedTx: serializedSignedTx, txHash: txHash }, "serializedTxAndHash");
                    numOfKB = getTxSize(serializedSignedTx, params.networkFee).numOfKB;
                    xmr_str_utils_1.JSONPrettyPrint("constructTx", { numOfKB: numOfKB }, "numOfKb");
                    return [2 /*return*/, { numOfKB: numOfKB, txHash: txHash, serializedSignedTx: serializedSignedTx }];
            }
        });
    });
}
exports.constructTx = constructTx;
function makeSignedTx(params) {
    return __awaiter(this, void 0, void 0, function () {
        var senderPublicKeys, senderPrivateKeys, targetAddress, fundTargets, pid, encryptPid, mixOuts, mixin, usingOuts, networkFee, isRingCT, nettype, hwdev, targetViewKey, splitDestinations, signedTx, _a, _b, _c, _d, _e, e_1;
        return __generator(this, function (_f) {
            switch (_f.label) {
                case 0:
                    _f.trys.push([0, 5, , 6]);
                    senderPublicKeys = params.senderPublicKeys, senderPrivateKeys = params.senderPrivateKeys, targetAddress = params.targetAddress, fundTargets = params.fundTargets, pid = params.pid, encryptPid = params.encryptPid, mixOuts = params.mixOuts, mixin = params.mixin, usingOuts = params.usingOuts, networkFee = params.networkFee, isRingCT = params.isRingCT, nettype = params.nettype, hwdev = params.hwdev;
                    logger_1.Log.Target.fullDisplay(fundTargets);
                    targetViewKey = key_utils_1.getTargetPubViewKey(encryptPid, targetAddress, nettype);
                    splitDestinations = xmr_money_1.decompose_tx_destinations(fundTargets, isRingCT);
                    logger_1.Log.Target.displayDecomposed(splitDestinations);
                    _a = xmr_transaction_1.create_transaction;
                    _b = [senderPublicKeys];
                    _c = [{}, senderPrivateKeys];
                    _d = {};
                    if (!xmr_crypto_utils_2.isRealDevice(hwdev)) return [3 /*break*/, 2];
                    return [4 /*yield*/, hwdev.get_secret_keys()];
                case 1:
                    _e = (_f.sent()).viewKey;
                    return [3 /*break*/, 3];
                case 2:
                    _e = senderPrivateKeys.view;
                    _f.label = 3;
                case 3: return [4 /*yield*/, _a.apply(void 0, _b.concat([__assign.apply(void 0, _c.concat([(_d.view = _e, _d)])), splitDestinations,
                        usingOuts,
                        mixOuts,
                        mixin,
                        networkFee,
                        pid,
                        encryptPid,
                        targetViewKey,
                        0,
                        isRingCT,
                        nettype,
                        hwdev]))];
                case 4:
                    signedTx = _f.sent();
                    logger_1.Log.Transaction.signed(signedTx);
                    return [2 /*return*/, { signedTx: signedTx }];
                case 5:
                    e_1 = _f.sent();
                    throw errors_1.ERR.TX.failure(e_1);
                case 6: return [2 /*return*/];
            }
        });
    });
}
function getSerializedTxAndHash(signedTx) {
    // pre rct
    if (signedTx.version === 1) {
        var serializedSignedTx = xmr_transaction_1.serialize_non_rct_tx(signedTx);
        var txHash = xmr_fast_hash_1.cn_fast_hash(serializedSignedTx);
        var ret = {
            serializedSignedTx: serializedSignedTx,
            txHash: txHash,
        };
        logger_1.Log.Transaction.serializedAndHash(serializedSignedTx, txHash);
        return ret;
    }
    // rct
    else {
        var _a = xmr_transaction_1.serialize_rct_tx_with_hash(signedTx), raw = _a.raw, hash = _a.hash;
        var ret = {
            serializedSignedTx: raw,
            txHash: hash,
        };
        logger_1.Log.Transaction.serializedAndHash(raw, hash);
        return ret;
    }
}
function getTxSize(serializedSignedTx, estMinNetworkFee) {
    // work out per-kb fee for transaction and verify that it's enough
    var txBlobBytes = serializedSignedTx.length / 2;
    var numOfKB = Math.floor(txBlobBytes / 1024);
    if (txBlobBytes % 1024) {
        numOfKB++;
    }
    logger_1.Log.Fee.txKB(txBlobBytes, numOfKB, estMinNetworkFee);
    return { numOfKB: numOfKB };
}
// #endregion constructTx
//# sourceMappingURL=tx_utils.js.map
