/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
Story block collection.

See ./models/storyBlockModel.js
*/
define([
// Libs
    'jquery',
  'underscore',
  'backbone',

  'models/Post'
], function ($, _, Backbone, PostModel) {
    'use strict';

    return Backbone.Collection.extend({

        model: PostModel,

        url: '/api/v1/posts',

        parse: function (data) {
            console.log(data);
            return data;
        },
        update: function (){
            this.fetch({add:true});
        }
    });
});