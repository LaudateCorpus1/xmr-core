import { RingMember, SecretCommitment } from "../../../../types";
import { MGSig } from "./types";
import { CtKeyV, HWDevice } from "../../../../../../xmr-crypto-utils";
export declare function proveRctMG(message: string, pubs: RingMember[], inSk: SecretCommitment, kimg: string, mask: string, Cout: string, index: number, hwdev: HWDevice): Promise<MGSig>;
export declare function verRctMG(mg: MGSig, pubs: RingMember[][], outPk: CtKeyV, txnFeeKey: string, message: string, kimg: string): boolean;
export declare function verRctMGSimple(message: string, mg: MGSig, pubs: RingMember[], C: string, kimg: string): boolean;
//# sourceMappingURL=prove_ringct_mg.d.ts.map
