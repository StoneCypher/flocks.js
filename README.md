flocks
======

A radically simpler alternative to Flux - opinionated React state and rendering management

![Language](http://img.shields.io/badge/Language-Javascript/JSX-000000.svg) &nbsp;
![Platform](http://img.shields.io/badge/Platform-Node-000000.svg) &nbsp;
![License](http://img.shields.io/badge/License-MIT-000055.svg) &nbsp;
![Status](http://img.shields.io/travis/StoneCypher/flocks.js.svg)

[![NPM Downloads](http://img.shields.io/npm/dm/flocks.js.svg)](https://npmjs.org/package/flocks.js)

![](https://nodei.co/npm/flocks.js.png?stars=true&downloads=true)





WARNING
-------

This is pre-release software.  This is the right way forwards, but it's only just on the verge of ready, and bugs should be expected.  The base API is now stable, but will soon be extended.  Proper tutorial on the way very soon `:)`

***Please consider this a beta product.***



What the hell is this?
-----------------

So [flux](http://facebook.github.io/flux/) is pretty cool.  But, I wanted something simpler, because I wanted to move faster.  So, I created flocks - a flux alternative.



What's the big deal
-------------------

There's basically no boilerplate, and updating is easy.

You know that whole thing in Flux where you have to create stores and dispatchers and constant files and decide how many of each there'll be and set up bindings and so on?

```javascript
var Target = document.getElementById('whatever'),
    Update = Flocks.create({ target: Target, control: YourControl });

Update({ logged_in: true, user_name: "Bob Dobbs", icon: "http://..." });
```

Done.

If you want that from inside the control, or even inside the heirarchy, that's fine; props, state, and contexts will cascade down safely and normally.

Now, you just write your app as a single control, and keep state 100% *outside* of the control heirarchy.  `:)`





More clearly?
-------------

What Flocks actually does is to provide you with an update function.

To get started, tell Flocks where the mount point is and what control to use.  Then, Flocks will create that control in place, and provide you an update function.  What you do with that function is up to you, though it's recommended that you pass it downwards, for use by your control and its children (and a mixin is provided to automate that, if you like.)

Then, Flocks will update the top-level control when the state it manages changes, by applying each key to a prop in the top-level.

The idea is that you're supposed to let Flocks manage the part of your application's state that gets visibly rendered.  (You can let it manage the whole state, if you want to; I do.  But you don't have to.)

Once that's done, the whole shebang is just taken off your shoulders.  No update calls.  No dispatching.  No events.  No broadcasting.  No registration or deregistration.

Just simple prop updates.  It's quite liberating.





Example plox
------------

One example is [flocks-mini-todo](https://www.npmjs.org/package/flocks-mini-todo) ([github](https://github.com/StoneCypher/flocks-mini-todo)).  More are coming soon.



Endnotes
--------

Are you using my lib?  Please let me know.  I'm curious!

If you want to reach me, try `stonecypher at gmail dot com`, please.  Thanks `:)`



Polemic :neckbeard:
-------------------

`flocks` is MIT licensed, because viral licenses and newspeak language modification are evil.  Free is ***only*** free when it's free for everyone.
