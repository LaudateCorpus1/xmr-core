import { selectOutputsAndAmountForMixin } from "../output_selection";
import { CreateTxAndAttemptToSendParams, GetFundTargetsAndFeeParams } from "./types";
/**
 *
 * @description
 * 1. Recalculates the fee and total amount needed for the transaction to be sent. RCT + non sweeping transactions will have their
 * network fee increased if fee calculation based on the number of outputs needed is higher than the passed-in fee. RCT+ sweeping transactions
 * are just checked if they have enough balance to proceed with the transaction. Non-RCT transactions will have no fee recalculation done on them.
 *
 *
 * 2. The resulting return values from step 1 will then be validated so that the sender has sufficient balances to proceed with sending the transaction.
 * Then, a list of sending targets will be constructed, always consisting of the target address and amount they want to send to, and possibly a change address,
 * if the sum of outs is greater than the amount sent + fee needed, and possibly a fake address + 0 amount to keep output uniformity if no change address
 * was generated.
 *
 *
 * 3. Finally, a list of random outputs is fetched from API to be mixed into the transaction (for generation of the ring signature) to provide anonymity for the sender.
 *
 *
 * NOTE: This function may be called more than once (although I believe two times is the maximum) if the recalculated fee is lower than the
 * actual transaction fee needed when the final fee is calculated from the size of the transaction itself. In the case that the previously mentioned
 * condition is true, then this function will be re-called with the updated higher fee based on the transaction size in kb.
 * @export
 * @param {GetFundTargetsAndFeeParams} params
 */
export declare function getRestOfTxData(params: GetFundTargetsAndFeeParams, outputAndAmountSelector: typeof selectOutputsAndAmountForMixin): Promise<{
    mixOuts: any;
    fundTargets: import("@xmr-core/xmr-transaction/lib/types").ParsedTarget[];
    newFee: import("@xmr-core/biginteger/vendor/biginteger").BigInteger;
    usingOuts: import("@xmr-core/xmr-transaction/lib/types").Output[];
}>;
/**
 * @description Creates the transaction blob and attempts to send it.
 *
 *
 * The transaction blob will be not sent if the resulting fee calculated based on the blobs size
 * is higher than the provided fee to the function, instead itll return a failure result, along
 * with the fee based on the transaction blob.
 *
 *
 * Otherwise, the serialized transaction blob will be sent to the API endpoint, along with
 * a success return value with the fee + transaction blobs' hash
 *
 * @export
 * @param {CreateTxAndAttemptToSendParams} params
 */
export declare function createTxAndAttemptToSend(params: CreateTxAndAttemptToSendParams): Promise<{
    success: boolean;
    txFee: import("@xmr-core/biginteger/vendor/biginteger").BigInteger;
    txHash: string;
}>;
//# sourceMappingURL=construct_tx_and_send.d.ts.map