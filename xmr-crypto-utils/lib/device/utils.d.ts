import { HWDevice } from "./types";
import { LedgerDevice } from "./device-ledger";
import { NetType } from "../address-utils/types";
/**
 * @description Returns true if the device is a real device (only ledger for now)
 *
 * @export
 * @param {HWDevice} hwdev
 * @returns {hwdev is LedgerDevice}
 */
export declare function isRealDevice(hwdev: HWDevice): hwdev is LedgerDevice<any>;
export declare function getAddressString(hwdev: HWDevice, nettype?: NetType): Promise<string>;
//# sourceMappingURL=utils.d.ts.map