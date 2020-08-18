export declare const sendFundStatus: {
    fetchingLatestBalance: number;
    calculatingFee: number;
    fetchingDecoyOutputs: number;
    constructingTransaction: number;
    submittingTransaction: number;
};
export declare const sendFundsStatusToMessage: {
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
};
export declare type Status = typeof sendFundStatus[keyof typeof sendFundStatus];
//# sourceMappingURL=status_update_constants.d.ts.map