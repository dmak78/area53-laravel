/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  HPOne Modal Dialog manager.
  Wraps HPOne specific functionality around Twitter Bootstrap modal dialogs.
*/
define([
  // Libs
  'jquery',
  'modernizr'
], function ($, Modernizr) {
  'use strict';

  /**
   * Public: Dialogs constructor.
   *
   * options - Object of options (default: {}).
   *           element - jQuery object for an element to bind to (defaults to the `body`).
   *
   * Returns nothing.
   */
  return function Dialogs(options) {
    var modals = this;

    options = options || {};

    this.genericErrorMessage = 'There was an error retreiving the content. Please try again.';

    /**
     * Initialize.
     */
    this.initialize = function () {
      // Setup element references.
      this.$el = options.element || $('body');
      this.$modals = this.$el.find('.modal');

      // Ajax asset path.
      this.ajaxPath = '/ajax';

      this.bindEvents();

      // Set up responsive events.
      window.area53.notifier.setCallbacks({
        desktop: function () {
          modals.setHeaderHeight(modals.$current);
        },
        tablet: function () {
          modals.setHeaderHeight(modals.$current);
        },
        phone: function () {
          modals.setHeaderHeight(modals.$current);
        }
      });
    };

    /**
     * Bind events.
     */
    this.bindEvents = function () {
      this.$modals
        // Showing the modal.
        .on('show', function (event) {
          var $modal = $(event.target);

          modals.$current = $modal;
          modals.$el.trigger('currentSet', {dialog: $modal});

          $('body').css('overflow', 'hidden');
          modals.showModalWrapper($modal);
          modals.getModalContent($modal);

          // Event listener for the backdrop.
          $(window).on('click.modal-dialog', function (event) {
            var $target = $(event.target);
            if ($target.hasClass('modal-container') || $target.hasClass('modal')) {
              $modal.modal('hide');
              $(window).off('click.modal-dialog');
            }
          });
        })
        // After the modal has been shown.
        .on('shown', function () {
          var $wrapper = modals.$current.find('.modal-content-wrapper');

          $wrapper.addClass('show');

          modals.setHeaderHeight(modals.$current);
        })
        // When hiding the modal.
        .on('hide', function () {
          var $wrapper = modals.$current.find('.modal-content-wrapper'),
            returnToNormal = function () {
              $('body').css('overflow', 'visible');
              modals.hideModalWrapper(modals.$current);
            };

          $wrapper.removeClass('show');
          
          if (!window.area53.supports.transition) {
            returnToNormal();
          } else {
            // Transition end event.
            $wrapper.on(Modernizr.transEndEventName, function () {
              returnToNormal();
              $wrapper.off(Modernizr.transEndEventName);
            });
          }
        });

      // Close button.
      this.$el.on('click', '.modal-close', function (event) {
        event.preventDefault();
        modals.$current.modal('hide');
      });
    };

    /**
     * Set the header height and spacing for the modal dialog.
     *
     * $modal - Dialog to set the header height for. Defaults to this.$current;
     *          If there's no dialog, returns this.
     *
     * Returns this.
     */
    this.setHeaderHeight = function ($modal) {
      var $header, $body;

      $modal = $modal || modals.$current;

      if (!$modal) {
        return this;
      }

      $header = $modal.find('.modal-header');
      $body = $modal.find('.modal-body');

      $body.css('margin-top', $header.outerHeight(true) - 1);
      return this;
    };

    /**
     * Show the modal dialog.
     *
     * $modal - The modal dialog to show.
     */
    this.showModalWrapper = function ($modal) {
      $modal.addClass('open');
    };

    /**
     * Hide the modal dialog.
     *
     * $modal - The modal dialog to hide.
     */
    this.hideModalWrapper = function ($modal) {
      $modal.removeClass('open');
    };

    /**
     * Get the content for the modal dialog via Ajax.
     *
     * $modal - The modal dialog to get content for.
     */
    this.getModalContent = function ($modal) {
      var $content = $modal.find('.modal-content'),
        type = $modal.data('type'),
        url = modals.ajaxPath + '/' + type + '.php';

      if (!type) {
        return this;
      }

      $.when($.get(url)).then(function (response) {
        // Load the content.
        $content.html(response);
      }).fail(function () {
        $content.html(modals.genericErrorMessage);
      });
    };

    this.initialize();
  };
});