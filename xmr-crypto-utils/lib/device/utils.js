"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const device_ledger_1 = require("./device-ledger");
const types_1 = require("../address-utils/types");
const key_utils_1 = require("../key-utils");
/**
 * @description Returns true if the device is a real device (only ledger for now)
 *
 * @export
 * @param {HWDevice} hwdev
 * @returns {hwdev is LedgerDevice}
 */
function isRealDevice(hwdev) {
    return hwdev instanceof device_ledger_1.LedgerDevice;
}
exports.isRealDevice = isRealDevice;
function getAddressString(hwdev, nettype = types_1.NetType.MAINNET) {
    return __awaiter(this, void 0, void 0, function* () {
        const { spend_public_key, view_public_key, } = yield hwdev.get_public_address();
        const address = key_utils_1.pubkeys_to_string(spend_public_key, view_public_key, nettype);
        return address;
    });
}
exports.getAddressString = getAddressString;
//# sourceMappingURL=utils.js.map