import { BigInt } from "../../../../biginteger";
import { Output } from "../../../../xmr-transaction";
export declare function selectOutputsAndAmountForMixin(targetAmount: BigInt, unusedOuts: Output[], isRingCT: boolean, sweeping: boolean): {
    usingOuts: Output[];
    usingOutsAmount: import("../../../../biginteger/vendor/biginteger").BigInteger;
    remainingUnusedOuts: Output[];
};
//# sourceMappingURL=output_selection.d.ts.map
