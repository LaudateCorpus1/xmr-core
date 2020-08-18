import { RCTSignatures } from "./types";
import { SignedTransaction } from "../../types";
export declare function serialize_rct_tx_with_hash(tx: SignedTransaction): {
    raw: string;
    hash: string;
};
export declare function serialize_rct_base(rv: RCTSignatures): string;
//# sourceMappingURL=serialization.d.ts.map