import { randomBytes } from "crypto";
import { sc_reduce32 } from "../crypto-ops/primitive_ops";

// Generate a 256-bit / 64-char / 32-byte crypto random
export async function rand_32() {
	const res = (await randomBytes(132))
	const res2 = Buffer.from(res).toString("hex").substr(0, 64)
	return res2
}

// Generate a 64-bit / 16-char / 8-byte crypto random
export async function rand_8() {
	const res = (await randomBytes(18))
	const res2 = Buffer.from(res).toString("hex").substr(0, 16)
	return res2
}

// Random 32-byte ec scalar
export async function random_scalar() {
	return sc_reduce32(await rand_32());
}
