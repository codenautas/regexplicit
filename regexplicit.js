"use strict";
/*jshint eqnull:true */
/*jshint globalstrict:true */
/*jshint node:true */
/*eslint-disable no-console */

var Regexplicit = {};

Regexplicit.variables = /\b[A-Za-z_]\w*(?!\s*\()\b/g;

module.exports = Regexplicit;
