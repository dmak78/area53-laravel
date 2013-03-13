/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Edit profile page view.
*/
define([
// Libs.
  'jquery',

// Base views.
  'baseviews/hpBaseView'
], function ($, HpBaseView) {
    'use strict';

    return HpBaseView.extend({

        events: {
            'click #change-timezone': 'showTimeZoneSelect',
            'touchend #change-timezone': 'showTimeZoneSelect'
        },

        initialize: function () {
            console.log('editProfileView loaded');
            
        },

        render: function () {
            // Setup tags.
            this.setupTagit('input[id$=txtExpertise]');
            this.setupTagit('input[id$=txtInterests]');
            this.setupTagit('input[id$=txtPastProjects]');
            this.setupTagit('input[id$=txtSchools]');

            this.$timeZoneSelect = this.$el.find('select[id$=ddlTimeZone]');
            this.$timeZoneSelect.hide();


            return this;
        },
        showTimeZoneSelect: function (event) {
            event.preventDefault();
            var that = this;
            $(event.target).fadeOut('fast', function () {
                that.$timeZoneSelect.fadeIn('fast');
                that.$el.find('label[for=timezone]').text('Select Time Zone');
            });

            return this;
        }
    });
});