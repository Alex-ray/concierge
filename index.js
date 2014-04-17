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
      next( fn.bind( context ) ) ;
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
  concierge.listeners    = listeners ;
  concierge.hasListeners = hasListeners ;

  global.concierge = concierge ;

  function convert ( object ) {
    var keys = Object.keys( concierge ) ;

    for ( var i = 0; i < keys.length; i++ ) {
      var key = keys[ i ] ;

      if ( object[ key ] === undefined ) {
        object[ key ] = concierge[ key ] ;
      }

    }

    return object ;

  }

  function on (){}
  function off (){}
  function once (){}
  function emit (){}
  function listeners(){}
  function hasListeners(){}
}( exports === undefined ? window : exports ) );
