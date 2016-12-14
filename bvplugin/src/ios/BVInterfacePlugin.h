//
//  BVInterfacePlugin.h
//  BVInterface
//
//  Created by Tanvir Pathan on 10/12/16.
//
//


#import <Cordova/CDV.h>

@interface BVInterfacePlugin : CDVPlugin

- (void) bvsdksetup:(CDVInvokedUrlCommand*)command;
- (void) getRecommendations:(CDVInvokedUrlCommand*)command;
- (void) getQuestionsAndAnswersConversations:(CDVInvokedUrlCommand*)command;
- (void) getReviewsConversations:(CDVInvokedUrlCommand*)command;
- (void) getBulkRatingsConversations:(CDVInvokedUrlCommand*)command;
- (void) getProductStatsConversations:(CDVInvokedUrlCommand*)command;

@end
