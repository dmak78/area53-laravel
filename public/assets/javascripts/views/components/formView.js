/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Generic form view.

  Makes dealing with validations easier. Fires Backbone
  events when certain actions happens, and handles event
  binding inside the form element.
*/
define([
  // Libs
  'underscore',
  'live-validation',

  // Base views.
  'baseviews/hpBaseView'
], function (_, LiveValidation, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'keyup input[type="text"]': 'checkValidations',
      'keyup textarea': 'checkValidations',
      'change select': 'checkValidations'
    },

    // Tracking object for validations.
    validations: {},

    // Tracking array for form callbacks. These callbacks get fired whenever
    // the form is validated, regardless of state.
    validFormCallbacks: [],

    // Classnames.
    invalidFormClass: 'invalid-form',
    validFormClass: 'valid-form',

    /**
     * Public: Initialize.
     *
     * Returns this.
     */
    initialize: function (options) {
      options = options || {};

      // Default options.
      options = _.defaults(options, {
        useDefaultCallback: true
      });

      // Add the default toggle form callback to the callback list.
      if (options.useDefaultCallback) {
        this.validFormCallbacks.push(this.defaultToggleCallback);
      }

      // Listen for the validated event.
      this.on('validated', this.toggleFormState, this);

      return this;
    },

    /**
     * Public: Render.
     *
     * Returns this.
     */
    render: function () {
      // Element references.
      this.$buttons = this.$el.find('.button-bar .button');

      // Set the default classname for the form element.
      this.$el.addClass(this.invalidFormClass);

      return this;
    },

    /**
     * Public: Add one or multiple validations.
     *
     * name       - The name (object key) of a validation, or a single validation.
     * validation - The validation object, if passing a single validation.
     *
     * Returns this.
     */
    addValidations: function (name, validation) {
      this.validations = this.convertToObject(name, validation);
      return this;
    },

    /**
     * Public: Check if the form is valid and fire an event with the result.
     *
     * Returns this.
     */
    checkValidations: function () {
      // Trigger the event.
      this.trigger('validated', this.isValid());
      return this;
    },

    /**
     * Public: Check if all validations are valid.
     *
     * Returns true for valid, false for invalid.
     */
    isValid: function () {
      var results = [],
        validation;

      for (validation in this.validations) {
        if (this.validations.hasOwnProperty(validation)) {
          results.push(this.validations[validation].validate());
        }
      }

      // Check if any values are still false.
      return _.indexOf(results, false) > -1 ? false : true;
    },

    /**
     * Public: Fire the callbacks that will toggle form state.
     *
     * Returns this.
     */
    toggleFormState: function () {
      var className = this.isValid() ? this.validFormClass : this.invalidFormClass;

      // Fire the callbacks.
      _.each(this.validFormCallbacks, function (callback) {
        callback.call(this, this.isValid());
      }, this);

      // Update the state of the form.
      this.$el.removeClass(this.invalidFormClass + ' ' + this.validFormClass)
        .addClass(className);

      return this;
    },

    /**
     * Public: Add one or many form toggle callbacks.
     *
     * callback - A function, array of functions, or object of functions
     *            to add to the callback list. These callbacks get fired
     *            every time the form is validated.
     *
     * Returns this.
     */
    addToggleCallback: function (callback) {
      var callbacks = [];

      if (_.isFunction(callback)) {
        callbacks.push(callback);
      } else {
        callbacks = callback;
      }

      _.each(callbacks, function (callback) {
        if (_.isFunction(callback)) {
          this.validFormCallbacks.push(callback);
        }
      }, this);

      return this;
    },

    /**
     * Public: Default function when the form is togged valid or invalid.
     *
     * state  - True if the form is valid, false if not.
     *
     * Returns this.
     */
    defaultToggleCallback: function (state) {
      var fn = state ? 'removeClass' : 'addClass';
      this.$buttons[fn]('disabled');

      return this;
    }
  });
});