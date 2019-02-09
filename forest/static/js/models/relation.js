define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        url: function() {
            return '/xhr/create_relation';
        }
    });

});
