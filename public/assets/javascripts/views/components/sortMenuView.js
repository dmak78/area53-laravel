/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Sort menu view.

  Sort menu used to sort lists.

  Releated Sass files
    - modules/menus

  Example:

    <div class="sort-menu">
      <strong>[Title]</strong>

      <ul class="sort-options">
        <li>[...]</li>
      </ul>
    </div>
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',

// Base views
  'baseviews/hpBaseView'
], function ($, _, Backbone, HpBaseView) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click a': 'updateSortMenu',
            'touchend a': 'updateSortMenu'
        },

        initialize: function () {
        },

        /**
        * Render.
        */
        render: function () {
            // Set the initial value.
            this.value = this.getValue();
        },

        /**
        * Update the sorting menu.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        updateSortMenu: function (event) {
            var $target = $(event.target),
            value = $target.data('value'),
            type = $target.data('type');

            event.preventDefault();

            // Update the UI.
            $target.parent().addClass('active').siblings().removeClass('active');

            // Set the new value.
            if (value !== this.value) {
                this.value = value;
                this.trigger('updatedValue', value, type);
            }

            return this;
        },

        /**
        * Get the value for this sort menu.
        *
        * Returns the value.
        */
        getValue: function () {
            return this.$el.find('.active a').data('value');
        }
    });
});