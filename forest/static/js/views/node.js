define(
    ['jquery',
        'underscore',
        'backbone',
        'models/node',
        'views/relations',
        'tpl!templates/node'],
    function($, _, Backbone, Node, Relations, nodetpl) {
        return Backbone.View.extend({

            el: 'div#node',

            events: {
                'keyup input#prompt': 'keypress'
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
                $('input#prompt').focus();
            },

            error: function() {
                this.$el.html('Server error.... reload?');
            },

            go_to_relation: function(evt) {
                Backbone.history.navigate('/forest/' + $(evt.target).data('child-slug'), true);
            },

            keypress: function(evt) {

                if (evt.which == 40) {
                    $('div[tabindex=0]').focus();
                    return;
                }

                // without this short timeout it seems the event fires
                // before jquerys val could get the updated text
                var self = this;
                window.setTimeout(
                    function() { self.relations.update_text($('input#prompt').val()); },
                    10);
            }
        });
    }
);
