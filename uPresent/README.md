# uPresent

Mobile App: [![BitRise](https://app.bitrise.io/app/94539fb2e1e99188/status.svg?token=UdpO7BVErEwwgVQ-IR-PRQ&branch=master)](https://app.bitrise.io/app/94539fb2e1e99188/status.svg?token=UdpO7BVErEwwgVQ-IR-PRQ&branch=master)

# Pre-Requisites

1. Android Studio
2. AVD Setup or Real Android Device

# Local Setup

1. Clone this repository and open the project in Android Studio
2. Run the below command to install react-native-cli
~~~
npm install -g react-native-cli
~~~
3. Download and install dependencies
~~~
npm install
~~~
4. Install and run the android application on the connected AVD or device by executing this command. Ensure port 8081 is not in use - so that the Metro server can be initialized for connecting debugger with the device.
~~~
react-native run-android
~~~