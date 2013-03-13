/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
  Story block model.

  Each story block in the 'All stories' section of the stories
  home page.
*/
define([
  // Libs
  'backbone',
  'underscore'
], function (Backbone, _) {
  'use strict';

  /*jslint maxlen: 256 */
  // Private: Some fake names and descriptions for mockup purposes.
  var names = ['Mike Kenny', 'Josh Texeira', 'Karla Mickens', 'Will Simon', 'Andrew Berg'],
    descriptions = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Morbi a dolor at orci venenatis ullamcorper. Morbi a dolor at orci venenatis ullamcorper.',
      'Praesent sed nunc sit amet risus mollis commodo quis a sem. Praesent sed nunc sit amet risus mollis commodo quis a sem.',
      'Mauris ut lorem sed ante dapibus pellentesque eu vel est. Mauris ut lorem sed ante dapibus pellentesque eu vel est.',
      'Nunc vel quam vel est ultrices rutrum ut vel massa. Nunc vel quam vel est ultrices rutrum ut vel massa.',
      'Curabitur ac sem at justo iaculis venenatis. Curabitur ac sem at justo iaculis venenatis.',
      'Nam in justo id odio accumsan elementum sed nec lectus. Nam in justo id odio accumsan elementum sed nec lectus.',
      'Aliquam mollis quam sit amet tellus tristique tincidunt. Aliquam mollis quam sit amet tellus tristique tincidunt.',
      'Curabitur sit amet urna erat, et adipiscing tellus. Curabitur sit amet urna erat, et adipiscing tellus.',
      'Donec eu nibh et nisl consequat tempor. Donec eu nibh et nisl consequat tempor.',
      'Mauris eget ante dictum arcu adipiscing pharetra sed sit amet nulla. Mauris eget ante dictum arcu adipiscing pharetra sed sit amet nulla.',
      'Vestibulum mattis neque in lorem interdum ultrices. Vestibulum mattis neque in lorem interdum ultrices.',
      'Cras convallis mauris eleifend est rhoncus in ornare purus tincidunt. Cras convallis mauris eleifend est rhoncus in ornare purus tincidunt.',
      'Nullam dignissim ipsum congue ante consequat tristique. Nullam dignissim ipsum congue ante consequat tristique.',
      'Curabitur non sem ut libero lobortis laoreet.'
    ];
  /*jslint maxlen: 80 */

  return Backbone.Model.extend({
    // Max length for a shortTitle property.
    shortTitleLength: 31,

    /**
     * Parse.
     *
     * data - Model data. See http://backbonejs.org/#Model-parse
     *
     * Returns the parsed data.
     */
    parse: function (data) {
      data.formattedDate = this.makeFormattedDate(data.date);
      data.formattedShortDate = this.makeFormattedShortDate(data.date);
      data.shortTitle = this.makeShortTitle(data.title);
      data.formattedCategory = this.makeFormattedCategory(data.category);

      // Provide a default description.
      data.description = data.description ||
                         descriptions[_.random(0, descriptions.length - 1)];

      // Mocked Ajax response does not provide an author property.
      data.author = data.author || names[_.random(0, names.length - 1)];

      return data;
    },

    /**
     * Create a formatted date.
     *
     * date - Original date string. Expects YYYY-MM-DD.
     *
     * Returns the formatted date string.
     */
    makeFormattedDate: function (date) {
      var values = date.split('-'),
        rawDate = new Date(values[0], values[1], values[2]),
        months = ['January', 'February', 'March',
                  'April', 'May', 'June',
                  'July', 'August', 'September',
                  'October', 'November', 'December'];

      // Ex: January 02, 2012
      return months[rawDate.getMonth()] + ' ' +
             rawDate.getDate() + ', ' +
             rawDate.getFullYear();
    },

    /**
     * Create a shorter formatted date.
     *
     * date - Original date string.
     *
     * Returns the short formatted date.
     */
    makeFormattedShortDate: function (date) {
      var rawDate = new Date(date),
        shortMonths = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June',
                       'Jul.', 'Aug.', 'Sept.', 'Oct.', 'Nov.', 'Dec.'];

      // Ex: Jan. 02, '12
      return shortMonths[rawDate.getMonth()] + ' ' +
             rawDate.getDate() + ', \'' +
             rawDate.getFullYear().toString().slice(2);
    },

    /**
     * Make a formatted category, turning a-category into A Category.
     *
     * category - Orginal category string.
     *
     * Returns the formatted category.
     */
    makeFormattedCategory: function (category) {
      var formatted = '';

      _.each(category.split('-'), function (part, index, list) {
        formatted += part.charAt(0).toUpperCase() + part.slice(1);

        if (index < list.length) {
          formatted += ' ';
        }
      });

      return formatted;
    },

    /**
     * Make a short title.
     *
     * title  - Original, full title.
     *
     * Returns the short title.
     */
    makeShortTitle: function (title) {
      var shortTitle = title.substr(0, this.shortTitleLength);

      if (shortTitle.length === this.shortTitleLength) {
        shortTitle += '&hellip;';
      }

      return shortTitle;
    }
  });
});