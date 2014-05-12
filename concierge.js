; ( function( global ){
  "use strict" ;

  // Concierge
  function Concierge ( deferred ) {
    this._deferred = deferred ;
  }

  Concierge.prototype.convert = convert ;

  /**
   * Convert a given `object` to inhert concierge's api
   * @param {Object} object
   * @return {Object} object
   * @api public
   */

  function convert ( object ) {

    if ( typeof object._callbacks === "undefined" ) object._callbacks = { } ;
    if ( typeof object._deferred  === "undefined" ) object._deferred  = this._deferred ;
    if ( typeof object.on         === "undefined" ) object.on         = on ;
    if ( typeof object.off        === "undefined" ) object.off        = off ;
    if ( typeof object.once       === "undefined" ) object.once       = once ;
    if ( typeof object.emit       === "undefined" ) object.emit       = emit ;

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
    return _add( this, event, fn , false ) ;
  }

  /**
   * Add callback 'fn' for 'event' and remove when 'fn' is emitted
   * @param {String} event
   * @param {Function} fn
   * @return {Object} emitter
   * @api public
   */

  function once ( event, fn ) {
    return _add( this, event, fn , true ) ;
  }

  /**
   * Remove callback `fn` for `event` or remove all callbacks
   * @param {String} event
   * @param {Function} fn
   * @return {Object} emitter
   * @api public
   */

  function off ( event, fn ) {

    // remove all handlers
    if ( event === undefined ) {
      this._callbacks = { } ;
      return true ;
    }

    if ( this._callbacks[ event ] === undefined ) {
      return false ;
    }

    // remove all event handlers
    if ( fn === undefined ) {
      delete this._callbacks[ event ] ;
      return true ;
    }

    // remove specific handler
    var cb ;

    for ( var i = 0; i < this._callbacks[ event ].length; i++ ) {

      cb = this._callbacks[ event ][ i ][ 0 ] ;

      if ( cb === fn ) {
        this._callbacks[ event ].splice( i, 1 ) ;
        break ;
      }

    }

    return true ;
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
    var all     = [ ] ;
    var args    = [ ].slice.call( arguments, 1 ) ;
    var cbs     = this._callbacks[ event ] ;

    for ( var i = 0; i < cbs.length; i++ ) {
      var cb     = cbs[ i ][ 0 ] ;
      var isOnce = cbs[ i ][ 1 ] ;

      if ( isOnce === true ) {
        once.push( i ) ;
      }

      all.push( cb ) ;
    }

    for ( var i = 0; i < once.length; i++ ) {
      var removeIndex = once[ i ] ;
      this._callbacks[ event ].splice(  removeIndex , 1 ) ;
    }

    for ( var i = 0; i < all.length; i++ ) {
      var cb = _generateCallback( all[ i ]  , this, args ) ;
      this._deferred.defer( cb ) ;
    }

    return this ;
  }

  // PRIVATE

  function _add ( context, event, fn, isOnce ) {
    if ( context._callbacks[ event ] === undefined ) {
      context._callbacks[ event ] = [ ] ;
    }

    context._callbacks[ event ].push( [ fn, isOnce ] ) ;

    return true ;
  }

  function _generateCallback ( cb, context, args ) {
    return function ( ) {
      cb.apply( context, args ) ;
    } ;
  }

  global.Concierge = Concierge ;

}( typeof window === "undefined" ? this : window ) );
