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
Object.defineProperty(exports, "__esModule", { value: true });
var biginteger_1 = require("../../../../biginteger");
var xmr_money_1 = require("../../../../xmr-money");
function isKeyImageEqual(_a, keyImage) {
    var key_image = _a.key_image;
    return key_image === keyImage;
}
exports.isKeyImageEqual = isKeyImageEqual;
//#region addressInfo
function normalizeAddressInfo(data) {
    data.spent_outputs = data.spent_outputs || [];
    var defaultObj = {
        total_sent: "0",
        total_received: "0",
        locked_funds: "0",
        start_height: 0,
        scanned_block_height: 0,
        scanned_height: 0,
        transaction_height: 0,
        blockchain_height: 0,
        rates: {},
        spent_outputs: [],
    };
    return __assign({}, defaultObj, data);
}
exports.normalizeAddressInfo = normalizeAddressInfo;
//#endregion addressInfo
//#region parseAddressTransactions
function normalizeAddressTransactions(data) {
    data.transactions = data.transactions || [];
    var defaultObj = {
        scanned_height: 0,
        scanned_block_height: 0,
        start_height: 0,
        transaction_height: 0,
        blockchain_height: 0,
        transactions: [],
        total_received: "0",
    };
    return __assign({}, defaultObj, data);
}
exports.normalizeAddressTransactions = normalizeAddressTransactions;
function normalizeTransaction(tx) {
    tx.spent_outputs = tx.spent_outputs || [];
    var defaultObj = {
        amount: new biginteger_1.BigInt(0),
        approx_float_amount: 0,
        hash: "",
        height: 0,
        id: 0,
        mempool: false,
        coinbase: false,
        mixin: 0,
        spent_outputs: [],
        total_received: "0",
        total_sent: new biginteger_1.BigInt(0),
        unlock_time: 0,
        payment_id: "",
    };
    var mergedObj = __assign({}, defaultObj, tx, { total_sent: tx.total_sent
            ? new biginteger_1.BigInt(tx.total_sent)
            : defaultObj.total_sent, timestamp: new Date(tx.timestamp) });
    return mergedObj;
}
exports.normalizeTransaction = normalizeTransaction;
/**
 *
 * @description Validates that the sum of total received and total sent is greater than 1
 * @param {NormalizedTransaction} { total_received, total_sent}
 */
function zeroTransactionAmount(_a) {
    var total_received = _a.total_received, total_sent = _a.total_sent;
    return new biginteger_1.BigInt(total_received).add(total_sent).compare(0) <= 0;
}
exports.zeroTransactionAmount = zeroTransactionAmount;
function calculateTransactionAmount(_a) {
    var total_received = _a.total_received, total_sent = _a.total_sent;
    return new biginteger_1.BigInt(total_received).subtract(total_sent);
}
exports.calculateTransactionAmount = calculateTransactionAmount;
function estimateTransactionAmount(_a) {
    var amount = _a.amount;
    return parseFloat(xmr_money_1.formatMoney(amount));
}
exports.estimateTransactionAmount = estimateTransactionAmount;
/**
 *
 * @description If the transaction is:
 * 1. An outgoing transaction, e.g. it is sending moneroj to an address rather than receiving it
 * 2. And contains an encrypted (8 byte) payment id
 *
 * Then, it is removed from the transaction object, because the server (MyMonero) can't filter out short (encrypted) pids on outgoing txs
 * @export
 * @param {NormalizedTransaction} tx
 */
function removeEncryptedPaymentIDs(tx) {
    var payment_id = tx.payment_id, approx_float_amount = tx.approx_float_amount;
    var outgoingTxWithEncPid = payment_id && payment_id.length === 16 && approx_float_amount < 0;
    if (outgoingTxWithEncPid) {
        delete tx.payment_id;
    }
}
exports.removeEncryptedPaymentIDs = removeEncryptedPaymentIDs;
/**
 * @description Sort transactions based on the following cases where higher priorities
 * gain a lower index value:
 *
 * 1. Transactions that are in the mempool gain priority
 * 2. Otherwise, sort by id, where the higher ID has higher priority
 *
 * @export
 * @param {AddressTransactionsTx[]} transactions
 * @returns
 */
function sortTransactions(transactions) {
    return transactions.sort(function (a, b) {
        if (a.mempool && !b.mempool) {
            return -1; // a first
        }
        else if (b.mempool) {
            return 1; // b first
        }
        // both mempool - fall back to .id compare
        return b.id - a.id;
    });
}
exports.sortTransactions = sortTransactions;
//#endregion parseAddressTransactions
//#region parseUnspentOuts
function validateUnspentOutput(out, index) {
    if (!out) {
        throw Error("unspent_output at index " + index + " was null");
    }
}
exports.validateUnspentOutput = validateUnspentOutput;
function validateSpendKeyImages(keyImgs, index) {
    if (!keyImgs) {
        throw Error("spend_key_images of unspent_output at index " + index + " was null");
    }
}
exports.validateSpendKeyImages = validateSpendKeyImages;
function validUnspentOutput(out, index) {
    if (out) {
        return true;
    }
    else {
        console.warn("This unspent output at i " + index + " was  undefined! Skipping.");
        return false;
    }
}
exports.validUnspentOutput = validUnspentOutput;
function validTxPubKey(out) {
    if (out.tx_pub_key) {
        return true;
    }
    else {
        console.warn("This unspent out was missing a tx_pub_key! Skipping.", out);
        return false;
    }
}
exports.validTxPubKey = validTxPubKey;
//#endregion parseUnspentOuts
//# sourceMappingURL=utils.js.map
