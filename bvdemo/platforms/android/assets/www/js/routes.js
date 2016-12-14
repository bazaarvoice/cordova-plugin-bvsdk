angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js


  $ionicConfigProvider.tabs.position('bottom');

  $stateProvider
//        .state('menu.bazaarvoice', {
//    url: '/page3',
//    views: {
//        'side-menu21': {
//            templateUrl: 'templates/bazaarvoice.html',
//            controller: 'bazaarvoiceCtrl'
//        }
//    }
//
//  })
//        .state('menu.conversations', {
//      url: '/page2',
//      views: {
//        'side-menu21': {
//          templateUrl: 'templates/conversations.html',
//          controller: 'conversationsCtrl'
//        }
//      }
//    })
//
//
//    .state('menu.homepage', {
//          url: '/page1',
//          views: {
//            'side-menu21': {
//              templateUrl: 'templates/homepage.html',
//              controller: 'homepageCtrl'
//            }
//          }
//    })
//
//      .state('menu', {
//        url: '/side-menu21',
//        templateUrl: 'templates/menu.html',
//        controller: 'menuCtrl'
//      })

      // setup an abstract state for the tabs directive
      .state('tab', {
        url: "/tab",
        abstract: true,
        templateUrl: "templates/tabs.html"
      })

      // Each tab has its own nav history stack:

      .state('tab.bazaarvoice', {
        url: '/bazaarvoice',
        views: {
          'tab-bazaarvoice': {
            templateUrl: 'templates/bazaarvoice.html',
            controller: 'bazaarvoiceCtrl'
          }
        }
      })

      // Conversations
      .state('tab.conversations', {
              url: '/conversations',
              abstract: true,
              views: {
                'tab-conversations': {
                  templateUrl: 'templates/Conversations/conversations.html',
                  controller: 'conversationsCtrl'

                }
              }
      })
      .state('tab.conversations.bulkReviewsConversations', {
            url: '/bulkReviewsConversations',
            views: {
              'conversations-page': {
                templateUrl: 'templates/Conversations/bulkReviewsConversations.html',
                controller: 'bulkReviewsConversationsCtrl',


              }
            }
    })
      .state('tab.conversations.productStatsConversations', {
              url: '/productStatsConversations',
              views: {
                'conversations-page': {
                  templateUrl: 'templates/Conversations/productStatsConversations.html',
                  controller: 'productStatsConversationsCtrl',


                }
              }
      })
      .state('tab.conversations.reviewsConversations', {
                url: '/reviewsConversations',
                views: {
                  'conversations-page': {
                    templateUrl: 'templates/Conversations/reviewsConversations.html',
                    controller: 'reviewsConversationsCtrl',


                  }
                }
        })
      .state('tab.conversations.questionAndAnswersConversations', {
                url: '/questionAndAnswersConversations',
                views: {
                  'conversations-page': {
                    templateUrl: 'templates/Conversations/questionAndAnswersConversations.html',
                    controller: 'questionAndAnswersConversationsCtrl',
                  }
                }
        })

      // Home Page
      .state('tab.homepage', {
                url: '/homepage',
                views: {
                  'tab-homepage': {
                    templateUrl: 'templates/homepage.html',
                    controller: 'homepageCtrl'
                  }
                }
        })



$urlRouterProvider.otherwise('/tab/homepage')

  

});