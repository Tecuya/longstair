define(
    ['jquery',
        'underscore',
        'backbone',
        'put_cursor_at_end',
        'util/fetch_completions',
        'collections/relations',
        'tpl!templates/relations_list'],
    function($, _, Backbone, put_cursor_at_end, fetch_completions, Relations, relationslisttpl) {
        return Backbone.View.extend({

            template: relationslisttpl,

            events: {
                'click .relation_list_item': 'click_relation',
                'keyup .relation_list_item': 'keypress_relation'
            },

            initialize: function(options) {
                this.relations_view = options.relations_view;
                this.forest_view = options.forest_view;
            },

            keypress_relation: function(evt) {
                var target = $(evt.target);

                var tabindex = parseInt(target.attr('tabindex'));

                if (evt.which == 38) { // up arrow

                    // if we are at the top of the list return to the prompt
                    if (tabindex == 0) {
                        $('input#prompt').focus().putCursorAtEnd();

                    } else {
                        this.$el.find('div[tabindex=' + (tabindex - 1) + ']').focus();
                    }

                } else if (evt.which == 40) { // down arrow

                    var next_tabindex = this.$el.find('div[tabindex=' + (tabindex + 1) + ']');

                    if (next_tabindex.length > 0) {
                        next_tabindex.focus();
                    } else {
                        $('input#relation_creation_text').focus();
                    }

                } else if (evt.which == 13) { // enter
                    this.click_relation(evt);
                }
            },

            click_relation: function(evt) {
                if ($(evt.target).attr('id') == 'create_relation') {
                    this.relations_view.create_relation();
                } else {
                    var child_slug = $(evt.target).closest('div.relation_list_item').data('relation-slug');
                    this.forest_view.go_to_relation(child_slug);
                }
            },

            render: function(relations_collection) {
                // we will restore the users focused tabindex after rendering
                var focused_tabindex = $('div.relation_list_item:focus').attr('tabindex');

                this.$el.html(this.template({ relations: relations_collection }));

                if (focused_tabindex) {
                    $('div.relation_list_item[tabindex=' + focused_tabindex + ']').focus();
                }
            }
        });
    });
