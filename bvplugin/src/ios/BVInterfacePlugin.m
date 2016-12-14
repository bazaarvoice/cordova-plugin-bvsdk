//
//  BVInterfacePlugin.m
//  BVInterface
//
//  Created by Tanvir Pathan on 10/12/16.
//
//

#import "BVInterfacePlugin.h"
#import <BVSDK/BVSDK.h>

@implementation BVInterfacePlugin

- (void)bvsdksetup:(CDVInvokedUrlCommand *)command{
    
    NSString* client = [[command arguments] objectAtIndex:0];
    NSString* recommendations_key = [[command arguments] objectAtIndex:1];
    NSString* conversations_key = [[command arguments] objectAtIndex:2];
    NSString* isStaging = [[command arguments] objectAtIndex:3];
    
    
    [[BVSDKManager sharedManager] setClientId:client];
    [[BVSDKManager sharedManager] setApiKeyShopperAdvertising:recommendations_key];
    [[BVSDKManager sharedManager] setApiKeyConversations:conversations_key];
    [[BVSDKManager sharedManager] setStaging:[isStaging boolValue]];  // Set to NO for production!
    [[BVSDKManager sharedManager] setLogLevel:BVLogLevelInfo];
    
    [[BVLogger sharedLogger] info:@"BVSDK manager initialized"];
    
    CDVPluginResult* result = [CDVPluginResult
                               resultWithStatus:CDVCommandStatus_OK
                               messageAsString:@"BVSDK has been built successfully."];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    
}
- (void)getRecommendations:(CDVInvokedUrlCommand *)command
{
    
    BVRecommendationsLoader* loader = [[BVRecommendationsLoader alloc] init];
    
    NSInteger limit = [command.arguments[0] integerValue];
    
    [[BVShopperProfileRequestCache sharedCache] removeAllCachedResponses];
    
    BVRecommendationsRequest *request = [[BVRecommendationsRequest alloc] initWithLimit:limit];
    
    
    [loader loadRequest:request completionHandler:^(NSArray<BVRecommendedProduct *> * proudcts) {
        NSMutableArray *serializedObjects = [NSMutableArray arrayWithCapacity:proudcts.count];
        
        for (BVRecommendedProduct *product in proudcts){
            NSDictionary *tmp = [self dictionaryFromBVRecommendedProduct:product];
            [serializedObjects addObject:tmp];
        }
        
        NSError *writeError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:serializedObjects options:NSJSONWritingPrettyPrinted error:&writeError];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        NSString* message = [NSString stringWithFormat: @"%@", jsonString];
        
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:message];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    } errorHandler:^(NSError * error) {
        NSLog(@"ERROR: %@", error.localizedDescription);
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsString:error.localizedDescription];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
}
- (void)getQuestionsAndAnswersConversations:(CDVInvokedUrlCommand *)command{
    
    NSString* productId = [[command arguments] objectAtIndex:0];
    int limit = [command.arguments[1] shortValue];
    int offsets = [command.arguments[2] shortValue];
    
    
    BVQuestionsAndAnswersRequest* request = [[BVQuestionsAndAnswersRequest alloc] initWithProductId:productId limit:limit offset:offsets];
    
    [request load:^(BVQuestionsAndAnswersResponse * _Nonnull response) {
        
        NSArray *qa = response.results;
        NSMutableArray *serializedObjects = [NSMutableArray arrayWithCapacity:qa.count];
        
        for (BVQuestion *response in qa){
            NSDictionary *tmp = [self dictionaryFromBVQuestionsAndAnswers:response];
            
            [serializedObjects addObject:tmp];
        }
        
        NSError *writeError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:serializedObjects options:NSJSONWritingPrettyPrinted error:&writeError];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        
        NSLog(@"JSON Output: %@", jsonString);
        
        NSString *totalQuestions = [response.totalResults stringValue];
        
        NSString* message = [NSString stringWithFormat: @"%@", jsonString];
        NSArray *overallQuestionMessage = @[message, totalQuestions];
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_OK
                                   messageAsArray:overallQuestionMessage];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
        
    } failure:^(NSArray * _Nonnull errors) {
        // handle failure appropriately
        NSLog(@"ERROR: %@", errors.description);
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsString:errors.description];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
}


