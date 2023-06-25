import { RequestHandler } from "express";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LogoutOptions } from "../MiddlewareOptions";
declare function logoutHandler(this: WebAppAuthProvider, options: LogoutOptions): RequestHandler;
export default logoutHandler;
//# sourceMappingURL=logoutHandler.d.ts.map