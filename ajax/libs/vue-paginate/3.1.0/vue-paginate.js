/**
 * vue-paginate v3.1.0
 * (c) 2016 Taha Shashtari
 * @license MIT
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VuePaginate = factory());
}(this, function () { 'use strict';

  var warn = function () {}
  var formatComponentName

  var hasConsole = typeof console !== 'undefined'

  warn = function (msg, vm, type) {
    if ( type === void 0 ) type = 'error';

    if (hasConsole) {
      console[type]("[vue-paginate]: " + msg + " " + (
        vm ? formatLocation(formatComponentName(vm)) : ''
        ))
    }
  }

  formatComponentName = function (vm) {
    if (vm.$root === vm) {
      return 'root instance'
    }
    var name = vm._isVue
    ? vm.$options.name || vm.$options._componentTag
    : vm.name
    return (
      (name ? ("component <" + name + ">") : "anonymous component") +
      (vm._isVue && vm.$options.__file ? (" at " + (vm.$options.__file)) : '')
      )
  }

  var formatLocation = function (str) {
    if (str === 'anonymous component') {
      str += " - use the \"name\" option for better debugging messages."
    }
    return ("\n(found in " + str + ")")
  }

  var Paginate = {
    name: 'paginate',
    props: {
      name: {
        type: String,
        required: true
      },
      list: {
        type: Array,
        required: true
      },
      per: {
        type: Number,
        default: 3,
        validator: function validator (value) {
          return value > 0
        }
      },
      tag: {
        type: String,
        default: 'ul'
      },
      class: {
        type: String
      }
    },
    data: function data () {
      return {}
    },
    computed: {
      currentPage: {
        get: function get () {
          if (this.$parent.paginate[this.name]) {
            return this.$parent.paginate[this.name].page
          }
        },
        set: function set (page) {
          this.$parent.paginate[this.name].page = page
        }
      }
    },
    mounted: function mounted () {
      if (this.per <= 0) {
        warn(("<paginate name=\"" + (this.name) + "\"> 'per' prop can't be 0 or less."), this.$parent)
      }
      if (!this.$parent.paginate[this.name]) {
        warn(("'" + (this.name) + "' is not registered in 'paginate' array."), this.$parent)
        return
      }
      this.paginateList()
    },
    watch: {
      currentPage: function currentPage () {
        this.paginateList()
      },
      list: function list () {
        // On list change, refresh the paginated list
        this.currentPage = 0
        this.paginateList()
      },
      per: function per () {
        this.currentPage = 0
        this.paginateList()
      }
    },
    methods: {
      paginateList: function paginateList () {
        var index = this.currentPage * this.per
        var paginatedList = this.list.slice(index, index + this.per)
        this.$parent.paginate[this.name].list = paginatedList
      }
    },
    render: function render (h) {
      var className = this.class ? this.class : ''
      return h(this.tag, { class: className }, this.$slots.default)
    }
  }

  /*  */

  /**
   * Convert a value to a string that is actually rendered.
   */
  function _toString (val) {
    return val == null
      ? ''
      : typeof val === 'object'
        ? JSON.stringify(val, null, 2)
        : String(val)
  }

  /**
   * Convert a input value to a number for persistence.
   * If the conversion fails, return original string.
   */
  function toNumber (val) {
    var n = parseFloat(val, 10);
    return (n || n === 0) ? n : val
  }

  /**
   * Make a map and return a function for checking if a key
   * is in that map.
   */
  function makeMap (
    str,
    expectsLowerCase
  ) {
    var map = Object.create(null);
    var list = str.split(',');
    for (var i = 0; i < list.length; i++) {
      map[list[i]] = true;
    }
    return expectsLowerCase
      ? function (val) { return map[val.toLowerCase()]; }
      : function (val) { return map[val]; }
  }

  /**
   * Check if a tag is a built-in tag.
   */
  var isBuiltInTag = makeMap('slot,component', true);

  /**
   * Remove an item from an array
   */
  function remove$1 (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  /**
   * Check whether the object has the property.
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  /**
   * Check if value is primitive
   */
  function isPrimitive (value) {
    return typeof value === 'string' || typeof value === 'number'
  }

  /**
   * Create a cached version of a pure function.
   */
  function cached (fn) {
    var cache = Object.create(null);
    return function cachedFn (str) {
      var hit = cache[str];
      return hit || (cache[str] = fn(str))
    }
  }

  /**
   * Camelize a hyphen-delmited string.
   */
  var camelizeRE = /-(\w)/g;
  var camelize = cached(function (str) {
    return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
  });

  /**
   * Capitalize a string.
   */
  var capitalize = cached(function (str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  });

  /**
   * Hyphenate a camelCase string.
   */
  var hyphenateRE = /([^-])([A-Z])/g;
  var hyphenate = cached(function (str) {
    return str
      .replace(hyphenateRE, '$1-$2')
      .replace(hyphenateRE, '$1-$2')
      .toLowerCase()
  });

  /**
   * Simple bind, faster than native
   */
  function bind$1 (fn, ctx) {
    function boundFn (a) {
      var l = arguments.length;
      return l
        ? l > 1
          ? fn.apply(ctx, arguments)
          : fn.call(ctx, a)
        : fn.call(ctx)
    }
    // record original fn length
    boundFn._length = fn.length;
    return boundFn
  }

  /**
   * Convert an Array-like object to a real Array.
   */
  function toArray (list, start) {
    start = start || 0;
    var i = list.length - start;
    var ret = new Array(i);
    while (i--) {
      ret[i] = list[i + start];
    }
    return ret
  }

  /**
   * Mix properties into target object.
   */
  function extend (to, _from) {
    for (var key in _from) {
      to[key] = _from[key];
    }
    return to
  }

  /**
   * Quick object check - this is primarily used to tell
   * Objects from primitive values when we know the value
   * is a JSON-compliant type.
   */
  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  /**
   * Strict object type check. Only returns true
   * for plain JavaScript objects.
   */
  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';
  function isPlainObject (obj) {
    return toString.call(obj) === OBJECT_STRING
  }

  /**
   * Merge an Array of Objects into a single Object.
   */
  function toObject (arr) {
    var res = {};
    for (var i = 0; i < arr.length; i++) {
      if (arr[i]) {
        extend(res, arr[i]);
      }
    }
    return res
  }

  /**
   * Perform no operation.
   */
  function noop () {}

  /**
   * Always return false.
   */
  var no = function () { return false; };

  /**
   * Generate a static keys string from compiler modules.
   */
  function genStaticKeys (modules) {
    return modules.reduce(function (keys, m) {
      return keys.concat(m.staticKeys || [])
    }, []).join(',')
  }

  /**
   * Check if two values are loosely equal - that is,
   * if they are plain objects, do they have the same shape?
   */
  function looseEqual (a, b) {
    /* eslint-disable eqeqeq */
    return a == b || (
      isObject(a) && isObject(b)
        ? JSON.stringify(a) === JSON.stringify(b)
        : false
    )
    /* eslint-enable eqeqeq */
  }

  function looseIndexOf (arr, val) {
    for (var i = 0; i < arr.length; i++) {
      if (looseEqual(arr[i], val)) { return i }
    }
    return -1
  }

  /*  */

  var config = {
    /**
     * Option merge strategies (used in core/util/options)
     */
    optionMergeStrategies: Object.create(null),

    /**
     * Whether to suppress warnings.
     */
    silent: false,

    /**
     * Whether to enable devtools
     */
    devtools: "production" !== 'production',

    /**
     * Error handler for watcher errors
     */
    errorHandler: null,

    /**
     * Ignore certain custom elements
     */
    ignoredElements: null,

    /**
     * Custom user key aliases for v-on
     */
    keyCodes: Object.create(null),

    /**
     * Check if a tag is reserved so that it cannot be registered as a
     * component. This is platform-dependent and may be overwritten.
     */
    isReservedTag: no,

    /**
     * Check if a tag is an unknown element.
     * Platform-dependent.
     */
    isUnknownElement: no,

    /**
     * Get the namespace of an element
     */
    getTagNamespace: noop,

    /**
     * Check if an attribute must be bound using property, e.g. value
     * Platform-dependent.
     */
    mustUseProp: no,

    /**
     * List of asset types that a component can own.
     */
    _assetTypes: [
      'component',
      'directive',
      'filter'
    ],

    /**
     * List of lifecycle hooks.
     */
    _lifecycleHooks: [
      'beforeCreate',
      'created',
      'beforeMount',
      'mounted',
      'beforeUpdate',
      'updated',
      'beforeDestroy',
      'destroyed',
      'activated',
      'deactivated'
    ],

    /**
     * Max circular updates allowed in a scheduler flush cycle.
     */
    _maxUpdateCount: 100,

    /**
     * Server rendering?
     */
    _isServer: "development" === 'server'
  };

  /*  */

  /**
   * Check if a string starts with $ or _
   */
  function isReserved (str) {
    var c = (str + '').charCodeAt(0);
    return c === 0x24 || c === 0x5F
  }

  /**
   * Define a property.
   */
  function def (obj, key, val, enumerable) {
    Object.defineProperty(obj, key, {
      value: val,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    });
  }

  /**
   * Parse simple path.
   */
  var bailRE = /[^\w.$]/;
  function parsePath (path) {
    if (bailRE.test(path)) {
      return
    } else {
      var segments = path.split('.');
      return function (obj) {
        for (var i = 0; i < segments.length; i++) {
          if (!obj) { return }
          obj = obj[segments[i]];
        }
        return obj
      }
    }
  }

  /*  */
  /* globals MutationObserver */

  // can we use __proto__?
  var hasProto = '__proto__' in {};

  // Browser environment sniffing
  var inBrowser =
    typeof window !== 'undefined' &&
    Object.prototype.toString.call(window) !== '[object Object]';

  var UA = inBrowser && window.navigator.userAgent.toLowerCase();
  var isIE = UA && /msie|trident/.test(UA);
  var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
  var isEdge = UA && UA.indexOf('edge/') > 0;
  var isAndroid = UA && UA.indexOf('android') > 0;
  var isIOS = UA && /iphone|ipad|ipod|ios/.test(UA);

  // detect devtools
  var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

  /* istanbul ignore next */
  function isNative (Ctor) {
    return /native code/.test(Ctor.toString())
  }

  /**
   * Defer a task to execute it asynchronously.
   */
  var nextTick = (function () {
    var callbacks = [];
    var pending = false;
    var timerFunc;

    function nextTickHandler () {
      pending = false;
      var copies = callbacks.slice(0);
      callbacks.length = 0;
      for (var i = 0; i < copies.length; i++) {
        copies[i]();
      }
    }

    // the nextTick behavior leverages the microtask queue, which can be accessed
    // via either native Promise.then or MutationObserver.
    // MutationObserver has wider support, however it is seriously bugged in
    // UIWebView in iOS >= 9.3.3 when triggered in touch event handlers. It
    // completely stops working after triggering a few times... so, if native
    // Promise is available, we will use it:
    /* istanbul ignore if */
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      var p = Promise.resolve();
      timerFunc = function () {
        p.then(nextTickHandler);
        // in problematic UIWebViews, Promise.then doesn't completely break, but
        // it can get stuck in a weird state where callbacks are pushed into the
        // microtask queue but the queue isn't being flushed, until the browser
        // needs to do some other work, e.g. handle a timer. Therefore we can
        // "force" the microtask queue to be flushed by adding an empty timer.
        if (isIOS) { setTimeout(noop); }
      };
    } else if (typeof MutationObserver !== 'undefined' && (
      isNative(MutationObserver) ||
      // PhantomJS and iOS 7.x
      MutationObserver.toString() === '[object MutationObserverConstructor]'
    )) {
      // use MutationObserver where native Promise is not available,
      // e.g. PhantomJS IE11, iOS7, Android 4.4
      var counter = 1;
      var observer = new MutationObserver(nextTickHandler);
      var textNode = document.createTextNode(String(counter));
      observer.observe(textNode, {
        characterData: true
      });
      timerFunc = function () {
        counter = (counter + 1) % 2;
        textNode.data = String(counter);
      };
    } else {
      // fallback to setTimeout
      /* istanbul ignore next */
      timerFunc = function () {
        setTimeout(nextTickHandler, 0);
      };
    }

    return function queueNextTick (cb, ctx) {
      var func = ctx
        ? function () { cb.call(ctx); }
        : cb;
      callbacks.push(func);
      if (!pending) {
        pending = true;
        timerFunc();
      }
    }
  })();

  var _Set;
  /* istanbul ignore if */
  if (typeof Set !== 'undefined' && isNative(Set)) {
    // use native Set when available.
    _Set = Set;
  } else {
    // a non-standard Set polyfill that only works with primitive keys.
    _Set = (function () {
      function Set () {
        this.set = Object.create(null);
      }
      Set.prototype.has = function has (key) {
        return this.set[key] !== undefined
      };
      Set.prototype.add = function add (key) {
        this.set[key] = 1;
      };
      Set.prototype.clear = function clear () {
        this.set = Object.create(null);
      };

      return Set;
    }());
  }

  /*  */


  var uid$2 = 0;

  /**
   * A dep is an observable that can have multiple
   * directives subscribing to it.
   */
  var Dep = function Dep () {
    this.id = uid$2++;
    this.subs = [];
  };

  Dep.prototype.addSub = function addSub (sub) {
    this.subs.push(sub);
  };

  Dep.prototype.removeSub = function removeSub (sub) {
    remove$1(this.subs, sub);
  };

  Dep.prototype.depend = function depend () {
    if (Dep.target) {
      Dep.target.addDep(this);
    }
  };

  Dep.prototype.notify = function notify () {
    // stablize the subscriber list first
    var subs = this.subs.slice();
    for (var i = 0, l = subs.length; i < l; i++) {
      subs[i].update();
    }
  };

  // the current target watcher being evaluated.
  // this is globally unique because there could be only one
  // watcher being evaluated at any time.
  Dep.target = null;
  var targetStack = [];

  function pushTarget (_target) {
    if (Dep.target) { targetStack.push(Dep.target); }
    Dep.target = _target;
  }

  function popTarget () {
    Dep.target = targetStack.pop();
  }

  /*  */


  var queue = [];
  var has$1 = {};
  var waiting = false;
  var flushing = false;
  var index = 0;

  /**
   * Reset the scheduler's state.
   */
  function resetSchedulerState () {
    queue.length = 0;
    has$1 = {};
    if ("production" !== 'production') {}
    waiting = flushing = false;
  }

  /**
   * Flush both queues and run the watchers.
   */
  function flushSchedulerQueue () {
    flushing = true;

    // Sort queue before flush.
    // This ensures that:
    // 1. Components are updated from parent to child. (because parent is always
    //    created before the child)
    // 2. A component's user watchers are run before its render watcher (because
    //    user watchers are created before the render watcher)
    // 3. If a component is destroyed during a parent component's watcher run,
    //    its watchers can be skipped.
    queue.sort(function (a, b) { return a.id - b.id; });

    // do not cache length because more watchers might be pushed
    // as we run existing watchers
    for (index = 0; index < queue.length; index++) {
      var watcher = queue[index];
      var id = watcher.id;
      has$1[id] = null;
      watcher.run();
      // in dev build, check and stop circular updates.
      if ("production" !== 'production' && has$1[id] != null) {}
    }

    // devtool hook
    /* istanbul ignore if */
    if (devtools && config.devtools) {
      devtools.emit('flush');
    }

    resetSchedulerState();
  }

  /**
   * Push a watcher into the watcher queue.
   * Jobs with duplicate IDs will be skipped unless it's
   * pushed when the queue is being flushed.
   */
  function queueWatcher (watcher) {
    var id = watcher.id;
    if (has$1[id] == null) {
      has$1[id] = true;
      if (!flushing) {
        queue.push(watcher);
      } else {
        // if already flushing, splice the watcher based on its id
        // if already past its id, it will be run next immediately.
        var i = queue.length - 1;
        while (i >= 0 && queue[i].id > watcher.id) {
          i--;
        }
        queue.splice(Math.max(i, index) + 1, 0, watcher);
      }
      // queue the flush
      if (!waiting) {
        waiting = true;
        nextTick(flushSchedulerQueue);
      }
    }
  }

  /*  */

  var uid$1 = 0;

  /**
   * A watcher parses an expression, collects dependencies,
   * and fires callback when the expression value changes.
   * This is used for both the $watch() api and directives.
   */
  var Watcher = function Watcher (
    vm,
    expOrFn,
    cb,
    options
  ) {
    if ( options === void 0 ) { options = {}; }

    this.vm = vm;
    vm._watchers.push(this);
    // options
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
    this.expression = expOrFn.toString();
    this.cb = cb;
    this.id = ++uid$1; // uid for batching
    this.active = true;
    this.dirty = this.lazy; // for lazy watchers
    this.deps = [];
    this.newDeps = [];
    this.depIds = new _Set();
    this.newDepIds = new _Set();
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    } else {
      this.getter = parsePath(expOrFn);
      if (!this.getter) {
        this.getter = function () {};
        "production" !== 'production' && warn$1(
          "Failed watching path: \"" + expOrFn + "\" " +
          'Watcher only accepts simple dot-delimited paths. ' +
          'For full control, use a function instead.',
          vm
        );
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get();
  };

  /**
   * Evaluate the getter, and re-collect dependencies.
   */
  Watcher.prototype.get = function get () {
    pushTarget(this);
    var value = this.getter.call(this.vm, this.vm);
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
    return value
  };

  /**
   * Add a dependency to this directive.
   */
  Watcher.prototype.addDep = function addDep (dep) {
    var id = dep.id;
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id);
      this.newDeps.push(dep);
      if (!this.depIds.has(id)) {
        dep.addSub(this);
      }
    }
  };

  /**
   * Clean up for dependency collection.
   */
  Watcher.prototype.cleanupDeps = function cleanupDeps () {
      var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      var dep = this$1.deps[i];
      if (!this$1.newDepIds.has(dep.id)) {
        dep.removeSub(this$1);
      }
    }
    var tmp = this.depIds;
    this.depIds = this.newDepIds;
    this.newDepIds = tmp;
    this.newDepIds.clear();
    tmp = this.deps;
    this.deps = this.newDeps;
    this.newDeps = tmp;
    this.newDeps.length = 0;
  };

  /**
   * Subscriber interface.
   * Will be called when a dependency changes.
   */
  Watcher.prototype.update = function update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true;
    } else if (this.sync) {
      this.run();
    } else {
      queueWatcher(this);
    }
  };

  /**
   * Scheduler job interface.
   * Will be called by the scheduler.
   */
  Watcher.prototype.run = function run () {
    if (this.active) {
      var value = this.get();
        if (
          value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        var oldValue = this.value;
        this.value = value;
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue);
          } catch (e) {
            "production" !== 'production' && warn$1(
              ("Error in watcher \"" + (this.expression) + "\""),
              this.vm
            );
            /* istanbul ignore else */
            if (config.errorHandler) {
              config.errorHandler.call(null, e, this.vm);
            } else {
              throw e
            }
          }
        } else {
          this.cb.call(this.vm, value, oldValue);
        }
      }
    }
  };

  /**
   * Evaluate the value of the watcher.
   * This only gets called for lazy watchers.
   */
  Watcher.prototype.evaluate = function evaluate () {
    this.value = this.get();
    this.dirty = false;
  };

  /**
   * Depend on all deps collected by this watcher.
   */
  Watcher.prototype.depend = function depend () {
      var this$1 = this;

    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].depend();
    }
  };

  /**
   * Remove self from all dependencies' subscriber list.
   */
  Watcher.prototype.teardown = function teardown () {
      var this$1 = this;

    if (this.active) {
      // remove self from vm's watcher list
      // this is a somewhat expensive operation so we skip it
      // if the vm is being destroyed or is performing a v-for
      // re-render (the watcher list is then filtered by v-for).
      if (!this.vm._isBeingDestroyed && !this.vm._vForRemoving) {
        remove$1(this.vm._watchers, this);
      }
      var i = this.deps.length;
      while (i--) {
        this$1.deps[i].removeSub(this$1);
      }
      this.active = false;
    }
  };

  /**
   * Recursively traverse an object to evoke all converted
   * getters, so that every nested property inside the object
   * is collected as a "deep" dependency.
   */
  var seenObjects = new _Set();
  function traverse (val) {
    seenObjects.clear();
    _traverse(val, seenObjects);
  }

  function _traverse (val, seen) {
    var i, keys;
    var isA = Array.isArray(val);
    if ((!isA && !isObject(val)) || !Object.isExtensible(val)) {
      return
    }
    if (val.__ob__) {
      var depId = val.__ob__.dep.id;
      if (seen.has(depId)) {
        return
      }
      seen.add(depId);
    }
    if (isA) {
      i = val.length;
      while (i--) { _traverse(val[i], seen); }
    } else {
      keys = Object.keys(val);
      i = keys.length;
      while (i--) { _traverse(val[keys[i]], seen); }
    }
  }

  /*
   * not type checking this file because flow doesn't play well with
   * dynamically accessing methods on Array prototype
   */

  var arrayProto = Array.prototype;
  var arrayMethods = Object.create(arrayProto);[
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
  ]
  .forEach(function (method) {
    // cache original method
    var original = arrayProto[method];
    def(arrayMethods, method, function mutator () {
      var arguments$1 = arguments;

      // avoid leaking arguments:
      // http://jsperf.com/closure-with-arguments
      var i = arguments.length;
      var args = new Array(i);
      while (i--) {
        args[i] = arguments$1[i];
      }
      var result = original.apply(this, args);
      var ob = this.__ob__;
      var inserted;
      switch (method) {
        case 'push':
          inserted = args;
          break
        case 'unshift':
          inserted = args;
          break
        case 'splice':
          inserted = args.slice(2);
          break
      }
      if (inserted) { ob.observeArray(inserted); }
      // notify change
      ob.dep.notify();
      return result
    });
  });

  /*  */

  var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

  /**
   * By default, when a reactive property is set, the new value is
   * also converted to become reactive. However when passing down props,
   * we don't want to force conversion because the value may be a nested value
   * under a frozen data structure. Converting it would defeat the optimization.
   */
  var observerState = {
    shouldConvert: true,
    isSettingProps: false
  };

  /**
   * Observer class that are attached to each observed
   * object. Once attached, the observer converts target
   * object's property keys into getter/setters that
   * collect dependencies and dispatches updates.
   */
  var Observer = function Observer (value) {
    this.value = value;
    this.dep = new Dep();
    this.vmCount = 0;
    def(value, '__ob__', this);
    if (Array.isArray(value)) {
      var augment = hasProto
        ? protoAugment
        : copyAugment;
      augment(value, arrayMethods, arrayKeys);
      this.observeArray(value);
    } else {
      this.walk(value);
    }
  };

  /**
   * Walk through each property and convert them into
   * getter/setters. This method should only be called when
   * value type is Object.
   */
  Observer.prototype.walk = function walk (obj) {
    var keys = Object.keys(obj);
    for (var i = 0; i < keys.length; i++) {
      defineReactive$$1(obj, keys[i], obj[keys[i]]);
    }
  };

  /**
   * Observe a list of Array items.
   */
  Observer.prototype.observeArray = function observeArray (items) {
    for (var i = 0, l = items.length; i < l; i++) {
      observe(items[i]);
    }
  };

  // helpers

  /**
   * Augment an target Object or Array by intercepting
   * the prototype chain using __proto__
   */
  function protoAugment (target, src) {
    /* eslint-disable no-proto */
    target.__proto__ = src;
    /* eslint-enable no-proto */
  }

  /**
   * Augment an target Object or Array by defining
   * hidden properties.
   *
   * istanbul ignore next
   */
  function copyAugment (target, src, keys) {
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      def(target, key, src[key]);
    }
  }

  /**
   * Attempt to create an observer instance for a value,
   * returns the new observer if successfully observed,
   * or the existing observer if the value already has one.
   */
  function observe (value) {
    if (!isObject(value)) {
      return
    }
    var ob;
    if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
      ob = value.__ob__;
    } else if (
      observerState.shouldConvert &&
      !config._isServer &&
      (Array.isArray(value) || isPlainObject(value)) &&
      Object.isExtensible(value) &&
      !value._isVue
    ) {
      ob = new Observer(value);
    }
    return ob
  }

  /**
   * Define a reactive property on an Object.
   */
  function defineReactive$$1 (
    obj,
    key,
    val,
    customSetter
  ) {
    var dep = new Dep();

    var property = Object.getOwnPropertyDescriptor(obj, key);
    if (property && property.configurable === false) {
      return
    }

    // cater for pre-defined getter/setters
    var getter = property && property.get;
    var setter = property && property.set;

    var childOb = observe(val);
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get: function reactiveGetter () {
        var value = getter ? getter.call(obj) : val;
        if (Dep.target) {
          dep.depend();
          if (childOb) {
            childOb.dep.depend();
          }
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
        return value
      },
      set: function reactiveSetter (newVal) {
        var value = getter ? getter.call(obj) : val;
        if (newVal === value) {
          return
        }
        if ("production" !== 'production' && customSetter) {}
        if (setter) {
          setter.call(obj, newVal);
        } else {
          val = newVal;
        }
        childOb = observe(newVal);
        dep.notify();
      }
    });
  }

  /**
   * Set a property on an object. Adds the new property and
   * triggers change notification if the property doesn't
   * already exist.
   */
  function set (obj, key, val) {
    if (Array.isArray(obj)) {
      obj.length = Math.max(obj.length, key);
      obj.splice(key, 1, val);
      return val
    }
    if (hasOwn(obj, key)) {
      obj[key] = val;
      return
    }
    var ob = obj.__ob__;
    if (obj._isVue || (ob && ob.vmCount)) {
      "production" !== 'production' && warn$1(
        'Avoid adding reactive properties to a Vue instance or its root $data ' +
        'at runtime - declare it upfront in the data option.'
      );
      return
    }
    if (!ob) {
      obj[key] = val;
      return
    }
    defineReactive$$1(ob.value, key, val);
    ob.dep.notify();
    return val
  }

  /**
   * Delete a property and trigger change if necessary.
   */
  function del (obj, key) {
    var ob = obj.__ob__;
    if (obj._isVue || (ob && ob.vmCount)) {
      "production" !== 'production' && warn$1(
        'Avoid deleting properties on a Vue instance or its root $data ' +
        '- just set it to null.'
      );
      return
    }
    if (!hasOwn(obj, key)) {
      return
    }
    delete obj[key];
    if (!ob) {
      return
    }
    ob.dep.notify();
  }

  /**
   * Collect dependencies on array elements when the array is touched, since
   * we cannot intercept array element access like property getters.
   */
  function dependArray (value) {
    for (var e = void 0, i = 0, l = value.length; i < l; i++) {
      e = value[i];
      e && e.__ob__ && e.__ob__.dep.depend();
      if (Array.isArray(e)) {
        dependArray(e);
      }
    }
  }

  /*  */

  function initState (vm) {
    vm._watchers = [];
    initProps(vm);
    initData(vm);
    initComputed(vm);
    initMethods(vm);
    initWatch(vm);
  }

  function initProps (vm) {
    var props = vm.$options.props;
    if (props) {
      var propsData = vm.$options.propsData || {};
      var keys = vm.$options._propKeys = Object.keys(props);
      var isRoot = !vm.$parent;
      // root instance props should be converted
      observerState.shouldConvert = isRoot;
      var loop = function ( i ) {
        var key = keys[i];
        /* istanbul ignore else */
        if ("production" !== 'production') {} else {
          defineReactive$$1(vm, key, validateProp(key, props, propsData, vm));
        }
      };

      for (var i = 0; i < keys.length; i++) { loop( i ); }
      observerState.shouldConvert = true;
    }
  }

  function initData (vm) {
    var data = vm.$options.data;
    data = vm._data = typeof data === 'function'
      ? data.call(vm)
      : data || {};
    if (!isPlainObject(data)) {
      data = {};
      "production" !== 'production' && warn$1(
        'data functions should return an object.',
        vm
      );
    }
    // proxy data on instance
    var keys = Object.keys(data);
    var props = vm.$options.props;
    var i = keys.length;
    while (i--) {
      if (props && hasOwn(props, keys[i])) {
        "production" !== 'production' && warn$1(
          "The data property \"" + (keys[i]) + "\" is already declared as a prop. " +
          "Use prop default value instead.",
          vm
        );
      } else {
        proxy(vm, keys[i]);
      }
    }
    // observe data
    observe(data);
    data.__ob__ && data.__ob__.vmCount++;
  }

  var computedSharedDefinition = {
    enumerable: true,
    configurable: true,
    get: noop,
    set: noop
  };

  function initComputed (vm) {
    var computed = vm.$options.computed;
    if (computed) {
      for (var key in computed) {
        var userDef = computed[key];
        if (typeof userDef === 'function') {
          computedSharedDefinition.get = makeComputedGetter(userDef, vm);
          computedSharedDefinition.set = noop;
        } else {
          computedSharedDefinition.get = userDef.get
            ? userDef.cache !== false
              ? makeComputedGetter(userDef.get, vm)
              : bind$1(userDef.get, vm)
            : noop;
          computedSharedDefinition.set = userDef.set
            ? bind$1(userDef.set, vm)
            : noop;
        }
        Object.defineProperty(vm, key, computedSharedDefinition);
      }
    }
  }

  function makeComputedGetter (getter, owner) {
    var watcher = new Watcher(owner, getter, noop, {
      lazy: true
    });
    return function computedGetter () {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }

  function initMethods (vm) {
    var methods = vm.$options.methods;
    if (methods) {
      for (var key in methods) {
        vm[key] = methods[key] == null ? noop : bind$1(methods[key], vm);
        if ("production" !== 'production') {}
      }
    }
  }

  function initWatch (vm) {
    var watch = vm.$options.watch;
    if (watch) {
      for (var key in watch) {
        var handler = watch[key];
        if (Array.isArray(handler)) {
          for (var i = 0; i < handler.length; i++) {
            createWatcher(vm, key, handler[i]);
          }
        } else {
          createWatcher(vm, key, handler);
        }
      }
    }
  }

  function createWatcher (vm, key, handler) {
    var options;
    if (isPlainObject(handler)) {
      options = handler;
      handler = handler.handler;
    }
    if (typeof handler === 'string') {
      handler = vm[handler];
    }
    vm.$watch(key, handler, options);
  }

  function stateMixin (Vue) {
    // flow somehow has problems with directly declared definition object
    // when using Object.defineProperty, so we have to procedurally build up
    // the object here.
    var dataDef = {};
    dataDef.get = function () {
      return this._data
    };
    if ("production" !== 'production') {}
    Object.defineProperty(Vue.prototype, '$data', dataDef);

    Vue.prototype.$set = set;
    Vue.prototype.$delete = del;

    Vue.prototype.$watch = function (
      expOrFn,
      cb,
      options
    ) {
      var vm = this;
      options = options || {};
      options.user = true;
      var watcher = new Watcher(vm, expOrFn, cb, options);
      if (options.immediate) {
        cb.call(vm, watcher.value);
      }
      return function unwatchFn () {
        watcher.teardown();
      }
    };
  }

  function proxy (vm, key) {
    if (!isReserved(key)) {
      Object.defineProperty(vm, key, {
        configurable: true,
        enumerable: true,
        get: function proxyGetter () {
          return vm._data[key]
        },
        set: function proxySetter (val) {
          vm._data[key] = val;
        }
      });
    }
  }

  /*  */

  var VNode = function VNode (
    tag,
    data,
    children,
    text,
    elm,
    ns,
    context,
    componentOptions
  ) {
    this.tag = tag;
    this.data = data;
    this.children = children;
    this.text = text;
    this.elm = elm;
    this.ns = ns;
    this.context = context;
    this.functionalContext = undefined;
    this.key = data && data.key;
    this.componentOptions = componentOptions;
    this.child = undefined;
    this.parent = undefined;
    this.raw = false;
    this.isStatic = false;
    this.isRootInsert = true;
    this.isComment = false;
    this.isCloned = false;
    this.isOnce = false;
  };

  var emptyVNode = function () {
    var node = new VNode();
    node.text = '';
    node.isComment = true;
    return node
  };

  // optimized shallow clone
  // used for static nodes and slot nodes because they may be reused across
  // multiple renders, cloning them avoids errors when DOM manipulations rely
  // on their elm reference.
  function cloneVNode (vnode) {
    var cloned = new VNode(
      vnode.tag,
      vnode.data,
      vnode.children,
      vnode.text,
      vnode.elm,
      vnode.ns,
      vnode.context,
      vnode.componentOptions
    );
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key;
    cloned.isCloned = true;
    return cloned
  }

  function cloneVNodes (vnodes) {
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneVNode(vnodes[i]);
    }
    return res
  }

  /*  */

  function mergeVNodeHook (def, hookKey, hook, key) {
    key = key + hookKey;
    var injectedHash = def.__injected || (def.__injected = {});
    if (!injectedHash[key]) {
      injectedHash[key] = true;
      var oldHook = def[hookKey];
      if (oldHook) {
        def[hookKey] = function () {
          oldHook.apply(this, arguments);
          hook.apply(this, arguments);
        };
      } else {
        def[hookKey] = hook;
      }
    }
  }

  /*  */

  function updateListeners (
    on,
    oldOn,
    add,
    remove$$1,
    vm
  ) {
    var name, cur, old, fn, event, capture;
    for (name in on) {
      cur = on[name];
      old = oldOn[name];
      if (!cur) {
        "production" !== 'production' && warn$1(
          "Invalid handler for event \"" + name + "\": got " + String(cur),
          vm
        );
      } else if (!old) {
        capture = name.charAt(0) === '!';
        event = capture ? name.slice(1) : name;
        if (Array.isArray(cur)) {
          add(event, (cur.invoker = arrInvoker(cur)), capture);
        } else {
          if (!cur.invoker) {
            fn = cur;
            cur = on[name] = {};
            cur.fn = fn;
            cur.invoker = fnInvoker(cur);
          }
          add(event, cur.invoker, capture);
        }
      } else if (cur !== old) {
        if (Array.isArray(old)) {
          old.length = cur.length;
          for (var i = 0; i < old.length; i++) { old[i] = cur[i]; }
          on[name] = old;
        } else {
          old.fn = cur;
          on[name] = old;
        }
      }
    }
    for (name in oldOn) {
      if (!on[name]) {
        event = name.charAt(0) === '!' ? name.slice(1) : name;
        remove$$1(event, oldOn[name].invoker);
      }
    }
  }

  function arrInvoker (arr) {
    return function (ev) {
      var arguments$1 = arguments;

      var single = arguments.length === 1;
      for (var i = 0; i < arr.length; i++) {
        single ? arr[i](ev) : arr[i].apply(null, arguments$1);
      }
    }
  }

  function fnInvoker (o) {
    return function (ev) {
      var single = arguments.length === 1;
      single ? o.fn(ev) : o.fn.apply(null, arguments);
    }
  }

  /*  */

  function normalizeChildren (
    children,
    ns,
    nestedIndex
  ) {
    if (isPrimitive(children)) {
      return [createTextVNode(children)]
    }
    if (Array.isArray(children)) {
      var res = [];
      for (var i = 0, l = children.length; i < l; i++) {
        var c = children[i];
        var last = res[res.length - 1];
        //  nested
        if (Array.isArray(c)) {
          res.push.apply(res, normalizeChildren(c, ns, ((nestedIndex || '') + "_" + i)));
        } else if (isPrimitive(c)) {
          if (last && last.text) {
            last.text += String(c);
          } else if (c !== '') {
            // convert primitive to vnode
            res.push(createTextVNode(c));
          }
        } else if (c instanceof VNode) {
          if (c.text && last && last.text) {
            last.text += c.text;
          } else {
            // inherit parent namespace
            if (ns) {
              applyNS(c, ns);
            }
            // default key for nested array children (likely generated by v-for)
            if (c.tag && c.key == null && nestedIndex != null) {
              c.key = "__vlist" + nestedIndex + "_" + i + "__";
            }
            res.push(c);
          }
        }
      }
      return res
    }
  }

  function createTextVNode (val) {
    return new VNode(undefined, undefined, undefined, String(val))
  }

  function applyNS (vnode, ns) {
    if (vnode.tag && !vnode.ns) {
      vnode.ns = ns;
      if (vnode.children) {
        for (var i = 0, l = vnode.children.length; i < l; i++) {
          applyNS(vnode.children[i], ns);
        }
      }
    }
  }

  /*  */

  function getFirstComponentChild (children) {
    return children && children.filter(function (c) { return c && c.componentOptions; })[0]
  }

  /*  */

  var activeInstance = null;

  function initLifecycle (vm) {
    var options = vm.$options;

    // locate first non-abstract parent
    var parent = options.parent;
    if (parent && !options.abstract) {
      while (parent.$options.abstract && parent.$parent) {
        parent = parent.$parent;
      }
      parent.$children.push(vm);
    }

    vm.$parent = parent;
    vm.$root = parent ? parent.$root : vm;

    vm.$children = [];
    vm.$refs = {};

    vm._watcher = null;
    vm._inactive = false;
    vm._isMounted = false;
    vm._isDestroyed = false;
    vm._isBeingDestroyed = false;
  }

  function lifecycleMixin (Vue) {
    Vue.prototype._mount = function (
      el,
      hydrating
    ) {
      var vm = this;
      vm.$el = el;
      if (!vm.$options.render) {
        vm.$options.render = emptyVNode;
        if ("production" !== 'production') {}
      }
      callHook(vm, 'beforeMount');
      vm._watcher = new Watcher(vm, function () {
        vm._update(vm._render(), hydrating);
      }, noop);
      hydrating = false;
      // manually mounted instance, call mounted on self
      // mounted is called for render-created child components in its inserted hook
      if (vm.$vnode == null) {
        vm._isMounted = true;
        callHook(vm, 'mounted');
      }
      return vm
    };

    Vue.prototype._update = function (vnode, hydrating) {
      var vm = this;
      if (vm._isMounted) {
        callHook(vm, 'beforeUpdate');
      }
      var prevEl = vm.$el;
      var prevActiveInstance = activeInstance;
      activeInstance = vm;
      var prevVnode = vm._vnode;
      vm._vnode = vnode;
      if (!prevVnode) {
        // Vue.prototype.__patch__ is injected in entry points
        // based on the rendering backend used.
        vm.$el = vm.__patch__(vm.$el, vnode, hydrating);
      } else {
        vm.$el = vm.__patch__(prevVnode, vnode);
      }
      activeInstance = prevActiveInstance;
      // update __vue__ reference
      if (prevEl) {
        prevEl.__vue__ = null;
      }
      if (vm.$el) {
        vm.$el.__vue__ = vm;
      }
      // if parent is an HOC, update its $el as well
      if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
        vm.$parent.$el = vm.$el;
      }
      if (vm._isMounted) {
        callHook(vm, 'updated');
      }
    };

    Vue.prototype._updateFromParent = function (
      propsData,
      listeners,
      parentVnode,
      renderChildren
    ) {
      var vm = this;
      var hasChildren = !!(vm.$options._renderChildren || renderChildren);
      vm.$options._parentVnode = parentVnode;
      vm.$options._renderChildren = renderChildren;
      // update props
      if (propsData && vm.$options.props) {
        observerState.shouldConvert = false;
        if ("production" !== 'production') {}
        var propKeys = vm.$options._propKeys || [];
        for (var i = 0; i < propKeys.length; i++) {
          var key = propKeys[i];
          vm[key] = validateProp(key, vm.$options.props, propsData, vm);
        }
        observerState.shouldConvert = true;
        if ("production" !== 'production') {}
        vm.$options.propsData = propsData;
      }
      // update listeners
      if (listeners) {
        var oldListeners = vm.$options._parentListeners;
        vm.$options._parentListeners = listeners;
        vm._updateListeners(listeners, oldListeners);
      }
      // resolve slots + force update if has children
      if (hasChildren) {
        vm.$slots = resolveSlots(renderChildren, vm._renderContext);
        vm.$forceUpdate();
      }
    };

    Vue.prototype.$forceUpdate = function () {
      var vm = this;
      if (vm._watcher) {
        vm._watcher.update();
      }
    };

    Vue.prototype.$destroy = function () {
      var vm = this;
      if (vm._isBeingDestroyed) {
        return
      }
      callHook(vm, 'beforeDestroy');
      vm._isBeingDestroyed = true;
      // remove self from parent
      var parent = vm.$parent;
      if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
        remove$1(parent.$children, vm);
      }
      // teardown watchers
      if (vm._watcher) {
        vm._watcher.teardown();
      }
      var i = vm._watchers.length;
      while (i--) {
        vm._watchers[i].teardown();
      }
      // remove reference from data ob
      // frozen object may not have observer.
      if (vm._data.__ob__) {
        vm._data.__ob__.vmCount--;
      }
      // call the last hook...
      vm._isDestroyed = true;
      callHook(vm, 'destroyed');
      // turn off all instance listeners.
      vm.$off();
      // remove __vue__ reference
      if (vm.$el) {
        vm.$el.__vue__ = null;
      }
      // invoke destroy hooks on current rendered tree
      vm.__patch__(vm._vnode, null);
    };
  }

  function callHook (vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      for (var i = 0, j = handlers.length; i < j; i++) {
        handlers[i].call(vm);
      }
    }
    vm.$emit('hook:' + hook);
  }

  /*  */

  var hooks = { init: init, prepatch: prepatch, insert: insert, destroy: destroy$1 };
  var hooksToMerge = Object.keys(hooks);

  function createComponent (
    Ctor,
    data,
    context,
    children,
    tag
  ) {
    if (!Ctor) {
      return
    }

    if (isObject(Ctor)) {
      Ctor = Vue$1.extend(Ctor);
    }

    if (typeof Ctor !== 'function') {
      if ("production" !== 'production') {}
      return
    }

    // resolve constructor options in case global mixins are applied after
    // component constructor creation
    resolveConstructorOptions(Ctor);

    // async component
    if (!Ctor.cid) {
      if (Ctor.resolved) {
        Ctor = Ctor.resolved;
      } else {
        Ctor = resolveAsyncComponent(Ctor, function () {
          // it's ok to queue this on every render because
          // $forceUpdate is buffered by the scheduler.
          context.$forceUpdate();
        });
        if (!Ctor) {
          // return nothing if this is indeed an async component
          // wait for the callback to trigger parent update.
          return
        }
      }
    }

    data = data || {};

    // extract props
    var propsData = extractProps(data, Ctor);

    // functional component
    if (Ctor.options.functional) {
      return createFunctionalComponent(Ctor, propsData, data, context, children)
    }

    // extract listeners, since these needs to be treated as
    // child component listeners instead of DOM listeners
    var listeners = data.on;
    // replace with listeners with .native modifier
    data.on = data.nativeOn;

    if (Ctor.options.abstract) {
      // abstract components do not keep anything
      // other than props & listeners
      data = {};
    }

    // merge component management hooks onto the placeholder node
    mergeHooks(data);

    // return a placeholder vnode
    var name = Ctor.options.name || tag;
    var vnode = new VNode(
      ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
      data, undefined, undefined, undefined, undefined, context,
      { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children }
    );
    return vnode
  }

  function createFunctionalComponent (
    Ctor,
    propsData,
    data,
    context,
    children
  ) {
    var props = {};
    var propOptions = Ctor.options.props;
    if (propOptions) {
      for (var key in propOptions) {
        props[key] = validateProp(key, propOptions, propsData);
      }
    }
    var vnode = Ctor.options.render.call(
      null,
      // ensure the createElement function in functional components
      // gets a unique context - this is necessary for correct named slot check
      bind$1(createElement, { _self: Object.create(context) }),
      {
        props: props,
        data: data,
        parent: context,
        children: normalizeChildren(children),
        slots: function () { return resolveSlots(children, context); }
      }
    );
    if (vnode instanceof VNode) {
      vnode.functionalContext = context;
      if (data.slot) {
        (vnode.data || (vnode.data = {})).slot = data.slot;
      }
    }
    return vnode
  }

  function createComponentInstanceForVnode (
    vnode, // we know it's MountedComponentVNode but flow doesn't
    parent // activeInstance in lifecycle state
  ) {
    var vnodeComponentOptions = vnode.componentOptions;
    var options = {
      _isComponent: true,
      parent: parent,
      propsData: vnodeComponentOptions.propsData,
      _componentTag: vnodeComponentOptions.tag,
      _parentVnode: vnode,
      _parentListeners: vnodeComponentOptions.listeners,
      _renderChildren: vnodeComponentOptions.children
    };
    // check inline-template render functions
    var inlineTemplate = vnode.data.inlineTemplate;
    if (inlineTemplate) {
      options.render = inlineTemplate.render;
      options.staticRenderFns = inlineTemplate.staticRenderFns;
    }
    return new vnodeComponentOptions.Ctor(options)
  }

  function init (vnode, hydrating) {
    if (!vnode.child || vnode.child._isDestroyed) {
      var child = vnode.child = createComponentInstanceForVnode(vnode, activeInstance);
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  }

  function prepatch (
    oldVnode,
    vnode
  ) {
    var options = vnode.componentOptions;
    var child = vnode.child = oldVnode.child;
    child._updateFromParent(
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  }

  function insert (vnode) {
    if (!vnode.child._isMounted) {
      vnode.child._isMounted = true;
      callHook(vnode.child, 'mounted');
    }
    if (vnode.data.keepAlive) {
      vnode.child._inactive = false;
      callHook(vnode.child, 'activated');
    }
  }

  function destroy$1 (vnode) {
    if (!vnode.child._isDestroyed) {
      if (!vnode.data.keepAlive) {
        vnode.child.$destroy();
      } else {
        vnode.child._inactive = true;
        callHook(vnode.child, 'deactivated');
      }
    }
  }

  function resolveAsyncComponent (
    factory,
    cb
  ) {
    if (factory.requested) {
      // pool callbacks
      factory.pendingCallbacks.push(cb);
    } else {
      factory.requested = true;
      var cbs = factory.pendingCallbacks = [cb];
      var sync = true;

      var resolve = function (res) {
        if (isObject(res)) {
          res = Vue$1.extend(res);
        }
        // cache resolved
        factory.resolved = res;
        // invoke callbacks only if this is not a synchronous resolve
        // (async resolves are shimmed as synchronous during SSR)
        if (!sync) {
          for (var i = 0, l = cbs.length; i < l; i++) {
            cbs[i](res);
          }
        }
      };

      var reject = function (reason) {
        "production" !== 'production' && warn$1(
          "Failed to resolve async component: " + (String(factory)) +
          (reason ? ("\nReason: " + reason) : '')
        );
      };

      var res = factory(resolve, reject);

      // handle promise
      if (res && typeof res.then === 'function' && !factory.resolved) {
        res.then(resolve, reject);
      }

      sync = false;
      // return in case resolved synchronously
      return factory.resolved
    }
  }

  function extractProps (data, Ctor) {
    // we are only extracting raw values here.
    // validation and default values are handled in the child
    // component itself.
    var propOptions = Ctor.options.props;
    if (!propOptions) {
      return
    }
    var res = {};
    var attrs = data.attrs;
    var props = data.props;
    var domProps = data.domProps;
    if (attrs || props || domProps) {
      for (var key in propOptions) {
        var altKey = hyphenate(key);
        checkProp(res, props, key, altKey, true) ||
        checkProp(res, attrs, key, altKey) ||
        checkProp(res, domProps, key, altKey);
      }
    }
    return res
  }

  function checkProp (
    res,
    hash,
    key,
    altKey,
    preserve
  ) {
    if (hash) {
      if (hasOwn(hash, key)) {
        res[key] = hash[key];
        if (!preserve) {
          delete hash[key];
        }
        return true
      } else if (hasOwn(hash, altKey)) {
        res[key] = hash[altKey];
        if (!preserve) {
          delete hash[altKey];
        }
        return true
      }
    }
    return false
  }

  function mergeHooks (data) {
    if (!data.hook) {
      data.hook = {};
    }
    for (var i = 0; i < hooksToMerge.length; i++) {
      var key = hooksToMerge[i];
      var fromParent = data.hook[key];
      var ours = hooks[key];
      data.hook[key] = fromParent ? mergeHook$1(ours, fromParent) : ours;
    }
  }

  function mergeHook$1 (a, b) {
    // since all hooks have at most two args, use fixed args
    // to avoid having to use fn.apply().
    return function (_, __) {
      a(_, __);
      b(_, __);
    }
  }

  /*  */

  // wrapper function for providing a more flexible interface
  // without getting yelled at by flow
  function createElement (
    tag,
    data,
    children
  ) {
    if (data && (Array.isArray(data) || typeof data !== 'object')) {
      children = data;
      data = undefined;
    }
    // make sure to use real instance instead of proxy as context
    return _createElement(this._self, tag, data, children)
  }

  function _createElement (
    context,
    tag,
    data,
    children
  ) {
    if (data && data.__ob__) {
      "production" !== 'production' && warn$1(
        "Avoid using observed data object as vnode data: " + (JSON.stringify(data)) + "\n" +
        'Always create fresh vnode data objects in each render!',
        context
      );
      return
    }
    if (!tag) {
      // in case of component :is set to falsy value
      return emptyVNode()
    }
    if (typeof tag === 'string') {
      var Ctor;
      var ns = config.getTagNamespace(tag);
      if (config.isReservedTag(tag)) {
        // platform built-in elements
        return new VNode(
          tag, data, normalizeChildren(children, ns),
          undefined, undefined, ns, context
        )
      } else if ((Ctor = resolveAsset(context.$options, 'components', tag))) {
        // component
        return createComponent(Ctor, data, context, children, tag)
      } else {
        // unknown or unlisted namespaced elements
        // check at runtime because it may get assigned a namespace when its
        // parent normalizes children
        var childNs = tag === 'foreignObject' ? 'xhtml' : ns;
        return new VNode(
          tag, data, normalizeChildren(children, childNs),
          undefined, undefined, ns, context
        )
      }
    } else {
      // direct component options / constructor
      return createComponent(tag, data, context, children)
    }
  }

  /*  */

  function initRender (vm) {
    vm.$vnode = null; // the placeholder node in parent tree
    vm._vnode = null; // the root of the child tree
    vm._staticTrees = null;
    vm._renderContext = vm.$options._parentVnode && vm.$options._parentVnode.context;
    vm.$slots = resolveSlots(vm.$options._renderChildren, vm._renderContext);
    // bind the public createElement fn to this instance
    // so that we get proper render context inside it.
    vm.$createElement = bind$1(createElement, vm);
    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  }

  function renderMixin (Vue) {
    Vue.prototype.$nextTick = function (fn) {
      nextTick(fn, this);
    };

    Vue.prototype._render = function () {
      var vm = this;
      var ref = vm.$options;
      var render = ref.render;
      var staticRenderFns = ref.staticRenderFns;
      var _parentVnode = ref._parentVnode;

      if (vm._isMounted) {
        // clone slot nodes on re-renders
        for (var key in vm.$slots) {
          vm.$slots[key] = cloneVNodes(vm.$slots[key]);
        }
      }

      if (staticRenderFns && !vm._staticTrees) {
        vm._staticTrees = [];
      }
      // set parent vnode. this allows render functions to have access
      // to the data on the placeholder node.
      vm.$vnode = _parentVnode;
      // render self
      var vnode;
      try {
        vnode = render.call(vm._renderProxy, vm.$createElement);
      } catch (e) {
        if ("production" !== 'production') {}
        /* istanbul ignore else */
        if (config.errorHandler) {
          config.errorHandler.call(null, e, vm);
        } else {
          if (config._isServer) {
            throw e
          } else {
            console.error(e);
          }
        }
        // return previous vnode to prevent render error causing blank component
        vnode = vm._vnode;
      }
      // return empty vnode in case the render function errored out
      if (!(vnode instanceof VNode)) {
        if ("production" !== 'production' && Array.isArray(vnode)) {}
        vnode = emptyVNode();
      }
      // set parent
      vnode.parent = _parentVnode;
      return vnode
    };

    // shorthands used in render functions
    Vue.prototype._h = createElement;
    // toString for mustaches
    Vue.prototype._s = _toString;
    // number conversion
    Vue.prototype._n = toNumber;
    // empty vnode
    Vue.prototype._e = emptyVNode;
    // loose equal
    Vue.prototype._q = looseEqual;
    // loose indexOf
    Vue.prototype._i = looseIndexOf;

    // render static tree by index
    Vue.prototype._m = function renderStatic (
      index,
      isInFor
    ) {
      var tree = this._staticTrees[index];
      // if has already-rendered static tree and not inside v-for,
      // we can reuse the same tree by doing a shallow clone.
      if (tree && !isInFor) {
        return Array.isArray(tree)
          ? cloneVNodes(tree)
          : cloneVNode(tree)
      }
      // otherwise, render a fresh tree.
      tree = this._staticTrees[index] = this.$options.staticRenderFns[index].call(this._renderProxy);
      markStatic(tree, ("__static__" + index), false);
      return tree
    };

    // mark node as static (v-once)
    Vue.prototype._o = function markOnce (
      tree,
      index,
      key
    ) {
      markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
      return tree
    };

    function markStatic (tree, key, isOnce) {
      if (Array.isArray(tree)) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i] && typeof tree[i] !== 'string') {
            markStaticNode(tree[i], (key + "_" + i), isOnce);
          }
        }
      } else {
        markStaticNode(tree, key, isOnce);
      }
    }

    function markStaticNode (node, key, isOnce) {
      node.isStatic = true;
      node.key = key;
      node.isOnce = isOnce;
    }

    // filter resolution helper
    var identity = function (_) { return _; };
    Vue.prototype._f = function resolveFilter (id) {
      return resolveAsset(this.$options, 'filters', id, true) || identity
    };

    // render v-for
    Vue.prototype._l = function renderList (
      val,
      render
    ) {
      var ret, i, l, keys, key;
      if (Array.isArray(val)) {
        ret = new Array(val.length);
        for (i = 0, l = val.length; i < l; i++) {
          ret[i] = render(val[i], i);
        }
      } else if (typeof val === 'number') {
        ret = new Array(val);
        for (i = 0; i < val; i++) {
          ret[i] = render(i + 1, i);
        }
      } else if (isObject(val)) {
        keys = Object.keys(val);
        ret = new Array(keys.length);
        for (i = 0, l = keys.length; i < l; i++) {
          key = keys[i];
          ret[i] = render(val[key], key, i);
        }
      }
      return ret
    };

    // renderSlot
    Vue.prototype._t = function (
      name,
      fallback
    ) {
      var slotNodes = this.$slots[name];
      // warn duplicate slot usage
      if (slotNodes && "production" !== 'production') {
        slotNodes._rendered && warn$1(
          "Duplicate presence of slot \"" + name + "\" found in the same render tree " +
          "- this will likely cause render errors.",
          this
        );
        slotNodes._rendered = true;
      }
      return slotNodes || fallback
    };

    // apply v-bind object
    Vue.prototype._b = function bindProps (
      data,
      value,
      asProp
    ) {
      if (value) {
        if (!isObject(value)) {
          "production" !== 'production' && warn$1(
            'v-bind without argument expects an Object or Array value',
            this
          );
        } else {
          if (Array.isArray(value)) {
            value = toObject(value);
          }
          for (var key in value) {
            if (key === 'class' || key === 'style') {
              data[key] = value[key];
            } else {
              var hash = asProp || config.mustUseProp(key)
                ? data.domProps || (data.domProps = {})
                : data.attrs || (data.attrs = {});
              hash[key] = value[key];
            }
          }
        }
      }
      return data
    };

    // expose v-on keyCodes
    Vue.prototype._k = function getKeyCodes (key) {
      return config.keyCodes[key]
    };
  }

  function resolveSlots (
    renderChildren,
    context
  ) {
    var slots = {};
    if (!renderChildren) {
      return slots
    }
    var children = normalizeChildren(renderChildren) || [];
    var defaultSlot = [];
    var name, child;
    for (var i = 0, l = children.length; i < l; i++) {
      child = children[i];
      // named slots should only be respected if the vnode was rendered in the
      // same context.
      if ((child.context === context || child.functionalContext === context) &&
          child.data && (name = child.data.slot)) {
        var slot = (slots[name] || (slots[name] = []));
        if (child.tag === 'template') {
          slot.push.apply(slot, child.children);
        } else {
          slot.push(child);
        }
      } else {
        defaultSlot.push(child);
      }
    }
    // ignore single whitespace
    if (defaultSlot.length && !(
      defaultSlot.length === 1 &&
      (defaultSlot[0].text === ' ' || defaultSlot[0].isComment)
    )) {
      slots.default = defaultSlot;
    }
    return slots
  }

  /*  */

  function initEvents (vm) {
    vm._events = Object.create(null);
    // init parent attached events
    var listeners = vm.$options._parentListeners;
    var on = bind$1(vm.$on, vm);
    var off = bind$1(vm.$off, vm);
    vm._updateListeners = function (listeners, oldListeners) {
      updateListeners(listeners, oldListeners || {}, on, off, vm);
    };
    if (listeners) {
      vm._updateListeners(listeners);
    }
  }

  function eventsMixin (Vue) {
    Vue.prototype.$on = function (event, fn) {
      var vm = this;(vm._events[event] || (vm._events[event] = [])).push(fn);
      return vm
    };

    Vue.prototype.$once = function (event, fn) {
      var vm = this;
      function on () {
        vm.$off(event, on);
        fn.apply(vm, arguments);
      }
      on.fn = fn;
      vm.$on(event, on);
      return vm
    };

    Vue.prototype.$off = function (event, fn) {
      var vm = this;
      // all
      if (!arguments.length) {
        vm._events = Object.create(null);
        return vm
      }
      // specific event
      var cbs = vm._events[event];
      if (!cbs) {
        return vm
      }
      if (arguments.length === 1) {
        vm._events[event] = null;
        return vm
      }
      // specific handler
      var cb;
      var i = cbs.length;
      while (i--) {
        cb = cbs[i];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i, 1);
          break
        }
      }
      return vm
    };

    Vue.prototype.$emit = function (event) {
      var vm = this;
      var cbs = vm._events[event];
      if (cbs) {
        cbs = cbs.length > 1 ? toArray(cbs) : cbs;
        var args = toArray(arguments, 1);
        for (var i = 0, l = cbs.length; i < l; i++) {
          cbs[i].apply(vm, args);
        }
      }
      return vm
    };
  }

  /*  */

  var uid = 0;

  function initMixin (Vue) {
    Vue.prototype._init = function (options) {
      var vm = this;
      // a uid
      vm._uid = uid++;
      // a flag to avoid this being observed
      vm._isVue = true;
      // merge options
      if (options && options._isComponent) {
        // optimize internal component instantiation
        // since dynamic options merging is pretty slow, and none of the
        // internal component options needs special treatment.
        initInternalComponent(vm, options);
      } else {
        vm.$options = mergeOptions(
          resolveConstructorOptions(vm.constructor),
          options || {},
          vm
        );
      }
      /* istanbul ignore else */
      if ("production" !== 'production') {} else {
        vm._renderProxy = vm;
      }
      // expose real self
      vm._self = vm;
      initLifecycle(vm);
      initEvents(vm);
      callHook(vm, 'beforeCreate');
      initState(vm);
      callHook(vm, 'created');
      initRender(vm);
    };
  }

  function initInternalComponent (vm, options) {
    var opts = vm.$options = Object.create(vm.constructor.options);
    // doing this because it's faster than dynamic enumeration.
    opts.parent = options.parent;
    opts.propsData = options.propsData;
    opts._parentVnode = options._parentVnode;
    opts._parentListeners = options._parentListeners;
    opts._renderChildren = options._renderChildren;
    opts._componentTag = options._componentTag;
    if (options.render) {
      opts.render = options.render;
      opts.staticRenderFns = options.staticRenderFns;
    }
  }

  function resolveConstructorOptions (Ctor) {
    var options = Ctor.options;
    if (Ctor.super) {
      var superOptions = Ctor.super.options;
      var cachedSuperOptions = Ctor.superOptions;
      var extendOptions = Ctor.extendOptions;
      if (superOptions !== cachedSuperOptions) {
        // super option changed
        Ctor.superOptions = superOptions;
        extendOptions.render = options.render;
        extendOptions.staticRenderFns = options.staticRenderFns;
        options = Ctor.options = mergeOptions(superOptions, extendOptions);
        if (options.name) {
          options.components[options.name] = Ctor;
        }
      }
    }
    return options
  }

  function Vue$1 (options) {
    if ("production" !== 'production' &&
      !(this instanceof Vue$1)) {}
    this._init(options);
  }

  initMixin(Vue$1);
  stateMixin(Vue$1);
  eventsMixin(Vue$1);
  lifecycleMixin(Vue$1);
  renderMixin(Vue$1);

  var warn$1 = noop;
  var formatComponentName$1;

  /*  */

  /**
   * Option overwriting strategies are functions that handle
   * how to merge a parent option value and a child option
   * value into the final value.
   */
  var strats = config.optionMergeStrategies;

  /**
   * Helper that recursively merges two data objects together.
   */
  function mergeData (to, from) {
    var key, toVal, fromVal;
    for (key in from) {
      toVal = to[key];
      fromVal = from[key];
      if (!hasOwn(to, key)) {
        set(to, key, fromVal);
      } else if (isObject(toVal) && isObject(fromVal)) {
        mergeData(toVal, fromVal);
      }
    }
    return to
  }

  /**
   * Data
   */
  strats.data = function (
    parentVal,
    childVal,
    vm
  ) {
    if (!vm) {
      // in a Vue.extend merge, both should be functions
      if (!childVal) {
        return parentVal
      }
      if (typeof childVal !== 'function') {
        "production" !== 'production' && warn$1(
          'The "data" option should be a function ' +
          'that returns a per-instance value in component ' +
          'definitions.',
          vm
        );
        return parentVal
      }
      if (!parentVal) {
        return childVal
      }
      // when parentVal & childVal are both present,
      // we need to return a function that returns the
      // merged result of both functions... no need to
      // check if parentVal is a function here because
      // it has to be a function to pass previous merges.
      return function mergedDataFn () {
        return mergeData(
          childVal.call(this),
          parentVal.call(this)
        )
      }
    } else if (parentVal || childVal) {
      return function mergedInstanceDataFn () {
        // instance merge
        var instanceData = typeof childVal === 'function'
          ? childVal.call(vm)
          : childVal;
        var defaultData = typeof parentVal === 'function'
          ? parentVal.call(vm)
          : undefined;
        if (instanceData) {
          return mergeData(instanceData, defaultData)
        } else {
          return defaultData
        }
      }
    }
  };

  /**
   * Hooks and param attributes are merged as arrays.
   */
  function mergeHook (
    parentVal,
    childVal
  ) {
    return childVal
      ? parentVal
        ? parentVal.concat(childVal)
        : Array.isArray(childVal)
          ? childVal
          : [childVal]
      : parentVal
  }

  config._lifecycleHooks.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  /**
   * Assets
   *
   * When a vm is present (instance creation), we need to do
   * a three-way merge between constructor options, instance
   * options and parent options.
   */
  function mergeAssets (parentVal, childVal) {
    var res = Object.create(parentVal || null);
    return childVal
      ? extend(res, childVal)
      : res
  }

  config._assetTypes.forEach(function (type) {
    strats[type + 's'] = mergeAssets;
  });

  /**
   * Watchers.
   *
   * Watchers hashes should not overwrite one
   * another, so we merge them as arrays.
   */
  strats.watch = function (parentVal, childVal) {
    /* istanbul ignore if */
    if (!childVal) { return parentVal }
    if (!parentVal) { return childVal }
    var ret = {};
    extend(ret, parentVal);
    for (var key in childVal) {
      var parent = ret[key];
      var child = childVal[key];
      if (parent && !Array.isArray(parent)) {
        parent = [parent];
      }
      ret[key] = parent
        ? parent.concat(child)
        : [child];
    }
    return ret
  };

  /**
   * Other object hashes.
   */
  strats.props =
  strats.methods =
  strats.computed = function (parentVal, childVal) {
    if (!childVal) { return parentVal }
    if (!parentVal) { return childVal }
    var ret = Object.create(null);
    extend(ret, parentVal);
    extend(ret, childVal);
    return ret
  };

  /**
   * Default strategy.
   */
  var defaultStrat = function (parentVal, childVal) {
    return childVal === undefined
      ? parentVal
      : childVal
  };

  /**
   * Ensure all props option syntax are normalized into the
   * Object-based format.
   */
  function normalizeProps (options) {
    var props = options.props;
    if (!props) { return }
    var res = {};
    var i, val, name;
    if (Array.isArray(props)) {
      i = props.length;
      while (i--) {
        val = props[i];
        if (typeof val === 'string') {
          name = camelize(val);
          res[name] = { type: null };
        } else if ("production" !== 'production') {}
      }
    } else if (isPlainObject(props)) {
      for (var key in props) {
        val = props[key];
        name = camelize(key);
        res[name] = isPlainObject(val)
          ? val
          : { type: val };
      }
    }
    options.props = res;
  }

  /**
   * Normalize raw function directives into object format.
   */
  function normalizeDirectives (options) {
    var dirs = options.directives;
    if (dirs) {
      for (var key in dirs) {
        var def = dirs[key];
        if (typeof def === 'function') {
          dirs[key] = { bind: def, update: def };
        }
      }
    }
  }

  /**
   * Merge two option objects into a new one.
   * Core utility used in both instantiation and inheritance.
   */
  function mergeOptions (
    parent,
    child,
    vm
  ) {
    if ("production" !== 'production') {}
    normalizeProps(child);
    normalizeDirectives(child);
    var extendsFrom = child.extends;
    if (extendsFrom) {
      parent = typeof extendsFrom === 'function'
        ? mergeOptions(parent, extendsFrom.options, vm)
        : mergeOptions(parent, extendsFrom, vm);
    }
    if (child.mixins) {
      for (var i = 0, l = child.mixins.length; i < l; i++) {
        var mixin = child.mixins[i];
        if (mixin.prototype instanceof Vue$1) {
          mixin = mixin.options;
        }
        parent = mergeOptions(parent, mixin, vm);
      }
    }
    var options = {};
    var key;
    for (key in parent) {
      mergeField(key);
    }
    for (key in child) {
      if (!hasOwn(parent, key)) {
        mergeField(key);
      }
    }
    function mergeField (key) {
      var strat = strats[key] || defaultStrat;
      options[key] = strat(parent[key], child[key], vm, key);
    }
    return options
  }

  /**
   * Resolve an asset.
   * This function is used because child instances need access
   * to assets defined in its ancestor chain.
   */
  function resolveAsset (
    options,
    type,
    id,
    warnMissing
  ) {
    /* istanbul ignore if */
    if (typeof id !== 'string') {
      return
    }
    var assets = options[type];
    var res = assets[id] ||
      // camelCase ID
      assets[camelize(id)] ||
      // Pascal Case ID
      assets[capitalize(camelize(id))];
    if ("production" !== 'production' && warnMissing && !res) {}
    return res
  }

  /*  */

  function validateProp (
    key,
    propOptions,
    propsData,
    vm
  ) {
    var prop = propOptions[key];
    var absent = !hasOwn(propsData, key);
    var value = propsData[key];
    // handle boolean props
    if (isBooleanType(prop.type)) {
      if (absent && !hasOwn(prop, 'default')) {
        value = false;
      } else if (value === '' || value === hyphenate(key)) {
        value = true;
      }
    }
    // check default value
    if (value === undefined) {
      value = getPropDefaultValue(vm, prop, key);
      // since the default value is a fresh copy,
      // make sure to observe it.
      var prevShouldConvert = observerState.shouldConvert;
      observerState.shouldConvert = true;
      observe(value);
      observerState.shouldConvert = prevShouldConvert;
    }
    if ("production" !== 'production') {}
    return value
  }

  /**
   * Get the default value of a prop.
   */
  function getPropDefaultValue (vm, prop, key) {
    // no default, return undefined
    if (!hasOwn(prop, 'default')) {
      return undefined
    }
    var def = prop.default;
    // warn against non-factory defaults for Object & Array
    if (isObject(def)) {
      "production" !== 'production' && warn$1(
        'Invalid default value for prop "' + key + '": ' +
        'Props with type Object/Array must use a factory function ' +
        'to return the default value.',
        vm
      );
    }
    // the raw prop value was also undefined from previous render,
    // return previous default value to avoid unnecessary watcher trigger
    if (vm && vm.$options.propsData &&
      vm.$options.propsData[key] === undefined &&
      vm[key] !== undefined) {
      return vm[key]
    }
    // call factory function for non-Function types
    return typeof def === 'function' && prop.type !== Function
      ? def.call(vm)
      : def
  }

  /**
   * Use function string name to check built-in types,
   * because a simple equality check will fail when running
   * across different vms / iframes.
   */
  function getType (fn) {
    var match = fn && fn.toString().match(/^\s*function (\w+)/);
    return match && match[1]
  }

  function isBooleanType (fn) {
    if (!Array.isArray(fn)) {
      return getType(fn) === 'Boolean'
    }
    for (var i = 0, len = fn.length; i < len; i++) {
      if (getType(fn[i]) === 'Boolean') {
        return true
      }
    }
    /* istanbul ignore next */
    return false
  }



  var util = Object.freeze({
  	defineReactive: defineReactive$$1,
  	_toString: _toString,
  	toNumber: toNumber,
  	makeMap: makeMap,
  	isBuiltInTag: isBuiltInTag,
  	remove: remove$1,
  	hasOwn: hasOwn,
  	isPrimitive: isPrimitive,
  	cached: cached,
  	camelize: camelize,
  	capitalize: capitalize,
  	hyphenate: hyphenate,
  	bind: bind$1,
  	toArray: toArray,
  	extend: extend,
  	isObject: isObject,
  	isPlainObject: isPlainObject,
  	toObject: toObject,
  	noop: noop,
  	no: no,
  	genStaticKeys: genStaticKeys,
  	looseEqual: looseEqual,
  	looseIndexOf: looseIndexOf,
  	isReserved: isReserved,
  	def: def,
  	parsePath: parsePath,
  	hasProto: hasProto,
  	inBrowser: inBrowser,
  	UA: UA,
  	isIE: isIE,
  	isIE9: isIE9,
  	isEdge: isEdge,
  	isAndroid: isAndroid,
  	isIOS: isIOS,
  	devtools: devtools,
  	nextTick: nextTick,
  	get _Set () { return _Set; },
  	mergeOptions: mergeOptions,
  	resolveAsset: resolveAsset,
  	get warn () { return warn$1; },
  	get formatComponentName () { return formatComponentName$1; },
  	validateProp: validateProp
  });

  /*  */

  function initUse (Vue) {
    Vue.use = function (plugin) {
      /* istanbul ignore if */
      if (plugin.installed) {
        return
      }
      // additional parameters
      var args = toArray(arguments, 1);
      args.unshift(this);
      if (typeof plugin.install === 'function') {
        plugin.install.apply(plugin, args);
      } else {
        plugin.apply(null, args);
      }
      plugin.installed = true;
      return this
    };
  }

  /*  */

  function initMixin$1 (Vue) {
    Vue.mixin = function (mixin) {
      Vue.options = mergeOptions(Vue.options, mixin);
    };
  }

  /*  */

  function initExtend (Vue) {
    /**
     * Each instance constructor, including Vue, has a unique
     * cid. This enables us to create wrapped "child
     * constructors" for prototypal inheritance and cache them.
     */
    Vue.cid = 0;
    var cid = 1;

    /**
     * Class inheritance
     */
    Vue.extend = function (extendOptions) {
      extendOptions = extendOptions || {};
      var Super = this;
      var isFirstExtend = Super.cid === 0;
      if (isFirstExtend && extendOptions._Ctor) {
        return extendOptions._Ctor
      }
      var name = extendOptions.name || Super.options.name;
      if ("production" !== 'production') {}
      var Sub = function VueComponent (options) {
        this._init(options);
      };
      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub.cid = cid++;
      Sub.options = mergeOptions(
        Super.options,
        extendOptions
      );
      Sub['super'] = Super;
      // allow further extension
      Sub.extend = Super.extend;
      // create asset registers, so extended classes
      // can have their private assets too.
      config._assetTypes.forEach(function (type) {
        Sub[type] = Super[type];
      });
      // enable recursive self-lookup
      if (name) {
        Sub.options.components[name] = Sub;
      }
      // keep a reference to the super options at extension time.
      // later at instantiation we can check if Super's options have
      // been updated.
      Sub.superOptions = Super.options;
      Sub.extendOptions = extendOptions;
      // cache constructor
      if (isFirstExtend) {
        extendOptions._Ctor = Sub;
      }
      return Sub
    };
  }

  /*  */

  function initAssetRegisters (Vue) {
    /**
     * Create asset registration methods.
     */
    config._assetTypes.forEach(function (type) {
      Vue[type] = function (
        id,
        definition
      ) {
        if (!definition) {
          return this.options[type + 's'][id]
        } else {
          /* istanbul ignore if */
          if ("production" !== 'production') {}
          if (type === 'component' && isPlainObject(definition)) {
            definition.name = definition.name || id;
            definition = Vue.extend(definition);
          }
          if (type === 'directive' && typeof definition === 'function') {
            definition = { bind: definition, update: definition };
          }
          this.options[type + 's'][id] = definition;
          return definition
        }
      };
    });
  }

  var KeepAlive = {
    name: 'keep-alive',
    abstract: true,
    created: function created () {
      this.cache = Object.create(null);
    },
    render: function render () {
      var vnode = getFirstComponentChild(this.$slots.default);
      if (vnode && vnode.componentOptions) {
        var opts = vnode.componentOptions;
        var key = vnode.key == null
          // same constructor may get registered as different local components
          // so cid alone is not enough (#3269)
          ? opts.Ctor.cid + '::' + opts.tag
          : vnode.key;
        if (this.cache[key]) {
          vnode.child = this.cache[key].child;
        } else {
          this.cache[key] = vnode;
        }
        vnode.data.keepAlive = true;
      }
      return vnode
    },
    destroyed: function destroyed () {
      var this$1 = this;

      for (var key in this.cache) {
        var vnode = this$1.cache[key];
        callHook(vnode.child, 'deactivated');
        vnode.child.$destroy();
      }
    }
  };

  var builtInComponents = {
    KeepAlive: KeepAlive
  };

  /*  */

  function initGlobalAPI (Vue) {
    // config
    var configDef = {};
    configDef.get = function () { return config; };
    if ("production" !== 'production') {}
    Object.defineProperty(Vue, 'config', configDef);
    Vue.util = util;
    Vue.set = set;
    Vue.delete = del;
    Vue.nextTick = nextTick;

    Vue.options = Object.create(null);
    config._assetTypes.forEach(function (type) {
      Vue.options[type + 's'] = Object.create(null);
    });

    extend(Vue.options.components, builtInComponents);

    initUse(Vue);
    initMixin$1(Vue);
    initExtend(Vue);
    initAssetRegisters(Vue);
  }

  initGlobalAPI(Vue$1);

  Object.defineProperty(Vue$1.prototype, '$isServer', {
    get: function () { return config._isServer; }
  });

  Vue$1.version = '2.0.5';

  /*  */

  // attributes that should be using props for binding
  var mustUseProp = makeMap('value,selected,checked,muted');

  var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

  var isBooleanAttr = makeMap(
    'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
    'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
    'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
    'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
    'required,reversed,scoped,seamless,selected,sortable,translate,' +
    'truespeed,typemustmatch,visible'
  );

  var isAttr = makeMap(
    'accept,accept-charset,accesskey,action,align,alt,async,autocomplete,' +
    'autofocus,autoplay,autosave,bgcolor,border,buffered,challenge,charset,' +
    'checked,cite,class,code,codebase,color,cols,colspan,content,http-equiv,' +
    'name,contenteditable,contextmenu,controls,coords,data,datetime,default,' +
    'defer,dir,dirname,disabled,download,draggable,dropzone,enctype,method,for,' +
    'form,formaction,headers,<th>,height,hidden,high,href,hreflang,http-equiv,' +
    'icon,id,ismap,itemprop,keytype,kind,label,lang,language,list,loop,low,' +
    'manifest,max,maxlength,media,method,GET,POST,min,multiple,email,file,' +
    'muted,name,novalidate,open,optimum,pattern,ping,placeholder,poster,' +
    'preload,radiogroup,readonly,rel,required,reversed,rows,rowspan,sandbox,' +
    'scope,scoped,seamless,selected,shape,size,type,text,password,sizes,span,' +
    'spellcheck,src,srcdoc,srclang,srcset,start,step,style,summary,tabindex,' +
    'target,title,type,usemap,value,width,wrap'
  );



  var xlinkNS = 'http://www.w3.org/1999/xlink';

  var isXlink = function (name) {
    return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
  };

  var getXlinkProp = function (name) {
    return isXlink(name) ? name.slice(6, name.length) : ''
  };

  var isFalsyAttrValue = function (val) {
    return val == null || val === false
  };

  /*  */

  function genClassForVnode (vnode) {
    var data = vnode.data;
    var parentNode = vnode;
    var childNode = vnode;
    while (childNode.child) {
      childNode = childNode.child._vnode;
      if (childNode.data) {
        data = mergeClassData(childNode.data, data);
      }
    }
    while ((parentNode = parentNode.parent)) {
      if (parentNode.data) {
        data = mergeClassData(data, parentNode.data);
      }
    }
    return genClassFromData(data)
  }

  function mergeClassData (child, parent) {
    return {
      staticClass: concat(child.staticClass, parent.staticClass),
      class: child.class
        ? [child.class, parent.class]
        : parent.class
    }
  }

  function genClassFromData (data) {
    var dynamicClass = data.class;
    var staticClass = data.staticClass;
    if (staticClass || dynamicClass) {
      return concat(staticClass, stringifyClass(dynamicClass))
    }
    /* istanbul ignore next */
    return ''
  }

  function concat (a, b) {
    return a ? b ? (a + ' ' + b) : a : (b || '')
  }

  function stringifyClass (value) {
    var res = '';
    if (!value) {
      return res
    }
    if (typeof value === 'string') {
      return value
    }
    if (Array.isArray(value)) {
      var stringified;
      for (var i = 0, l = value.length; i < l; i++) {
        if (value[i]) {
          if ((stringified = stringifyClass(value[i]))) {
            res += stringified + ' ';
          }
        }
      }
      return res.slice(0, -1)
    }
    if (isObject(value)) {
      for (var key in value) {
        if (value[key]) { res += key + ' '; }
      }
      return res.slice(0, -1)
    }
    /* istanbul ignore next */
    return res
  }

  /*  */

  var namespaceMap = {
    svg: 'http://www.w3.org/2000/svg',
    math: 'http://www.w3.org/1998/Math/MathML',
    xhtml: 'http://www.w3.org/1999/xhtm'
  };

  var isHTMLTag = makeMap(
    'html,body,base,head,link,meta,style,title,' +
    'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
    'div,dd,dl,dt,figcaption,figure,hr,img,li,main,ol,p,pre,ul,' +
    'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
    's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
    'embed,object,param,source,canvas,script,noscript,del,ins,' +
    'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
    'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
    'output,progress,select,textarea,' +
    'details,dialog,menu,menuitem,summary,' +
    'content,element,shadow,template'
  );

  var isUnaryTag = makeMap(
    'area,base,br,col,embed,frame,hr,img,input,isindex,keygen,' +
    'link,meta,param,source,track,wbr',
    true
  );

  // Elements that you can, intentionally, leave open
  // (and which close themselves)
  var canBeLeftOpenTag = makeMap(
    'colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr,source',
    true
  );

  // HTML5 tags https://html.spec.whatwg.org/multipage/indices.html#elements-3
  // Phrasing Content https://html.spec.whatwg.org/multipage/dom.html#phrasing-content
  var isNonPhrasingTag = makeMap(
    'address,article,aside,base,blockquote,body,caption,col,colgroup,dd,' +
    'details,dialog,div,dl,dt,fieldset,figcaption,figure,footer,form,' +
    'h1,h2,h3,h4,h5,h6,head,header,hgroup,hr,html,legend,li,menuitem,meta,' +
    'optgroup,option,param,rp,rt,source,style,summary,tbody,td,tfoot,th,thead,' +
    'title,tr,track',
    true
  );

  // this map is intentionally selective, only covering SVG elements that may
  // contain child elements.
  var isSVG = makeMap(
    'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font,' +
    'font-face,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
    'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
    true
  );



  var isReservedTag = function (tag) {
    return isHTMLTag(tag) || isSVG(tag)
  };

  function getTagNamespace (tag) {
    if (isSVG(tag)) {
      return 'svg'
    }
    // basic support for MathML
    // note it doesn't support other MathML elements being component roots
    if (tag === 'math') {
      return 'math'
    }
  }

  var unknownElementCache = Object.create(null);
  function isUnknownElement (tag) {
    /* istanbul ignore if */
    if (!inBrowser) {
      return true
    }
    if (isReservedTag(tag)) {
      return false
    }
    tag = tag.toLowerCase();
    /* istanbul ignore if */
    if (unknownElementCache[tag] != null) {
      return unknownElementCache[tag]
    }
    var el = document.createElement(tag);
    if (tag.indexOf('-') > -1) {
      // http://stackoverflow.com/a/28210364/1070244
      return (unknownElementCache[tag] = (
        el.constructor === window.HTMLUnknownElement ||
        el.constructor === window.HTMLElement
      ))
    } else {
      return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
    }
  }

  /*  */

  /**
   * Query an element selector if it's not an element already.
   */
  function query (el) {
    if (typeof el === 'string') {
      var selector = el;
      el = document.querySelector(el);
      if (!el) {
        "production" !== 'production' && warn$1(
          'Cannot find element: ' + selector
        );
        return document.createElement('div')
      }
    }
    return el
  }

  /*  */

  function createElement$1 (tagName, vnode) {
    var elm = document.createElement(tagName);
    if (tagName !== 'select') {
      return elm
    }
    if (vnode.data && vnode.data.attrs && 'multiple' in vnode.data.attrs) {
      elm.setAttribute('multiple', 'multiple');
    }
    return elm
  }

  function createElementNS (namespace, tagName) {
    return document.createElementNS(namespaceMap[namespace], tagName)
  }

  function createTextNode (text) {
    return document.createTextNode(text)
  }

  function createComment (text) {
    return document.createComment(text)
  }

  function insertBefore (parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
  }

  function removeChild (node, child) {
    node.removeChild(child);
  }

  function appendChild (node, child) {
    node.appendChild(child);
  }

  function parentNode (node) {
    return node.parentNode
  }

  function nextSibling (node) {
    return node.nextSibling
  }

  function tagName (node) {
    return node.tagName
  }

  function setTextContent (node, text) {
    node.textContent = text;
  }

  function childNodes (node) {
    return node.childNodes
  }

  function setAttribute (node, key, val) {
    node.setAttribute(key, val);
  }


  var nodeOps = Object.freeze({
  	createElement: createElement$1,
  	createElementNS: createElementNS,
  	createTextNode: createTextNode,
  	createComment: createComment,
  	insertBefore: insertBefore,
  	removeChild: removeChild,
  	appendChild: appendChild,
  	parentNode: parentNode,
  	nextSibling: nextSibling,
  	tagName: tagName,
  	setTextContent: setTextContent,
  	childNodes: childNodes,
  	setAttribute: setAttribute
  });

  /*  */

  var ref = {
    create: function create (_, vnode) {
      registerRef(vnode);
    },
    update: function update (oldVnode, vnode) {
      if (oldVnode.data.ref !== vnode.data.ref) {
        registerRef(oldVnode, true);
        registerRef(vnode);
      }
    },
    destroy: function destroy (vnode) {
      registerRef(vnode, true);
    }
  };

  function registerRef (vnode, isRemoval) {
    var key = vnode.data.ref;
    if (!key) { return }

    var vm = vnode.context;
    var ref = vnode.child || vnode.elm;
    var refs = vm.$refs;
    if (isRemoval) {
      if (Array.isArray(refs[key])) {
        remove$1(refs[key], ref);
      } else if (refs[key] === ref) {
        refs[key] = undefined;
      }
    } else {
      if (vnode.data.refInFor) {
        if (Array.isArray(refs[key])) {
          refs[key].push(ref);
        } else {
          refs[key] = [ref];
        }
      } else {
        refs[key] = ref;
      }
    }
  }

  /**
   * Virtual DOM patching algorithm based on Snabbdom by
   * Simon Friis Vindum (@paldepind)
   * Licensed under the MIT License
   * https://github.com/paldepind/snabbdom/blob/master/LICENSE
   *
   * modified by Evan You (@yyx990803)
   *

  /*
   * Not type-checking this because this file is perf-critical and the cost
   * of making flow understand it is not worth it.
   */

  var emptyNode = new VNode('', {}, []);

  var hooks$1 = ['create', 'update', 'remove', 'destroy'];

  function isUndef (s) {
    return s == null
  }

  function isDef (s) {
    return s != null
  }

  function sameVnode (vnode1, vnode2) {
    return (
      vnode1.key === vnode2.key &&
      vnode1.tag === vnode2.tag &&
      vnode1.isComment === vnode2.isComment &&
      !vnode1.data === !vnode2.data
    )
  }

  function createKeyToOldIdx (children, beginIdx, endIdx) {
    var i, key;
    var map = {};
    for (i = beginIdx; i <= endIdx; ++i) {
      key = children[i].key;
      if (isDef(key)) { map[key] = i; }
    }
    return map
  }

  function createPatchFunction (backend) {
    var i, j;
    var cbs = {};

    var modules = backend.modules;
    var nodeOps = backend.nodeOps;

    for (i = 0; i < hooks$1.length; ++i) {
      cbs[hooks$1[i]] = [];
      for (j = 0; j < modules.length; ++j) {
        if (modules[j][hooks$1[i]] !== undefined) { cbs[hooks$1[i]].push(modules[j][hooks$1[i]]); }
      }
    }

    function emptyNodeAt (elm) {
      return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
    }

    function createRmCb (childElm, listeners) {
      function remove$$1 () {
        if (--remove$$1.listeners === 0) {
          removeElement(childElm);
        }
      }
      remove$$1.listeners = listeners;
      return remove$$1
    }

    function removeElement (el) {
      var parent = nodeOps.parentNode(el);
      // element may have already been removed due to v-html
      if (parent) {
        nodeOps.removeChild(parent, el);
      }
    }

    function createElm (vnode, insertedVnodeQueue, nested) {
      var i;
      var data = vnode.data;
      vnode.isRootInsert = !nested;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode); }
        // after calling the init hook, if the vnode is a child component
        // it should've created a child instance and mounted it. the child
        // component also has set the placeholder vnode's elm.
        // in that case we can just return the element and be done.
        if (isDef(i = vnode.child)) {
          initComponent(vnode, insertedVnodeQueue);
          return vnode.elm
        }
      }
      var children = vnode.children;
      var tag = vnode.tag;
      if (isDef(tag)) {
        if ("production" !== 'production') {}
        vnode.elm = vnode.ns
          ? nodeOps.createElementNS(vnode.ns, tag)
          : nodeOps.createElement(tag, vnode);
        setScope(vnode);
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
      } else if (vnode.isComment) {
        vnode.elm = nodeOps.createComment(vnode.text);
      } else {
        vnode.elm = nodeOps.createTextNode(vnode.text);
      }
      return vnode.elm
    }

    function createChildren (vnode, children, insertedVnodeQueue) {
      if (Array.isArray(children)) {
        for (var i = 0; i < children.length; ++i) {
          nodeOps.appendChild(vnode.elm, createElm(children[i], insertedVnodeQueue, true));
        }
      } else if (isPrimitive(vnode.text)) {
        nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(vnode.text));
      }
    }

    function isPatchable (vnode) {
      while (vnode.child) {
        vnode = vnode.child._vnode;
      }
      return isDef(vnode.tag)
    }

    function invokeCreateHooks (vnode, insertedVnodeQueue) {
      for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
        cbs.create[i$1](emptyNode, vnode);
      }
      i = vnode.data.hook; // Reuse variable
      if (isDef(i)) {
        if (i.create) { i.create(emptyNode, vnode); }
        if (i.insert) { insertedVnodeQueue.push(vnode); }
      }
    }

    function initComponent (vnode, insertedVnodeQueue) {
      if (vnode.data.pendingInsert) {
        insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      }
      vnode.elm = vnode.child.$el;
      if (isPatchable(vnode)) {
        invokeCreateHooks(vnode, insertedVnodeQueue);
        setScope(vnode);
      } else {
        // empty component root.
        // skip all element-related modules except for ref (#3455)
        registerRef(vnode);
        // make sure to invoke the insert hook
        insertedVnodeQueue.push(vnode);
      }
    }

    // set scope id attribute for scoped CSS.
    // this is implemented as a special case to avoid the overhead
    // of going through the normal attribute patching process.
    function setScope (vnode) {
      var i;
      if (isDef(i = vnode.context) && isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
      if (isDef(i = activeInstance) &&
          i !== vnode.context &&
          isDef(i = i.$options._scopeId)) {
        nodeOps.setAttribute(vnode.elm, i, '');
      }
    }

    function addVnodes (parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
      for (; startIdx <= endIdx; ++startIdx) {
        nodeOps.insertBefore(parentElm, createElm(vnodes[startIdx], insertedVnodeQueue), before);
      }
    }

    function invokeDestroyHook (vnode) {
      var i, j;
      var data = vnode.data;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
        for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
      }
      if (isDef(i = vnode.children)) {
        for (j = 0; j < vnode.children.length; ++j) {
          invokeDestroyHook(vnode.children[j]);
        }
      }
    }

    function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
      for (; startIdx <= endIdx; ++startIdx) {
        var ch = vnodes[startIdx];
        if (isDef(ch)) {
          if (isDef(ch.tag)) {
            removeAndInvokeRemoveHook(ch);
            invokeDestroyHook(ch);
          } else { // Text node
            nodeOps.removeChild(parentElm, ch.elm);
          }
        }
      }
    }

    function removeAndInvokeRemoveHook (vnode, rm) {
      if (rm || isDef(vnode.data)) {
        var listeners = cbs.remove.length + 1;
        if (!rm) {
          // directly removing
          rm = createRmCb(vnode.elm, listeners);
        } else {
          // we have a recursively passed down rm callback
          // increase the listeners count
          rm.listeners += listeners;
        }
        // recursively invoke hooks on child component root node
        if (isDef(i = vnode.child) && isDef(i = i._vnode) && isDef(i.data)) {
          removeAndInvokeRemoveHook(i, rm);
        }
        for (i = 0; i < cbs.remove.length; ++i) {
          cbs.remove[i](vnode, rm);
        }
        if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
          i(vnode, rm);
        } else {
          rm();
        }
      } else {
        removeElement(vnode.elm);
      }
    }

    function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
      var oldStartIdx = 0;
      var newStartIdx = 0;
      var oldEndIdx = oldCh.length - 1;
      var oldStartVnode = oldCh[0];
      var oldEndVnode = oldCh[oldEndIdx];
      var newEndIdx = newCh.length - 1;
      var newStartVnode = newCh[0];
      var newEndVnode = newCh[newEndIdx];
      var oldKeyToIdx, idxInOld, elmToMove, before;

      // removeOnly is a special flag used only by <transition-group>
      // to ensure removed elements stay in correct relative positions
      // during leaving transitions
      var canMove = !removeOnly;

      while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
        if (isUndef(oldStartVnode)) {
          oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
        } else if (isUndef(oldEndVnode)) {
          oldEndVnode = oldCh[--oldEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
          patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
          oldStartVnode = oldCh[++oldStartIdx];
          newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
          patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
          oldEndVnode = oldCh[--oldEndIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
          patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
          oldStartVnode = oldCh[++oldStartIdx];
          newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
          patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
          canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
          oldEndVnode = oldCh[--oldEndIdx];
          newStartVnode = newCh[++newStartIdx];
        } else {
          if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
          idxInOld = isDef(newStartVnode.key) ? oldKeyToIdx[newStartVnode.key] : null;
          if (isUndef(idxInOld)) { // New element
            nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
            newStartVnode = newCh[++newStartIdx];
          } else {
            elmToMove = oldCh[idxInOld];
            /* istanbul ignore if */
            if ("production" !== 'production' && !elmToMove) {}
            if (elmToMove.tag !== newStartVnode.tag) {
              // same key but different element. treat as new element
              nodeOps.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            } else {
              patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
              oldCh[idxInOld] = undefined;
              canMove && nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
              newStartVnode = newCh[++newStartIdx];
            }
          }
        }
      }
      if (oldStartIdx > oldEndIdx) {
        before = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else if (newStartIdx > newEndIdx) {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }

    function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
      if (oldVnode === vnode) {
        return
      }
      // reuse element for static trees.
      // note we only do this if the vnode is cloned -
      // if the new node is not cloned it means the render functions have been
      // reset by the hot-reload-api and we need to do a proper re-render.
      if (vnode.isStatic &&
          oldVnode.isStatic &&
          vnode.key === oldVnode.key &&
          (vnode.isCloned || vnode.isOnce)) {
        vnode.elm = oldVnode.elm;
        return
      }
      var i;
      var data = vnode.data;
      var hasData = isDef(data);
      if (hasData && isDef(i = data.hook) && isDef(i = i.prepatch)) {
        i(oldVnode, vnode);
      }
      var elm = vnode.elm = oldVnode.elm;
      var oldCh = oldVnode.children;
      var ch = vnode.children;
      if (hasData && isPatchable(vnode)) {
        for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
        if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
      }
      if (isUndef(vnode.text)) {
        if (isDef(oldCh) && isDef(ch)) {
          if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
        } else if (isDef(ch)) {
          if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
          addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
        } else if (isDef(oldCh)) {
          removeVnodes(elm, oldCh, 0, oldCh.length - 1);
        } else if (isDef(oldVnode.text)) {
          nodeOps.setTextContent(elm, '');
        }
      } else if (oldVnode.text !== vnode.text) {
        nodeOps.setTextContent(elm, vnode.text);
      }
      if (hasData) {
        if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
      }
    }

    function invokeInsertHook (vnode, queue, initial) {
      // delay insert hooks for component root nodes, invoke them after the
      // element is really inserted
      if (initial && vnode.parent) {
        vnode.parent.data.pendingInsert = queue;
      } else {
        for (var i = 0; i < queue.length; ++i) {
          queue[i].data.hook.insert(queue[i]);
        }
      }
    }

    var bailed = false;
    function hydrate (elm, vnode, insertedVnodeQueue) {
      if ("production" !== 'production') {}
      vnode.elm = elm;
      var tag = vnode.tag;
      var data = vnode.data;
      var children = vnode.children;
      if (isDef(data)) {
        if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
        if (isDef(i = vnode.child)) {
          // child component. it should have hydrated its own tree.
          initComponent(vnode, insertedVnodeQueue);
          return true
        }
      }
      if (isDef(tag)) {
        if (isDef(children)) {
          var childNodes = nodeOps.childNodes(elm);
          // empty element, allow client to pick up and populate children
          if (!childNodes.length) {
            createChildren(vnode, children, insertedVnodeQueue);
          } else {
            var childrenMatch = true;
            if (childNodes.length !== children.length) {
              childrenMatch = false;
            } else {
              for (var i$1 = 0; i$1 < children.length; i$1++) {
                if (!hydrate(childNodes[i$1], children[i$1], insertedVnodeQueue)) {
                  childrenMatch = false;
                  break
                }
              }
            }
            if (!childrenMatch) {
              if ("production" !== 'production' &&
                  typeof console !== 'undefined' &&
                  !bailed) {}
              return false
            }
          }
        }
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
      }
      return true
    }

    function assertNodeMatch (node, vnode) {
      if (vnode.tag) {
        return (
          vnode.tag.indexOf('vue-component') === 0 ||
          vnode.tag === nodeOps.tagName(node).toLowerCase()
        )
      } else {
        return _toString(vnode.text) === node.data
      }
    }

    return function patch (oldVnode, vnode, hydrating, removeOnly) {
      if (!vnode) {
        if (oldVnode) { invokeDestroyHook(oldVnode); }
        return
      }

      var elm, parent;
      var isInitialPatch = false;
      var insertedVnodeQueue = [];

      if (!oldVnode) {
        // empty mount, create new root element
        isInitialPatch = true;
        createElm(vnode, insertedVnodeQueue);
      } else {
        var isRealElement = isDef(oldVnode.nodeType);
        if (!isRealElement && sameVnode(oldVnode, vnode)) {
          patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
        } else {
          if (isRealElement) {
            // mounting to a real element
            // check if this is server-rendered content and if we can perform
            // a successful hydration.
            if (oldVnode.nodeType === 1 && oldVnode.hasAttribute('server-rendered')) {
              oldVnode.removeAttribute('server-rendered');
              hydrating = true;
            }
            if (hydrating) {
              if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
                invokeInsertHook(vnode, insertedVnodeQueue, true);
                return oldVnode
              } else if ("production" !== 'production') {}
            }
            // either not server-rendered, or hydration failed.
            // create an empty node and replace it
            oldVnode = emptyNodeAt(oldVnode);
          }
          elm = oldVnode.elm;
          parent = nodeOps.parentNode(elm);

          createElm(vnode, insertedVnodeQueue);

          // component root element replaced.
          // update parent placeholder node element.
          if (vnode.parent) {
            vnode.parent.elm = vnode.elm;
            if (isPatchable(vnode)) {
              for (var i = 0; i < cbs.create.length; ++i) {
                cbs.create[i](emptyNode, vnode.parent);
              }
            }
          }

          if (parent !== null) {
            nodeOps.insertBefore(parent, vnode.elm, nodeOps.nextSibling(elm));
            removeVnodes(parent, [oldVnode], 0, 0);
          } else if (isDef(oldVnode.tag)) {
            invokeDestroyHook(oldVnode);
          }
        }
      }

      invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
      return vnode.elm
    }
  }

  /*  */

  var directives = {
    create: updateDirectives,
    update: updateDirectives,
    destroy: function unbindDirectives (vnode) {
      updateDirectives(vnode, emptyNode);
    }
  };

  function updateDirectives (
    oldVnode,
    vnode
  ) {
    if (!oldVnode.data.directives && !vnode.data.directives) {
      return
    }
    var isCreate = oldVnode === emptyNode;
    var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
    var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

    var dirsWithInsert = [];
    var dirsWithPostpatch = [];

    var key, oldDir, dir;
    for (key in newDirs) {
      oldDir = oldDirs[key];
      dir = newDirs[key];
      if (!oldDir) {
        // new directive, bind
        callHook$1(dir, 'bind', vnode, oldVnode);
        if (dir.def && dir.def.inserted) {
          dirsWithInsert.push(dir);
        }
      } else {
        // existing directive, update
        dir.oldValue = oldDir.value;
        callHook$1(dir, 'update', vnode, oldVnode);
        if (dir.def && dir.def.componentUpdated) {
          dirsWithPostpatch.push(dir);
        }
      }
    }

    if (dirsWithInsert.length) {
      var callInsert = function () {
        dirsWithInsert.forEach(function (dir) {
          callHook$1(dir, 'inserted', vnode, oldVnode);
        });
      };
      if (isCreate) {
        mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', callInsert, 'dir-insert');
      } else {
        callInsert();
      }
    }

    if (dirsWithPostpatch.length) {
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'postpatch', function () {
        dirsWithPostpatch.forEach(function (dir) {
          callHook$1(dir, 'componentUpdated', vnode, oldVnode);
        });
      }, 'dir-postpatch');
    }

    if (!isCreate) {
      for (key in oldDirs) {
        if (!newDirs[key]) {
          // no longer present, unbind
          callHook$1(oldDirs[key], 'unbind', oldVnode);
        }
      }
    }
  }

  var emptyModifiers = Object.create(null);

  function normalizeDirectives$1 (
    dirs,
    vm
  ) {
    var res = Object.create(null);
    if (!dirs) {
      return res
    }
    var i, dir;
    for (i = 0; i < dirs.length; i++) {
      dir = dirs[i];
      if (!dir.modifiers) {
        dir.modifiers = emptyModifiers;
      }
      res[getRawDirName(dir)] = dir;
      dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
    }
    return res
  }

  function getRawDirName (dir) {
    return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
  }

  function callHook$1 (dir, hook, vnode, oldVnode) {
    var fn = dir.def && dir.def[hook];
    if (fn) {
      fn(vnode.elm, dir, vnode, oldVnode);
    }
  }

  var baseModules = [
    ref,
    directives
  ];

  /*  */

  function updateAttrs (oldVnode, vnode) {
    if (!oldVnode.data.attrs && !vnode.data.attrs) {
      return
    }
    var key, cur, old;
    var elm = vnode.elm;
    var oldAttrs = oldVnode.data.attrs || {};
    var attrs = vnode.data.attrs || {};
    // clone observed objects, as the user probably wants to mutate it
    if (attrs.__ob__) {
      attrs = vnode.data.attrs = extend({}, attrs);
    }

    for (key in attrs) {
      cur = attrs[key];
      old = oldAttrs[key];
      if (old !== cur) {
        setAttr(elm, key, cur);
      }
    }
    for (key in oldAttrs) {
      if (attrs[key] == null) {
        if (isXlink(key)) {
          elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
        } else if (!isEnumeratedAttr(key)) {
          elm.removeAttribute(key);
        }
      }
    }
  }

  function setAttr (el, key, value) {
    if (isBooleanAttr(key)) {
      // set attribute for blank value
      // e.g. <option disabled>Select one</option>
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, key);
      }
    } else if (isEnumeratedAttr(key)) {
      el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
    } else if (isXlink(key)) {
      if (isFalsyAttrValue(value)) {
        el.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      if (isFalsyAttrValue(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, value);
      }
    }
  }

  var attrs = {
    create: updateAttrs,
    update: updateAttrs
  };

  /*  */

  function updateClass (oldVnode, vnode) {
    var el = vnode.elm;
    var data = vnode.data;
    var oldData = oldVnode.data;
    if (!data.staticClass && !data.class &&
        (!oldData || (!oldData.staticClass && !oldData.class))) {
      return
    }

    var cls = genClassForVnode(vnode);

    // handle transition classes
    var transitionClass = el._transitionClasses;
    if (transitionClass) {
      cls = concat(cls, stringifyClass(transitionClass));
    }

    // set the class
    if (cls !== el._prevClass) {
      el.setAttribute('class', cls);
      el._prevClass = cls;
    }
  }

  var klass = {
    create: updateClass,
    update: updateClass
  };

  // skip type checking this file because we need to attach private properties
  // to elements

  function updateDOMListeners (oldVnode, vnode) {
    if (!oldVnode.data.on && !vnode.data.on) {
      return
    }
    var on = vnode.data.on || {};
    var oldOn = oldVnode.data.on || {};
    var add = vnode.elm._v_add || (vnode.elm._v_add = function (event, handler, capture) {
      vnode.elm.addEventListener(event, handler, capture);
    });
    var remove = vnode.elm._v_remove || (vnode.elm._v_remove = function (event, handler) {
      vnode.elm.removeEventListener(event, handler);
    });
    updateListeners(on, oldOn, add, remove, vnode.context);
  }

  var events = {
    create: updateDOMListeners,
    update: updateDOMListeners
  };

  /*  */

  function updateDOMProps (oldVnode, vnode) {
    if (!oldVnode.data.domProps && !vnode.data.domProps) {
      return
    }
    var key, cur;
    var elm = vnode.elm;
    var oldProps = oldVnode.data.domProps || {};
    var props = vnode.data.domProps || {};
    // clone observed objects, as the user probably wants to mutate it
    if (props.__ob__) {
      props = vnode.data.domProps = extend({}, props);
    }

    for (key in oldProps) {
      if (props[key] == null) {
        elm[key] = '';
      }
    }
    for (key in props) {
      // ignore children if the node has textContent or innerHTML,
      // as these will throw away existing DOM nodes and cause removal errors
      // on subsequent patches (#3360)
      if ((key === 'textContent' || key === 'innerHTML') && vnode.children) {
        vnode.children.length = 0;
      }
      cur = props[key];
      if (key === 'value') {
        // store value as _value as well since
        // non-string values will be stringified
        elm._value = cur;
        // avoid resetting cursor position when value is the same
        var strCur = cur == null ? '' : String(cur);
        if (elm.value !== strCur && !elm.composing) {
          elm.value = strCur;
        }
      } else {
        elm[key] = cur;
      }
    }
  }

  var domProps = {
    create: updateDOMProps,
    update: updateDOMProps
  };

  /*  */

  var cssVarRE = /^--/;
  var setProp = function (el, name, val) {
    /* istanbul ignore if */
    if (cssVarRE.test(name)) {
      el.style.setProperty(name, val);
    } else {
      el.style[normalize(name)] = val;
    }
  };

  var prefixes = ['Webkit', 'Moz', 'ms'];

  var testEl;
  var normalize = cached(function (prop) {
    testEl = testEl || document.createElement('div');
    prop = camelize(prop);
    if (prop !== 'filter' && (prop in testEl.style)) {
      return prop
    }
    var upper = prop.charAt(0).toUpperCase() + prop.slice(1);
    for (var i = 0; i < prefixes.length; i++) {
      var prefixed = prefixes[i] + upper;
      if (prefixed in testEl.style) {
        return prefixed
      }
    }
  });

  function updateStyle (oldVnode, vnode) {
    if ((!oldVnode.data || !oldVnode.data.style) && !vnode.data.style) {
      return
    }
    var cur, name;
    var el = vnode.elm;
    var oldStyle = oldVnode.data.style || {};
    var style = vnode.data.style || {};

    // handle string
    if (typeof style === 'string') {
      el.style.cssText = style;
      return
    }

    var needClone = style.__ob__;

    // handle array syntax
    if (Array.isArray(style)) {
      style = vnode.data.style = toObject(style);
    }

    // clone the style for future updates,
    // in case the user mutates the style object in-place.
    if (needClone) {
      style = vnode.data.style = extend({}, style);
    }

    for (name in oldStyle) {
      if (style[name] == null) {
        setProp(el, name, '');
      }
    }
    for (name in style) {
      cur = style[name];
      if (cur !== oldStyle[name]) {
        // ie9 setting to null has no effect, must use empty string
        setProp(el, name, cur == null ? '' : cur);
      }
    }
  }

  var style = {
    create: updateStyle,
    update: updateStyle
  };

  /*  */

  /**
   * Add class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function addClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !cls.trim()) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
      } else {
        el.classList.add(cls);
      }
    } else {
      var cur = ' ' + el.getAttribute('class') + ' ';
      if (cur.indexOf(' ' + cls + ' ') < 0) {
        el.setAttribute('class', (cur + cls).trim());
      }
    }
  }

  /**
   * Remove class with compatibility for SVG since classList is not supported on
   * SVG elements in IE
   */
  function removeClass (el, cls) {
    /* istanbul ignore if */
    if (!cls || !cls.trim()) {
      return
    }

    /* istanbul ignore else */
    if (el.classList) {
      if (cls.indexOf(' ') > -1) {
        cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
      } else {
        el.classList.remove(cls);
      }
    } else {
      var cur = ' ' + el.getAttribute('class') + ' ';
      var tar = ' ' + cls + ' ';
      while (cur.indexOf(tar) >= 0) {
        cur = cur.replace(tar, ' ');
      }
      el.setAttribute('class', cur.trim());
    }
  }

  /*  */

  var hasTransition = inBrowser && !isIE9;
  var TRANSITION = 'transition';
  var ANIMATION = 'animation';

  // Transition property/event sniffing
  var transitionProp = 'transition';
  var transitionEndEvent = 'transitionend';
  var animationProp = 'animation';
  var animationEndEvent = 'animationend';
  if (hasTransition) {
    /* istanbul ignore if */
    if (window.ontransitionend === undefined &&
      window.onwebkittransitionend !== undefined) {
      transitionProp = 'WebkitTransition';
      transitionEndEvent = 'webkitTransitionEnd';
    }
    if (window.onanimationend === undefined &&
      window.onwebkitanimationend !== undefined) {
      animationProp = 'WebkitAnimation';
      animationEndEvent = 'webkitAnimationEnd';
    }
  }

  var raf = (inBrowser && window.requestAnimationFrame) || setTimeout;
  function nextFrame (fn) {
    raf(function () {
      raf(fn);
    });
  }

  function addTransitionClass (el, cls) {
    (el._transitionClasses || (el._transitionClasses = [])).push(cls);
    addClass(el, cls);
  }

  function removeTransitionClass (el, cls) {
    if (el._transitionClasses) {
      remove$1(el._transitionClasses, cls);
    }
    removeClass(el, cls);
  }

  function whenTransitionEnds (
    el,
    expectedType,
    cb
  ) {
    var ref = getTransitionInfo(el, expectedType);
    var type = ref.type;
    var timeout = ref.timeout;
    var propCount = ref.propCount;
    if (!type) { return cb() }
    var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
    var ended = 0;
    var end = function () {
      el.removeEventListener(event, onEnd);
      cb();
    };
    var onEnd = function (e) {
      if (e.target === el) {
        if (++ended >= propCount) {
          end();
        }
      }
    };
    setTimeout(function () {
      if (ended < propCount) {
        end();
      }
    }, timeout + 1);
    el.addEventListener(event, onEnd);
  }

  var transformRE = /\b(transform|all)(,|$)/;

  function getTransitionInfo (el, expectedType) {
    var styles = window.getComputedStyle(el);
    var transitioneDelays = styles[transitionProp + 'Delay'].split(', ');
    var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
    var transitionTimeout = getTimeout(transitioneDelays, transitionDurations);
    var animationDelays = styles[animationProp + 'Delay'].split(', ');
    var animationDurations = styles[animationProp + 'Duration'].split(', ');
    var animationTimeout = getTimeout(animationDelays, animationDurations);

    var type;
    var timeout = 0;
    var propCount = 0;
    /* istanbul ignore if */
    if (expectedType === TRANSITION) {
      if (transitionTimeout > 0) {
        type = TRANSITION;
        timeout = transitionTimeout;
        propCount = transitionDurations.length;
      }
    } else if (expectedType === ANIMATION) {
      if (animationTimeout > 0) {
        type = ANIMATION;
        timeout = animationTimeout;
        propCount = animationDurations.length;
      }
    } else {
      timeout = Math.max(transitionTimeout, animationTimeout);
      type = timeout > 0
        ? transitionTimeout > animationTimeout
          ? TRANSITION
          : ANIMATION
        : null;
      propCount = type
        ? type === TRANSITION
          ? transitionDurations.length
          : animationDurations.length
        : 0;
    }
    var hasTransform =
      type === TRANSITION &&
      transformRE.test(styles[transitionProp + 'Property']);
    return {
      type: type,
      timeout: timeout,
      propCount: propCount,
      hasTransform: hasTransform
    }
  }

  function getTimeout (delays, durations) {
    /* istanbul ignore next */
    while (delays.length < durations.length) {
      delays = delays.concat(delays);
    }

    return Math.max.apply(null, durations.map(function (d, i) {
      return toMs(d) + toMs(delays[i])
    }))
  }

  function toMs (s) {
    return Number(s.slice(0, -1)) * 1000
  }

  /*  */

  function enter (vnode) {
    var el = vnode.elm;

    // call leave callback now
    if (el._leaveCb) {
      el._leaveCb.cancelled = true;
      el._leaveCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (!data) {
      return
    }

    /* istanbul ignore if */
    if (el._enterCb || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var enterClass = data.enterClass;
    var enterActiveClass = data.enterActiveClass;
    var appearClass = data.appearClass;
    var appearActiveClass = data.appearActiveClass;
    var beforeEnter = data.beforeEnter;
    var enter = data.enter;
    var afterEnter = data.afterEnter;
    var enterCancelled = data.enterCancelled;
    var beforeAppear = data.beforeAppear;
    var appear = data.appear;
    var afterAppear = data.afterAppear;
    var appearCancelled = data.appearCancelled;

    // activeInstance will always be the <transition> component managing this
    // transition. One edge case to check is when the <transition> is placed
    // as the root node of a child component. In that case we need to check
    // <transition>'s parent for appear check.
    var transitionNode = activeInstance.$vnode;
    var context = transitionNode && transitionNode.parent
      ? transitionNode.parent.context
      : activeInstance;

    var isAppear = !context._isMounted || !vnode.isRootInsert;

    if (isAppear && !appear && appear !== '') {
      return
    }

    var startClass = isAppear ? appearClass : enterClass;
    var activeClass = isAppear ? appearActiveClass : enterActiveClass;
    var beforeEnterHook = isAppear ? (beforeAppear || beforeEnter) : beforeEnter;
    var enterHook = isAppear ? (typeof appear === 'function' ? appear : enter) : enter;
    var afterEnterHook = isAppear ? (afterAppear || afterEnter) : afterEnter;
    var enterCancelledHook = isAppear ? (appearCancelled || enterCancelled) : enterCancelled;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl =
      enterHook &&
      // enterHook may be a bound method which exposes
      // the length of original fn as _length
      (enterHook._length || enterHook.length) > 1;

    var cb = el._enterCb = once(function () {
      if (expectsCSS) {
        removeTransitionClass(el, activeClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, startClass);
        }
        enterCancelledHook && enterCancelledHook(el);
      } else {
        afterEnterHook && afterEnterHook(el);
      }
      el._enterCb = null;
    });

    if (!vnode.data.show) {
      // remove pending leave element on enter by injecting an insert hook
      mergeVNodeHook(vnode.data.hook || (vnode.data.hook = {}), 'insert', function () {
        var parent = el.parentNode;
        var pendingNode = parent && parent._pending && parent._pending[vnode.key];
        if (pendingNode && pendingNode.tag === vnode.tag && pendingNode.elm._leaveCb) {
          pendingNode.elm._leaveCb();
        }
        enterHook && enterHook(el, cb);
      }, 'transition-insert');
    }

    // start enter transition
    beforeEnterHook && beforeEnterHook(el);
    if (expectsCSS) {
      addTransitionClass(el, startClass);
      addTransitionClass(el, activeClass);
      nextFrame(function () {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled && !userWantsControl) {
          whenTransitionEnds(el, type, cb);
        }
      });
    }

    if (vnode.data.show) {
      enterHook && enterHook(el, cb);
    }

    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }

  function leave (vnode, rm) {
    var el = vnode.elm;

    // call enter callback now
    if (el._enterCb) {
      el._enterCb.cancelled = true;
      el._enterCb();
    }

    var data = resolveTransition(vnode.data.transition);
    if (!data) {
      return rm()
    }

    /* istanbul ignore if */
    if (el._leaveCb || el.nodeType !== 1) {
      return
    }

    var css = data.css;
    var type = data.type;
    var leaveClass = data.leaveClass;
    var leaveActiveClass = data.leaveActiveClass;
    var beforeLeave = data.beforeLeave;
    var leave = data.leave;
    var afterLeave = data.afterLeave;
    var leaveCancelled = data.leaveCancelled;
    var delayLeave = data.delayLeave;

    var expectsCSS = css !== false && !isIE9;
    var userWantsControl =
      leave &&
      // leave hook may be a bound method which exposes
      // the length of original fn as _length
      (leave._length || leave.length) > 1;

    var cb = el._leaveCb = once(function () {
      if (el.parentNode && el.parentNode._pending) {
        el.parentNode._pending[vnode.key] = null;
      }
      if (expectsCSS) {
        removeTransitionClass(el, leaveActiveClass);
      }
      if (cb.cancelled) {
        if (expectsCSS) {
          removeTransitionClass(el, leaveClass);
        }
        leaveCancelled && leaveCancelled(el);
      } else {
        rm();
        afterLeave && afterLeave(el);
      }
      el._leaveCb = null;
    });

    if (delayLeave) {
      delayLeave(performLeave);
    } else {
      performLeave();
    }

    function performLeave () {
      // the delayed leave may have already been cancelled
      if (cb.cancelled) {
        return
      }
      // record leaving element
      if (!vnode.data.show) {
        (el.parentNode._pending || (el.parentNode._pending = {}))[vnode.key] = vnode;
      }
      beforeLeave && beforeLeave(el);
      if (expectsCSS) {
        addTransitionClass(el, leaveClass);
        addTransitionClass(el, leaveActiveClass);
        nextFrame(function () {
          removeTransitionClass(el, leaveClass);
          if (!cb.cancelled && !userWantsControl) {
            whenTransitionEnds(el, type, cb);
          }
        });
      }
      leave && leave(el, cb);
      if (!expectsCSS && !userWantsControl) {
        cb();
      }
    }
  }

  function resolveTransition (def$$1) {
    if (!def$$1) {
      return
    }
    /* istanbul ignore else */
    if (typeof def$$1 === 'object') {
      var res = {};
      if (def$$1.css !== false) {
        extend(res, autoCssTransition(def$$1.name || 'v'));
      }
      extend(res, def$$1);
      return res
    } else if (typeof def$$1 === 'string') {
      return autoCssTransition(def$$1)
    }
  }

  var autoCssTransition = cached(function (name) {
    return {
      enterClass: (name + "-enter"),
      leaveClass: (name + "-leave"),
      appearClass: (name + "-enter"),
      enterActiveClass: (name + "-enter-active"),
      leaveActiveClass: (name + "-leave-active"),
      appearActiveClass: (name + "-enter-active")
    }
  });

  function once (fn) {
    var called = false;
    return function () {
      if (!called) {
        called = true;
        fn();
      }
    }
  }

  var transition = inBrowser ? {
    create: function create (_, vnode) {
      if (!vnode.data.show) {
        enter(vnode);
      }
    },
    remove: function remove (vnode, rm) {
      /* istanbul ignore else */
      if (!vnode.data.show) {
        leave(vnode, rm);
      } else {
        rm();
      }
    }
  } : {};

  var platformModules = [
    attrs,
    klass,
    events,
    domProps,
    style,
    transition
  ];

  /*  */

  // the directive module should be applied last, after all
  // built-in modules have been applied.
  var modules = platformModules.concat(baseModules);

  var patch$1 = createPatchFunction({ nodeOps: nodeOps, modules: modules });

  /* istanbul ignore if */
  if (isIE9) {
    // http://www.matts411.com/post/internet-explorer-9-oninput/
    document.addEventListener('selectionchange', function () {
      var el = document.activeElement;
      if (el && el.vmodel) {
        trigger(el, 'input');
      }
    });
  }

  var model = {
    inserted: function inserted (el, binding, vnode) {
      if ("production" !== 'production') {}
      if (vnode.tag === 'select') {
        var cb = function () {
          setSelected(el, binding, vnode.context);
        };
        cb();
        /* istanbul ignore if */
        if (isIE || isEdge) {
          setTimeout(cb, 0);
        }
      } else if (
        (vnode.tag === 'textarea' || el.type === 'text') &&
        !binding.modifiers.lazy
      ) {
        if (!isAndroid) {
          el.addEventListener('compositionstart', onCompositionStart);
          el.addEventListener('compositionend', onCompositionEnd);
        }
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    },
    componentUpdated: function componentUpdated (el, binding, vnode) {
      if (vnode.tag === 'select') {
        setSelected(el, binding, vnode.context);
        // in case the options rendered by v-for have changed,
        // it's possible that the value is out-of-sync with the rendered options.
        // detect such cases and filter out values that no longer has a matching
        // option in the DOM.
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, el.options); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, el.options);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  };

  function setSelected (el, binding, vm) {
    var value = binding.value;
    var isMultiple = el.multiple;
    if (isMultiple && !Array.isArray(value)) {
      "production" !== 'production' && warn$1(
        "<select multiple v-model=\"" + (binding.expression) + "\"> " +
        "expects an Array value for its binding, but got " + (Object.prototype.toString.call(value).slice(8, -1)),
        vm
      );
      return
    }
    var selected, option;
    for (var i = 0, l = el.options.length; i < l; i++) {
      option = el.options[i];
      if (isMultiple) {
        selected = looseIndexOf(value, getValue(option)) > -1;
        if (option.selected !== selected) {
          option.selected = selected;
        }
      } else {
        if (looseEqual(getValue(option), value)) {
          if (el.selectedIndex !== i) {
            el.selectedIndex = i;
          }
          return
        }
      }
    }
    if (!isMultiple) {
      el.selectedIndex = -1;
    }
  }

  function hasNoMatchingOption (value, options) {
    for (var i = 0, l = options.length; i < l; i++) {
      if (looseEqual(getValue(options[i]), value)) {
        return false
      }
    }
    return true
  }

  function getValue (option) {
    return '_value' in option
      ? option._value
      : option.value
  }

  function onCompositionStart (e) {
    e.target.composing = true;
  }

  function onCompositionEnd (e) {
    e.target.composing = false;
    trigger(e.target, 'input');
  }

  function trigger (el, type) {
    var e = document.createEvent('HTMLEvents');
    e.initEvent(type, true, true);
    el.dispatchEvent(e);
  }

  /*  */

  // recursively search for possible transition defined inside the component root
  function locateNode (vnode) {
    return vnode.child && (!vnode.data || !vnode.data.transition)
      ? locateNode(vnode.child._vnode)
      : vnode
  }

  var show = {
    bind: function bind (el, ref, vnode) {
      var value = ref.value;

      vnode = locateNode(vnode);
      var transition = vnode.data && vnode.data.transition;
      if (value && transition && !isIE9) {
        enter(vnode);
      }
      var originalDisplay = el.style.display === 'none' ? '' : el.style.display;
      el.style.display = value ? originalDisplay : 'none';
      el.__vOriginalDisplay = originalDisplay;
    },
    update: function update (el, ref, vnode) {
      var value = ref.value;
      var oldValue = ref.oldValue;

      /* istanbul ignore if */
      if (value === oldValue) { return }
      vnode = locateNode(vnode);
      var transition = vnode.data && vnode.data.transition;
      if (transition && !isIE9) {
        if (value) {
          enter(vnode);
          el.style.display = el.__vOriginalDisplay;
        } else {
          leave(vnode, function () {
            el.style.display = 'none';
          });
        }
      } else {
        el.style.display = value ? el.__vOriginalDisplay : 'none';
      }
    }
  };

  var platformDirectives = {
    model: model,
    show: show
  };

  /*  */

  // Provides transition support for a single element/component.
  // supports transition mode (out-in / in-out)

  var transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String
  };

  // in case the child is also an abstract component, e.g. <keep-alive>
  // we want to recursively retrieve the real component to be rendered
  function getRealChild (vnode) {
    var compOptions = vnode && vnode.componentOptions;
    if (compOptions && compOptions.Ctor.options.abstract) {
      return getRealChild(getFirstComponentChild(compOptions.children))
    } else {
      return vnode
    }
  }

  function extractTransitionData (comp) {
    var data = {};
    var options = comp.$options;
    // props
    for (var key in options.propsData) {
      data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    var listeners = options._parentListeners;
    for (var key$1 in listeners) {
      data[camelize(key$1)] = listeners[key$1].fn;
    }
    return data
  }

  function placeholder (h, rawChild) {
    return /\d-keep-alive$/.test(rawChild.tag)
      ? h('keep-alive')
      : null
  }

  function hasParentTransition (vnode) {
    while ((vnode = vnode.parent)) {
      if (vnode.data.transition) {
        return true
      }
    }
  }

  var Transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render: function render (h) {
      var this$1 = this;

      var children = this.$slots.default;
      if (!children) {
        return
      }

      // filter out text nodes (possible whitespaces)
      children = children.filter(function (c) { return c.tag; });
      /* istanbul ignore if */
      if (!children.length) {
        return
      }

      // warn multiple elements
      if ("production" !== 'production' && children.length > 1) {}

      var mode = this.mode;

      // warn invalid mode
      if ("production" !== 'production' &&
          mode && mode !== 'in-out' && mode !== 'out-in') {}

      var rawChild = children[0];

      // if this is a component root node and the component's
      // parent container node also has transition, skip.
      if (hasParentTransition(this.$vnode)) {
        return rawChild
      }

      // apply transition data to child
      // use getRealChild() to ignore abstract components e.g. keep-alive
      var child = getRealChild(rawChild);
      /* istanbul ignore if */
      if (!child) {
        return rawChild
      }

      if (this._leaving) {
        return placeholder(h, rawChild)
      }

      var key = child.key = child.key == null || child.isStatic
        ? ("__v" + (child.tag + this._uid) + "__")
        : child.key;
      var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
      var oldRawChild = this._vnode;
      var oldChild = getRealChild(oldRawChild);

      // mark v-show
      // so that the transition module can hand over the control to the directive
      if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
        child.data.show = true;
      }

      if (oldChild && oldChild.data && oldChild.key !== key) {
        // replace old child transition data with fresh one
        // important for dynamic transitions!
        var oldData = oldChild.data.transition = extend({}, data);

        // handle transition mode
        if (mode === 'out-in') {
          // return placeholder node and queue update when leave finishes
          this._leaving = true;
          mergeVNodeHook(oldData, 'afterLeave', function () {
            this$1._leaving = false;
            this$1.$forceUpdate();
          }, key);
          return placeholder(h, rawChild)
        } else if (mode === 'in-out') {
          var delayedLeave;
          var performLeave = function () { delayedLeave(); };
          mergeVNodeHook(data, 'afterEnter', performLeave, key);
          mergeVNodeHook(data, 'enterCancelled', performLeave, key);
          mergeVNodeHook(oldData, 'delayLeave', function (leave) {
            delayedLeave = leave;
          }, key);
        }
      }

      return rawChild
    }
  };

  /*  */

  // Provides transition support for list items.
  // supports move transitions using the FLIP technique.

  // Because the vdom's children update algorithm is "unstable" - i.e.
  // it doesn't guarantee the relative positioning of removed elements,
  // we force transition-group to update its children into two passes:
  // in the first pass, we remove all nodes that need to be removed,
  // triggering their leaving transition; in the second pass, we insert/move
  // into the final disired state. This way in the second pass removed
  // nodes will remain where they should be.

  var props = extend({
    tag: String,
    moveClass: String
  }, transitionProps);

  delete props.mode;

  var TransitionGroup = {
    props: props,

    render: function render (h) {
      var tag = this.tag || this.$vnode.data.tag || 'span';
      var map = Object.create(null);
      var prevChildren = this.prevChildren = this.children;
      var rawChildren = this.$slots.default || [];
      var children = this.children = [];
      var transitionData = extractTransitionData(this);

      for (var i = 0; i < rawChildren.length; i++) {
        var c = rawChildren[i];
        if (c.tag) {
          if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
            children.push(c);
            map[c.key] = c
            ;(c.data || (c.data = {})).transition = transitionData;
          } else if ("production" !== 'production') {}
        }
      }

      if (prevChildren) {
        var kept = [];
        var removed = [];
        for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
          var c$1 = prevChildren[i$1];
          c$1.data.transition = transitionData;
          c$1.data.pos = c$1.elm.getBoundingClientRect();
          if (map[c$1.key]) {
            kept.push(c$1);
          } else {
            removed.push(c$1);
          }
        }
        this.kept = h(tag, null, kept);
        this.removed = removed;
      }

      return h(tag, null, children)
    },

    beforeUpdate: function beforeUpdate () {
      // force removing pass
      this.__patch__(
        this._vnode,
        this.kept,
        false, // hydrating
        true // removeOnly (!important, avoids unnecessary moves)
      );
      this._vnode = this.kept;
    },

    updated: function updated () {
      var children = this.prevChildren;
      var moveClass = this.moveClass || (this.name + '-move');
      if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
        return
      }

      // we divide the work into three loops to avoid mixing DOM reads and writes
      // in each iteration - which helps prevent layout thrashing.
      children.forEach(callPendingCbs);
      children.forEach(recordPosition);
      children.forEach(applyTranslation);

      // force reflow to put everything in position
      var f = document.body.offsetHeight; // eslint-disable-line

      children.forEach(function (c) {
        if (c.data.moved) {
          var el = c.elm;
          var s = el.style;
          addTransitionClass(el, moveClass);
          s.transform = s.WebkitTransform = s.transitionDuration = '';
          el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
            if (!e || /transform$/.test(e.propertyName)) {
              el.removeEventListener(transitionEndEvent, cb);
              el._moveCb = null;
              removeTransitionClass(el, moveClass);
            }
          });
        }
      });
    },

    methods: {
      hasMove: function hasMove (el, moveClass) {
        /* istanbul ignore if */
        if (!hasTransition) {
          return false
        }
        if (this._hasMove != null) {
          return this._hasMove
        }
        addTransitionClass(el, moveClass);
        var info = getTransitionInfo(el);
        removeTransitionClass(el, moveClass);
        return (this._hasMove = info.hasTransform)
      }
    }
  };

  function callPendingCbs (c) {
    /* istanbul ignore if */
    if (c.elm._moveCb) {
      c.elm._moveCb();
    }
    /* istanbul ignore if */
    if (c.elm._enterCb) {
      c.elm._enterCb();
    }
  }

  function recordPosition (c) {
    c.data.newPos = c.elm.getBoundingClientRect();
  }

  function applyTranslation (c) {
    var oldPos = c.data.pos;
    var newPos = c.data.newPos;
    var dx = oldPos.left - newPos.left;
    var dy = oldPos.top - newPos.top;
    if (dx || dy) {
      c.data.moved = true;
      var s = c.elm.style;
      s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
      s.transitionDuration = '0s';
    }
  }

  var platformComponents = {
    Transition: Transition,
    TransitionGroup: TransitionGroup
  };

  /*  */

  // install platform specific utils
  Vue$1.config.isUnknownElement = isUnknownElement;
  Vue$1.config.isReservedTag = isReservedTag;
  Vue$1.config.getTagNamespace = getTagNamespace;
  Vue$1.config.mustUseProp = mustUseProp;

  // install platform runtime directives & components
  extend(Vue$1.options.directives, platformDirectives);
  extend(Vue$1.options.components, platformComponents);

  // install platform patch function
  Vue$1.prototype.__patch__ = config._isServer ? noop : patch$1;

  // wrap mount
  Vue$1.prototype.$mount = function (
    el,
    hydrating
  ) {
    el = el && !config._isServer ? query(el) : undefined;
    return this._mount(el, hydrating)
  };

  // devtools global hook
  /* istanbul ignore next */
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue$1);
      } else if (
        "production" !== 'production' &&
        inBrowser && /Chrome\/\d+/.test(window.navigator.userAgent)
      ) {}
    }
  }, 0);

  var vue_common = Vue$1;

  var LEFT_ARROW = '«'
  var RIGHT_ARROW = '»'
  var ELLIPSES = '…'

  var LimitedLinksGenerator = function LimitedLinksGenerator (listOfPages, currentPage, limit) {
    this.listOfPages = listOfPages
    this.lastPage = listOfPages.length - 1
    this.currentPage = currentPage === this.lastPage
      ? this.lastPage - 1
      : currentPage
    this.limit = limit
  };

  LimitedLinksGenerator.prototype.generate = function generate () {
    var firstHalf = this._buildFirstHalf()
    var secondHalf = this._buildSecondHalf()
    return firstHalf.concat( secondHalf)
  };

  LimitedLinksGenerator.prototype._buildFirstHalf = function _buildFirstHalf () {
    var firstHalf = this._allPagesButLast()
      .slice(
        this._currentChunkIndex(),
        this._currentChunkIndex() + this.limit
      )
    // Add left arrow if needed
    if (this.currentPage >= this.limit) {
      firstHalf.unshift(LEFT_ARROW)
    }
    // Add ellipses if needed
    if (this.lastPage - this.limit > this._currentChunkIndex()) {
      firstHalf.push(ELLIPSES)
    }
    return firstHalf
  };

  LimitedLinksGenerator.prototype._buildSecondHalf = function _buildSecondHalf () {
    var secondHalf = [this.lastPage]
    // Add right arrow if needed
    if (this._currentChunkIndex() + this.limit < this.lastPage) {
      secondHalf.push(RIGHT_ARROW)
    }
    return secondHalf
  };

  LimitedLinksGenerator.prototype._currentChunkIndex = function _currentChunkIndex () {
    var currentChunk = Math.floor(this.currentPage / this.limit)
    return currentChunk * this.limit 
  };

  LimitedLinksGenerator.prototype._allPagesButLast = function _allPagesButLast () {
      var this$1 = this;

    return this.listOfPages.filter(function (n) { return n !== this$1.lastPage; })
  };

  var PaginateLinks = {
    name: 'paginate-links',
    props: {
      for: {
        type: String,
        required: true
      },
      limit: {
        type: Number,
        default: 0
      },
      simple: {
        type: Object,
        default: null,
        validator: function validator (obj) {
          return obj.next && obj.prev
        }
      }
    },
    data: function data () {
      return {
        listOfPages: []
      }
    },
    computed: {
      currentPage: {
        get: function get () {
          if (this.$parent.paginate[this.for]) {
            return this.$parent.paginate[this.for].page
          }
        },
        set: function set (page) {
          this.$parent.paginate[this.for].page = page
        }
      }
    },
    mounted: function mounted () {
      var this$1 = this;

      if (this.simple && this.limit) {
        warn(("<paginate-links for=\"" + (this.for) + "\"> 'simple' and 'limit' props can't be used at the same time. In this case, 'simple' will take precedence, and 'limit' will be ignored."), this.$parent, 'warn')
      }
      if (this.simple && !this.simple.next) {
        warn(("<paginate-links for=\"" + (this.for) + "\"> 'simple' prop doesn't contain 'next' value."), this.$parent)
      }
      if (this.simple && !this.simple.prev) {
        warn(("<paginate-links for=\"" + (this.for) + "\"> 'simple' prop doesn't contain 'prev' value."), this.$parent)
      }
      vue_common.nextTick(function () {
        this$1.updateListOfPages()
      })
    },
    watch: {
      '$parent.paginate': {
        handler: function handler () {
          this.updateListOfPages()
        },
        deep: true
      },
      currentPage: function currentPage (toPage, fromPage) {
        this.$emit('change', toPage + 1, fromPage + 1)
      }
    },
    methods: {
      updateListOfPages: function updateListOfPages () {
        var target = getTargetPaginateComponent(this.$parent.$children, this.for)
        if (!target) {
          warn(("<paginate-links for=\"" + (this.for) + "\"> can't be used without its companion <paginate name=\"" + (this.for) + "\">"), this.$parent)
          return
        }
        var numberOfPages = Math.ceil(target.list.length / target.per)
        this.listOfPages = getListOfPageNumbers(numberOfPages)
      }
    },
    render: function render (h) {
      var links = this.simple
        ? getSimpleLinks(this, h)
        : this.limit > 0
        ? getLimitedLinks(this, h)
        : getFullLinks(this, h)

      return h('ul', {
        class: ['paginate-links', this.for]
      }, links)
    }
  }

  function getFullLinks (vm, h) {
    return vm.listOfPages.map(function (number) {
      var data = {
        on: {
          click: function (e) {
            e.preventDefault()
            vm.currentPage = number
          }
        }
      }
      var liClass = vm.currentPage === number ? 'active' : ''
      return h('li', { class: liClass }, [h('a', data, number + 1)])
    })
  }

  function getLimitedLinks (vm, h) {
    var limitedLinks = new LimitedLinksGenerator(
      vm.listOfPages,
      vm.currentPage,
      vm.limit
    ).generate()
    return limitedLinks.map(function (link) {
      var data = {
        on: {
          click: function (e) {
            e.preventDefault()
            vm.currentPage = getTargetPageForLink(link, vm.limit, vm.currentPage)
          }
        }
      }
      var liClasses = getClassesForLink(link, vm.currentPage)
      // If the link is a number,
      // then incremented by 1 (since it's 0 based).
      // otherwise, do nothing (so, it's a symbol). 
      var text = Number.isInteger(link) ? link + 1 : link
      return h('li', { class: liClasses }, [h('a', data, text)])
    })
  }

  function getSimpleLinks (vm, h) {
    var lastPage = vm.listOfPages.length - 1
    var prevData = {
      on: {
        click: function (e) {
          e.preventDefault()
          if (vm.currentPage > 0) { vm.currentPage -= 1 }
        }
      }
    }
    var nextData = {
      on: {
        click: function (e) {
          e.preventDefault()
          if (vm.currentPage < lastPage) { vm.currentPage += 1 }
        }
      }
    }
    var nextListData = { class: ['next', vm.currentPage >= lastPage ? 'disabled' : ''] }
    var prevListData = { class: ['prev', vm.currentPage <= 0 ? 'disabled' : ''] }
    var prevLink = h('li', prevListData, [h('a', prevData, vm.simple.prev)])
    var nextLink = h('li', nextListData, [h('a', nextData, vm.simple.next)])
    return [prevLink, nextLink]
  }

  function getTargetPaginateComponent (children, targetName) {
    return children
      .filter(function (child) { return (child.$vnode.componentOptions.tag === 'paginate'); })
      .find(function (child) { return child.name === targetName; })
  }

  function getListOfPageNumbers (numberOfPages) {
    // converts number of pages into an array
    // that contains each individual page number
    // For Example: 4 => [0, 1, 2, 3]
    return Array.apply(null, { length: numberOfPages })
      .map(function (val, index) { return index; })
  }

  function getClassesForLink(link, currentPage) {
    var liClass = []
    if (link === LEFT_ARROW) {
      liClass.push('left-arrow')
    } else if (link === RIGHT_ARROW) {
      liClass.push('right-arrow')
    } else if (link === ELLIPSES) {
      liClass.push('ellipses')
    } else {
      liClass.push('number')
    }

    if (link === currentPage) {
      liClass.push('active')
    }
    return liClass
  }

  function getTargetPageForLink (link, limit, currentPage) {
    var currentChunk = Math.floor(currentPage / limit)
    if (link === RIGHT_ARROW || link === ELLIPSES) {
      return (currentChunk + 1) * limit
    } else if (link === LEFT_ARROW) {
      return (currentChunk - 1) * limit
    }
    // which is number
    return link
  }

  function paginateDataGenerator (listNames) {
    if ( listNames === void 0 ) listNames = [];

    return listNames.reduce(function (curr, listName) {
      curr[listName] = {
        list: [],
        page: 0
      }
      return curr
    }, {})
  }

  var vuePaginate = {}

  vuePaginate.install = function (Vue) {
    Vue.mixin({
      created: function created () {
        if (this.paginate !== 'undefined' && this.paginate instanceof Array) {
          this.paginate = paginateDataGenerator(this.paginate)
        }
      },
      methods: {
        paginated: function paginated (listName) {
          if (!this.paginate || !this.paginate[listName]) {
            warn(("'" + listName + "' is not registered in 'paginate' array."), this)
            return
          }
          return this.paginate[listName].list
        }
      }
    })
    Vue.component('paginate', Paginate)
    Vue.component('paginate-links', PaginateLinks)
  }

  if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(vuePaginate)
  }

  return vuePaginate;

}));