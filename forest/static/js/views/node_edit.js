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

            el: 'div#forest',

            events: {
                'click button#save': 'save'
            },

            template: nodeedittpl,

            initialize: function(options) {
                this.node = options.node;
            },

            render: function() {
                this.$el.append(this.template({ node: this.node }));
                this.$el.scrollTop(this.$el[0].scrollHeight);
            },

            error: function() {
                this.$el.append('Server error.... reload?');
            },

            save: function() {
                this.node.set('name', $('input[name=name]').val());
                this.node.set('slug', $('input[name=slug]').val());
                this.node.set('text', $('textarea[name=text]').val());

                var self = this;
                this.node.on('sync', function() {
                    self.$el.find('div.node_edit').remove();
                    Backbone.history.navigate('/forest/' + self.node.get('slug'), true);
                });

                this.node.save();
            }
        });
    }
);
