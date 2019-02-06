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
                'click .relation': 'go_to_relation',
                'keyup .relation': 'keypress_relation'
            },

            initialize: function(options) {
                this.relations = options.relations;
            },

            keypress_relation: function(evt) {
                var target = $(evt.target);

                var tabindex = target.attr('tabindex');

                if (evt.which == 38) { // up arrow

                    // if we are at the top of the list return to the prompt
                    if (tabindex == 0) {
                        $('input#prompt').focus().putCursorAtEnd();

                    } else {
                        $('div.relation[tabindex=' + (tabindex - 1) + ']').focus();
                    }

                } else if (evt.which == 40) { // down arrow
                    $('div.relation[tabindex=' + (tabindex + 1) + ']').focus();

                } else if (evt.which == 13) { // enter

                    if ($(evt.target).attr('id') == 'create_relation') {
                        this.create_relation();
                    } else {
                        this.go_to_relation(evt);
                    }
                }
            },

            go_to_relation: function(evt) {
                if ($(evt.target).attr('id') == 'create_relation') {
                    this.create_relation();
                } else {
                    Backbone.history.navigate('/forest/' + $(evt.target).data('child-slug'), true);
                }
            },

            render: function(relations) {
                // we will restore the users focused tabindex after rendering
                var focused_tabindex = $('div.relation:focus').attr('tabindex');

                this.$el.html(this.template({ relations: relations }));

                if (focused_tabindex) {
                    $('div.relation[tabindex=' + focused_tabindex + ']').focus();
                }
            },

            create_relation: function() {
                $('div#relation_creation').css('display', 'inline-block');
                $('input[name=text]').val($('input#prompt').val()).focus().putCursorAtEnd();
                this.relations.keypress_text(); // fire event as if we typed that in..
            }

        });
    });
