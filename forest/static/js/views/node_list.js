define(
    ['jquery',
        'underscore',
        'backbone',
        'put_cursor_at_end',
        'util/fetch_completions',
        'collections/nodes',
        'tpl!templates/node_list'],
    function($, _, Backbone, put_cursor_at_end, fetch_completions, Nodes, nodelisttpl) {

        return Backbone.View.extend({
            template: nodelisttpl,

            events: {
                'keyup div.node-list-item': 'keypress_list',
                'click div.node-list-item': 'click_list'
            },

            initialize: function(options) {
                this.relations = options.relations;
                this.nodes = new Nodes();
            },

            render: function() {
                this.$el.html(this.template({ nodes: this.nodes }));
            },

            update_text: function(text) {
                if (text.length == 0) {
                    this.render();
                    return;
                }

                if (text.length < 3) {
                    return;
                }

                var self = this;
                window.setTimeout(
                    function() {
                        fetch_completions(
                            self.lastfetch,
                            function() {
                                self.lastfetch = new Date().getTime();
                                self.nodes.text = text;
                                self.nodes.fetch({
                                    error: function() { self.$el.html('Server error...'); },
                                    success: function() { self.render(); }
                                });
                            }
                        );
                    }, 10);
            },

            keypress_list: function(evt) {
                var target = $(evt.target);
                var tabindex = target.attr('tabindex');

                if (evt.which == 38) { // up arrow
                    if (tabindex == 0) {
                        $('input[name=destination]').focus();
                    } else {
                        $('div.node-list-item[tabindex=' + (tabindex - 1) + ']').focus();
                    }
                } else if (evt.which == 40) { // down arrow
                    $('div.node-list-item[tabindex=' + (tabindex + 1) + ']').focus();
                } else if (evt.which == 13) {
                    this.click_list(evt);
                }
            },

            click_list: function(evt) {
                this.relations.create_to_existing_branch(
                    this.nodes.findWhere({ slug: $(evt.target).data('slug') }));
            }

        });

    });