/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global define, LiveValidation, Validate */

/*
  Create event view.
*/
define([
// Libs
  'jquery',
  'underscore',
  'moment',

// Base views.
  'baseviews/hpBaseView',

// Child views.
  'components/formView',

// Plugins
  'libs/jquery.ui.timepicker'
], function ($, _, moment, HpBaseView, FormView) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .create-event': 'createEvent',
            'click .cancel-create-event': 'cancelCreateEvent',

            // The date/time pickers don't blur correctly, so check the form
            // after every change.
            'change .create-event-form input': function () {
                this.form.checkValidations();
            }
        },

        timeRegex: /(\d{1,2}\:\d{2}\s?\w{2})/i,

        initialize: function () {
            // Init the form view.
            this.form = new FormView();
        },

        /**
        * Public: Render
        *
        * Returns this.
        */
        render: function () {
            // Render child views.
            this.assign({
                '.create-event-form': this.form
            });
            $("input[id$=txtTitle]").attr("id");
            // Select the user's timezone.
            this.form.$el.find('input[id$=lblSelectedTimeZone]').val($('input[id$=ddlTimeZone]').val());

            // Add validations for the form.
            this.form.addValidations({
                'title': new LiveValidation($("input[id$=txtTitle]").attr("id")).add(Validate.Presence),
                'startDate': new LiveValidation($("input[id$=txtStartDate]").attr("id")).add(Validate.Presence),
                'startTime': new LiveValidation($("input[id$=txtStartTime]").attr("id")).add(Validate.Presence).add(Validate.Format, {
                    pattern: this.timeRegex
                }),
                'endDate': new LiveValidation($("input[id$=txtEndDate]").attr("id")).add(Validate.Presence).add(Validate.Custom, {
                    args: { start: this.$el.find('input[id$=txtStartDate]') },
                    against: _.bind(function (value, args) {
                        var endDate = new Date(value).getTime(),
                    startDate = new Date(args.start.val()).getTime() || false;

                        // Check to make sure the start date and time is before the end date and time.
                        return this.checkDates('Start') < this.checkDates('End') || false;
                    }, this)
                }),
                'endTime': new LiveValidation($("input[id$=txtEndTime]").attr("id")).add(Validate.Presence).add(Validate.Format, {
                    pattern: this.timeRegex
                })
            });

            // Setup the date and time pickers.
            this.$el.find('input[id$=txtStartDate], input[id$=txtEndDate]').datepicker({
                minDate: -1,
                dateFormat: 'MM d, yy'
            });

            this.$el.find('input[id$=txtStartTime], input[id$=txtEndTime]').timepicker({
                showPeriod: true,
                showLeadingZero: false
            });

            return this;
        },

        /**
        * Check the start and end dates for an event.
        *
        * type  - The type of date/time to check. Can be 'start' or 'end'.
        *
        * Returns the moment.js object of the date and time added together.
        */
        checkDates: function (type) {
            var $date, date, $time, time;

            if (type !== 'Start' && type !== 'End') {
                console.warn('checkDates(): ' + type + ' is an unknown type. Use either "Start" or "End".');
                return this;
            }

            $date = this.$el.find('input[id$=txt' + type + 'Date]');
            $time = this.$el.find('input[id$=txt' + type + 'Time]');
            date = moment($date.val(), 'MMMM D, YYYY');
            time = moment($time.timepicker('getTime'), 'h:mm A');

            if (!date) {
                return this;
            }

            return date.add('hours', time.hours()).add('minutes', time.minutes());
        },

        /**
        * Create the event.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        createEvent: function (event) {
            event.preventDefault();

            if (this.form.isValid()) {
            } else {
            }

            return this;
        },

        /**
        * Cancel creating the event.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        cancelCreateEvent: function (event) {
            return this;
        }
    });
});