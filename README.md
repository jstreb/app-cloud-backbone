Overview
=================

Backbone.js is a very popular MVC JavaScript framework where as the App Cloud JavaScript SDK is library focused on making it easier to create mobile applications within the App Cloud ecosystem.  For this reason backbone.js and App Cloud our a natural fit; thus the appcloud-backbone repo was born.

AppCloudCollection.js
=================

Within the lib directory you will find the AppCloudCollection.js file.  This is the collection file that should be extended if you wish to interface with the App Cloud servers.  Below our the features and options for this class.

* Overrides backbone's sync read function to use the SDK's bc.core.getData function to fetch the correct data for the given view.
* Be default it will cache the data, so that it will still work when the app is offline.
* Automatically refreshes the data when the view gains focus if the data is stale.

Options that can be overwritten

* contentFeed - The ID of the content or connector feed from the App Cloud studio.  This can be the ID or the name of the feed if specify the data configs in the manifest.json file.
* useCache - By default the returned data will be cached for offline use.  However, if your collection sets useCahe to false we will not cache the results.
* timeBetweenRefresh - The time interval between checks to the server for new data.  This value should be represented in milliseconds.  By default this is 15min, but can be overwritten by setting the timeBetweenRefresh value on your collection.

Below is small example of a new collection that extends the AppCloudCollection and overrides the timeBetweenRefresh value along with specifying a contentFeed.

    ArticleCollection = AppCloudCollection.extend({
      
      model:Article,
      
      contentFeed: "4f3d8592b3d99278ed015beb",
      
      timeBetweenRefresh: 1800000 //30 min.
      
    });

Example
=================

In the example directory you will find a working App Cloud template that uses AppCloudCollection.js to manage the fetching of data along with plays nice with the backbone's routing and App Cloud bc.ui functions `bc.ui.forwardPage` and `bc.ui.backPage`.  This template is a replica of the template that is generated by the App Cloud scaffolding script, but in the view1.js file you will see that it uses backbone to structure the code.  Unlike the template that is generated by the App Cloud scaffold script a view can also be deep linked.