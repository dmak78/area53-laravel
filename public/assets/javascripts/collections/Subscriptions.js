/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
Comment Collection.

*/
define([
// Libs
  'backbone',
  'underscore',

  'models/Subscription'

], function (Backbone, _, SubscriptionModel) {
    'use strict';

    return Backbone.Collection.extend({

        model: SubscriptionModel,

        // Resource location.
        sync: function (method, model, options) {
            console.log(this.parentView.pageLimit);
            var params = _.extend({
                type: "POST",
                url: PROFILE_SERVICE + "/" + options.method,
                context: this,
                contentType: "application/json",
                data: JSON.stringify({ profileId: this.parentView.profileId,
                    subscriptionType: this.parentView.subscriptionType,
                    pageNumber: this.parentView.pageNumber,
                    limit: this.parentView.pageLimit,
                    index: this.parentView.index
                }),
                headers: { "X-RequestDigest": $("#__REQUESTDIGEST").val() },
                dataType: "json",
                async: false,
                timeout: 600000,
                error: function (x, t, m) {

                }
            }, options);



            return $.ajax(params); ;
        },

        parse: function (data) {
            var parsedData = {};
            console.log(data.d.Profiles);
            parsedData = data.d.Profiles;
            return parsedData;
        },

        /**
        * Initialize.
        */
        initialize: function () {

        }

    });
});