define(
    ['jquery',
        'underscore',
        'backbone',
        'put_cursor_at_end',
        'collections/relations',
        'tpl!templates/relations'],
    function($, _, Backbone, put_cursor_at_end, Relations, relationstpl) {
        return Backbone.View.extend({

            events: {
                'click .relation': 'go_to_relation',
                'keydown .relation': 'keypress'
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
                var self = this;
                this.relations.text = contents;

                this.$el.html('...loading...');

                this.relations.fetch({
                    success: function() { self.render(); },
                    error: function() { self.error(); }
                });
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
                    this.go_to_relation(evt);
                }
            },

            render: function() {
                this.$el.html(this.template({ relations: this.relations }));
            }
        });
    }
);
