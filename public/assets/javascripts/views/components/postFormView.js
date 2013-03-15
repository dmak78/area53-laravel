/*jslint browser: true, indent: 2, nomen: true */
/*global define, require */

/*
  Post form view.

  This text input it used to post status updates and comments.

  This view fires off an event, `post`, when the post button is clicked.
  The post data is passed along with the event.
*/
define([
// Libs.
  'jquery',
  'underscore',

// Base views.
  'baseviews/hpBaseView'
], function ($, _, HpBaseView) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click textarea': 'showWysiwygControls',
            'click .post': 'preparePost',
            'touchend .post': 'preparePost',
            'click .add-link': 'manageLinkDialog'
        },

        // Track posts that have been made.
        // If this isn't useful, just remove it.
        // See the push in this#post.
        posts: [],

        postId: "",

        // Track if the controls have been shown for this form.
        controlsShowing: false,

        // Track when the add link dialog is open.
        addLinkDialogOpen: false,

        /**
        * Initialize.
        */
        initialize: function () {
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            return this;
        },

        /**
        * Show the Wysiwyg plugin controls.
        *
        * event  - Event object from the textarea click.
        *
        * Returns this.
        */
        showWysiwygControls: function (event) {
            // Bail out if the controls are already in place.
            if (this.controlsShowing) {
                return this;
            }
            this.controlsShowing = true;
            var $target = $(event.target),
                $form = this.getFormElement($target);



            // Require the needed libs.
            require(['libs/bootstrap-wysihtml5'], _.bind(function () {
                // Init the wysiwyg editor.
                $target.wysihtml5({
                    'font-styles': false,
                    'emphasis': true,
                    'lists': false,
                    'html': false,
                    'link': true,
                    'image': false,
                    'stylesheets': ['/assets/css/style.css'],
                    'events': {
                        'load': function () {
                            // Move the toolbar under the textarea.
                            $form.find('iframe').closest('.wysiwyg-textarea-wrapper').after($form.find('.wysihtml5-toolbar'));

                        }
                    }
                });

                this.trigger('editorShown');
                this.controlsShowing = true;
                this.$el.find('textarea').data('wysihtml5').editor.focus();
            }, this));

            return this;
        },

        /**
        * Manage the link dialog that opens when clicking the add link button.
        *
        * Returns this.
        */
        manageLinkDialog: function () {
            var $addLink = window.area53.dialogs.$current,
            // Pass the current form back to setLink,
            // because in a simple implemenation,
            // we _might_ be binding to multiple DOM elements.
        $form = $(event.target).closest('.post-form');

            // Listen for when the dialog opens up.
            window.area53.dialogs.$el.on('currentSet', _.bind(function (event, args) {
                var $dialog = args.dialog || this.$el.find('#add-link-modal'),
          $title = $dialog.find('#link-title'),
          $url = $dialog.find('#link-url');

                this.addLinkDialogOpen = true;

                // Listen for a click on the insert button, and send the link data
                // back to the Wysiwyg view.
                $dialog.on('click', '.insert-link', _.bind(function (event) {
                    event.preventDefault();

                    // Set the link.
                    this.setLink({
                        text: $title.val(),
                        href: $url.val()
                    }, $form);
                }, this));

                window.area53.dialogs.$el.off('currentSet');
            }, this));

            return this;
        },

        /**
        * Use the Wysihtml5 library to set a link inside the textarea.
        *
        * data   - Link data to set.
        * $form  - Optional, form that contains the textarea to set.
        *          Defaults to the first element in this view's $el property.
        *          If this view is only bound to one $el, you don't need
        *          to pass anything at all.
        *
        * Returns this.
        */
        setLink: function (data, $form) {
            var options = {
                href: 'http://google.com',
                text: 'Link',
                target: '_blank',
                rel: 'nofollow'
            };

            options = _.defaults(data, options);
            $form = $form || this.$el.first();

            $form.find('textarea').data('wysihtml5')
        .editor.composer.commands.exec('createLink', options);

            return this;
        },

        /**
        * Prepare to post.
        *
        * event  - Event object from the post button click.
        *
        * Returns this.
        */
        preparePost: function (event) {
            event.preventDefault();
            this.post(this.getFormElement($(event.target)));
            return this;
        },

        /**
        * Post the contents of the form.
        *
        * $form  - The form to post. This needs to be specified if the view is
        *          bound to more than one DOM element. Defaults to the first
        *          available $el.
        *
        * Returns this.
        */
        post: function ($form) {
            var data = {},
        val,
        $textarea;

            $form = $form || this.$el.first();
            $textarea = $form.find('textarea');
            val = $textarea.val();

            // Check value.
            if (!val) {
                return this;
            }

            // Set up the data object.
            data = {
                postId: this.postId,
                content: val,
                $editor: $textarea,
                type: $form.data('type') || 'post',
                // Add a way to add extra, external sources to this
                // data object. Maybe a map of a name => fn that returns source values.
                tags: $.map($form.find('.tag:visible'), function (el) {
                    return $(el).text();
                })
            };

            // If the tags are empty, convert the value to null.
            if (!data.tags.length) {
                data.tags = null;
            }

            // Trigger an event.
            this.trigger('post', data);
            this.removeWysi();

            return this;
        },

        /**
        * Get the value of the textarea.
        *
        * Returns the value.
        */
        getValue: function ($form) {
            return $form.find('textarea').val();
        },

        /**
        * Get the form element containing a dom element.
        *
        * $target  - jQuery object somewhere inside the post form.
        *
        * Returns the form containing $target.
        */
        getFormElement: function ($target) {
            return $target.closest('form');
        },
        removeWysi: function () {
            this.$el.find("iframe.wysihtml5-sandbox, div.new-comment input[name='_wysihtml5_mode']").remove();
            $("body").removeClass("wysihtml5-supported");
            this.$el.find('.wysihtml5-toolbar').remove();
            this.$el.find('textarea').show();
            this.$el.find('textarea').val('');
            this.controlsShowing = false;
        }
    });
});