import { Router } from "express";
import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { AuthenticateMiddlewareOptions } from "./MiddlewareOptions";
declare function authenticateMiddleware(this: WebAppAuthProvider, options: AuthenticateMiddlewareOptions): Router;
export default authenticateMiddleware;
//# sourceMappingURL=authenticateMiddleware.d.ts.map