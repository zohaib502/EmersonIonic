# FIELD-SERVICE-API

## Field Service Application

### App version

* ionic cordova plugin add cordova-plugin-app-version
* npm install --save @ionic-native/app-version

### Email composer

* ionic cordova plugin add cordova-plugin-email-composer
* npm install --save @ionic-native/email-composer

### File chooser

* ionic cordova plugin add cordova-plugin-filechooser
* npm install --save @ionic-native/file-chooser

### File plugin

* ionic cordova plugin add cordova-plugin-file
* npm install --save @ionic-native/file

### File opener

* ionic cordova plugin add cordova-plugin-file-opener2
* npm install --save @ionic-native/file-opener

### File Transfer

>Repo: <https://github.com/apache/cordova-plugin-file-transfer>

* ionic cordova plugin add cordova-plugin-file-transfer
* npm install --save @ionic-native/file-transfer

### InAppBrowser

>Repo: <https://github.com/apache/cordova-plugin-inappbrowser>

* ionic cordova plugin add cordova-plugin-inappbrowser
* npm install --save @ionic-native/in-app-browser

### Clipboard

>Repo: <https://ionicframework.com/docs/native/clipboard/>

* ionic cordova plugin add cordova-clipboard
* npm install --save @ionic-native/clipboard

### Network

>Repo: <https://github.com/apache/cordova-plugin-network-information>

* ionic cordova plugin add cordova-plugin-network-information
* npm install --save @ionic-native/network

### SQLite

>Repo: <https://github.com/litehelpers/Cordova-sqlite-storage>

* ionic cordova plugins add cordova-sqlite-storage
* npm install –save @ionic-native/sqlite

### Geolocation

>Repo: <https://github.com/apache/cordova-plugin-geolocation>

* ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To locate you"
* npm install --save @ionic-native/geolocation

### Device

>Repo: <https://github.com/apache/cordova-plugin-device>

* ionic cordova plugin add cordova-plugin-device
* npm install --save @ionic-native/device

### Screen Orientation

>Repo: <https://github.com/apache/cordova-plugin-screen-orientation>

* ionic cordova plugin add cordova-plugin-screen-orientation
* npm install --save @ionic-native/screen-orientation

### Base64

>Repo: <https://github.com/hazemhagrass/phonegap-base64>

* ionic cordova plugin add com-badrit-base64
* npm install --save @ionic-native/base64

-------------------------------------------------------------------------
>## Cordova Plugin

### UWP Back Button

* cordova plugin add cordova-plugin-uwpbackbutton

### Custom Config

* cordova plugin add cordova-custom-config --fetch

*add below code in to the config.xml file

<plugin name="cordova-plugin-camera" spec="^4.0.3">
        <variable name="CAMERA_USAGE_DESCRIPTION" value="This app would like to access the loccation, so that it set correct address, so please allow the access." />
    </plugin>
    <plugin name="cordova-plugin-photo-library" spec="^2.0.1">
        <variable name="PHOTO_LIBRARY_USAGE_DESCRIPTION" value="This app would like to access the photo library to upload the photos, so please allow the access." />
    </plugin>
    <custom-config-file parent="NSCameraUsageDescription" platform="ios" target="*-Info.plist">
        <string>This app would like to access the camera to upload the photo, so please allow the access.</string>
    </custom-config-file>
    <custom-config-file parent="NSPhotoLibraryUsageDescription" platform="ios" target="*-Info.plist">
        <string>This app would like to access the photo library to upload the photos, so please allow the access.</string>
    </custom-config-file>
    <edit-config file="*-Info.plist" mode="merge" target="NSCameraUsageDescription">
        <string>This app would like to access the camera to upload the photo, so please allow the access.</string>
    </edit-config>
    <edit-config file="*-Info.plist" mode="merge" target="NSPhotoLibraryUsageDescription">
        <string>This app would like to access the photo library to upload the photos, so please allow the access.</string>
    </edit-config>
    <edit-config file="*-Info.plist" mode="merge" target="NSLocationWhenInUseUsageDescription">
        <string>This app would like to access the loccation, so that it set correct address, so please allow the access.</string>
    </edit-config>
    <plugin name="cordova-plugin-geolocation" spec="~4.0.1">
        <variable name="GEOLOCATION_USAGE_DESCRIPTION" value="This app would like to access the loccation, so that it set correct address, so please allow the access." />
    </plugin>
    <plugin name="cordova-custom-config" spec="^5.0.2" />

-------------------------------------------------------------------------

>## NPM packages

### Font awesome plugin

* npm install font-awesome --save

 Copy the following code in the following path :-

 >`node_module/@ionic/app-script/config/copy.config.js`

```-
copyFontAwesomeCSS:{
    src: '{{ROOT}}/node_modules/font-awesome/css/font-awesome.min.css',
    dest: '{{WWW}}/assets/css/'
  },

  copyFontAwesome:{
    src: '{{ROOT}}/node_modules/font-awesome/fonts/**/*',
    dest: '{{WWW}}/assets/fonts/'
  }
  ```

-------------------------------------------------------------------------

### Translation plugin

* npm install @ngx-translate/core@8.0.0 @ngx-translate/http-loader@2.0.1 --save

-------------------------------------------------------------------------

### Plugin for signature pad

* npm install angular2-signaturepad --save

-------------------------------------------------------------------------

### Plugin for moment

* npm install moment --save
* npm install moment-timezone --save

-------------------------------------------------------------------------

### Calender Control

