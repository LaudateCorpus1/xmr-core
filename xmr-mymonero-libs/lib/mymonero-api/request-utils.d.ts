export declare function withUserAgentParams<T>(params: T): T & {
    app_name: string;
    app_version: string;
};
declare type Json = {
    [key: string]: null | undefined | number | string | boolean | Json | (null | undefined | number | string | boolean | Json)[];
};
/**
 *
 *
 * @export
 * @param {string} hostName e.g api.mymonero.com
 * @param {string} endPoint e.g login
 * @param {Json} payload
 * @returns
 */
export declare function makeRequest(hostName: string, endPoint: string, payload: Json): Promise<any>;
export {};
//# sourceMappingURL=request-utils.d.ts.map