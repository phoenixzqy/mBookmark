# mBookmark

## What is mBookmark

mBookmark is short for mobile-like bookmark. This is only an exercising project for fun. The purpose of this project is to simulate a mobile-like GUI in web environment. Use it to manage user's bookmark. Create a powerful search feature for users to efficiently access saved sites. A mobile-like GUI will help user to remeber their bookmark position/location more easily than traditional browser bookmark. And mainwhile, I bring a concept of "application" into this project. The role of application is the equivilant application in your phone, just web version replacements. Using this portal, I will be able to integrate with all my past works and even many stunning open source web apps like "QR scanner" into this place. A real all-in-one web app.

## Screenshots

![Main Screen](https://github.com/phoenixzqy/mBookmark/blob/main/images/main_screen.png "Main Screen")

## Start to use

### Demo

You can play with this simplified version here: demo (TODO)

### Livesite

The live version is here: [live](https://phoenixzqy.github.io/demo/mBookmark/index.html)

### Fork/Clone this app

You can even fork/clone this app and build your own version using your github page, or any server providers.

### Features

* Fully github based app
  * using my github page as renderring server
  * using gist as database
* Privacy and security:
  * Even though your data is saved on gist which is visible to public, all data is `AES encrypted` with your own `secret`.
  * Your secret is `MD5 encrypted` and stored in your browser. You can safely remove them by signing out. A secret is just another name of password.
  * Since it is based on Gist, you will have your power to find back/rollback/manage your data using gist features.
* Powerfull search feature:
  * Supporting multiple keywords search, eg: `word1,word2,word3`
* Web Application integration. A web app can be:
  * An iframe
  * A plugin like code written in `src/components/Application` and registered in `src/components/ApplicationManager`
* Builtin QR code scanner, powerred by: [qr-code-scanner](https://github.com/code-kotis/qr-code-scanner)
  * Support webcam scanning
  * Image scanning
* Mobile-like GUI/UX
* Live wallpaper, and you can change it to any static/live wallpaper you like online.
* Fullscreen support

### User Menu

1. Create your own personal github access token by following github [official document](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token).
  a. You will only need gist read&write permission.
  b. Please set your token to be perminent (no expiration date).
2. Use your token and your own `secret`/`password` to [login](https://phoenixzqy.github.io/demo/mBookmark/index.html) and enjoy it!
  a. The very first login will automatically create a gist ticket under your account. Please don't delete it unless you decide to stop using it.
3. Shortcut and gastures
  a. `slide left/right` to change between screens
  b. `slide down` to call out `search` screen
    * Supporting multiple keywords search, eg: `word1,word2,word3`
  c. `right click` on `Bookmark` to `edit`/`remove` it.
  d. In Bookmark `Add` screen, there are 2 buttons for you to simplify the process of creation. Click on `helper script` button to copy a piece of code. Then paste and run it in any website console to generate JSON version of site info. Then copy the JSON string into your clipboard, and then click on the `import` button to quickly import site info.
  e. in all popout screens, click on the background area will bring you back to main screen.
  d. Edit `folder name` by opening a folder and clicking on its name/title.
4. -1 screen is supported. By default, I use `juejin.com` as my feed provider. You can change it with any websites which allow:
  a. `iframe`
  b. `CORS` policy

### Dependencies

* [Vite](https://vitejs.dev/)
* [SolidJS](https://www.solidjs.com/)
* [CryptoJS](https://github.com/brix/crypto-js)
* [qr-code-scanner](https://github.com/code-kotis/qr-code-scanner)
* [Materialize](https://materializecss.com/)

## TODOs

* [x] Mobile like homepage design
* [x] add/edit/remove bookmark
* [x] app screen layer manager
* [x] entry group
* [x] screen layer history stack
* [x] page screen layer switch animation
* [x] app group
* [x] data structure design
* [x] normal homepage drag & drop based modification features
* [x] materialize UI integration
* [x] boxEdge, detect dragging and hold event to change pages
* [x] fix dropdown menu
* [x] edit group-popover/group title
* [x] searchPopover
* [x] Live wallpaper
* [x] reading page
* [x] bottom Dock
  * [x] fullscreen (icon only)
  * [x] Readme/intro doc (icon only)
  * [x] barcode scanner (icon only)
  * [x] setting (icon only)
* [x] App entry, Application structure
* [x] App screenLayer
* [x] App manager
* [-] APPs
  * [x] fullscreen
  * [x] Readme/intro doc
  * [x] qrcode scanner
  * [x] settings
* [x] input validations
* [x] login page
* [x] gist based DB
* [x] localstorage based DB
* [ ] coachmark
* [x] make it into browser extension
  * [ ] * add bookmark based on user current viewing website.
* [ ] mobile touch events support
* [ ] Vite config
* [ ] comments and documentation in code

* [ ] sample site
* [x] add custom encrypt secret, like password. In case user lose old github token. Now user can use any github token with proper r/w authority to login this app. Data will be encrypted with secret
* [x] service worker
* [ ] ~~web wroker~~
* [x] PWA
