package com.example.plugin;

import android.app.Application;
import android.app.IntentService;
import android.util.Log;

import com.bazaarvoice.bvandroidsdk.BVConversationsClient;
import com.bazaarvoice.bvandroidsdk.BVLogLevel;
import com.bazaarvoice.bvandroidsdk.BVProduct;
import com.bazaarvoice.bvandroidsdk.BVRecommendations;
import com.bazaarvoice.bvandroidsdk.BVSDK;
import com.bazaarvoice.bvandroidsdk.BazaarEnvironment;
import com.bazaarvoice.bvandroidsdk.BazaarException;
import com.bazaarvoice.bvandroidsdk.BulkRatingOptions;
import com.bazaarvoice.bvandroidsdk.BulkRatingsRequest;
import com.bazaarvoice.bvandroidsdk.BulkRatingsResponse;
import com.bazaarvoice.bvandroidsdk.ConversationsCallback;
import com.bazaarvoice.bvandroidsdk.CurationsFeedRequest;
import com.bazaarvoice.bvandroidsdk.PDPContentType;
import com.bazaarvoice.bvandroidsdk.Product;
import com.bazaarvoice.bvandroidsdk.ProductDisplayPageRequest;
import com.bazaarvoice.bvandroidsdk.ProductDisplayPageResponse;
import com.bazaarvoice.bvandroidsdk.ProductStatistics;
import com.bazaarvoice.bvandroidsdk.QuestionAndAnswerRequest;
import com.bazaarvoice.bvandroidsdk.QuestionAndAnswerResponse;
import com.bazaarvoice.bvandroidsdk.RatingDistribution;
import com.bazaarvoice.bvandroidsdk.RecommendationsRequest;
import com.bazaarvoice.bvandroidsdk.ReviewOptions;
import com.bazaarvoice.bvandroidsdk.ReviewStatistics;
import com.bazaarvoice.bvandroidsdk.ReviewsRequest;
import com.bazaarvoice.bvandroidsdk.SortOrder;
import com.bazaarvoice.bvandroidsdk.Statistics;
import com.google.gson.Gson;

import org.apache.cordova.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.R.id.message;
import static android.content.ContentValues.TAG;
import static org.slf4j.MDC.put;


public class BVInterface extends CordovaPlugin {
    BVRecommendations.BVRecommendationsCallback callback;
    
