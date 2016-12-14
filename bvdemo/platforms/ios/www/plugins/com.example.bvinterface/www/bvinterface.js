cordova.define("com.example.bvinterface.bvinterface", function(require, exports, module) {
/*global cordova, module*/

//BVSDK setup
exports.bvsdksetup = function (client, recommendations_key, conversations_key, isStaging, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "bvsdksetup", [client, recommendations_key, conversations_key, isStaging]);
};
//Get Recommendations
exports.getRecommendations = function (limit, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getRecommendations", [limit]);
};
//Get Conversations
exports.getQuestionsAndAnswersConversations = function (productId, limit, offset, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getQuestionsAndAnswersConversations", [productId, limit, offset]);
        
};
//Get ReviewsConversations
exports.getReviewsConversations = function (productId, limit, offset, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getReviewsConversations", [productId, limit, offset]);
    
};
//Get BulkRatingsConversations
exports.getBulkRatingsConversations = function (productId, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getBulkRatingsConversations", [productId]);
    
};
//Get ProductStatsConversations
exports.getProductStatsConversations = function (productId, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getProductStatsConversations", [productId]);
    
};
});
