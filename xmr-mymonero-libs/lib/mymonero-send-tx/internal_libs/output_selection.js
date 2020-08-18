"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var arr_utils_1 = require("./arr_utils");
var logger_1 = require("./logger");
var biginteger_1 = require("xmr-core/biginteger");
var xmr_constants_1 = require("xmr-core/xmr-constants");
var xmr_str_utils_1 = require("xmr-core/xmr-str-utils");
function selectOutputsAndAmountForMixin(targetAmount, unusedOuts, isRingCT, sweeping) {
    xmr_str_utils_1.JSONPrettyPrint("selectOutputsAndAmountForMixin", {
        targetAmount: targetAmount,
        unusedOuts: unusedOuts,
        isRingCT: isRingCT,
        sweeping: sweeping,
    }, "args");
    logger_1.Log.SelectOutsAndAmtForMix.target(targetAmount);
    var usingOutsAmount = new biginteger_1.BigInt(0);
    var usingOuts = [];
    var remainingUnusedOuts = unusedOuts.slice(); // take copy so as to prevent issue if we must re-enter tx building fn if fee too low after building
    while (usingOutsAmount.compare(targetAmount) < 0 &&
        remainingUnusedOuts.length > 0) {
        var out = arr_utils_1.popRandElement(remainingUnusedOuts);
        if (!isRingCT && out.rct) {
            // out.rct is set by the server
            continue; // skip rct outputs if not creating rct tx
        }
        var outAmount = new biginteger_1.BigInt(out.amount);
        if (outAmount.compare(xmr_constants_1.config.dustThreshold) < 0) {
            // amount is dusty..
            if (!sweeping) {
                logger_1.Log.SelectOutsAndAmtForMix.Dusty.notSweeping();
                continue;
            }
            if (!out.rct) {
                logger_1.Log.SelectOutsAndAmtForMix.Dusty.rct();
                continue;
            }
            else {
                logger_1.Log.SelectOutsAndAmtForMix.Dusty.nonRct();
            }
        }
        usingOuts.push(out);
        usingOutsAmount = usingOutsAmount.add(outAmount);
        logger_1.Log.SelectOutsAndAmtForMix.usingOut(outAmount, out);
    }
    xmr_str_utils_1.JSONPrettyPrint("selectOutputsAndAmountForMixin", {
        usingOuts: usingOuts,
        usingOutsAmount: usingOutsAmount,
        remainingUnusedOuts: remainingUnusedOuts,
    }, "ret");
    return {
        usingOuts: usingOuts,
        usingOutsAmount: usingOutsAmount,
        remainingUnusedOuts: remainingUnusedOuts,
    };
}
exports.selectOutputsAndAmountForMixin = selectOutputsAndAmountForMixin;
//# sourceMappingURL=output_selection.js.map
