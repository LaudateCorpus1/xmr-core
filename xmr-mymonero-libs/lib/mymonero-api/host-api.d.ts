import { HWDevice } from "../../../xmr-crypto-utils";
import { Output } from "../../../xmr-transaction";
export declare class MyMoneroApi {
    static login(address: string, privViewKey: string): Promise<any>;
    static addressInfo(address: string, privViewKey: string, pubSpendKey: string, privSpendKey: string, hwdev: HWDevice): Promise<{
        total_received: import("../../../biginteger/vendor/biginteger").BigInteger;
        locked_balance: import("../../../biginteger/vendor/biginteger").BigInteger;
        total_sent: import("../../../biginteger/vendor/biginteger").BigInteger;
        spent_outputs: import("../../../xmr-mymonero-libs/src/mymonero-api/response-parsers/types").SpentOutput[];
        account_scanned_tx_height: number;
        account_scanned_block_height: number;
        account_scan_start_height: number;
        transaction_height: number;
        blockchain_height: number;
        ratesBySymbol: import("../../../xmr-mymonero-libs/src/mymonero-api/response-parsers/types").Rates;
    }>;
    static addressTransactions(address: string, privViewKey: string, pubSpendKey: string, privSpendKey: string, hwdev: HWDevice): Promise<{
        account_scanned_height: number;
        account_scanned_block_height: number;
        account_scan_start_height: number;
        transaction_height: number;
        blockchain_height: number;
        transactions: import("../../../xmr-mymonero-libs/src/mymonero-api/response-parsers/types").NormalizedTransaction[];
    }>;
    static importRequestInfoAndStatus(address: string, privViewKey: string): Promise<{
        payment_id: any;
        payment_address: any;
        import_fee: import("../../../biginteger/vendor/biginteger").BigInteger;
        feeReceiptStatus: any;
    }>;
    static unspentOutputs(address: string, privViewKey: string, pubSpendKey: string, privSpendKey: string, mixinNumber: number, hwdev: HWDevice): Promise<{
        unspentOutputs: Output[];
        unusedOuts: Output[];
        per_kb_fee: import("../../../biginteger/vendor/biginteger").BigInteger;
    }>;
    static randomOutputs(usingOuts: Output[], mixin: number): Promise<{
        amount_outs: any;
    }>;
    static submitSerializedSignedTransaction(address: string, privViewKey: string, serializedSignedTx: string): Promise<any>;
}
//# sourceMappingURL=host-api.d.ts.map
