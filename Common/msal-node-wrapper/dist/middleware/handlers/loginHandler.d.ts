import { RequestHandler } from "express";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LoginOptions } from "../MiddlewareOptions";
declare function loginHandler(this: WebAppAuthProvider, options: LoginOptions): RequestHandler;
export default loginHandler;
//# sourceMappingURL=loginHandler.d.ts.map