import Feather from '../Feather';
export declare class View implements Feather {
    private static singleton;
    private driver;
    private settings;
    constructor();
    attach(settings: any, options: any, root: string, app: any): void;
    static render(view_path: string, context?: any): Promise<any>;
}
