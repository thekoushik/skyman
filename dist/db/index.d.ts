/**
 *
 */
export declare class DB {
    private static singleton;
    private connector;
    private settings;
    constructor(settings?: any);
    connect(config: any): Promise<any>;
    static getInstance(): DB;
    static createModel(name: string, definition: any, option?: any): any;
    static type(name: string, ...args: any): any;
    static connection(): any;
}
