define(
    ['jquery',
        'underscore',
        'backbone',
        'put_cursor_at_end',
        'collections/relations',
        'tpl!templates/relations'],
    function($, _, Backbone, put_cursor_at_end, Relations, relationstpl) {
        return Backbone.View.extend({

            min_fetch_interval: 1500,

            events: {
                'click .relation': 'go_to_relation',
                'keypress .relation': 'keypress'
            },

            template: relationstpl,

            initialize: function(options) {
                this.relations = new Relations([], { parent: options.parent });
            },

            error: function() {
                this.$el.html('Server error.... reload?');
            },

            go_to_relation: function(evt) {
                Backbone.history.navigate('/forest/' + $(evt.target).data('child-slug'), true);
            },

            update_text: function(contents) {
                if (contents.length == 0) {
                    this.$el.html('');
                    return;
                }

                if (contents.length < 3) {
                    return;
                }

                var self = this;

                var refresh = function() {
                    self.lastfetch = new Date().getTime();
                    self.relations.text = contents;
                    self.relations.fetch({
                        success: function() {
                            self.render();
                        },
                        error: function() { self.error(); }
                    });
                };

                // determine when the fetch should occur so as not to
                // violate min_fetch_interval
                var milliseconds = new Date().getTime();
                var fetchwait = 0;
                if (this.lastfetch) {
                    var time_since_fetch = milliseconds - this.lastfetch;
                    if (time_since_fetch > this.min_fetch_interval) {
                        fetchwait = 0;
                    } else {
                        fetchwait = this.min_fetch_interval - time_since_fetch;
                    }
                }

                var queuetime = new Date().getTime();

                self.highest_queue_time = queuetime;

                window.setTimeout(
                    function() {
                        // nuke superceded jobs
                        if (queuetime < self.highest_queue_time) {
                            return;
                        }
                        refresh();
                    },
                    fetchwait);
            },

            keypress: function(evt) {
                var target = $(evt.target);

                var tabindex = target.attr('tabindex');

                if (evt.which == 38) { // up arrow

                    // if we are at the top of the list return to the prompt
                    if (tabindex == 0) {
                        $('input#prompt').focus().putCursorAtEnd();

                    } else {
                        $('div[tabindex=' + (tabindex + 1) + ']').focus();
                    }

                } else if (evt.which == 40) { // down arrow
                    $('div[tabindex=' + (tabindex - 1) + ']').focus();

                } else if (evt.which == 13) { // enter

                    if ($(evt.target).id() == 'create_relation') {

                    }

                    this.go_to_relation(evt);
                }
            },

            render: function() {
                this.$el.html(this.template({ relations: this.relations }));
            }
        });
    }
);
