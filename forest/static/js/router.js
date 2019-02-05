// Filename: router.js
define(
    ['jquery', 'underscore', 'backbone', 'views/node', 'views/node_edit'],
    function($, _, Backbone, Node, NodeEdit) {
        return Backbone.Router.extend({
            routes: {
                "forest/:slug/edit": "node_edit",
                "forest/:slug": "node"
            },

            node: function(slug) {
                node_view = new Node({ slug: slug });
                node_view.render();
            },

            node_edit: function(slug) {
                node_edit = new NodeEdit({ slug: slug });
                node_edit.render();
            }
        });
    }
);
