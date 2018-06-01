<script>
import Vue from 'vue';
import Axios from 'axios';

class BaseException {
	constructor( Name, Message ) {
		this.Name = Name;
		this.Message = Message;
	}
}

class RuntimeErrorException extends BaseException {
	constructor( Message ) {
		super( 'RuntimeErrorException', Message );
	}
}

class ValueErrorException extends BaseException {
	constructor( Message ) {
		super( 'ValueErrorException', Message );
	}
}

Object.size = function ( Self ) {
	let Size = 0, Key;
	for ( Key in Self ) {
		if ( Self.hasOwnProperty( Key ) === true ) {
			Size++;
		}
	}
	return Size;
};

Object.isEmpty = function ( Self ) {
	return Object.size( Self ) === 0;
};

Object.copy = function ( Self, Depth = -1 ) {
	let Dolly, Key;

	if ( Array.isArray( Self ) === true ) {
		Dolly = Self.slice( 0 );
	} else {
		Dolly = Object.assign( {}, Self );
	}

	if ( Depth === 0 ) {
		return Dolly;
	}

	for ( Key in Dolly ) {
		if ( typeof Dolly[ Key ] === 'object' ) {
			Dolly[ Key ] = Object.copy( Dolly[ Key ], Depth - 1 );
		}
	}

	return Dolly;
};

Object.merge = function ( Object1, Object2, KeepOrign = true ) {
	let Key;
	if ( KeepOrign === true ) {
		let Return = {};
		Return = Object.assign( {}, Object1, Object2 );
		for ( Key in Return ) {
			if ( typeof Return[ Key ] === 'object' ) {
				Return[ Key ] = Object.copy( Return[ Key ] );
			}
		}

		return Return;
	} else {
		Object1 = Object.assign( {}, Object1, Object2 );
		for ( Key in Object2 ) {
			if ( typeof Object1[ Key ] === 'object' ) {
				Object1[ Key ] = Object.copy( Object1[ Key ] );
			}
		}

		return Object1;
	}
};

// just a simple implementation...we do not need for this project more
/* eslint-disable no-extend-native */
String.prototype.format = function () {
	let Index, LookAHead, UserDefinedIndex, LastStartPoint;
	const FoundFormatIndices = [];
	let Counter = 0;
	let Manual = false;
	let Return = '';
	for ( Index = 0; this.length > Index; Index++ ) {
		if ( this.charAt( Index ) === '{' ) {
			LookAHead = 1 + Index;
			UserDefinedIndex = '';
			while ( this.charCodeAt( LookAHead ) > 47 && this.charCodeAt( LookAHead ) < 58 ) {
				UserDefinedIndex += this.charAt( LookAHead );
				LookAHead++;
			}

			if ( this.charAt( LookAHead ) === '}' ) {
				if ( UserDefinedIndex.isEmpty() === false ) {
					FoundFormatIndices.push( [ Index, LookAHead, parseInt( UserDefinedIndex ) ] );
					Manual = true;
				} else {
					FoundFormatIndices.push( [ Index, LookAHead, Counter ] );
					Counter++;
				}

				Index = LookAHead;
			}
		}
	}

	if ( Counter !== 0 && Manual === true ) {
		throw new ValueErrorException(
			'Cannot switch from automatic field numbering to manual field specification.'
		);
	} else {
		if ( FoundFormatIndices.length === 0 ) {
			return this;
		} else {
			LastStartPoint = 0;
			for ( Index in FoundFormatIndices ) {
				if ( ( FoundFormatIndices[ Index ][ 2 ] in arguments ) === false ) {
					throw new ValueErrorException( 'To few arguments.' );
				}

				Return += this.substring(
					LastStartPoint,
					FoundFormatIndices[ Index ][ 0 ]
				) + arguments[ FoundFormatIndices[ Index ][ 2 ] ];
				LastStartPoint = FoundFormatIndices[ Index ][ 1 ] + 1;
			}

			Return += this.substring( LastStartPoint );
		}
	}

	return Return;
};

Array.isEmpty = function ( Self ) {
	return Self.length === 0;
};

Vue.mixin( {
	methods:
	{
		evaluateRequest: async function ( Response, Error, Hook ) {
			while ( this.isEmpty( Response ) === true ) {
				await this.sleep( 10 );
			}

			if ( this.isEmpty( Error ) === false ) {
				throw new RuntimeErrorException( Error );
			}

			Hook( Response );
		},
		getExtern: async function ( File, Hook ) {
			let Error;
			let Response;
			Axios.get( File )
				.then( response => ( Response = response ) )
				.catch( error => ( Error = error ) );
			this.evaluateRequest( Response, Error, Hook );
		},
		getIntern: async function ( File, Hook ) {
			let Error;
			const Response = await import( `${ File}` ).catch( error => ( Error = error ) );

			this.evaluateRequest( Response, Error, Hook );
		},
		get: function ( File, Hook ) {
			if ( File.startsWith( 'http://' ) === true ) {
				this.getExtern( File, Hook );
			} else {
				this.getIntern( File, Hook );
			}
		},
		isEmpty: function ( Str ) {
			if ( typeof Str === 'undefined' || Str === null ) {
				return true;
			} else {
				if ( typeof Str === 'string' ) {
					return Str.isEmpty();
				} else if ( Array.isArray( Str ) === true ) {
					return Array.isEmpty( Str );
				} else if ( typeof Str === 'object' ) {
					return Object.isEmpty( Str );
				} else {
					return false;
				}
			}
		},
		sleep: function ( Milliseconds ) {
			return new Promise( Resolve => setTimeout( Resolve, Milliseconds ) );
		},
		debugObjectPrint: function ( Object, Id ) {
			const Element = document.getElementById( Id );
			Element.innerHTML = `<pre>${ JSON.stringify( Object, undefined, 4 ) }</pre>`;
		}
	}
} );

export default
{
	name: 'BlubberUtils'
};
</script>
