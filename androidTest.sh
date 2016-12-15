#!/bin/bash
cd bvdemo/platforms/android
./gradlew assembleDebug
TESTDIR=$(pwd)
echo Repository directory is: $TESTDIR
calabash-android run $TESTDIR/build/outputs/apk/android-debug.apk --format json -o cucumber.json
echo report parser is $REPORT_PARSER
if [ -z $REPORT_PARSER ]; then
    echo Skipping report parser, android
else
    chmod 755 report_parser.py
    ./report_parser.py
fi
