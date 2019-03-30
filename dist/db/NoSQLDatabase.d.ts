export declare class NoSQLDatabase {
    private static singleton;
    private static driver;
    protected options: any;
    private static schemaBuilder;
    private settings;
    constructor(settings?: any);
    connect(config: any): Promise<any>;
    static getInstance(): NoSQLDatabase;
    static createModel(name: string, definition: any, option?: any): any;
    static type(name: string): any;
    static connection(): any;
}
