[![License](https://img.shields.io/cocoapods/l/BVSDK.svg?style=flat)](./LICENSE)
[![Build Status](https://travis-ci.com/bazaarvoice/cordova-plugin-bvsdk.svg?token=HjZzZooBqafqGuyqBXHY&branch=develop)](https://travis-ci.com/bazaarvoice/cordova-plugin-bvsdk)

![](./misc/logo-tagline.png)

***

# cordova-plugin-bvsdk

This guide will go through the steps required to try our demo application or install the bvplugin for your iOS/Android application.

Table of Contents
=================

* [cordova-plugin-bvsdk](#cordova-plugin-bvsdk)
  * [Prerequisites](#prerequisites)
  * [Running Demo Application](#running-demo-application)
  * [Installing the bvplugin](#installing-the-bvplugin)
    * [iOS](#ios)
    * [Android](#android)
  * [Testing Demo Application using Calabash-Cucumber](#testing-demo-application-using-calabash-cucumber)

## Prerequisites
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
- NodeJS version 6+
- Be sure to map your environment variables for your instance of the Android SDK in your ~/.bash_profile 

## Running Demo Application
- Clone this repo.
- Open the demo project for the platform you want to run:
- **Android** - `<repo root>/bvdemo/platforms/android` in Android Studio.
- **Android** - Close any virtual machines or related services (e.g. VirtuaBox, Docker, etc.)
- **iOS** - Open `<repo root>/bvdemo/platforms/ios/BVInterface.xcodeproj` in Xcode.
- For iOS, run `carthage update` in the demo project directory to install the BVSDK dependency.
- Now just build and run!

## Installing the bvplugin

### iOS

- Create a new cordova project (or use an existing one), add the platform and add the plugin:
```sh
$ cordova create hello com.example.hello HelloWorld
$ cd hello
$ cordova platform add ios
$ cordova plugin add https://github.com/bazaarvoice/cordova-plugin-bvsdk#develop:/bvplugin
```

- Next, we have to add the framework. 
```sh
$ cd path/to/hello/platforms/ios
$ touch Cartfile
$ open -a Xcode Cartfile
```
Paste `git "git@github.com:bazaarvoice/bv-ios-sdk-dev.git" "BVSDK60"` in to the Cartfile.
```sh
$ carthage update
$ open .
```
Now open Xcode and open the project `HelloWorld.xcodeproj`. From the open finder window, go to `Carthage/Build/iOS` and drag the `BVSDK.framework` into the Xcode project, into the Frameworks directory inside the HelloWorld project. 

Click on the HelloWorld project icon in the project navigator window then under General in project settings, make sure the `BVSDK.framework` is added on to **Embedded Binaries** and **Linked Frameworks and Libraries**. 

Next, go to Build Phases in project settings and add a **Run Script**. Paste `bash "${BUILT_PRODUCTS_DIR}/${FRAMEWORKS_FOLDER_PATH}/BVSDK.framework/integrate-dynamic-framework.sh"` into the script. 

- Lastly, from the iOS project directory, navigate to the following file `Staging/www/js/index.js` and inside the `onDeviceReady` method declaration, add:

```js
var success = function(message) {
alert("BVSDK has been built successfully.");
}
var failure = function() {
alert("Error calling BVInterface Plugin");
}

var recommendationRecieved = function(message){
alert("Got Recommendations");
}

var questionsAndAnswersRecieved = function(message){
alert("Got Q&A");
}

//Fill in the keys in order to initialize the BVSDK
bvinterface.bvsdksetup(“YOUR_CLIENT_ID”, “SHOPPER_AD_API_KEY”, “CONVERSATION_KEY”, success, failure);

//OPTIONAL

//Fill in the keys in order to recieve product recommendations
bvinterface.getRecommendation(LIMIT_INTEGER,recommendationRecieved,failure);

//Question and Answers call for Conversations
bvinterface.getConversations("PRODUCT_ID",LIMIT_INTEGER,OFFSET_INTEGER, questionsAndAnswersRecieved, failure);

```

- Now just run!

### Android


- Create a new cordova project (or use existing one), add the platform and add the plugin:

```sh
$ cordova create hello com.example.hello HelloWorld
$ cd hello
$ cordova platform add android
$ cordova plugin add https://github.com/bazaarvoice/cordova-plugin-bvsdk#develop:/bvplugin
```

- Open the project on Android Studios (`path/to/hello/platforms/android`) and open the `build.gradle (Module:android)` file. Inside the `allprojects` declaration, add the following:
```js
allprojects {
repositories {
maven {
url "https://repo.bazaarvoice.com/nexus/content/repositories/snapshots"
credentials {
username "release"
password "qTLnscU-"
}
}
jcenter()
}
}
```

Inside the `dependencies` declaration, add the following:
```js
//GSON-DEPENDENCY
compile group: 'com.google.code.gson', name: 'gson', version: '2.7'
//BV-DEPENDENCIES
compile "com.bazaarvoice.bvandroidsdk:recommendations:4.2.1-cordova-2-SNAPSHOT"
compile 'com.bazaarvoice.bvandroidsdk:curations:4.2.1-cordova-2-SNAPSHOT'
compile 'com.bazaarvoice.bvandroidsdk:advertising:4.2.1-cordova-2-SNAPSHOT'
compile 'com.bazaarvoice.bvandroidsdk:conversations:4.2.1-cordova-2-SNAPSHOT'
compile 'com.bazaarvoice.bvandroidsdk:location:4.2.1-cordova-2-SNAPSHOT'
```

- Lastly, from the android tree directory, navigate to the following file `android/assets/js/index.js` and inside the `onDeviceReady` method declaration, add:

```js
var success = function(message) {
alert("BVSDK has been built successfully.");
}
var failure = function() {
alert("Error calling BVInterface Plugin");
}

var recommendationRecieved = function(message){
alert("Got Recommendations");
}

var questionsAndAnswersRecieved = function(message){
alert("Got Q&A");
}

//Fill in the keys in order to initialize the BVSDK
bvinterface.bvsdksetup(“YOUR_CLIENT_ID”, “SHOPPER_AD_API_KEY”, “CONVERSATION_KEY”, success, failure);

//OPTIONAL

//Fill in the keys in order to recieve product recommendations
bvinterface.getRecommendation(LIMIT_INTEGER,recommendationRecieved,failure);

//Question and Answers call for Conversations
bvinterface.getConversations("PRODUCT_ID",LIMIT_INTEGER,OFFSET_INTEGER, questionsAndAnswersRecieved, failure);
```
- Now just run!

## Testing Demo Application using Calabash-Cucumber

### Prerequisites
- ruby 2.2.3 or above
- calabash-cucumber (https://github.com/calabash/install)

**iOS**
- In terminal, navigate to the following directory: `/path/to/bvdemo/platforms/ios`
- Execute the following to run the tests
```sh
$ calabash-sandbox
$ cucumber
```

**Android**
- In terminal, navigate to the following directory: `/path/to/bvdemo/platforms/android`
- Execute the following to run the tests (make sure to change the /path/to/ to point at the apk)
```sh
$ calabash-sandbox
$ calabash-android run /path/to/bvdemo/platforms/android/build/outputs/apk/android-debug.apk
```
