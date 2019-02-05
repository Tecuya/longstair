define(
    ['jquery',
        'underscore',
        'backbone',
        'models/node',
        'views/relations',
        'tpl!templates/node'],
    function($, _, Backbone, Node, Relations, nodetpl) {
        return Backbone.View.extend({

            min_fetch_interval: 1000,

            el: 'div#node',

            events: {
                'keydown input#prompt': 'handle_prompt_keydown'
            },

            loading: true,

            template: nodetpl,

            initialize: function(options) {
                var self = this;
                this.model = new Node({ slug: options.slug });
                this.model.fetch({
                    success: function() {
                        self.loading = false;
                        self.render();
                    },
                    error: function() { self.error(); }
                });

                this.relations = new Relations({ parent: options.slug });
            },

            render: function() {
                if (this.loading) {
                    return;
                }

                this.$el.html(this.template({ node: this.model }));

                this.relations.setElement('div#relations');
                this.relations.render();
            },

            error: function() {
                this.$el.html('Server error.... reload?');
            },

            go_to_relation: function(evt) {
                Backbone.history.navigate('/forest/' + $(evt.target).data('child-slug'), true);
            },

            handle_prompt_keydown: function(evt) {
                var self = this;

                var contents = $('input#prompt').val();

                // down arrow
                if (evt.which == 40) {
                    $('div[tabindex=0]').focus();
                    return;
                }

                if (contents.length < 3) {
                    return;
                }

                var milliseconds = new Date().getTime();

                if (!this.lastfetch || (milliseconds - this.lastfetch) > this.min_fetch_interval) {

                    this.relations.update_text(contents);
                    this.lastfetch = milliseconds;
                }
            }
        });
    }
);
