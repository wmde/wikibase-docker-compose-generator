import { ValueErrorException, TypeErrorException } from './BaseExceptions';

class StringHelper {
	static isEmpty( Str ) {
		return Str.length === 0;
	}

	static __removeBracesFormattedString( Str ) {
		return Str.substring( 1, Str.length - 1 );
	}

	static __readComplexFormattedString( Str ) {
		let Match;
		const FoundFormatIndices = [];
		const NameExpression = /(\{[_$%&§!]*[a-zA-Z0-9]+([_$%&§!]*[a-zA-Z0-9]*)*\})|(\{\})/g;

		do {
			Match = NameExpression.exec( Str );
			if ( Match !== null ) {
				if ( Match[ 0 ] === '{}' ) {
					throw new ValueErrorException(
						'Cannot switch from automatic field numbering to manual field specification.'
					);
				}
				// @last argument -> remove first and last index is remove braces
				FoundFormatIndices.push( [ Match.index,
					Match.index + Match[ 0 ].length,
					StringHelper.__removeBracesFormattedString( Match[ 0 ] )
				] );
			}
		}
		while ( Match !== null );

		return FoundFormatIndices;
	}

	static __readLookAHeadFormattedString( Str, LookAHead ) {
		let UserDefinedIndex = '';
		LookAHead++;

		while ( Str.charAt( LookAHead ) > '/' && Str.charAt( LookAHead ) < ':' ) {
			UserDefinedIndex += Str.charAt( LookAHead );
			LookAHead++;
		}

		return [ LookAHead, UserDefinedIndex ];
	}

	static __readSimpelFormattedString( Str ) {
		let Index, LookAHead, UserDefinedIndex;
		const FoundFormatIndices = [];
		let Manual = false;
		let Counter = 0;

		for ( Index = 0; Str.length > Index; Index++ ) {
			if ( Str.charAt( Index ) === '{' ) {

				UserDefinedIndex = StringHelper.__readLookAHeadFormattedString( Str, Index );
				LookAHead = UserDefinedIndex[ 0 ];
				UserDefinedIndex = UserDefinedIndex[ 1 ];

				if ( Str.charAt( LookAHead ) !== '}' ) {
					throw new ValueErrorException( `Expected token { got ${ Str.charAt( LookAHead ) }.` );
				}

				LookAHead++;

				if ( StringHelper.isEmpty( UserDefinedIndex ) === false ) {
					FoundFormatIndices.push( [ Index, LookAHead, parseInt( UserDefinedIndex ) ] );
					Manual = true;
				} else {
					FoundFormatIndices.push( [ Index, LookAHead, Counter ] );
					Counter++;
				}

				Index = LookAHead;
			}
		}

		if ( Counter !== 0 && Manual === true ) {
			throw new ValueErrorException( 'Cannot switch from automatic field numbering to manual field specification.' );
		}

		return FoundFormatIndices;
	}

	static format( Str ) {
		let Model, FoundFormatIndices, Index, LastStartPoint;
		let Return = '';
		const Arguments = [];

		if ( typeof Str !== 'string' ) {
			throw new TypeErrorException( `Expected string as first parameter got ${ typeof Str }.` );
		}

		// just to fix the behavior of arguments...it should be a array
		for ( Index = 1; arguments.length > Index; Index++ ) {
			Arguments.push( arguments[ Index ] );
		}

		if ( Array.isArray( Arguments[ 0 ] ) === true ) {
			FoundFormatIndices = StringHelper.__readSimpelFormattedString( Str );
			Model = Arguments[ 0 ];
		} else if	( typeof Arguments[ 0 ] !== 'object' ) {
			FoundFormatIndices = StringHelper.__readSimpelFormattedString( Str );
			Model = Arguments;
		} else {
			FoundFormatIndices = StringHelper.__readComplexFormattedString( Str );
			Model = Arguments[ 0 ];
		}

		if ( FoundFormatIndices.length === 0 ) {
			return Str;
		}

		LastStartPoint = 0;
		for ( Index in FoundFormatIndices ) {
			if ( ( FoundFormatIndices[ Index ][ 2 ] in Model ) === false ) {
				throw new ValueErrorException(
					`Unknown format key ${FoundFormatIndices[ Index ][ 2 ]}.`
				);
			}

			Return +=	Str.substring( LastStartPoint, FoundFormatIndices[ Index ][ 0 ] ) +
								Model[ FoundFormatIndices[ Index ][ 2 ] ];
			LastStartPoint = FoundFormatIndices[ Index ][ 1 ];

		}

		Return += Str.substring( LastStartPoint );

		return Return;
	}
}

export default StringHelper;
