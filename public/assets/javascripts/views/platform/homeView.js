/*jslint browser: true, indent: 2, nomen: true */
/*global require, define */

/*
  Homepage view.
*/
define([
// Libs
  'jquery',
  'underscore',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/sliderView',
  'components/socialNetworkView',
  'platform/welcomeModalView',
  'text!templates/layouts/home.html',
  'text!templates/homepage-banner.html'
], function ($, _,Backbone, HpBaseView, SliderView, SocialNetworkView, WelcomeModalView, HomeTemplate, HomepageBannerTemplate) {
    'use strict';

    return HpBaseView.extend({

        template: _.template(HomeTemplate),
        /**
        * Initialize.
        */
        initialize: function () {
            this.homepageSliderView = new SliderView({template : HomepageBannerTemplate});
            this.socialNetworkView = new SocialNetworkView();
           // this.welcomeModalView = new WelcomeModalView();
          //  this.createGroupModal = new WelcomeModalView();
        },

        /**
        * Render.
        */
        render: function () {
            this.$el.empty().append(this.template());
            this.assign({
                '.page-banner': this.homepageSliderView,
                '.platform-social-network': this.socialNetworkView,
                // '#welcome-modal' : this.welcomeModalView,
                // '#newgroup-modal' : this.createGroupModal
            });

            

            this.tooltip({
                '.communicator-presence': { placement: 'bottom', title: 'IM NAME' }
            });
           
            return this;
        }
    });
});