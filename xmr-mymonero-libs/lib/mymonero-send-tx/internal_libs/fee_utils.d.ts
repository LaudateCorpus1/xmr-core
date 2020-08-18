import { BigInt } from "xmr-core/biginteger";
export declare const DEFAULT_FEE_PRIORITY = 1;
export declare function calculateFee(feePerKB: BigInt, numOfBytes: number, feeMultiplier: number): import("xmr-core/biginteger/vendor/biginteger").BigInteger;
export declare function calculateFeeKb(feePerKB: BigInt, numOfBytes: BigInt | number, feeMultiplier: number): import("xmr-core/biginteger/vendor/biginteger").BigInteger;
export declare function multiplyFeePriority(prio: number): number;
//# sourceMappingURL=fee_utils.d.ts.map
