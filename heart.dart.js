function Isolate() {}
init();

var $ = Isolate.$isolateProperties;
Isolate.$defineClass("ExceptionImplementation", "Object", ["_msg"], {
 toString$0: function() {
  if (this._msg === (void 0)) {
    var t0 = 'Exception';
  } else {
    t0 = 'Exception: ' + $.stringToString(this._msg);
  }
  return t0;
 }
});

Isolate.$defineClass("HashMapImplementation", "Object", ["_numberOfDeleted", "_numberOfEntries", "_loadLimit", "_values", "_keys?"], {
 toString$0: function() {
  return $.mapToString(this);
 },
 containsKey$1: function(key) {
  return !$.eqB(this._probeForLookup$1(key), -1);
 },
 forEach$1: function(f) {
  var length$ = $.get$length(this._keys);
  for (var i = 0; $.ltB(i, length$); i = i + 1) {
    var key = $.index(this._keys, i);
    var t0 = !(key === (void 0));
    if (t0) {
      var t1 = !(key === $.CTC5);
    } else {
      t1 = t0;
    }
    if (t1) {
      f.$call$2(key, $.index(this._values, i));
    } else {
    }
  }
 },
 get$length: function() {
  return this._numberOfEntries;
 },
 isEmpty$0: function() {
  return $.eq(this._numberOfEntries, 0);
 },
 operator$index$1: function(key) {
  var index = this._probeForLookup$1(key);
  if ($.ltB(index, 0)) {
    return;
  } else {
  }
  return $.index(this._values, index);
 },
 operator$indexSet$2: function(key, value) {
  this._ensureCapacity$0();
  var index = this._probeForAdding$1(key);
  var t0 = $.index(this._keys, index) === (void 0);
  if (!t0) {
    var t1 = $.index(this._keys, index) === $.CTC5;
  } else {
    t1 = t0;
  }
  if (t1) {
    this._numberOfEntries = $.add(this._numberOfEntries, 1);
  } else {
  }
  $.indexSet(this._keys, index, key);
  $.indexSet(this._values, index, value);
 },
 clear$0: function() {
  this._numberOfEntries = 0;
  this._numberOfDeleted = 0;
  var length$ = $.get$length(this._keys);
  for (var i = 0; $.ltB(i, length$); i = i + 1) {
    $.indexSet(this._keys, i, (void 0));
    $.indexSet(this._values, i, (void 0));
  }
 },
 _grow$1: function(newCapacity) {
  $.assert($._isPowerOfTwo(newCapacity));
  var capacity = $.get$length(this._keys);
  this._loadLimit = $._computeLoadLimit(newCapacity);
  var oldKeys = this._keys;
  if (typeof oldKeys !== 'string' && (typeof oldKeys !== 'object'||oldKeys.constructor !== Array)) return this._grow$1$bailout(newCapacity, 1, capacity, oldKeys);
  var oldValues = this._values;
  if (typeof oldValues !== 'string' && (typeof oldValues !== 'object'||oldValues.constructor !== Array)) return this._grow$1$bailout(newCapacity, 2, oldKeys, capacity, oldValues);
  this._keys = $.List(newCapacity);
  var t0 = $.List(newCapacity);
  $.setRuntimeTypeInfo(t0, ({E: 'V'}));
  this._values = t0;
  for (var i = 0; $.ltB(i, capacity); i = i + 1) {
    var t1 = oldKeys.length;
    if (i < 0 || i >= t1) throw $.ioore(i);
    var t2 = oldKeys[i];
    var t3 = t2 === (void 0);
    if (!t3) {
      var t4 = t2 === $.CTC5;
    } else {
      t4 = t3;
    }
    if (t4) {
      continue;
    } else {
    }
    var t5 = oldValues.length;
    if (i < 0 || i >= t5) throw $.ioore(i);
    var t6 = oldValues[i];
    var newIndex = this._probeForAdding$1(t2);
    $.indexSet(this._keys, newIndex, t2);
    $.indexSet(this._values, newIndex, t6);
  }
  this._numberOfDeleted = 0;
 },
 _grow$1$bailout: function(newCapacity, state, env0, env1, env2) {
  switch (state) {
    case 1:
      capacity = env0;
      oldKeys = env1;
      break;
    case 2:
      oldKeys = env0;
      capacity = env1;
      oldValues = env2;
      break;
  }
  switch (state) {
    case 0:
      $.assert($._isPowerOfTwo(newCapacity));
      var capacity = $.get$length(this._keys);
      this._loadLimit = $._computeLoadLimit(newCapacity);
      var oldKeys = this._keys;
    case 1:
      state = 0;
      var oldValues = this._values;
    case 2:
      state = 0;
      this._keys = $.List(newCapacity);
      var t0 = $.List(newCapacity);
      $.setRuntimeTypeInfo(t0, ({E: 'V'}));
      this._values = t0;
      var i = 0;
      L0: while (true) {
        if (!$.ltB(i, capacity)) break L0;
        c$0:{
          var key = $.index(oldKeys, i);
          var t1 = key === (void 0);
          if (!t1) {
            var t2 = key === $.CTC5;
          } else {
            t2 = t1;
          }
          if (t2) {
            break c$0;
          } else {
          }
          var value = $.index(oldValues, i);
          var newIndex = this._probeForAdding$1(key);
          $.indexSet(this._keys, newIndex, key);
          $.indexSet(this._values, newIndex, value);
        }
        i = i + 1;
      }
      this._numberOfDeleted = 0;
  }
 },
 _ensureCapacity$0: function() {
  var newNumberOfEntries = $.add(this._numberOfEntries, 1);
  if ($.geB(newNumberOfEntries, this._loadLimit)) {
    this._grow$1($.mul($.get$length(this._keys), 2));
    return;
  } else {
  }
  var numberOfFree = $.sub($.sub($.get$length(this._keys), newNumberOfEntries), this._numberOfDeleted);
  if ($.gtB(this._numberOfDeleted, numberOfFree)) {
    this._grow$1($.get$length(this._keys));
  } else {
  }
 },
 _probeForLookup$1: function(key) {
  for (var hash = $._firstProbe($.hashCode(key), $.get$length(this._keys)), numberOfProbes = 1; true; hash = hash0, numberOfProbes = numberOfProbes0) {
    var existingKey = $.index(this._keys, hash);
    if (existingKey === (void 0)) {
      return -1;
    } else {
    }
    if ($.eqB(existingKey, key)) {
      return hash;
    } else {
      var numberOfProbes1 = numberOfProbes + 1;
    }
    var hash1 = $._nextProbe(hash, numberOfProbes, $.get$length(this._keys));
    var numberOfProbes0 = numberOfProbes1;
    var hash0 = hash1;
  }
 },
 _probeForAdding$1: function(key) {
  var hash = $._firstProbe($.hashCode(key), $.get$length(this._keys));
  if (hash !== (hash | 0)) return this._probeForAdding$1$bailout(key, 1, hash);
  for (var numberOfProbes = 1, hash0 = hash, insertionIndex = -1; true; numberOfProbes = numberOfProbes0, hash0 = hash1, insertionIndex = insertionIndex0) {
    var existingKey = $.index(this._keys, hash0);
    if (existingKey === (void 0)) {
      if ($.ltB(insertionIndex, 0)) {
        return hash0;
      } else {
      }
      return insertionIndex;
    } else {
      if ($.eqB(existingKey, key)) {
        return hash0;
      } else {
        var t0 = $.ltB(insertionIndex, 0);
        if (t0) {
          var t1 = $.CTC5 === existingKey;
        } else {
          t1 = t0;
        }
        if (t1) {
          var insertionIndex0 = hash0;
        } else {
          insertionIndex0 = insertionIndex;
        }
        var numberOfProbes1 = numberOfProbes + 1;
      }
    }
    var hash2 = $._nextProbe(hash0, numberOfProbes, $.get$length(this._keys));
    var numberOfProbes0 = numberOfProbes1;
    var hash1 = hash2;
  }
 },
 _probeForAdding$1$bailout: function(key, state, env0) {
  switch (state) {
    case 1:
      hash = env0;
      break;
  }
  switch (state) {
    case 0:
      var hash = $._firstProbe($.hashCode(key), $.get$length(this._keys));
    case 1:
      state = 0;
      var numberOfProbes = 1;
      var hash0 = hash;
      var insertionIndex = -1;
      L0: while (true) {
        if (!true) break L0;
        var existingKey = $.index(this._keys, hash0);
        if (existingKey === (void 0)) {
          if ($.ltB(insertionIndex, 0)) {
            return hash0;
          } else {
          }
          return insertionIndex;
        } else {
          if ($.eqB(existingKey, key)) {
            return hash0;
          } else {
            var t0 = $.ltB(insertionIndex, 0);
            if (t0) {
              var t1 = $.CTC5 === existingKey;
            } else {
              t1 = t0;
            }
            if (t1) {
              var insertionIndex0 = hash0;
            } else {
              insertionIndex0 = insertionIndex;
            }
            var numberOfProbes0 = numberOfProbes + 1;
          }
        }
        var hash1 = $._nextProbe(hash0, numberOfProbes, $.get$length(this._keys));
        var numberOfProbes1 = numberOfProbes0;
        var hash2 = hash1;
        numberOfProbes = numberOfProbes1;
        hash0 = hash2;
        insertionIndex = insertionIndex0;
      }
  }
 },
 HashMapImplementation$0: function() {
  this._numberOfEntries = 0;
  this._numberOfDeleted = 0;
  this._loadLimit = $._computeLoadLimit(8);
  this._keys = $.List(8);
  var t0 = $.List(8);
  $.setRuntimeTypeInfo(t0, ({E: 'V'}));
  this._values = t0;
 },
 is$Map: function() { return true; }
});

Isolate.$defineClass("HashSetImplementation", "Object", ["_backingMap?"], {
 toString$0: function() {
  return $.collectionToString(this);
 },
 iterator$0: function() {
  var t0 = $.HashSetIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({E: 'E'}));
  return t0;
 },
 get$length: function() {
  return $.get$length(this._backingMap);
 },
 isEmpty$0: function() {
  return $.isEmpty(this._backingMap);
 },
 forEach$1: function(f) {
  var t0 = ({});
  t0.f_1 = f;
  $.forEach(this._backingMap, new $.Closure5(t0));
 },
 contains$1: function(value) {
  return this._backingMap.containsKey$1(value);
 },
 add$1: function(value) {
  $.indexSet(this._backingMap, value, value);
 },
 clear$0: function() {
  $.clear(this._backingMap);
 },
 HashSetImplementation$0: function() {
  this._backingMap = $.HashMapImplementation$0();
 },
 is$Collection: function() { return true; }
});

Isolate.$defineClass("HashSetIterator", "Object", ["_nextValidIndex", "_entries"], {
 _advance$0: function() {
  var length$ = $.get$length(this._entries);
  var entry = (void 0);
  do {
    var t0 = $.add(this._nextValidIndex, 1);
    this._nextValidIndex = t0;
    if ($.geB(t0, length$)) {
      break;
    } else {
    }
    entry = $.index(this._entries, this._nextValidIndex);
    var t1 = entry === (void 0);
    if (!t1) {
      var t2 = entry === $.CTC5;
    } else {
      t2 = t1;
    }
  } while (t2);
 },
 next$0: function() {
  if (this.hasNext$0() !== true) {
    throw $.captureStackTrace($.CTC2);
  } else {
  }
  var res = $.index(this._entries, this._nextValidIndex);
  this._advance$0();
  return res;
 },
 hasNext$0: function() {
  if ($.geB(this._nextValidIndex, $.get$length(this._entries))) {
    return false;
  } else {
  }
  if ($.index(this._entries, this._nextValidIndex) === $.CTC5) {
    this._advance$0();
  } else {
  }
  return $.lt(this._nextValidIndex, $.get$length(this._entries));
 },
 HashSetIterator$1: function(set_) {
  this._advance$0();
 }
});

