import { Constants, UrlString, OIDC_DEFAULT_SCOPES, PromptValue, InteractionRequiredAuthError } from '@azure/msal-common';
import { LogLevel, CryptoProvider, ConfidentialClientApplication } from '@azure/msal-node';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
var ConfigurationUtils = function ConfigurationUtils() {};
/**
 * Validates the fields in the custom JSON configuration file
 * @param {JSON} config: configuration file
 */

ConfigurationUtils.validateAppSettings = function (config) {
  if (!config.credentials.clientId || config.credentials.clientId === "Enter_the_Application_Id_Here") {
    throw new Error("No clientId provided!");
  }

  if (!config.credentials.tenantId || config.credentials.tenantId === "Enter_the_Tenant_Info_Here") {
    throw new Error("No tenantId provided!");
  }

  if (!config.credentials.clientSecret || config.credentials.clientSecret === "Enter_the_Client_Secret_Here") {
    throw new Error("No clientSecret provided!");
  }

  if (!config.settings.redirectUri || config.settings.redirectUri === "Enter_the_Redirect_Uri_Here") {
    throw new Error("No postLogoutRedirectUri provided!");
  }

  if (!config.settings.postLogoutRedirectUri || config.settings.postLogoutRedirectUri === "Enter_the_Post_Logout_Redirect_Uri_Here") {
    throw new Error("No postLogoutRedirectUri provided!");
  }

  if (!config.settings.homePageRoute || config.settings.homePageRoute === "Enter_the_Home_Page_Route_Here") {
    throw new Error("No homePageRoute provided!");
  }
};
/**
 * Maps the custom JSON configuration file to configuration
 * object expected by MSAL Node ConfidentialClientApplication
 * @param {JSON} config: configuration file
 * @param {Object} cachePlugin: passed during initialization
 */


ConfigurationUtils.getMsalConfiguration = function (config, cachePlugin) {
  if (cachePlugin === void 0) {
    cachePlugin = null;
  }

  return {
    auth: {
      clientId: config.credentials.clientId,
      authority: config.policies ? Object.entries(config.policies)[0][1]['authority'] : "https://" + Constants.DEFAULT_AUTHORITY_HOST + "/" + config.credentials.tenantId,
      clientSecret: config.credentials.clientSecret,
      redirectUri: config.settings ? config.settings.redirectUri : "",
      knownAuthorities: config.policies ? [UrlString.getDomainFromUrl(Object.entries(config.policies)[0][1]['authority'])] : []
    },
    cache: {
      cachePlugin: cachePlugin
    },
    system: {
      loggerOptions: {
        loggerCallback: function loggerCallback(logLevel, message, containsPii) {
          console.log(message);
        },
        piiLoggingEnabled: false,
        logLevel: LogLevel.Verbose
      }
    }
  };
};

/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * Basic authentication stages used to determine
 * appropriate action after redirect occurs
 */
var AppStages = {
  SIGN_IN: "sign_in",
  SIGN_OUT: "sign_out",
  ACQUIRE_TOKEN: "acquire_token"
};
/**
 * Various error constants
 */

var ErrorMessages = {
  NOT_PERMITTED: "Not permitted",
  INVALID_TOKEN: "Invalid token",
  CANNOT_DETERMINE_APP_STAGE: "Cannot determine application stage",
  NONCE_MISMATCH: "Nonce does not match",
  INTERACTION_REQUIRED: "interaction_required",
  TOKEN_NOT_FOUND: "No token found",
  TOKEN_NOT_DECODED: "Token cannot be decoded",
  TOKEN_NOT_VERIFIED: "Token cannot be verified",
  KEYS_NOT_OBTAINED: "Signing keys cannot be obtained",
  STATE_NOT_FOUND: "State not found"
};

