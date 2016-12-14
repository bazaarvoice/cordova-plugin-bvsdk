/*global cordova, module*/
               
/* BVSDK setup - You must call bvsdksetup before using any of the APIs
   @params:
     - client: your client id (the id you use to log into Bazaarovice)
     - recommendations_key - The product recommendations API key. Use empty string if none.
     - conversations_key - The Conversations key for Ratings & Reviews.
     - isStaging - Depending on where the API key is supposed to be used, set to true for staing, false for production.
     - successCallback - Your definition where to send a succssful response
     - errorCallback - Your definition where to send a failure response
*/
exports.bvsdksetup = function (client, recommendations_key, conversations_key, isStaging, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "bvsdksetup", [client, recommendations_key, conversations_key, isStaging]);
};

/* Get product recommendations for this device profile.
    @params:
		  - limit, maximum number of products to return
      - successCallback - Your definition where to send a succssful response
     	- errorCallback - Your definition where to send a failure response
 */
exports.getRecommendations = function (limit, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getRecommendations", [limit]);
};


/* Fetch questions and answers for a given product ID. Use the limit and offset parameters to page data. */
exports.getQuestionsAndAnswersConversations = function (productId, limit, offset, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getQuestionsAndAnswersConversations", [productId, limit, offset]);
};

/* Fetch product reviews given a product ID. Use the limit and offset parameters to page data. */
exports.getReviewsConversations = function (productId, limit, offset, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getReviewsConversations", [productId, limit, offset]);
    
};

/* Given a an array of product IDs, fetch product review statistics for multiple products. */
exports.getBulkRatingsConversations = function (productIDArray, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getBulkRatingsConversations", [productIDArray]);
    
};

/* Given a product Id, fetch full product statistics for a given product. This is useful for displaying on a product page */
exports.getProductStatsConversations = function (productId, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getProductStatsConversations", [productId]);
    
};

