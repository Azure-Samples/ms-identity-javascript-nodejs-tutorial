/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { NextFunction, Request, Response } from "express";
import { WebAppAuthProvider } from "../../../src/provider/WebAppAuthProvider";
import redirectHandler from "../../../src/middleware/handlers/redirectHandler";
import { ErrorMessages } from "../../../src/utils/Constants";

describe("redirectHandler", () => {
    const state = "encoded-state";
    const account = { homeAccountId: "home-account-id" };

    const createHandler = () => {
        const acquireTokenByCode = jest.fn().mockResolvedValue({ account });
        const tokenCache = {
            deserialize: jest.fn(),
            serialize: jest.fn().mockReturnValue("serialized-cache"),
        };
        const provider = {
            getLogger: () => ({ trace: jest.fn() }),
            getMsalClient: () => ({
                acquireTokenByCode,
                getTokenCache: () => tokenCache,
            }),
            getCryptoProvider: () => ({
                base64Decode: jest.fn().mockReturnValue(JSON.stringify({ redirectTo: "/target" })),
            }),
        } as unknown as WebAppAuthProvider;

        return {
            acquireTokenByCode,
            handler: redirectHandler.call(provider),
        };
    };

    it("redeems the code with the stored request when state matches", async () => {
        const { acquireTokenByCode, handler } = createHandler();
        const req = {
            body: {
                code: "authorization-code",
                state,
                unexpected: "authorization-response-data",
            },
            session: {
                tokenRequestParams: {
                    code: "",
                    scopes: ["openid"],
                    state,
                    redirectUri: "http://localhost/redirect",
                },
            },
        } as unknown as Request;
        const res = {
            redirect: jest.fn(),
        } as unknown as Response;
        const next = jest.fn() as NextFunction;

        await handler(req, res, next);

        expect(acquireTokenByCode).toHaveBeenCalledTimes(1);
        expect(acquireTokenByCode).toHaveBeenCalledWith({
            code: "authorization-code",
            scopes: ["openid"],
            state,
            redirectUri: "http://localhost/redirect",
        });
        expect(req.session.tokenCache).toBe("serialized-cache");
        expect(req.session.account).toBe(account);
        expect(req.session.isAuthenticated).toBe(true);
        expect(res.redirect).toHaveBeenCalledWith("/target");
        expect(next).not.toHaveBeenCalled();
    });

    it.each([
        ["missing", undefined],
        ["mismatched", "different-state"],
    ])("rejects a %s state before redeeming the code", async (_description, responseState) => {
        const { acquireTokenByCode, handler } = createHandler();
        const req = {
            body: {
                code: "authorization-code",
                state: responseState,
            },
            session: {
                tokenRequestParams: {
                    state,
                },
            },
        } as unknown as Request;
        const res = {} as Response;
        const next = jest.fn() as NextFunction;

        await handler(req, res, next);

        expect(next).toHaveBeenCalledWith(new Error(ErrorMessages.CSRF_TOKEN_MISMATCH));
        expect(acquireTokenByCode).not.toHaveBeenCalled();
    });
});
