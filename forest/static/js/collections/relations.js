define(['backbone', 'models/relation'], function(Backbone, relation) {
    return Backbone.Collection.extend({
        model: relation,
        initialize: function(models, options) {
            if (options) {
                this.parent = options.parent;
            }
        },
        url: function() {
            return '/xhr/fetch_relations_for_text/' + this.parent + '/' + this.text;
        }
    });
});
