angular.module('app.controllers', ['ionic.rating', 'ionic', 'chart.js'])


.controller('bazaarvoiceCtrl', ['$scope', '$stateParams', '$state','$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicLoading) {


    $scope.show = function() {
        $ionicLoading.show({
           template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>',
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    //Recommendation button
    $scope.bvrecommendation = 'Get Recommendation';
    $scope.buttonDisable = false;

    //Recommendation Properties
    $scope.averageRatings = [];
    $scope.names = [];
    $scope.num_reviews = [];
    $scope.images = [];

    $scope.rating = {};
    $scope.rating.max = 5;


    //Get Recommendations
    function success(message2)
    {

        var obj = angular.fromJson(message2);

        obj.forEach(function(obj){

          $scope.averageRatings.push(obj.avg_rating);
          $scope.names.push(obj.name);
          $scope.num_reviews.push(obj.num_reviews);
          $scope.images.push(obj.image_url);


          $scope.bvrecommendation = 'Get More Recommendations';

        });
        $state.go($state.current, {}, { reload: true });
        $scope.hide($ionicLoading);
    }
    function failure(message2)
    {
        $scope.failMessage = "Error Message: " + message2.toString();
        $scope.hide($ionicLoading);

    }
    $scope.show($ionicLoading);

    var y = BVSDK.getRecommendations(10, success, failure);


}])

.controller('conversationsCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName


function ($scope, $stateParams, $state, $ionicLoading) {

}])

.controller('menuCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('homepageCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])

