export declare class SQLDatabase {
    private static singleton;
    protected driver: any;
    protected options: any;
    protected connection: any;
    private settings;
    constructor(settings?: any);
    connect(config: any): Promise<any>;
    static getInstance(): SQLDatabase;
    static createModel(name: string, definition: any, option?: any): any;
    static type(name: string, ...args: any): any;
    static connection(): any;
}
