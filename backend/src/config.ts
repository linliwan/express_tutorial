import type{ AppOptions, DatabasePaths } from "./types/index.ts";

export const options: AppOptions = {
    enableApi: true,
    enableWeb: true,
    env: "dev",
};

export const PORT = 8012;

export const DBPATHS: DatabasePaths = {
    dev: './data/dev.sqlite',
    prod: './data/prod.sqlite',
    test: ':memory:'
};