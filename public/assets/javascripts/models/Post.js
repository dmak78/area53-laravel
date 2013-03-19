/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
Post Model

*/
define([
// Libs
   'jquery',
  'underscore',
  'backbone',
  'collections/Comments'
], function ($, _, Backbone, CommentsCollection) {
    'use strict';

    return Backbone.Model.extend({
        initialize: function (){
          this.comments = new CommentsCollection([], {post: this});
          this.on('sync', this.getComments, this);
        },
        addComment: function (body){
          this.comments.create({ body : body}, {wait :true});
        },
        parse: function (data) {
          if(typeof(data.created_at) == 'object'){
            data.created_at = data.created_at.date;
          }
          return data;
        },
        getComments: function (){
          this.comments.fetch();
        }
    });
});
