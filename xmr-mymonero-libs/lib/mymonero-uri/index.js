"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmr_constants_1 = require("xmr-core/xmr-constants");
var open_alias_lite_1 = require("../mymonero-send-tx/internal_libs/open_alias_lite");
var xmr_crypto_utils_1 = require("xmr-core/xmr-crypto-utils");
var URITypes;
(function (URITypes) {
    URITypes[URITypes["addressAsFirstPathComponent"] = 1] = "addressAsFirstPathComponent";
    URITypes[URITypes["addressAsAuthority"] = 2] = "addressAsAuthority";
})(URITypes = exports.URITypes || (exports.URITypes = {}));
function encodeFundRequest(args) {
    var address = args.address;
    if (!address) {
        throw Error("missing address");
    }
    var mutable_uri = xmr_constants_1.config.coinUriPrefix;
    var uriType = args.uriType;
    if (uriType === URITypes.addressAsAuthority) {
        mutable_uri += "//"; // use for inserting a // so data detectors pick it up…
    }
    else if (uriType === URITypes.addressAsFirstPathComponent) {
        // nothing to do
    }
    else {
        throw Error("Illegal args.uriType");
    }
    mutable_uri += address;
    var queryParamStart = true;
    function addParam(name, value) {
        if (!value) {
            return;
        }
        if (queryParamStart) {
            queryParamStart = false;
        }
        mutable_uri += queryParamStart ? "?" : "&";
        mutable_uri += name + "=" + encodeURIComponent(value);
    }
    addParam("tx_amount", args.amount);
    var shouldAddCcySym = (args.amountCcySymbol || "").toLowerCase() !==
        xmr_constants_1.config.coinSymbol.toLowerCase();
    if (shouldAddCcySym) {
        addParam("tx_amount_ccy", args.amountCcySymbol);
    }
    addParam("tx_description", args.description);
    addParam("tx_payment_id", args.payment_id);
    addParam("tx_message", args.message);
    return mutable_uri;
}
exports.encodeFundRequest = encodeFundRequest;
function decodeFundRequest(str, nettype) {
    // detect no-scheme moneroAddr and possible OA addr - if has no monero: prefix
    if (!str.startsWith(xmr_constants_1.config.coinUriPrefix)) {
        if (str.includes("?")) {
            // fairly sure this is correct.. (just an extra failsafe/filter)
            throw Error("Unrecognized URI format");
        }
        if (open_alias_lite_1.possibleOAAddress(str)) {
            return {
                address: str,
            };
        }
        try {
            xmr_crypto_utils_1.decode_address(str, nettype);
        }
        catch (e) {
            throw Error("No Monero request info");
        }
        // then it looks like a monero address
        return {
            address: str,
        };
    }
    var url = new window.URL(str);
    var protocol = url.protocol;
    if (protocol !== xmr_constants_1.config.coinUriPrefix) {
        throw Error("Request URI has non-Monero protocol");
    }
    // it seems that if the URL has // in it, pathname will be empty, but host will contain the address instead
    var target_address = url.pathname || url.host || url.hostname;
    if (target_address.startsWith("//")) {
        target_address = target_address.slice("//".length); // strip prefixing "//" in case URL had protocol:// instead of protocol:
    }
    var searchParams = url.searchParams;
    var payload = {
        address: target_address,
    };
    var keyPrefixToTrim = "tx_";
    searchParams.forEach(function (value, key) {
        var index = key.startsWith(keyPrefixToTrim)
            ? key.slice(keyPrefixToTrim.length, key.length)
            : key;
        payload[index] = value;
    });
    return payload;
}
exports.decodeFundRequest = decodeFundRequest;
//# sourceMappingURL=index.js.map
