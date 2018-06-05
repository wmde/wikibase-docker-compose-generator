import Axios from 'axios';
import StringHelper from './StringHelper';
import ObjectHelper from './ObjectHelper';

import { RuntimeErrorException } from './BaseExceptions.js';

class Utils {
	static async _evaluateRequest( Response, Error, Hook ) {
		while ( Utils.isEmpty( Response ) === true ) {
			await Utils.sleep( 10 );
		}

		if ( this.isEmpty( Error ) === false ) {
			throw new RuntimeErrorException( Error );
		}

		Hook( Response );
	}

	static async _getExtern( File, Hook ) {
		let Error;
		let Response;
		Axios.get( File )
			.then( response => ( Response = response ) )
			.catch( error => ( Error = error ) );
		Utils._evaluateRequest( Response, Error, Hook );
	}

	static async _getIntern( File, Hook ) {
		let Error;
		const Response = await import( `${ File }` ).catch( error => ( Error = error ) );
		Utils._evaluateRequest( Response, Error, Hook );
	}

	static get( File, Hook ) {
		if ( File.startsWith( 'http://' ) === true ) {
			Utils._getExtern( File, Hook );
		} else {
			Utils._getIntern( File, Hook );
		}
	}

	static isEmpty( Str ) {
		if ( typeof Str === 'undefined' || Str === null ) {
			return true;
		} else {
			if ( typeof Str === 'string' ) {
				return StringHelper.isEmpty( Str );
			} else if ( Array.isArray( Str ) === true ) {
				return Array.isEmpty( Str );
			} else if ( typeof Str === 'object' ) {
				return ObjectHelper.isEmpty( Str );
			} else {
				return false;
			}
		}
	}

	static sleep( Milliseconds ) {
		return new Promise( Resolve => setTimeout( Resolve, Milliseconds ) );
	}

	static async waitUntil( Callback ) {

		while ( Callback() ) {
			await Utils.sleep( 10 );
		}
	}

	static debugObjectPrint( Object, Id ) {
		const Element = document.getElementById( Id );
		Element.innerHTML = `<pre>${ JSON.stringify( Object, undefined, 4 ) }</pre>`;
	}
}

export default Utils;
