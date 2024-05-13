"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultRouteFactory = exports.RouteFactoryInterface = void 0;
class RouteFactoryInterface {
    constructor(model) {
        this.model = null;
        this.model = model;
    }
}
exports.RouteFactoryInterface = RouteFactoryInterface;
class DefaultRouteFactory extends RouteFactoryInterface {
    post(req, res) {
        // Get Model Schema
        const RouteModel = this.model.Schema;
        // body -> post object
        const dict = Object.entries(RouteModel).reduce((d, [key, next]) => {
            // eslint-disable-next-line no-param-reassign
            d[key] = req.body[key];
            return d;
        }, {});
        // instantiate new model
        const data = new RouteModel(dict);
        // save model
        data.save((err) => {
            // Default Error Handling
            if (err) {
                res.status(500).send({ message: err.message || `Error posting ${this.model.tableName}` });
            }
            else {
                res.status(200).send({ message: `${this.model.tableName} posted.` });
            }
        });
    }
    get(req, res) {
        // Get Model Schema
        const RouteModel = this.model.Schema;
        // query
        const { query } = req.body;
        // get item from db
        RouteModel.get(query, {}, (err, data) => {
            // Default Error Handling
            if (err) {
                res.status(500).send({ message: err.message || `Error fetching from ${this.model.tableName}` });
            }
            else {
                res.status(200).send(data.get());
            }
        });
    }
    patch(req, res) {
        // Get Model Schema
        const RouteModel = this.model.Schema;
        // query
        const { data } = req.body;
        // update and respond with item from db
        RouteModel.update(data, (err, updated) => {
            // Default Error Handling
            if (err) {
                res.status(500).send({ message: err.message || `Error updating from ${this.model.tableName}` });
            }
            else {
                res.status(200).send(updated.get());
            }
        });
    }
    delete(req, res) {
        // Get Model Schema
        const RouteModel = this.model.Schema;
        // query
        const { data } = req.body;
        // Params
        const nextParams = {};
        // update and respond with item from db
        RouteModel.destroy(data, nextParams, (err, updated) => {
            // Default Error Handling
            if (err) {
                res.status(500).send({ message: err.message || `Error updating from ${this.model.tableName}` });
            }
            else {
                res.status(200).send(updated.get());
            }
        });
    }
}
exports.DefaultRouteFactory = DefaultRouteFactory;
//# sourceMappingURL=route.interface.js.map