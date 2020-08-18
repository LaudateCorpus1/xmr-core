"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xmr_crypto_utils_1 = require("@xmr-core/xmr-crypto-utils");
const mlsag_1 = require("./mlsag");
const xmr_str_utils_1 = require("@xmr-core/xmr-str-utils");
const { ge_sub, ge_add, sc_sub } = xmr_crypto_utils_1.primitive_ops;
const { identity } = xmr_crypto_utils_1.constants;
//Ring-ct MG sigs
//Prove:
//   c.f. http://eprint.iacr.org/2015/1098 section 4. definition 10.
//   This does the MG sig on the "dest" part of the given key matrix, and
//   the last row is the sum of input commitments from that column - sum output commitments
//   this shows that sum inputs = sum outputs
//Ver:
//   verifies the above sig is created corretly
function proveRctMG(message, pubs, inSk, kimg, mask, Cout, index, hwdev) {
    xmr_str_utils_1.JSONPrettyPrint("proveRctMG", {
        message,
        pubs,
        inSk,
        kimg,
        mask,
        Cout,
        index,
    }, "args");
    const cols = pubs.length;
    if (cols < 3) {
        throw Error("cols must be > 2 (mixin)");
    }
    const PK = [];
    //fill pubkey matrix (copy destination, subtract commitments)
    for (let i = 0; i < cols; i++) {
        PK[i] = [];
        PK[i][0] = pubs[i].dest;
        PK[i][1] = ge_sub(pubs[i].mask, Cout);
    }
    const xx = [inSk.x, sc_sub(inSk.a, mask)];
    xmr_str_utils_1.JSONPrettyPrint("proveRctMG", {
        message,
        pubs,
        inSk,
        kimg,
        mask,
        Cout,
        index,
        PK,
        xx,
    }, "pre_MLSAG_gen");
    return mlsag_1.MLSAG_Gen(message, PK, xx, kimg, index, hwdev);
}
exports.proveRctMG = proveRctMG;
//Ring-ct MG sigs
//Prove:
//   c.f. http://eprint.iacr.org/2015/1098 section 4. definition 10.
//   This does the MG sig on the "dest" part of the given key matrix, and
//   the last row is the sum of input commitments from that column - sum output commitments
//   this shows that sum inputs = sum outputs
//Ver:
//   verifies the above sig is created corretly
function verRctMG(mg, pubs, outPk, txnFeeKey, message, kimg) {
    const cols = pubs.length;
    if (cols < 1) {
        throw Error("Empty pubs");
    }
    const rows = pubs[0].length;
    if (rows < 1) {
        throw Error("Empty pubs");
    }
    for (let i = 0; i < cols; ++i) {
        if (pubs[i].length !== rows) {
            throw Error("Pubs is not rectangular");
        }
    }
    // key matrix of (cols, tmp)
    let M = [];
    //create the matrix to mg sig
    for (let i = 0; i < rows; i++) {
        M[i] = [];
        M[i][0] = pubs[0][i].dest;
        M[i][1] = ge_add(M[i][1] || identity(), pubs[0][i].mask); // start with input commitment
        for (let j = 0; j < outPk.length; j++) {
            M[i][1] = ge_sub(M[i][1], outPk[j].mask); // subtract all output commitments
        }
        M[i][1] = ge_sub(M[i][1], txnFeeKey); // subtract txnfee
    }
    console.log(`[MLSAG_ver input]`, JSON.stringify({ message, M, mg, kimg }, null, 1));
    return mlsag_1.MLSAG_ver(message, M, mg, kimg);
}
exports.verRctMG = verRctMG;
// simple version, assuming only post Rct
function verRctMGSimple(message, mg, pubs, C, kimg) {
    try {
        const M = pubs.map(pub => [pub.dest, ge_sub(pub.mask, C)]);
        return mlsag_1.MLSAG_ver(message, M, mg, kimg);
    }
    catch (error) {
        console.error("[verRctSimple]", error);
        return false;
    }
}
exports.verRctMGSimple = verRctMGSimple;
//# sourceMappingURL=prove_ringct_mg.js.map