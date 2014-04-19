# Concierge JS

A simple deferred async event emitting library

### Installation

  **Node** **:**

  simply install through npm. ( node package manager )
```javascript
  npm install concierge
```

  **Browser** **:**<br>

download concierge.js and include it in your site directory

### Loading

  **Node** **:**
```javascript
  var concierge = require( 'concierge' ) ;
```

  **Browser** **:**
```html
  <script src="concierge.js"></script>
```

### Using

  Transform any `Object` into an event emitter with an interface of
```javascript
  var o = { } ;
  concierge.convert( o ) ;
  o.on   {Function}
  o.once {Function}
  o.off  {Function}
  o.emit {Function}
```

### concierge.on
  Takes an event and a callback that is called each time the event is emitted
```javascript
  o.on( 'uniqEvent', function ( args ) {
    // called when o.emit( 'uniqEvent', args ) is called
  } ) ;
```
### concierge.once
  Takes an event and a callback that is only called once
```javascript
  o.once( 'uniqEvent', function ( args ) {
    // only called once
  } ) ;
```
### concierge.off
  Takes an event and the function you want to stop listening to
  if no function is passed in it will remove all listeners from that event
```javascript
  o.off( 'uniqEvent', callback ) ;
  o.off( 'uniqEvent' ) ;
```
### concierge.emit
  Will call all callbacks of the given event with all arguments following
```javascript
  o.emit( 'uniqEvent', arg1, arg2, ...) ;
```
##### Chainable

All methods are chain-able and the concierge object is available globally
```javascript
  var o = { } ;
  concierge.convert( o ) ;
  o.on( 'event', function () { } )
  .off( 'otherEvent' )
  .emit( 'somethingElse');
```
