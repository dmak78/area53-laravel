/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
  Comment Collection.

*/
define([
// Libs
  'backbone',
  'underscore',

  'models/Album'

], function (Backbone, _, AlbumModel) {
    'use strict';

    return Backbone.Collection.extend({

        model: AlbumModel,

        // Resource location.
        sync: function (method, model, options) {

            var params = _.extend({
                type: "POST",
                url: PHOTO_SERVICE + "/GetGroupAlbums",
                context: this,
                contentType: "application/json",
                data: JSON.stringify(options.data),
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
            parsedData = data.d.Albums;
            console.log(parsedData);
            return parsedData;
        },

        /**
        * Initialize.
        */
        initialize: function () {

        }

    });
});