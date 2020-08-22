// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var define;
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
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
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
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
        context.arg = undefined;
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

          next.value = undefined;
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
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
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
          context.arg = undefined;
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
        this.arg = undefined;
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
  typeof module === "object" ? module.exports : {}
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

},{}],"../node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"../node_modules/regenerator-runtime/runtime.js"}],"../node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
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

module.exports = _asyncToGenerator;
},{}],"../node_modules/@babel/runtime/helpers/arrayWithHoles.js":[function(require,module,exports) {
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

module.exports = _arrayWithHoles;
},{}],"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js":[function(require,module,exports) {
function _iterableToArrayLimit(arr, i) {
  if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

module.exports = _iterableToArrayLimit;
},{}],"../node_modules/@babel/runtime/helpers/arrayLikeToArray.js":[function(require,module,exports) {
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) {
    arr2[i] = arr[i];
  }

  return arr2;
}

module.exports = _arrayLikeToArray;
},{}],"../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js":[function(require,module,exports) {
var arrayLikeToArray = require("./arrayLikeToArray");

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return arrayLikeToArray(o, minLen);
}

module.exports = _unsupportedIterableToArray;
},{"./arrayLikeToArray":"../node_modules/@babel/runtime/helpers/arrayLikeToArray.js"}],"../node_modules/@babel/runtime/helpers/nonIterableRest.js":[function(require,module,exports) {
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

module.exports = _nonIterableRest;
},{}],"../node_modules/@babel/runtime/helpers/slicedToArray.js":[function(require,module,exports) {
var arrayWithHoles = require("./arrayWithHoles");

var iterableToArrayLimit = require("./iterableToArrayLimit");

var unsupportedIterableToArray = require("./unsupportedIterableToArray");

var nonIterableRest = require("./nonIterableRest");

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || unsupportedIterableToArray(arr, i) || nonIterableRest();
}

module.exports = _slicedToArray;
},{"./arrayWithHoles":"../node_modules/@babel/runtime/helpers/arrayWithHoles.js","./iterableToArrayLimit":"../node_modules/@babel/runtime/helpers/iterableToArrayLimit.js","./unsupportedIterableToArray":"../node_modules/@babel/runtime/helpers/unsupportedIterableToArray.js","./nonIterableRest":"../node_modules/@babel/runtime/helpers/nonIterableRest.js"}],"js/random.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shuffleArray = shuffleArray;

/* randomize elements in array using Knuth Shuffle */
function shuffleArray(arr) {
  if (arr == null) throw 'randomize() given null input!';
  if (!Array.isArray(arr)) throw 'randomize() given non-array input!';

  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * i);
    var temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
}
},{}],"js/util.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sleep = sleep;
exports.exchange = exchange;
exports.toggleInputs = toggleInputs;
exports.generateDefaultStateArray = generateDefaultStateArray;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _random = require("./random.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
/* swap two array elements and update their states */


function exchange(_x, _x2, _x3, _x4) {
  return _exchange.apply(this, arguments);
}
/* enable/disable input fields to prevent change during sorting */


function _exchange() {
  _exchange = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(arr, i, j, algorithm) {
    var swap;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            algorithm.states[i] = 'being exchanged';
            algorithm.states[j] = 'being exchanged';
            _context.next = 4;
            return sleep(algorithm.delay);

          case 4:
            swap = arr[i];
            arr[i] = arr[j];
            arr[j] = swap;
            algorithm.info.swaps++;
            algorithm.states[i] = 'being sorted';
            algorithm.states[j] = 'being sorted';
            algorithm.info.updateStats();

          case 11:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _exchange.apply(this, arguments);
}

function toggleInputs(toggle) {
  if (toggle) {
    $('input').prop('disabled', false);
    $('button').prop('disabled', false);
    $('select').prop('disabled', false);
  } else {
    $('input').prop('disabled', true);
    $('button').prop('disabled', true);
    $('select').prop('disabled', true);
  }
}
/* initialize array to be sorted and shuffles values */


function generateDefaultStateArray(size) {
  var values = new Array(size);
  var states = new Array(size);

  for (var i = 0; i < values.length; i++) {
    values[i] = i;
    states[i] = 'default';
  }

  (0, _random.shuffleArray)(values);
  return [values, states];
}
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","./random.js":"js/random.js"}],"js/inputs/sliders.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSliderInfoFields = updateSliderInfoFields;
exports.getItemCount = getItemCount;
exports.getDelay = getDelay;

var _index = require("../../index.js");

/* sliders */
var ITEM_COUNT_SLIDER = $('#itemCountSlider');
var DELAY_SLIDER = $('#delaySlider');

function getItemCount() {
  return parseInt(ITEM_COUNT_SLIDER.attr('value'));
}

function getDelay() {
  return DELAY_SLIDER.attr('value');
}
/* render slider values to appropriate text fields */


function updateSliderInfoFields() {
  $('#alg-items').text(ITEM_COUNT_SLIDER.attr('value'));
  $('#alg-delay').text(DELAY_SLIDER.attr('value'));
}
/* update text/bars/values when item count slider used */


ITEM_COUNT_SLIDER.on('input', function () {
  $("#slide-itemCount").text(this.value);
  this.setAttribute('value', this.value);
  (0, _index.updateValuesAndStates)();
  (0, _index.setBarWidth)();
});
/* update delay when delay slider used */

DELAY_SLIDER.on('input', function () {
  $("#slide-delay").text(this.value);
  this.setAttribute('value', this.value);
});
},{"../../index.js":"index.js"}],"../node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"../node_modules/@babel/runtime/helpers/createClass.js":[function(require,module,exports) {
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

