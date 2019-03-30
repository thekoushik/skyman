/**
 *
 */
export declare class InMemoryDatabase {
    private static singleton;
    private settings;
    constructor(settings?: any);
    connect(config: any): Promise<any>;
    static getInstance(): InMemoryDatabase;
    static createModel(name: string, definition: any, option?: any): any;
    static type(name: string, ...args: any): any;
    static connection(): boolean;
}
