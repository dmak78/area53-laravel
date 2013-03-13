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
  'components/sliderView',
  'components/socialNetworkView',
  'platform/welcomeModalView'
], function ($, Backbone, HpBaseView, SliderView, SocialNetworkView, WelcomeModalView) {
    'use strict';

    return HpBaseView.extend({
        /**
        * Initialize.
        */
        initialize: function () {
            console.log("homeView loaded");
            this.homepageSliderView = new SliderView();
            this.socialNetworkView = new SocialNetworkView();
            this.welcomeModalView = new WelcomeModalView();
            this.createGroupModal = new WelcomeModalView();
        },

        /**
        * Render.
        */
        render: function () {
            this.assign({
                '.homepage-slider': this.homepageSliderView,
                '.platform-social-network': this.socialNetworkView,
                '#welcome-modal' : this.welcomeModalView,
                '#newgroup-modal' : this.createGroupModal
            });

            

            this.tooltip({
                '.communicator-presence': { placement: 'bottom', title: 'IM NAME' }
            });
           
            return this;
        }
    });
});