module.exports = _createClass;
},{}],"js/algorithms/sortingProgram.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortingProgram = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SortingProgram = /*#__PURE__*/function () {
  function SortingProgram(toSort) {
    (0, _classCallCheck2.default)(this, SortingProgram);
    this.toSort = toSort;
  }
  /* sorts items based on given sorting instance's sort() method */


  (0, _createClass2.default)(SortingProgram, [{
    key: "runSort",
    value: function () {
      var _runSort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(sortingStrategy) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt("return", sortingStrategy.sort(this.toSort));

              case 1:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function runSort(_x) {
        return _runSort.apply(this, arguments);
      }

      return runSort;
    }()
  }]);
  return SortingProgram;
}();

exports.SortingProgram = SortingProgram;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js"}],"../node_modules/@babel/runtime/helpers/getPrototypeOf.js":[function(require,module,exports) {
function _getPrototypeOf(o) {
  module.exports = _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

module.exports = _getPrototypeOf;
},{}],"../node_modules/@babel/runtime/helpers/superPropBase.js":[function(require,module,exports) {
var getPrototypeOf = require("./getPrototypeOf");

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = getPrototypeOf(object);
    if (object === null) break;
  }

  return object;
}

module.exports = _superPropBase;
},{"./getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js"}],"../node_modules/@babel/runtime/helpers/get.js":[function(require,module,exports) {
var superPropBase = require("./superPropBase");

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    module.exports = _get = Reflect.get;
  } else {
    module.exports = _get = function _get(target, property, receiver) {
      var base = superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);

      if (desc.get) {
        return desc.get.call(receiver);
      }

      return desc.value;
    };
  }

  return _get(target, property, receiver || target);
}

module.exports = _get;
},{"./superPropBase":"../node_modules/@babel/runtime/helpers/superPropBase.js"}],"../node_modules/@babel/runtime/helpers/setPrototypeOf.js":[function(require,module,exports) {
function _setPrototypeOf(o, p) {
  module.exports = _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

module.exports = _setPrototypeOf;
},{}],"../node_modules/@babel/runtime/helpers/inherits.js":[function(require,module,exports) {
var setPrototypeOf = require("./setPrototypeOf");

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) setPrototypeOf(subClass, superClass);
}

module.exports = _inherits;
},{"./setPrototypeOf":"../node_modules/@babel/runtime/helpers/setPrototypeOf.js"}],"../node_modules/@babel/runtime/helpers/typeof.js":[function(require,module,exports) {
function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

module.exports = _typeof;
},{}],"../node_modules/@babel/runtime/helpers/assertThisInitialized.js":[function(require,module,exports) {
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

module.exports = _assertThisInitialized;
},{}],"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js":[function(require,module,exports) {
var _typeof = require("../helpers/typeof");

var assertThisInitialized = require("./assertThisInitialized");

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }

  return assertThisInitialized(self);
}

module.exports = _possibleConstructorReturn;
},{"../helpers/typeof":"../node_modules/@babel/runtime/helpers/typeof.js","./assertThisInitialized":"../node_modules/@babel/runtime/helpers/assertThisInitialized.js"}],"js/algorithms/algorithmStats.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AlgorithmStats = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _sliders = require("../inputs/sliders.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AlgorithmStats = /*#__PURE__*/function () {
  function AlgorithmStats(algInfo) {
    (0, _classCallCheck2.default)(this, AlgorithmStats);
    this.updateInfoFields(algInfo);
  }

  (0, _createClass2.default)(AlgorithmStats, [{
    key: "updateInfoFields",
    value: function updateInfoFields(algInfo) {
      $('#alg-name').text(algInfo.name);
      $('#alg-about').text(algInfo.about);
      $('#alg-best').text(algInfo.best);
      $('#alg-avg').text(algInfo.avg);
      $('#alg-worst').text(algInfo.worst);
      $('#alg-place').text(algInfo.inPlace);
      $('#alg-stable').text(algInfo.stable);
    }
  }, {
    key: "updateStats",
    value: function updateStats() {
      (0, _sliders.updateSliderInfoFields)();
      $("#alg-compares").text(this.compares);
      $("#alg-swaps").text(this.swaps);
    }
  }, {
    key: "refresh",
    value: function refresh() {
      this.compares = 0;
      this.swaps = 0;
      this.startTime = performance.now();
    }
  }, {
    key: "calculateRuntime",
    value: function calculateRuntime() {
      this.endTime = performance.now();
      this.runtime = this.endTime - this.startTime;
      $("#alg-runtime").text(Math.floor(this.runtime) + "ms");
    }
  }]);
  return AlgorithmStats;
}();