.controller('bulkReviewsConversationsCtrl', ['$scope', '$stateParams','$state', '$ionicLoading','$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicLoading, $window) {


    $scope.show = function() {
        $ionicLoading.show({
           template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>'
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.rating = {};
    $scope.rating.max = 5;
    $scope.show($ionicLoading);
    $scope.productID = [];
    $scope.averageOverallRatings = [];
    $scope.totalReviewCount = [];


    function success(message5)
    {

        var obj = angular.fromJson(message5);
        obj.forEach(function(obj){

            $scope.productID.push(obj.ProductId);
            $scope.totalReviewCount.push(obj.TotalReviewCount);
            $scope.averageOverallRatings.push(obj.AverageOverallRating);
            $state.go($state.current, {}, { reload: false });
            $scope.hide($ionicLoading);
        });

    }

    function failure(message5)
    {
         $scope.failMessage = "Error Message: " + message5.toString();
    }
    $window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/setupKeys.txt", gotFile, fail);

      function fail(e) {
          console.log("FileSystem Error");
          console.dir(e);
      }

      function gotFile(fileEntry) {

          fileEntry.file(function(file) {
              var ready = false;
              var check = function() {
                  if (ready === true) {
                         BVSDK.getBulkRatingsConversations(productIDArray,success, failure);
                      return;
                  }
                  setTimeout(check, 1000);
              }

              check();
              var reader = new FileReader();

              reader.onloadend = function(e) {
                  var setupKeys = angular.fromJson(this.result);
                  productIDArray = setupKeys.testProductIDArray;
                  ready = true;
              }

              reader.readAsText(file);

          });
      }


}])
.controller('productStatsConversationsCtrl', ['$scope', '$stateParams', '$state', '$ionicLoading', '$window',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
    // You can include any angular dependencies as parameters for this function
    // TIP: Access Route Parameters for your page via $stateParams.parameterName
    function($scope, $stateParams, $state, $ionicLoading, $window) {

        var didEnter = false;
        var number = 0;
        $scope.show = function() {
            $ionicLoading.show({
                template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>'
            });
        };

        $scope.hide = function() {
            $ionicLoading.hide();
        };

        $scope.rating = {};
        $scope.rating.max = 5;
        $scope.show($ionicLoading);
        $scope.labels = ['5', '4', '3', '2', '1'];
        $scope.colors = ['#00ab8e', '#00ab8e', '#00ab8e', '#00ab8e', '#00ab8e'];

        $scope.options = {

            backgroundColor: '#00ab8e',
//            animation: {
//                onProgress: drawBarValues,
//                onComplete: drawBarValues
//            },
            hover: {
                animationDuration: 0
            },
            scales: {
                xAxes: [{
                    display: false,
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    }
                }]
            },

        };
//
//        function drawBarValues() {
//            // render the value of the chart above the bar
//            var ctx = this.chart.ctx;
//
//            ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, 'bold', Chart.defaults.global.defaultFontFamily);
//            ctx.fillStyle = this.chart.config.options.defaultFontColor;
//            ctx.textAlign = 'left';
//            ctx.textBaseline = 'bottom';
//
//
//            this.data.datasets.forEach(function(dataset) {
//                for (var i = 0; i < dataset.data.length; i++) {
//                    if (dataset.hidden === true && dataset._meta[Object.keys(dataset._meta)[0]].hidden !== false) {
//                        continue;
//                    }
//                    var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
//                    var maxScale = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._xScale.maxWidth;
//                    console.log("Model X: " + model.x + ", Max Scale: " + maxScale);
//
//                    ctx.fillText(dataset.data[i], model.x + 6, model.y + 7);
//
//                }
//            });
//        }

        function success(message6) {
            var obj = angular.fromJson(message6);
            $scope.averageOverallRating = obj[0];
            $scope.totalReviewCount = obj[1];
            $scope.totalQuestionCount = obj[2];
            $scope.totalAnswerCount = obj[3];
            $scope.name = obj[4];
            $scope.image = obj[5];
            $scope.recommendedCount = obj[6];
            $scope.percentRecommended = obj[7];
            $scope.data = [obj[12], obj[11], obj[10], obj[9], obj[8]];


            $state.go($state.current, {}, {
                reload: false
            });
            $scope.hide($ionicLoading);
        }

        function failure(message6) {
            $scope.hide($ionicLoading);
            $scope.failMessage = "Error Message: " + message6.toString();
        }

      $window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/setupKeys.txt", gotFile, fail);

      function fail(e) {
          console.log("FileSystem Error");
          console.dir(e);
      }

      function gotFile(fileEntry) {

          fileEntry.file(function(file) {
              var ready = false;
              var check = function() {
                  if (ready === true) {
                      BVSDK.getProductStatsConversations(productID, success, failure);
                      return;
                  }
                  setTimeout(check, 1000);
              }

              check();
              var reader = new FileReader();

              reader.onloadend = function(e) {
                  var setupKeys = angular.fromJson(this.result);
                  productID = setupKeys.testProductID;
                  ready = true;
              }

              reader.readAsText(file);

          });
      }

    }
])
.controller('reviewsConversationsCtrl', ['$scope', '$stateParams','$state', '$ionicLoading','$window', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicLoading, $window) {

    var offset = 0;
    var shouldShowMore = true;

    $scope.loadMore = function() {

        if(shouldShowMore == true){

             offset = offset + 10;
             BVSDK.getReviewsConversations(productID,10, offset, success, failure);
             $scope.$broadcast('scroll.infiniteScrollComplete');
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }


    $scope.show = function() {
        $ionicLoading.show({
           template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>'
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.rating = {};
    $scope.rating.max = 5;
    $scope.show($ionicLoading);
    $scope.titles =[];
    $scope.reviewText = [];
    $scope.users = [];
    $scope.dates = [];
    $scope.userRating = [];

    function success(message4)
    {

        var obj = angular.fromJson(message4[0]);
        var totalResults = parseInt(message4[1]);

        obj.forEach(function(obj){

            $scope.titles.push(obj.Title);
            $scope.reviewText.push(obj.ReviewText);
            $scope.users.push(obj.UserNickname);
            $scope.dates.push(obj.SubmissionTime);
            $scope.userRating.push(obj.Rating);
            $state.go($state.current, {}, { reload: false });
            $scope.hide($ionicLoading);

            if ($scope.titles.length == totalResults){
                shouldShowMore = false;
            }
        });

    }

    function failure(message4)
    {
        $scope.hide($ionicLoading);
        shouldShowMore = false;
        $scope.failMessage = "Error Message: " + message4.toString();
    }

      $window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/setupKeys.txt", gotFile, fail);

      function fail(e) {
          console.log("FileSystem Error");
          console.dir(e);
      }

      function gotFile(fileEntry) {

          fileEntry.file(function(file) {
              var ready = false;
              var check = function() {
                  if (ready === true) {
                      BVSDK.getReviewsConversations(productID,10,0, success, failure);
                      return;
                  }
                  setTimeout(check, 1000);
              }

              check();
              var reader = new FileReader();

              reader.onloadend = function(e) {
                  var setupKeys = angular.fromJson(this.result);
                  productID = setupKeys.testProductID;
                  ready = true;
              }

              reader.readAsText(file);

          });
      }


}])
.controller('questionAndAnswersConversationsCtrl', ['$scope', '$stateParams','$state', '$ionicLoading', '$window',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $state, $ionicLoading, $window) {

    var offset = 0;
    var shouldShowMore = true;

    $scope.toggleGroup = function(questionSummary) {
    	if ($scope.isGroupShown(questionSummary)) {
    		$scope.shownGroup = null;
    	} else {
    		$scope.shownGroup = questionSummary;
    	}
    };

    $scope.isGroupShown = function(questionSummary) {
    	return $scope.shownGroup === questionSummary;
    };

    $scope.loadMore = function() {

        if(shouldShowMore == true){
            offset = offset + 10;
            BVSDK.getQuestionsAndAnswersConversations(productID,10, offset, success, failure);

        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    }

    $scope.show = function() {
        $ionicLoading.show({
           template: '<ion-spinner icon="ripple" class="spinner-positive"></ion-spinner>'
        });
    };

    $scope.hide = function(){
        $ionicLoading.hide();
    };

    $scope.show($ionicLoading);
    $scope.questionSummaries =[];
    $scope.questionDetails = [];
    $scope.users = [];
    $scope.dates = [];
    $scope.totalAnswers = [];
    $scope.answerTexts = [];


    function success(message3)
    {

        var totalResults = parseInt(message3[1]);
        var obj = angular.fromJson(message3[0]);
        obj.forEach(function(obj){

            $scope.innerAnswerTexts = [];
	        for ( var i =0; i < obj.AnswerText.length; i++){

	            $scope.innerAnswerTexts.push(obj.AnswerText[i] + " - by " + obj.UserName[i]);

	        }
	        $scope.answerTexts.push({texts: $scope.innerAnswerTexts});
            $scope.questionSummaries.push(obj.QuestionSummary);
            $scope.questionDetails.push(obj.QuestionDetails);
            $scope.users.push(obj.UserNickname);
            $scope.dates.push(obj.SubmissionTime);
            $scope.totalAnswers.push(obj.TotalAnswerCount);
            $state.go($state.current, {}, { reload: false });
            $scope.hide($ionicLoading);
            if ($scope.questionSummaries.length == totalResults){
                shouldShowMore = false;

            }
        });

    }

    function failure(message3)
    {
        $scope.failMessage = "Error Message: " + message3.toString();
        $scope.hide($ionicLoading);
        shouldShowMore = false;

    }

    $window.resolveLocalFileSystemURL(cordova.file.applicationDirectory + "www/setupKeys.txt", gotFile, fail);

      function fail(e) {
          console.log("FileSystem Error");
          console.dir(e);
      }

      function gotFile(fileEntry) {

          fileEntry.file(function(file) {
              var ready = false;
              var check = function() {
                  if (ready === true) {
                      BVSDK.getQuestionsAndAnswersConversations(productID,10,0, success, failure);
                      return;
                  }
                  setTimeout(check, 1000);
              }

              check();
              var reader = new FileReader();

              reader.onloadend = function(e) {
                  var setupKeys = angular.fromJson(this.result);
                  productID = setupKeys.testProductID;
                  ready = true;
              }

              reader.readAsText(file);

          });
      }

}])

