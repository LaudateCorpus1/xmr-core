import { BigInt } from "xmr-core/biginteger";
import { ParsedTarget, Output, SignedTransaction } from "xmr-core/xmr-transaction";
export declare namespace Log {
    namespace Amount {
        function beforeFee(feelessTotal: BigInt, isSweeping: boolean): void;
        function change(changeAmount: BigInt): void;
        function changeAmountDivRem(amt: [BigInt, BigInt]): void;
        function toSelf(changeAmount: BigInt, selfAddress: string): void;
    }
    namespace Fee {
        function dynPerKB(dynFeePerKB: BigInt): void;
        function basedOnInputs(newNeededFee: BigInt, usingOuts: Output[]): void;
        function belowDustThreshold(changeDivDustRemainder: BigInt): void;
        function estLowerThanReal(estMinNetworkFee: BigInt, feeActuallyNeededByNetwork: BigInt): void;
        function txKB(txBlobBytes: number, numOfKB: number, estMinNetworkFee: BigInt): void;
        function successfulTx(finalNetworkFee: BigInt): void;
    }
    namespace Balance {
        function requiredBase(totalAmount: BigInt, isSweeping: boolean): void;
        function requiredPostRct(totalAmount: BigInt): void;
    }
    namespace Output {
        function uniformity(fakeAddress: string): void;
        function display(out: Output): void;
    }
    namespace Target {
        function display(fundTargets: ParsedTarget[]): void;
        function fullDisplay(fundTargets: ParsedTarget[]): void;
        function displayDecomposed(splitDestinations: ParsedTarget[]): void;
        function viewKey(viewKey: string): void;
    }
    namespace Transaction {
        function signed(signedTx: SignedTransaction): void;
        function serializedAndHash(serializedTx: string, txHash: string): void;
    }
    namespace SelectOutsAndAmtForMix {
        function target(targetAmount: BigInt): void;
        namespace Dusty {
            function notSweeping(): void;
            function nonRct(): void;
            function rct(): void;
        }
        function usingOut(outAmount: BigInt, out: Output): void;
    }
}
//# sourceMappingURL=logger.d.ts.map
