/*jslint browser: true, indent: 2, nomen: true */
/*global define */

/*
  Skills widget.
*/
define([
// Libs
  'jquery',

// Base view.
  'baseviews/hpBaseView'
], function ($, HpBaseView) {
    'use strict';

    return HpBaseView.extend({

        events: {
            'click .tag': 'toggleEndorsement'
        },


        /**
        * Initialize.
        */
        initialize: function () {
            this.render();
        },

        /**
        * Render.
        */
        render: function () {
            this.tooltip({
                '.expertise:not(.recommended) .tag': { placement: 'right', title: 'Recommend this person\'s expertise.' }
            });
            console.log('renderskills');
            callWebMethod(PROFILE_SERVICE, "GetUserEndorsments", null, function (result) {
                for (var i = 0; i < result.d.UserEndorsements.length; i++) {
                    var $buttons = $("a.tag[data-responsibilityid='" + result.d.UserEndorsements[i].ResponsibilityId + "']");
                    $buttons.parents('div.expertise').removeClass("recommended").addClass("recommended");
                }
            }, this);

            return this;
        },
        toggleEndorsement: function (event) {
            event.preventDefault();
            this.$target = $(event.target);
            var profileId = this.$target.data('ownerid');
            var responsibilityName = this.$target.data('responsibilityname');
            var $parent = this.$target.parents('.expertise');

            if ($parent.hasClass("recommended")) {
                callWebMethod(PROFILE_SERVICE, "RemoveEndorsement", { 'profileId': profileId, 'skillName': responsibilityName }, function (result) {
                    console.log(result);
                    this.$target.text(result.d.Value);
                    $parent.removeClass("recommended");
                }, this);
            }
            else {
                callWebMethod(PROFILE_SERVICE, "AddEndorsement", { 'profileId': profileId, 'skillName': responsibilityName }, function (result) {
                    console.log(result);
                    this.$target.text(result.d.Value);
                    $parent.addClass("recommended");
                }, this);
            }

            return this;
        }
    });
});