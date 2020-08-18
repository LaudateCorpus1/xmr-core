"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var biginteger_1 = require("@xmr-core/biginteger");
exports.DEFAULT_FEE_PRIORITY = 1;
function calculateFee(feePerKB, numOfBytes, feeMultiplier) {
    var numberOf_kB = new biginteger_1.BigInt((numOfBytes + 1023.0) / 1024.0); // i.e. ceil
    return calculateFeeKb(feePerKB, numberOf_kB, feeMultiplier);
}
exports.calculateFee = calculateFee;
function calculateFeeKb(feePerKB, numOfBytes, feeMultiplier) {
    var numberOf_kB = new biginteger_1.BigInt(numOfBytes);
    var fee = feePerKB.multiply(feeMultiplier).multiply(numberOf_kB);
    return fee;
}
exports.calculateFeeKb = calculateFeeKb;
function multiplyFeePriority(prio) {
    var fee_multiplier = [1, 4, 20, 166];
    var priority = prio || exports.DEFAULT_FEE_PRIORITY;
    if (priority <= 0 || priority > fee_multiplier.length) {
        throw Error("fee_multiplier_for_priority: simple_priority out of bounds");
    }
    var priority_idx = priority - 1;
    return fee_multiplier[priority_idx];
}
exports.multiplyFeePriority = multiplyFeePriority;
//# sourceMappingURL=fee_utils.js.map