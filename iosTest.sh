#!/bin/bash
carthage version
cd bvdemo/platforms/ios/
xcodebuild -list
carthage update --no-use-binaries
xcodebuild -sdk iphonesimulator ONLY_ACTIVE_ARCH=NO -scheme BVInterface-cal -project BVInterface.xcodeproj
cucumber --tags ~@recommendations_test --format json -o cucumber.json
echo report parser is $REPORT_PARSER
if [ -z $REPORT_PARSER ]; then
    echo Skipping report parser, ios
else
    chmod 755 report_parser.py
    ./report_parser.py
fi
