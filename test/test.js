"use strict";

var assert = require('self-explain').assert;
var expect = require('expect.js');
var rgl = require('../regexplicit.js');

describe("regexps", function(){
    [
        {expression:"uno = 15", expect: "<<uno>> = 15"},
        {expression:"(uno + dos)*b = 15", expect: "(<<uno>> + <<dos>>)*<<b>> = 15"},
        {expression:"f(uno)", expect: "f(<<uno>>)"},
        {expression:"f (uno)", expect: "f (<<uno>>)"},
    ].forEach(function(fixture){
        it("matchs variables in expression, fixture: "+JSON.stringify(fixture), function(){
            var variables = rgl.variables;
            // eval(assert(fixture.expression.replace(variables, function(match){ return "<<"+match+">>"; }) === fixture.expect));
            expect(fixture.expression.replace(variables, function(match){ return "<<"+match+">>"; })).to.eql(fixture.expect);
        });
    });
});