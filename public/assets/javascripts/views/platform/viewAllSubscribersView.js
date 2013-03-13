/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  View all subscribers view.
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

// Components
  'components/alphaSortView',

  'collections/Subscriptions',
  'models/Subscription',

// Templates
  'text!templates/large-item-list-profile.html',
  'text!templates/large-item-list-group.html'
], function ($, _, Backbone, HpBaseView, AlphaSort, SubscriptionCollection, SubscriptionModel, ProfileTemplate, GroupTemplate) {
    'use strict';

    return HpBaseView.extend({

        events: {
            'click .alpha-pagination a' : 'alphaPaginationClicked',
            'touchend .alpha-pagination a' : 'alphaPaginationClicked',
            'click .numeric-pagination a' : 'numericPaginationClicked',
            'touchend .numeric-pagination a' : 'numericPaginationClicked',
        },

        data: {},

        /**
        * Initialize.
        */
        initialize: function () {
            console.log('viewAllSubscriberView loaded');
            // Init child views.
            this.alphaSort = new AlphaSort();
            this.subscriptions = new SubscriptionCollection();
            this.subscriptions.on('reset', this.renderProfiles, this);
        },

        profileTemplate: _.template(ProfileTemplate),
        groupTemplate: _.template(GroupTemplate),

        /**
        * Render.
        *
        * Returns this.
        */
        render: function () {
            // Render child views.
            this.assign({
                '.alpha-pagination': this.alphaSort
            });

            this.profileId = $("#container-main>input[name$=hdnProfileId]").first().val();
            this.subscriptionType = $("#container-main>input[name$=hdnSubscriptionType]").first().val();
            this.pageNumber = $("#container-main>input[name$=hdnPageNumber]").first().val();
            this.pageLimit = $("#container-main>input[name$=hdnPageLimit]").first().val();
            this.index = $("#container-main>input[name$=hdnIndex]").first().val();

            this.$numericPagination = $('.numeric-pagination');

            this.subscriptions.parentView = this;

            this.$subscriberList = this.$el.find('ul.subscriptions');

            this.subscriptions.fetch({ method: "GetSubscriptionsPaged" });

            this.setAlphaPagination();

            return this;
        },
        renderProfiles: function () {
            this.$subscriberList.empty();
            if(this.subscriptions.models.length == 0){
                this.$subscriberList.append("<li class='no-profiles'><div>There are no profiles</div></li>");
                return false;
            }
            else{
                if (this.subscriptionType == "GroupSubscribers" || this.subscriptionType == "MyGroupSubscriptions") {
                    var that = this;
                    _.each(this.subscriptions.models, function (profile, index) {
                        that.$subscriberList.append(this.groupTemplate(profile.toJSON()));
                    }, this);
                }
                else {
                    var that = this;
                    _.each(this.subscriptions.models, function (profile, index) {
                        that.$subscriberList.append(this.profileTemplate(profile.toJSON()));
                    }, this);
                }
            }
            
            updatePagination(this.$numericPagination, this.pageNumber, this.pageCount,null);
        },
        setAlphaPagination: function () {
            var activeIndex = "";
            callWebMethod(PROFILE_SERVICE, "GetSubscriptionIndices", { profileId: this.profileId, subscriptionType: this.subscriptionType }, function (result) {
                var $alphaNav = this.alphaSort.$el.find('ul');
                var $indices = $alphaNav.children();
                var liveData = eval(result.d); //build a dictionary of letters
                var isFirst = true;

                var sum = 0;

                $.each($indices.children(), function (key, value) {
                    var htmlValue = $(this).first().html();

                    if (liveData[htmlValue] > 0) {
                        sum += Number(liveData[htmlValue]);
                    }
                });

                $.each($indices.children(), function (key, value) {
                    var htmlValue = $(this).first().html();

                    if (liveData[htmlValue] != null || htmlValue == "ALL") {
                        if (isFirst) {
                            $(this).parent().addClass("active");
                            activeIndex = $(this).first().html();
                            $("#container-main>input[name$=hdnIndex]").first().val(activeIndex);

                            isFirst = false;
                        }

                        if (htmlValue == "ALL") {
                            $(this).first().attr("data-totalcount", sum);
                        } else {
                            $(this).first().attr("data-totalcount", liveData[htmlValue]);
                        }
                    }
                    else {
                        $(this).parents('li').addClass('disabled');
                    }
                });

                this.resultCount = sum;
                this.pageCount = Math.ceil(this.resultCount / this.pageLimit);
                updatePagination(this.$numericPagination, 0, this.pageCount,null);

            }, this);

            


            return this;

        },
        alphaPaginationClicked: function (event){
            event.preventDefault();
            if($(event.target).parents('li').hasClass('disabled')){
                return false;
            }

            var newIndex = $(event.target).text();
            this.resultCount = $(event.target).attr("data-totalcount");
            $("#container-main>input[name$=hdnIndex]").first().val(newIndex);
            
            if(newIndex == "ALL"){
                newIndex = '';
            }

            this.index = newIndex;
            this.pageNumber = 0;

            this.subscriptions.fetch({ method: "GetSubscriptionsPaged" });

            this.pageCount = Math.ceil(this.resultCount / this.pageLimit);
            updatePagination(this.$numericPagination, 0, this.pageCount,null);

            return this;
        },
        numericPaginationClicked: function(event) {
            //if ($(event.target).parents('li').hasClass('disabled')) return;
            var action = $(event.target).text();

            var gotoPage = 0;
            
            switch (action) {
                case "<":
                case "Prev":
                   gotoPage = parseInt(this.pageNumber) - 1;
                   break;
                case ">":
                case "Next":
                    gotoPage = parseInt(this.pageNumber) + 1;
                    
                    break;
                default:
                    gotoPage = parseInt(action) - 1;
                    break;
            }

            if (gotoPage < 0) gotoPage = 0;

            this.pageNumber = gotoPage;

            this.subscriptions.fetch({ method: "GetSubscriptionsPaged" });

            

            return this;
        }
    });
});