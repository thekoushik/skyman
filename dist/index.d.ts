import { Options } from './common/Options';
/**
 *
 */
export declare class Skyman {
    private loaded;
    private root;
    app: any;
    private options;
    private settings;
    private config;
    constructor(options?: Options);
    /**
     * Loads the settings from "system\settings.js" and the main application
     *
     * @param root Application directory
     */
    load(root?: string): void;
    fly(cb?: Function): void;
}
