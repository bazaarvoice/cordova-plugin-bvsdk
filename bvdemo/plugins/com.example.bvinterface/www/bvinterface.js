/*global cordova, module*/

//BVSDK setup
    exports.bvsdksetup = function (client, recommendations_key, conversations_key, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "BVInterface", "bvsdksetup", [client, recommendations_key, conversations_key]);
};
//Get Recommendations
    exports.getRecommendation = function (limit, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "BVInterface", "getRecommendation", [limit]);
};
//Get Conversations
    exports.getConversations = function (productId, limit, offset, successCallback, errorCallback) {
        cordova.exec(successCallback, errorCallback, "BVInterface", "getConversations", [productId, limit, offset]);

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
exports.getProductStatsConversations = function (productId, reviewLimit, questionLimit, successCallback, errorCallback) {
    cordova.exec(successCallback, errorCallback, "BVInterface", "getProductStatsConversations", [productId, reviewLimit, questionLimit]);

};

