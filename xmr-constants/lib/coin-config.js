"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biginteger_1 = require("@xmr-core/biginteger");
const coinUnitPlaces = 12;
exports.config = {
    // Number of atomic units in one unit of currency. e.g. 12 => 10^12 = 1000000000000
    coinUnitPlaces,
    coinUnits: new biginteger_1.BigInt(10).pow(coinUnitPlaces),
    // Minimum number of confirmations for a transaction to show as confirmed
    txMinConfirms: 10,
    // Currency symbol
    coinSymbol: "XMR",
    // OpenAlias prefix
    openAliasPrefix: "xmr",
    // Currency name
    coinName: "Monero",
    // Payment URI Prefix
    coinUriPrefix: "monero:",
    // Prefix code for addresses
    addressPrefix: 18,
    integratedAddressPrefix: 19,
    subaddressPrefix: 42,
    // Dust threshold in atomic units
    // 2*10^9 used for choosing outputs/change - we decompose all the way down if the receiver wants now regardless of threshold
    dustThreshold: new biginteger_1.BigInt("2000000000"),
    // Maximum block number, used for tx unlock time
    maxBlockNumber: 500000000,
    // Average block time in seconds, used for unlock time estimation
    avgBlockTime: 60,
};
//# sourceMappingURL=coin-config.js.map