var TokenValidator = function TokenValidator(appSettings, msalConfig) {
  var _this = this;

  /**
   * Validates the id token for a set of claims
   * @param {Object} idTokenClaims: decoded id token claims
   */
  this.validateIdToken = function (idTokenClaims) {
    var now = Math.round(new Date().getTime() / 1000); // in UNIX format

    /**
     * At the very least, check for tenant, audience, issue and expiry dates.
     * For more information on validating id tokens, visit:
     * https://docs.microsoft.com/azure/active-directory/develop/id-tokens#validating-an-id_token
     */

    var checkAudience = idTokenClaims["aud"] === _this.msalConfig.auth.clientId ? true : false;
    var checkTimestamp = idTokenClaims["iat"] <= now && idTokenClaims["exp"] >= now ? true : false;
    var checkTenant = _this.appSettings.policies && !idTokenClaims["tid"] || idTokenClaims["tid"] === _this.appSettings.credentials.tenantId ? true : false;
    return checkAudience && checkTimestamp && checkTenant;
  };
  /**
   * Validates the access token for signature and against a predefined set of claims
   * @param {string} accessToken: raw JWT token
   * @param {string} protectedRoute: used for checking scope
   */


  this.validateAccessToken = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(accessToken, protectedRoute) {
      var now, decodedToken, keys, verifiedToken, checkIssuer, checkTimestamp, checkAudience, checkScopes;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              now = Math.round(new Date().getTime() / 1000); // in UNIX format

              if (!(!accessToken || accessToken === "" || accessToken === "undefined")) {
                _context.next = 4;
                break;
              }

              console.log(ErrorMessages.TOKEN_NOT_FOUND);
              return _context.abrupt("return", false);

            case 4:
              _context.prev = 4;
              decodedToken = jwt.decode(accessToken, {
                complete: true
              });
              _context.next = 13;
              break;

            case 8:
              _context.prev = 8;
              _context.t0 = _context["catch"](4);
              console.log(ErrorMessages.TOKEN_NOT_DECODED);
              console.log(_context.t0);
              return _context.abrupt("return", false);

            case 13:
              _context.prev = 13;
              _context.next = 16;
              return _this.getSigningKeys(decodedToken.header);

            case 16:
              keys = _context.sent;
              _context.next = 24;
              break;

            case 19:
              _context.prev = 19;
              _context.t1 = _context["catch"](13);
              console.log(ErrorMessages.KEYS_NOT_OBTAINED);
              console.log(_context.t1);
              return _context.abrupt("return", false);

            case 24:
              _context.prev = 24;
              verifiedToken = jwt.verify(accessToken, keys);
              _context.next = 33;
              break;

            case 28:
              _context.prev = 28;
              _context.t2 = _context["catch"](24);
              console.log(ErrorMessages.TOKEN_NOT_VERIFIED);
              console.log(_context.t2);
              return _context.abrupt("return", false);

            case 33:
              /**
               * At the very least, validate the token with respect to issuer, audience, scope
               * and timestamp, though implementation and extent vary. For more information, visit:
               * https://docs.microsoft.com/azure/active-directory/develop/access-tokens#validating-tokens
               */
              checkIssuer = verifiedToken['iss'].includes(_this.appSettings.credentials.tenantId) ? true : false;
              checkTimestamp = verifiedToken["iat"] <= now && verifiedToken["exp"] >= now ? true : false;
              checkAudience = verifiedToken['aud'] === _this.appSettings.credentials.clientId || verifiedToken['aud'] === 'api://' + _this.appSettings.credentials.clientId ? true : false;
              checkScopes = _this.appSettings["protected"].find(function (item) {
                return item.route === protectedRoute;
              }).scopes.every(function (scp) {
                return verifiedToken['scp'].includes(scp);
              });

              if (!(checkAudience && checkIssuer && checkTimestamp && checkScopes)) {
                _context.next = 39;
                break;
              }

              return _context.abrupt("return", true);

            case 39:
              return _context.abrupt("return", false);

            case 40:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[4, 8], [13, 19], [24, 28]]);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Fetches signing keys of an access token
   * from the authority discovery endpoint
   * @param {string} header
   */


  this.getSigningKeys = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(header) {
      var jwksUri, client;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // Check if a B2C application i.e. app has policies
              if (_this.appSettings.policies) {
                jwksUri = _this.msalConfig.auth.authority + "/discovery/v2.0/keys";
              } else {
                jwksUri = "https://" + Constants.DEFAULT_AUTHORITY_HOST + "/" + _this.appSettings.credentials.tenantId + "/discovery/v2.0/keys";
              }

              client = jwksClient({
                jwksUri: jwksUri
              });
              _context2.next = 4;
              return client.getSigningKeyAsync(header.kid);

            case 4:
              return _context2.abrupt("return", _context2.sent.getPublicKey());

            case 5:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2);
    }));

    return function (_x3) {
      return _ref2.apply(this, arguments);
    };
  }();

  this.appSettings = appSettings;
  this.msalConfig = msalConfig;
};

