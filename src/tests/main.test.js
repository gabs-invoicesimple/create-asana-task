"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
// shows how the runner will run a javascript action with env / stdout protocol
(0, globals_1.test)('test runs', () => {
    (0, globals_1.expect)(true).toBeTruthy();
});