exports.AlgorithmStats = AlgorithmStats;
},{"@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","../inputs/sliders.js":"js/inputs/sliders.js"}],"js/algorithms/sortingAlgorithm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SortingAlgorithm = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _algorithmStats = require("./algorithmStats.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SortingAlgorithm = /*#__PURE__*/function () {
  function SortingAlgorithm() {
    (0, _classCallCheck2.default)(this, SortingAlgorithm);
    this.info = new _algorithmStats.AlgorithmStats(this.getDescriptions());
  }

  (0, _createClass2.default)(SortingAlgorithm, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                this.info.refresh();
                this.states = toSort.states;
                this.delay = toSort.delay;

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {};
    }
  }]);
  return SortingAlgorithm;
}();

exports.SortingAlgorithm = SortingAlgorithm;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","./algorithmStats.js":"js/algorithms/algorithmStats.js"}],"js/algorithms/quickSort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.QuickSort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _util = require("../util.js");

var _algorithmStats = require("./algorithmStats.js");

var _sortingAlgorithm = require("./sortingAlgorithm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var QuickSort = /*#__PURE__*/function (_SortingAlgorithm) {
  (0, _inherits2.default)(QuickSort, _SortingAlgorithm);

  var _super = _createSuper(QuickSort);

  function QuickSort() {
    (0, _classCallCheck2.default)(this, QuickSort);
    return _super.call(this);
  }

  (0, _createClass2.default)(QuickSort, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(QuickSort.prototype), "sort", this).call(this, toSort);
                _context.next = 3;
                return this.qsort(toSort.arr, 0, toSort.arr.length - 1);

              case 3:
                this.info.calculateRuntime();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {
        name: 'Quick Sort',
        about: "By partitioning around a 'pivot' element, quick sort efficiently places items in their correct location. It almost guarantees fast performance by introducing randomness. In this implementation, the partition is chosen as a median of 3 values to improve performance further. For even greater optimization, insertion sort can be applied when dealing with small subproblems.",
        best: 'n log n',
        avg: '2 n log n',
        worst: '1/2 n^2',
        inPlace: 'yes',
        stable: 'no'
      };
    }
  }, {
    key: "qsort",
    value: function () {
      var _qsort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr, lo, hi) {
        var n, m, j;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(hi <= lo)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                n = hi - lo + 1;
                m = this.median3(arr, lo, lo + n / 2, hi);
                _context2.next = 6;
                return (0, _util.exchange)(arr, m, lo, this);

              case 6:
                _context2.next = 8;
                return this.partition(arr, lo, hi);

              case 8:
                j = _context2.sent;
                _context2.next = 11;
                return this.qsort(arr, lo, j - 1);

              case 11:
                _context2.next = 13;
                return this.qsort(arr, j + 1, hi);

              case 13:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function qsort(_x2, _x3, _x4) {
        return _qsort.apply(this, arguments);
      }

      return qsort;
    }()
    /* find median of 3 elements in given array */

  }, {
    key: "median3",
    value: function median3(arr, i, j, k) {
      var res;

      if (arr[i] < arr[j]) {
        this.info.compares++;

        if (arr[j] < arr[k]) {
          this.info.compares++;
          res = j;
        } else if (arr[i] < arr[k]) {
          this.info.compares++;
          res = k;
        } else {
          res = i;
        }
      } else {
        this.info.compares++;

        if (arr[k] < arr[j]) {
          this.info.compares++;
          res = j;
        } else if (arr[k] < arr[i]) {
          this.info.compares++;
          res = k;
        } else {
          res = i;
        }
      }

      return res; // concise representation of logic. Not used due to inability to count compares.
      // (arr[i] < arr[j] ?
      // (arr[j] < arr[k] ? j : arr[i] < arr[k] ? k : i) :
      // (arr[k] < arr[j] ? j : arr[k] < arr[i] ? k : i));
    }
  }, {
    key: "partition",
    value: function () {
      var _partition = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(arr, lo, hi) {
        var i, j, v;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                i = lo;
                j = hi + 1;
                v = arr[lo]; // partition value

                this.states.fill('being sorted', lo, hi);
                this.states[lo] = 'pivot';

              case 5:
                if (!true) {
                  _context3.next = 24;
                  break;
                }

              case 6:
                if (!(arr[++i] < v)) {
                  _context3.next = 12;
                  break;
                }

                this.info.compares++;

                if (!(i == hi)) {
                  _context3.next = 10;
                  break;
                }

                return _context3.abrupt("break", 12);

              case 10:
                _context3.next = 6;
                break;

              case 12:
                if (!(v < arr[--j])) {
                  _context3.next = 18;
                  break;
                }

                this.info.compares++;

                if (!(j == lo)) {
                  _context3.next = 16;
                  break;
                }

                return _context3.abrupt("break", 18);

              case 16:
                _context3.next = 12;
                break;

              case 18:
                if (!(i >= j)) {
                  _context3.next = 20;
                  break;
                }

                return _context3.abrupt("break", 24);

              case 20:
                _context3.next = 22;
                return (0, _util.exchange)(arr, i, j, this);

              case 22:
                _context3.next = 5;
                break;

              case 24:
                _context3.next = 26;
                return (0, _util.exchange)(arr, lo, j, this);

              case 26:
                this.states.fill('default', lo, hi + 1); // partition final index

                return _context3.abrupt("return", j);

              case 28:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function partition(_x5, _x6, _x7) {
        return _partition.apply(this, arguments);
      }

      return partition;
    }()
  }]);
  return QuickSort;
}(_sortingAlgorithm.SortingAlgorithm);

