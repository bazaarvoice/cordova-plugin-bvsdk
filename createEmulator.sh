#!/bin/bash
echo no | android create avd --force -n test -t android-19 --abi armeabi-v7a
emulator -avd test -no-audio -no-window -no-boot-anim &
android-wait-for-emulator
adb shell settings put global window_animation_scale 0 &
adb shell settings put global transition_animation_scale 0 &
adb shell settings put global animator_duration_scale 0 &
adb shell input keyevent 82 &

