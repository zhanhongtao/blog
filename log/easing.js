/**
 * Code from Qwrap!
 * @fileoverview Easing
 * @author:Jerry(屈光宇)、JK（加宽）
 */

(function() {

  /**
   * @class Easing 动画算子集合，例如easeNone、easeIn、easeOut、easeBoth等算子。
   * @namespace QW
   */
  var Easing = {
    easeNone: function(p) {
      return p;
    },
    easeIn: function(p) {
      return p * p;
    },
    easeOut: function(p) {
      return p * (2 - p);
    },
    easeBoth: function(p) {
      if ((p /= 0.5) < 1) return 1 / 2 * p * p;
      return -1 / 2 * ((--p) * (p - 2) - 1);
    },
    easeInStrong: function(p) {
      return p * p * p * p;
    },
    easeOutStrong: function(p) {
      return -((p -= 1) * p * p * p - 1);
    },
    easeBothStrong: function(p) {
      if ((p /= 0.5) < 1) return 1 / 2 * p * p * p * p;
      return -1 / 2 * ((p -= 2) * p * p * p - 2);
    },
    elasticIn: function(p) {
      if (p == 0) return 0;
      if (p == 1) return 1;
      var x = 0.3,
        //y = 1,
        z = x / 4;
      return -(Math.pow(2, 10 * (p -= 1)) * Math.sin((p - z) * (2 * Math.PI) / x));
    },
    elasticOut: function(p) {
      if (p == 0) return 0;
      if (p == 1) return 1;
      var x = 0.3,
        //y = 1,
        z = x / 4;
      return Math.pow(2, -10 * p) * Math.sin((p - z) * (2 * Math.PI) / x) + 1;
    },
    elasticBoth: function(p) {
      if (p == 0) return 0;
      if ((p /= 0.5) == 2) return 1;
      var x = 0.3 * 1.5,
        //y = 1,
        z = x / 4;
      if (p < 1) return -0.5 * (Math.pow(2, 10 * (p -= 1)) * Math.sin((p - z) * (2 * Math.PI) / x));
      return Math.pow(2, -10 * (p -= 1)) * Math.sin((p - z) * (2 * Math.PI) / x) * 0.5 + 1;
    },
    backIn: function(p) {
      var s = 1.70158;
      return p * p * ((s + 1) * p - s);
    },
    backOut: function(p) {
      var s = 1.70158;
      return ((p = p - 1) * p * ((s + 1) * p + s) + 1);
    },
    backBoth: function(p) {
      var s = 1.70158;
      if ((p /= 0.5) < 1) return 1 / 2 * (p * p * (((s *= (1.525)) + 1) * p - s));
      return 1 / 2 * ((p -= 2) * p * (((s *= (1.525)) + 1) * p + s) + 2);
    },
    bounceIn: function(p) {
      return 1 - Easing.bounceOut(1 - p);
    },
    bounceOut: function(p) {
      if (p < (1 / 2.75)) {
        return (7.5625 * p * p);
      } else if (p < (2 / 2.75)) {
        return (7.5625 * (p -= (1.5 / 2.75)) * p + 0.75);
      } else if (p < (2.5 / 2.75)) {
        return (7.5625 * (p -= (2.25 / 2.75)) * p + 0.9375);
      }
      return (7.5625 * (p -= (2.625 / 2.75)) * p + 0.984375);
    },
    bounceBoth: function(p) {
      if (p < 0.5) return Easing.bounceIn(p * 2) * 0.5;
      return Easing.bounceOut(p * 2 - 1) * 0.5 + 0.5;
    }
  };

  this.Easing = Easing;

}());