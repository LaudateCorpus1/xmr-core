import { HWDevice } from "../../../../xmr-crypto-utils";
export declare type KeyImageCache = {
    [cacheIndex: string]: string;
};
export declare type KeyImageCacheMap = {
    [address: string]: KeyImageCache;
};
/**
 * @description Performs a memoized computation of a key image
 * @param {KeyImageCache} keyImageCache
 * @param {string} txPubKey
 * @param {number} outIndex
 * @param {string} address
 * @param {string} privViewKey
 * @param {string} pubSpendKey
 * @param {string} privSpendKey
 * @returns
 */
export declare function genKeyImageFromTx(keyImageCache: KeyImageCache, txPubKey: string, outIndex: number, address: string, privViewKey: string, pubSpendKey: string, privSpendKey: string, hwdev: HWDevice): Promise<string>;
/**
 *
 * @description Get a key image cache, that's mapped by address
 * @export
 * @param {string} address
 */
export declare function getKeyImageCache(address: string): KeyImageCache;
/**
 * @description Clears a key image cache that's mapped by the users address
 *
 *
 * IMPORTANT: Ensure you call this method when you want to clear your wallet from
 * memory or delete it, or else you could leak key images and public addresses.
 * @export
 * @param {string} address
 */
export declare function clearKeyImageCache(address: string): void;
//# sourceMappingURL=memoized-keyimage-generation.d.ts.map
