import { BigInt } from "../../biginteger";
import { ParsedTarget } from "./types";
/**
 *
 * @param {string} str
 */
export declare function parseMoney(str: string): BigInt;
export declare function decompose_tx_destinations(dsts: ParsedTarget[], rct: boolean): {
    address: string;
    amount: import("../../biginteger/vendor/biginteger").BigInteger;
}[];
//# sourceMappingURL=parsers.d.ts.map
