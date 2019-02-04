define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        url: function() {
            return '/xhr/node_by_slug/' + this.get('slug');
        }
    });

});
