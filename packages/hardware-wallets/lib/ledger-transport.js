"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hidCache = null;
var hidWrapper = Object.freeze({
    create: function () {
        // Load the library if not loaded
        if (hidCache == null) {
            hidCache = new Promise(function (resolve, reject) {
                try {
                    var hid = require("@ledgerhq/hw-transport-node-hid");
                    if (hid.create == null) {
                        resolve(hid["default"]);
                    }
                    resolve(hid);
                }
                catch (error) {
                    reject(error);
                }
            });
            /*
            hidCache = import("@ledgerhq/hw-transport-node-hid").then((hid) => {
                if (hid.create == null) { return hid["default"]; }
                return hid;
            });
            */
        }
        return hidCache.then(function (hid) {
            console.log(hid, hid.create);
            return hid.create();
        });
    }
});
exports.transports = Object.freeze({
    "hid": hidWrapper,
    "default": hidWrapper
});
