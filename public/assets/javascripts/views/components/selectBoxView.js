/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Select box component view.

  See modules/menus/_menus.scss

  Expected markup:

  <div class="select-box">
    <a href="#" class="select-value" data-value="[...]">[...]</a>

    <ul class="select-menu">
      <li><a href="#">[...]</a></li>
    </ul>
  </div>
*/
define([
  // Libs.
  'jquery',
  'underscore',

  // Base views
  'baseviews/hpBaseView'
], function ($, _, HpBaseView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'click .select-value': 'toggleMenu',
      'click .select-menu a': 'selectValue'
    },

    /**
     * Public: Render.
     *
     * Returns this.
     */
    render: function () {
      var $cloned;

      // Element references.
      this.$menu = this.$el.find('.select-menu');
      this.$value = this.$el.find('.select-value');

      this.value = this.$value.data('value');

      // Prepend the value to the menu.
      this.$menu.prepend('<li><a href="#" data-value="' + this.getValue() + '">' + this.getText() + '</a></li>');

      return this;
    },

    /**
     * Public: Show menu.
     *
     * Returns this.
     */
    toggleMenu: function (event) {
      var fn = this.$el.hasClass('active') ? 'removeClass' : 'addClass';

      if (event) {
        event.preventDefault();
      }

      // Toggle.
      this.$el[fn].call(this.$el, 'active');

      // Bind a listener to the window to close the menu on click.
      if (fn === 'addClass') {
        // Set timeout because the browser gets confused when binding the click
        // event immediately.
        setTimeout(_.bind(function () {
          $(window).on('click.select-menu', _.bind(function (event) {
            // Only toggle the menu if we _haven't_ clicked the menu.
            if (!$(event.target).closest('.select-menu').length) {
              this.toggleMenu();
            }
          }, this));
        }, this), 10);
      } else {
        // Remove the window listener when closing the menu.
        $(window).off('click.select-menu');
      }

      return this;
    },

    /**
     * Public: Select a value.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    selectValue: function (event) {
      var $target = $(event.target),
        value = $target.data('value');

      event.preventDefault();

      if (this.value !== value) {
        this.value = value;
        this.trigger('updatedValue', this.getData());
      }

      this.updateValue(value, $target);

      return this;
    },

    /**
     * Public: Update the value of the select box.
     *
     * value      - Value to set.
     * $selected  - Optional jQuery object of the selected item.
     *
     * Returns this.
     */
    updateValue: function (value, $selected) {
      var text;

      this.value = value;

      if (!$selected) {
        text = this.$menu.find('[data-value="' + value + '"]').text();
      } else {
        text = $selected.text();
      }

      // Update the value element.
      this.$value.text(text).attr('data-value', value);

      // Close the menu.
      this.toggleMenu();

      return this;
    },

    /**
     * Public: Get the currently set value.
     *
     * Returns the current value.
     */
    getValue: function () {
      return this.value || '';
    },

    /**
     * Public: Get text.
     *
     * Returns the text of the currently selected value.
     */
    getText: function () {
      return this.$value.text() || '';
    },

    /**
     * Public: Get data.
     *
     * Returns an object of the value and text.
     */
    getData: function () {
      return {value: this.getValue(), text: this.getText()};
    }
  });
});