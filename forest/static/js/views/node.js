define(
    ['jquery',
        'underscore',
        'backbone',
        'models/node',
        'collections/relations',
        'tpl!templates/node'],
    function($, _, Backbone, Node, Relations, nodetpl) {
        return Backbone.View.extend({

            el: 'div#node',

            events: {
                'click .relation': 'click_relation'
            },

            loading: true,

            template: nodetpl,

            initialize: function(options) {
                var self = this;

                this.model = new Node({ slug: options.slug });
                this.relations = new Relations([], { parent_slug: options.slug });

                $.when(
                    this.model.fetch({ error: function() { self.error(); } }),
                    this.relations.fetch({ error: function() { self.error(); } })
                ).then(function() {
                    self.loading = false;
                    self.render();
                });
            },

            render: function() {
                if (this.loading) {
                    return;
                }

                this.$el.html(
                    this.template(
                        {
                            node: this.model,
                            relations: this.relations
                        }
                    )
                );
            },

            error: function() {
                this.$el.html('Server error.... reload?');
            },

            click_relation: function(evt) {
                Backbone.history.navigate('/forest/' + $(evt.target).data('child-slug'), true);
            }
        });
    }
);
