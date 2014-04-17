var chai = require( 'chai' ).should( ) ;

describe( 'Concierge', function ( ){

  var concierge = require('../index').concierge ;

  hasDefaultProps( concierge ) ;

  describe( '#convert', function ( ) {

    it ( 'should convert object to concierge objects', function ( ) {
      var o = { } ;
      concierge.convert( o ) ;
      hasDefaultProps( o ) ;
    } ) ;

    it ( 'should not overwrite existing properties', function ( ) {
      var o = { } ;
      o.convert = "converting" ;
      concierge.convert( o ) ;
      o.convert.should.be.a( 'string' ) ;
    } ) ;

  }) ;

  describe( '#on', function ( ) {

    it ( 'should add callback to event list', function ( ) {

      var o = { } ;
      o.foo = "foo";
      var event = "test" ;
      concierge.convert( o ) ;
      o.on( event, function(){} ) ;
      o._callbacks.should.have.property( event ).be.a( 'array' ).have.length( 1 ) ;

    } ) ;

  } ) ;

  describe( '#off', function ( ) {

    it ( 'should remove callback for given event and callback', function ( ) {

      var o = { } ;
      var event = "test" ;
      var cb    = function(){ } ;
      concierge.convert( o ) ;
      o.on( event, cb ) ;
      o._callbacks.should.have.property( event ).be.a( 'array' ).have.length( 1 ) ;
      o.off( event, cb ) ;
      o._callbacks[event].should.have.length( 0 ) ;

    }) ;

    it ( 'should remove all call backs of given event if second argument is not a function ', function( ) {

      var o = { } ;
      var event = "test" ;
      var cb    = function(){ } ;
      concierge.convert( o ) ;
      o.on( event, cb ) ;
      o._callbacks.should.have.property( event ).be.a( 'array' ).have.length( 1 ) ;
      o.off( event ) ;
      o._callbacks.should.not.have.property(event) ;

    }) ;

    it ( 'should remove all callbacks if not event is passed in', function ( ) {

      var o = { } ;
      var event = "test" ;
      var cb    = function(){ } ;
      concierge.convert( o ) ;
      o.on( event, cb ) ;
      o._callbacks.should.have.property( event ).be.a( 'array' ).have.length( 1 ) ;
      o.off( ) ;
      Object.keys( o._callbacks ).should.have.length( 0 ) ;

    } ) ;

  } ) ;

  describe( '#once', function ( ) {
    it ( 'should add event and only emit once', function ( ) {

      var o = { } ;
      var cbs = [ ] ;
      o.called = true ;
      var event = "1" ;
      var cb1 = function ( ) { cbs.push( this.called ) ; } ;
      concierge.convert( o ) ;

      o.once( event, cb1 ) ;

      o.emit( event ) ;
      o.emit( event ) ;

      cbs.should.have.length( 1 ) ;

    } ) ;
  } ) ;

  describe( '#emit', function ( ) {

    it ( 'should emit event for all callbacks', function ( ) {
      var o = { } ;
      var cbs = [ ] ;
      o.event = '1' ;
      var cb = function ( ) { cbs.push( this.event ) ; } ;

      concierge.convert( o ) ;

      o.on( o.event, cb ) ;
      o.on( o.event, cb ) ;
      o.on( o.event, cb ) ;

      o.emit( o.event ) ;

      cbs.should.have.length( 3 ) ;
    }) ;
  } ) ;


  function hasDefaultProps ( obj ) {

    it ( 'should have _callbacks property', function( ) {
      obj.should.have.property( '_callbacks' ).be.a( 'object' ) ;
    }) ;

    it ( 'should have convert property', function( ) {
      obj.should.have.property( 'convert' ).be.a( 'function' ) ;
    }) ;

    it ( 'should have on property', function( ) {
      obj.should.have.property( 'on' ).be.a( 'function' ) ;
    }) ;

    it ( 'should have off property', function( ) {
      obj.should.have.property( 'off' ).be.a( 'function' ) ;
    }) ;

    it ( 'should have once property', function( ) {
      obj.should.have.property( 'once' ).be.a( 'function' ) ;
    }) ;

    it ( 'should have emit property', function( ) {
      obj.should.have.property( 'emit' ).be.a( 'function' ) ;
    }) ;

  }

}) ;
