import { RequestHandler } from "express";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { TokenRequestOptions, TokenRequestMiddlewareOptions } from "../MiddlewareOptions";
declare function acquireTokenHandler(this: WebAppAuthProvider, options: TokenRequestOptions, useAsMiddlewareOptions?: TokenRequestMiddlewareOptions): RequestHandler;
export default acquireTokenHandler;
//# sourceMappingURL=acquireTokenHandler.d.ts.map