"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var xmr_money_1 = require("../../../../xmr-money");
var xmr_constants_1 = require("../../../../xmr-constants");
var ERR;
(function (ERR) {
    var RING;
    (function (RING) {
        RING.INSUFF = Error("Ringsize is below the minimum.");
    })(RING = ERR.RING || (ERR.RING = {}));
    var MIXIN;
    (function (MIXIN) {
        MIXIN.INVAL = Error("Invalid mixin");
    })(MIXIN = ERR.MIXIN || (ERR.MIXIN = {}));
    var DEST;
    (function (DEST) {
        DEST.INVAL = Error("You need to enter a valid destination");
    })(DEST = ERR.DEST || (ERR.DEST = {}));
    var AMT;
    (function (AMT) {
        AMT.INSUFF = Error("The amount you've entered is too low");
    })(AMT = ERR.AMT || (ERR.AMT = {}));
    var PID;
    (function (PID) {
        PID.NO_INTEG_ADDR = Error("Payment ID must be blank when using an Integrated Address");
        PID.NO_SUB_ADDR = Error("Payment ID must be blank when using a Subaddress");
        PID.INVAL = Error("Invalid payment ID.");
    })(PID = ERR.PID || (ERR.PID = {}));
    var BAL;
    (function (BAL) {
        function insuff(amtAvail, requiredAmt) {
            var coinSymbol = xmr_constants_1.config.coinSymbol;
            var amtAvailStr = xmr_money_1.formatMoney(amtAvail);
            var requiredAmtStr = xmr_money_1.formatMoney(requiredAmt);
            var errStr = "Your spendable balance is too low. Have " + amtAvailStr + " " + coinSymbol + " spendable, need " + requiredAmtStr + " " + coinSymbol + ".";
            return Error(errStr);
        }
        BAL.insuff = insuff;
    })(BAL = ERR.BAL || (ERR.BAL = {}));
    var SWEEP;
    (function (SWEEP) {
        SWEEP.TOTAL_NEQ_OUTS = Error("The sum of all outputs should be equal to the total amount for sweeping transactions");
    })(SWEEP = ERR.SWEEP || (ERR.SWEEP = {}));
    var TX;
    (function (TX) {
        function failure(err) {
            var errStr = err
                ? err.toString()
                : "Failed to create transaction with unknown error.";
            return Error(errStr);
        }
        TX.failure = failure;
    })(TX = ERR.TX || (ERR.TX = {}));
    var PARSE_TRGT;
    (function (PARSE_TRGT) {
        PARSE_TRGT.EMPTY = Error("Please supply a target address and a target amount.");
        PARSE_TRGT.OA_RES = Error("You must resolve this OpenAlias address to a Monero address before calling SendFunds");
        function decodeAddress(targetAddress, err) {
            return Error("Couldn't decode address " + targetAddress + " : " + err);
        }
        PARSE_TRGT.decodeAddress = decodeAddress;
        function amount(targetAmount, err) {
            return Error("Couldn't parse amount " + targetAmount + " : " + err);
        }
        PARSE_TRGT.amount = amount;
    })(PARSE_TRGT = ERR.PARSE_TRGT || (ERR.PARSE_TRGT = {}));
})(ERR = exports.ERR || (exports.ERR = {}));
//# sourceMappingURL=errors.js.map
