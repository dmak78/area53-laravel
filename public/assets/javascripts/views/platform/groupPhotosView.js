/*jslint browser: true, indent: 2, maxlen: 80, nomen: true, plusplus: true */
/*global console, define */

/*
Group photos view.
*/
define([
// Router
  'routers/router',

// Libs
  'jquery',
  'underscore',

// Base views
  'baseviews/hpBaseView',

  'collections/PhotoComments',
  'components/commentView',
  'components/postFormView',

// Templates
  'text!templates/group-photos/group-photos-page.html',
  'text!templates/group-photos/group-photos-page-album.html',
  'text!templates/group-photos/group-photos-page-photo.html',
  'text!templates/album-grid-item.html',
  'text!templates/single-album-photo.html'
], function (router, $, _, HpBaseView, CommentCollection, CommentView, PostFormView,
  groupPhotosPageTemplate, groupPhotosPageAlbumTemplate,
  groupPhotosPagePhotoTemplate, albumGridItemTemplate,
  singleAlbumPhotoTemplate) {
    'use strict';

    return HpBaseView.extend({
        events: {
            'click .platform-grid a': 'pushStateNav',
            'touchend .platform-grid a': 'pushStateNav',
            'click .like': 'toggleLiked',
            'touchend .like': 'toggleLiked',
            'click .likePeopleModal': 'showLikeModal',
            'touchend .likePeopleModal': 'showLikeModal'
        },

        // Cache the data from the albums.
        albumData: null,

        //  showAllComments: false,

        // Template for the albums in a group album list.
        // Pages.
        groupPhotosPageTemplate: _.template(groupPhotosPageTemplate),
        groupPhotosPageAlbumTemplate: _.template(groupPhotosPageAlbumTemplate),
        groupPhotosPagePhotoTemplate: _.template(groupPhotosPagePhotoTemplate),

        // Items.
        albumTemplate: _.template(albumGridItemTemplate),
        photoTemplate: _.template(singleAlbumPhotoTemplate),

        /**
        * Initialize.
        */
        initialize: function (options) {
            // Element references.
            this.$content = this.$el.find('.page-group-photos');
            this.commentCollection = new CommentCollection();
            this.commentForm = new PostFormView();
            this.commentForm.on('post', this.addComment, this);
            this.gid = options.gid;

            this.commentCollection.on('reset', this.renderComments, this);
            this.commentCollection.on('add', this.renderComment, this);
        },

        /**
        * Use pushState to navigate through this part of the app.
        * This might be something that should be used all over the app.
        *
        * event  - Event object from the click.
        *
        * Returns this.
        */
        pushStateNav: function (event) {
            var $target = $(event.target),
        href = $target.attr('href') || $target.closest('a').attr('href');

            if (window.history.pushState) {
                event.preventDefault();
                router.navigate(href, { trigger: true });
            }
        },

        /**
        * Get the album data, cache it and run a callback.
        * Just run the callback if the data is already cached.
        *
        * callback - String name of a method in this context.
        * routes   - Optional object of routes.
        *
        * Returns this.
        */
        getData: function (callback, routes) {
            routes = routes || [];
            // Run the callback if the data is already cached.
            if (this.albumData) {
                this[callback](this.albumData, routes);
                return this;
            }
            // Get the album data.
            callWebMethod(PHOTO_SERVICE, 'GetGroupAlbums', { 'groupRecordId': this.gid }, function (result) {
                console.log(result.d);
                this.albumData = result.d.Albums;
                this.albumData.gid = this.gid;
                this[callback](result.d.Albums, routes);
            }, this);

            return this;
        },

        /**
        * Render the available group albums.
        *
        * albums - Object of albums data.
        *
        * Returns this.
        */
        renderAlbumList: function (albums) {
            var $rendered = $(this.groupPhotosPageTemplate()),
        markup = '';

            // Render the albums.
            _.each(albums, function (album) {
                album.gid = this.gid;
                markup += this.albumTemplate(album);
                console.log('album: ', album);
            }, this);

            // Render the content.
            $rendered.find('.group-photos-grid').html(markup);
            this.$content.html($rendered);

            return this;
        },

        /**
        * Render the contents of an album.
        *
        * albums - Object of albums data.
        * routes - Routes object.
        *          album - Album ID to render.
        *
        * Returns this.
        */
        renderSingleAlbum: function (albums, routes) {
            var markup = '',
        album = this.getValueById(albums, routes.album),
        $rendered;

            // Render the page template.
            album.gid = this.gid;
            $rendered = $(this.groupPhotosPageAlbumTemplate(album));

            // Render the images.
            _.each(album.images, function (image) {
                // Render the template, and include the album ID for links.
                image.gid = this.gid;
                image.albumId = routes.album;

                markup += this.photoTemplate(image);
            }, this);

            $rendered.find('.group-photos-grid').html(markup);
            this.$content.html($rendered);

            return this;
        },

        /**
        * Render a single photo in an album.
        *
        * albums - Object of albums data.
        * routes - Routes object.
        *          album - Album ID to render.
        *          photo - Photo ID to render.
        *
        * Returns this.
        */
        renderPhoto: function (albums, routes) {
            var album = this.getValueById(albums, routes.album),
        photo = this.getValueById(album.images, routes.photo);

            // Get the IDs of the next and previous photos in the album.
            photo.nextPhoto = album.images[photo.arrayKey + 1];
            photo.prevPhoto = album.images[photo.arrayKey - 1];

            // Render.
            this.$content.html(this.groupPhotosPagePhotoTemplate({
                album: album,
                photo: photo,
                gid: this.gid
            }));

            this.$commentList = $(this.$el.find('ul.status-comments'));
            this.assign({
                '.post-comment-form': this.commentForm
            });

            this.currentPhoto = photo;
            this.currentPhotoId = photo.id;
            this.getPhotoLikeCount();
            // this.$showMoreComments = this.$el.find('a.showMoreComments');
            this.$likeButton = this.$el.find('.like');
            this.$flagButton = this.$el.find('.flag');
            this.$likePeople = this.$el.find('.likePeople');
            this.$likeCount = this.$el.find('.likeCount');
            this.$likePeopleModal = this.$el.find('a.likePeopleModal');

            this.commentCollection.fetch({
                jsonData: {
                    photoId: photo.id,
                    offset: '00000000-0000-0000-0000-000000000000'
                }
            });

            // this.showAllComments = false;

            return this;
        },
        getPhotoLikeCount: function () {
            callWebMethod(WALL_SERVICE, "GetPhotoLikeCount", { photoId: this.currentPhotoId }, function (result) {
                if (result.d.IsLiked) {
                    this.$likeButton.addClass('liked').text('Liked');
                }
                this.photoLikeCount = parseInt(result.d.LikeCount);
                if (this.photoLikeCount > 0) {
                    this.$likePeopleModal.show();
                    this.$likeCount.text(this.photoLikeCount);
                    if (this.photoLikeCount == 1) {
                        this.$likePeople.text('person likes');
                    }
                    else {
                        this.$likePeople.text('people like');
                    }
                }
                else {
                    this.$likePeopleModal.hide();
                }
            }, this);
            return this;
        },
        renderComments: function () {
            var that = this;
            this.$commentList.empty();
            _.each(this.commentCollection.models, function (comment, index) {
                //  if (index >= 2 && !that.showAllComments) {
                //      return false;
                //  }
                that.renderComment(comment);

            }, this);

            //            if (this.commentCollection.models.length > 2 && !this.showAllComments) {
            //                this.$showMoreComments.find('span.photoCommentCount').text(this.commentCollection.models.length);
            //                this.$showMoreComments.show();
            //            }
            //            else {
            //                this.$showMoreComments.hide();
            //            }

            return this;
        },
        renderComment: function (comment) {
            var commentView = new CommentView({
                model: comment
            });
            this.$commentList.append(commentView.render().el);

            this.$commentList.find('abbr.timeago').timeago();



            return this;
        },
        addComment: function (data) {
            this.commentCollection.create({
                photoId: this.currentPhotoId,
                message: encodeURIComponent(data.content)
            }, { wait: true });

            return this;
        },
        toggleLiked: function (event) {
            event.preventDefault();
            if ($(event.target).hasClass('liked')) {
                callWebMethod(WALL_SERVICE, "UnlikePhoto", { photoId: this.currentPhotoId }, function (result) {
                    $(event.target).removeClass('liked').text('Like');
                    this.getPhotoLikeCount();
                }, this);
            }
            else {
                callWebMethod(WALL_SERVICE, "LikePhoto", { photoId: this.currentPhotoId }, function (result) {
                    $(event.target).addClass('liked').text('Liked');
                    this.getPhotoLikeCount();
                }, this);
            }

            return this;
        },
        showLikeModal: function (event) {
            event.preventDefault();
            callWebMethod(WALL_SERVICE, "GetPhotoLikes", { photoId: this.currentPhotoId }, this.populateLikeModal);
            return this;
        },
        populateLikeModal: function (result) {
            var that = this;
            var $profileList = $('#like-people-modal .modal-content ul');
            $profileList.empty();
            _.each(result.d.Profiles, function (profile, index) {
                $profileList.append('<li><div class="avatar small"><img src="' + profile.ProfileImage + '"/></div><a href="' + profile.ProfileUrl + '" class="user-name">' + profile.DisplayName + '</a></li>');

            }, this);

            $('#like-people-modal').modal('show');

            return this;
        },

        /**
        * Get a value by it's id. Expects photo album objects.
        *
        * objects  - Object of values. See /json/all_albums.json.
        * id       - Value of the id property.
        *
        * Returns found object, or `this` if not found.
        */
        getValueById: function (objects, id) {
            var object;

            // Error out early.
            if (!object && !id) {
                return this;
            }

            // Iterate over each item, and add the key to the returned object.
            _.each(objects, function (value, key) {
                if (value.id === id) {
                    object = value;
                    object.arrayKey = key;
                }
            }, this);

            // Show an error if this album doesn't exist.
            if (!object) {
                console.warn('No object with the id "' + id + '" exists!');
                return this;
            }

            return object;
        }

    });
});