define(
    ['jquery', 'underscore', 'backbone', 'models/node', 'views/relations',
        'collections/relations', 'views/node', 'views/node_edit',
        'util/fetch_completions', 'tpl!templates/forest'],
    function($, _, Backbone, Node, RelationsView, Relations, NodeView, NodeEdit, fetch_completions, foresttpl) {

        return Backbone.View.extend({

            template: foresttpl,

            events: {
                'keyup input#prompt': 'keypress_prompt'
            },

            elements: {
                'prompt': 'input#prompt'
            },

            initialize: function() {
                this.relations_collection = new Relations();

                this.relations_view = new RelationsView();
                this.relations_view.set_relations_collection(this.relations_collection);
            },

            render: function() {
                this.$el.html(this.template());

                this.relations_view.setElement(this.$el.find('div#relations'));
                this.relations_view.render();

                this.$el.find(this.elements.prompt).focus();
            },

            keypress_prompt: function(evt) {

                var prompt_contents = this.$el.find(this.elements.prompt).val();

                if (evt.which == 40) {

                    // down arrow
                    this.$el.find('div[tabindex=0]').focus();
                    return;

                } else if (evt.which == 13) {

                    // enter
                    if (prompt_contents == '/edit') {
                        Backbone.history.navigate('/forest/' + this.current_node.get('slug') + '/edit', true);
                    }
                }

                // without this short timeout it seems the event fires
                // before jquerys val could get the updated text
                var self = this;
                window.setTimeout(
                    function() {
                        if (prompt_contents.length == 0 || prompt_contents[0] == '/') {
                            self.relations_view.render();
                            return;
                        }

                        if (prompt_contents.length < 3) {
                            return;
                        }

                        fetch_completions(
                            self.lastfetch,
                            function() {
                                self.lastfetch = new Date().getTime();
                                self.relations_collection.set_search_text(prompt_contents);
                                self.relations_collection.fetch({
                                    success: function() { self.relations_view.render_list(); },
                                    error: function() { self.$el.html('Server error.... reload?'); }
                                });
                            });
                    }, 10);
            },

            go_to_relation: function(evt) {
                Backbone.history.navigate('/forest/' + $(evt.target).data('child-slug'), true);
            },

            node_view: function(slug) {
                var self = this;
                this.current_node = new Node({ slug: slug });
                this.current_node.fetch(
                    {
                        success: function() {

                            // create new nodeview and render (appends to text_area)
                            var node_view = new NodeView({ node: self.current_node });
                            node_view.setElement(self.$el.find('div#text_area'));
                            node_view.render();

                            // update relations collection for new node and reset
                            self.relations_collection.set_parent_node(self.current_node);
                            self.relations_collection.set_search_text('');
                            self.relations_collection.reset();

                            // clear prompt
                            self.$el.find(self.elements.prompt).val('').focus();

                            // redraw relations view
                            self.relations_view.render();
                        },
                        error: function() { self.error(); }
                    }
                );
            },

            node_edit: function(slug) {
                var self = this;
                this.current_node = new Node({ slug: slug });
                this.current_node.fetch(
                    {
                        success: function() {
                            // create new nodeview and render (appends to text_area)
                            var node_edit = new NodeEdit({ node: self.current_node });
                            node_edit.setElement(self.$el.find('div#text_area'));
                            node_edit.render();

                            // update relations collection for new node and reset
                            self.relations_collection.set_parent_node(self.current_node);
                            self.relations_collection.set_search_text('');
                            self.relations_collection.reset();

                            // clear prompt
                            self.$el.find(self.elements.prompt).val('').focus();

                            // redraw relations view
                            self.relations_view.render();
                        },
                        error: function() { self.error(); }
                    }
                );
            }

        });
    }
);