- (void)getReviewsConversations:(CDVInvokedUrlCommand *)command{
    
    
    NSString* productId = [[command arguments] objectAtIndex:0];
    int limit = [command.arguments[1] shortValue];
    int offsets = [command.arguments[2] shortValue];
    
    BVReviewsRequest* request = [[BVReviewsRequest alloc] initWithProductId:productId limit:limit offset:offsets];
    
    [request load:^(BVReviewsResponse * _Nonnull response) {
        
        NSArray *reviews = response.results;
        NSMutableArray *serializedObjects = [NSMutableArray arrayWithCapacity:reviews.count];
        
        for (BVReview *response in reviews){
            NSDictionary *tmp = [self dictionaryFromBVReviewsConversations:response];
            [serializedObjects addObject:tmp];
        }
        
        
        NSError *writeError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:serializedObjects options:NSJSONWritingPrettyPrinted error:&writeError];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        NSString *totalReviews = [response.totalResults stringValue];
        
        NSString* message = [NSString stringWithFormat: @"%@", jsonString];
        
        NSArray *overallReviewsMessage = @[message, totalReviews];
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_OK
                                   messageAsArray:overallReviewsMessage];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
        
    } failure:^(NSArray * _Nonnull errors) {
        // handle failure appropriately
        NSLog(@"ERROR: %@", errors.description);
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsString:errors.description];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
}
- (void)getBulkRatingsConversations:(CDVInvokedUrlCommand *)command{
    
    NSArray<NSString*>* productIds = [[command arguments] objectAtIndex:0];
    
    BVBulkRatingsRequest* request = [[BVBulkRatingsRequest alloc] initWithProductIds:productIds statistics:BulkRatingsStatsTypeAll];
    
    [request load:^(BVBulkRatingsResponse * _Nonnull response) {
        
        NSArray *bulkratings = response.results;
        
        NSMutableArray *serializedObjects = [NSMutableArray arrayWithCapacity:bulkratings.count];
        
        for (BVProductStatistics *response in bulkratings){
            NSDictionary *tmp = [self dictionaryFromBVBulkRatingsConversations:response];
            [serializedObjects addObject:tmp];
        }
        
        
        NSError *writeError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:serializedObjects options:NSJSONWritingPrettyPrinted error:&writeError];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        NSString* message = [NSString stringWithFormat: @"%@", jsonString];
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:message];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
        
    } failure:^(NSArray * _Nonnull errors) {
        // handle failure appropriately
        NSLog(@"Error loading questions");
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsString:errors.description];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
}

- (void)getProductStatsConversations:(CDVInvokedUrlCommand *)command{
    
    
    NSString* productId = [[command arguments] objectAtIndex:0];
//    NSInteger reviewLimit = [command.arguments[1] integerValue];
//    NSInteger questionLimit = [command.arguments[2] integerValue];
    
    BVProductDisplayPageRequest* request = [[BVProductDisplayPageRequest alloc] initWithProductId:productId];
//    [request includeContent:PDPContentTypeReviews limit:reviewLimit];
//    [request includeContent:PDPContentTypeQuestions limit:questionLimit];
    [request includeStatistics:PDPContentTypeReviews];
    [request includeStatistics:PDPContentTypeQuestions];
    [request load:^(BVProductsResponse * _Nonnull response) {
        
        BVProduct *product = response.result;
        NSMutableArray *serializedObjects = [NSMutableArray arrayWithCapacity:13];
        if(product){
            NSString *percentRecommended = [NSString stringWithFormat:@"%.0f", [product.reviewStatistics.recommendedCount doubleValue]/[product.reviewStatistics.totalReviewCount doubleValue]*100];
            [serializedObjects addObject:[NSString stringWithFormat:@"%.1f", [product.reviewStatistics.averageOverallRating doubleValue]]];
            [serializedObjects addObject:[product.reviewStatistics.totalReviewCount stringValue]];
            [serializedObjects addObject:[product.qaStatistics.totalQuestionCount stringValue]];
            [serializedObjects addObject:[product.qaStatistics.totalAnswerCount stringValue]];
            [serializedObjects addObject:product.name];
            [serializedObjects addObject:product.imageUrl];
            [serializedObjects addObject:[product.reviewStatistics.recommendedCount stringValue]];
            [serializedObjects addObject:percentRecommended];
            
            if (product.reviewStatistics.ratingDistribution.oneStarCount != nil){
                [serializedObjects addObject:[product.reviewStatistics.ratingDistribution.oneStarCount stringValue]];
            } else {
                [serializedObjects addObject:@"0"];
            }
            if (product.reviewStatistics.ratingDistribution.twoStarCount != nil){
                [serializedObjects addObject:[product.reviewStatistics.ratingDistribution.twoStarCount stringValue]];
            } else {
                [serializedObjects addObject:@"0"];
            }
            if (product.reviewStatistics.ratingDistribution.threeStarCount != nil){
                [serializedObjects addObject:[product.reviewStatistics.ratingDistribution.threeStarCount stringValue]];
            } else {
                [serializedObjects addObject:@"0"];
            }
            if (product.reviewStatistics.ratingDistribution.fourStarCount != nil){
                [serializedObjects addObject:[product.reviewStatistics.ratingDistribution.fourStarCount stringValue]];
            } else {
                [serializedObjects addObject:@"0"];
            }
            if (product.reviewStatistics.ratingDistribution.fiveStarCount != nil){
                [serializedObjects addObject:[product.reviewStatistics.ratingDistribution.fiveStarCount stringValue]];
            } else {
                [serializedObjects addObject:@"0"];
            }
            
            
        }
        
        
        NSError *writeError = nil;
        NSData *jsonData = [NSJSONSerialization dataWithJSONObject:serializedObjects options:NSJSONWritingPrettyPrinted error:&writeError];
        NSString *jsonString = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
        
        
        NSString* message = [NSString stringWithFormat: @"%@", jsonString];
        
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_OK
                                   messageAsString:message];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
        
        
    } failure:^(NSArray * _Nonnull errors) {
        // handle failure appropriately
        NSLog(@"Error loading questions");
        CDVPluginResult* result = [CDVPluginResult
                                   resultWithStatus:CDVCommandStatus_ERROR
                                   messageAsString:errors.description];
        [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
    }];
    
}


