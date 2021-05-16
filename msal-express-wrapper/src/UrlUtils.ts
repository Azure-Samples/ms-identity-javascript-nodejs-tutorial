import {
    Request,
} from 'express';

import { 
    IUri,
    UrlString,
} from '@azure/msal-common';

export class UrlUtils {
    ensureAbsoluteUrl = (req: Request, uri: string): string => {

        const urlComponents: IUri = new UrlString(uri).getUrlComponents();

        if (!urlComponents.Protocol) {
            if (!urlComponents.HostNameAndPort) {
                return req.protocol + '://' + req.get('host') + uri
            }
            return req.protocol + '://' + uri
        } else {
            return uri;
        }
    }
}