; ( function( global ){
  "use strict" ;

  // Concierge
  function Concierge ( deferred ) {
    this._callbacks = { } ;
    this.deferred = deferred ;
  }

  Concierge.prototype.on      = on ;
  Concierge.prototype.off     = off ;
  Concierge.prototype.once    = once ;
  Concierge.prototype.emit    = emit ;
  Concierge.prototype.convert = convert ;

  /**
   * Convert a given `object` to inhert concierge's api
   * @param {Object} object
   * @return {Object} object
   * @api public
   */

  function convert ( object ) {

    object._callbacks = { } ;
    object.deferred   = this.deferred ;
    object.on   = this.on ;
    object.off  = this.off ;
    object.once = this.once ;
    object.emit = this.emit ;

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

    var context = this ;
    var once    = [ ] ;
    var args    = [ ].slice.call( arguments, 1 ) ;
    var cbs     = this._callbacks[ event ] ;

    for ( var i = 0; i < cbs.length; i++ ) {
      var cb = cbs[ i ] ;

      if ( cb.once !== undefined ) {
        once.push( i ) ;
      }

      var cb = _generateCallback( cbs[ i ], context, args ) ;
      this.deferred.defer( cb ) ;
    }

    for ( var i = 0; i < once.length; i++ ) {
      var removeIndex = once[ i ] ;
      this._callbacks[ event ].splice(  removeIndex , 1 ) ;
    }

    return this ;
  }

  /**
   * creates a scoped callback that calls `cb` in the context of `context` with arguments `args`
   * @param {Function} cb
   * @param {Object} context
   * @param {Array} args
   * @return {Function} anonymous
   * @api private
   */
  function _generateCallback ( cb, context, args ) {
    return function ( ) {
      cb.apply( context, args ) ;
    } ;
  }

  global.Concierge = Concierge ;

}( typeof window === "undefined" ? this : window ) );
