/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */


/*
  Stories home page.
*/
define([
  // Libs
  'jquery',
  'underscore',
  'masonry',

  // Collections.
  'collections/storyBlockCollection',

  // Base views.
  'baseviews/hpBaseView',

  // Components.
  'components/sliderView',
  'components/selectBoxView',
  'components/sortMenuView',

  // Templates
  'text!templates/stories/story-grid-item.html',
  'text!templates/stories/story-list-item.html'
], function ($, _, Masonry, StoryBlockCollection, HpBaseView, SliderView,
  SelectBoxView, SortMenuView, storyGridItemTemplate, storyListItemTemplate) {
  'use strict';

  return HpBaseView.extend({
    events: {
      'click .load-more-stories': 'loadStories',
      'click .select-list-view': 'setViewState',
      'click .select-grid-view': 'setViewState',
      'click .sort-menu .date': 'toggleSortDir'
    },

    // Public: The number of stories per page.
    pageCount: 12,

    // Public: The lowest amount of items in the collection before
    // fetching more.
    storyDataBuffer: 12,

    // Public: State object. Tracks various view state properties.
    state: {
      type: 'grid',
      // Sort order.
      sort: 'most-recent',
      // Track the current category filter.
      filter: 'all',
      // Page of data to display.
      page: 1
    },

    // Public: Templates for All Stories items.
    gridTemplate: _.template(storyGridItemTemplate),
    listTemplate: _.template(storyListItemTemplate),

    /**
     * Public: Initialize.
     */
    initialize: function () {
      // Init the child views.
      this.slider = new SliderView();
      this.categorySelect = new SelectBoxView();
      this.gridViewSort = new SortMenuView();
      this.listViewSort = new SortMenuView();

      // Init the story block collection.
      this.storyBlockCollection = new StoryBlockCollection();

      // Insert stories when data is loaded into the collection.
      this.storyBlockCollection.on('reset', this.renderState, this)
        // Fetch the initial set of data.
        .fetch();

      // Listen for when the category select changes.
      // Set the category filter property.
      this.categorySelect.on('updatedValue', function (data) {
        this.state.filter = data.value;
        this.renderState();
      }, this);

      // Listen for sorting changes in the grid.
      this.gridViewSort.on('updatedValue', function (value) {
        this.state.sort = value;

        switch (value) {
        // Sort the collction by likes in ascending order.
        case 'most-popular':
          this.storyBlockCollection.setSort('likes');
          break;

        // Default sorting.
        default:
          this.storyBlockCollection.setSort('date');
        }

        this.renderState();
      }, this);

      // Listen for sorting changes in the list.
      this.listViewSort.on('updatedValue', function (value) {
        var $pagination = this.$el.find('.alpha-pagination'),
          fn = value === 'date' ? 'slideUp' : 'slideDown';

        // Show/hide the alpha pagination.
        $pagination[fn]();

        // Reset the sort order when deselecting date.
        if (value !== 'date') {
          this.$el.find('.sort-options .date').removeClass('desc');
        }

        this.state.sort = value;
        this.storyBlockCollection.setSort(value);
        this.renderState();
      }, this);
    },

    /**
     * Public: Render.
     *
     * Returns this.
     */
    render: function () {
      // Render child views.
      this.assign({
        '.stories-home-slider': this.slider,
        '.category-select': this.categorySelect,
        '#grid-view .sort-menu': this.gridViewSort,
        '#list-view .sort-menu': this.listViewSort
      });

      // Element references.
      this.$grid = this.$el.find('.grid-view');
      this.$list = this.$el.find('.list-view');

      return this;
    },

    /**
     * Toggle the sort direction for the list view 'date' sort.
     *
     * event  - Event object from the click.
     *
     * Returns this.
     */
    toggleSortDir: function (event) {
      var $target = $(event.target),
        dir = $target.hasClass('desc') ? 'asc' : 'desc',
        fn = dir === 'asc' ? 'removeClass' : 'addClass';

      this.storyBlockCollection.setSort('date', dir);
      $target[fn]('desc');
      this.renderState();
      return this;
    },

    /**
     * Render the correct content for the current state. Uses the
     * state object to determine which UI element to empty.
     * Since we're re-rendering, reset the page number.
     *
     * Returns this.
     */
    renderState: function () {
      var $container = this['$' + this.state.type];

      // Reset the page count.
      this.state.page = 1;

      $container.empty();

      // Remove the old sort class.
      _.map($container.attr('class').split(' '), function (className) {
        if (className.indexOf('sorted-') > -1) {
          $container.removeClass(className);
        }
      });

      // Add the sort classname.
      $container.addClass('sorted-' + (_.bind(function () {
        var sort = this.state.type;
        return this[sort + 'ViewSort'].getValue();
      }, this)()));

      this.loadStories();
      return this;
    },

    /**
     * Switch the view state of the All Stories section. Re-renders
     * the current state after it's set.
     *
     * event  - Event object from the tab click.
     *
     * Returns this.
     */
    setViewState: function (event) {
      var $target = $(event.target),
        type = $target.attr('href').slice(1);

      // Change `<type>-view` to `<type>`.
      type = type.slice(0, type.indexOf('-'));

      // Set the state type.
      this.state.type = type;

      // When the pane is showing, render.
      $target.on('shown', _.bind(function () {
        this.renderState();
        $target.off('shown');
      }, this));

      return this;
    },

    /**
     * Public: Check to make sure we have enough data to render with.
     *
     * options - Could be one of two things. If this is an event
     *           callback, this will be the event object. An options
     *           object can handle these values:
     *           - force: Force another Ajax call to get more data.
     *
     * Returns this.
     */
    loadStories: function (options) {
      options = options || {};

      // If options is an event object.
      if (options.preventDefault) {
        options.preventDefault();
      }

      // Get more data if there's not enough for a page.
      // Decide if we want to display a 'No more messages' thing here.
      if (options.force) {
        this.state.page = 1;
        this.storyBlockCollection.fetch({silent: true});
      } else {
        this.insertStories();
      }

      return this;
    },

    /**
     * Public: Insert story covers.
     *
     * Returns this.
     */
    insertStories: function () {
      var pageItems = this.prepareStoryItemsData(),
        largePositions = this.getLayout(),
        markup = '';

      // Bail out if we don't have any data. prepareStoryItemsData
      // will take care of fetching more for us.
      if (!pageItems) {
        return false;
      }

      // Render each item's template.
      _.each(pageItems, function (item, index) {
        var largeIndex = _.indexOf(largePositions, index + 1),
          templateData = item.toJSON();

        // Add template helper functions.
        templateData = _.extend(templateData, {
          // Add the class property to the template data.
          // Grid view is the only view that can have the 'large' class.
          'blockClass': largePositions[largeIndex] &&
            this.state.type === 'grid' ? 'large' : 'small',
          // Show the correct title based on the block size.
          'contextualTitle': function () {
            return this.blockClass === 'large' ? this.title : this.shortTitle;
          },
          // Output the correct photo background.
          'hasPhotoBg': function () {
            var url;

            if (this.type === 'photo-bg') {
              url = this.blockClass === 'large' ? this.lgThumb : this.smThumb;
              return 'style="background-image: url(' + url + ');"';
            }
          },
          // Output the category classname.
          'hasCategoryBg': function () {
            if (this.type === 'category-bg') {
              return 'category-' + this.category;
            }
          }
        });

        // Render the template.
        markup += this[this.state.type + 'Template'](templateData);
      }, this);

      // Append the rendered markup.
      this['$' + this.state.type].append(markup);

      // Init the Masonry library for the grid.
      if (this.state.type === 'grid') {
        this.initMasonry();
      }

      return this;
    },

    /**
     * Public: Set up the data to render in the grid view.
     *
     * Returns the filtered data as an array. Will return false if
     * there isn't enough filtered data to display a whole page.
     */
    prepareStoryItemsData: function () {
      // Get the filtered and paginated data from the collection.
      var data = this.storyBlockCollection.getFilteredData({
        filter: this.state.filter,
        count: this.pageCount,
        page: this.state.page
      });

      // If there's not enough filtered data to load a whole page,
      // go get some more data and return false.
      if (data.length < this.pageCount) {
        this.loadStories({force: true});
        return false;
      }

      // Increase the page count.
      this.state.page = this.state.page + 1;

      return data;
    },

    /**
     * Public: Start up the Masonry library, or reload it if it already exists.
     *
     * Returns this.
     */
    initMasonry: function () {
      if (!this.masonryLayout) {
        // Load up the Masonry library.
        this.masonryLayout = new Masonry(this.$grid.get(0), {
          columnWidth: 140,
          gutterWidth: 20,
          isFitWidth: true
        });
      } else {
        this.masonryLayout.reload();
      }

      return this;
    },

    /**
     * Get a layout that we know will make a 'square' block in the grid view.
     * These values came from generating pairs using getUniqueArrayValues.
     * I've simply recorded the ones that worked, and put them here.
     *
     * Returns one of the avilable layouts at random.
     */
    getLayout: function () {
      var layouts = [
        [2, 3], [10, 7], [7, 3], [6, 10], [2, 7], [6, 1], [10, 8], [9, 6],
        [10, 6], [6, 2], [2, 8], [4, 5], [2, 4], [2, 6], [3, 1], [4, 7],
        [10, 7], [8, 3]
      ];

      return layouts[_.random(0, layouts.length - 1)];
    },

    /**
     * Public: Get an array of random, unique numbers.
     * With help from: http://stackoverflow.com/a/2380113
     * This function is super inefficient, so don't go
     * crazy with the `amount` value.
     *
     * amount - The length of the array to be returned. Defaults to 5.
     * min    - Bottom range of random numbers. Defaults to 10.
     * max    - Upper range of random numbers. Optional.
     *
     * Returns an array of unique numbers.
     */
    getUniqueArrayValues: function (amount, min, max) {
      var collection = [],
        i,
        unique,
        random;

      // Bail out if the amount of values requested is more than
      // the possible range of random values to be generated.
      if ((amount > min && max === undefined) || (amount > max - min)) {
        return false;
      }

      // Default value for amount of results.
      amount = amount || 5;
      min = min || 10;

      while (collection.length < amount) {
        random = _.random(min, max);
        unique = true;

        for (i = 0; i < collection.length; i++) {
          if (collection[i] === random) {
            unique = false;
            break;
          }
        }

        if (unique) {
          collection[collection.length] = random;
        }
      }

      return collection;
    }
  });
});