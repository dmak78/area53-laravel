/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define */

/*
Comment Model

*/
define([
// Libs
   'jquery',
  'underscore',
  'backbone'
], function ($, _, Backbone) {
    'use strict';

    return Backbone.Model.extend({

        idAttribute: 'Id',

        sync: function (method, model, options) {
            var wfMethod = "";
            var jsonData = {};

            switch (method) {
                case 'create':
                    wfMethod = 'Comment';
                    jsonData = {
                        'postId': this.get('parentPostId'),
                        'message': encodeURIComponent(this.get('originalMessage'))
                    };
                    break;

                case 'delete':
                    wfMethod = 'DeleteComment';
                    jsonData = {
                        'commentId': this.id
                    };
                    break;

                case 'update':
                    wfMethod = options.updateMethod;
                    jsonData = {
                        'commentId': this.id
                    };
                    break;
            }
            console.log(jsonData);
            var params = _.extend({
                type: "POST",
                url: WALL_SERVICE + "/" + wfMethod,
                context: this,
                contentType: "application/json",
                headers: { "X-RequestDigest": $("#__REQUESTDIGEST").val() },
                dataType: "json",
                data: JSON.stringify(jsonData),
                async: false,
                timeout: 600000,
                error: function (x, t, m) {

                }
            }, options);

            return $.ajax(params);
        },

        parse: function (result) {
            var data = {};

            if (result.d) {
                data = result.d;
            }
            else {
                data = result;
            }

            if (data.OwnerSIP == "" || !data.OwnerSIP) {
                data.fromSIP = false;
            }
            else {
                data.fromSIP = true;
            }

            var MAXCOMMENTSNIPLENGTH = 300;
            if (data.Message) {
                if (data.Message.length > MAXCOMMENTSNIPLENGTH) {
                    data.ShortMessage = data.Message.substr(0, MAXCOMMENTSNIPLENGTH) + '...';
                }
            }

            var dateabbr = data.Published || "";
            dateabbr = new Date(parseInt(dateabbr.replace("/Date(", "").replace(")/", ""), 10)).toString();
            data.Published = dateabbr;

            return data;
        },
        toggleFlag: function () {
            this.set({ IsFlagged: !this.get('IsFlagged') });
            if (this.get('IsFlagged') == false) {
                this.save({ IsFlagged: this.get('IsFlagged') }, { updateMethod: "UnflagComment" });
            }
            else {
                this.save({ IsFlagged: this.get('IsFlagged') }, { updateMethod: "FlagComment" });
            }
        }


    });
});