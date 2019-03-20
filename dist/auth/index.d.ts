import Feather from '../Feather';
export declare class Auth implements Feather {
    private settings;
    driver: any;
    attach(settings: any, options: any, root: string, app: any): void;
    static authenticate(req: any, res: any, next: any, cb: Function): void;
}
