import { TotalAmtAndEstFeeParams, ConstructTxParams, ConstructFundTargetsParams } from "./types";
import { ParsedTarget } from "@xmr-core/xmr-transaction";
/**
 * @description
 * Recalculates the fee and total amount needed for the transaction to be sent. RCT + non sweeping transactions will have their
 * network fee increased if fee calculation based on the number of outputs needed is higher than the passed-in fee. RCT+ sweeping transactions
 * are just checked if they have enough balance to proceed with the transaction. Non-RCT transactions will have no fee recalculation done on them.

 * @export
 * @param {TotalAmtAndEstFeeParams} params
 * @returns
 */
export declare function totalAmtAndEstFee(params: TotalAmtAndEstFeeParams): {
    newFee: import("@xmr-core/biginteger/vendor/biginteger").BigInteger;
    totalAmount: import("@xmr-core/biginteger/vendor/biginteger").BigInteger;
};
/**
 * @description
 * 1. Validates the total amount needed for the tx against the available amounts via the sum of all outputs
 * to see if the sender has sufficient funds.
 *
 * 2. Then, a list of sending targets will be constructed, always consisting of the target address and amount they want to send to, and possibly a change address,
 * if the sum of outs is greater than the amount sent + fee needed, and possibly a fake address + 0 amount to keep output uniformity if no change address
 * was generated.
 *
 * @export
 * @param {ConstructFundTargetsParams} params
 * @returns
 */
export declare function validateAndConstructFundTargets(params: ConstructFundTargetsParams): {
    fundTargets: ParsedTarget[];
};
export declare function constructTx(params: ConstructTxParams): Promise<{
    numOfKB: number;
    txHash: string;
    serializedSignedTx: string;
}>;
//# sourceMappingURL=tx_utils.d.ts.map