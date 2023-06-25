import { ErrorRequestHandler } from "express";
import { WebAppAuthProvider } from "../provider/WebAppAuthProvider";
declare function errorMiddleware(this: WebAppAuthProvider): ErrorRequestHandler;
export default errorMiddleware;
//# sourceMappingURL=errorMiddleware.d.ts.map