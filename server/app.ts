import express from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import logger from 'morgan';
import { AppBuilder } from './bin/app.builder';

const director = new AppBuilder();

director.bridge(logger, 'dev')
    .bridge(express.json)
    .bridge(express.urlencoded, { extended: false })
    .bridge(cookieParser)
    .bridge(helmet)
    .bridge(cors)
    .bridge(compression)
    .build();

export default director.app;
