define(
    ['jquery',
        'underscore',
        'backbone',
        'put_cursor_at_end',
        'models/node',
        'views/relations',
        'tpl!templates/node_edit'],
    function($, _, Backbone, put_cursor_at_end, Node, Relations, nodeedittpl) {

        return Backbone.View.extend({
            el: 'div#node',
            events: {
                'click button#save': 'save'
            },
            loading: false,
            template: nodeedittpl,

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
            },

            render: function() {
                if (this.loading) {
                    return;
                }

                this.$el.html(this.template({ node: this.model }));

                $('input[name=name]').focus();
            },

            error: function() {
                this.$el.html('Server error.... reload?');
            },

            save: function() {
                this.model.set('name', $('input[name=name]').val());
                this.model.set('slug', $('input[name=slug]').val());
                this.model.set('text', $('textarea[name=text]').val());

                var self = this;
                this.model.on('sync', function() {
                    Backbone.history.navigate('/forest/' + self.model.get('slug'), true);
                });

                this.model.save();
            }
        });
    }
);
