/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Profile view.
*/
define([
// Libs
  'jquery',
  'underscore',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/socialNetworkView',
  'components/sliderView',
  'models/Profile',
  'components/tweetsView',
  'collections/Tweets',
  'text!templates/layouts/profile.html'
], function ($, _, HpBaseView, SocialNetworkView, SliderView, ProfileModel, TweetsView, Tweets, ProfileTemplate) {
    'use strict';

    return HpBaseView.extend({

        template: _.template(ProfileTemplate),
        events: {
            'click .show-about-page': 'showAboutPage',
            'click .subscribed': 'unSubscribe',
            'click .subscribe': 'subscribe'
        },

        state: {
            sliderRendered: false
        },

        /**
        * Initialize.
        */
        initialize: function () {
            console.log('profile view loaded');
            // Child views.
            this.socialNetworkView = new SocialNetworkView();
            this.profileSliderView = new SliderView();

            this.tweets = new Tweets([], { query : 'kevin'});
            this.twitterFeed = new TweetsView({ collection: this.tweets});
            
            this.profileModel = new ProfileModel();

            this.socialNetworkView.on('teardown', this.resetViews, this);

            // Turn on tooltips.
            this.tooltip({
                '.subscribe': { placement: 'left', title: 'Receive updates in your newsfeed' },
                '.delete': { placement: 'right', title: 'Delete this comment' }
            });
        },

        /**
        * Render.
        */
        render: function () {
           this.$el.empty().append(this.template());

            this.assign({
                '.platform-social-network': this.socialNetworkView,
                '#newsfeed-twitter': this.twitterFeed
            });

            // Responsive callbacks.
            window.area53.notifier.setCallbacks({
                phone: _.bind(function () {
                    this.renderProfileSlider();
                }, this)
            });

            this.tweets.liveUpdate();

            return this;
        },

        renderProfile: function () {
            return this;
        },

        /**
        * Show the about page.
        */
        showAboutPage: function (event) {
            event.preventDefault();
            this.socialNetworkView.openAboutTray();
        },

        /**
        * Render the profile slider.
        */
        renderProfileSlider: function () {
            if (this.sliderRendered) {
                return this;
            }
            this.assign('.profile-slider', this.profileSliderView);
            this.sliderRendered = true;
        },

        /**
        * Toggle the subscribe button.
        */
        subscribe: function (event) {
            event.preventDefault();

            $(event.target).removeClass('subscribe').addClass('subscribed').data('action', 'subscribed').text('Subscribed');

            return this;
        },
        unSubscribe: function (event) {
            event.preventDefault();
            
            $(event.target).removeClass('subscribed').addClass('subscribe').data('action', 'subscribe').text('Subscribe');
           
            return this;
        },
        resetViews: function () {
            this.socialNetworkView.render();
            return this;
        }
    });
});