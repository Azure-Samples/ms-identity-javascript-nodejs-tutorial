/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Request, Response, NextFunction, RequestHandler } from "express";
import { ResponseMode } from "@azure/msal-common";
import { AuthorizationCodeRequest, AuthorizationUrlRequest } from "@azure/msal-node";
import { WebAppAuthProvider } from "../../provider/WebAppAuthProvider";
import { LoginOptions, AppState } from "../MiddlewareOptions";
import { UrlUtils } from "../../utils/UrlUtils";
import { EMPTY_STRING } from "../../utils/Constants";

function loginHandler(
    this: WebAppAuthProvider, 
    options: LoginOptions
): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        this.getLogger().trace("loginHandler called");

        const state: AppState = {
            redirectTo: options.postLoginRedirectUri || "/",
            customState: options.state
        };

        const authUrlParams: AuthorizationUrlRequest = {
            state: this.getCryptoProvider().base64Encode(JSON.stringify(state)),
            redirectUri: UrlUtils.ensureAbsoluteUrl(
                this.webAppAuthConfig.auth.redirectUri,
                req.protocol,
                req.get("host") || req.hostname
            ),
            responseMode: ResponseMode.FORM_POST,
            scopes: options.scopes || [],
            prompt: options.prompt || undefined,
            claims: options.claims || undefined,
            account: options.account || undefined,
            sid: options.sid || undefined,
            loginHint: options.loginHint || undefined,
            domainHint: options.domainHint || undefined,
            extraQueryParameters: options.extraQueryParameters || undefined,
            extraScopesToConsent: options.extraScopesToConsent || undefined,
        };

        req.session.tokenRequestParams = {
            scopes: authUrlParams.scopes,
            state: authUrlParams.state,
            redirectUri: authUrlParams.redirectUri,
            claims: authUrlParams.claims,
            tokenBodyParameters: options.tokenBodyParameters,
            tokenQueryParameters: options.tokenQueryParameters,
            code: EMPTY_STRING,
        } as AuthorizationCodeRequest;

        try {
            const response = await this.getMsalClient().getAuthCodeUrl(authUrlParams);
            res.redirect(response);
        } catch (error) {
            next(error);
        }
    };
}

export default loginHandler;
