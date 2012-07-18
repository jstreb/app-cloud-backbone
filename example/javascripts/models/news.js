//Models
Article = Backbone.Model.extend();

ArticleCollection = Backbone.Collection.extend({
    model:Article,
    url:"http://appcloud.brightcove.com/content/4f3d8592b3d99278ed015beb/fetch"
});