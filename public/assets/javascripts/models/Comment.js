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

        parse: function (data) {
            if(typeof(data.created_at) == 'object'){
                data.created_at = data.created_at.date;
            }
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