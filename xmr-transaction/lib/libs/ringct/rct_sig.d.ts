import { RCTSignatures } from "./types";
import { SecretCommitment, RingMember } from "../../types";
import { BigInt } from "../../../../biginteger";
import { HWDevice } from "../../../../xmr-crypto-utils";
export declare function genRct(message: string, inSk: SecretCommitment[], kimgs: string[], destinations: string[], inAmounts: (BigInt | string)[], outAmounts: (BigInt | string)[], mixRing: RingMember[][], amountKeys: string[], indices: number[], txnFee: string, hwdev: HWDevice): Promise<RCTSignatures>;
export declare function verRct(rv: RCTSignatures, semantics: boolean, mixRing: RingMember[][], kimg: string): Promise<boolean>;
export declare function verRctSimple(rv: RCTSignatures, semantics: boolean, mixRing: RingMember[][], kimgs: string[]): Promise<boolean>;
export declare function decodeRct(rv: RCTSignatures, sk: string, i: number, hwdev: HWDevice): Promise<{
    amount: string;
    mask: string;
}>;
export declare function decodeRctSimple(rv: RCTSignatures, sk: string, i: number, hwdev: HWDevice): Promise<{
    amount: string;
    mask: string;
}>;
//# sourceMappingURL=rct_sig.d.ts.map
