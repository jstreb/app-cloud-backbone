
//ability to turn cache off.

var AppCloudCollection = Backbone.Collection.extend({
  
  useCache: true,
  
  timeBetweenRefresh: 10000000000,//milliseconds
  
  lastSync: null,
  
  initialize: function() {
    $( bc ).bind( "viewfocus",  $.proxy( this.checkForRefresh, this ) );
  },
  
  checkForRefresh: function() {
    var now = new Date().getTime();
    if( this.lastSync && ( now - this.lastSync > this.timeBetweenRefresh ) ) {
      this.fetch();
    }
  },
  
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
      Backbone.sync.call( this, method, model, options );
    }
  },
  
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
    
  }
  

});