- (NSDictionary *)dictionaryFromBVRecommendedProduct:(BVRecommendedProduct *)product{
    
    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:
                          product.productName, @"name",
                          product.averageRating == nil ? @"0": product.averageRating, @"avg_rating",
                          product.numReviews == nil ? @"0": product.numReviews, @"num_reviews",
                          product.imageURL, @"image_url",
                          
                          
                          nil];
    return dict;
}

- (NSDictionary *)dictionaryFromBVQuestionsAndAnswers:(BVQuestion *)response{
    
    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:
                          response.userNickname == nil ? @"": response.userNickname, @"UserNickname",
                          [self getUTCFormatDate:response.submissionTime], @"SubmissionTime",
                          response.questionSummary, @"QuestionSummary",
                          response.totalAnswerCount, @"TotalAnswerCount",
                          [self getAnswerTexts:response.answers] == nil ? @"": [self getAnswerTexts:response.answers], @"AnswerText",
                          [self getAnswerUsername:response.answers] == nil ? @"": [self getAnswerUsername:response.answers], @"UserName",
                          
                          nil];
    return dict;
}

- (NSDictionary *)dictionaryFromBVReviewsConversations:(BVReview *)response{
    
    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:
                          response.userNickname, @"UserNickname",
                          
                          [self getUTCFormatDate:response.submissionTime], @"SubmissionTime",
                          response.title, @"Title",
                          [NSNumber numberWithInt:response.rating], @"Rating",
                          response.reviewText, @"ReviewText",
                          
                          nil];
    return dict;
}
- (NSDictionary *)dictionaryFromBVBulkRatingsConversations:(BVProductStatistics *)response{
    
    NSDictionary *dict = [NSDictionary dictionaryWithObjectsAndKeys:
                          response.reviewStatistics.averageOverallRating, @"AverageOverallRating",
                          response.reviewStatistics.totalReviewCount, @"TotalReviewCount",
                          response.productId, @"ProductId",
                          nil];
    return dict;
}

-(NSString *)getUTCFormatDate:(NSDate *)localDate
{
    NSDateFormatter *dateFormatter = [[NSDateFormatter alloc] init];
    NSTimeZone *timeZone = [NSTimeZone timeZoneWithName:@"UTC"];
    [dateFormatter setTimeZone:timeZone];
    [dateFormatter setDateFormat:@"yyyy-MM-dd HH:mm:ss"];
    NSString *dateString = [dateFormatter stringFromDate:localDate];
    
    return dateString;
}

-(NSArray *)getAnswerTexts:(nonnull NSArray<BVAnswer *> *)answers {
    
    NSMutableArray *answersArray = [[NSMutableArray alloc] init];
    
    for(BVAnswer *answer in answers){
        [answersArray addObject:answer.answerText != nil ? answer.answerText : @""];
    }
    
    return answersArray;
}

-(NSArray *)getAnswerUsername:(nonnull NSArray<BVAnswer *> *)answers {
    
    NSMutableArray *answersArray = [[NSMutableArray alloc] init];
    
    for(BVAnswer *answer in answers){
        [answersArray addObject:answer.userNickname != nil ? answer.userNickname : @""];
    }
    
    return answersArray;
}



@end

