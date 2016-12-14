#!/bin/bash
cd bvdemo/platforms/android
./gradlew assembleDebug
calabash-android run /home/travis/build/bazaarvoice/cordova-plugin-bvsdk/bvdemo/platforms/android/build/outputs/apk/android-debug.apk --format json -o cucumber.json
chmod 755 report_parser.py
./report_parser.py