exports.QuickSort = QuickSort;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/get":"../node_modules/@babel/runtime/helpers/get.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","../util.js":"js/util.js","./algorithmStats.js":"js/algorithms/algorithmStats.js","./sortingAlgorithm.js":"js/algorithms/sortingAlgorithm.js"}],"js/algorithms/bubbleSort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BubbleSort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _util = require("../util.js");

var _sortingAlgorithm = require("./sortingAlgorithm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var BubbleSort = /*#__PURE__*/function (_SortingAlgorithm) {
  (0, _inherits2.default)(BubbleSort, _SortingAlgorithm);

  var _super = _createSuper(BubbleSort);

  function BubbleSort() {
    (0, _classCallCheck2.default)(this, BubbleSort);
    return _super.call(this);
  }

  (0, _createClass2.default)(BubbleSort, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(BubbleSort.prototype), "sort", this).call(this, toSort);
                _context.next = 3;
                return this.bsort(toSort.arr);

              case 3:
                this.info.calculateRuntime();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {
        name: 'Bubble Sort',
        about: "Often used as a teaching tool, bubble sort is very slow. It sorts a given array by comparing neighboring elements and 'bubbling' the larger element up towards the final position. Even with some optimizations, this still lacks efficiency and is not often used in practice.",
        best: 'n',
        avg: '1/2 n^2',
        worst: '1/2 n^2',
        inPlace: 'yes',
        stable: 'yes'
      };
    }
  }, {
    key: "bsort",
    value: function () {
      var _bsort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr) {
        var n, sortedAfterIndex, i;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                n = arr.length;
                this.states.fill('being sorted');

              case 2:
                if (!(n > 1)) {
                  _context2.next = 18;
                  break;
                }

                sortedAfterIndex = 0;
                i = 1;

              case 5:
                if (!(i < n)) {
                  _context2.next = 14;
                  break;
                }

                if (!(arr[i - 1] > arr[i])) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 9;
                return (0, _util.exchange)(arr, i - 1, i, this);

              case 9:
                this.info.compares++;
                sortedAfterIndex = i;

              case 11:
                i++;
                _context2.next = 5;
                break;

              case 14:
                this.states[sortedAfterIndex] = 'default';
                n = sortedAfterIndex;
                _context2.next = 2;
                break;

              case 18:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function bsort(_x2) {
        return _bsort.apply(this, arguments);
      }

      return bsort;
    }()
  }]);
  return BubbleSort;
}(_sortingAlgorithm.SortingAlgorithm);

exports.BubbleSort = BubbleSort;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/get":"../node_modules/@babel/runtime/helpers/get.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","../util.js":"js/util.js","./sortingAlgorithm.js":"js/algorithms/sortingAlgorithm.js"}],"js/algorithms/selectionSort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SelectionSort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _util = require("../util.js");

var _sortingAlgorithm = require("./sortingAlgorithm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var SelectionSort = /*#__PURE__*/function (_SortingAlgorithm) {
  (0, _inherits2.default)(SelectionSort, _SortingAlgorithm);

  var _super = _createSuper(SelectionSort);

  function SelectionSort() {
    (0, _classCallCheck2.default)(this, SelectionSort);
    return _super.call(this);
  }

  (0, _createClass2.default)(SelectionSort, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(SelectionSort.prototype), "sort", this).call(this, toSort);
                _context.next = 3;
                return this.ssort(toSort.arr);

              case 3:
                this.info.calculateRuntime();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {
        name: 'Selection Sort',
        about: "One of the simplest sorting methods, selection sort scans the array for the smallest item and places it in position one. It then moves up one position and repeats itself. While not impressively efficient, selection sort guarantees one swap per array entry, so it can be useful in cases where swapping is expensive.",
        best: '1/2 n^2',
        avg: '1/2 n^2',
        worst: '1/2 n^2',
        inPlace: 'yes',
        stable: 'no'
      };
    }
  }, {
    key: "ssort",
    value: function () {
      var _ssort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr) {
        var n, i, _i, min, j;

        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                n = arr.length;

                for (i = 0; i < n; i++) {
                  this.states[i] = 'being sorted';
                }

                _i = 0;

              case 3:
                if (!(_i < n)) {
                  _context2.next = 12;
                  break;
                }

                min = _i;

                for (j = _i + 1; j < n; j++) {
                  if (arr[j] < arr[min]) min = j;
                  this.info.compares++;
                }

                _context2.next = 8;
                return (0, _util.exchange)(arr, _i, min, this);

              case 8:
                this.states[_i] = 'default';

              case 9:
                _i++;
                _context2.next = 3;
                break;

              case 12:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function ssort(_x2) {
        return _ssort.apply(this, arguments);
      }

      return ssort;
    }()
  }]);
  return SelectionSort;
}(_sortingAlgorithm.SortingAlgorithm);

