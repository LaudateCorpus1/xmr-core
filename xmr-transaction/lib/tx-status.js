"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const moment_1 = __importDefault(require("moment"));
const xmr_constants_1 = require("xmr-core/xmr-constants");
function isTransactionConfirmed(tx, blockchainHeight) {
    return blockchainHeight - tx.height > xmr_constants_1.config.txMinConfirms;
}
exports.isTransactionConfirmed = isTransactionConfirmed;
function isTransactionUnlocked({ unlock_time }, blockchainHeight) {
    if (!xmr_constants_1.config.maxBlockNumber) {
        throw Error("Max block number is not set in config!");
    }
    if (unlock_time < xmr_constants_1.config.maxBlockNumber) {
        // unlock time is block height
        return blockchainHeight >= unlock_time;
    }
    else {
        // unlock time is timestamp
        const current_time = Math.round(new Date().getTime() / 1000);
        return current_time >= unlock_time;
    }
}
exports.isTransactionUnlocked = isTransactionUnlocked;
function transactionLockedReason({ unlock_time }, blockchainHeight) {
    if (unlock_time < xmr_constants_1.config.maxBlockNumber) {
        // unlock time is block height
        const numBlocks = unlock_time - blockchainHeight;
        if (numBlocks <= 0) {
            return "Transaction is unlocked";
        }
        const unlock_prediction = moment_1.default().add(numBlocks * xmr_constants_1.config.avgBlockTime, "seconds");
        return ("Will be unlocked in " +
            numBlocks +
            " blocks, ~" +
            unlock_prediction.fromNow(true) +
            ", " +
            unlock_prediction.calendar() +
            "");
    }
    else {
        // unlock time is timestamp
        const current_time = Math.round(new Date().getTime() / 1000);
        const time_difference = unlock_time - current_time;
        if (time_difference <= 0) {
            return "Transaction is unlocked";
        }
        const unlock_moment = moment_1.default(unlock_time * 1000);
        return ("Will be unlocked " +
            unlock_moment.fromNow() +
            ", " +
            unlock_moment.calendar());
    }
}
exports.transactionLockedReason = transactionLockedReason;
//# sourceMappingURL=tx-status.js.map
