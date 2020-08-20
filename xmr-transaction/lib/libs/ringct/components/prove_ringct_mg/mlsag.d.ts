import { MGSig } from "./types";
import { HWDevice } from "../../../../../../xmr-crypto-utils";
export declare function MLSAG_Gen(message: string, pk: string[][], xx: string[], kimg: string, index: number, hwdev: HWDevice): Promise<MGSig>;
export declare function MLSAG_ver(message: string, pk: string[][], rv: MGSig, kimg: string): boolean;
//# sourceMappingURL=mlsag.d.ts.map