Isolate.$defineClass("_DeletedKeySentinel", "Object", [], {
});

Isolate.$defineClass("StringBufferImpl", "Object", ["_length", "_buffer"], {
 toString$0: function() {
  if ($.get$length(this._buffer) === 0) {
    return '';
  } else {
  }
  if ($.get$length(this._buffer) === 1) {
    return $.index(this._buffer, 0);
  } else {
  }
  var result = $.concatAll(this._buffer);
  $.clear(this._buffer);
  $.add$1(this._buffer, result);
  return result;
 },
 clear$0: function() {
  var t0 = $.List((void 0));
  $.setRuntimeTypeInfo(t0, ({E: 'String'}));
  this._buffer = t0;
  this._length = 0;
  return this;
 },
 add$1: function(obj) {
  var str = $.toString(obj);
  var t0 = str === (void 0);
  if (!t0) {
    var t1 = $.isEmpty(str) === true;
  } else {
    t1 = t0;
  }
  if (t1) {
    return this;
  } else {
  }
  $.add$1(this._buffer, str);
  this._length = $.add(this._length, $.get$length(str));
  return this;
 },
 isEmpty$0: function() {
  return this._length === 0;
 },
 get$length: function() {
  return this._length;
 },
 StringBufferImpl$1: function(content$) {
  this.clear$0();
  this.add$1(content$);
 }
});

Isolate.$defineClass("JSSyntaxRegExp", "Object", ["ignoreCase?", "multiLine?", "pattern?"], {
 allMatches$1: function(str) {
  $.checkString(str);
  return $._AllMatchesIterable$2(this, str);
 },
 hasMatch$1: function(str) {
  return $.regExpTest(this, $.checkString(str));
 },
 firstMatch$1: function(str) {
  var m = $.regExpExec(this, $.checkString(str));
  if (m === (void 0)) {
    return;
  } else {
  }
  var matchStart = $.regExpMatchStart(m);
  var matchEnd = $.add(matchStart, $.get$length($.index(m, 0)));
  return $.MatchImplementation$5(this.pattern, str, matchStart, matchEnd, m);
 },
 JSSyntaxRegExp$_globalVersionOf$1: function(other) {
  $.regExpAttachGlobalNative(this);
 },
 is$JSSyntaxRegExp: true
});

Isolate.$defineClass("MatchImplementation", "Object", ["_groups", "_end", "_start", "str", "pattern?"], {
 operator$index$1: function(index) {
  return this.group$1(index);
 },
 group$1: function(index) {
  return $.index(this._groups, index);
 }
});

Isolate.$defineClass("_AllMatchesIterable", "Object", ["_str", "_re"], {
 iterator$0: function() {
  return $._AllMatchesIterator$2(this._re, this._str);
 }
});

Isolate.$defineClass("_AllMatchesIterator", "Object", ["_done", "_next", "_str", "_re"], {
 hasNext$0: function() {
  if (this._done === true) {
    return false;
  } else {
    if (!$.eqNullB(this._next)) {
      return true;
    } else {
    }
  }
  this._next = this._re.firstMatch$1(this._str);
  if ($.eqNullB(this._next)) {
    this._done = true;
    return false;
  } else {
    return true;
  }
 },
 next$0: function() {
  if (this.hasNext$0() !== true) {
    throw $.captureStackTrace($.CTC2);
  } else {
  }
  var next = this._next;
  this._next = (void 0);
  return next;
 }
});

Isolate.$defineClass("ListIterator", "Object", ["list", "i"], {
 next$0: function() {
  if (this.hasNext$0() !== true) {
    throw $.captureStackTrace($.NoMoreElementsException$0());
  } else {
  }
  var value = (this.list[this.i]);
  this.i = $.add(this.i, 1);
  return value;
 },
 hasNext$0: function() {
  return $.lt(this.i, (this.list.length));
 }
});

Isolate.$defineClass("Closure6", "Object", [], {
 toString$0: function() {
  return 'Closure';
 }
});

Isolate.$defineClass("MetaInfo", "Object", ["set?", "tags", "tag?"], {
});

Isolate.$defineClass("StringMatch", "Object", ["pattern?", "str", "_lib2_start"], {
 group$1: function(group_) {
  if (!$.eqB(group_, 0)) {
    throw $.captureStackTrace($.IndexOutOfRangeException$1(group_));
  } else {
  }
  return this.pattern;
 },
 operator$index$1: function(g) {
  return this.group$1(g);
 }
});

Isolate.$defineClass("Object", "", [], {
 toString$0: function() {
  return $.objectToString(this);
 }
});

Isolate.$defineClass("IndexOutOfRangeException", "Object", ["_index"], {
 toString$0: function() {
  return 'IndexOutOfRangeException: ' + $.stringToString(this._index);
 }
});

Isolate.$defineClass("NoSuchMethodException", "Object", ["_existingArgumentNames", "_arguments", "_functionName", "_receiver"], {
 toString$0: function() {
  var sb = $.StringBufferImpl$1('');
  for (var i = 0; $.ltB(i, $.get$length(this._arguments)); i = i + 1) {
    if (i > 0) {
      sb.add$1(', ');
    } else {
    }
    sb.add$1($.index(this._arguments, i));
  }
  if (this._existingArgumentNames === (void 0)) {
    return 'NoSuchMethodException : method not found: \'' + $.stringToString(this._functionName) + '\'\nReceiver: ' + $.stringToString(this._receiver) + '\nArguments: [' + $.stringToString(sb) + ']';
  } else {
    var actualParameters = sb.toString$0();
    var sb0 = $.StringBufferImpl$1('');
    for (var i0 = 0; $.ltB(i0, $.get$length(this._existingArgumentNames)); i0 = i0 + 1) {
      if (i0 > 0) {
        sb0.add$1(', ');
      } else {
      }
      sb0.add$1($.index(this._existingArgumentNames, i0));
    }
    var formalParameters = sb0.toString$0();
    return 'NoSuchMethodException: incorrect number of arguments passed to method named \'' + $.stringToString(this._functionName) + '\'\nReceiver: ' + $.stringToString(this._receiver) + '\nTried calling: ' + $.stringToString(this._functionName) + '(' + $.stringToString(actualParameters) + ')\nFound: ' + $.stringToString(this._functionName) + '(' + $.stringToString(formalParameters) + ')';
  }
 }
});

Isolate.$defineClass("ObjectNotClosureException", "Object", [], {
 toString$0: function() {
  return 'Object is not closure';
 }
});

Isolate.$defineClass("IllegalArgumentException", "Object", ["_arg"], {
 toString$0: function() {
  return 'Illegal argument(s): ' + $.stringToString(this._arg);
 }
});

Isolate.$defineClass("StackOverflowException", "Object", [], {
 toString$0: function() {
  return 'Stack Overflow';
 }
});

Isolate.$defineClass("NullPointerException", "Object", ["arguments", "functionName"], {
 get$exceptionName: function() {
  return 'NullPointerException';
 },
 toString$0: function() {
  if ($.eqNullB(this.functionName)) {
    return this.get$exceptionName();
  } else {
    return '' + $.stringToString(this.get$exceptionName()) + ' : method: \'' + $.stringToString(this.functionName) + '\'\nReceiver: null\nArguments: ' + $.stringToString(this.arguments);
  }
 }
});

Isolate.$defineClass("NoMoreElementsException", "Object", [], {
 toString$0: function() {
  return 'NoMoreElementsException';
 }
});

Isolate.$defineClass("UnsupportedOperationException", "Object", ["_message"], {
 toString$0: function() {
  return 'UnsupportedOperationException: ' + $.stringToString(this._message);
 }
});

Isolate.$defineClass("IllegalJSRegExpException", "Object", ["_errmsg", "_pattern"], {
 toString$0: function() {
  return 'IllegalJSRegExpException: \'' + $.stringToString(this._pattern) + '\' \'' + $.stringToString(this._errmsg) + '\'';
 }
});

Isolate.$defineClass("_FixedSizeListIterator", "_VariableSizeListIterator", ["_lib_length", "_pos", "_array"], {
 hasNext$0: function() {
  return $.gt(this._lib_length, this._pos);
 }
});

Isolate.$defineClass("_VariableSizeListIterator", "Object", [], {
 next$0: function() {
  if (this.hasNext$0() !== true) {
    throw $.captureStackTrace($.CTC2);
  } else {
  }
  var t0 = this._array;
  var t1 = this._pos;
  this._pos = $.add(t1, 1);
  return $.index(t0, t1);
 },
 hasNext$0: function() {
  return $.gt($.get$length(this._array), this._pos);
 }
});

Isolate.$defineClass("Closure", "Closure6", ["box_0"], {
 $call$0: function() {
  return this.box_0.closure_1.$call$0();
 }
});

Isolate.$defineClass("Closure2", "Closure6", ["box_0"], {
 $call$0: function() {
  return this.box_0.closure_1.$call$1(this.box_0.arg1_2);
 }
});

Isolate.$defineClass("Closure3", "Closure6", ["box_0"], {
 $call$0: function() {
  return this.box_0.closure_1.$call$2(this.box_0.arg1_2, this.box_0.arg2_3);
 }
});

Isolate.$defineClass("Closure4", "Closure6", ["box_0"], {
 $call$2: function(k, v) {
  if (this.box_0.first_3 !== true) {
    $.add$1(this.box_0.result_1, ', ');
  } else {
  }
  this.box_0.first_3 = false;
  $._emitObject(k, this.box_0.result_1, this.box_0.visiting_2);
  $.add$1(this.box_0.result_1, ': ');
  $._emitObject(v, this.box_0.result_1, this.box_0.visiting_2);
 }
});

Isolate.$defineClass("Closure5", "Closure6", ["box_0"], {
 $call$2: function(key, value) {
  this.box_0.f_1.$call$1(key);
 }
});

$.mul$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a * b;
  } else {
  }
  return a.operator$mul$1(b);
};

$.iae = function(argument) {
  throw $.captureStackTrace($.IllegalArgumentException$1(argument));
};

$.floor = function(receiver) {
  if (!(typeof receiver === 'number')) {
    return receiver.floor$0();
  } else {
  }
  return Math.floor(receiver);
};

$.truncate = function(receiver) {
  if (!(typeof receiver === 'number')) {
    return receiver.truncate$0();
  } else {
  }
  if (receiver < 0) {
    var t0 = $.ceil(receiver);
  } else {
    t0 = $.floor(receiver);
  }
  return t0;
};

$.eqB = function(a, b) {
  if (typeof a === "object") {
    if (!!a.operator$eq$1) {
      return a.operator$eq$1(b) === true;
    } else {
      return a === b;
    }
  } else {
  }
  return a === b;
};

$._containsRef = function(c, ref) {
  for (var t0 = $.iterator(c); t0.hasNext$0() === true; ) {
    if (t0.next$0() === ref) {
      return true;
    } else {
    }
  }
  return false;
};

