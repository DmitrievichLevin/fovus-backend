"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const router = express_1.default.Router();
/* GET home page. */
router.get('/', (_, res) => {
    res.send('Hello from Generate-Express');
});
exports.default = router;
//# sourceMappingURL=hello.js.map