    @Override
    public boolean execute(String action, JSONArray data, final CallbackContext callbackContext) throws JSONException {
        
        if (action.equals("bvsdksetup")) {
            Application applicationApp = cordova.getActivity().getApplication();
            // Builder used to initialize the Bazaarvoice SDKs
            String client = data.getString(0);
            String recommendations_key = data.getString(1);
            String conversations_key = data.getString(2);
            BVSDK bvsdk = new BVSDK.Builder(applicationApp, client) // your client name, e.g. 'bazaarvoice'
            .bazaarEnvironment(BazaarEnvironment.PRODUCTION) //Either staging or production. Use corresponding API key
            .apiKeyShopperAdvertising(recommendations_key) //Required for Ads
            .apiKeyConversations(conversations_key)
            .logLevel(BVLogLevel.VERBOSE)
            .build();
            
            callbackContext.success(client);
            return true;
            
        } else if (action.equals("getRecommendation")) {
            
            BVRecommendations recs = new BVRecommendations();
            int limit = data.getInt(0);
            RecommendationsRequest request = new RecommendationsRequest.Builder(limit).build();
            
            callback = new BVRecommendations.BVRecommendationsCallback() {
                @Override
                public void onSuccess(List<BVProduct> recommendedProducts) {
                    String bvjson = new Gson().toJson(recommendedProducts);
                    callbackContext.success(bvjson);
                }
                @Override
                public void onFailure(Throwable throwable) {
                    callbackContext.error("failed");
                }
            };
            recs.getRecommendedProducts(request, callback);
            
            return true;
            
        } else if (action.equals("getConversations")){
            String productId = data.getString(0);
            int limit = data.getInt(1);
            int offset = data.getInt(2);
            
            
            QuestionAndAnswerRequest request = new QuestionAndAnswerRequest.Builder(productId,limit,offset).build();
            
            BVConversationsClient client = new BVConversationsClient();
            
            try {
                
                String bvjson = new Gson().toJson(client.prepareCall(request).loadSync().getResults());
                String totalResultsNumber = Integer.toString(client.prepareCall(request).loadSync().getTotalResults());
                String overallMessage [] = {bvjson, totalResultsNumber};
                JSONArray mJSONArray = new JSONArray(Arrays.asList(overallMessage));
                callbackContext.success(mJSONArray);
                
            } catch (BazaarException e) {
                e.printStackTrace();
                callbackContext.error("failed");
            }
            
            return true;
            
        } else if (action.equals("getReviewsConversations")){
            String productId = data.getString(0);
            int limit = data.getInt(1);
            int offset = data.getInt(2);
            
            ReviewsRequest request = new ReviewsRequest.Builder(productId,limit,offset).build();
            BVConversationsClient client = new BVConversationsClient();
            
            try {
                
                String bvjson = new Gson().toJson(client.prepareCall(request).loadSync().getResults());
                String totalResultsNumber = Integer.toString(client.prepareCall(request).loadSync().getTotalResults());
                String overallMessage [] = {bvjson, totalResultsNumber};
                JSONArray mJSONArray = new JSONArray(Arrays.asList(overallMessage));
                callbackContext.success(mJSONArray);
                
            } catch (BazaarException e) {
                e.printStackTrace();
                callbackContext.error("failed");
            }
            
            return true;
        } else if (action.equals("getProductStatsConversations")){
            
            String productId = data.getString(0);
            int reviewLimit = data.getInt(1);
            int questionLimit = data.getInt(2);
            
            ProductDisplayPageRequest request = new ProductDisplayPageRequest.Builder(productId)
            .addIncludeStatistics(PDPContentType.Reviews)
            .addIncludeStatistics(PDPContentType.Questions)
            .addIncludeContent(PDPContentType.Reviews, reviewLimit)
            .addIncludeContent(PDPContentType.Questions, questionLimit)
            .build();
            
            BVConversationsClient client = new BVConversationsClient();
            
            try {
                
                ArrayList<String> productStats = new ArrayList<String>();
                ProductDisplayPageResponse response = client.prepareCall(request).loadSync();
                for (Product reviewStatistics: response.getResults()) {
                    double recommendedCountNumber = reviewStatistics.getReviewStatistics().getRecommendedCount();
                    double totalCountNumber = reviewStatistics.getReviewStatistics().getTotalReviewCount();
                    double percentRecommended = recommendedCountNumber/totalCountNumber*100.0;
                    int b = (int) percentRecommended;
                    double average = Math.round(reviewStatistics.getReviewStatistics().getAverageOverallRating()*10.0)/10.0;
                    productStats.add(Double.toString(average));
                    productStats.add(reviewStatistics.getReviewStatistics().getTotalReviewCount().toString());
                    productStats.add(reviewStatistics.getQaStatistics().getTotalQuestionCount().toString());
                    productStats.add(reviewStatistics.getQaStatistics().getTotalAnswerCount().toString());
                    productStats.add(reviewStatistics.getName());
                    productStats.add(reviewStatistics.getImageUrl());
                    productStats.add(reviewStatistics.getReviewStatistics().getRecommendedCount().toString());
                    productStats.add(Integer.toString(b));
                    productStats.add(reviewStatistics.getReviewStatistics().getRatingDistribution().getOneStarCount().toString());
                    productStats.add(reviewStatistics.getReviewStatistics().getRatingDistribution().getTwoStarCount().toString());
                    productStats.add(reviewStatistics.getReviewStatistics().getRatingDistribution().getThreeStarCount0().toString());
                    productStats.add(reviewStatistics.getReviewStatistics().getRatingDistribution().getFourStarCount0().toString());
                    productStats.add(reviewStatistics.getReviewStatistics().getRatingDistribution().getFiveStarCount().toString());
                    
                }
                
                JSONArray bvjson = new JSONArray(productStats);
                callbackContext.success(bvjson);
                
            } catch (BazaarException e) {
                e.printStackTrace();
                callbackContext.error("failed");
            }
            
            return true;
        } else if (action.equals("getBulkRatingsConversations")){
            JSONArray ratingsData = data.getJSONArray(0);
            List<String> productIds = new ArrayList<String>();
            
            for(int i =0; i < ratingsData.length(); i++){
                productIds.add(ratingsData.get(i).toString());
            }
            
            BulkRatingsRequest request = new BulkRatingsRequest.Builder(productIds, BulkRatingOptions.StatsType.All).build();
            
            BVConversationsClient client = new BVConversationsClient();
            
            try {
                
                BulkRatingsResponse response = client.prepareCall(request).loadSync();
                
                ArrayList productId = new ArrayList();
                ArrayList averageOverallRating = new ArrayList();
                ArrayList totalReviewCount = new ArrayList();
                for (Statistics stats : response.getResults()) {
                    ProductStatistics productStats = stats.getProductStatistics();
                    if (productStats != null) {
                        productId.add(productStats.getProductId());
                        ReviewStatistics reviewStats = productStats.getReviewStatistics();
                        if (reviewStats != null) {
                            averageOverallRating.add(Float.toString(reviewStats.getAverageOverallRating()));
                            totalReviewCount.add(Float.toString(reviewStats.getTotalReviewCount()));
                        }
                    }
                }
                
                List<JSONObject> myJSONObjects = new  ArrayList<JSONObject> (productId.size());
                
                for(int i=0; i<productId.size(); i++) {
                    JSONObject obj = new JSONObject();
                    obj.put("ProductId", productId.get(i) );
                    obj.put("AverageOverallRating", averageOverallRating.get(i));
                    obj.put("TotalReviewCount", totalReviewCount.get(i));
                    myJSONObjects.add(obj);
                    
                }
                
                callbackContext.success(myJSONObjects.toString());
                
            } catch (BazaarException e) {
                e.printStackTrace();
                callbackContext.error("failed");
            }
            
            return true;
        }
        else {
            return false;
        }
    }
}
