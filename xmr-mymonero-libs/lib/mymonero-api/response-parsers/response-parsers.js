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
var biginteger_1 = require("xmr-core/biginteger");
var memoized_keyimage_generation_1 = require("./memoized-keyimage-generation");
var utils_1 = require("./utils");
var xmr_str_utils_1 = require("xmr-core/xmr-str-utils");
function parseAddressInfo(address, data, privViewKey, pubSpendKey, privSpendKey, hwdev, keyImageCache) {
    if (keyImageCache === void 0) { keyImageCache = memoized_keyimage_generation_1.getKeyImageCache(address); }
    return __awaiter(this, void 0, void 0, function () {
        var normalizedData, total_sent, total_received, locked_balance, account_scan_start_height, account_scanned_tx_height, account_scanned_block_height, transaction_height, blockchain_height, ratesBySymbol, spent_outputs, _i, spent_outputs_1, spent_output, key_image;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    normalizedData = utils_1.normalizeAddressInfo(data);
                    total_sent = normalizedData.total_sent;
                    total_received = normalizedData.total_received, locked_balance = normalizedData.locked_funds, account_scan_start_height = normalizedData.start_height, account_scanned_tx_height = normalizedData.scanned_block_height, account_scanned_block_height = normalizedData.scanned_height, transaction_height = normalizedData.transaction_height, blockchain_height = normalizedData.blockchain_height, ratesBySymbol = normalizedData.rates, spent_outputs = normalizedData.spent_outputs;
                    _i = 0, spent_outputs_1 = spent_outputs;
                    _a.label = 1;
                case 1:
                    if (!(_i < spent_outputs_1.length)) return [3 /*break*/, 4];
                    spent_output = spent_outputs_1[_i];
                    return [4 /*yield*/, memoized_keyimage_generation_1.genKeyImageFromTx(keyImageCache, spent_output.tx_pub_key, spent_output.out_index, address, privViewKey, pubSpendKey, privSpendKey, hwdev)];
                case 2:
                    key_image = _a.sent();
                    if (!utils_1.isKeyImageEqual(spent_output, key_image)) {
                        total_sent = new biginteger_1.BigInt(total_sent)
                            .subtract(spent_output.amount)
                            .toString();
                    }
                    _a.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, {
                        total_received: new biginteger_1.BigInt(total_received),
                        locked_balance: new biginteger_1.BigInt(locked_balance),
                        total_sent: new biginteger_1.BigInt(total_sent),
                        spent_outputs: spent_outputs,
                        account_scanned_tx_height: account_scanned_tx_height,
                        account_scanned_block_height: account_scanned_block_height,
                        account_scan_start_height: account_scan_start_height,
                        transaction_height: transaction_height,
                        blockchain_height: blockchain_height,
                        ratesBySymbol: ratesBySymbol,
                    }];
            }
        });
    });
}
exports.parseAddressInfo = parseAddressInfo;
function parseAddressTransactions(address, data, privViewKey, pubSpendKey, privSpendKey, hwdev, keyImgCache) {
    if (keyImgCache === void 0) { keyImgCache = memoized_keyimage_generation_1.getKeyImageCache(address); }
    return __awaiter(this, void 0, void 0, function () {
        var _a, blockchain_height, account_scanned_block_height, account_scanned_height, account_scan_start_height, 
        /*total_received*/
        transaction_height, transactions, normalizedTransactions, i, transaction, j, keyImage;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = utils_1.normalizeAddressTransactions(data), blockchain_height = _a.blockchain_height, account_scanned_block_height = _a.scanned_block_height, account_scanned_height = _a.scanned_height, account_scan_start_height = _a.start_height, transaction_height = _a.transaction_height, transactions = _a.transactions;
                    normalizedTransactions = [];
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < transactions.length)) return [3 /*break*/, 7];
                    transaction = utils_1.normalizeTransaction(transactions[i]);
                    j = 0;
                    _b.label = 2;
                case 2:
                    if (!(j < transaction.spent_outputs.length)) return [3 /*break*/, 5];
                    return [4 /*yield*/, memoized_keyimage_generation_1.genKeyImageFromTx(keyImgCache, transaction.spent_outputs[j].tx_pub_key, transaction.spent_outputs[j].out_index, address, privViewKey, pubSpendKey, privSpendKey, hwdev)];
                case 3:
                    keyImage = _b.sent();
                    if (!utils_1.isKeyImageEqual(transaction.spent_outputs[j], keyImage)) {
                        transaction.total_sent = new biginteger_1.BigInt(transaction.total_sent).subtract(transaction.spent_outputs[j].amount);
                        transaction.spent_outputs.splice(j, 1);
                        j--;
                    }
                    _b.label = 4;
                case 4:
                    j++;
                    return [3 /*break*/, 2];
                case 5:
                    if (utils_1.zeroTransactionAmount(transaction)) {
                        transactions.splice(i, 1);
                        i--;
                        return [3 /*break*/, 6];
                    }
                    transaction.amount = utils_1.calculateTransactionAmount(transaction);
                    transaction.approx_float_amount = utils_1.estimateTransactionAmount(transaction);
                    utils_1.removeEncryptedPaymentIDs(transaction);
                    normalizedTransactions.push(transaction);
                    _b.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7:
                    utils_1.sortTransactions(normalizedTransactions);
                    // on the other side, we convert transactions timestamp to Date obj
                    return [2 /*return*/, {
                            account_scanned_height: account_scanned_height,
                            account_scanned_block_height: account_scanned_block_height,
                            account_scan_start_height: account_scan_start_height,
                            transaction_height: transaction_height,
                            blockchain_height: blockchain_height,
                            transactions: normalizedTransactions,
                        }];
            }
        });
    });
}
exports.parseAddressTransactions = parseAddressTransactions;
/**
 * @description Go through each (possibly) unspent out and remove ones that have been spent before
 * by computing a key image per unspent output and checking if they match any spend_key_images
 * @param {string} address
 * @param {KeyImageCache} [keyImageCache=getKeyImageCache(address)]
 * @param {UnspentOuts} data
 * @param {string} privViewKey
 * @param {string} pubSpendKey
 * @param {string} privSpendKey
 */
