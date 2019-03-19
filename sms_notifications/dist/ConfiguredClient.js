"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TwilioClient_1 = require("./TwilioClient");
var ConfigProvider_1 = require("./ConfigProvider");
exports.configuredClient = function (logger) {
    return new TwilioClient_1.TwilioClient(new ConfigProvider_1.ConfigProvider().twilioConfig, logger);
};
//# sourceMappingURL=ConfiguredClient.js.map