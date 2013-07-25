## What is Convomail  

Convomail is an open source email client, backend-ed by [Emailbox](https://getemailbox.com), that is built using HTML, CSS, and Javascript. It has been tested on Android and iOS.  

Pull requests are welcome!  

## Current status 

[Download the Android APK on the Convomail site](http://convomail.getemailbox.com)  

Convomail is usable as a mobile email client at this point, but has many bugs and issues that need to be fixed. If you encounter an issue not already on GitHub Issues for this repository, please add it with as much info as possible!  

## Contents of this Repository  
Source for the Convomail mobile email client. The app works in conjunction with a server-side component (receiving and sending emails) and the Emailbox API (https://getemailbox.com/docs).  

## Requirements to run:  
- Android Phone running 2.2+ (not ready for Tablets) 

## Build Option 1: PhoneGap Build  
1. Fork this repo (optional)
1. Sign up for Adobe PhoneGap Build: http://build.phonegap.com/plans/free 
1. Create a new project in PhoneGap Build using your forked GitHub URL (or just the https url for this repo)  
1. Build the project, then download and install the created Android build (.ipk). Takes about 30 seconds. [Use a barcode scanner](https://play.google.com/store/apps/details?id=com.google.zxing.client.android&hl=en) for easy download! 

## Design and Debugging  
Try out [debug.phonegap.com](http://debug.phonegap.com) (super buggy and slow, but a useful HTML view) or open up index.html in your browser and use the native developer tools.

## Server-side   
By default the basic server is used. If you want to run your own server:  

1. Register as an emailbox developer (https://getemailbox.com/login/first)
1. Follow instructions at repo: https://github.com/emailbox/convomail_server  

## App Todos
- Issues have been moved to GitHub's issue tracker: [https://github.com/emailbox/convomail_app/issues](https://github.com/emailbox/convomail_app/issues





