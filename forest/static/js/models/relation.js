define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        url: function() {
            return '/xhr/relation_by_slug/' + this.get('slug');
        }
    });

});
