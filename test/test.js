var chai = require( 'chai' ).should( ) ;

describe( 'Concierge', function ( ){

  var concierge = require('../index').concierge ;

  describe( 'convert', function ( ) {

    it ( 'should have convert property', function( ) {
      concierge.should.have.property( 'convert' ).be.a( 'function' ) ;
    }) ;


    // var o = { } ;
    // concierge.convert( o ) ;
    //
    // o.should.have.property('_callbacks').be.a("object")  ;

  }) ;

}) ;
