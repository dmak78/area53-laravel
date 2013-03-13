/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  View single Post page.
*/
define([
// Libs
  'jquery',
  'backbone',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/activityFeedView'
], function ($, _, HpBaseView, ActivityFeedView) {
    'use strict';

    return HpBaseView.extend({
        /**
        * Initialize.
        */
        initialize: function () {
            console.log('viewSinglePostView loaded');

            this.activityFeedSingle = new ActivityFeedView();
        },

        /**
        * Render.
        */
        render: function () {
            this.assign({
                '.activity-feed': this.activityFeedSingle
            });
            return this;
        }
    });
});