$.allMatchesInStringUnchecked = function(needle, haystack) {
  var result = $.List((void 0));
  $.setRuntimeTypeInfo(result, ({E: 'Match'}));
  var length$ = $.get$length(haystack);
  var patternLength = $.get$length(needle);
  if (patternLength !== (patternLength | 0)) return $.allMatchesInStringUnchecked$bailout(needle, haystack, 1, length$, result, patternLength);
  for (var startIndex = 0; true; startIndex = startIndex0) {
    var position = $.indexOf$2(haystack, needle, startIndex);
    if ($.eqB(position, -1)) {
      break;
    } else {
    }
    result.push($.StringMatch$3(position, haystack, needle));
    var endIndex = $.add(position, patternLength);
    if ($.eqB(endIndex, length$)) {
      break;
    } else {
      if ($.eqB(position, endIndex)) {
        var startIndex0 = $.add(startIndex, 1);
      } else {
        startIndex0 = endIndex;
      }
    }
  }
  return result;
};

$.le$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a <= b;
  } else {
  }
  return a.operator$le$1(b);
};

$.isJsArray = function(value) {
  var t0 = !(value === (void 0));
  if (t0) {
    var t1 = (value.constructor === Array);
  } else {
    t1 = t0;
  }
  return t1;
};

$.indexSet$slow = function(a, index, value) {
  if ($.isJsArray(a) === true) {
    if (!((typeof index === 'number') && (index === (index | 0)))) {
      throw $.captureStackTrace($.IllegalArgumentException$1(index));
    } else {
    }
    var t0 = index < 0;
    if (!t0) {
      var t1 = $.geB(index, $.get$length(a));
    } else {
      t1 = t0;
    }
    if (t1) {
      throw $.captureStackTrace($.IndexOutOfRangeException$1(index));
    } else {
    }
    $.checkMutable(a, 'indexed set');
    a[index] = value;
    return;
  } else {
  }
  a.operator$indexSet$2(index, value);
};

$._nextProbe = function(currentProbe, numberOfProbes, length$) {
  return $.and($.add(currentProbe, numberOfProbes), $.sub(length$, 1));
};

$._AllMatchesIterable$2 = function(_re, _str) {
  return new $._AllMatchesIterable(_str, _re);
};

$.allMatches = function(receiver, str) {
  if (!(typeof receiver === 'string')) {
    return receiver.allMatches$1(str);
  } else {
  }
  $.checkString(str);
  return $.allMatchesInStringUnchecked(receiver, str);
};

$.dynamicSetMetadata = function(inputTable) {
  var t0 = $.buildDynamicMetadata(inputTable);
  $._dynamicMetadata(t0);
};

$.substringUnchecked = function(receiver, startIndex, endIndex) {
  return receiver.substring(startIndex, endIndex);
};

$.get$length = function(receiver) {
  var t0 = typeof receiver === 'string';
  if (!t0) {
    var t1 = $.isJsArray(receiver) === true;
  } else {
    t1 = t0;
  }
  if (t1) {
    return receiver.length;
  } else {
    return receiver.get$length();
  }
};

$.ge$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a >= b;
  } else {
  }
  return a.operator$ge$1(b);
};

$.ListIterator$1 = function(list) {
  return new $.ListIterator(list, 0);
};

$.IllegalJSRegExpException$2 = function(_pattern, _errmsg) {
  return new $.IllegalJSRegExpException(_errmsg, _pattern);
};

$.toString = function(value) {
  if (typeof value == "object") {
    if ($.isJsArray(value) === true) {
      return $.collectionToString(value);
    } else {
      return value.toString$0();
    }
  } else {
  }
  if (value === 0 && (1 / value) < 0) {
    return '-0.0';
  } else {
  }
  if (value === (void 0)) {
    return 'null';
  } else {
  }
  if (typeof value == "function") {
    return 'Closure';
  } else {
  }
  return String(value);
};

$.checkNum = function(value) {
  if (!(typeof value === 'number')) {
    $.checkNull(value);
    throw $.captureStackTrace($.IllegalArgumentException$1(value));
  } else {
  }
  return value;
};

$.typeNameInIE = function(obj) {
  var name$ = $.constructorNameFallback(obj);
  if ($.eqB(name$, 'Window')) {
    return 'DOMWindow';
  } else {
  }
  if ($.eqB(name$, 'Document')) {
    if (!!obj.xmlVersion) {
      return 'Document';
    } else {
    }
    return 'HTMLDocument';
  } else {
  }
  if ($.eqB(name$, 'HTMLTableDataCellElement')) {
    return 'HTMLTableCellElement';
  } else {
  }
  if ($.eqB(name$, 'HTMLTableHeaderCellElement')) {
    return 'HTMLTableCellElement';
  } else {
  }
  if ($.eqB(name$, 'MSStyleCSSProperties')) {
    return 'CSSStyleDeclaration';
  } else {
  }
  if ($.eqB(name$, 'CanvasPixelArray')) {
    return 'Uint8ClampedArray';
  } else {
  }
  if ($.eqB(name$, 'HTMLPhraseElement')) {
    return 'HTMLElement';
  } else {
  }
  return name$;
};

$.regExpMatchStart = function(m) {
  return m.index;
};

$.constructorNameFallback = function(obj) {
  var constructor$ = (obj.constructor);
  if ((typeof(constructor$)) === 'function') {
    var name$ = (constructor$.name);
    var t0 = (typeof(name$)) === 'string';
    if (t0) {
      var t1 = $.isEmpty(name$) !== true;
    } else {
      t1 = t0;
    }
    if (t1) {
      var t2 = !(name$ === 'Object');
    } else {
      t2 = t1;
    }
    if (t2) {
      return name$;
    } else {
    }
  } else {
  }
  var string = (Object.prototype.toString.call(obj));
  return $.substring$2(string, 8, string.length - 1);
};

$.ltB = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a < b);
  } else {
    t2 = $.lt$slow(a, b) === true;
  }
  return t2;
};

$.clear = function(receiver) {
  if ($.isJsArray(receiver) !== true) {
    return receiver.clear$0();
  } else {
  }
  $.set$length(receiver, 0);
};

$.NullPointerException$2 = function(functionName, arguments$) {
  return new $.NullPointerException(arguments$, functionName);
};

$.tdiv = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return $.truncate((a) / (b));
  } else {
  }
  return a.operator$tdiv$1(b);
};

$.JSSyntaxRegExp$_globalVersionOf$1 = function(other) {
  var t0 = other.get$pattern();
  var t1 = other.get$multiLine();
  var t2 = new $.JSSyntaxRegExp(other.get$ignoreCase(), t1, t0);
  t2.JSSyntaxRegExp$_globalVersionOf$1(other);
  return t2;
};

$.convertDartClosureToJS = function(closure) {
  if (closure === (void 0)) {
    return;
  } else {
  }
  var function$ = (closure.$identity);
  if (!!function$) {
    return function$;
  } else {
  }
  var function0 = (function() {
    return $.invokeClosure.$call$5(closure, $, arguments.length, arguments[0], arguments[1]);
  });
  closure.$identity = function0;
  return function0;
};

$._FixedSizeListIterator$1 = function(array) {
  return new $._FixedSizeListIterator($.get$length(array), 0, array);
};

$.typeNameInChrome = function(obj) {
  var name$ = (obj.constructor.name);
  if (name$ === 'Window') {
    return 'DOMWindow';
  } else {
  }
  if (name$ === 'CanvasPixelArray') {
    return 'Uint8ClampedArray';
  } else {
  }
  return name$;
};

$.split = function(receiver, pattern) {
  if (!(typeof receiver === 'string')) {
    return receiver.split$1(pattern);
  } else {
  }
  $.checkNull(pattern);
  return $.stringSplitUnchecked(receiver, pattern);
};

$.concatAll = function(strings) {
  $.checkNull(strings);
  for (var t0 = $.iterator(strings), result = ''; t0.hasNext$0() === true; result = result0) {
    var t1 = t0.next$0();
    $.checkNull(t1);
    if (!(typeof t1 === 'string')) {
      throw $.captureStackTrace($.IllegalArgumentException$1(t1));
    } else {
    }
    var result0 = result + t1;
  }
  return result;
};

$.heartMaker = function() {
  var ctx = $.document().query$1('#drawingArea').getContext$1('2d');
  ctx.set$fillStyle('black');
  ctx.fillRect$4(0, 0, $.sub($.window().get$innerWidth(), 100), $.sub($.window().get$innerHeight(), 150));
  for (var i = 0; $.leB(i, $.sub($.window().get$innerHeight(), 150)); i = $.add(i, $.div($.sub($.window().get$innerHeight(), 150), 20))) {
    var y = $.add($.mul($.div($.sub($.window().get$innerWidth(), 100), 6), $.sin($.add($.count, $.offset))), $.div($.sub($.window().get$innerWidth(), 100), 2));
    var r = $.mul(15, $.sin($.count)) + 50;
    ctx.set$fillStyle('hsl(' + $.stringToString(i) + ',' + $.stringToString(r) + '%,50%)');
    var t0 = r / 2;
    ctx.set$font($.add('', t0) + 'px Arial');
    ctx.fillText$3('\u2665 ', $.add($.neg(y), $.sub($.window().get$innerWidth(), 100)), i);
    ctx.set$font($.add('', t0) + 'px Arial');
    ctx.fillText$3('\u2665 ', y, i);
    $.offset = $.add($.offset, 0.2);
  }
  $.offset = 0;
  $.count = $.add($.count, 0.05);
};

$._dynamicMetadata = function(table) {
  $dynamicMetadata = table;
};

$._dynamicMetadata2 = function() {
  if ((typeof($dynamicMetadata)) === 'undefined') {
    var t0 = [];
    $._dynamicMetadata(t0);
  } else {
  }
  return $dynamicMetadata;
};

$.shr = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    var a0 = (a);
    var b0 = (b);
    if (b0 < 0) {
      throw $.captureStackTrace($.IllegalArgumentException$1(b0));
    } else {
    }
    var t0 = a0 > 0;
    var t1 = b0 > 31;
    if (t0) {
      if (t1) {
        return 0;
      } else {
      }
      return a0 >>> b0;
    } else {
    }
    if (t1) {
      var b1 = 31;
    } else {
      b1 = b0;
    }
    return (a0 >> b1) >>> 0;
  } else {
  }
  return a.operator$shr$1(b);
};

$.eqNull = function(a) {
  if (typeof a === "object") {
    if (!!a.operator$eq$1) {
      return a.operator$eq$1((void 0));
    } else {
      return false;
    }
  } else {
    return typeof a === "undefined";
  }
};

$.regExpGetNative = function(regExp) {
  var r = (regExp._re);
  if (r === (void 0)) {
    var r0 = (regExp._re = $.regExpMakeNative(regExp, false));
  } else {
    r0 = r;
  }
  return r0;
};

$.throwNoSuchMethod = function(obj, name$, arguments$) {
  throw $.captureStackTrace($.NoSuchMethodException$4(obj, name$, arguments$, (void 0)));
};

$.checkNull = function(object) {
  if (object === (void 0)) {
    throw $.captureStackTrace($.NullPointerException$2((void 0), $.CTC));
  } else {
  }
  return object;
};

$.and = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return (a & b) >>> 0;
  } else {
  }
  return a.operator$and$1(b);
};

$.substring$2 = function(receiver, startIndex, endIndex) {
  if (!(typeof receiver === 'string')) {
    return receiver.substring$2(startIndex, endIndex);
  } else {
  }
  $.checkNum(startIndex);
  var length$ = receiver.length;
  if (endIndex === (void 0)) {
    var endIndex0 = length$;
  } else {
    endIndex0 = endIndex;
  }
  $.checkNum(endIndex0);
  if ($.ltB(startIndex, 0)) {
    throw $.captureStackTrace($.IndexOutOfRangeException$1(startIndex));
  } else {
  }
  if ($.gtB(startIndex, endIndex0)) {
    throw $.captureStackTrace($.IndexOutOfRangeException$1(startIndex));
  } else {
  }
  if ($.gtB(endIndex0, length$)) {
    throw $.captureStackTrace($.IndexOutOfRangeException$1(endIndex0));
  } else {
  }
  return $.substringUnchecked(receiver, startIndex, endIndex0);
};

