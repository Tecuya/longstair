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
                'keyup input[name=text]': 'keypress_creation_text',
                'keyup input[name=slug]': 'keypress_creation_slug',
                'click button#create': 'create'
            },

            elements: {
                'div_creation': 'div#relation_creation',
                'input_creation_text': 'input#relation_creation_text',
                'input_creation_slug': 'input#relation_creation_slug',
                'input_creation_destination': 'input#relation_creation_destination',
                'input_creation_button': 'input#relation_creation_button'
            },

            initialize: function(options) {
                this.relations_list_view = new RelationsList({ relations_view: this });
                this.node_list_view = new NodeList({ relations_view: this });
            },

            set_relations_collection: function(relations_collection) {
                this.relations_collection = relations_collection;
            },

            render: function() {
                this.$el.html(this.template({ relations: this.relations }));

                this.relations_list_view.setElement('div#relations_list');
                this.node_list_view.setElement('div#existing_list');
            },

            render_list: function() {
                this.relations_list_view.render(this.relations_collection);
            },

            keypress_creation_slug: function(evt) {
                if (evt) {
                    if (evt.which == 38) { // up arrow
                        this.$el.find(this.elements.input_creation_text).focus();
                    } else if (evt.which == 40) { // down arrow
                        this.$el.find(this.elements.input_creation_destination).focus();
                    }
                }
            },

            keypress_creation_text: function(evt) {
                var self = this;

                if (evt) {
                    if (evt.which == 38) { // up arrow
                        // back to highest tabindex of relations_list
                        $('div.relation[tabindex=' + this.relations_collection.models.length + ']').focus();
                    } else if (evt.which == 40) { // down arrow
                        this.$el.find(this.elements.input_creation_slug).focus();
                    }
                }

                window.setTimeout(
                    function() {
                        self.$el
                            .find('input[name=slug]')
                            .val(slugify(self.$el.find('input[name=text]').val()));
                    }, 10);
            },

            keypress_destination: function(evt) {

                if (evt.which == 40) { // down arrow
                    $('div.node_list_item[tabindex=0]').focus();
                    return;
                }

                this.node_list_view.update_text($('input[name=destination]').val());
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
                    relation.save(
                        {},
                        {
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
                relation.set('parent', this.relations_collection.parent_node.get('slug'));

                var chosen_link_existing = this.$el.find('div.chosen_link_existing');
                var dest_slug = chosen_link_existing.data('slug');
                if (dest_slug) {
                    relation.set('child', dest_slug);
                    save_relation(function() { Backbone.history.navigate('/forest/' + dest_slug, true); });

                } else {
                    relation.set('child', relation_slug);
                    save_relation(function() { Backbone.history.navigate('/forest/' + relation_slug + '/edit', true); });
                }
            },

            create_relation: function() {
                var self = this;

                // unhide
                this.$el.find(this.elements.div_creation).css('display', 'inline-block');

                // populate text and fire event
                this.$el.find(this.elements.input_creation_text).val($('input#prompt').val()).focus().putCursorAtEnd();
                this.keypress_creation_text();
            }

        });
    }
);
