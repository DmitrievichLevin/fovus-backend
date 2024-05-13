import { Model } from '../models/model.interface';

/**
 * @todo - create dynamic route builder
 * - grab model files
 * - construct/export routes
 * reference: https://stackoverflow.com/questions/71911584/how-can-i-dynamically-import-a-directory-of-files-from-within-a-loop
 */
type HTTPRes = { status: (code: number) => { send(data: { [key: string]: any, message?: string }): void } };

type Query = { [key: string]: any };

type RequestData = { [key: string]: any };

type HTTPReq = {
  body: { [key: string]: any, query?: Query, data?: RequestData }
};

type ControllerFactoryConstructable = {
  new(model: Model): ControllerFactoryInterface;
};

type HTTPMethod = (req: HTTPReq, res: HTTPRes) => void;

abstract class ControllerFactoryInterface {
  constructor(model: Model) {
    this.model = model;
  }

  protected model: Model = null;

  abstract post?(req: HTTPReq, res: HTTPRes): void;

  abstract get?(req: HTTPReq, res: HTTPRes): void;

  abstract put?(req: HTTPReq, res: HTTPRes): void;

  abstract delete?(req: HTTPReq, res: HTTPRes): void;
}

class DefaultControllerFactory extends ControllerFactoryInterface {
  post(req: HTTPReq, res: HTTPRes) {
    // Get Model Schema
    const RouteModel = this.model.Schema;

    // body -> post object
    const dict = Object.entries(RouteModel).reduce((d: {
      [key: string]: any
    }, [key, next]) => {
      // eslint-disable-next-line no-param-reassign
      d[key as keyof object] = req.body[key as keyof object];
      return d;
    }, {});

    // instantiate new model
    const data = new RouteModel(dict);

    // save model
    data.save((err?: { message?: string }) => {
      // Default Error Handling
      if (err) { res.status(500).send({ message: err.message || `Error posting ${this.model.tableName}` }); } else {
        res.status(200).send({ message: `${this.model.tableName} posted.` });
      }
    });
  }

  get(req: HTTPReq, res: HTTPRes) {
    // Get Model Schema
    const RouteModel = this.model.Schema;

    // query
    const { query } = req.body;

    // get item from db
    RouteModel.get(query, {}, (err: { message?: string }, data: { get: () => object }) => {
      // Default Error Handling
      if (err) { res.status(500).send({ message: err.message || `Error fetching from ${this.model.tableName}` }); } else {
        res.status(200).send(data.get());
      }
    });
  }

  put(req: HTTPReq, res: HTTPRes) {
    // Get Model Schema
    const RouteModel = this.model.Schema;

    // query
    const { data } = req.body;

    // update and respond with item from db
    RouteModel.update(data, (err: { message?: string }, updated: { get: () => object }) => {
      // Default Error Handling
      if (err) { res.status(500).send({ message: err.message || `Error updating from ${this.model.tableName}` }); } else {
        res.status(200).send(updated.get());
      }
    });
  }

  delete(req: HTTPReq, res: HTTPRes) {
    // Get Model Schema
    const RouteModel = this.model.Schema;

    // query
    const { data } = req.body;

    // Params
    const nextParams = {};

    // update and respond with item from db
    RouteModel.destroy(data, nextParams, (err: { message?: string }, updated: { get: () => object }) => {
      // Default Error Handling
      if (err) { res.status(500).send({ message: err.message || `Error updating from ${this.model.tableName}` }); } else {
        res.status(200).send(updated.get());
      }
    });
  }
}

export {
  ControllerFactoryInterface, ControllerFactoryConstructable, DefaultControllerFactory, HTTPMethod
};
