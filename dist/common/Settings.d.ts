/**
 *
 */
export interface Settings {
    statics?: Record<string, string>;
    bodyparser?: any;
    cookieparser?: any;
    helmet?: any;
    session?: any;
    redis?: boolean;
    flash?: any;
    auth?: any;
    view?: any;
    db?: any;
}
/**
 *
 */
export declare const DefaultSettings: Settings;