$.indexSet = function(a, index, value) {
  if (a.constructor === Array && !a.immutable$list) {
    var key = (index >>> 0);
    var t0 = key === index;
    if (t0) {
      var t1 = key < (a.length);
    } else {
      t1 = t0;
    }
    if (t1) {
      a[key] = value;
      return;
    } else {
    }
  } else {
  }
  $.indexSet$slow(a, index, value);
};

$.ExceptionImplementation$1 = function(msg) {
  return new $.ExceptionImplementation(msg);
};

$.StringMatch$3 = function(_start, str, pattern) {
  return new $.StringMatch(pattern, str, _start);
};

$.invokeClosure = function(closure, isolate, numberOfArguments, arg1, arg2) {
  var t0 = ({});
  t0.arg2_3 = arg2;
  t0.arg1_2 = arg1;
  t0.closure_1 = closure;
  if ($.eqB(numberOfArguments, 0)) {
    return new $.Closure(t0).$call$0();
  } else {
    if ($.eqB(numberOfArguments, 1)) {
      return new $.Closure2(t0).$call$0();
    } else {
      if ($.eqB(numberOfArguments, 2)) {
        return new $.Closure3(t0).$call$0();
      } else {
        throw $.captureStackTrace($.ExceptionImplementation$1('Unsupported number of arguments for wrapped closure'));
      }
    }
  }
};

$.gt = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a > b);
  } else {
    t2 = $.gt$slow(a, b);
  }
  return t2;
};

$.assert = function(condition) {
};

$.buildDynamicMetadata = function(inputTable) {
  if (typeof inputTable !== 'string' && (typeof inputTable !== 'object'||inputTable.constructor !== Array)) return $.buildDynamicMetadata$bailout(inputTable,  0);
  var result = [];
  for (var i = 0; i < inputTable.length; i = i + 1) {
    var t0 = inputTable.length;
    if (i < 0 || i >= t0) throw $.ioore(i);
    var tag = $.index(inputTable[i], 0);
    var t1 = inputTable.length;
    if (i < 0 || i >= t1) throw $.ioore(i);
    var tags = $.index(inputTable[i], 1);
    var set = $.HashSetImplementation$0();
    $.setRuntimeTypeInfo(set, ({E: 'String'}));
    var tagNames = $.split(tags, '|');
    if (typeof tagNames !== 'string' && (typeof tagNames !== 'object'||tagNames.constructor !== Array)) return $.buildDynamicMetadata$bailout(inputTable, 2, result, inputTable, tag, i, tags, set, tagNames);
    for (var j = 0; j < tagNames.length; j = j + 1) {
      var t2 = tagNames.length;
      if (j < 0 || j >= t2) throw $.ioore(j);
      set.add$1(tagNames[j]);
    }
    $.add$1(result, $.MetaInfo$3(tag, tags, set));
  }
  return result;
};

$.checkNumbers = function(a, b) {
  if (typeof a === 'number') {
    if (typeof b === 'number') {
      return true;
    } else {
      $.checkNull(b);
      throw $.captureStackTrace($.IllegalArgumentException$1(b));
    }
  } else {
  }
  return false;
};

$.run = function() {
  var drawingArea = $.document().query$1('#drawingArea');
  drawingArea.set$width($.sub($.window().get$innerWidth(), 100));
  drawingArea.set$height($.sub($.window().get$innerHeight(), 150));
  $._intervalId = $.document().get$window().setInterval$2($.heartMaker, 30);
};

$.contains$1 = function(receiver, other) {
  if (!(typeof receiver === 'string')) {
    return receiver.contains$1(other);
  } else {
  }
  return $.contains$2(receiver, other, 0);
};

$.mul = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a * b);
  } else {
    t2 = $.mul$slow(a, b);
  }
  return t2;
};

$.stringToString = function(value) {
  var res = $.toString(value);
  if (!(typeof res === 'string')) {
    throw $.captureStackTrace($.IllegalArgumentException$1(value));
  } else {
  }
  return res;
};

$.lt$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a < b;
  } else {
  }
  return a.operator$lt$1(b);
};

$.neg = function(a) {
  if (typeof a === "number") {
    return -a;
  } else {
  }
  return a.operator$negate$0();
};

$.index$slow = function(a, index) {
  var t0 = typeof a === 'string';
  if (!t0) {
    var t1 = $.isJsArray(a) === true;
  } else {
    t1 = t0;
  }
  if (t1) {
    if (!((typeof index === 'number') && (index === (index | 0)))) {
      if (!(typeof index === 'number')) {
        throw $.captureStackTrace($.IllegalArgumentException$1(index));
      } else {
      }
      if (!($.truncate(index) === index)) {
        throw $.captureStackTrace($.IllegalArgumentException$1(index));
      } else {
      }
    } else {
    }
    var t2 = $.ltB(index, 0);
    if (!t2) {
      var t3 = $.geB(index, $.get$length(a));
    } else {
      t3 = t2;
    }
    if (t3) {
      throw $.captureStackTrace($.IndexOutOfRangeException$1(index));
    } else {
    }
    return a[index];
  } else {
  }
  return a.operator$index$1(index);
};

$._emitCollection = function(c, result, visiting) {
  $.add$1(visiting, c);
  var isList = typeof c === 'object' && (c.constructor === Array || c.is$List2());
  if (isList) {
    var t0 = '[';
  } else {
    t0 = '{';
  }
  $.add$1(result, t0);
  for (var t1 = $.iterator(c), first = true; t1.hasNext$0() === true; first = first0) {
    var t2 = t1.next$0();
    if (!first) {
      $.add$1(result, ', ');
    } else {
    }
    $._emitObject(t2, result, visiting);
    var first0 = false;
  }
  if (isList) {
    var t3 = ']';
  } else {
    t3 = '}';
  }
  $.add$1(result, t3);
  $.removeLast(visiting);
};

$.checkMutable = function(list, reason) {
  if (!!(list.immutable$list)) {
    throw $.captureStackTrace($.UnsupportedOperationException$1(reason));
  } else {
  }
};

$.sub$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a - b;
  } else {
  }
  return a.operator$sub$1(b);
};

$.toStringWrapper = function() {
  return $.toString((this.dartException));
};

$.contains$2 = function(receiver, other, startIndex) {
  if (!(typeof receiver === 'string')) {
    return receiver.contains$2(other, startIndex);
  } else {
  }
  $.checkNull(other);
  return $.stringContainsUnchecked(receiver, other, startIndex);
};

$.isEmpty = function(receiver) {
  var t0 = typeof receiver === 'string';
  if (!t0) {
    var t1 = $.isJsArray(receiver) === true;
  } else {
    t1 = t0;
  }
  if (t1) {
    return receiver.length === 0;
  } else {
  }
  return receiver.isEmpty$0();
};

$.regExpTest = function(regExp, str) {
  return $.regExpGetNative(regExp).test(str);
};

$.IndexOutOfRangeException$1 = function(_index) {
  return new $.IndexOutOfRangeException(_index);
};

$.charCodeAt = function(receiver, index) {
  if (typeof receiver === 'string') {
    if (!(typeof index === 'number')) {
      throw $.captureStackTrace($.IllegalArgumentException$1(index));
    } else {
    }
    if (index < 0) {
      throw $.captureStackTrace($.IndexOutOfRangeException$1(index));
    } else {
    }
    if (index >= receiver.length) {
      throw $.captureStackTrace($.IndexOutOfRangeException$1(index));
    } else {
    }
    return receiver.charCodeAt(index);
  } else {
    return receiver.charCodeAt$1(index);
  }
};

$.HashSetImplementation$0 = function() {
  var t0 = new $.HashSetImplementation((void 0));
  t0.HashSetImplementation$0();
  return t0;
};

$.stringSplitUnchecked = function(receiver, pattern) {
  if (typeof pattern === 'string') {
    return receiver.split(pattern);
  } else {
    if (typeof pattern === 'object' && !!pattern.is$JSSyntaxRegExp) {
      return receiver.split($.regExpGetNative(pattern));
    } else {
      throw $.captureStackTrace('StringImplementation.split(Pattern) UNIMPLEMENTED');
    }
  }
};

$.iterator = function(receiver) {
  if ($.isJsArray(receiver) === true) {
    return $.ListIterator$1(receiver);
  } else {
  }
  return receiver.iterator$0();
};

$.checkGrowable = function(list, reason) {
  if (!!(list.fixed$length)) {
    throw $.captureStackTrace($.UnsupportedOperationException$1(reason));
  } else {
  }
};

$.collectionToString = function(c) {
  var result = $.StringBufferImpl$1('');
  $._emitCollection(c, result, $.List((void 0)));
  return result.toString$0();
};

$.MetaInfo$3 = function(tag, tags, set) {
  return new $.MetaInfo(set, tags, tag);
};

$.add$1 = function(receiver, value) {
  if ($.isJsArray(receiver) === true) {
    $.checkGrowable(receiver, 'add');
    receiver.push(value);
    return;
  } else {
  }
  return receiver.add$1(value);
};

$.defineProperty = function(obj, property, value) {
  Object.defineProperty(obj, property,
      {value: value, enumerable: false, writable: true, configurable: true});;
};

$.regExpExec = function(regExp, str) {
  var result = ($.regExpGetNative(regExp).exec(str));
  if (result === null) {
    return;
  } else {
  }
  return result;
};

$.checkString = function(value) {
  if (!(typeof value === 'string')) {
    $.checkNull(value);
    throw $.captureStackTrace($.IllegalArgumentException$1(value));
  } else {
  }
  return value;
};

$.div = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a / b);
  } else {
    t2 = $.div$slow(a, b);
  }
  return t2;
};

$.dynamicFunction = function(name$) {
  var f = (Object.prototype[name$]);
  var t0 = !(f === (void 0));
  if (t0) {
    var t1 = (!!f.methods);
  } else {
    t1 = t0;
  }
  if (t1) {
    return f.methods;
  } else {
  }
  var methods = ({});
  var dartMethod = (Object.getPrototypeOf($.CTC6)[name$]);
  if (!(dartMethod === (void 0))) {
    methods['Object'] = dartMethod;
  } else {
  }
  var bind = (function() {return $.dynamicBind.$call$4(this, name$, methods, Array.prototype.slice.call(arguments));});
  bind.methods = methods;
  $.defineProperty((Object.prototype), name$, bind);
  return methods;
};

$.geB = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a >= b);
  } else {
    t2 = $.ge$slow(a, b) === true;
  }
  return t2;
};

$.stringContainsUnchecked = function(receiver, other, startIndex) {
  if (typeof other === 'string') {
    return !($.indexOf$2(receiver, other, startIndex) === -1);
  } else {
    if (typeof other === 'object' && !!other.is$JSSyntaxRegExp) {
      return other.hasMatch$1($.substring$1(receiver, startIndex));
    } else {
      return $.iterator($.allMatches(other, $.substring$1(receiver, startIndex))).hasNext$0();
    }
  }
};

$.removeLast = function(receiver) {
  if ($.isJsArray(receiver) === true) {
    $.checkGrowable(receiver, 'removeLast');
    if ($.get$length(receiver) === 0) {
      throw $.captureStackTrace($.IndexOutOfRangeException$1(-1));
    } else {
    }
    return receiver.pop();
  } else {
  }
  return receiver.removeLast$0();
};

$.ObjectNotClosureException$0 = function() {
  return new $.ObjectNotClosureException();
};

$.window = function() {
  return window;;
};

