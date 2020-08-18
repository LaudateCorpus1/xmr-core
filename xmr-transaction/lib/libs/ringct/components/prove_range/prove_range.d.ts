import { BigInt } from "@xmr-core/biginteger";
import { RangeSignature } from "./types";
export declare function proveRange(amount: string | BigInt): {
    C: string;
    mask: string;
    sig: RangeSignature;
};
export declare function verRange(C: string, as: RangeSignature): boolean;
//# sourceMappingURL=prove_range.d.ts.map