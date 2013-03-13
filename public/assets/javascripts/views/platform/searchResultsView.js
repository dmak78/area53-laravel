/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Search results page view.
*/
define([
// Libs.
  'jquery',

// Base views.
  'baseviews/hpBaseView',

// Components
  'components/sortMenuView',
  'collections/SearchResults',
  'models/Profile',
  'models/Group',
  'models/Comment',
// Templates
  'text!templates/large-item-list-user.html',
  'text!templates/large-item-list-group-expanded.html',
  'text!templates/large-item-list-comment.html',
  'text!templates/large-item-list-user-with-expertise.html',
  'text!templates/large-item-list-user-with-tag.html'
], function ($, HpBaseView, SortMenu, SearchResultsCollection, ProfileModel,
                GroupModel, CommentModel, ProfileTemplate, GroupTemplate,
                CommentTemplate, ExpertiseTemplate, InterestsTemplate) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .back-link': 'updateNavList',
            'click .sidebar-navigation-list li:not(.active) a': 'updateNavList',
            'click .all-onehp:not(.active) a': 'updateFilter',
            'click .my-subscriptions:not(.active) a': 'updateFilter',
            'click .subscribe': 'toggleSubscribe',
            'click .tag': 'toggleEndorsement',
            'click .pagination li a': 'paginationClicked'
        },

        profileTemplate: _.template(ProfileTemplate),
        groupTemplate: _.template(GroupTemplate),
        commentTemplate: _.template(CommentTemplate),
        expertiseTemplate: _.template(ExpertiseTemplate),
        interestsTemplate: _.template(InterestsTemplate),

        currentSort: {
            'groups': 'best',
            'comments': 'best',
            'expertise': 'best'
        },

        currentFilter: {
            'groups': 'all',
            'comments': 'all',
            'expertise': 'all'
        },

        currentPageNumber: {
            'names': 0,
            'groups': 0,
            'comments': 0,
            'expertise': 0,
            'interests': 0
        },


        /**
        * Initialize.
        */
        initialize: function () {
            console.log("searchResultsView loaded");

            this.sortMenu = new SortMenu();
            this.sortMenu.on('updatedValue', this.updateSort, this);

            this.previewPageSize = '3';
            this.maxPageSize = '20';

            this.profileResults = new SearchResultsCollection({ model: ProfileModel });
            this.groupResults = new SearchResultsCollection({ model: GroupModel });
            this.commentResults = new SearchResultsCollection({ model: CommentModel });
            this.expertiseResults = new SearchResultsCollection({ model: ProfileModel });
            this.interestsResults = new SearchResultsCollection({ model: ProfileModel });

            this.profileResults.on('reset', this.renderPreview, this);
            this.groupResults.on('reset', this.renderPreview, this);
            this.commentResults.on('reset', this.renderPreview, this);
            this.expertiseResults.on('reset', this.renderPreview, this);
            this.interestsResults.on('reset', this.renderPreview, this);

            this.on('subscriptionsSet', function () { console.log(this.subscriptions); }, this);

        },

        /**
        * Render.
        */
        render: function () {
            // Render child views.
            this.assign({
                '.sort-menu': this.sortMenu
            });

            this.getSubscriptions();

            this.searchText = $('input[id$=searchText]').val();
            this.pageSize = $('input[id$=hdnPageSize]').val();

            this.$el.find('.searchText').html(this.searchText);


            this.profileResults.method = 'SearchNames';
            this.groupResults.method = 'SearchGroups';
            this.commentResults.method = 'SearchMessages';
            this.expertiseResults.method = 'SearchExpertise';
            this.interestsResults.method = 'SearchInterests';

            this.$profilePreview = this.$el.find('#people-section ul.search-results-list');
            this.$groupPreview = this.$el.find('#groups-section ul.search-results-list');
            this.$commentPreview = this.$el.find('#comments-section ul.search-results-list');
            this.$expertisePreview = this.$el.find('#expertise-section ul.search-results-list');
            this.$interestsPreview = this.$el.find('#interests-section ul.search-results-list');

            this.$profileResultsList = this.$el.find('#names-all ul.search-results-list');
            this.$groupResultsListAll = this.$el.find('#groups-all ul.search-results-list');
            this.$groupResultsListSub = this.$el.find('#groups-sub ul.search-results-list');
            this.$messageResultsListAll = this.$el.find('#comments-all ul.search-results-list');
            this.$messageResultsListSub = this.$el.find('#comments-sub ul.search-results-list');
            this.$expertiseResultsListAll = this.$el.find('#expertise-all ul.search-results-list');
            this.$expertiseResultsListSub = this.$el.find('#expertise-sub ul.search-results-list');
            this.$interestsResultsList = this.$el.find('#interests-all ul.search-results-list');

            this.$profileCount = this.$el.find('.SearchNamesTotal');
            this.$groupCount = this.$el.find('.SearchGroupsTotal');
            this.$commentCount = this.$el.find('.SearchMessagesTotal');
            this.$expertiseCount = this.$el.find('.SearchExpertiseTotal');
            this.$interestsCount = this.$el.find('.SearchInterestsTotal');

            this.profileResults.fetch({ searchText: this.searchText, sort: '', filter: '', pageNumber: '0', pageSize: '3', getTotalResultCount: true });
            this.groupResults.fetch({ searchText: this.searchText, sort: '', filter: '', pageNumber: '0', pageSize: '3', getTotalResultCount: true });
            this.commentResults.fetch({ searchText: this.searchText, sort: '', filter: '', pageNumber: '0', pageSize: '3', getTotalResultCount: true });
            this.expertiseResults.fetch({ searchText: this.searchText, sort: '', filter: '', pageNumber: '0', pageSize: '3', getTotalResultCount: true });
            this.interestsResults.fetch({ searchText: this.searchText, sort: '', filter: '', pageNumber: '0', pageSize: '3', getTotalResultCount: true });

        },

        /**
        * Update the navigation list to reflect the active pane.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        updateNavList: function (event) {
            var $target = $(event.target),
            $nav = this.$el.find('.sidebar-navigation-list'),
            id = event.target.hash.replace('#', '');

            event.preventDefault();

            $nav.find('a[href="#' + id + '"]').tab('show');

            this.targetType = id;
            console.log('targetType: ', this.targetType);

            if (this.targetType != 'all') {
                this.renderResults();
            }

            return this;
        },
        updateSort: function (value, type) {

            this.currentSort[type] = value;

            this.renderResults();
            return this;
        },
        updateFilter: function (event) {
            var $target = $(event.target),
            id = event.target.hash.replace('#', '');

            var divParts = id.split('-');
            var type = divParts[0];
            var newFilter = '';
            if (divParts.length > 1) newFilter = divParts[1];

            if (newFilter == 'all') {
                $('li.my-subscriptions').removeClass('active');
                $('div.my-subscriptions').removeClass('active');
                $('div.all-onehp').addClass('active');
                $('li.all-onehp').addClass('active');

            }
            else {
                $('li.all-onehp').removeClass('active');
                $('div.all-onehp').removeClass('active');
                $('div.my-subscriptions').addClass('active');
                $('li.my-subscriptions').addClass('active');
                $('div.my-subscriptions .search-results-list').text('sub');
            }

            this.currentFilter[type] = newFilter;
            console.log('filter type', type);
            this.renderResults();
            return this;
        },
        renderPreview: function (data) {
            switch (data.method) {
                case "SearchNames":
                    if (this.profileResults.models.length > 0) {
                        var that = this;
                        _.each(this.profileResults.models, function (model, index) {

                            that.$profilePreview.append(this.profileTemplate(model.toJSON()));

                        }, this);
                    }
                    else {
                        this.$profilePreview.append('<li>No Results</li>');
                    }
                    break;
                case "SearchGroups":
                    if (this.groupResults.models.length > 0) {
                        var that = this;

                        _.each(this.groupResults.models, function (model, index) {
                            console.log(model.attributes);
                            that.$groupPreview.append(this.groupTemplate(model.toJSON()));
                        }, this);
                    }
                    else {
                        this.$groupPreview.append('<li>No Results</li>');
                    }
                    break;
                case "SearchMessages":
                    if (this.commentResults.models.length > 0) {
                        var that = this;
                        _.each(this.commentResults.models, function (model, index) {
                            that.$commentPreview.append(this.commentTemplate(model.toJSON()));
                        }, this);
                    }
                    else {
                        this.$commentPreview.append('<li>No Results</li>');
                    }
                    break;
                case "SearchExpertise":
                    if (this.expertiseResults.models.length > 0) {
                        var that = this;
                        _.each(this.expertiseResults.models, function (model, index) {
                            console.log(model.attributes);
                            that.$expertisePreview.append(this.expertiseTemplate(model.toJSON()));
                        }, this);
                    }
                    else {
                        this.$expertisePreview.append('<li>No Results</li>');
                    }
                    break;
                case "SearchInterests":
                    if (this.interestsResults.models.length > 0) {
                        var that = this;
                        _.each(this.interestsResults.models, function (model, index) {
                            console.log(model.attributes);
                            that.$interestsPreview.append(this.interestsTemplate(model.toJSON()));
                        }, this);
                    }
                    else {
                        this.$interestsPreview.append('<li>No Results</li>');
                    }
                    break;
            }

            this.$profileCount.text(this.profileResults.totalSearchCount);
            this.$groupCount.text(this.groupResults.totalSearchCount);
            this.$commentCount.text(this.commentResults.totalSearchCount);
            this.$expertiseCount.text(this.expertiseResults.totalSearchCount);
            this.$interestsCount.text(this.interestsResults.totalSearchCount);
        },
        renderResults: function () {
            var pageCount = 1;
            switch (this.targetType) {
                case "names":
                    callWebMethod(SEARCH_SERVICE, "SearchNames", { searchText: this.searchText, sort: '', filter: '', pageNumber: this.currentPageNumber['names'], pageSize: this.maxPageSize, getTotalResultCount: false },
                        function (result) {
                            if (result.d.ResultList.length > 0) {
                                var that = this;
                                pageCount = Math.ceil(result.d.ResultList.length / this.maxPageSize);

                                that.$profileResultsList.empty();
                                _.each(result.d.ResultList, function (result, index) {
                                    that.$profileResultsList.append(that.profileTemplate(result));

                                }, this);
                            }
                            else {
                                pageCount = 1;
                                this.$profileResultsList.empty();
                                this.$profileResultsList.append('<li>No Results</li>');
                            }
                            console.log('pagenum', this.currentPageNumber['names']);
                            console.log('pagenum', pageCount);
                            console.log('pagenum', this.$el.find('.pagination-centered'));
                            updatePagination(this.$el.find('#names .pagination-centered'), this.currentPageNumber['names'], pageCount, null);
                        }, this
                    );

                    break;
                case "groups":
                    callWebMethod(SEARCH_SERVICE, "SearchGroups", { searchText: this.searchText, sort: this.currentSort['groups'], filter: this.currentFilter['groups'], pageNumber: this.currentPageNumber['groups'], pageSize: this.maxPageSize, getTotalResultCount: false },
                        function (result) {
                            if (result.d.ResultList.length > 0) {
                                var that = this;
                                pageCount = Math.ceil(result.d.ResultList.length / this.maxPageSize);
                                that.$groupResultsListAll.empty();
                                that.$groupResultsListSub.empty();
                                _.each(result.d.ResultList, function (result, index) {
                                    if (that.currentFilter['groups'] == 'all') {
                                        that.$groupResultsListAll.append(that.groupTemplate(result));
                                    }
                                    else {
                                        that.$groupResultsListSub.append(that.groupTemplate(result));
                                    }

                                }, this);
                            }
                            else {
                                pageCount = 1;
                                if (this.currentFilter['groups'] == 'all') {
                                    this.$groupResultsListAll.empty();
                                    this.$groupResultsListAll.append('<li>No Results</li>');
                                }
                                else {
                                    this.$groupResultsListSub.empty();
                                    this.$groupResultsListSub.append('<li>No Results</li>');
                                }
                            }
                            updatePagination(this.$el.find('#groups .pagination-centered'), this.currentPageNumber['groups'], pageCount, this.paginationClicked);
                        }, this
                    );
                    break;
                case "comments":
                    callWebMethod(SEARCH_SERVICE, "SearchMessages", { searchText: this.searchText, sort: this.currentSort['comments'], filter: this.currentFilter['comments'], pageNumber: this.currentPageNumber['comments'], pageSize: this.maxPageSize, getTotalResultCount: false },
                        function (result) {

                            if (result.d.ResultList.length > 0) {
                                var that = this;
                                pageCount = Math.ceil(result.d.ResultList.length / this.maxPageSize);
                                that.$commentResultsListAll.empty();
                                that.$commentResultsListSub.empty();
                                _.each(result.d.ResultList, function (result, index) {
                                    if (that.currentFilter['comments'] == 'all') {
                                        that.$commentResultsListAll.append(that.commentTemplate(result));
                                    }
                                    else {
                                        that.$commentResultsListSub.append(that.commentTemplate(result));
                                    }

                                }, this);
                            }
                            else {
                                pageCount = 1;
                                if (this.currentFilter['comments'] == 'all') {
                                    this.$commentResultsListAll.empty();
                                    this.$commentResultsListAll.append('<li>No Results</li>');
                                }
                                else {
                                    this.$commentResultsListSub.empty();
                                    this.$commentResultsListSub.append('<li>No Results</li>');
                                }
                            }
                            updatePagination(this.$el.find('#comments .pagination-centered'), this.currentPageNumber['comments'], pageCount, this.paginationClicked);
                        }, this
                    );
                    break;
                case "expertise":
                    callWebMethod(SEARCH_SERVICE, "SearchExpertise", { searchText: this.searchText, sort: this.currentSort['expertise'], filter: this.currentFilter['expertise'], pageNumber: this.currentPageNumber['expertise'], pageSize: this.maxPageSize, getTotalResultCount: false },
                       function (result) {
                           if (result.d.ResultList.length > 0) {
                               var that = this;
                               pageCount = Math.ceil(result.d.ResultList.length / this.maxPageSize);
                               that.$expertiseResultsListAll.empty();
                               that.$expertiseResultsListSub.empty();
                               _.each(result.d.ResultList, function (result, index) {
                                   if (that.currentFilter['expertise'] == 'all') {
                                       that.$expertiseResultsListAll.append(that.expertiseTemplate(result));
                                   }
                                   else {
                                       that.$expertiseResultsListSub.append(that.expertiseTemplate(result));
                                   }
                               }, this);
                           }
                           else {
                               pageCount = 1;
                               if (this.currentFilter['expertise'] == 'all') {
                                   this.$expertiseResultsListAll.empty();
                                   this.$expertiseResultsListAll.append('<li>No Results</li>');
                               }
                               else {
                                   this.$expertiseResultsListSub.empty();
                                   this.$expertiseResultsListSub.append('<li>No Results</li>');
                               }

                           }
                           updatePagination(this.$el.find('#expertise .pagination-centered'), this.currentPageNumber['expertise'], pageCount, this.paginationClicked);
                       }, this
                    );
                    break;
                case "interests":
                    callWebMethod(SEARCH_SERVICE, "SearchInterests", { searchText: this.searchText, sort: '', filter: '', pageNumber: this.currentPageNumber['interests'], pageSize: this.maxPageSize, getTotalResultCount: true },
                        function (result) {
                            if (result.d.ResultList.length > 0) {
                                var that = this;
                                pageCount = Math.ceil(result.d.ResultList.length / this.maxPageSize);
                                that.$interestsResultsList.empty();
                                _.each(result.d.ResultList, function (result, index) {
                                    that.$interestsResultsList.append(that.interestsTemplate(result));
                                }, this);
                            }
                            else {
                                pageCount = 1;
                                this.$interestsResultsList.empty();
                                this.$interestsResultsList.append('<li>No Results</li>');
                            }
                            updatePagination(this.$el.find('#interests .pagination-centered'), this.currentPageNumber['interests'], pageCount, this.paginationClicked);
                        }, this
                    );
                    break;


            }

            return this;
        },
        fetchResults: function (id) {
            console.log(id);
        },
        toggleSubscribe: function (event) {
            event.preventDefault();

            var subscriberId = $(event.target).data('id');
            var action = $(event.target).data('action');

            switch (action) {
                case "subscribe":
                    callWebMethod(PROFILE_SERVICE, 'Subscribe', { subscribeToId: subscriberId }, function (result) {
                        $(event.target).addClass('subscribed').text('Subscribed').data('action', 'subscribed');
                    }, this);
                    break;
                case "subscribed":
                    callWebMethod(PROFILE_SERVICE, 'Unsubscribe', { subscribeToId: subscriberId }, function (result) {
                        $(event.target).removeClass('subscribed').text('Subscribe').data('action', 'subscribe');
                    }, this);
                    break;
                case "subscribeGroup":
                    callWebMethod(WALL_SERVICE, 'SubscribeToGroup', { groupRecordId: subscriberId }, function (result) {
                        console.log(result);
                        $(event.target).addClass('subscribed').text('Subscribed').data('action', 'subscribedGroup');
                    }, this);
                    break;
                case "subscribedGroup":
                    callWebMethod(WALL_SERVICE, 'UnsubscribeFromGroup', { groupRecordId: subscriberId }, function (result) {
                        console.log(result);
                        $(event.target).removeClass('subscribed').text('Subscribe').data('action', 'subscribeGroup');
                    }, this);
                    break;

            }
            return this;
        },
        toggleEndorsement: function (event) {
            event.preventDefault();
            this.$target = $(event.target);
            var profileId = this.$target.data('ownerid');
            var responsibilityName = this.$target.data('responsibilityname');
            var $parent = this.$target.parents('.expertise');

            if ($parent.hasClass("recommended")) {
                callWebMethod(PROFILE_SERVICE, "RemoveEndorsement", { 'profileId': profileId, 'skillName': responsibilityName }, function (result) {
                    console.log(result);
                    this.$target.text(result.d.Value);
                    $parent.removeClass("recommended");
                }, this);
            }
            else {
                callWebMethod(PROFILE_SERVICE, "AddEndorsement", { 'profileId': profileId, 'skillName': responsibilityName }, function (result) {
                    console.log(result);
                    this.$target.text(result.d.Value);
                    $parent.addClass("recommended");
                }, this);
            }

            return this;
        },
        paginationClicked: function (event) {
            var pageNumber = $(event.target).text;
            if ($(event.target).parents('li').hasClass('disabled') || $(event.target).parents('li').hasClass('active')) {
                return false;
            }
            switch (pageNumber) {
                case "<":
                    this.currentPageNumber[this.targetType] = this.currentPageNumber[this.targetType] - 1;

                    break;
                case ">":
                    this.currentPageNumber[this.targetType] = this.currentPageNumber[this.targetType] + 1;
                    break;
                default:
                    this.currentPageNumber[this.targetType] = parseInt(pageNumber) - 1;
                    break;
            }

            this.renderResults();

        }
    });
});