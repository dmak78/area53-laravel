/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Social network view.

  Related Sass files.
    - layouts/platform/_social-network.scss
*/
define([
// Libs
  'jquery',
  'underscore',
  'modernizr',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/newsfeedView'
], function ($, _, Modernizr, HpBaseView, NewsfeedView) {
    'use strict';

    return HpBaseView.extend({
        events: {
        },

        /**
        * Initialize.
        */
        initialize: function () {
            this.$body = $('body');

            // Init subviews.
            this.newsfeedView = new NewsfeedView();

            // Bind global events.
            this.$body.on('click touchstart', '.close-mobile-tray', _.bind(this.closeAboutTray, this));
        },

        /**
        * Render.
        */
        render: function () {
            // Element references.
            this.$sidebars = this.$el.find('.sidebars');

            // Render sub views.
            this.assign({
                '.newsfeed': this.newsfeedView
            });

            // Set responsive callbacks.
            window.area53.notifier.setCallbacks({
                tablet: _.bind(function (current, previous) {
                    if (previous === 'phone') {
                        this.teardownAboutTray();
                    }
                }, this),
                phone: _.bind(function () {
                    this.setupAboutTray();
                }, this)
            });
        },

        /**
        * Set up the about tray in the DOM.
        */
        setupAboutTray: function () {
            // Clone and hide the exiting sidebars.
            this.$sidebarTray = this.$sidebars.clone().addClass('platform-mobile-tray');
            this.$sidebars.hide();

            // Wrap the header, footer and page contents.
            this.$panelElements = $('.global-header, .global-footer, .section-platform').addClass('platform-mobile-panel');
            this.$closeButton = $('<div class="close-mobile-tray">Close tray</div>');

            // Append the sidebar tray to the DOM.
            this.$body.append(this.$sidebarTray.show(), this.$closeButton);
        },

        /**
        * Open the about tray.
        */
        openAboutTray: function () {
            // Open the tray.
            this.$panelElements.addClass('open');
            this.$sidebarTray.addClass('open').css('visibility', 'visible');

            // Show the close button after the panel opens.
            this.$panelElements.on(Modernizr.transEndEventName, _.bind(function () {
                this.$closeButton.addClass('show');
                this.$panelElements.off(Modernizr.transEndEventName);
            }, this));

            // Prevent scrolling.
            this.$body.css('overflow', 'hidden');

            return this;
        },

        /**
        * Close the about tray.
        */
        closeAboutTray: function () {
            // Close.
            this.$closeButton.removeClass('show');

            this.$closeButton.on(Modernizr.transEndEventName, _.bind(function () {
                this.$panelElements.removeClass('open');
                this.$closeButton.off(Modernizr.transEndEventName);
            }, this));

            // Remove the open class after the panel is closed to prevent a flash.
            this.$panelElements.on(Modernizr.transEndEventName, _.bind(function () {
                this.$sidebarTray.removeClass('open');
                this.$panelElements.off(Modernizr.transEndEventName);
            }, this));

            // Enable scrolling.
            this.$body.css('overflow', 'auto');
            
            return this;
        },

        /**
        * Teardown the about tray.
        */
        teardownAboutTray: function () {
            this.closeAboutTray();
            
            // Remove panel classes.
            this.$panelElements.removeClass('platform-mobile-panel');

            // Remove the tray element.
            this.$sidebarTray.remove();
            this.$closeButton.remove();

            // Re-show the sidebars.
            this.$sidebars.show();
        }
    });
});