$.objectToString = function(object) {
  var name$ = (object.constructor.name);
  if ($.charCodeAt(name$, 0) === 36) {
    var name0 = $.substring$1(name$, 1);
  } else {
    name0 = name$;
  }
  return 'Instance of \'' + $.stringToString(name0) + '\'';
};

$.indexOf2 = function(a, element, startIndex, endIndex) {
  if (typeof a !== 'string' && (typeof a !== 'object'||a.constructor !== Array)) return $.indexOf2$bailout(a, element, startIndex, endIndex,  0);
  if (typeof endIndex !== 'number') return $.indexOf2$bailout(a, element, startIndex, endIndex,  0);
  if ($.geB(startIndex, a.length)) {
    return -1;
  } else {
  }
  if ($.ltB(startIndex, 0)) {
    var i = 0;
  } else {
    i = startIndex;
  }
  for (; $.ltB(i, endIndex); i = $.add(i, 1)) {
    if (i !== (i | 0)) throw $.iae(i);
    var t0 = a.length;
    if (i < 0 || i >= t0) throw $.ioore(i);
    if ($.eqB(a[i], element)) {
      return i;
    } else {
    }
  }
  return -1;
};

$._firstProbe = function(hashCode, length$) {
  return $.and(hashCode, $.sub(length$, 1));
};

$.set$length = function(receiver, newLength) {
  if ($.isJsArray(receiver) === true) {
    $.checkNull(newLength);
    if (!((typeof newLength === 'number') && (newLength === (newLength | 0)))) {
      throw $.captureStackTrace($.IllegalArgumentException$1(newLength));
    } else {
    }
    if (newLength < 0) {
      throw $.captureStackTrace($.IndexOutOfRangeException$1(newLength));
    } else {
    }
    $.checkGrowable(receiver, 'set length');
    receiver.length = newLength;
  } else {
    receiver.set$length(newLength);
  }
  return newLength;
};

$.ioore = function(index) {
  throw $.captureStackTrace($.IndexOutOfRangeException$1(index));
};

$.regExpAttachGlobalNative = function(regExp) {
  regExp._re = $.regExpMakeNative(regExp, true);
};

$.typeNameInFirefox = function(obj) {
  var name$ = $.constructorNameFallback(obj);
  if ($.eqB(name$, 'Window')) {
    return 'DOMWindow';
  } else {
  }
  if ($.eqB(name$, 'Document')) {
    return 'HTMLDocument';
  } else {
  }
  if ($.eqB(name$, 'XMLDocument')) {
    return 'Document';
  } else {
  }
  if ($.eqB(name$, 'WorkerMessageEvent')) {
    return 'MessageEvent';
  } else {
  }
  return name$;
};

$.leB = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a <= b);
  } else {
    t2 = $.le$slow(a, b) === true;
  }
  return t2;
};

$.gt$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a > b;
  } else {
  }
  return a.operator$gt$1(b);
};

$.indexOf = function(a, element, startIndex, endIndex) {
  if (typeof a !== 'string' && (typeof a !== 'object'||a.constructor !== Array)) return $.indexOf$bailout(a, element, startIndex, endIndex,  0);
  if (typeof endIndex !== 'number') return $.indexOf$bailout(a, element, startIndex, endIndex,  0);
  if ($.geB(startIndex, a.length)) {
    return -1;
  } else {
  }
  if ($.ltB(startIndex, 0)) {
    var i = 0;
  } else {
    i = startIndex;
  }
  for (; $.ltB(i, endIndex); i = $.add(i, 1)) {
    if (i !== (i | 0)) throw $.iae(i);
    var t0 = a.length;
    if (i < 0 || i >= t0) throw $.ioore(i);
    if ($.eqB(a[i], element)) {
      return i;
    } else {
    }
  }
  return -1;
};

$.regExpMakeNative = function(regExp, global) {
  var t0 = regExp.get$pattern();
  var multiLine = regExp.get$multiLine();
  var ignoreCase = regExp.get$ignoreCase();
  $.checkString(t0);
  var t1 = $.StringBufferImpl$1('');
  if (multiLine === true) {
    $.add$1(t1, 'm');
  } else {
  }
  if (ignoreCase === true) {
    $.add$1(t1, 'i');
  } else {
  }
  if (global === true) {
    $.add$1(t1, 'g');
  } else {
  }
  try {
    return new RegExp(t0, $.toString(t1));
  }catch (t2) {
    var t3 = $.unwrapException(t2);
    var t4 = t3;
    throw $.captureStackTrace($.IllegalJSRegExpException$2(t0, (String(t4))));
  }
};

$.forEach = function(receiver, f) {
  if ($.isJsArray(receiver) !== true) {
    return receiver.forEach$1(f);
  } else {
    return $.forEach2(receiver, f);
  }
};

$.forEach2 = function(iterable, f) {
  for (var t0 = $.iterator(iterable); t0.hasNext$0() === true; ) {
    f.$call$1(t0.next$0());
  }
};

$.forEach3 = function(iterable, f) {
  for (var t0 = $.iterator(iterable); t0.hasNext$0() === true; ) {
    f.$call$1(t0.next$0());
  }
};

$.hashCode = function(receiver) {
  if (typeof receiver === 'number') {
    return receiver & 0x1FFFFFFF;
  } else {
  }
  if (!(typeof receiver === 'string')) {
    return receiver.hashCode$0();
  } else {
  }
  var length$ = (receiver.length);
  for (var i = 0, hash = 0; i < length$; i = i0, hash = hash0) {
    var hash1 = (536870911 & hash + (receiver.charCodeAt(i))) >>> 0;
    var hash2 = (536870911 & hash1 + ((524287 & hash1) >>> 0 << 10)) >>> 0;
    var hash0 = (hash2 ^ $.shr(hash2, 6)) >>> 0;
    var i0 = i + 1;
  }
  var hash3 = (536870911 & hash + ((67108863 & hash) >>> 0 << 3)) >>> 0;
  var hash4 = (hash3 ^ $.shr(hash3, 11)) >>> 0;
  return (536870911 & hash4 + ((16383 & hash4) >>> 0 << 15)) >>> 0;
};

$.mapToString = function(m) {
  var result = $.StringBufferImpl$1('');
  $._emitMap(m, result, $.List((void 0)));
  return result.toString$0();
};

$.startsWith = function(receiver, other) {
  if (!(typeof receiver === 'string')) {
    return receiver.startsWith$1(other);
  } else {
  }
  $.checkString(other);
  var length$ = $.get$length(other);
  if ($.gtB(length$, receiver.length)) {
    return false;
  } else {
  }
  return other == receiver.substring(0, length$);
};

$._emitObject = function(o, result, visiting) {
  if (typeof o === 'object' && (o.constructor === Array || o.is$Collection())) {
    if ($._containsRef(visiting, o) === true) {
      if (typeof o === 'object' && (o.constructor === Array || o.is$List2())) {
        var t0 = '[...]';
      } else {
        t0 = '{...}';
      }
      $.add$1(result, t0);
    } else {
      $._emitCollection(o, result, visiting);
    }
  } else {
    if (typeof o === 'object' && o.is$Map()) {
      if ($._containsRef(visiting, o) === true) {
        $.add$1(result, '{...}');
      } else {
        $._emitMap(o, result, visiting);
      }
    } else {
      if ($.eqNullB(o)) {
        var t1 = 'null';
      } else {
        t1 = o;
      }
      $.add$1(result, t1);
    }
  }
};

$._emitMap = function(m, result, visiting) {
  var t0 = ({});
  t0.visiting_2 = visiting;
  t0.result_1 = result;
  $.add$1(t0.visiting_2, m);
  $.add$1(t0.result_1, '{');
  t0.first_3 = true;
  $.forEach(m, new $.Closure4(t0));
  $.add$1(t0.result_1, '}');
  $.removeLast(t0.visiting_2);
};

$.toStringForNativeObject = function(obj) {
  return 'Instance of ' + $.stringToString($.getTypeNameOf(obj));
};

$.add = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a + b);
  } else {
    t2 = $.add$slow(a, b);
  }
  return t2;
};

$.dynamicBind = function(obj, name$, methods, arguments$) {
  var tag = $.getTypeNameOf(obj);
  var method = (methods[tag]);
  var t0 = method === (void 0);
  if (t0) {
    var t1 = !($._dynamicMetadata2() === (void 0));
  } else {
    t1 = t0;
  }
  if (t1) {
    for (var method0 = method, i = 0; method1 = method0, $.ltB(i, $.get$length($._dynamicMetadata2())); method0 = method2, i = i0) {
      var entry = $.index($._dynamicMetadata2(), i);
      if ($.contains$1(entry.get$set(), tag) === true) {
        var method3 = (methods[entry.get$tag()]);
        if (!(method3 === (void 0))) {
          method1 = method3;
          break;
        } else {
        }
        var method2 = method3;
      } else {
        method2 = method0;
      }
      var i0 = i + 1;
    }
  } else {
    method1 = method;
  }
  if (method1 === (void 0)) {
    var method4 = (methods['Object']);
  } else {
    method4 = method1;
  }
  var proto = (Object.getPrototypeOf(obj));
  if (method4 === (void 0)) {
    var method5 = (function () {if (Object.getPrototypeOf(this) === proto) {$.throwNoSuchMethod.$call$3(this, name$, Array.prototype.slice.call(arguments));} else {return Object.prototype[name$].apply(this, arguments);}});
  } else {
    method5 = method4;
  }
  var nullCheckMethod = (function() {var res = method5.apply(this, Array.prototype.slice.call(arguments));return res === null ? (void 0) : res;});
  if (!proto.hasOwnProperty(name$)) {
    $.defineProperty(proto, name$, nullCheckMethod);
  } else {
  }
  return nullCheckMethod.apply(obj, arguments$);
  var method1;
};

$.getFunctionForTypeNameOf = function() {
  if (!((typeof(navigator)) === 'object')) {
    return $.typeNameInChrome;
  } else {
  }
  var userAgent = (navigator.userAgent);
  if ($.contains$1(userAgent, $.CTC4) === true) {
    return $.typeNameInChrome;
  } else {
    if ($.contains$1(userAgent, 'Firefox') === true) {
      return $.typeNameInFirefox;
    } else {
      if ($.contains$1(userAgent, 'MSIE') === true) {
        return $.typeNameInIE;
      } else {
        return $.constructorNameFallback;
      }
    }
  }
};

$.index = function(a, index) {
  if (typeof a == "string" || a.constructor === Array) {
    var key = (index >>> 0);
    var t0 = key === index;
    if (t0) {
      var t1 = key < (a.length);
    } else {
      t1 = t0;
    }
    if (t1) {
      return a[key];
    } else {
    }
  } else {
  }
  return $.index$slow(a, index);
};

$.sin = function(x) {
  return $.sin2(x);
};

$.sin2 = function(value) {
  return Math.sin($.checkNum(value));
};

$.MatchImplementation$5 = function(pattern, str, _start, _end, _groups) {
  return new $.MatchImplementation(_groups, _end, _start, str, pattern);
};

$.List = function(length$) {
  return $.newList(length$);
};

$._isPowerOfTwo = function(x) {
  return $.eq($.and(x, $.sub(x, 1)), 0);
};

$.UnsupportedOperationException$1 = function(_message) {
  return new $.UnsupportedOperationException(_message);
};

$.captureStackTrace = function(ex) {
  var jsError = (new Error());
  jsError.dartException = ex;
  jsError.toString = $.toStringWrapper.$call$0;
  return jsError;
};

