# CLIPON FIREBASE

<https://clipon.firebaseapp.com/>

## Pitch

Copy paste text across different computers through the Internet.

## Typical usage

* Customize your own url into https://clipon.firebaseapp.com/whatever
* Paste a snippet and retrieve it on your other device from https://clipon.firebaseapp.com/whatever
* Share some volatile text with several users

## Features

* No login
* No reload
* Instant copy
* Clickable copied links
* Copy HTML (on HTML5 browsers) or plain text (on older browsers)
* Click outside the input box to make links clickable
* The data is public
* The data is persistent even after you leave

## Design

This is the evolved cousin of http://clipon.herokuapp.com/.
It grew from an almost framework-less app to a framework-packed app, but the no backend style of Firebase was suitable for how simple I wanted the app to be.
* No backend
* [Firebase](https://www.firebase.com) database
* [AngularJs](https://angularjs.org)
* [AngularFire](https://www.firebase.com/docs/web/libraries/angular/api.html)

`/server` is only used to mimic the Firebase server for local development. The app runs fully on the client in `/app`.

## Review

I will post a review here of my use of the preceding stack. But all in all, I think Firebase is still too alpha, I encountered bugs, service outage and very weird code design. The no backend is the promise but if you want serious security rules then the complexity is equivalent (if not greater) to having your own backend I think. My review is coming soon!


