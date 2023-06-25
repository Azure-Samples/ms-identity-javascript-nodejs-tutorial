import { RequestHandler } from "express";
import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
import { RouteGuardOptions } from "./MiddlewareOptions";
declare function guardMiddleware(this: WebAppAuthProvider, options: RouteGuardOptions): RequestHandler;
export default guardMiddleware;
//# sourceMappingURL=guardMiddleware.d.ts.map