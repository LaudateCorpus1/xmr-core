import { AddressTransactions, AddressTransactionsTx, NormalizedTransaction, SpentOutput, AddressInfo } from "./types";
import { Output } from "xmr-core/xmr-transaction";
export declare function isKeyImageEqual({ key_image }: SpentOutput, keyImage: string): boolean;
export declare function normalizeAddressInfo(data: AddressInfo): Required<AddressInfo>;
export declare function normalizeAddressTransactions(data: AddressTransactions): Required<AddressTransactions>;
export declare function normalizeTransaction(tx: AddressTransactionsTx): NormalizedTransaction;
/**
 *
 * @description Validates that the sum of total received and total sent is greater than 1
 * @param {NormalizedTransaction} { total_received, total_sent}
 */
export declare function zeroTransactionAmount({ total_received, total_sent, }: NormalizedTransaction): boolean;
export declare function calculateTransactionAmount({ total_received, total_sent, }: NormalizedTransaction): import("xmr-core/biginteger/vendor/biginteger").BigInteger;
export declare function estimateTransactionAmount({ amount }: NormalizedTransaction): number;
/**
 *
 * @description If the transaction is:
 * 1. An outgoing transaction, e.g. it is sending moneroj to an address rather than receiving it
 * 2. And contains an encrypted (8 byte) payment id
 *
 * Then, it is removed from the transaction object, because the server (MyMonero) can't filter out short (encrypted) pids on outgoing txs
 * @export
 * @param {NormalizedTransaction} tx
 */
export declare function removeEncryptedPaymentIDs(tx: NormalizedTransaction): void;
/**
 * @description Sort transactions based on the following cases where higher priorities
 * gain a lower index value:
 *
 * 1. Transactions that are in the mempool gain priority
 * 2. Otherwise, sort by id, where the higher ID has higher priority
 *
 * @export
 * @param {AddressTransactionsTx[]} transactions
 * @returns
 */
export declare function sortTransactions(transactions: NormalizedTransaction[]): NormalizedTransaction[];
export declare function validateUnspentOutput(out: Output, index: number): void;
export declare function validateSpendKeyImages(keyImgs: string[], index: number): void;
export declare function validUnspentOutput(out: Output, index: number): boolean;
export declare function validTxPubKey(out: Output): boolean;
//# sourceMappingURL=utils.d.ts.map