* npm install ngx-bootstrap --save

>`unzip bs-datepicker.zip from your project directory/toolsLibarary
paste that file to node project directory node_modules\ngx-bootstrap\datepicker`

-------------------------------------------------------------------------

### Rating

* npm install --save ionic2-rating

-------------------------------------------------------------------------

### PdfMake

* npm install pdfmake

>`unzip pdfmake from your project directory/toolsLibarary
paste that folder to node project directory node_modules\pdfmake`

-------------------------------------------------------------------------

### ngx-bootstrap timepicker Control

>`unzip timepicker.utils.zip from your project directory/toolsLibarary
paste that file to node project directory node_modules\ngx-bootstrap\timepicker`

-------------------------------------------------------------------------

### Background Mode

* ionic cordova plugin add cordova-plugin-background-mode
* npm install --save @ionic-native/background-mode

-------------------------------------------------------------------------

### Chart.js

* npm install ng2-charts --save
* npm install chart.js --save

-------------------------------------------------------------------------

## IONIC Help

### Resourse file handle in IONIC

* ionic cordova resources windows
* ionic cordova resources android

-------------------------------------------------------------------------

## Image Resizer

  <https://ionicframework.com/docs/native/image-resizer/>

* ionic cordova plugin add info.protonet.imageresizer
* npm install --save @ionic-native/image-resizer

-------------------------------------------------------------------------

## Multiselect Dropdown

  <https://www.npmjs.com/package/ng-multiselect-dropdown/>

* npm i ng-multiselect-dropdown

-------------------------------------------------------------------------

## For IOS platform specific Code

Add this code in application plist file(File path below) for application acceess permission form user for camera and photoLibrary uses.

* /Users/puneet/SofbangProjects/Emerson/EmersonRepo/FieldServiceIonic/platforms/ios/FieldService-tst1/FieldService-tst1-Info.plist

Code:

      <key>NSCameraUsageDescription</key>
      <string>Allow to access image from camera</string>

      <key>NSPhotoLibraryUsageDescription</key>
      <string>Allow to access your Photo Library</string>

* Replace below code for App Transport Security blocks https post

      <key>NSAllowsArbitraryLoads</key>
      <true/>

  to

        <key>NSAllowsArbitraryLoads</key>
        <false/>

-------------------------------------------------------------------------

## Problem and Solutions

if getting Error:
>JavaScript heap out of memory in time --prod Build

  For those with large apps, I tried using @bnfrnz 's suggestion at #1426 to use:

      --aot --minifyjs --minifycss

  instead of `--prod`

  and I succeeded in completing my build in ~4-5 mins, what normally took 15 mins

  I know it might not be ideal to leave out --optimizejs. But as he pointed out, leaving that seems to be the workaround for now.

 > or  Modify code in package.json

    "scripts": {
         "ionic:build": "ionic-app-scripts build",
    },

 to

    "scripts": {
          "ionic:build": "node --max-old-space-size=4096 ./node_modules/@ionic/app-scripts/bin/ionic-app-scripts.js build",
    },
-------------------------------------------------------------------------

If getting error:
npm ERR! enoent ENOENT: no such file or directory, rename 'D:\Projects\EMERSON\V_3_0\FieldServiceIonic\node_modules\cordova-ios\node_modules\abbrev' -> 'D:\Projects\EMERSON\V_3_0\FieldServiceIonic\node_modules\cordova-ios\node_modules\.abbrev.DELETE'

>Delete cordova-ios and/or cordova-android respectively from node_modules folder and run npm install


## New plugin added "Sqlite Db Copy" for copy emerson_customers.sqlite from app direcory to data directory so that data can be access through query.

For this follow this steps to implement it.

this is ionic native plugin path : https://ionicframework.com/docs/native/sqlite-db-copy/

above plugin will work for ios and android, for windows we have used copy file method from file plugin.

We have implemented this on Customer data provider.

If not Installed Follow the below steps
after installation of plugin and libray of "Sqlite Db Copy" :-

1. ionic cordova plugin add cordova-plugin-dbcopy

2. npm install --save @ionic-native/sqlite-db-copy

This plugin may create problem please follow the steps to resolve :-

1. npm rebuild node-sass --unsafe-perm.

2. npm install --unsafe-perm=true,  if not worked do this : npm install --force

3. again install  : npm install --save @ionic-native/sqlite-db-copy --unsafe-perm=true

4. npm audit fix --unsafe-perm=true

---------------------------------------------------------------------------------------------------

## Ck-editor integration

1. npm install ng2-ckeditor --save

Add external ck-edior library

Download "CKEDITOR 4.11.2" from the following link
https://ckeditor.com/ckeditor-4/download/releases/

Replace or add this library in to assets/lib/

link on the index.html.
2. Download Font plugin from the link https://ckeditor.com/cke4/addon/font
3. Extract the downloaded plugin .zip into the plugins folder of CKEditor installation i.e. {{WWW}}/assets/libs/ckeditor/plugins/
4. Add the below to {{WWW}}/assets/libs/ckeditor/config.js
    config.extraPlugins = 'font';

## Remove geolocation plugin
1.ionic cordova plugin remove cordova-plugin-geolocation --force


---------------------------------------------------------------------------------------------------

## File Compression via JsZip

  <https://stuk.github.io/jszip/>

* npm install jszip
----------------------------------------------------------------------------------------------------

## Add Plugin amce

* npm i file:src/assets/libs/amce
----------------------------------------------------------------------------------------------------
test23
