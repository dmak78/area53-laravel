/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Edit Group Subscribers page view.
*/
define([
// Libs.
  'jquery',

// Base views.
  'baseviews/hpBaseView'
], function ($, HpBaseView) {
    'use strict';

    return HpBaseView.extend({

        initialize: function () {
            console.log('editGroupSubscribersView loaded');
        },

        render: function () {
            this.groupId = $('input[id$=hfGroupID]').val();
//            callWebMethod(PROFILE_SERVICE, "GetMyPrivateGroupSubscriptions", { 'groupId': this.groupId }, function (result) {
//                subscriptions = subscriptions.concat(result.d.Profiles);
//                $.event.trigger('SubscriptionsLoaded');
            //            }, this); 

            return this;
        }
    });
});