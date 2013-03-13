/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Homepage view.
*/
define([
// Libs
  'jquery',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/socialNetworkView',
  'models/Group'
], function ($, Backbone, HpBaseView, SocialNetworkView, GroupModel) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .show-about-page': 'showAboutPage',
            'touchstart .show-about-page': 'showAboutPage',
            'click .subscribe': 'subscribe',
            'click .subscribed': 'unSubscribe'
        },

        /**
        * Initialize.
        */
        initialize: function () {
            this.socialNetworkView = new SocialNetworkView();
            this.groupModel = new GroupModel();
        },

        /**
        * Render.
        */
        render: function () {
            this.assign({
                '.platform-social-network': this.socialNetworkView
            });
        },

        /**
        * Show the about page.
        */
        showAboutPage: function (event) {
            event.preventDefault();
            this.socialNetworkView.openAboutTray();
        },
        /**
        * Toggle the subscribe button.
        */
        subscribe: function (event) {
            event.preventDefault();

            $(event.target).addClass('subscribed').removeClass('subscribe').data('action', 'subscribed').text('Subscribed');
            
            return this;
        },
        unSubscribe: function (event) {
            event.preventDefault();

            $(event.target).removeClass('subscribed').addClass('subscribe').data('action', 'subscribe').text('Subscribe');

            return this;
        }
    });
});