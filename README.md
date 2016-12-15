[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](./LICENSE)
[![Build Status](https://travis-ci.org/bazaarvoice/cordova-plugin-bvsdk.svg?branch=master)](https://travis-ci.org/bazaarvoice/cordova-plugin-bvsdk)

![](./misc/logo-tagline.png)

***

# cordova-plugin-bvsdk

This guide shows you the requirements and steps to integrate the Bazaarvoice mobile SDKs (BVSDK) for Android and iOS in your Cordova application. If you'd like to use this Cordova plugin in your mobile application, drop a message to the [Bazaarvoice Mobile SDK team](mobilecoreteam@bazaarvoice.com). This Cordova plugin is also used as a method for cross-platform testing with Calabash. The instructions below also help you run the tests.

Table of Contents
=================

* [Supported Features](#supported-features)
* [Prerequisites](#prerequisites)
* [Running Demo Application](#running-demo-application)
* [Installing the bvplugin](#installing-the-bvplugin)
    * [iOS](#ios)
    * [Android](#android)
* [Testing Demo Application using Calabash-Cucumber](#testing-demo-application-using-calabash-cucumber)

## Supported Features

The Cordova Plug-in for the BVSDK provides a subset of functionality of the native Bazaarovoice Mobile SDKs. Support for other facets of the SDK can be added; just submit a PR or open an issue with an enhancement request and we'll be happy to discuss. 

The current feature support includes:

- **Conversations Display API**: Includes API support for Review, Questions & Answers, Product Statistics, and Bulk Product Statistics
- **Product Recommendations**: Omni-channel product recommendations

## Prerequisites

**Acquiring Keys**
- For Product Recommendation (Beta) Keys, email [mobilecoreteam@bazaarvoice.com](mailto://mobilecoreteam@bazaarvoice.com) 
- For Conversations API Keys, seee the [Conversations Getting Started Guide](https://developer.bazaarvoice.com/docs/read/conversations_api/getting_started) for more information.

**iOS**

- Cordova (5.X.X+) (https://cordova.apache.org/)
- Xcode 8+
- OS X 10.11+ (required for Xcode 8+)
- Carthage (https://github.com/Carthage/Carthage) - For running the iOS demo application.

**Android**

- Cordova (5.X.X+) (https://cordova.apache.org/)
- Android Studio 2.2+
- Android SDK version 23+
- Appropriate Android SDK Packages
- Android Platform SDK for your targeted version of Android
- Android SDK build-tools version 19.1.0 or higher
- Android Support Repository (found under "Extras")

## Running Demo Application
- Clone this repo.
- Open the demo project for the platform you want to run:

### Android
   - `<repo root>/bvdemo/platforms/android` in Android Studio.
   - Navigate to `<android>/assets/www/setupKeys.txt` and replace the API keys with your keys.
   - You can also add in some test product Ids in the `setupKeys.txt` from your product catalog.
   - **NOTE:** Close any virtual machines or related services (e.g. VirtuaBox, Docker, etc.)
   
### iOS 
   - Open a terminal to `<repo root>/bvdemo/platforms/ios/`.
   - Run `carthage update` to install the iOS BVSDK.
   - Run `open BVInterface.xcodeproj` to open the project in XCode.
   - In Xcode project, navigate to  `<BVInterface>/Staging/www/setupKeys.txt` and add your own API keys.
   - You can also add in some test product Ids in the `setupKeys.txt` from your product catalog.
 
Now just build and run!

## Installing the bvplugin

### iOS

- Create a new cordova project (or use an existing one), add the platform and add the plugin:
```sh
$ cordova create hello com.example.hello HelloWorld
$ cd hello
$ cordova platform add ios
$ cordova plugin add https://github.com/bazaarvoice/cordova-plugin-bvsdk#master:/bvplugin
```

- Next, we have to add the framework. The steps below use Carthage, but you can also use Cocoapods or directly install the pre-built framework from the bv-ios-sdk repository.

```sh
$ cd path/to/hello/platforms/ios
$ touch Cartfile
$ echo 'github "bazaarvoice/bv-ios-sdk"' > Cartfile
$ carthage update
$ open .
```
Now open Xcode and open the project `HelloWorld.xcodeproj`. From the open finder window, go to `Carthage/Build/iOS` and drag the `BVSDK.framework` into the Xcode project, into the Frameworks directory inside the HelloWorld project. 

Click on the HelloWorld project icon in the project navigator window then under General in project settings, make sure the `BVSDK.framework` is added on to **Embedded Binaries** and **Linked Frameworks and Libraries**. 

Next, go to Build Phases in project settings and add a **Run Script**. Paste `bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/BVSDK.framework/integrate-dynamic-framework.sh"` into the script. 

- Finally, we are ready for the code implementation. To setup the BVSDK, from the iOS project directory, navigate to the following file `Staging/www/js/index.js` from XCode and inside the `onDeviceReady` method declaration, add:

```js
var success = function(message) {
  alert("BVSDK has been built successfully.");
}
var failure = function() {
  alert("Error calling BVInterface Plugin");
}

var isStaging = false; // set to true for production keys
//Fill in the keys in order to initialize the BVSDK
BVSDK.bvsdksetup("YOUR_CLIENT_ID", "SHOPPER_AD_API_KEY", "CONVERSATION_KEY", isStaging, success, failure);

```

- If you have a Product Recommendation key, you can do the following to make a product recommendation call
```js
var recommendationReceived = function(message){
  alert("Got recommendations");
}
var failure = function() {
  alert("Error calling BVInterface Plugin");
}
//Change the LIMIT_INTEGER to the limit of recommendations you wish to recieve
BVSDK.getRecommendations(LIMIT_INTEGER,recommendationReceived,failure);

```

- If you have a Conversations key, you can do the following to make calls to our several conversation products
```js
//Question and Answers
var questionsAndAnswersReceived = function(message){
  alert("Got questions and answers");
}
//Change the "PRODUCT_ID", LIMIT_INTEGER to the number of questions you wish to receive, and the OFFSET
BVSDK.getQuestionsAndAnswersConversations("PRODUCT_ID",LIMIT_INTEGER,OFFSET, questionsAndAnswersReceived, failure)

//Product Stats
var productStatsReceived = function(message){
  alert("Got product stats");
}
//Change the "PRODUCT_ID"
BVSDK.getProductStatsConversations("PRODUCT_ID", productStatsReceived, failure);

//Bulk Stats
var bulkStatsReceived = function(message){
  alert("Got bulk stats");
}
//Fill 'productIDArray' with strings of product ids
var productIDArray = [];
BVSDK.getBulkRatingsConversations(productIDArray,bulkStatsReceived, failure);

//Reviews
var reviewsReceived = function(message){
  alert("Got reviews");
}
//Change the "PRODUCT_ID", LIMIT_INTEGER to the number of reviews you wish to receive, and the OFFSET
BVSDK.getReviewsConversations("PRODUCT_ID",LIMIT_INTEGER,OFFSET, reviewsReceived, failure);

//Failure callback
var failure = function() {
  alert("Error calling BVInterface Plugin");
}

```


- Now just run!

### Android


- Create a new cordova project (or use existing one), add the platform and add the plugin:

```sh
$ cordova create hello com.example.hello HelloWorld
$ cd hello
$ cordova platform add android
$ cordova plugin add https://github.com/bazaarvoice/cordova-plugin-bvsdk#master:/bvplugin
```

- Open the project in Android Studio (`path/to/hello/platforms/android`) and open the `build.gradle (Module:android)` file. Inside the `allprojects` declaration, add these repositories:

```js
allprojects {
  repositories {
    mavenCentral()
    jcenter()
  }
}
```

Inside the `dependencies` declaration add:

```js
//GSON-DEPENDENCY
compile group: 'com.google.code.gson', name: 'gson', version: '2.7'
//BV-DEPENDENCIES
compile "com.bazaarvoice.bvandroidsdk:recommendations:5.+"
compile 'com.bazaarvoice.bvandroidsdk:curations:5.+'
compile 'com.bazaarvoice.bvandroidsdk:advertising:5.+'
compile 'com.bazaarvoice.bvandroidsdk:conversations:5.+'
compile 'com.bazaarvoice.bvandroidsdk:location:5.+'
```

- Finally, we are ready for code implementation. To set up the BVSDK, from the **android** tree directory in Android Studio, navigate to the following file `android/assets/www/js/index.js` and inside the `onDeviceReady` method declaration, add:

```js
var success = function(message) {
  alert("BVSDK has been built successfully.");
}
var failure = function() {
  alert("Error calling BVInterface Plugin");
}

var isStaging = false; // set to true for production keys
//Fill in the keys in order to initialize the BVSDK
BVSDK.bvsdksetup("YOUR_CLIENT_ID", "SHOPPER_AD_API_KEY", "CONVERSATION_KEY", isStaging, success, failure);

```

- If you have a Product Recommendation key, you can do the following to make a product recommendation call
```js
var recommendationReceived = function(message){
  alert("Got recommendations");
}
var failure = function() {
  alert("Error calling BVInterface Plugin");
}
//Change the LIMIT_INTEGER to the limit of recommendations you wish to recieve
BVSDK.getRecommendations(LIMIT_INTEGER,recommendationReceived,failure);

```

- If you have a Conversations key, you can do the following to make calls to our several conversation products
```js
//Question and Answers
var questionsAndAnswersReceived = function(message){
  alert("Got questions and answers");
}
//Change the "PRODUCT_ID", LIMIT_INTEGER to the number of questions you wish to receive, and the OFFSET
BVSDK.getQuestionsAndAnswersConversations("PRODUCT_ID",LIMIT_INTEGER,OFFSET, questionsAndAnswersReceived, failure)

//Product Stats
var productStatsReceived = function(message){
  alert("Got product stats");
}
//Change the "PRODUCT_ID"
BVSDK.getProductStatsConversations("PRODUCT_ID", productStatsReceived, failure);

//Bulk Stats
var bulkStatsReceived = function(message){
  alert("Got bulk stats");
}
//Fill 'productIDArray' with strings of product ids
var productIDArray = [];
BVSDK.getBulkRatingsConversations(productIDArray,bulkStatsReceived, failure);

//Reviews
var reviewsReceived = function(message){
  alert("Got reviews");
}
//Change the "PRODUCT_ID", LIMIT_INTEGER to the number of reviews you wish to receive, and the OFFSET
BVSDK.getReviewsConversations("PRODUCT_ID",LIMIT_INTEGER,OFFSET, reviewsReceived, failure);

//Failure callback
var failure = function() {
  alert("Error calling BVInterface Plugin");
}

```
- Now just run!

## Testing Demo Application using Calabash-Cucumber

### Prerequisites
- ruby 2.2.3 or above
- calabash-cucumber (https://github.com/calabash/install)

**iOS**
- Ensure all available keys are placed within setupKeys.txt by nagigating to the following from XCode: `<BVInterface>/Staging/www/setupKeys`
- In terminal, navigate to the following directory: `/path/to/bvdemo/platforms/ios`
- Before executing the Calabash scenarios, make sure you have built the `BVInterface-cal` target from XCode against a iOS 10+ simulator.


*Scenario 1*: Client has all the keys and a specific testProductID/testProductIDArray.
```sh
$ calabash-sandbox
$ cucumber
```
*Scenario 2*: Client has no recommendations key but has conversations key with a specific testProductID and testProductIDArray
```sh
$ calabash-sandbox
$ cucumber --tags ~@recommendations_test
```
*Scenario 3*: Client has no conversations key but has recommendations key
```sh
$ calabash-sandbox
$ cucumber --tags ~@conversations_test
```
**Android**
- Ensure all keys are placed within setupKeys.txt: `<android>/assets/www/setupKeys.txt`
- In terminal, navigate to the following directory: `/path/to/bvdemo/platforms/android`
- Execute the following to run the tests based on the scenarios 
 
*Scenario 1*: Client has all the keys and a specific testProductID/testProductIDArray.
```sh
$ calabash-sandbox
$ calabash-android run build/outputs/apk/android-debug.apk
```
*Scenario 2*: Client has no recommendations key but has conversations key with a specific testProductID and testProductIDArray
```sh
$ calabash-sandbox
$ calabash-android run build/outputs/apk/android-debug.apk --tags ~@recommendations_test
```
*Scenario 3*: Client has no conversations key but has recommendations key
```sh
$ calabash-sandbox
$ calabash-android run build/outputs/apk/android-debug.apk --tags ~@conversations_test 
```
## License

Use of this SDK is contingent on your agreement and conformance with Bazaarvoice’s [API Terms of Use](http://www.bazaarvoice.com/legal/api-terms-of-use.html). Additionally, you agree to store all data acquired by this SDK or Bazaarvoice’s API only within the storage of the individual application instance using the SDK or API. You also agree to use the data acquired by the SDK or API only within the context of the same individual application instance and only for purposes consistent with that application’s purpose.  Except as otherwise noted, the Bazaarvoice iOS SDK licensed under the [Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0.html).
