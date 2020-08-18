import { ParsedTarget, RawTarget } from "xmr-core/xmr-transaction";
import { NetType } from "xmr-core/xmr-crypto-utils";
/**
 * @description Map through the provided targets and normalize each address/amount pair
 *
 * Addresses are checked to see if they may belong to an OpenAlias address, and rejected if so.
 * Then they are validated by attempting to decode them.
 *
 * Amounts are attempted to be parsed from string value to BigInt value
 *
 * The validated address / parsed amount pairs are then returned
 *
 * @export
 * @param {RawTarget[]} targetsToParse
 * @param {NetType} nettype
 * @returns {ParsedTarget[]}
 */
export declare function parseTargets(targetsToParse: RawTarget[], nettype: NetType): ParsedTarget[];
//# sourceMappingURL=parse_target.d.ts.map
