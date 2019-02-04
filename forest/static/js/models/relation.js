define(['backbone'], function(Backbone) {

    return Backbone.Model.extend({
        url: function() {
            return '/xhr/relation/' + this.get('slug');
        }
    });

});
