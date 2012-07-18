// Router
var AppRouter = Backbone.Router.extend({

    routes:{
        "":"list",
        "article/:id":"details"
    },

    list:function () {
        this.articles = new ArticleCollection();
        this.articleListView = new ArticleListView( { model:this.articles } );
        this.articles.fetch();
        $( '#first-page-content' ).html( this.articleListView.render().el );
    },

    details:function (id) {
      this.detailsView = new DetailsView( { model: this.articles.at(id) } );
      $( "body" ).append( this.detailsView.render().el );
    }
});

/*
 * The Brightcove SDK will fire an "init" event after the document is ready, the device is ready to be interacted with and any
 * locale or markup files have been loaded and populated on the bc.templates object.
 */
$( bc ).bind( "init", initialize );

function initialize() {
  _app = new AppRouter();
  Backbone.history.start();
}