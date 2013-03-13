/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Stories submit view.
*/
define([
  // Libs
  'jquery',
  'underscore',

  // Base views.
  'baseviews/hpBaseView',

  // Components
  'components/formView',
  'components/selectBoxView',
  'components/postFormView',
  'components/taggingView'
], function ($, _, HpBaseView, FormView, SelectBoxView, PostFormView, TaggingView) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'click .save-draft': 'saveDraft',
      'click .publish-story': 'publishStory',
      'click .add-tag': 'toggleTaggingInterface'
    },

    /**
     * Initialize.
     */
    initialize: function () {
      // Init child views.
      this.form = new FormView({
        // Don't use the default toggle calllback...
        useDefaultCallback: false
        // ...use our own.
      }).addToggleCallback(function (valid) {
        var $button = this.$el.find('.publish-story'),
          fn = valid ? 'removeClass' : 'addClass';

        $button[fn].call($button, 'disabled');
      });

      this.categorySelect = new SelectBoxView();
      this.descriptionInput = new PostFormView();
      this.taggingInterface = new TaggingView();
    },

    /**
     * Render.
     *
     * Returns this.
     */
    render: function () {
      // Render child views.
      this.assign({
        '.category-select': this.categorySelect,
        '.submit-story': this.descriptionInput,
        '.tagging-interface': this.taggingInterface
      });

      // Can't have duplicate object keys in strict mode.
      this.assign('.submit-story', this.form);

      // Add form validations.
      this.form.addValidations({
        'story-name': new LiveValidation('story-name')
          .add(Validate.Presence),
        'story-description': new LiveValidation('story-description')
          .add(Validate.Presence)
      });

      // Bind an event listener for change events so we can update
      // the form validations.
      this.descriptionInput.on('editorShown', _.bind(function () {
        var $editor = this.descriptionInput.$el.find('textarea');

        // Use the wysihtml5 plugin events to check when to validate
        // the form.
        $editor.data('wysihtml5')
          .editor.on('change', _.bind(function () {
            this.form.checkValidations();
          }, this));
      }, this));

      return this;
    },

    /**
     * Save a draft of the current story.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    saveDraft: function (event) {
      var data;

      event.preventDefault();

      data = this.getFormData();

      return this;
    },

    /**
     * Publish this story.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    publishStory: function (event) {
      var $target = $(event.target),
        data;

      event.preventDefault();

      if ($target.hasClass('disabled')) {
        return this;
      }

      data = this.getFormData();

      return this;
    },

    /**
     * Get the data from the current submit story form.
     *
     * Returns the form data object.
     */
    getFormData: function () {
      var $form = this.$el.find('.submit-story'),
        data = {
          name: $form.find('#story-name').val(),
          category: this.categorySelect.getValue(),
          description: this.descriptionInput.getValue($form)
        };

      return data;
    },

    /**
     * Hide or show the tagging interface.
     *
     * Returns this.
     */
    toggleTaggingInterface: function (event) {
      var $element = this.taggingInterface.$el,
        fn = $element.is(':visible') ? 'hide' : 'show';

      event.preventDefault();
      $element[fn].call($element);
      return this;
    }
  });
});