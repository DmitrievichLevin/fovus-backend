"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const route_interface_1 = require("server/routes/route.interface");
class Model {
    constructor() {
        this.route = null;
        this.Factory = route_interface_1.DefaultRouteFactory;
        this.tableName = this.constructor.name;
        this.route = new this.Factory(this);
    }
}
exports.Model = Model;
//# sourceMappingURL=model.interface.js.map