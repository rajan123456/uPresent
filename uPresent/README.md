# uPresent

Mobile App: [![BitRise](https://app.bitrise.io/app/94539fb2e1e99188/status.svg?token=UdpO7BVErEwwgVQ-IR-PRQ&branch=master)](https://app.bitrise.io/app/94539fb2e1e99188/status.svg?token=UdpO7BVErEwwgVQ-IR-PRQ&branch=master)

# Pre-Requisites

1. Visual Studio Code
2. AVD Setup or Real Android Device

**NOTE:** We do not have an iOS Developer Account. So pod installation is not performed on the app yet.

# Local Setup

1. Clone this repository and open the project in Visual Studio Code

2. Download and install dependencies

```
npm install
```

3. Install and run the android application on the connected AVD or device by executing this command. Ensure port 8081 is not in use - so that the Metro server can be initialized.

```
npm run android
```
