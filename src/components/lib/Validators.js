import Utils from '../../Utils';
/* eslint-disable operator-linebreak */
export default class Validators {
	static InvalidPortNoInteger = 'The given value is not an integer.';
	static InvalidPortWellKnown = 'Do not use wellknown ports.';
	static InvalidPortInUse = 'The given port is allready in use.';
	static InvalidString = 'The given value is not an valid string.';
	static InvalidStringCharacter = 'The given value contain(s) an invalid character(s) - ';
	static InvalidSQLFirstCharacter = 'The first character is invalid - it should be a character or # or _.';
	static InvalidSQLRestCharacter = 'The given value contain(s) an invalid character(s) - ';
	static __LastInteger;
	static __UsedPorts = [];
	static StringPattern = new RegExp( /[^a-zA-Z0-9_]/g );
	static SQLPatternFirst = new RegExp( /^[^a-zA-Z_#@]/ );
	static SQLPatternRest = new RegExp( /[^0-9a-zA-Z$_#@]/g );

	static isInteger( Integer ) {
		let Index, CharCode;
		if ( typeof Integer === 'number' ) {
			Integer = `${ Integer }`;
		} else if ( typeof Integer !== 'string' ) {
			return false;
		}

		for ( Index = 0; Index < Integer.length; Index++ ) {
			CharCode = Integer.charCodeAt( Index );
			if ( CharCode < 48 || CharCode > 57 ) {
				return false;
			}
		}

		Validators.__LastInteger = parseInt( Integer );
		return true;
	}

	static containsPort( Value ) {
		if ( Utils.binarySearch( Validators.__UsedPorts, Value ) === -1 ) {
			return false;
		} else {
			return true;
		}
	}

	static removePort( Value ) {
		const Index = Utils.binarySearch( Validators.__UsedPorts, Value );
		if ( Index === -1 ) {
			return;
		}

		Validators.__UsedPorts.splice( Index, 1 );
	}

	static clearPorts() {
		Validators.__UsedPorts.length = 0;
	}

	static port( Value ) {
		let InsertIndex;
		if ( Validators.isInteger( Value ) === false ) {
			return [ Validators.InvalidPortNoInteger ];
		}

		if ( Validators.__LastInteger <= 1024 ) {
			return [ Validators.InvalidPortWellKnown ];
		}
		// eslint-disable-next-line
		InsertIndex = Utils.binaryInsertSearch( Validators.__UsedPorts, Validators.__LastInteger );
		if ( InsertIndex < 0 ) {
			Validators.__UsedPorts.splice(
				-( InsertIndex + 1 ),
				0,
				Value
			);
		} else {
			return [ Validators.InvalidPortInUse ];
		}

		return [];
	}

	static string( Value ) {
		if (
			typeof Value !== 'string'
		||
			Value.length === 0
		) {
			return [ Validators.InvalidString ];
		}

		if ( Validators.StringPattern.test( Value ) === true ) {
			return [ `${ Validators.InvalidStringCharacter }: ${ Value.match( Validators.StringPattern ) }` ];
		}
		return [];
	}

	static sqlIdentifier( Value ) {
		if (
			typeof Value !== 'string'
		||
			Value.length === 0
		) {
			return [ Validators.InvalidString ];
		}

		if ( Validators.SQLPatternFirst.test( Value ) === true ) {
			return [ `${ Validators.InvalidSQLFirstCharacter }` ];
		}

		if ( Validators.SQLPatternRest.test( Value ) === true ) {
			return [ `${ Validators.InvalidSQLRestCharacter }: ${ Value.match( Validators.SQLPatternRest ) }` ];
		}
		return [];
	}
}
