import express from 'express';
import fs from 'fs';
import { PathParams, Handler } from 'express-serve-static-core';
import debugPkg from 'debug';

const debug = debugPkg('ts/www:server');

type MiddleWare = any;

interface AppBuilderInterface {
    path: PathParams;
    expressApp: express.Express
    router: express.Router
    bridge: (middleware: MiddleWare | Handler, options?: object) => this
}

class AppBuilder implements AppBuilderInterface {
    constructor() {
        this.expressApp = express();
        this.router = express.Router();
    }

    get app(): express.Express {
        return this.expressApp;
    }

    build = async () => {
        /**
         * Dynamically Build Routes
         * @summary:
         * - Model File Name Nomenclature: model.[nameOfClass].ts
         */
        const dir = `${process.cwd()}/server/models`;

        const paths = fs.readdirSync(dir, { withFileTypes: true })
            .reduce((list, item) => {
                if (!item.isDirectory()) list.push(item.name);
                return list;
            }, []);

        paths.forEach(async (filePath) => {
            try {
                const fileNameSegments = filePath.split('.');
                const routeName = fileNameSegments[1];

                // Ignore index & interface files
                if (!['index', 'interface'].includes(routeName)) {
                    // Import Model from file
                    const Model = await import(`./${filePath}`);

                    // Instantiate Model
                    Model(this.router);

                    debug(`Successfully loaded Model: ${Model.constructor.name} from ${filePath}`);
                }
            } catch (err) {
                // Fault Tolerance: Will Skip/Log Models that fail to load.
                debug(`Failed to load model @ ${filePath}`, err.stack);
            }
        });

        this.app.use(this.path, this.router);
    };

    path = '';

    expressApp: express.Express;

    router: express.Router;

    bridge(middleware: MiddleWare, options?: any) {
        this.app.use(middleware(options));
        return this;
    }
}

export { AppBuilder, AppBuilderInterface };
