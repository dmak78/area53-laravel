/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  List Albums page view.
*/
define([
// Libs.
  'jquery',
  'underscore',

// Base views.
  'baseviews/hpBaseView'
], function ($,_, HpBaseView) {
    'use strict';

    return HpBaseView.extend({

        initialize: function () {
            console.log("listGifsView loaded");
            
        },

        render: function () {
            this.$gridList = this.$el.find('.grid-items');
            this.getGifs();
            return this;
        },
        getGifs: function(){
          $.ajax({url: 'http://area51.bigspaceship.com/blog/api/medialibrary/get_media/?posts_per_page=100', success: function(result){this.renderGifs(result.media);}, context:this});
          return this;
        },
        renderGifs: function (media){
          var that = this;
          _.each(media, function(image){
            that.$gridList.append('<li style="width:100px;height:100px;overflow:hidden;"><a title="" href="'+image+'"><img class="album-cover" src="'+image+'" style="display:block;margin:0 auto;max-width:100%;max-height:100%;"></a></li>');
          });
          return this;
        }

    });
});