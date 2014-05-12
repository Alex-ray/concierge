var chai = require( 'chai' ).should( ) ;

describe( 'Concierge', function ( ){

  var Concierge = require('../concierge').Concierge ;
  var Shelve    = require( 'shelve' ).Shelve ;
  var deferred  = new Shelve( ) ;
  var concierge = new Concierge( deferred ) ;
  var obj = { } ;

  beforeEach( function( ) {
    obj = { } ;
    concierge.convert( obj ) ;
  }) ;

  describe( '#convert', function ( ) {

    it ( 'should have _callbacks property', function( ) {
      obj.should.have.property( '_callbacks' ).be.a( 'object' ) ;
    }) ;

    it ( 'should have _deferred property', function( ) {
      obj.should.have.property( '_deferred' ) ;
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
    });

  }) ;

  describe( '#on', function ( ) {

    it ( 'should add callback to event list', function ( ) {

      obj.on( "test", function(){} ) ;
      obj._callbacks.should.have.property( "test" ).be.a( 'array' ).have.length( 1 ) ;
      obj._callbacks = [ ] ;

    } ) ;


  } ) ;

  describe( '#off', function ( ) {

    it ( 'should remove callback of given event', function ( ) {

      var cb = function ( ) { } ;

      obj.on( "test", cb ) ;

      obj._callbacks.should.have.property( "test" ).be.a( 'array' ).have.length( 1 ) ;
      obj.off( "test", cb ) ;
      obj._callbacks[ "test" ].should.have.length( 0 ) ;

    }) ;

    it ( 'should remove all callbacks of given event', function( ) {
      obj.on( "test", function(){} ) ;

      obj._callbacks.should.have.property( "test" ).be.a( 'array' ).have.length( 1 ) ;
      obj.off( "test" ) ;
      obj._callbacks.should.not.have.property( "test" ) ;

    }) ;

    it ( 'should remove all callbacks', function ( ) {

      obj.on( "test", function(){} ) ;
      obj._callbacks.should.have.property( "test" ).be.a( 'array' ).have.length( 1 ) ;
      obj.off( ) ;
      Object.keys( obj._callbacks ).should.have.length( 0 ) ;

    } ) ;

  } ) ;

  describe( '#once', function ( ) {

    it ( 'should add event and only emit once', function ( done ) {

      var cbs1  = [ ] ;
      var cbs2  = [ ] ;
      var event = "1" ;

      var cb1 = function ( ) { cbs1.push( true ) ; } ;
      var cb2 = function ( ) { cbs2.push( true ) ; if ( cbs2.length === 2 ) validate( ) ; } ;

      obj.called = true ;

      obj.once( event, cb1 ) ;
      obj.on( event, cb2 ) ;

      obj.emit( event ) ;
      obj.emit( event ) ;

      function validate ( ) {
        cbs1.should.have.length( 1 ) ;
        cbs2.should.have.length( 2 ) ;
        done( ) ;
      }

    } ) ;

  } ) ;

  describe( '#emit', function ( ) {

    it ( 'should emit event for all callbacks', function ( done ) {
      var cbs = [ ] ;
      var event = 'test' ;

      var cb = function ( ) { cbs.push( this.event ) ; if ( cbs.length === 3 ) validate( ) ; } ;

      obj.on( event, cb ) ;
      obj.on( event, cb ) ;
      obj.on( event, cb ) ;

      obj.emit( event ) ;

      function validate ( ) {
        cbs.should.have.length( 3 ) ;
        done( ) ;
      }

      obj.off( event ) ;

    }) ;


    it ( 'should pass correct agruments to all callbacks ', function ( done ) {
      var event = 'test' ;

      var testStr = 'foo' ;
      var testInt = 1 ;

      var testArr = ['bar'] ;
      var testObj = { foo: 'bar' } ;

      var testBool = true ;

      obj.on( event, function ( str, int, arr, obj, bool ) {
        str.should.equal( testStr ) ;
        int.should.equal( testInt ) ;
        arr.should.equal( testArr ) ;
        obj.should.equal( testObj ) ;
        bool.should.equal( testBool ) ;
        done( ) ;
      } ) ;

      obj.emit( event , testStr , testInt , testArr , testObj , testBool )  ;

    } ) ;

  } ) ;

}) ;
