define(
    ['jquery', 'underscore', 'backbone', 'views/node', 'views/node_edit'],
    function($, _, Backbone, Node, NodeEdit) {
        return Backbone.Router.extend({
            routes: {
                "forest/:slug/edit": "node_edit",
                "forest/:slug": "node_view",
                "forest": "node_entry"
            },

            node_entry: function() { forest.node_view('_'); },
            node_view: function(slug) { forest.node_view(slug); },
            node_edit: function(slug) { forest.node_edit(slug); }
        });
    }
);
