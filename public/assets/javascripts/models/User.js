/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
Post Model

*/
define([
// Libs
   'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
    'use strict';

    return Backbone.Model.extend({

        sync: function (method, model, options) {
            var params = _.extend({
                type: "GET",
                url: 'http://area51.bigspaceship.com/blog/api/userinfo/get_personal_info/',
                context: this,
                data: {
                    'user_id' : this.profileId
                },
                contentType: "application/json",
                dataType: "json",  
                async: false,
                timeout: 600000,
                error: function (x, t, m) {
                }
            }, options);

            return $.ajax(params);
        },

        parse: function (data) {
            var newData = data.users[0];

            switch(newData.discipline){
                case 'tech':
                    newData.discipline = "Technologist"
                    break;
                case 'admin':
                    newData.discipline = "Administrator"
                    break;
                case 'design':
                    newData.discipline = "Designer"
                    break;
                case 'strategy':
                    newData.discipline = "Strategist"
                    break;
                case 'production':
                    newData.discipline = "Producer"
                    break;
                case 'newbiz':
                    newData.discipline = "New Business"
                    break;
                case 'exec':
                    newData.discipline = "Executive"
                    break;
            }
            return newData;
        },
        toggleLiked: function () {
           
        },
        toggleFlagged: function () {
          
        }
    });
});