exports.SelectionSort = SelectionSort;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/get":"../node_modules/@babel/runtime/helpers/get.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","../util.js":"js/util.js","./sortingAlgorithm.js":"js/algorithms/sortingAlgorithm.js"}],"js/algorithms/insertionSort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.InsertionSort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _util = require("../util.js");

var _sortingAlgorithm = require("./sortingAlgorithm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var InsertionSort = /*#__PURE__*/function (_SortingAlgorithm) {
  (0, _inherits2.default)(InsertionSort, _SortingAlgorithm);

  var _super = _createSuper(InsertionSort);

  function InsertionSort() {
    (0, _classCallCheck2.default)(this, InsertionSort);
    return _super.call(this);
  }

  (0, _createClass2.default)(InsertionSort, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(InsertionSort.prototype), "sort", this).call(this, toSort);
                _context.next = 3;
                return this.isort(toSort.arr);

              case 3:
                this.info.calculateRuntime();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {
        name: 'Insertion Sort',
        about: "Insertion sort places items into their correct position relative to any items already processed. It is exceptionally good at sorting arrays with only a few items out of place. As such, it is often used to optimize small subproblems in other sorting methods.",
        best: 'n',
        avg: '1/4 n^2',
        worst: '1/2 n^2',
        inPlace: 'yes',
        stable: 'yes'
      };
    }
  }, {
    key: "isort",
    value: function () {
      var _isort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr) {
        var n, i, j;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                n = arr.length;
                i = 1;

              case 2:
                if (!(i < n)) {
                  _context2.next = 16;
                  break;
                }

                this.states[i] = 'being sorted';
                j = i;

              case 5:
                if (!(j > 0 && arr[j] < arr[j - 1])) {
                  _context2.next = 12;
                  break;
                }

                this.info.compares++;
                _context2.next = 9;
                return (0, _util.exchange)(arr, j, j - 1, this);

              case 9:
                j--;
                _context2.next = 5;
                break;

              case 12:
                this.info.compares++;

              case 13:
                i++;
                _context2.next = 2;
                break;

              case 16:
                this.states.fill('default');

              case 17:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function isort(_x2) {
        return _isort.apply(this, arguments);
      }

      return isort;
    }()
  }]);
  return InsertionSort;
}(_sortingAlgorithm.SortingAlgorithm);

exports.InsertionSort = InsertionSort;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/get":"../node_modules/@babel/runtime/helpers/get.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","../util.js":"js/util.js","./sortingAlgorithm.js":"js/algorithms/sortingAlgorithm.js"}],"js/algorithms/shellSort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ShellSort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _util = require("../util.js");

var _sortingAlgorithm = require("./sortingAlgorithm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var ShellSort = /*#__PURE__*/function (_SortingAlgorithm) {
  (0, _inherits2.default)(ShellSort, _SortingAlgorithm);

  var _super = _createSuper(ShellSort);

  function ShellSort() {
    (0, _classCallCheck2.default)(this, ShellSort);
    return _super.call(this);
  }

  (0, _createClass2.default)(ShellSort, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(ShellSort.prototype), "sort", this).call(this, toSort);
                _context.next = 3;
                return this.ssort(toSort.arr);

              case 3:
                this.info.calculateRuntime();

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {
        name: 'Shell Sort',
        about: "Shell sort first compares items far apart and then reduces this gap with each successive loop. It requires fewer swaps on average and will reduce to insertion sort once the array is mostly sorted. Choosing an efficient set of swap gaps is a surprisingly tricky mathematical endeavor. The true time complexity of this algorithm remains unknown.",
        best: 'n log3 n',
        avg: 'n/a',
        worst: 'c n^3/2',
        inPlace: 'yes',
        stable: 'no'
      };
    }
  }, {
    key: "ssort",
    value: function () {
      var _ssort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr) {
        var n, h, i, j;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                n = arr.length;
                h = 1;

                while (h < n / 3) {
                  h = 3 * h + 1;
                } // initialize Knuth gap sequence


              case 3:
                if (!(h >= 1)) {
                  _context2.next = 23;
                  break;
                }

                i = h;

              case 5:
                if (!(i < n)) {
                  _context2.next = 19;
                  break;
                }

                this.states[i] = 'being sorted';
                j = i;

              case 8:
                if (!(j >= h && arr[j] < arr[j - h])) {
                  _context2.next = 15;
                  break;
                }

                this.info.compares++;
                _context2.next = 12;
                return (0, _util.exchange)(arr, j, j - h, this);

              case 12:
                j -= h;
                _context2.next = 8;
                break;

              case 15:
                this.info.compares++;

              case 16:
                i++;
                _context2.next = 5;
                break;

              case 19:
                this.states.fill('default');
                h = Math.floor(h / 3);
                _context2.next = 3;
                break;

              case 23:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function ssort(_x2) {
        return _ssort.apply(this, arguments);
      }

      return ssort;
    }()
  }]);
  return ShellSort;
}(_sortingAlgorithm.SortingAlgorithm);

