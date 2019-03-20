export default interface AuthProvider {
    getUserByCredentials(username: string, password: string): Promise<any>;
    getUserById(id: any): Promise<any>;
    getUserID(user: any): any;
}
