"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.relative = relative;
exports.resolve = resolve;
var path = _interopRequireWildcard(require("path"));
function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== "function") return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}
function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 *
 */

// rootDir must be normalized and absolute, filename may be any absolute path.
// (but will optimally start with rootDir)
function relative(rootDir, filename) {
  return filename.indexOf(rootDir + path.sep) === 0
    ? filename.substr(rootDir.length + 1)
    : path.relative(rootDir, filename);
}
const INDIRECTION_FRAGMENT = ".." + path.sep;
const INDIRECTION_FRAGMENT_LENGTH = INDIRECTION_FRAGMENT.length;

// rootDir must be an absolute path and normalPath must be a normal relative
// path (e.g.: foo/bar or ../foo/bar, but never ./foo or foo/../bar)
// As of Node 18 this is several times faster than path.resolve, over
// thousands of real calls with 1-3 levels of indirection.
function resolve(rootDir, normalPath) {
  if (normalPath.startsWith(INDIRECTION_FRAGMENT)) {
    const dirname = rootDir === "" ? "" : path.dirname(rootDir);
    return resolve(dirname, normalPath.slice(INDIRECTION_FRAGMENT_LENGTH));
  } else {
    return (
      rootDir +
      // If rootDir is the file system root, it will end in a path separator
      (rootDir.endsWith(path.sep) ? normalPath : path.sep + normalPath)
    );
  }
}
