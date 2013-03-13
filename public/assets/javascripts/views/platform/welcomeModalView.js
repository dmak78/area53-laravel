/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Welcome modal view.
*/
define([
// Libs
  'jquery',

// Base views.
  'baseviews/hpBaseView',

// Components.
  'components/sliderView'
], function ($, HpBaseView, SliderView) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .previous-step': 'prev',
            'click .next-step': 'next'
        },

        /**
        * Initialize.
        */
        initialize: function () {
            this.welcomeSlider = new SliderView();

            // Watch for update events from the slider.
            this.welcomeSlider.on('updated', this.update, this);
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            // Render child views.
            this.assign({
                '.welcome-slider': this.welcomeSlider
            });

            // Show the modal on render.
            this.$el.find('#welcome-modal').modal('show');

            // Something weird is preventing the slider from rendering on show.
            this.welcomeSlider.render();


            this.setupTagit('input[id$=txtExpertise], input[id$=txtInterests]');


            return this;
        },

        /**
        * Go to previous slide.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        prev: function (event) {
            event.preventDefault();
            this.welcomeSlider.slider.prev();
            this.update(this.welcomeSlider.slider.getPos());
            return this;
        },

        /**
        * Go to the next slide.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        next: function (event) {
            event.preventDefault();
            this.welcomeSlider.slider.next();
            this.update(this.welcomeSlider.slider.getPos());
            return this;
        },

        /**
        * Update callback for the slider.
        *
        * index  - Index of the current slide.
        *
        * Returns this.
        */
        update: function (index) {
            console.log(index);
            var $current = this.$el.find('.current'),
        $submit = this.$el.find('#profile-submit'),
        fn = index + 1 === 4 ? 'removeClass' : 'addClass';

            // Update the step.
            $current.text(index + 1);

            // Update the submit button.
            $submit[fn].call($submit, 'disabled');

            return this;
        }
    });
});