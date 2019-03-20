export declare class RouterContainer {
    private controllers;
    private middlewares;
    private errorHandlers;
    getControllerEndpoint(name: string): any;
    getMiddlewareEndpoint(name: string): any;
    load(root: string): void;
}
