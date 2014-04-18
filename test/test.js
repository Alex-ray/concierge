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
    it ( 'should add event and only emit once', function ( done ) {

      var o = { } ;
      var cbs1 = [ ] ;
      var cbs2 = [ ] ;
      o.called = true ;
      var event = "1" ;
      var cb1 = function ( ) { cbs1.push( this.called ) ; } ;
      var cb2 = function ( ) { cbs2.push( this.called ) ; if ( cbs2.length === 2 ) validate( ) ; } ;

      concierge.convert( o ) ;

      o.once( event, cb1 ) ;
      o.on( event, cb2 ) ;

      o.emit( event ) ;
      o.emit( event ) ;

      function validate ( ) {
        cbs1.should.have.length( 1 ) ;
        cbs2.should.have.length( 2 ) ;
        done( ) ;
      }

    } ) ;
  } ) ;

  describe( '#emit', function ( ) {

    it ( 'should emit event for all callbacks', function ( done ) {
      var o = { } ;
      var cbs = [ ] ;
      o.event = '2' ;
      var cb = function ( ) { cbs.push( this.event ) ; if ( cbs.length === 3 ) validate( ) ; } ;

      concierge.convert( o ) ;

      o.on( o.event, cb ) ;
      o.on( o.event, cb ) ;
      o.on( o.event, cb ) ;

      o.emit( o.event ) ;

      function validate ( ) {
        cbs.should.have.length( 3 ) ;
        done( ) ;
      }

    }) ;


    it ( 'should pass correct agruments to all callbacks : ', function ( done ) {
      var o = { } ;
      o.event = '3' ;
      var testStr = 'foo' ;
      var testInt = 1 ;
      var testArr = ['bar'] ;
      var testObj = {foo:'bar'} ;
      var testBool = true ;

      concierge.convert( o ) ;

      o.on( o.event, function ( str, int, arr, obj, bool ) {
        str.should.equal( testStr ) ;
        int.should.equal( testInt ) ;
        arr.should.equal( testArr ) ;
        obj.should.equal( testObj ) ;
        bool.should.equal( testBool ) ;
        done( ) ;
      } ) ;

      o.emit( o.event , testStr , testInt , testArr , testObj , testBool )  ;

    } ) ;
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
