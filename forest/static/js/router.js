// Filename: router.js
define(
    ['jquery', 'underscore', 'backbone', 'views/node'],
    function($, _, Backbone, Node) {
        return Backbone.Router.extend({
            routes: {
                "forest/:slug": "node"
            },

            node: function(slug) {
                nodeView = new Node({ slug: slug });
                nodeView.render();
            }
        });
    }
);
