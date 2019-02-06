define(
    ['jquery',
        'underscore',
        'backbone',
        'util/slugify',
        'util/fetch_completions',
        'views/node_list',
        'views/relations_list',
        'models/relation',
        'collections/relations',
        'tpl!templates/relations'],
    function($, _, Backbone, slugify, fetch_completions, NodeList, RelationsList, Relation, Relations, relationstpl) {
        return Backbone.View.extend({

            min_fetch_interval: 1500,

            template: relationstpl,

            events: {
                'keyup input[name=destination]': 'keypress_destination',
                'keyup input[name=text]': 'keypress_text',
                'click button#create': 'create'
            },

            initialize: function(options) {
                this.relations = new Relations([], { parent: options.parent });
                this.relations_list = new RelationsList({ relations: this });
                this.node_list = new NodeList({ relations: this });
            },

            update_text: function(contents) {
                if (contents.length == 0 || contents[0] == '/') {
                    this.render();
                    return;
                }

                if (contents.length < 3) {
                    return;
                }

                var self = this;

                fetch_completions(
                    self.lastfetch,
                    function() {
                        self.lastfetch = new Date().getTime();
                        self.relations.text = contents;
                        self.relations.fetch({
                            success: function() { self.relations_list.render(self.relations); },
                            error: function() { self.$el.html('Server error.... reload?'); }
                        });
                    });
            },

            render: function() {
                this.$el.html(this.template({ relations: this.relations }));
                this.relations_list.setElement('div#relations_list');
                this.node_list.setElement('div#existing_list');
            },

            keypress_text: function() {
                var self = this;
                window.setTimeout(
                    function() {
                        self.$el
                            .find('input[name=slug]')
                            .val(
                            slugify(
                                self.$el.find('input[name=text]').val()));
                    }, 10);
            },

            keypress_destination: function(evt) {

                if (evt.which == 40) { // down arrow
                    $('div.node-list-item[tabindex=0]').focus();
                    return;
                }

                this.node_list.update_text($('input[name=destination]').val());
            },

            create_to_existing_branch: function(node) {
                this.$el.find('div.choose_link_existing').hide();
                this.$el
                    .find('div.chosen_link_existing')
                    .html('Link to existing branch<br><i>"' + node.get('name') + '" by ' + node.get('author') + '</i>')
                    .data('slug', node.get('slug'))
                    .show();
                this.$el.find('button#create').focus();
            },

            create: function() {
                var save_relation = function(success) {
                    relation.save({
                        success: success,
                        error: function() {
                            self.$el.find('button#create').html('Save failed...?');
                        }
                    });
                };

                var relation = new Relation();

                var relation_text = this.$el.find('input[name=text]').val();
                var relation_slug = this.$el.find('input[name=slug]').val();
                relation.set('text', relation_text);
                relation.set('slug', relation_slug);
                relation.set('parent', this.relations.parent);

                var dest_slug = this.$el.find('div.chosen_link_existing').data('slug');
                if (dest_slug) {
                    relation.set('destination-slug', dest_slug);

                    save_relation(
                        function() {
                            Backbone.history.navigate('/forest/' + dest_slug, true);
                        }
                    );

                } else {

                    var new_node_slug = relation_slug;
                    var node = new Node({
                        'name': relation_text,
                        'slug': new_node_slug
                    });

                    node.save({
                        success: function() {
                            save_relation(
                                function() {
                                    Backbone.history.navigate('/forest/' + new_node_slug + '/edit', true);
                                });
                        }
                    });
                }

            }

        });
    }
);
