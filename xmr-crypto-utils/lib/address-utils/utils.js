"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_varint_1 = require("xmr-core/xmr-varint");
const xmr_fast_hash_1 = require("xmr-core/xmr-fast-hash");
const xmr_b58_1 = require("xmr-core/xmr-b58");
const xmr_constants_1 = require("xmr-core/xmr-constants");
const types_1 = require("./types");
const primitive_ops_1 = require("../crypto-ops/primitive_ops");
const key_utils_1 = require("../key-utils");
function is_subaddress(addr, nettype) {
    const decoded = xmr_b58_1.cnBase58.decode(addr);
    const subaddressPrefix = xmr_varint_1.encode_varint(cryptonoteBase58PrefixForSubAddressOn(nettype));
    const prefix = decoded.slice(0, subaddressPrefix.length);
    return prefix === subaddressPrefix;
}
exports.is_subaddress = is_subaddress;
function create_address(seed, nettype) {
    // updated by Luigi and PS to support reduced and non-reduced seeds
    let first;
    if (seed.length !== 64) {
        first = xmr_fast_hash_1.cn_fast_hash(seed);
    }
    else {
        first = primitive_ops_1.sc_reduce32(seed);
    }
    const spend = key_utils_1.generate_keys(first);
    const second = xmr_fast_hash_1.cn_fast_hash(first);
    const view = key_utils_1.generate_keys(second);
    const public_addr = key_utils_1.pubkeys_to_string(spend.pub, view.pub, nettype);
    return { spend, view, public_addr };
}
exports.create_address = create_address;
function decode_address(address, nettype) {
    let dec = xmr_b58_1.cnBase58.decode(address);
    const expectedPrefix = xmr_varint_1.encode_varint(cryptonoteBase58PrefixForStandardAddressOn(nettype));
    const expectedPrefixInt = xmr_varint_1.encode_varint(cryptonoteBase58PrefixForIntegratedAddressOn(nettype));
    const expectedPrefixSub = xmr_varint_1.encode_varint(cryptonoteBase58PrefixForSubAddressOn(nettype));
    const prefix = dec.slice(0, expectedPrefix.length);
    if (prefix !== expectedPrefix &&
        prefix !== expectedPrefixInt &&
        prefix !== expectedPrefixSub) {
        throw Error("Invalid address prefix");
    }
    dec = dec.slice(expectedPrefix.length);
    const spend = dec.slice(0, 64);
    const view = dec.slice(64, 128);
    let checksum;
    let expectedChecksum;
    let intPaymentId;
    if (prefix === expectedPrefixInt) {
        intPaymentId = dec.slice(128, 128 + xmr_constants_1.INTEGRATED_ID_SIZE * 2);
        checksum = dec.slice(128 + xmr_constants_1.INTEGRATED_ID_SIZE * 2, 128 + xmr_constants_1.INTEGRATED_ID_SIZE * 2 + xmr_constants_1.ADDRESS_CHECKSUM_SIZE * 2);
        expectedChecksum = xmr_fast_hash_1.cn_fast_hash(prefix + spend + view + intPaymentId).slice(0, xmr_constants_1.ADDRESS_CHECKSUM_SIZE * 2);
    }
    else {
        checksum = dec.slice(128, 128 + xmr_constants_1.ADDRESS_CHECKSUM_SIZE * 2);
        expectedChecksum = xmr_fast_hash_1.cn_fast_hash(prefix + spend + view).slice(0, xmr_constants_1.ADDRESS_CHECKSUM_SIZE * 2);
    }
    if (checksum !== expectedChecksum) {
        throw Error("Invalid checksum");
    }
    if (intPaymentId) {
        return {
            spend: spend,
            view: view,
            intPaymentId: intPaymentId,
        };
    }
    else {
        return {
            spend: spend,
            view: view,
        };
    }
}
exports.decode_address = decode_address;
function makeIntegratedAddressFromAddressAndShortPid(address, short_pid, nettype) {
    // throws
    let decoded_address = decode_address(address, // TODO/FIXME: not super happy about having to decode just to re-encode… this was a quick hack
    nettype); // throws
    if (!short_pid || short_pid.length != 16) {
        throw Error("expected valid short_pid");
    }
    const prefix = xmr_varint_1.encode_varint(cryptonoteBase58PrefixForIntegratedAddressOn(nettype));
    const data = prefix + decoded_address.spend + decoded_address.view + short_pid;
    const checksum = xmr_fast_hash_1.cn_fast_hash(data);
    const encodable__data = data + checksum.slice(0, xmr_constants_1.ADDRESS_CHECKSUM_SIZE * 2);
    //
    return xmr_b58_1.cnBase58.encode(encodable__data);
}
exports.makeIntegratedAddressFromAddressAndShortPid = makeIntegratedAddressFromAddressAndShortPid;
const __MAINNET_CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = 18;
const __MAINNET_CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = 19;
const __MAINNET_CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX = 42;
const __TESTNET_CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = 53;
const __TESTNET_CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = 54;
const __TESTNET_CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX = 63;
const __STAGENET_CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX = 24;
const __STAGENET_CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX = 25;
const __STAGENET_CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX = 36;
function cryptonoteBase58PrefixForStandardAddressOn(nettype) {
    if (nettype === types_1.NetType.MAINNET) {
        return __MAINNET_CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX;
    }
    else if (nettype === types_1.NetType.TESTNET) {
        return __TESTNET_CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX;
    }
    else if (nettype === types_1.NetType.STAGENET) {
        return __STAGENET_CRYPTONOTE_PUBLIC_ADDRESS_BASE58_PREFIX;
    }
    throw Error("Illegal nettype");
}
exports.cryptonoteBase58PrefixForStandardAddressOn = cryptonoteBase58PrefixForStandardAddressOn;
function cryptonoteBase58PrefixForIntegratedAddressOn(nettype) {
    if (nettype === types_1.NetType.MAINNET) {
        return __MAINNET_CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX;
    }
    else if (nettype === types_1.NetType.TESTNET) {
        return __TESTNET_CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX;
    }
    else if (nettype === types_1.NetType.STAGENET) {
        return __STAGENET_CRYPTONOTE_PUBLIC_INTEGRATED_ADDRESS_BASE58_PREFIX;
    }
    throw Error("Illegal nettype");
}
exports.cryptonoteBase58PrefixForIntegratedAddressOn = cryptonoteBase58PrefixForIntegratedAddressOn;
function cryptonoteBase58PrefixForSubAddressOn(nettype) {
    if (nettype === types_1.NetType.MAINNET) {
        return __MAINNET_CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX;
    }
    else if (nettype === types_1.NetType.TESTNET) {
        return __TESTNET_CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX;
    }
    else if (nettype === types_1.NetType.STAGENET) {
        return __STAGENET_CRYPTONOTE_PUBLIC_SUBADDRESS_BASE58_PREFIX;
    }
    throw Error("Illegal nettype");
}
exports.cryptonoteBase58PrefixForSubAddressOn = cryptonoteBase58PrefixForSubAddressOn;
//# sourceMappingURL=utils.js.map
