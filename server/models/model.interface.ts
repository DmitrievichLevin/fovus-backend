import {
  DefaultControllerFactory, ControllerFactoryInterface, ControllerFactoryConstructable, HTTPMethod
} from 'server/controllers/controller.interface';
import { Router, UnixAbsolutePath } from 'server/routes';

type DynamoOperation = (...args: any[]) => void;

// model
interface Schema {
  new(data: object): {
    save: DynamoOperation;
  }
  get: DynamoOperation;
  set: DynamoOperation;
  update: DynamoOperation;
  destroy: DynamoOperation;
}

abstract class Model {
  constructor(router: Router) {
    this.tableName = this.constructor.name;
    const factory = new this.Factory(this);

    /**
     * Extract http methods from factory.
     */
    Object(factory).entries((method: string, func: HTTPMethod) => {
      router[method as keyof Router](this.path ?? new UnixAbsolutePath(`/${this.tableName}`), func);
    });
  }

  route: ControllerFactoryInterface = null;

  path?: UnixAbsolutePath = null;

  tableName: string;

  Schema: Schema;

  Factory: ControllerFactoryConstructable = DefaultControllerFactory;
}

export {
  Model
};
