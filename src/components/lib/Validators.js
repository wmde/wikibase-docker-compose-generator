import Utils from '../../Utils';
/* eslint-disable operator-linebreak */
export default class Validators
{
	static InvalidPortNoInteger = 'The given value is not an integer.';
	static InvalidPortWellKnown = 'Do not use wellknown ports.';
	static InvalidPortInUse = 'The given port is allready in use.';
	static InvalidString = 'The given value is not an valid string.';
    static InvalidStringCharacter = 'The given value contain(s) an invalid character(s) ';
	static __LastInteger;
	static __UsedPorts = [];
	static StringPattern = new RegExp( /[^a-zA-Z0-9_]/g );

	static isInteger( Integer )
	{
		let Index, CharCode;
		if ( 'number' === typeof Integer )
		{
			Integer = `${ Integer }`;
		}
		else if ( 'string' !== typeof Integer )
		{
			return false;
		}

		for ( Index = 0; Index < Integer.length; Index++ )
		{
			CharCode = Integer.charCodeAt( Index );
			if ( 48 > CharCode || 57 < CharCode )
			{
				return false;
			}
		}

		Validators.__LastInteger = parseInt( Integer );
		return true;
	}

	static containsPort( Value )
	{
		if ( -1 === Utils.binarySearch( Validators.__UsedPorts, Value ) )
		{
			return false;
		}
		else
		{
			return true;
		}
	}

	static removePort( Value )
	{
		const Index = Utils.binarySearch( Validators.__UsedPorts, Value );
		if ( -1 === Index )
		{
			return;
		}

		Validators.__UsedPorts.splice( Index, 1 );
	}

	static clearPorts()
	{
		Validators.__UsedPorts.length = 0;
	}

	static port( Value )
	{
		let InsertIndex;
		if ( false === Validators.isInteger( Value ) )
		{
			return [ Validators.InvalidPortNoInteger ];
		}

		if ( 1024 >= Validators.__LastInteger )
		{
			return [ Validators.InvalidPortWellKnown ];
		}
		// eslint-disable-next-line
		InsertIndex = Utils.binaryInsertSearch( Validators.__UsedPorts, Validators.__LastInteger );
		if ( 0 > InsertIndex )
		{
			Validators.__UsedPorts.splice(
				-( InsertIndex + 1 ),
				0,
				Value
			);
		}
		else
		{
			return [ Validators.InvalidPortInUse ];
		}

		return [];
	}

	static string( Value )
	{
		if (
			'string' !== typeof Value
		||
            0 === Value.length
		)
		{
			return [ Validators.InvalidString ];
		}

		if ( true === Validators.StringPattern.test( Value ) )
		{
			return [ `${ Validators.InvalidStringCharacter }: ${ Value.match( Validators.StringPattern ) }` ];
		}
		return [];
	}
}
