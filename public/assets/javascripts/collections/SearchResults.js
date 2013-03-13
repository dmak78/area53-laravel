/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
  Search Results Collection.

*/
define([
// Libs
  'backbone',
  'underscore',

  'models/SearchResult'

], function (Backbone, _, SearchResultModel) {
    'use strict';

    return Backbone.Collection.extend({

        totalSearchCount: 0,

        method: '',

        sync: function (method, model, options) {

            var searchMethod = this.method;

            var data = {
                searchText: options.searchText,
                sort: options.sort,
                filter: options.filter,
                pageNumber: options.pageNumber,
                pageSize: options.pageSize,
                getTotalResultCount: true
            };

            var params = _.extend({
                type: "POST",
                url: SEARCH_SERVICE + "/" + searchMethod,
                contentType: "application/json",
                data: JSON.stringify(data),
                headers: { "X-RequestDigest": $("#__REQUESTDIGEST").val() },
                dataType: "json",
                async: false,
                timeout: 600000,
                error: function (x, t, m) {
                    console.log(x, t, m);
                }
            }, options);

            return $.ajax(params); ;
        },

        parse: function (data) {
            this.totalSearchCount = data.d.TotalSearchCount;

            return data.d.ResultList;
        },

        /**
        * Initialize.
        */
        initialize: function () {

        }

    });
});