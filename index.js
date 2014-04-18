; ( function( global ){
  "use strict" ;

  // Shelve
  // Async function execution for client side and server side
  var next = (typeof process === 'undefined' || typeof process.nextTick === 'undefined' ) ? function (fn) { setTimeout(fn, 0); } : process.nextTick ;

  function Shelve ( ) {
      this.context ;
      this.deferred = [ ] ;

      return this ;
  }

  Shelve.prototype.defer = function defer ( fn ) {

    // Check if deferreds have been triggered
    if ( this.context !== undefined ) {
      next( fn.bind( this.context ) ) ;
    }

    else {
      this.deferred.push( fn ) ;
    }


  }

  Shelve.prototype.trigger = function trigger ( context ) {

    this.context = context === undefined ? this : context ;
    var context = this.context ;

    for ( var i = 0; i < this.deferred.length; i++ ) {
      var fn = this.deferred[ i ] ;
      if ( typeof fn === 'function' ) {
        next( fn.bind( context ) ) ;
      }
    }

    this.deferred = [ ] ;

  }

  // Concierge

  var concierge = { } ;

  concierge._callbacks   = { } ;
  concierge.convert      = convert ;
  concierge.on           = on ;
  concierge.off          = off ;
  concierge.once         = once ;
  concierge.emit         = emit ;

  global.concierge = concierge ;

  /**
   * Convert a given `object` to inhert concierge's api
   * @param {Object} object
   * @return {Object} object
   * @api public
   */

  function convert ( object ) {
    concierge._callbacks = { } ;

    var keys = Object.keys( concierge ) ;

    for ( var i = 0; i < keys.length; i++ ) {
      var key = keys[ i ] ;

      if ( object[ key ] === undefined ) {
        object[ key ] = concierge[ key ] ;
      }

    }

    return object ;
  }

  /**
   * Listen on the givin `event` with `fn`
   * @param {String} event
   * @param {Function} fn
   * @return {Object} emitter
   * @api public
   */

  function on ( event, fn ) {
    if ( this._callbacks[ event ] === undefined ) {
      this._callbacks[ event ] = [ ] ;
    }

    this._callbacks[ event ].push( fn ) ;

    return this ;
  }

  /**
   * Remove callback `fn` for `event` or remove all callbacks
   * @param {String} event
   * @param {Function} fn
   * @return {Object} emitter
   * @api public
   */

  function off ( event, fn ) {
    if ( this._callbacks[ event ] === undefined ) {
      this._callbacks = { } ;
      return this ;
    }

    // remove all handlers
    if ( fn === undefined ) {
      delete this._callbacks[ event ] ;
      return this ;
    }

    // remove specific handler
    var cb ;
    for ( var i = 0; i < this._callbacks[ event ].length; i++ ) {
      cb = this._callbacks[ event ][ i ] ;
      if ( cb === fn || cb.once === true ) {
        this._callbacks[ event ].splice( i, 1 ) ;
        break ;
      }
    }

    return this ;
  }

  /**
   * Add callback 'fn' for 'event' and remove when 'fn' is emitted
   * @param {String} event
   * @param {Function} fn
   * @return {Object} emitter
   * @api public
   */

  function once ( event, fn ) {
    var self = this;

    function on ( ) {
      fn.apply( this, arguments ) ;
    }

    on.once = true ;
    this.on( event, on ) ;

    return this ;
  }

  /**
   * call all callbacks in 'event' with args list
   * @param {String} event
   * @return {Object} emitter
   * @api public
   */
  function emit ( event ) {
    if ( this._callbacks[ event ] === undefined ) {
      return this ;
    }

    var once    = [ ] ;
    var args    = [].slice.call( arguments, 1 ) ;
    var context = this ;
    var cbs     = this._callbacks[ event ] ;
    var queue   = new Shelve( ) ;

    for ( var i = 0; i < cbs.length; i++ ) {
      var cb = cbs[ i ] ;

      if ( cb.once !== undefined ) {
        once.push( i ) ;
      }

      var cb = _generateCallback( cbs[ i ], context, args ) ;
      queue.defer( cb ) ;
    }

    for ( var i = 0; i < once.length; i++ ) {
      var removeIndex = once[ i ] ;
      this._callbacks[ event ].splice(  removeIndex , 1 ) ;
    }

    queue.trigger( this ) ;
    return this ;
  }

  function _generateCallback ( cb, context, args ) {
    return function ( ) {
      cb.apply( this, args ) ;
    } ;
  }

}( exports === undefined ? window : exports ) );