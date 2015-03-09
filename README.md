flocks
======

A radically simpler alternative to Flux - opinionated React state and rendering management

![Language](http://img.shields.io/badge/Language-Javascript/JSX-000000.svg) &nbsp;
![Platform](http://img.shields.io/badge/Platform-Node-000000.svg) &nbsp;
![License](http://img.shields.io/badge/License-MIT-000055.svg) &nbsp;
![Status](http://img.shields.io/travis/StoneCypher/flocks.js.svg)

[![NPM Downloads](http://img.shields.io/npm/dm/flocks.js.svg)](https://npmjs.org/package/flocks.js)

![](https://nodei.co/npm/flocks.js.png?stars=true&downloads=true)





What the hell is this?
-----------------

So [flux](http://facebook.github.io/flux/) is pretty cool.  But, I wanted
something simpler, because I wanted to move faster.  So, I created flocks - a
flux alternative.

The primary goal of `flocks.js` is ***extreme simplicity***.

There is a propaganda page developing at the website [http://flocks.rocks/](http://flocks.rocks/).



What's the big deal
-------------------

The goal of the `flux` model is unidirectional state.  That's admirable.  It
leads to large simplifications, and has a big positive impact on debugging.

However, it's also a very large amount of boilerplate, requires the implementation
of a bunch of patterns to get anything done, and provides an eight point flowchart
on how to update a value, which in practice is an under-sell of the complexity.

I wanted something *simpler*.  I wanted something that felt like a global, that
gave me transactionality, atomicity, and that didn't have me reimplementing things
every time I started.

I wanted something where just calling a function got the job done.

So I created `flocks`.



Get on with it; show some code
------------------------------

This is a complete `flocks` app which shares data between three simple controls,
all fully defined in this snippet.  The only code not present in this example
is the copies of `react` and `flocks` being pulled from CDN.

```javascript
<!doctype html>
<html>

  <head>

    <meta charset="utf-8">
    <title>Example Spinner App</title>

    <style type="text/css">
      body   { font-size: 600%; font-family: helvetica neue, sans-serif; }
      button { font-size: 50%; margin: 2em; }
    </style>

    <script defer src="http://fb.me/JSXTransformer-0.12.2.js"></script>
    <script defer src="http://fb.me/react-0.12.2.js"></script>
    <script defer src="http://cdnjs.cloudflare.com/ajax/libs/flocks.js/0.15.1/flocks.js"></script>

    <script defer type="text/jsx">

      // up button control
      var Up = flocks.createClass({
        inc:    function() { this.fset('value', this.fctx['value'] + 1) },
        render: function() { return <button onClick={this.inc}>▲</button>; }
      });

      // down button control
      var Down = flocks.createClass({
        dec:    function() { this.fset('value', this.fctx['value'] - 1) },
        render: function() { return <button onClick={this.dec}>▼</button>; }
      });

      // the application root control
      var SpinnerApp = flocks.createClass({
        render: function() { return <div><Up/>{this.fctx['value']}<Down/></div>; }
      });

      // telling flocks where to put the app control, and what that control is
      var FlocksConfig = { target: document.body, control: SpinnerApp };
      var InitialState = { value: 0 };

      // and mount the app 😄
      flocks.mount(FlocksConfig, InitialState);

    </script>

  </head>

  <body></body>

</html>
```



Why is this different?
----------------------

There's basically no boilerplate, and updating is easy.

There're no dispatchers; there're no actions; there're no stores.

It's all automatic.  You don't need to manage anything, or worry about conflicts
between actions.

Your applications become atomic, and transactional, very similar to state
machines, very close to being purely declarative.  You can validate states
before they go into place.

The simplicity is unmatched.

```javascript
var Config = {
      target  : document.body,
      control : YourControl
    },

    Data = {
      logged_in: true,
      user_name: "Bob Dobbs",
      icon: "http://upload.wikimedia.org/wikipedia/en/a/a3/Bobdobbs.png"
    },

    Update = Flocks.mount(Config, Data);
```

Done.

Want to change the state of the app?

```javascript
Update.set("user_name", "JR \"Bob\" Dobbs");
```

Done.

If you want that from inside the control, or even inside the heirarchy, that's fine; props, state, and contexts will cascade down safely and normally.

Now, you just write your app as a single control, and keep state 100% *outside* of the control heirarchy.  `:)`





How is this better?
-------------------

Atomic, transactional, centralized, easier





Would you explain more clearly?
-------------------------------

What Flocks actually does is to provide you with an update function.

To get started, tell Flocks where the mount point is and what control to use.  Then, Flocks will create that control in place, and provide you an update function.

The idea is that you're supposed to let Flocks manage the part of your application's state that gets visibly rendered.  (You can let it manage the whole state, if you want to; I often do.  But you don't have to.)

Once that's done, the whole shebang is just taken off your shoulders.  No update calls.  No dispatching.  No events.  No broadcasting.  No registration or deregistration.

Just simple prop-style updates.  It's quite liberating.





Example plox
------------

There is an [example page](http://www.flocks.rocks/flocks_examples.html)
developing at the Flocks propaganda site [http://flocks.rocks/](http://flocks.rocks/).





Endnotes
--------

Are you using my lib?  Please let me know.  I'm curious!

If you want to reach me, try `stonecypher at gmail dot com`, please.  Thanks `:)`



Polemic :neckbeard:
-------------------

`flocks` is MIT licensed, because viral licenses and newspeak language
modification are evil.  Free is ***only*** free when it's free for everyone.
