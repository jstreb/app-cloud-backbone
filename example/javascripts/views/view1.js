/*
- Add ability to show spinner.

*/

( function( $ ) {
  
  var _$bc = $( bc ),
      App,
      Article,
      ArticleCollection,
      ArticleListView,
      ArticleView;
      
  //Models
  Article = Backbone.Model.extend({});
  
  ArticleCollection = AppCloudCollection.extend({
      
      model:Article,
      
      contentFeed: "4f3d8592b3d99278ed015beb",
      
      getMarkupData: function() {
        var ret = [];
          for( var i = 0, len = this.models.length; i < len; i++ ) {
            ret.push( this.models[i].attributes );
          }
        return ret;
      }
      
  });
  
  
  
  //Views
  ArticleListView = Backbone.View.extend( {
    
    el: '#first-page-content',
    
    initialize: function () {
      this.model.bind("change", this.render, this);

      if( this.model.length > 0 ) {
        this.render();
      }
    },
    
    events: {
      "click li": "showDetails"
    },
    
    render: function () {
      //The object we will pass to markup that will be used to generate the HTML.
      var context = { "listitems": this.model.getMarkupData() };

      //The SDK automatically parses any templates you associate with this view on the bc.templates object.
      var markupTemplate = bc.templates["first-page-tmpl"];

      //The generated HTML for this template.
      var html = Mark.up( markupTemplate, context );
      
      this.$el.append( html );
      
      return this;
    },
    
    showDetails: function( evt ) {
      App.navigate( "article/1", { trigger: true } );
      //bc.ui.forwardPage( $( "#pagetwo" ), { transitionTime: 300 } );
    }
    
  });
  
  
  
  ArticleView = Backbone.View.extend({
    
    el: '#pagetwo',
    
    events: {
      "click .back-button": "handleBack"
    },
    
    render: function () {
      
      var context = { "text": this.model.get( "description" ) };
      
      var markupTemplate = bc.templates["second-page-tmpl"];
      
      var html = Mark.up( markupTemplate, context );
      
      this.$el.append( html );
      
      return this;
    },
    
    handleBack: function( evt ) {
      _$bc.one( "pageshow", $.proxy( function() {
        this.$el.empty();
        App.navigate( "", { trigger: this.options.deepLinked } );
      }, this ) );
      bc.ui.backPage();
    }
    
  });
  
  
  
  // Router
  AppRouter = Backbone.Router.extend({

      routes: {
          "":"list",
          "article/:id":"details"
      },

      list: function () {
        this.articleListView = new ArticleListView( { model:this.articles } );
      },

      details: function (id) {
        this.currentArticle = id;
        this.showDetails();
      },
      
      showDetails: function () {
        var deepLinked = ( this.articleListView === undefined );
        var transitionTime = ( deepLinked ) ? 1 : 300;
        
        this.detailsView = new ArticleView( { model: this.articles.at( this.currentArticle ), deepLinked: deepLinked } );
        
        //Happy for better suggestions here.
        this.views++;
        $( "body" ).append( this.detailsView.render().el );
        bc.ui.forwardPage( $( "#pagetwo" ), { transitionTime: transitionTime } );
      }
  
  });

  /*
   * The Brightcove SDK will fire an "init" event after the document is ready, the device is ready to be interacted with and any
   * locale or markup files have been loaded and populated on the bc.templates object.
   */
  $( bc ).bind( "init", initialize );
  
  function initialize() {
    App = new AppRouter();
    App.articles = new ArticleCollection();
    App.articles.fetch();
    Backbone.history.start();
  }
  
})( jQuery )