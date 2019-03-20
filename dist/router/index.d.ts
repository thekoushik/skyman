import Feather from "../Feather";
/**
 *
 */
export declare class Router implements Feather {
    private container;
    private router;
    static routerTree: any;
    private addToTree;
    private parseJSONRoutes;
    getRouter(): any;
    attach(settings: any, options: any, root: string, app: any): void;
}
