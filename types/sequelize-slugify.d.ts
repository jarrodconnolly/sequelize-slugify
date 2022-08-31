import {ModelStatic} from "sequelize";

interface SlugOptions {
    replacement?: string;
    replaceSymbols?: boolean;
    remove?: boolean;
    lower?: boolean;
    charmap?: object;
    multicharmap?: object;
}

interface Options {
    source: string[];
    suffixSource?: string[];
    slugOptions?: SlugOptions;
    overwrite?: boolean;
    column?: string;
    incrementalSeparator?: string;
    passTransaction?: boolean;
    paranoid?: boolean;
    bulkUpdate?: boolean;
}

declare const _exports: SequelizeSlugify;
export = _exports;
declare class SequelizeSlugify {
    slugifyModel(model: ModelStatic, options: Options): void;
}
