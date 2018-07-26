import Utils from '../../Utils';

export default class Validators
{
	static InvalidPortNoInteger;
	static InvalidPortWellKnown;
	static InvalidPortInUse;
	static InvalidString;
	static __LastInteger;
	static __UsedPorts = {};

	static isInteger( Integer )
	{
		let Index;
		if ( 'number' === typeof Integer )
		{
			Integer = `${ Integer }`;
		}
		else if ( 'string' !== typeof Integer )
		{
			return false;
		}

		for ( Index in Integer )
		{
			if ( 48 > Integer[ Index ] && 57 < Integer[ Index ] )
			{
				return false;
			}
		}

		Validators.__LastInteger = parseInt( Integer );
		return true;
	}

	static string( Value )
	{
		if ( 'string' !== typeof Value || 0 === Value.length )
		{
			return [ Validators.InvalidString ];
		}

		return [];
	}

	static containsPort( Value )
	{
        if( -1 === Utils.binarySearch( Validators.__UsedPorts, Value ) )
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

	static ports( Value )
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

		InsertIndex = Utils.binaryInsertSearch( Validators.__UsedPorts, Validators.__LastInteger );
		if( 0 > InsertIndex )
		{
            Validators.__UsedPorts.splice(
                -( InsertIndex + 1 ),
                0,
                Value
			)
		}
		else
		{
			return [ Validators.InvalidPortInUse ];
		}

		return [];
	}
}
