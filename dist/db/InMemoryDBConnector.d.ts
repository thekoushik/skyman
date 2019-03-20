import DBConnector from './DBConnector';
import BasicDBConnector from './BasicDBConnector';
export default class InMemoryDBConnector extends BasicDBConnector implements DBConnector {
    constructor();
    connect(config: any): Promise<any>;
    createModel(name: string, definition: any, option?: any): any;
    type(name: string, args: any[]): any;
    getConnection(): any;
}
