define(['backbone', 'models/relation'], function(Backbone, relation) {
    return Backbone.Collection.extend({
        model: relation,
        initialize: function(models, options) {
            this.parent_slug = options.parent_slug;
        },
        url: function() {
            return '/xhr/relations_for_parent_node/' + this.parent_slug;
        }
    });
});