exports.ShellSort = ShellSort;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/get":"../node_modules/@babel/runtime/helpers/get.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","../util.js":"js/util.js","./sortingAlgorithm.js":"js/algorithms/sortingAlgorithm.js"}],"js/algorithms/mergeSort.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MergeSort = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _get2 = _interopRequireDefault(require("@babel/runtime/helpers/get"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _util = require("../util.js");

var _sortingAlgorithm = require("./sortingAlgorithm.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = (0, _getPrototypeOf2.default)(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = (0, _getPrototypeOf2.default)(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return (0, _possibleConstructorReturn2.default)(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

var MergeSort = /*#__PURE__*/function (_SortingAlgorithm) {
  (0, _inherits2.default)(MergeSort, _SortingAlgorithm);

  var _super = _createSuper(MergeSort);

  function MergeSort() {
    (0, _classCallCheck2.default)(this, MergeSort);
    return _super.call(this);
  }

  (0, _createClass2.default)(MergeSort, [{
    key: "sort",
    value: function () {
      var _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(toSort) {
        var aux;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                (0, _get2.default)((0, _getPrototypeOf2.default)(MergeSort.prototype), "sort", this).call(this, toSort);
                aux = new Array(toSort.arr.length);
                _context.next = 4;
                return this.msort(toSort.arr, aux, 0, toSort.arr.length - 1);

              case 4:
                this.info.calculateRuntime();

              case 5:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function sort(_x) {
        return _sort.apply(this, arguments);
      }

      return sort;
    }()
  }, {
    key: "getDescriptions",
    value: function getDescriptions() {
      return {
        name: 'Merge Sort',
        about: "Merge sort is a classic example of divide and conquer. It works by dividing the array into a set of tiny subarrays and merging them together. This way, it avoids doing excess work by tackling small problems instead of larger problems. Many optimizations exist, but here I have only avoided unneeded merging by utilizing an extra comparison.",
        best: '1/2 n log n',
        avg: 'n log n',
        worst: 'n log n',
        inPlace: 'no',
        stable: 'yes'
      };
    }
  }, {
    key: "msort",
    value: function () {
      var _msort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(arr, aux, lo, hi) {
        var mid;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(hi <= lo)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                mid = Math.floor(lo + (hi - lo) / 2);
                _context2.next = 5;
                return this.msort(arr, aux, lo, mid);

              case 5:
                _context2.next = 7;
                return this.msort(arr, aux, mid + 1, hi);

              case 7:
                if (!(!arr[mid] <= arr[mid + 1])) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 10;
                return this.merge(arr, aux, lo, mid, hi);

              case 10:
                // check if sorted before attempting merge
                this.info.compares++;

              case 11:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function msort(_x2, _x3, _x4, _x5) {
        return _msort.apply(this, arguments);
      }

      return msort;
    }()
  }, {
    key: "merge",
    value: function () {
      var _merge = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee3(arr, aux, lo, mid, hi) {
        var k, i, j, _k, _k2;

        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                for (k = lo; k <= hi; k++) {
                  this.states[k] = 'being sorted';
                  aux[k] = arr[k];
                }

                i = lo;
                j = mid + 1;
                _k = lo;

              case 4:
                if (!(_k <= hi)) {
                  _context3.next = 48;
                  break;
                }

                if (!(i > mid)) {
                  _context3.next = 15;
                  break;
                }

                this.states[_k] = 'being exchanged';
                this.states[j] = 'being exchanged';
                arr[_k] = aux[j];
                _context3.next = 11;
                return (0, _util.sleep)(this.info.sleepDelay);

              case 11:
                this.states[_k] = 'being sorted';
                this.states[j++] = 'being sorted';
                _context3.next = 43;
                break;

              case 15:
                if (!(j > hi)) {
                  _context3.next = 25;
                  break;
                }

                this.states[_k] = 'being exchanged';
                this.states[i] = 'being exchanged';
                arr[_k] = aux[i];
                _context3.next = 21;
                return (0, _util.sleep)(this.info.sleepDelay);

              case 21:
                this.states[_k] = 'being sorted';
                this.states[i++] = 'being sorted';
                _context3.next = 43;
                break;

              case 25:
                if (!(aux[j] < aux[i])) {
                  _context3.next = 36;
                  break;
                }

                this.states[_k] = 'being exchanged';
                this.states[j] = 'being exchanged';
                arr[_k] = aux[j];
                this.info.compares++;
                _context3.next = 32;
                return (0, _util.sleep)(this.info.sleepDelay);

              case 32:
                this.states[_k] = 'being sorted';
                this.states[j++] = 'being sorted';
                _context3.next = 43;
                break;

              case 36:
                this.states[_k] = 'being exchanged';
                this.states[i] = 'being exchanged';
                arr[_k] = aux[i];
                _context3.next = 41;
                return (0, _util.sleep)(this.info.sleepDelay);

              case 41:
                this.states[_k] = 'being sorted';
                this.states[i++] = 'being sorted';

              case 43:
                this.info.swaps++;
                this.info.updateStats();

              case 45:
                _k++;
                _context3.next = 4;
                break;

              case 48:
                for (_k2 = lo; _k2 <= hi; _k2++) {
                  this.states[_k2] = 'default';
                }

              case 49:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function merge(_x6, _x7, _x8, _x9, _x10) {
        return _merge.apply(this, arguments);
      }

      return merge;
    }()
  }]);
  return MergeSort;
}(_sortingAlgorithm.SortingAlgorithm);

exports.MergeSort = MergeSort;
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"../node_modules/@babel/runtime/helpers/classCallCheck.js","@babel/runtime/helpers/createClass":"../node_modules/@babel/runtime/helpers/createClass.js","@babel/runtime/helpers/get":"../node_modules/@babel/runtime/helpers/get.js","@babel/runtime/helpers/inherits":"../node_modules/@babel/runtime/helpers/inherits.js","@babel/runtime/helpers/possibleConstructorReturn":"../node_modules/@babel/runtime/helpers/possibleConstructorReturn.js","@babel/runtime/helpers/getPrototypeOf":"../node_modules/@babel/runtime/helpers/getPrototypeOf.js","../util.js":"js/util.js","./sortingAlgorithm.js":"js/algorithms/sortingAlgorithm.js"}],"js/algorithms/exports.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "SortingProgram", {
  enumerable: true,
  get: function () {
    return _sortingProgram.SortingProgram;
  }
});
Object.defineProperty(exports, "QuickSort", {
  enumerable: true,
  get: function () {
    return _quickSort.QuickSort;
  }
});
Object.defineProperty(exports, "BubbleSort", {
  enumerable: true,
  get: function () {
    return _bubbleSort.BubbleSort;
  }
});
Object.defineProperty(exports, "SelectionSort", {
  enumerable: true,
  get: function () {
    return _selectionSort.SelectionSort;
  }
});
Object.defineProperty(exports, "InsertionSort", {
  enumerable: true,
  get: function () {
    return _insertionSort.InsertionSort;
  }
});
Object.defineProperty(exports, "ShellSort", {
  enumerable: true,
  get: function () {
    return _shellSort.ShellSort;
  }
});
Object.defineProperty(exports, "MergeSort", {
  enumerable: true,
  get: function () {
    return _mergeSort.MergeSort;
  }
});

var _sortingProgram = require("./sortingProgram.js");

var _quickSort = require("./quickSort.js");

var _bubbleSort = require("./bubbleSort.js");

var _selectionSort = require("./selectionSort.js");

var _insertionSort = require("./insertionSort.js");

var _shellSort = require("./shellSort.js");

var _mergeSort = require("./mergeSort.js");
},{"./sortingProgram.js":"js/algorithms/sortingProgram.js","./quickSort.js":"js/algorithms/quickSort.js","./bubbleSort.js":"js/algorithms/bubbleSort.js","./selectionSort.js":"js/algorithms/selectionSort.js","./insertionSort.js":"js/algorithms/insertionSort.js","./shellSort.js":"js/algorithms/shellSort.js","./mergeSort.js":"js/algorithms/mergeSort.js"}],"js/inputs/buttons.js":[function(require,module,exports) {
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _util = require("../util.js");

var _random = require("../random.js");

var _index = require("../../index.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

$("#run").click( /*#__PURE__*/(0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          (0, _util.toggleInputs)(false);
          _context.next = 3;
          return (0, _index.sort)();

        case 3:
          (0, _util.toggleInputs)(true);

        case 4:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));
/* shuffles items in values array */

$("#shuffle-items").click(function () {
  (0, _random.shuffleArray)(_index.values);
});
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","../util.js":"js/util.js","../random.js":"js/random.js","../../index.js":"index.js"}],"js/inputs/selects.js":[function(require,module,exports) {
"use strict";

var _index = require("../../index.js");

var _exports = require("../algorithms/exports.js");

/* instantiate new sorting algorithm when chosen via dropdown */
$('#alg-select').on('change', function () {
  switch (this.value) {
    case 'quick':
      (0, _index.setSortingStrategy)(new _exports.QuickSort());
      break;

    case 'merge':
      (0, _index.setSortingStrategy)(new _exports.MergeSort());
      break;

    case 'bubble':
      (0, _index.setSortingStrategy)(new _exports.BubbleSort());
      break;

    case 'selection':
      (0, _index.setSortingStrategy)(new _exports.SelectionSort());
      break;

    case 'insertion':
      (0, _index.setSortingStrategy)(new _exports.InsertionSort());
      break;

    case 'shell':
      (0, _index.setSortingStrategy)(new _exports.ShellSort());
      break;

    default:
      break;
  }
});
},{"../../index.js":"index.js","../algorithms/exports.js":"js/algorithms/exports.js"}],"../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"styles/styles.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"index.js":[function(require,module,exports) {
'use strict';
/* script imports */

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setBarWidth = setBarWidth;
exports.setSortingStrategy = setSortingStrategy;
exports.sort = sort;
exports.updateValuesAndStates = updateValuesAndStates;
exports.values = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _util = require("./js/util.js");

var _sliders = require("./js/inputs/sliders.js");

var _exports = require("./js/algorithms/exports.js");

require("./js/inputs/buttons.js");

require("./js/inputs/selects.js");

require("./styles/styles.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* style imports */

/* sizing values */
var width = $('#p5js').width();
var height = $('#p5js').height();
var barWidth; // dependent on number of bars & screen width

/* color values */

var BG_COLOR = [0, 0, 0];
var DEFAULT_BAR_COLOR = [170, 170, 170];
var BEING_SORTED_BAR_COLOR = [255, 255, 255];
var BEING_EXCHANGED_BAR_COLOR = [75, 255, 75];
var PIVOT_BAR_COLOR = [255, 50, 50];
/* array to be sorted */

var values = [];
exports.values = values;
var states = [];
/* algorithm managment */

var sortingProgram = new _exports.SortingProgram(values, states, (0, _sliders.getDelay)());
var sortingStrategy = new _exports.QuickSort();

var sketch = function sketch(p) {
  /* called once when program starts to initialize p5js environment */
  p.setup = function () {
    var renderer = p.createCanvas(width, height);
    renderer.parent('p5js');
    (0, _sliders.updateSliderInfoFields)();
    updateValuesAndStates();
    setBarWidth();
    (0, _util.toggleInputs)(true);
  };
  /* called continuously to render visuals to parent container */


  p.draw = function () {
    p.background(BG_COLOR);

    for (var i = 0; i < values.length; i++) {
      drawBarWithState(i);
    }
  };
  /* render single bar to correct screen location with correct color */


  function drawBarWithState(i) {
    if (states[i] == 'default') {
      p.fill(DEFAULT_BAR_COLOR);
    } else if (states[i] == 'pivot') {
      p.fill(PIVOT_BAR_COLOR);
    } else if (states[i] == 'being exchanged') {
      p.fill(BEING_EXCHANGED_BAR_COLOR);
    } else if (states[i] == 'being sorted') {
      p.fill(BEING_SORTED_BAR_COLOR);
    }

    p.rect(i * barWidth, height - values[i] - 2, barWidth, values[i] + 2);
  }

  p.windowResized = function () {
    width = $('#p5js').width();
    height = $('#p5js').height();
    p.resizeCanvas(width, height);
    setBarWidth();
  };
};
/* instance mode for p5js */


new p5(sketch, 'p5js');

function updateValuesAndStates() {
  var _generateDefaultState = (0, _util.generateDefaultStateArray)((0, _sliders.getItemCount)());

  var _generateDefaultState2 = (0, _slicedToArray2.default)(_generateDefaultState, 2);

  exports.values = values = _generateDefaultState2[0];
  states = _generateDefaultState2[1];
}

function setBarWidth() {
  barWidth = width / (0, _sliders.getItemCount)();
}

function setSortingStrategy(strategy) {
  sortingStrategy = strategy;
}
/* sort values based on currently selected sorting algorithm */


function sort() {
  return _sort.apply(this, arguments);
}

function _sort() {
  _sort = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee() {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            sortingProgram = new _exports.SortingProgram({
              arr: values,
              states: states,
              delay: (0, _sliders.getDelay)()
            });
            $("#alg-runtime").text("running...");
            _context.next = 4;
            return sortingProgram.runSort(sortingStrategy);

          case 4:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _sort.apply(this, arguments);
}
},{"@babel/runtime/regenerator":"../node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"../node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/slicedToArray":"../node_modules/@babel/runtime/helpers/slicedToArray.js","./js/util.js":"js/util.js","./js/inputs/sliders.js":"js/inputs/sliders.js","./js/algorithms/exports.js":"js/algorithms/exports.js","./js/inputs/buttons.js":"js/inputs/buttons.js","./js/inputs/selects.js":"js/inputs/selects.js","./styles/styles.css":"styles/styles.css"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63594" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/src.e31bb0bc.js.map