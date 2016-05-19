"use strict";

var assert = require('self-explain').assert;
var expect = require('expect.js');
var rgl = require('../regexplicit.js');

describe("regexps", function(){
    [
        {expression:"uno = 15"          , expect: "<<uno>> = 15"},
        {expression:"(uno + dos)*b = 15", expect: "(<<uno>> + <<dos>>)*<<b>> = 15"},
        {expression:"f(uno)"            , expect: "f(<<uno>>)"},
        {expression:"f (uno)"           , expect: "f (<<uno>>)"},
    ].forEach(function(fixture){
        it("matchs variables in expression, fixture: "+JSON.stringify(fixture), function(){
            // eval(assert(fixture.expression.replace(variables, function(match){ return "<<"+match+">>"; }) === fixture.expect));
            expect(fixture.expression.replace(rgl.variables, function(match){ return "<<"+match+">>"; })).to.eql(fixture.expect);
            expect(fixture.expression.replace(rgl.variables, function(match, left, center, right){ return left+"<<"+center+">>"+right; })).to.eql(fixture.expect);
            expect(rgl.variables.replacer(fixture.expression, function(variable){ return "<<"+variable+">>"; })).to.eql(fixture.expect);
        });
    });
    [
        {expression:"uno = 15"           , expect: "uno [=] 15"},
        {expression:"uno=15"             , expect: "uno[=]15"},
        {expression:"uno=(15)"           , expect: "uno[=](15)"},
        {expression:"(uno)=15"           , expect: "(uno)[=]15"},
        {expression:"(uno)={a:15}"       , expect: "(uno)[=]{a:15}"},
        {expression:"uno==15"            , expect: "uno==15"},
        {expression:"uno!=15"            , expect: "uno!=15"},
        {expression:"uno!==15"           , expect: "uno!==15"},
        {expression:"uno='15'"           , expect: "uno[=]'15'"},
        {expression:"uno===15"           , expect: "uno===15"},
        {expression:"uno>=15"            , expect: "uno>=15"},
        {expression:"a=b && b=c"         , expect: "a[=]b && b[=]c"},
    ].forEach(function(fixture){
        it("matchs = in expression, fixture: "+JSON.stringify(fixture), function(){
            // eval(assert(fixture.expression.replace(operadorIgual, function(match){ return "["+match+"]"; }) === fixture.expect));
            expect(rgl.operadorIgual.replacer(fixture.expression,function(match){ return "["+match+"]"; })).to.eql(fixture.expect);
            expect(rgl.operadorIgual.replacer(fixture.expression,"[=]")).to.eql(fixture.expect);
        });
    });
});