/**
 * A simple wrapper around MSAL Node ConfidentialClientApplication object.
 * It offers a collection of middleware and utility methods that automate
 * basic authentication and authorization tasks in Express MVC web apps.
 *
 * You must have express and express-sessions package installed. Middleware
 * here can be used with express sessions in route controllers.
 *
 * Session variables accessible are as follows:
    * req.session.isAuthenticated => boolean
    * req.session.isAuthorized => boolean
    * req.session.userAccount => object
    * req.session.<resourceName>.accessToken => string
 */

var AuthProvider =
/**
 * @param {JSON} appSettings
 * @param {Object} cache: cachePlugin
 */
function AuthProvider(appSettings, cache) {
  var _this = this;

  // ========== MIDDLEWARE ===========

  /**
   * Initiate sign in flow
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @param {NextFunction} next: express next function
   */
  this.signIn = function (req, res, next) {
    /**
     * Request Configuration
     * We manipulate these three request objects below
     * to acquire a token with the appropriate claims
     */
    if (!req.session['authCodeRequest']) {
      req.session.authCodeRequest = {
        authority: "",
        scopes: [],
        state: {},
        redirectUri: ""
      };
    }

    if (!req.session['tokenRequest']) {
      req.session.tokenRequest = {
        authority: "",
        scopes: [],
        redirectUri: ""
      };
    }

    if (!req.session['account']) {
      req.session.account = {
        homeAccountId: "",
        environment: "",
        tenantId: "",
        username: "",
        idTokenClaims: {}
      };
    } // random GUID for csrf protection 


    req.session.nonce = _this.cryptoProvider.createNewGuid();

    var state = _this.cryptoProvider.base64Encode(JSON.stringify({
      stage: AppStages.SIGN_IN,
      path: req.route.path,
      nonce: req.session.nonce
    }));

    var params = {
      authority: _this.msalConfig.auth.authority,
      scopes: OIDC_DEFAULT_SCOPES,
      state: state,
      redirect: _this.appSettings.settings.redirectUri,
      prompt: PromptValue.SELECT_ACCOUNT
    }; // get url to sign user in

    _this.getAuthCode(req, res, next, params);
  };
  /**
   * Initiate sign out and clean the session
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @param {NextFunction} next: express next function
   */


  this.signOut = function (req, res, next) {
    /**
     * Construct a logout URI and redirect the user to end the
     * session with Azure AD/B2C. For more information, visit:
     * (AAD) https://docs.microsoft.com/azure/active-directory/develop/v2-protocols-oidc#send-a-sign-out-request
     * (B2C) https://docs.microsoft.com/azure/active-directory-b2c/openid-connect#send-a-sign-out-request
     */
    var logoutURI = _this.msalConfig.auth.authority + "/oauth2/v2.0/logout?post_logout_redirect_uri=" + _this.appSettings.settings.postLogoutRedirectUri;
    req.session.isAuthenticated = false;
    req.session.destroy(function () {
      res.redirect(logoutURI);
    });
  };
  /**
   * Middleware that handles redirect depending on request state
   * There are basically 2 stages: sign-in and acquire token
   * @param {Request} req: express request object
   * @param {Response} res: express response object
   * @param {NextFunction} next: express next function
   */


  this.handleRedirect = /*#__PURE__*/function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee(req, res, next) {
      var state, tokenRequest, tokenResponse, resourceName, _tokenRequest, _tokenResponse;

      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (!req.query.state) {
                _context.next = 44;
                break;
              }

              state = JSON.parse(_this.cryptoProvider.base64Decode(req.query.state)); // check if nonce matches

              if (!(state.nonce === req.session.nonce)) {
                _context.next = 40;
                break;
              }

              _context.t0 = state.stage;
              _context.next = _context.t0 === AppStages.SIGN_IN ? 6 : _context.t0 === AppStages.ACQUIRE_TOKEN ? 20 : 36;
              break;

            case 6:
              // token request should have auth code
              tokenRequest = {
                redirectUri: _this.appSettings.settings.redirectUri,
                scopes: OIDC_DEFAULT_SCOPES,
                code: req.query.code
              };
              _context.prev = 7;
              _context.next = 10;
              return _this.msalClient.acquireTokenByCode(tokenRequest);

            case 10:
              tokenResponse = _context.sent;
              console.log("\nResponse: \n:", tokenResponse);

              if (_this.tokenValidator.validateIdToken(tokenResponse.idTokenClaims)) {
                // assign session variables
                req.session.account = tokenResponse.account;
                req.session.isAuthenticated = true;
                res.status(200).redirect(_this.appSettings.settings.homePageRoute);
              } else {
                console.log(ErrorMessages.INVALID_TOKEN);
                res.status(401).send(ErrorMessages.NOT_PERMITTED);
              }

              _context.next = 19;
              break;

            case 15:
              _context.prev = 15;
              _context.t1 = _context["catch"](7);
              console.log(_context.t1);
              res.status(500).send(_context.t1);

            case 19:
              return _context.abrupt("break", 38);

            case 20:
              // get the name of the resource associated with scope
              resourceName = _this.getResourceName(state.path);
              _tokenRequest = {
                code: req.query.code,
                scopes: _this.appSettings.resources[resourceName].scopes,
                redirectUri: _this.appSettings.settings.redirectUri
              };
              _context.prev = 22;
              _context.next = 25;
              return _this.msalClient.acquireTokenByCode(_tokenRequest);

            case 25:
              _tokenResponse = _context.sent;
              console.log("\nResponse: \n:", _tokenResponse);
              req.session.resources[resourceName].accessToken = _tokenResponse.accessToken;
              res.status(200).redirect(state.path);
              _context.next = 35;
              break;

            case 31:
              _context.prev = 31;
              _context.t2 = _context["catch"](22);
              console.log(_context.t2);
              res.status(500).send(_context.t2);

            case 35:
              return _context.abrupt("break", 38);

            case 36:
              res.status(500).send(ErrorMessages.CANNOT_DETERMINE_APP_STAGE);
              return _context.abrupt("break", 38);

            case 38:
              _context.next = 42;
              break;

            case 40:
              console.log(ErrorMessages.NONCE_MISMATCH);
              res.status(401).send(ErrorMessages.NOT_PERMITTED);

            case 42:
              _context.next = 45;
              break;

            case 44:
              res.status(500).send(ErrorMessages.STATE_NOT_FOUND);

            case 45:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, null, [[7, 15], [22, 31]]);
    }));

    return function (_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }();
  /**
   * Middleware that gets tokens and calls web APIs
   * @param {Object} req: express request object
   * @param {Object} res: express response object
   * @param {Function} next: express next
   */


  this.getToken = /*#__PURE__*/function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(req, res, next) {
      var scopes, resourceName, silentRequest, tokenResponse, state, params;
      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              // get scopes for token request
              scopes = Object.values(_this.appSettings.resources).find(function (resource) {
                return resource.callingPageRoute === req.route.path;
              }).scopes;
              resourceName = _this.getResourceName(req.route.path);

              if (!req.session[resourceName]) {
                req.session[resourceName] = {
                  accessToken: null
                };
              }

              _context2.prev = 3;
              silentRequest = {
                account: req.session.account,
                scopes: scopes
              }; // acquire token silently to be used in resource call

              _context2.next = 7;
              return _this.msalClient.acquireTokenSilent(silentRequest);

            case 7:
              tokenResponse = _context2.sent;
              console.log("\nSuccessful silent token acquisition:\n Response: \n:", tokenResponse); // In B2C scenarios, sometimes an access token is returned empty.
              // In that case, we will acquire token interactively instead.

              if (!(tokenResponse.accessToken.length === 0)) {
                _context2.next = 12;
                break;
              }

              console.log(ErrorMessages.TOKEN_NOT_FOUND);
              throw new InteractionRequiredAuthError(ErrorMessages.INTERACTION_REQUIRED);

            case 12:
              req.session[resourceName].accessToken = tokenResponse.accessToken;
              next();
              _context2.next = 19;
              break;

            case 16:
              _context2.prev = 16;
              _context2.t0 = _context2["catch"](3);

              // in case there are no cached tokens, initiate an interactive call
              if (_context2.t0 instanceof InteractionRequiredAuthError) {
                state = _this.cryptoProvider.base64Encode(JSON.stringify({
                  stage: AppStages.ACQUIRE_TOKEN,
                  path: req.route.path,
                  nonce: req.session.nonce
                }));
                params = {
                  authority: _this.msalConfig.auth.authority,
                  scopes: scopes,
                  state: state,
                  redirect: _this.appSettings.settings.redirectUri,
                  account: req.session.account
                }; // initiate the first leg of auth code grant to get token

                _this.getAuthCode(req, res, next, params);
              }

            case 19:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, null, [[3, 16]]);
    }));

    return function (_x4, _x5, _x6) {
      return _ref2.apply(this, arguments);
    };
  }(); // ============== GUARD ===============

  /**
   * Check if authenticated in session
   * @param {Object} req: express request object
   * @param {Object} res: express response object
   * @param {Function} next: express next
   */


  this.isAuthenticated = function (req, res, next) {
    if (req.session) {
      if (!req.session.isAuthenticated) {
        return res.status(401).send(ErrorMessages.NOT_PERMITTED);
      }

      next();
    } else {
      res.status(401).send(ErrorMessages.NOT_PERMITTED);
    }
  };
  /**
   * Receives access token in req authorization header
   * and validates it using the jwt.verify
   * @param {Object} req: express request object
   * @param {Object} res: express response object
   * @param {Function} next: express next
   */


  this.isAuthorized = /*#__PURE__*/function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3(req, res, next) {
      var accessToken;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              accessToken = req.headers.authorization.split(' ')[1];

              if (!req.headers.authorization) {
                _context3.next = 9;
                break;
              }

              _context3.next = 4;
              return _this.tokenValidator.validateAccessToken(accessToken, req.route.path);

            case 4:
              if (_context3.sent) {
                _context3.next = 6;
                break;
              }

              return _context3.abrupt("return", res.status(401).send(ErrorMessages.NOT_PERMITTED));

            case 6:
              next();
              _context3.next = 10;
              break;

            case 9:
              res.status(401).send(ErrorMessages.NOT_PERMITTED);

            case 10:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x7, _x8, _x9) {
      return _ref3.apply(this, arguments);
    };
  }(); // ============== UTILS ===============

  /**
   * This method is used to generate an auth code request
   * @param {Object} req: express request object
   * @param {Object} res: express response object
   * @param {NextFunction} next: express next function
   * @param {AuthCodeParams} params: modifies auth code request url
   */


  this.getAuthCode = /*#__PURE__*/function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee4(req, res, next, params) {
      var response;
      return runtime_1.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              // prepare the request
              req.session.authCodeRequest.authority = params.authority;
              req.session.authCodeRequest.scopes = params.scopes;
              req.session.authCodeRequest.state = params.state;
              req.session.authCodeRequest.redirectUri = params.redirect;
              req.session.authCodeRequest.prompt = params.prompt;
              req.session.authCodeRequest.account = params.account;
              req.session.tokenRequest.authority = params.authority; // request an authorization code to exchange for tokens

              _context4.prev = 7;
              _context4.next = 10;
              return _this.msalClient.getAuthCodeUrl(req.session.authCodeRequest);

            case 10:
              response = _context4.sent;
              res.redirect(response);
              _context4.next = 18;
              break;

            case 14:
              _context4.prev = 14;
              _context4.t0 = _context4["catch"](7);
              console.log(_context4.t0);
              res.status(500).send(_context4.t0);

            case 18:
            case "end":
              return _context4.stop();
          }
        }
      }, _callee4, null, [[7, 14]]);
    }));

    return function (_x10, _x11, _x12, _x13) {
      return _ref4.apply(this, arguments);
    };
  }();
  /**
   * Util method to get the resource name for a given callingPageRoute (appSettings.json)
   * @param {string} path: /path string that the resource is associated with
   */


  this.getResourceName = function (path) {
    var index = Object.values(_this.appSettings.resources).findIndex(function (resource) {
      return resource.callingPageRoute === path;
    });
    var resourceName = Object.keys(_this.appSettings.resources)[index];
    return resourceName;
  };

  ConfigurationUtils.validateAppSettings(appSettings);
  this.cryptoProvider = new CryptoProvider();
  this.appSettings = appSettings;
  this.msalConfig = ConfigurationUtils.getMsalConfiguration(appSettings, cache);
  this.tokenValidator = new TokenValidator(this.appSettings, this.msalConfig);
  this.msalClient = new ConfidentialClientApplication(this.msalConfig);
};

export { AuthProvider, ConfigurationUtils, TokenValidator };
//# sourceMappingURL=msal-express-wrapper.esm.js.map
