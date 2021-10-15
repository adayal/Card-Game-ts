"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const Server_1 = require("./server/Server");
let app = new Server_1.Server().getApp();
exports.app = app;
//# sourceMappingURL=index.js.map