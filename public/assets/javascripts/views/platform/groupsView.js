/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Groups page view.
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',
  'modernizr',

// Base views.
  'baseviews/hpBaseView',

// Components
  'components/sortMenuView',
  'components/alphaSortView',
  'text!templates/large-item-list-groups.html',
  'text!templates/large-item-list-profile.html'

], function ($, _, Backbone, Modernizr, HpBaseView, SortMenu, AlphaSort, GroupTemplate, ModeratorTemplate) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .sort-newest': 'changeSort',
            'touchend .sort-newest': 'changeSort',

            'click .sort-subscribers': 'changeSort',
            'touchend .sort-subscribers': 'changeSort',

            'click .sort-alpha': 'changeSort',
            'touchend .sort-alpha': 'changeSort',

            'click .alpha-pagination a': 'alphaPaginationClick',
            'touchend .alpha-pagination a': 'alphaPaginationClick',

            'click .numeric-pagination a': 'paginationOnClick',
            'touchend .numeric-pagination a': 'paginationOnClick',

            'keypress input[name=search]': 'searchGroups',

            'click input[name=submit]': 'submitSearch',

            'click .nav-tabs a': 'newSort',
            'touchend .nav-tabs a': 'newSort'
        },

        groupTemplate: _.template(GroupTemplate),
        moderatorTemplate: _.template(ModeratorTemplate),

        GroupOrderingType: {
            'ALPHABETICAL': 1,
            'NEWEST': 2,
            'MOST_SUBSCIRBERS': 3
        },

        GroupMethods: {
            'MY_GROUPS': "GetMyGroups",
            'MODERATED_GROUPS': "GetModeratedGroups",
            'ALL_GROUPS': "GetAllGroups"
        },


        /**
        * Initialize.
        */
        initialize: function () {
            console.log('groupsView loaded');
            // Init child views.
            this.sortMenu = new SortMenu();

            this.sort = this.GroupOrderingType.ALPHABETICAL;
            this.pageNumber = 0;
            this.pageCount = 1;
            this.pageSize = 10;
            this.activeIndex = "";
            this.activeMethod = this.GroupMethods.MY_GROUPS;

            // Turn on tooltips.
            this.tooltip({
                '.subscribe': { placement: 'left', title: 'Receive updates in your newsfeed' }
            });
        },

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            // Render child views.
            this.assign({
                '.sort-menu': this.sortMenu
            });

            this.$myGroups = this.$el.find(".large-item-list");
            this.$moderatedGroups = this.$el.find(".large-item-list");
            this.$allGroups = this.$el.find(".large-item-list");

            this.pageSize = parseInt($("input[name$=hdnPageSize]").val());

            // Render alpha sorts for all the pagination views.
            _.each(this.$el.find('.alpha-pagination'), function (el) {
                var sort = new AlphaSort({ el: el });
                sort.render();
            }, this);

            // load initial groups
            if (window.location.hash) {
                var selectedTab = window.location.hash.toLowerCase();
                $('.nav-tabs a[href="' + selectedTab + '"]').tab('show');
                $('.nav-tabs a[href="' + selectedTab + '"]').click();
            }
            else {
                this.loadGroups();
            }

            return this;
        },

        /**
        * Change the sorting option. Show the alpha sort when 
        * choosing Alphabetical, hide it and simulate a sort or anything else.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        changeSort: function (event) {
            event.preventDefault();
            var $target = $(event.target),
            fn = $target.hasClass('sort-alpha') ? 'slideDown' : 'slideUp',
            $alpha = $target.closest('.tab-pane').find('.alpha-pagination');

            $alpha[fn].call($alpha);

            this.sort = $target.data("sort");
            this.activeIndex = "";
            this.pageNumber = 0;
            this.loadGroups();

            return this;
        },
        searchGroups: function (event) {
            var code = event.keyCode || event.which;
            if (code == 13)
                this.submitSearch(event);
            return this;
        },
        submitSearch: function (event) {
            var searchTerm = $("input[name=search]").val();
            if (searchTerm != "") {
                location.href = "/_layouts/OneHP/SearchResults.aspx?search=" + escape(searchTerm) + "#groups";
            }
            return this;
        },
        newSort: function (event) {
            var targetSort = $(event.target).attr('href');
            switch (targetSort) {
                case '#my-groups':
                    this.activeMethod = this.GroupMethods.MY_GROUPS;
                    break;
                case '#moderate':
                    this.activeMethod = this.GroupMethods.MODERATED_GROUPS;
                    break;
                case '#all-groups':
                    this.activeMethod = this.GroupMethods.ALL_GROUPS;
                    break;

            }
            this.activeIndex = "";
            this.pageNumber = 0;
            this.loadGroups();

            return this;
        },
        loadGroups: function () {
            callWebMethod(GROUP_SERVICE, this.activeMethod, { 'orderby': this.sort, 'pageNumber': this.pageNumber, 'index': this.activeIndex }, function (data) {
                this.$allGroups.empty();
                console.log('groups: ', data.d.Groups);
                for (var i = 0; i < data.d.Groups.length; i++) {
                    this.$allGroups.append(this.groupTemplate(data.d.Groups[i]));
                }

                if (data.d.GroupCount != null)
                    this.pageCount = Math.ceil(data.d.GroupCount / this.pageSize);

                updatePagination($('div.numeric-pagination'), this.pageNumber, this.pageCount, null);

                if (data.d.Indices != null)
                    this.updateAlphaIndices(data.d.Indices);
            }, this);
            return this;
        },
        updateAlphaIndices: function (activeIndices) {
            var $alphaIndexList = this.$el.find(".alpha-pagination .nav");

            //Setup alpha pagination
            if ($alphaIndexList.length > 0) {
                $alphaIndexList.children(".active").removeClass("active");

                var $indices = $alphaIndexList.children();

                // reset all indices
                $indices.removeClass("disabled");
                //var liveData = eval(result.d); //build a dictionary of letters
                var isFirst = true;

                var sum = 0;
                $indices.each(function () {
                    var htmlValue = $(this).first().text();
                    if (activeIndices[htmlValue] != null) {
                        sum += Number(activeIndices[htmlValue]);
                    }
                });

                $.each($indices.children(), function (key, value) {
                    //grab the letter from the link
                    var htmlValue = $(this).first().html();

                    //if (result.d.indexOf(htmlValue) > -1) {
                    if (activeIndices[htmlValue] != null || htmlValue == "ALL") {
                        if (isFirst) {
                            $(this).parent().addClass("active");
                            this.activeIndex = htmlValue;

                            isFirst = false;
                        }

                        if (htmlValue == "ALL") {
                            this.activeIndex = "";
                        }
                    } else {
                        $(this).parent().addClass("disabled");
                    }
                });
            }
            return this;
        },
        paginationOnClick: function (event) {
            event.preventDefault();
            var $target = $(event.target);
            if ($target.parent().hasClass('disabled') || $target.parent().hasClass('active')) return false;

            var pageAction = $target.html();

            if (this.pageNumber < 0) this.pageNumber = 0;

            if (typeof pageAction === "undefined") { ; /* keep current page number */ }
            else if (pageAction == '>') this.pageNumber++;
            else if (pageAction == '<' && this.pageNumber > 0) this.pageNumber--;
            else {
                this.pageNumber = parseInt(pageAction);
                if (!this.pageNumber || isNaN(this.pageNumber)) this.pageNumber = 0;
                else this.pageNumber--; //'pageAction' page number is 1-based; pageNumber is 0-based
            }

            this.loadGroups();
            $('html, body').animate({
                scrollTop: $('.platform-content-secondary').offset().top
            }, 500);
            return this;
        },
        alphaPaginationClick: function (event) {
            event.preventDefault();
            var $target = $(event.target);
            // make sure it's not disabled
            if ($target.parent().hasClass("disabled"))
                return;

            this.activeIndex = $target.html();
            this.pageNumber = 0;

            if (this.activeIndex == "ALL")
                this.activeIndex = "";

            this.loadGroups();
            return this;
        }
    });
});