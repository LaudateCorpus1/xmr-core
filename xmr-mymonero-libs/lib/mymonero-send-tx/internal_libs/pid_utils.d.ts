import { NetType } from "@xmr-core/xmr-crypto-utils";
/**
 *
 *  @description
 *  Attempts to decode the provided address based on its nettype to break it down into its components
 *  {pubSend, pubView, integratedPaymentId}
 *
 * Then based on the decoded values, determines if the payment ID (if supplied) should be encrypted or not.
 *
 * If a payment ID is not supplied, it may be grabbed from the integratedPaymentId component of the decoded
 * address if provided.
 *
 * At each step, invariants are enforced to prevent the following scenarios.
 *
 *
 * 1. Supplied PID + Integrated PID
 * 2. Supplied PID + Sending to subaddress
 * 3. Invalid supplied PID
 *
 *
 * @export
 * @param {string} address
 * @param {NetType} nettype
 * @param {(string | null)} pid
 */
export declare function checkAddressAndPidValidity(address: string, nettype: NetType, pid: string | null): {
    pid: string | null;
    encryptPid: boolean;
};
//# sourceMappingURL=pid_utils.d.ts.map