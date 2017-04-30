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
            // eval(assert(fixture.expression.replace(operatorEqual, function(match){ return "["+match+"]"; }) === fixture.expect));
            expect(rgl.operatorEqual.replacer(fixture.expression,function(match){ return "["+match+"]"; })).to.eql(fixture.expect);
            expect(rgl.operatorEqual.replacer(fixture.expression,"[=]")).to.eql(fixture.expect);
        });
    });
    describe("detects year-trim", function(){
        [
            {expression:" 2010 T 3 ", expect: ["2010", "3", undefined, undefined, undefined, undefined]},
            {expression:"2010Q2"    , expect: ["2010", "2", undefined, undefined, undefined, undefined]},
            {expression:"2011trim4" , expect: ["2011", "4", undefined, undefined, undefined, undefined]},
            {expression:"2012I."    , expect: ["2012", undefined, 'I', undefined, undefined, undefined]},
            {expression:"14-I"      , expect: ["14"  , undefined, 'I', undefined, undefined, undefined]},
            {expression:"15I."      , expect: ["15"  , undefined, 'I', undefined, undefined, undefined]},
            {expression:"2012II"    , expect: ["2012", undefined, undefined, 'II', undefined, undefined]},
            {expression:"2012 - III", expect: ["2012", undefined, undefined, undefined, 'III', undefined]},
            {expression:"2012-IV."  , expect: ["2012", undefined, undefined, undefined, undefined, 'IV']},
            {expression:"2011 trimestre 4" , expect: ["2011", "4", undefined, undefined, undefined, undefined]},
        ].forEach(function(fixture){
            it(fixture.expression, function(){
                expect(fixture.expression.match(rgl.yearTrim).slice(1)).to.eql(fixture.expect);
            });
        });
    })
    describe("detects trim-year", function(){
        [
            {expression:" 3 T 2010" , expect: ["3", undefined, undefined, undefined, undefined  , "2010"]},
            {expression:"2Q2010"    , expect: ["2", undefined, undefined, undefined, undefined  , "2010"]},
            {expression:"4trim2011" , expect: ["4", undefined, undefined, undefined, undefined  , "2011"]},
            {expression:"I.   2012" , expect: [undefined, 'I', undefined, undefined, undefined  , "2012"]},
            {expression:"I.2012"    , expect: [undefined, 'I', undefined, undefined, undefined  , "2012"]},
            {expression:"I.12"      , expect: [undefined, 'I', undefined, undefined, undefined  , "12"  ]},
            {expression:"II2012"    , expect: [undefined, undefined, 'II', undefined, undefined , "2012"]},
            {expression:"III-2012"  , expect: [undefined, undefined, undefined, 'III', undefined, "2012"]},
            {expression:"IV.-2012"  , expect: [undefined, undefined, undefined, undefined, 'IV' , "2012"]},
            {expression:"4 trimestre 2011", expect: ["4", undefined, undefined, undefined, undefined  , "2011"]},
        ].forEach(function(fixture){
            it(fixture.expression, function(){
                expect(fixture.expression.match(rgl.trimYear).slice(1)).to.eql(fixture.expect);
            });
        });
    })
    describe("detects year-sem", function(){
        [
            {expression:" 2010 S 1 ", expect: ["2010", "1", undefined, undefined]},
            {expression:"2010S2"    , expect: ["2010", "2", undefined, undefined]},
            {expression:"2011sem1"  , expect: ["2011", "1", undefined, undefined]},
            {expression:"2011 semestre 2" , expect: ["2011", "2", undefined, undefined]},
        ].forEach(function(fixture){
            it(fixture.expression, function(){
                expect(fixture.expression.match(rgl.yearSem).slice(1)).to.eql(fixture.expect);
            });
        });
    })
    describe("detects sem-year", function(){
        [
            {expression:" 1 S 2010" , expect: ["1", undefined, undefined, "2010"]},
            {expression:"2s2010"    , expect: ["2", undefined, undefined, "2010"]},
            {expression:"2sem2011"  , expect: ["2", undefined, undefined, "2011"]},
            {expression:"I sem 2012", expect: [undefined, "I", undefined, "2012"]},
            {expression:"II semestre 2011", expect: [undefined, undefined, "II", "2011"]},
        ].forEach(function(fixture){
            it(fixture.expression, function(){
                expect(fixture.expression.match(rgl.semYear).slice(1)).to.eql(fixture.expect);
            });
        });
    })
});