$.indexOf$2 = function(receiver, element, start) {
  if ($.isJsArray(receiver) === true) {
    if (!((typeof start === 'number') && (start === (start | 0)))) {
      throw $.captureStackTrace($.IllegalArgumentException$1(start));
    } else {
    }
    return $.indexOf(receiver, element, start, (receiver.length));
  } else {
    if (typeof receiver === 'string') {
      $.checkNull(element);
      if (!((typeof start === 'number') && (start === (start | 0)))) {
        throw $.captureStackTrace($.IllegalArgumentException$1(start));
      } else {
      }
      if (!(typeof element === 'string')) {
        throw $.captureStackTrace($.IllegalArgumentException$1(element));
      } else {
      }
      if (start < 0) {
        return -1;
      } else {
      }
      return receiver.indexOf(element, start);
    } else {
    }
  }
  return receiver.indexOf$2(element, start);
};

$.StackOverflowException$0 = function() {
  return new $.StackOverflowException();
};

$.eq = function(a, b) {
  if (typeof a === "object") {
    if (!!a.operator$eq$1) {
      return a.operator$eq$1(b);
    } else {
      return a === b;
    }
  } else {
  }
  return a === b;
};

$.StringBufferImpl$1 = function(content$) {
  var t0 = new $.StringBufferImpl((void 0), (void 0));
  t0.StringBufferImpl$1(content$);
  return t0;
};

$.HashMapImplementation$0 = function() {
  var t0 = new $.HashMapImplementation((void 0), (void 0), (void 0), (void 0), (void 0));
  t0.HashMapImplementation$0();
  return t0;
};

$.substring$1 = function(receiver, startIndex) {
  if (!(typeof receiver === 'string')) {
    return receiver.substring$1(startIndex);
  } else {
  }
  return $.substring$2(receiver, startIndex, (void 0));
};

$.div$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a / b;
  } else {
  }
  return a.operator$div$1(b);
};

$.gtB = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a > b);
  } else {
    t2 = $.gt$slow(a, b) === true;
  }
  return t2;
};

$.NoMoreElementsException$0 = function() {
  return new $.NoMoreElementsException();
};

$.setRuntimeTypeInfo = function(target, typeInfo) {
  if (!(target === (void 0))) {
    target.builtin$typeInfo = typeInfo;
  } else {
  }
};

$.eqNullB = function(a) {
  if (typeof a === "object") {
    if (!!a.operator$eq$1) {
      return a.operator$eq$1((void 0)) === true;
    } else {
      return false;
    }
  } else {
    return typeof a === "undefined";
  }
};

$.document = function() {
  return document;;
};

$.add$slow = function(a, b) {
  if ($.checkNumbers(a, b) === true) {
    return a + b;
  } else {
    if (typeof a === 'string') {
      var b0 = $.toString(b);
      if (typeof b0 === 'string') {
        return a + b0;
      } else {
      }
      $.checkNull(b0);
      throw $.captureStackTrace($.IllegalArgumentException$1(b0));
    } else {
    }
  }
  return a.operator$add$1(b);
};

$.newList = function(length$) {
  if (length$ === (void 0)) {
    return new Array();
  } else {
  }
  var t0 = typeof length$ === 'number' && length$ === (length$ | 0);
  var t1 = !t0;
  if (t0) {
    var t2 = length$ < 0;
  } else {
    t2 = t1;
  }
  if (t2) {
    throw $.captureStackTrace($.IllegalArgumentException$1(length$));
  } else {
  }
  var result = (new Array(length$));
  result.fixed$length = true;
  return result;
};

$.main = function() {
  $.run();
};

$.lt = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a < b);
  } else {
    t2 = $.lt$slow(a, b);
  }
  return t2;
};

$.unwrapException = function(ex) {
  if ("dartException" in ex) {
    return ex.dartException;
  } else {
    if (ex instanceof TypeError) {
      var type = (ex.type);
      var name$ = (ex.arguments ? ex.arguments[0] : "");
      var t0 = $.eqB(type, 'property_not_function');
      if (!t0) {
        var t1 = $.eqB(type, 'called_non_callable');
      } else {
        t1 = t0;
      }
      if (!t1) {
        var t2 = $.eqB(type, 'non_object_property_call');
      } else {
        t2 = t1;
      }
      if (!t2) {
        var t3 = $.eqB(type, 'non_object_property_load');
      } else {
        t3 = t2;
      }
      if (t3) {
        var t4 = typeof name$ === 'string';
        if (t4) {
          var t5 = $.startsWith(name$, '$call$') === true;
        } else {
          t5 = t4;
        }
        if (t5) {
          return $.ObjectNotClosureException$0();
        } else {
          return $.NullPointerException$2((void 0), $.CTC);
        }
      } else {
        if ($.eqB(type, 'undefined_method')) {
          var t6 = typeof name$ === 'string';
          if (t6) {
            var t7 = $.startsWith(name$, '$call$') === true;
          } else {
            t7 = t6;
          }
          if (t7) {
            return $.ObjectNotClosureException$0();
          } else {
            return $.NoSuchMethodException$4('', name$, [], (void 0));
          }
        } else {
        }
      }
    } else {
      if (ex instanceof RangeError) {
        var message = (ex.message);
        var t8 = typeof message === 'string';
        if (t8) {
          var t9 = $.contains$1(message, 'call stack') === true;
        } else {
          t9 = t8;
        }
        if (t9) {
          return $.StackOverflowException$0();
        } else {
        }
      } else {
      }
    }
  }
  return ex;
};

$.NoSuchMethodException$4 = function(_receiver, _functionName, _arguments, _existingArgumentNames) {
  return new $.NoSuchMethodException(_existingArgumentNames, _arguments, _functionName, _receiver);
};

$.ceil = function(receiver) {
  if (!(typeof receiver === 'number')) {
    return receiver.ceil$0();
  } else {
  }
  return Math.ceil(receiver);
};

$._computeLoadLimit = function(capacity) {
  return $.tdiv($.mul(capacity, 3), 4);
};

$.HashSetIterator$1 = function(set_) {
  var t0 = new $.HashSetIterator(-1, set_.get$_backingMap().get$_keys());
  t0.HashSetIterator$1(set_);
  return t0;
};

$.getTypeNameOf = function(obj) {
  if ($._getTypeNameOf === (void 0)) {
    $._getTypeNameOf = $.getFunctionForTypeNameOf();
  } else {
  }
  return $._getTypeNameOf.$call$1(obj);
};

$.IllegalArgumentException$1 = function(arg) {
  return new $.IllegalArgumentException(arg);
};

$.sub = function(a, b) {
  var t0 = typeof a === 'number';
  if (t0) {
    var t1 = typeof b === 'number';
  } else {
    t1 = t0;
  }
  if (t1) {
    var t2 = (a - b);
  } else {
    t2 = $.sub$slow(a, b);
  }
  return t2;
};

$._AllMatchesIterator$2 = function(re, _str) {
  return new $._AllMatchesIterator(false, (void 0), _str, $.JSSyntaxRegExp$_globalVersionOf$1(re));
};

$.indexOf2$bailout = function(a, element, startIndex, endIndex, state, env0, env1) {
  switch (state) {
    case 1:
      t0 = env0;
      break;
    case 2:
      t0 = env0;
      t1 = env1;
      break;
  }
  switch (state) {
    case 0:
    case 1:
      state = 0;
    case 2:
      state = 0;
      if ($.geB(startIndex, $.get$length(a))) {
        return -1;
      } else {
      }
      if ($.ltB(startIndex, 0)) {
        var i = 0;
      } else {
        i = startIndex;
      }
      L0: while (true) {
        if (!$.ltB(i, endIndex)) break L0;
        if ($.eqB($.index(a, i), element)) {
          return i;
        } else {
        }
        i = $.add(i, 1);
      }
      return -1;
  }
};

$.indexOf$bailout = function(a, element, startIndex, endIndex, state, env0, env1) {
  switch (state) {
    case 1:
      t0 = env0;
      break;
    case 2:
      t0 = env0;
      t1 = env1;
      break;
  }
  switch (state) {
    case 0:
    case 1:
      state = 0;
    case 2:
      state = 0;
      if ($.geB(startIndex, $.get$length(a))) {
        return -1;
      } else {
      }
      if ($.ltB(startIndex, 0)) {
        var i = 0;
      } else {
        i = startIndex;
      }
      L0: while (true) {
        if (!$.ltB(i, endIndex)) break L0;
        if ($.eqB($.index(a, i), element)) {
          return i;
        } else {
        }
        i = $.add(i, 1);
      }
      return -1;
  }
};

$.allMatchesInStringUnchecked$bailout = function(needle, haystack, state, env0, env1, env2) {
  switch (state) {
    case 1:
      length$ = env0;
      result = env1;
      patternLength = env2;
      break;
  }
  switch (state) {
    case 0:
      var result = $.List((void 0));
      $.setRuntimeTypeInfo(result, ({E: 'Match'}));
      var length$ = $.get$length(haystack);
      var patternLength = $.get$length(needle);
    case 1:
      state = 0;
      var startIndex = 0;
      L0: while (true) {
        if (!true) break L0;
        var position = $.indexOf$2(haystack, needle, startIndex);
        if ($.eqB(position, -1)) {
          break;
        } else {
        }
        result.push($.StringMatch$3(position, haystack, needle));
        var endIndex = $.add(position, patternLength);
        if ($.eqB(endIndex, length$)) {
          break;
        } else {
          if ($.eqB(position, endIndex)) {
            var startIndex0 = $.add(startIndex, 1);
          } else {
            startIndex0 = endIndex;
          }
        }
        startIndex = startIndex0;
      }
      return result;
  }
};

$.buildDynamicMetadata$bailout = function(inputTable, state, env0, env1, env2, env3, env4, env5, env6) {
  switch (state) {
    case 1:
      t0 = env0;
      break;
    case 2:
      result = env0;
      t0 = env1;
      tag = env2;
      i = env3;
      tags = env4;
      set = env5;
      tagNames = env6;
      break;
  }
  switch (state) {
    case 0:
    case 1:
      state = 0;
      var result = [];
      var i = 0;
    case 2:
      L0: while (true) {
        switch (state) {
          case 0:
            if (!$.ltB(i, $.get$length(inputTable))) break L0;
            var tag = $.index($.index(inputTable, i), 0);
            var tags = $.index($.index(inputTable, i), 1);
            var set = $.HashSetImplementation$0();
            $.setRuntimeTypeInfo(set, ({E: 'String'}));
            var tagNames = $.split(tags, '|');
          case 2:
            state = 0;
            var j = 0;
            L1: while (true) {
              if (!$.ltB(j, $.get$length(tagNames))) break L1;
              set.add$1($.index(tagNames, j));
              j = j + 1;
            }
            $.add$1(result, $.MetaInfo$3(tag, tags, set));
            i = i + 1;
        }
      }
      return result;
  }
};

