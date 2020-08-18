import { KeyImageCache } from "./memoized-keyimage-generation";
import { AddressTransactions, AddressInfo, UnspentOuts, NormalizedTransaction } from "./types";
import { HWDevice } from "xmr-core/xmr-crypto-utils";
import { Output } from "xmr-core/xmr-transaction";
export declare function parseAddressInfo(address: string, data: AddressInfo, privViewKey: string, pubSpendKey: string, privSpendKey: string, hwdev: HWDevice, keyImageCache?: KeyImageCache): Promise<{
    total_received: import("xmr-core/biginteger/vendor/biginteger").BigInteger;
    locked_balance: import("xmr-core/biginteger/vendor/biginteger").BigInteger;
    total_sent: import("xmr-core/biginteger/vendor/biginteger").BigInteger;
    spent_outputs: import("xmr-core/xmr-mymonero-libs/src/mymonero-api/response-parsers/types").SpentOutput[];
    account_scanned_tx_height: number;
    account_scanned_block_height: number;
    account_scan_start_height: number;
    transaction_height: number;
    blockchain_height: number;
    ratesBySymbol: import("xmr-core/xmr-mymonero-libs/src/mymonero-api/response-parsers/types").Rates;
}>;
export declare function parseAddressTransactions(address: string, data: AddressTransactions, privViewKey: string, pubSpendKey: string, privSpendKey: string, hwdev: HWDevice, keyImgCache?: KeyImageCache): Promise<{
    account_scanned_height: number;
    account_scanned_block_height: number;
    account_scan_start_height: number;
    transaction_height: number;
    blockchain_height: number;
    transactions: NormalizedTransaction[];
}>;
/**
 * @description Go through each (possibly) unspent out and remove ones that have been spent before
 * by computing a key image per unspent output and checking if they match any spend_key_images
 * @param {string} address
 * @param {KeyImageCache} [keyImageCache=getKeyImageCache(address)]
 * @param {UnspentOuts} data
 * @param {string} privViewKey
 * @param {string} pubSpendKey
 * @param {string} privSpendKey
 */
export declare function parseUnspentOutputs(address: string, data: UnspentOuts, privViewKey: string, pubSpendKey: string, privSpendKey: string, hwdev: HWDevice, keyImageCache?: KeyImageCache): Promise<{
    unspentOutputs: Output[];
    unusedOuts: Output[];
    per_kb_fee: import("xmr-core/biginteger/vendor/biginteger").BigInteger;
}>;
//# sourceMappingURL=response-parsers.d.ts.map
