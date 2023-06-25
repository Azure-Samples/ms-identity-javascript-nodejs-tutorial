/*! msal-node-wrapper v1.0.0-beta 2023-06-25 */
'use strict';
'use strict';

var msalNode = require('@azure/msal-node');
var WebAppAuthProvider = require('./provider/WebAppAuthProvider.js');
var packageMetadata = require('./packageMetadata.js');



Object.defineProperty(exports, 'AuthError', {
	enumerable: true,
	get: function () { return msalNode.AuthError; }
});
Object.defineProperty(exports, 'InteractionRequiredAuthError', {
	enumerable: true,
	get: function () { return msalNode.InteractionRequiredAuthError; }
});
Object.defineProperty(exports, 'Logger', {
	enumerable: true,
	get: function () { return msalNode.Logger; }
});
exports.WebAppAuthProvider = WebAppAuthProvider.WebAppAuthProvider;
exports.packageVersion = packageMetadata.packageVersion;
//# sourceMappingURL=index.js.map
