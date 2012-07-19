/**
 * The AppCloudCollection extends the Backbone Collection object to provide hooks into
 * App Cloud core libraries.  Specifically it overrides the sync read method to use App Cloud's
 * 
 */
var AppCloudCollection = Backbone.Collection.extend({
  
  //By default we will cache the results in local storage.  The next request will return these results, but 
  //continue to make requests to the server to check for new data.
  useCache: true,
  
  //Each time the viewfocus event we will check to see if we should check the server for new data if that 
  //amount of time has passed since the last check. 
  timeBetweenRefresh: 900000, //15 min. in milliseconds
  
  //Keeps track of the last time we made a request to the server.
  lastSync: null,
  
  //This is to be overriden when extended.  This should be the ID from the app cloud studio.  This can be a
  //content feed or connector feed ID.
  contentFeed: undefined,
  
  initialize: function() {
    //bind out to the viewfocus event so that we can check to see if we need to get new data.
    $( bc ).bind( "viewfocus",  $.proxy( this.checkForRefresh, this ) );
  },
  
  checkForRefresh: function() {
    var now = new Date().getTime();
    if( this.lastSync && ( now - this.lastSync > this.timeBetweenRefresh ) ) {
      this.fetch();
    }
  },
  
  //Override the sync function so that any read requests go to the app cloud studio.
  sync: function( method, model, options ) {
    var data,
        self = this;
    
    if( method === "read" ) {
      
      //Check the cache to see if there is existing data.
      if( this.useCache ) {
        data = bc.core.cache( this.contentFeed + "_data" );
        if( data ) {
          options.success( data );
        }    
      }
      
      //Kick off a request to get data.
      bc.core.getData( 
        this.contentFeed, 
        function( data ) {
          self.success( data, options );
        },
        function(){
          self.error( options );
        }
      );
      
    } else {
      //For anything other then the read call we should pass through to Backbone's default sync call.
      Backbone.sync.call( this, method, model, options );
    }
  },
  
  //The ajax response from the server.
  success: function( data, options ) {
    this.lastSync = new Date().getTime();
    if( this.useCache ) {
      if( options === undefined || options.success === undefined || bc.utils.isEqual( data, bc.core.cache( this.contentFeed + "_data" ) ) ) {
        //Do nothing since the data is the same.
        return;
      } else {
        bc.core.cache( this.contentFeed + "_data", data );
        options.success( data );
      }
    } else {
      
      if( options !== undefined && typeof options.success === "function" ) {
        options.success( data );
      }
      
    }
  },
  
  error: function() {
    //For now this is a noop.
  }
  

});