function parseUnspentOutputs(address, data, privViewKey, pubSpendKey, privSpendKey, hwdev, keyImageCache) {
    if (keyImageCache === void 0) { keyImageCache = memoized_keyimage_generation_1.getKeyImageCache(address); }
    return __awaiter(this, void 0, void 0, function () {
        var outputs, per_kb_fee, nonNullOutputs, unspentOutputs;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    xmr_str_utils_1.JSONPrettyPrint("parseUnspentOutputs", {
                        address: address,
                        data: data,
                        privViewKey: privViewKey,
                        pubSpendKey: pubSpendKey,
                        privSpendKey: privSpendKey,
                        keyImageCache: keyImageCache,
                    }, "args");
                    outputs = data.outputs, per_kb_fee = data.per_kb_fee;
                    nonNullOutputs = outputs || [];
                    if (!per_kb_fee) {
                        throw Error("Unexpected / missing per_kb_fee");
                    }
                    return [4 /*yield*/, nonNullOutputs.reduce(function (unspent, currOutput, i) { return __awaiter(_this, void 0, void 0, function () {
                            var resolvedUnspent, spend_key_images, tx_pub_key, index, computedKeyImage, _i, spend_key_images_1, spend_key_image;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, unspent];
                                    case 1:
                                        resolvedUnspent = _a.sent();
                                        utils_1.validateUnspentOutput(currOutput, i);
                                        utils_1.validTxPubKey(currOutput);
                                        spend_key_images = currOutput.spend_key_images, tx_pub_key = currOutput.tx_pub_key, index = currOutput.index;
                                        utils_1.validateSpendKeyImages(spend_key_images, i);
                                        return [4 /*yield*/, memoized_keyimage_generation_1.genKeyImageFromTx(keyImageCache, tx_pub_key, index, address, privViewKey, pubSpendKey, privSpendKey, hwdev)];
                                    case 2:
                                        computedKeyImage = _a.sent();
                                        for (_i = 0, spend_key_images_1 = spend_key_images; _i < spend_key_images_1.length; _i++) {
                                            spend_key_image = spend_key_images_1[_i];
                                            if (spend_key_image === computedKeyImage) {
                                                return [2 /*return*/, resolvedUnspent];
                                            }
                                            else {
                                                console.log("\uD83D\uDCAC  Output used as mixin (" + computedKeyImage + " / " + spend_key_image + ")");
                                            }
                                        }
                                        return [2 /*return*/, resolvedUnspent.concat([currOutput])];
                                }
                            });
                        }); }, Promise.resolve([]))];
                case 1:
                    unspentOutputs = _a.sent();
                    console.log("Unspent outs: " + JSON.stringify(unspentOutputs));
                    xmr_str_utils_1.JSONPrettyPrint("parseUnspentOutputs", {
                        unspentOutputs: unspentOutputs,
                        unusedOuts: unspentOutputs.slice(),
                        per_kb_fee: new biginteger_1.BigInt(per_kb_fee),
                    }, "ret");
                    return [2 /*return*/, {
                            unspentOutputs: unspentOutputs,
                            unusedOuts: unspentOutputs.slice(),
                            per_kb_fee: new biginteger_1.BigInt(per_kb_fee),
                        }];
            }
        });
    });
}
exports.parseUnspentOutputs = parseUnspentOutputs;
//# sourceMappingURL=response-parsers.js.map
