"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable no-console */
const express_1 = tslib_1.__importDefault(require("express"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const compression_1 = tslib_1.__importDefault(require("compression"));
const cookie_parser_1 = tslib_1.__importDefault(require("cookie-parser"));
const cors_1 = tslib_1.__importDefault(require("cors"));
const helmet_1 = tslib_1.__importDefault(require("helmet"));
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const routes = tslib_1.__importStar(require("./routes"));
const app = express_1.default();
const getRoutes = () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const dir = `${process.cwd()}/server/models`;
    const paths = fs_1.default.readdirSync(dir, { withFileTypes: true })
        .reduce((list, item) => {
        if (!item.isDirectory())
            list.push(item.name);
        return list;
    }, []);
    paths.forEach((filePath) => {
        const fileNameSegments = filePath.split('.');
        const routeName = fileNameSegments[1];
        if (!['index', 'interface'].includes(routeName)) {
            // const test = await import(`./${filePath}`);
            console.log('Using async/await:', filePath);
        }
    });
});
getRoutes().then(() => console.log("finished getting routes"));
app.use(morgan_1.default('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(helmet_1.default());
app.use(cors_1.default());
app.use(compression_1.default());
app.use('/api', routes.hello);
app.use('/api/users', routes.users);
exports.default = app;
//# sourceMappingURL=app.js.map