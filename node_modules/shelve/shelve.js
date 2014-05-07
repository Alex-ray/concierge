;( function ( global ) {
  "use strict" ;

  // Async function execution for client side and server side
  var next ;

  if ( typeof process === 'undefined' || typeof process.nextTick === 'undefined' ) {
    next = function (fn) { setTimeout(fn, 0); }  ;
  }

  else {
    next = process.nextTick ;
  }

  function Shelve ( ) {
      this.context ;
      this.deferred  = [ ] ;

      return this ;
  }

  /**
   * add `fn` to deferred queue if shelve has not been triggered otherwise trigger it
   * @param {Function} fn
   * @return instance
   * @api public
   */
  Shelve.prototype.defer = function defer ( fn ) {

    // Check if deferreds have been triggered
    if ( this.context !== undefined ) {
      next( fn.bind( this.context ) ) ;
    }

    else {
      this.deferred.push( fn ) ;
    }

  }

  /**
   * trigger all deferred callbacks and bind them to `context` otherwise bind to instance context
   * @param {Object} context
   * @return instance
   * @api public
   */
  Shelve.prototype.trigger = function trigger ( context ) {

    var self      = this ;
    self.context  = context === undefined ? self : context ;
    next( emit ) ;

    function emit ( ) {
      for ( var i = 0; i < self.deferred.length; i++ ) {
        var fn = self.deferred[ i ] ;
        fn.call( self.context ) ;
      }

      self.deferred = [ ] ;
    }

  }


  global.Shelve = Shelve ;

}( typeof exports === 'undefined' ? window : exports ) ) ;
