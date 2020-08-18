import { RCTSignatures } from "./types";
import { HWDevice } from "xmr-core/xmr-crypto-utils";
import { RingMember } from "../../types";
export declare function get_pre_mlsag_hash(rv: RCTSignatures, mixRing: RingMember[][], hwdev: HWDevice): Promise<string>;
export declare function estimateRctSize(inputs: number, mixin: number, outputs: number): number;
//# sourceMappingURL=utils.d.ts.map
