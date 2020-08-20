import { BigInt } from "../../biginteger";
import { NetType, Keys } from "../../xmr-crypto-utils";
import { HWDevice } from "../../xmr-crypto-utils";
import { ViewSendKeys, ParsedTarget, Output, AmountOutput, Pid, SignedTransaction } from "./types";
interface SourceOutput {
    index: string;
    key: string;
    commit?: string;
}
interface Source {
    amount: string;
    outputs: SourceOutput[];
    real_output_pub_tx_key: string;
    real_output_index: number;
    real_output_in_tx_index: number;
    mask?: string | null;
}
export declare function create_transaction(pub_keys: ViewSendKeys, sec_keys: ViewSendKeys, dsts: ParsedTarget[], outputs: Output[], mix_outs: AmountOutput[] | undefined, fake_outputs_count: number, fee_amount: BigInt, payment_id: Pid, pid_encrypt: boolean, destViewKeyPub: string | undefined, unlock_time: number, rct: boolean, nettype: NetType, hwdev: HWDevice): Promise<SignedTransaction>;
export declare function construct_tx(keys: Keys, sources: Source[], dsts: ParsedTarget[], fee_amount: BigInt, payment_id: string | null, pid_encrypt: boolean, destViewKeyPub: string | undefined, unlock_time: number, rct: boolean, nettype: NetType, hwdev: HWDevice): Promise<SignedTransaction>;
export {};
//# sourceMappingURL=create-tx.d.ts.map
