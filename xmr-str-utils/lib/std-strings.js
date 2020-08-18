"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const biginteger_1 = require("@xmr-core/biginteger");
function trimRight(str, char) {
    while (str[str.length - 1] == char)
        str = str.slice(0, -1);
    return str;
}
exports.trimRight = trimRight;
function padLeft(str, len, char) {
    while (str.length < len) {
        str = char + str;
    }
    return str;
}
exports.padLeft = padLeft;
function pretty(_key, value) {
    if (value instanceof biginteger_1.BigInt) {
        return `BN:${value.toString()}`;
    }
    if (Array.isArray(value)) {
        return value.map(o => (o instanceof biginteger_1.BigInt ? `BN:${o.toString()}` : o));
    }
    return value;
}
exports.pretty = pretty;
function JSONPretty(obj) {
    return JSON.stringify(obj, pretty, 1);
}
exports.JSONPretty = JSONPretty;
function JSONPrettyPrint(name, obj, extra) {
    if (process.env.NODE_ENV === "test" && process.env.DEBUG) {
        console.log(`[${name}] ${extra || ""}
		${JSON.stringify(obj, pretty, 1)}`);
    }
}
exports.JSONPrettyPrint = JSONPrettyPrint;
//# sourceMappingURL=std-strings.js.map