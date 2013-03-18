/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Slider view.

  Backbone view for a slider element.

  Related Sass files:
    - modules/sliders
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',
  'swipe',

// Base views
  'baseviews/hpBaseView'
], function ($, _, Backbone, Swipe, HpBaseView) {
    'use strict';

    /**
    * Private: Slider library constructor.
    * Will init Swipe for modern browsers, but will fallback to 
    * Twitter Boostrap carousel for older browsers.
    *
    * $element - Element to build the slider on.
    * options  - Slider options.
    *
    * Returns the Swipe object, or the Bootrstrap carousel object.
    */
    var SliderLibrary = function ($element, options) {
        options = options || {};

        // Modern browsers get Swipe.
        if (window.area53.supports.transition) {
            return new Swipe($element.get(0), options);
        }

        // Fallback to the Bootstrap carousel.
        $element.css('visibility', 'visible')
      .find('.slide').addClass('item')
      .first().addClass('active').end().end()
      .carousel({ interval: false });

        // return $element.data('carousel');
        return _.extend($element.data('carousel'), {
            fallback: true,
            // Provide a getPos fallback.
            getPos: function () {
                return this.$element.find('.item:visible').index();
            }
        });
    };

    return HpBaseView.extend({

        template : _.template('<h1>Nothing To See</h1>'),

        initialize: function (options){
            options = options || {};
            if(options.template){
                this.template = _.template(options.template);
            }      
        },

        events: {
            'click .next': 'nextSlide',
            'click .prev': 'prevSlide',
            'click .dots li': 'goTo'
        },

        /**
        * Render.
        */
        render: function () {
            this.$el.empty().append(this.template());
            // Element references.
            this.$slides = this.$el.find('.slides');
            this.$dots = this.$el.find('.dots li');
            this.$next = this.$el.find('.next');
            this.$prev = this.$el.find('.prev');

            // Create a slider using the appropriate slider library.
            this.slider = new SliderLibrary(this.$slides, {
                speed: 300
            });
            return this;
        },

        /**
        * Next slide.
        *
        * event  - Event object from the click event.
        */
        nextSlide: function (event) {
            event.preventDefault();
            this.slider.next();
            this.updateDot(this.slider.getPos());
            this.trigger('updated', this.slider.getPos());
        },

        /**
        * Prev slide.
        *
        * event  - Event object from the click event.
        */
        prevSlide: function (event) {
            event.preventDefault();

            if (this.slider.index === 0) {
                this.slider.slide(this.slider.length - 1);
            } else {
                this.slider.prev();
            }

            this.updateDot(this.slider.getPos());
            this.trigger('updated', this.slider.getPos());
        },

        /**
        * Simple wrapper around some Swipe methods.
        *
        * event  - Event object from the click event.
        */
        goTo: function (event) {
            var index = $(event.target).data('index'),
        fn = this.slider.fallback ? 'to' : 'slide';

            event.preventDefault();

            // Bootstrap uses 'to', Swipe uses 'slide'.
            this.slider[fn].call(this.slider, index);
            this.updateDot(this.slider.getPos());
            
        },

        /**
        * Update the currently active dot.
        *
        * index  - Index of the dot to update.
        */
        updateDot: function (index) {
            index = parseInt(index, 10);
            this.$dots.eq(index).addClass('active').siblings().removeClass('active');
        }
    });
});