"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function serialize_range_proofs(rv) {
    let buf = "";
    for (let i = 0; i < rv.p.rangeSigs.length; i++) {
        for (let j = 0; j < rv.p.rangeSigs[i].bsig.s.length; j++) {
            for (let l = 0; l < rv.p.rangeSigs[i].bsig.s[j].length; l++) {
                buf += rv.p.rangeSigs[i].bsig.s[j][l];
            }
        }
        buf += rv.p.rangeSigs[i].bsig.ee;
        for (let j = 0; j < rv.p.rangeSigs[i].Ci.length; j++) {
            buf += rv.p.rangeSigs[i].Ci[j];
        }
    }
    return buf;
}
exports.serialize_range_proofs = serialize_range_proofs;
//# sourceMappingURL=utils.js.map