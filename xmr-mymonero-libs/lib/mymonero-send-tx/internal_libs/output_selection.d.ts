import { BigInt } from "@xmr-core/biginteger";
import { Output } from "@xmr-core/xmr-transaction";
export declare function selectOutputsAndAmountForMixin(targetAmount: BigInt, unusedOuts: Output[], isRingCT: boolean, sweeping: boolean): {
    usingOuts: Output[];
    usingOutsAmount: import("@xmr-core/biginteger/vendor/biginteger").BigInteger;
    remainingUnusedOuts: Output[];
};
//# sourceMappingURL=output_selection.d.ts.map