$.heartMaker.$call$0 = $.heartMaker;
$.dynamicBind.$call$4 = $.dynamicBind;
$.throwNoSuchMethod.$call$3 = $.throwNoSuchMethod;
$.invokeClosure.$call$5 = $.invokeClosure;
$.typeNameInChrome.$call$1 = $.typeNameInChrome;
$.toStringWrapper.$call$0 = $.toStringWrapper;
$.typeNameInIE.$call$1 = $.typeNameInIE;
$.typeNameInFirefox.$call$1 = $.typeNameInFirefox;
$.constructorNameFallback.$call$1 = $.constructorNameFallback;
Isolate.$finishClasses();
Isolate.makeConstantList = function(list) {
  list.immutable$list = true;
  list.fixed$length = true;
  return list;
};
$.CTC = Isolate.makeConstantList([]);
$.CTC3 = new Isolate.$isolateProperties.JSSyntaxRegExp(false, false, '^#[_a-zA-Z]\\w*$');
$.CTC5 = new Isolate.$isolateProperties._DeletedKeySentinel();
$.CTC4 = new Isolate.$isolateProperties.JSSyntaxRegExp(false, false, 'Chrome|DumpRenderTree');
$.CTC6 = new Isolate.$isolateProperties.Object();
$.CTC2 = new Isolate.$isolateProperties.NoMoreElementsException();
$.count = 0;
$.offset = 0;
$._intervalId = (void 0);
$._getTypeNameOf = (void 0);
var $ = null;
Isolate.$finishClasses();
Isolate = Isolate.$finishIsolateConstructor(Isolate);
var $ = new Isolate();
$.$defineNativeClass = function(cls, fields, methods) {
  var generateGetterSetter = function(field, prototype) {
  var len = field.length;
  var lastChar = field[len - 1];
  var needsGetter = lastChar == '?' || lastChar == '=';
  var needsSetter = lastChar == '!' || lastChar == '=';
  if (needsGetter || needsSetter) field = field.substring(0, len - 1);
  if (needsGetter) {
    var getterString = "return this." + field + ";";
    prototype["get$" + field] = new Function(getterString);
  }
  if (needsSetter) {
    var setterString = "this." + field + " = v;";
    prototype["set$" + field] = new Function("v", setterString);
  }
  return field;
};
  for (var i = 0; i < fields.length; i++) {
    generateGetterSetter(fields[i], methods);
  }
  for (var method in methods) {
    $.dynamicFunction(method)[cls] = methods[method];
  }
};
$.defineProperty(Object.prototype, 'is$List2', function() { return false; });
$.defineProperty(Object.prototype, 'is$Map', function() { return false; });
$.defineProperty(Object.prototype, 'is$Collection', function() { return false; });
$.defineProperty(Object.prototype, 'toString$0', function() { return $.toStringForNativeObject(this); });
$.$defineNativeClass('HTMLAnchorElement', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('WebKitAnimationList', ["length?"], {
});

$.$defineNativeClass('HTMLAppletElement', ["width!", "height!"], {
});

$.$defineNativeClass('AudioBuffer', ["length?"], {
});

$.$defineNativeClass('HTMLBRElement', [], {
 clear$0: function() { return this.clear.$call$0(); }
});

$.$defineNativeClass('WebKitCSSMatrix', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('CSSRuleList', ["length?"], {
});

$.$defineNativeClass('CSSStyleDeclaration', ["length?"], {
 set$width: function(value) {
  this.setProperty$3('width', value, '');
 },
 set$height: function(value) {
  this.setProperty$3('height', value, '');
 },
 set$font: function(value) {
  this.setProperty$3('font', value, '');
 },
 get$clear: function() {
  return this.getPropertyValue$1('clear');
 },
 clear$0: function() { return this.get$clear().$call$0(); },
 setProperty$3: function(propertyName, value, priority) {
  return this.setProperty(propertyName,value,priority);
 },
 getPropertyValue$1: function(propertyName) {
  return this.getPropertyValue(propertyName);
 }
});

$.$defineNativeClass('CSSValueList', ["length?"], {
});

$.$defineNativeClass('HTMLCanvasElement', ["width!", "height!"], {
 getContext$1: function(contextId) {
  return this.getContext(contextId);
 }
});

$.$defineNativeClass('CanvasRenderingContext2D', ["font!", "fillStyle!"], {
 fillText$4: function(text, x, y, maxWidth) {
  return this.fillText(text,x,y,maxWidth);
 },
 fillText$3: function(text,x,y) {
  return this.fillText(text,x,y);
},
 fillRect$4: function(x, y, width, height) {
  return this.fillRect(x,y,width,height);
 }
});

$.$defineNativeClass('CharacterData', ["length?"], {
});

$.$defineNativeClass('ClientRectList', ["length?"], {
});

_ConsoleImpl = (typeof console == 'undefined' ? {} : console);
$.$defineNativeClass('DOMException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('DOMMimeTypeArray', ["length?"], {
});

$.$defineNativeClass('DOMPlugin', ["length?"], {
});

$.$defineNativeClass('DOMPluginArray', ["length?"], {
});

$.$defineNativeClass('DOMSelection', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('DOMStringList', ["length?"], {
 contains$1: function(string) {
  return this.contains(string);
 },
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'String'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('DOMTokenList', ["length?"], {
 toString$0: function() {
  return this.toString();
 },
 contains$1: function(token) {
  return this.contains(token);
 },
 add$1: function(token) {
  return this.add(token);
 }
});

$.$defineNativeClass('DataTransferItemList', ["length?"], {
 clear$0: function() {
  return this.clear();
 },
 add$2: function(data_OR_file, type) {
  return this.add(data_OR_file,type);
 },
 add$1: function(data_OR_file) {
  return this.add(data_OR_file);
}
});

$.$defineNativeClass('HTMLDocument', [], {
 $dom_querySelector$1: function(selectors) {
  return this.querySelector(selectors);;
 },
 query$1: function(selectors) {
  if ($.CTC3.hasMatch$1(selectors) === true) {
    return this.$dom_getElementById$1($.substring$1(selectors, 1));
  } else {
  }
  return this.$dom_querySelector$1(selectors);
 },
 $dom_getElementById$1: function(elementId) {
  return this.getElementById(elementId);
 },
 get$window: function() {
  return this.defaultView;;
 }
});

$.$defineNativeClass('DocumentFragment', [], {
 query$1: function(selectors) {
  return this.querySelector(selectors);
 }
});

$.$defineNativeClass('Element', [], {
 query$1: function(selectors) {
  return this.querySelector(selectors);
 }
});

$.$defineNativeClass('HTMLEmbedElement', ["width!", "height!"], {
});

$.$defineNativeClass('EntryArray', ["length?"], {
});

$.$defineNativeClass('EntryArraySync', ["length?"], {
});

$.$defineNativeClass('EventException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('FileException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('FileList', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'File'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('FileWriter', ["length?"], {
});

$.$defineNativeClass('FileWriterSync', ["length?"], {
});

$.$defineNativeClass('Float32Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'num'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Float64Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'num'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('HTMLFormElement', ["length?"], {
});

$.$defineNativeClass('HTMLHRElement', ["width!"], {
});

$.$defineNativeClass('HTMLAllCollection', ["length?"], {
});

$.$defineNativeClass('HTMLCollection', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'Node'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('HTMLOptionsCollection', [], {
 set$length: function(value) {
  this.length = value;;
 },
 get$length: function() {
  return this.length;;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('History', ["length?"], {
});

$.$defineNativeClass('IDBDatabaseException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('IDBObjectStore', [], {
 clear$0: function() {
  return this.clear();
 },
 add$2: function(value, key) {
  return this.add(value,key);
 },
 add$1: function(value) {
  return this.add(value);
}
});

$.$defineNativeClass('HTMLIFrameElement', ["width!", "height!"], {
});

$.$defineNativeClass('HTMLImageElement', ["width!", "height!"], {
});

$.$defineNativeClass('HTMLInputElement', ["width!", "pattern?", "height!"], {
});

$.$defineNativeClass('Int16Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'int'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Int32Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'int'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Int8Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'int'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Location', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('HTMLMarqueeElement', ["width!", "height!"], {
});

$.$defineNativeClass('MediaList', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'String'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('MediaStreamList', ["length?"], {
});

$.$defineNativeClass('MediaStreamTrackList', ["length?"], {
});

$.$defineNativeClass('NamedNodeMap', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'Node'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Node', [], {
 $dom_replaceChild$2: function(newChild, oldChild) {
  return this.replaceChild(newChild,oldChild);
 },
 $dom_removeChild$1: function(oldChild) {
  return this.removeChild(oldChild);
 },
 contains$1: function(other) {
  return this.contains(other);
 },
 $dom_appendChild$1: function(newChild) {
  return this.appendChild(newChild);
 },
 set$text: function(value) {
  this.textContent = value;;
 }
});

$.$defineNativeClass('NodeList', ["length?"], {
 operator$index$1: function(index) {
  return this[index];;
 },
 last$0: function() {
  return this.operator$index$1($.sub($.get$length(this), 1));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 operator$indexSet$2: function(index, value) {
  this._parent.$dom_replaceChild$2(value, this.operator$index$1(index));
 },
 clear$0: function() {
  this._parent.set$text('');
 },
 removeLast$0: function() {
  var result = this.last$0();
  if (!$.eqNullB(result)) {
    this._parent.$dom_removeChild$1(result);
  } else {
  }
  return result;
 },
 add$1: function(value) {
  this._parent.$dom_appendChild$1(value);
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'Node'}));
  return t0;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('NodeSelector', [], {
 query$1: function(selectors) {
  return this.querySelector(selectors);
 }
});

$.$defineNativeClass('Notification', ["tag?"], {
});

$.$defineNativeClass('HTMLObjectElement', ["width!", "height!"], {
});

$.$defineNativeClass('OperationNotAllowedException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('HTMLPreElement', ["width!"], {
});

$.$defineNativeClass('RadioNodeList', [], {
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Range', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('RangeException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('SQLResultSetRowList', ["length?"], {
});

$.$defineNativeClass('SVGElementInstanceList', ["length?"], {
});

$.$defineNativeClass('SVGException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('SVGLengthList', [], {
 clear$0: function() {
  return this.clear();
 }
});

$.$defineNativeClass('SVGNumberList', [], {
 clear$0: function() {
  return this.clear();
 }
});

$.$defineNativeClass('SVGPathSegList', [], {
 clear$0: function() {
  return this.clear();
 }
});

$.$defineNativeClass('SVGPointList', [], {
 clear$0: function() {
  return this.clear();
 }
});

$.$defineNativeClass('SVGRect', ["width!", "height!"], {
});

$.$defineNativeClass('SVGStringList', [], {
 clear$0: function() {
  return this.clear();
 }
});

$.$defineNativeClass('SVGTransformList', [], {
 clear$0: function() {
  return this.clear();
 }
});

$.$defineNativeClass('HTMLSelectElement', ["length="], {
});

$.$defineNativeClass('SpeechGrammarList', ["length?"], {
});

$.$defineNativeClass('SpeechInputResultList', ["length?"], {
});

$.$defineNativeClass('SpeechRecognitionResult', ["length?"], {
});

$.$defineNativeClass('SpeechRecognitionResultList', ["length?"], {
});

$.$defineNativeClass('Storage', [], {
 $dom_setItem$2: function(key, data) {
  return this.setItem(key,data);
 },
 $dom_key$1: function(index) {
  return this.key(index);
 },
 $dom_getItem$1: function(key) {
  return this.getItem(key);
 },
 $dom_clear$0: function() {
  return this.clear();
 },
 get$$$dom_length: function() {
  return this.length;;
 },
 isEmpty$0: function() {
  return $.eqNull(this.$dom_key$1(0));
 },
 get$length: function() {
  return this.get$$$dom_length();
 },
 forEach$1: function(f) {
  for (var i = 0; true; i = i + 1) {
    var key = this.$dom_key$1(i);
    if ($.eqNullB(key)) {
      return;
    } else {
    }
    f.$call$2(key, this.operator$index$1(key));
  }
 },
 clear$0: function() {
  return this.$dom_clear$0();
 },
 operator$indexSet$2: function(key, value) {
  return this.$dom_setItem$2(key, value);
 },
 operator$index$1: function(key) {
  return this.$dom_getItem$1(key);
 },
 containsKey$1: function(key) {
  return !$.eqNullB(this.$dom_getItem$1(key));
 },
 is$Map: function() { return true; }
});

$.$defineNativeClass('StyleSheetList', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'StyleSheet'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('HTMLTableCellElement', ["width!", "height!"], {
});

$.$defineNativeClass('HTMLTableColElement', ["width!"], {
});

$.$defineNativeClass('HTMLTableElement', ["width!"], {
});

$.$defineNativeClass('TextTrackCue', ["text!"], {
});

$.$defineNativeClass('TextTrackCueList', ["length?"], {
});

$.$defineNativeClass('TextTrackList', ["length?"], {
});

$.$defineNativeClass('TimeRanges', ["length?"], {
});

$.$defineNativeClass('TouchList', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'Touch'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot assign element of immutable List.'));
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Uint16Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'int'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Uint32Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'int'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Uint8Array', ["length?"], {
 removeLast$0: function() {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot removeLast on immutable List.'));
 },
 indexOf$2: function(element, start) {
  return $.indexOf2(this, element, start, $.get$length(this));
 },
 isEmpty$0: function() {
  return $.eq($.get$length(this), 0);
 },
 forEach$1: function(f) {
  return $.forEach3(this, f);
 },
 add$1: function(value) {
  throw $.captureStackTrace($.UnsupportedOperationException$1('Cannot add to immutable List.'));
 },
 iterator$0: function() {
  var t0 = $._FixedSizeListIterator$1(this);
  $.setRuntimeTypeInfo(t0, ({T: 'int'}));
  return t0;
 },
 operator$indexSet$2: function(index, value) {
  this[index] = value;
 },
 operator$index$1: function(index) {
  return this[index];;
 },
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('Uint8ClampedArray', [], {
 is$List2: function() { return true; },
 is$Collection: function() { return true; }
});

$.$defineNativeClass('HTMLVideoElement', ["width!", "height!"], {
});

$.$defineNativeClass('DOMWindow', ["window?", "length?", "innerWidth?", "innerHeight?"], {
 setInterval$2: function(handler, timeout) {
  return this.setInterval($.convertDartClosureToJS(handler),timeout);
 }
});

$.$defineNativeClass('WorkerContext', [], {
 setInterval$2: function(handler, timeout) {
  return this.setInterval($.convertDartClosureToJS(handler),timeout);
 }
});

$.$defineNativeClass('WorkerLocation', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('XMLHttpRequestException', [], {
 toString$0: function() {
  return this.toString();
 }
});

$.$defineNativeClass('XPathException', [], {
 toString$0: function() {
  return this.toString();
 }
});

// 99 dynamic classes.
// 252 classes
// 19 !leaf
(function(){
  var v0/*class(_ElementImpl)*/ = 'Element|HTMLUnknownElement|HTMLUListElement|HTMLTrackElement|HTMLTitleElement|HTMLTextAreaElement|HTMLTableSectionElement|HTMLTableRowElement|HTMLTableElement|HTMLTableColElement|HTMLTableCellElement|HTMLTableCaptionElement|HTMLStyleElement|HTMLSpanElement|HTMLSourceElement|HTMLShadowElement|HTMLSelectElement|HTMLScriptElement|SVGElement|SVGViewElement|SVGVKernElement|SVGUseElement|SVGTitleElement|SVGTextContentElement|SVGTextPositioningElement|SVGTextElement|SVGTSpanElement|SVGTRefElement|SVGAltGlyphElement|SVGTextPathElement|SVGSymbolElement|SVGSwitchElement|SVGStyleElement|SVGStopElement|SVGScriptElement|SVGSVGElement|SVGRectElement|SVGPolylineElement|SVGPolygonElement|SVGPatternElement|SVGPathElement|SVGMissingGlyphElement|SVGMetadataElement|SVGMaskElement|SVGMarkerElement|SVGMPathElement|SVGLineElement|SVGImageElement|SVGHKernElement|SVGGradientElement|SVGRadialGradientElement|SVGLinearGradientElement|SVGGlyphRefElement|SVGGlyphElement|SVGGElement|SVGForeignObjectElement|SVGFontFaceUriElement|SVGFontFaceSrcElement|SVGFontFaceNameElement|SVGFontFaceFormatElement|SVGFontFaceElement|SVGFontElement|SVGFilterElement|SVGFETurbulenceElement|SVGFETileElement|SVGFESpotLightElement|SVGFESpecularLightingElement|SVGFEPointLightElement|SVGFEOffsetElement|SVGFEMorphologyElement|SVGFEMergeNodeElement|SVGFEMergeElement|SVGFEImageElement|SVGFEGaussianBlurElement|SVGFEFloodElement|SVGFEDropShadowElement|SVGFEDistantLightElement|SVGFEDisplacementMapElement|SVGFEDiffuseLightingElement|SVGFEConvolveMatrixElement|SVGFECompositeElement|SVGFEComponentTransferElement|SVGFEColorMatrixElement|SVGFEBlendElement|SVGEllipseElement|SVGDescElement|SVGDefsElement|SVGCursorElement|SVGComponentTransferFunctionElement|SVGFEFuncRElement|SVGFEFuncGElement|SVGFEFuncBElement|SVGFEFuncAElement|SVGClipPathElement|SVGCircleElement|SVGAnimationElement|SVGSetElement|SVGAnimateTransformElement|SVGAnimateMotionElement|SVGAnimateElement|SVGAnimateColorElement|SVGAltGlyphItemElement|SVGAltGlyphDefElement|SVGAElement|HTMLQuoteElement|HTMLProgressElement|HTMLPreElement|HTMLParamElement|HTMLParagraphElement|HTMLOutputElement|HTMLOptionElement|HTMLOptGroupElement|HTMLObjectElement|HTMLOListElement|HTMLModElement|HTMLMeterElement|HTMLMetaElement|HTMLMenuElement|HTMLMediaElement|HTMLVideoElement|HTMLAudioElement|HTMLMarqueeElement|HTMLMapElement|HTMLLinkElement|HTMLLegendElement|HTMLLabelElement|HTMLLIElement|HTMLKeygenElement|HTMLInputElement|HTMLImageElement|HTMLIFrameElement|HTMLHtmlElement|HTMLHeadingElement|HTMLHeadElement|HTMLHRElement|HTMLFrameSetElement|HTMLFrameElement|HTMLFormElement|HTMLFontElement|HTMLFieldSetElement|HTMLEmbedElement|HTMLDivElement|HTMLDirectoryElement|HTMLDetailsElement|HTMLDListElement|HTMLContentElement|HTMLCanvasElement|HTMLButtonElement|HTMLBodyElement|HTMLBaseFontElement|HTMLBaseElement|HTMLBRElement|HTMLAreaElement|HTMLAppletElement|HTMLAnchorElement|HTMLElement';
  var v1/*class(_DocumentFragmentImpl)*/ = 'DocumentFragment|ShadowRoot';
  var v2/*class(_DocumentImpl)*/ = 'HTMLDocument|SVGDocument';
  var v3/*class(_CharacterDataImpl)*/ = 'CharacterData|Text|CDATASection|Comment';
  var table = [
    // [dynamic-dispatch-tag, tags of classes implementing dynamic-dispatch-tag]
    ['HTMLCollection', 'HTMLCollection|HTMLOptionsCollection'],
    ['Element', v0/*class(_ElementImpl)*/],
    ['DocumentFragment', v1/*class(_DocumentFragmentImpl)*/],
    ['HTMLDocument', v2/*class(_DocumentImpl)*/],
    ['CharacterData', v3/*class(_CharacterDataImpl)*/],
    ['Node', [v0/*class(_ElementImpl)*/,v1/*class(_DocumentFragmentImpl)*/,v2/*class(_DocumentImpl)*/,v3/*class(_CharacterDataImpl)*/,'Node|ProcessingInstruction|Notation|EntityReference|Entity|DocumentType|Attr'].join('|')],
    ['Uint8Array', 'Uint8Array|Uint8ClampedArray'],
    ['NodeList', 'NodeList|RadioNodeList'],
    ['WorkerContext', 'WorkerContext|SharedWorkerContext|DedicatedWorkerContext'],
    ['CSSValueList', 'CSSValueList|WebKitCSSFilterValue|WebKitCSSTransformValue'],
    ['DOMTokenList', 'DOMTokenList|DOMSettableTokenList']];
$.dynamicSetMetadata(table);
})();

if (typeof window != 'undefined' && typeof document != 'undefined' &&
    window.addEventListener && document.readyState == 'loading') {
  window.addEventListener('DOMContentLoaded', function(e) {
    $.main();
  });
} else {
  $.main();
}
function init() {
  Isolate.$isolateProperties = {};
Isolate.$defineClass = function(cls, superclass, fields, prototype) {
  var generateGetterSetter = function(field, prototype) {
  var len = field.length;
  var lastChar = field[len - 1];
  var needsGetter = lastChar == '?' || lastChar == '=';
  var needsSetter = lastChar == '!' || lastChar == '=';
  if (needsGetter || needsSetter) field = field.substring(0, len - 1);
  if (needsGetter) {
    var getterString = "return this." + field + ";";
    prototype["get$" + field] = new Function(getterString);
  }
  if (needsSetter) {
    var setterString = "this." + field + " = v;";
    prototype["set$" + field] = new Function("v", setterString);
  }
  return field;
};
  var constructor;
  if (typeof fields == 'function') {
    constructor = fields;
  } else {
    var str = "function " + cls + "(";
    var body = "";
    for (var i = 0; i < fields.length; i++) {
      if (i != 0) str += ", ";
      var field = fields[i];
      field = generateGetterSetter(field, prototype);
      str += field;
      body += "this." + field + " = " + field + ";\n";
    }
    str += ") {" + body + "}\n";
    str += "return " + cls + ";";
    constructor = new Function(str)();
  }
  Isolate.$isolateProperties[cls] = constructor;
  constructor.prototype = prototype;
  if (superclass !== "") {
    Isolate.$pendingClasses[cls] = superclass;
  }
};
Isolate.$pendingClasses = {};
Isolate.$finishClasses = function() {
  var pendingClasses = Isolate.$pendingClasses;
  Isolate.$pendingClasses = {};
  var finishedClasses = {};
  function finishClass(cls) {
    if (finishedClasses[cls]) return;
    finishedClasses[cls] = true;
    var superclass = pendingClasses[cls];
    if (!superclass) return;
    finishClass(superclass);
    var constructor = Isolate.$isolateProperties[cls];
    var superConstructor = Isolate.$isolateProperties[superclass];
    var prototype = constructor.prototype;
    if (prototype.__proto__) {
      prototype.__proto__ = superConstructor.prototype;
      prototype.constructor = constructor;
    } else {
      function tmp() {};
      tmp.prototype = superConstructor.prototype;
      var newPrototype = new tmp();
      constructor.prototype = newPrototype;
      newPrototype.constructor = constructor;
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      for (var member in prototype) {
        if (hasOwnProperty.call(prototype, member)) {
          newPrototype[member] = prototype[member];
        }
      }
    }
  }
  for (var cls in pendingClasses) finishClass(cls);
};
Isolate.$finishIsolateConstructor = function(oldIsolate) {
  var isolateProperties = oldIsolate.$isolateProperties;
  var isolatePrototype = oldIsolate.prototype;
  var str = "{\n";
  str += "var properties = Isolate.$isolateProperties;\n";
  for (var staticName in isolateProperties) {
    if (Object.prototype.hasOwnProperty.call(isolateProperties, staticName)) {
      str += "this." + staticName + "= properties." + staticName + ";\n";
    }
  }
  str += "}\n";
  var newIsolate = new Function(str);
  newIsolate.prototype = isolatePrototype;
  isolatePrototype.constructor = newIsolate;
  newIsolate.$isolateProperties = isolateProperties;
  return newIsolate;
};
}
