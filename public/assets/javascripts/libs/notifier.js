/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Notifier.

  Breakpoint event manager.
*/
define([
  'jquery'
], function ($) {
  'use strict';

  /**
   * Notifier constructor.
   *
   * breakpoints  - Object of breakpoints to check against.
   * 
   * Examples
   *  
   *   var notifier = new Notifier({
   *     phone: {max: 480},
   *     tablet: {min: 481, max: 800},
   *     desktop: {min: 801}
   *   });
   */
  return function Notifier(breakpoints) {
    var $window = $(window),
      $body = $('body'),
      notifier = this,
      callbacks = {},
      state,
      methods;
      
    // Current notifier state.
    state = {
      lastBreakpoint: '',
      currentBreakpoint: ''
    };

    /**
     * Initialize.
     */
    this.initialize = function () {
      methods.buildBreakpointStrings();

      // Resize listener.
      $window.on('resize', function () {
        methods.checkBreakpoint();
      }).trigger('resize');
    };

    /**
     * Get the last breakpoint.
     */
    this.getLastBreakpoint = function () {
      return state.lastBreakpoint;
    };

    /**
     * Get the current breakpoint.
     */
    this.getCurrentBreakpoint = function () {
      return state.currentBreakpoint;
    };

    /**
     * Set up a callback list for breakpoints.
     */
    this.setCallback = function (breakpoint, fn) {
      if (!callbacks[breakpoint] || typeof fn !== 'function') {
        return false;
      }

      // Add the callback.
      callbacks[breakpoint].push(fn);

      return this;
    };

    /**
     * Set multiple callbacks.
     *
     * callbackList - Object of callbacks to set.
     */
    this.setCallbacks = function (callbackList) {
      var callback;
      
      for (callback in callbackList) {
        if (callbackList.hasOwnProperty(callback)) {
          this.setCallback(callback, callbackList[callback]);
        }
      }

      this.fireCallbacks();

      return this;
    };

    /**
     * Fire the callbacks for the passed in breakpoint.
     * @param {String} breakpoint Breakpoing to fire callbacks for. Defaults to the current breakpoint.
     *
     * The callback is fired in the context of the window, with two arguments,
     * the current breakpoint, and the previous breakpoint.
     */
    this.fireCallbacks = function (breakpoint) {
      var i, callbackList;
      
      // If there's no breakpoint, fire the callbacks for the current breakpoint.
      if (!breakpoint) {
        breakpoint = state.currentBreakpoint;
      }

      // It's possible that this breakpoint never had any callbacks set in the first place.
      // Don't attempt to fire callbacks if there aren't any.
      if (!callbacks[breakpoint]) {
        return false;
      }

      for (i = 0; i < callbacks[breakpoint].length; i++) {
        methods.fireCallback(callbacks[breakpoint][i]);
      }

      return this;
    };

    methods = {
      /**
       * Convert the breakpoint object into strings that matchMedia
       * can work with.
       *
       * This won't check for if you have overlapping breakpoints, yet.
       * Overlapping breakpoints don't currently work at all.
       */
      buildBreakpointStrings: function () {
        var string, breakpoint, name;

        this.breakpointStrings = {};

        for (name in breakpoints) {
          if (breakpoints.hasOwnProperty(name)) {
            string = 'only screen';
            breakpoint = breakpoints[name];

            // Add an entry to the callback list.
            callbacks[name] = [];

            if (breakpoint.max) {
              string += ' and (max-width: ' + breakpoint.max + 'px)';
            }

            if (breakpoint.min) {
              string += ' and (min-width: ' + breakpoint.min + 'px)';
            }

            this.breakpointStrings[name] = string;
          }
        }
      },

      /**
       * Check the breakpoint strings.
       */
      checkBreakpoint: function () {
        var string, name;

        // Loop over strings. Stop when one is found.
        for (name in this.breakpointStrings) {
          if (this.breakpointStrings.hasOwnProperty(name)) {
            string = this.breakpointStrings[name];
            if (this.testQuery(string) && name !== state.currentBreakpoint) {
              this.setCurrentBreakpoint(name);
              return false;
            }
          }
        }
      },

      /**
       * Test a media query string against matchMedia.
       * 
       * string - String to test.
       * 
       * Returns true if the string matches, false if it doesn't.
       */
      testQuery: function (string) {
        var matchMedia = window.matchMedia || window.msMatchMedia;
        if (matchMedia) {
          return matchMedia(string).matches;
        }
      },

      /**
       * Set the current breakpoint name, and trigger an event on the body.
       * @param {String} breakpoint Breakpoint name to set.
       */
      setCurrentBreakpoint: function (breakpoint) {
        state.lastBreakpoint = state.currentBreakpoint;
        state.currentBreakpoint = breakpoint;
        $body.trigger('breakpoint', breakpoint);
        notifier.fireCallbacks(breakpoint);
      },

      /**
       * Fire a single callback.
       * @param {Function} callback Callback to fire.
       */
      fireCallback: function (callback) {
        callback.call(window, state.currentBreakpoint, state.lastBreakpoint);
      }
    };

    this.initialize();
  };
});