/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
  Photo Comment Collection.

*/
define([
// Libs
  'backbone',
  'underscore',

  'models/PhotoComment'

], function (Backbone, _, CommentModel) {
    'use strict';

    return Backbone.Collection.extend({

        model: CommentModel,

        // Resource location.
        sync: function (method, model, options) {

            var wfMethod = "";

            switch (method) {
                case "read":
                    wfMethod = "LoadMorePhotoComments";
                    break; 
            }

            var params = _.extend({
                type: "POST",
                url: WALL_SERVICE + "/" + wfMethod,
                context: this,
                contentType: "application/json",
                data: JSON.stringify(options.jsonData),
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
            parsedData = data.d.comments;
            console.log(parsedData);
            return parsedData;
        }

    });
});