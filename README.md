flocks
======

Because flux could be simpler (yay react)

![Language](http://img.shields.io/badge/Language-Javascript/JSX-000000.svg) &nbsp;
![Platform](http://img.shields.io/badge/Platform-Node-000000.svg) &nbsp;
![License](http://img.shields.io/badge/License-MIT-000055.svg) &nbsp;
![Status](http://img.shields.io/travis/StoneCypher/flocks.svg)



WARNING
-------

This is extreme pre-release software.  It works, but it's not in NPM, the commonjs stuff isn't done yet, and there's probably some bugs.  This is the right way forwards, but it's only just on the verge of ready, and bugs should be expected.

***Please consider this an alpha product.***



The hell is this?
-----------------

So [flux](http://facebook.github.io/flux/) is pretty cool.  But, I wanted something simpler, because I wanted to move faster.  So, I created flocks - a flux alternative.



What's the big deal
-------------------

Updating is easy.

```javascript
var Update = Flocks.create( document.getElementById('whatever'), YourControl );
Update( { logged_in: true, user_name: "Bob Dobbs", icon: "http://..." } );
```

If you want that from inside the control, or even inside the heirarchy, that's fine; props, state, and contexts will cascade down safely and normally.

Now, you just write your app as a single control, and keep state 100% *outside* of the control heirarchy.  `:)`

Example coming soon &trade;



Endnotes
--------

Are you using my lib?  Please let me know.  I'm curious!

If you want to reach me, try `stonecypher at gmail dot com`, please.  Thanks `:)`



Polemic :neckbeard:
-------------------

`flocks` is MIT licensed, because viral licenses and newspeak language modification are evil.  Free is ***only*** free when it's free for everyone.
