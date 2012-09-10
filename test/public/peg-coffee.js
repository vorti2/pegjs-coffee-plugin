// Generated by CoffeeScript 1.3.3
(function() {
  var PASS_NAME, PEGCoffee, utils;

  utils = {
    buildNodeVisitor: function(functions) {
      return function(node) {
        return functions[node.type].apply(null, arguments);
      };
    }
  };

  PASS_NAME = 'compileFromCoffeeScript';

  PEGCoffee = function(CoffeeScript) {
    return {
      initialize: function(PEG) {
        var appliedPassNames, index;
        if (CoffeeScript == null) {
          CoffeeScript = global.CoffeeScript;
        }
        PEG.compiler.passes[PASS_NAME] = this.pass;
        appliedPassNames = PEG.compiler.appliedPassNames;
        if (appliedPassNames.indexOf(PASS_NAME) === -1) {
          index = appliedPassNames.indexOf('allocateRegister');
          return appliedPassNames.splice(index - 1, 0, PASS_NAME);
        }
      },
      pass: function(ast) {
        var compile, compileAction, compileCoffee, compileInSubnodes, compileRule, nop;
        compileCoffee = function(code) {
          return CoffeeScript.compile(code, {
            bare: true
          });
        };
        nop = function() {};
        compileRule = function(node) {
          return compileAction(node.expression);
        };
        compileAction = function(node) {
          if (node.type === 'action') {
            return node.code = compileCoffee(node.code);
          }
        };
        compileInSubnodes = function(propertyName) {
          return function(node) {
            var subnode, _i, _len, _ref, _results;
            _ref = node[propertyName];
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              subnode = _ref[_i];
              _results.push(compile(subnode));
            }
            return _results;
          };
        };
        compile = utils.buildNodeVisitor({
          grammar: compileInSubnodes('rules'),
          rule: compileRule,
          named: nop,
          choice: compileInSubnodes('alternatives'),
          sequence: compileInSubnodes('elements'),
          labeled: nop,
          simple_and: nop,
          simple_not: nop,
          semantic_and: nop,
          semantic_not: nop,
          optional: nop,
          zero_or_more: nop,
          one_or_more: nop,
          action: compileAction,
          rule_ref: nop,
          literal: nop,
          "class": nop,
          any: nop
        });
        compile(ast);
        if (ast.initializer) {
          return ast.initializer = compileCoffee(ast.initializer);
        }
      }
    };
  };

  (function(define) {
    return define('PEGCoffee', function(require) {
      var CoffeeScript;
      CoffeeScript = require('coffee-script');
      return PEGCoffee(CoffeeScript);
    });
  })(typeof define === 'function' && define.amd ? define : function(id, factory) {
    if (typeof exports !== 'undefined') {
      return module.exports = factory(require);
    } else {
      return window[id] = factory(function(value) {
        return window[value];
      });
    }
  });

}).call(this);