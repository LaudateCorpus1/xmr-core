export declare function isTransactionConfirmed(tx: {
    height: number;
}, blockchainHeight: number): boolean;
export declare function isTransactionUnlocked({ unlock_time }: {
    unlock_time: number;
}, blockchainHeight: number): boolean;
export declare function transactionLockedReason({ unlock_time }: {
    unlock_time: number;
}, blockchainHeight: number): string;
//# sourceMappingURL=tx-status.d.ts.map