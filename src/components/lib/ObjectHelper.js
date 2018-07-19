import TypeErrorException from './Exceptions/TypeErrorException';
/* eslint-disable operator-linebreak */
export default class ObjectHelper
{

	static objectSize( Obj )
	{
		let Key;
		let Size = 0;
		for ( Key in Obj )
		{
			if ( true === Obj.hasOwnProperty( Key ) )
			{
				Size++;
			}
		}
		return Size;
	}

	static isEmpty( Obj )
	{
		return 0 === ObjectHelper.objectSize( Obj );
	}

	static copyObj( Obj, Depth = -1 )
	{
		let Dolly, Key;

		if ( 'object' !== typeof Obj )
		{
			throw new TypeErrorException(
				`Expected object got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		if ( true === Array.isArray( Obj ) )
		{
			Dolly = Obj.slice( 0 );
		}
		else
		{
			Dolly = Object.assign( {}, Obj );
		}

		if ( 0 === Depth )
		{
			return Dolly;
		}

		for ( Key in Dolly )
		{
			if ( 'object' === typeof Dolly[ Key ] )
			{
				Dolly[ Key ] = ObjectHelper.copyObj( Dolly[ Key ], Depth - 1 );
			}
		}

		return Dolly;
	}

	static __mergeConditions( Merge, ToMerge, Key )
	{
		if ( true === Merge.hasOwnProperty( Key ) )
		{
			if (
				'object' === typeof Merge[ Key ]
			&&
                'object' === typeof ToMerge
			)
			{
				if (
					true === Array.isArray( Merge[ Key ] ) &&
                    true === Array.isArray( ToMerge )
				)
				{
					Merge[ Key ] = Merge[ Key ].concat( ToMerge );
				}
				else
				{
					Merge[ Key ] = ObjectHelper.mergeObj( Merge[ Key ], ToMerge );
				}
			}
			else
			{
				Merge[ Key ] = ToMerge;
			}
		}
		else
		{
			if ( 'object' === typeof ToMerge )
			{
				Merge[ Key ] = ObjectHelper.copyObj( ToMerge );
			}
			else
			{
				Merge[ Key ] = ToMerge;
			}
		}
	}

	static mergeObj()
	{
		let Index, Key, ToMerge, MergedObject;

		if ( 0 === arguments.length )
		{
			return null;
		}

		if ( 1 === arguments.length )
		{
			return ObjectHelper.copyObj( arguments[ 0 ] );
		}

		if ( 'object' !== typeof arguments[ 0 ] || true === Array.isArray( arguments[ 0 ] ) )
		{
			throw new TypeErrorException(
				`Expected object got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		MergedObject = arguments[ 0 ];
		for ( Index = 1; arguments.length > Index; Index++ )
		{
			ToMerge = arguments[ Index ];
			if ( 'object' !== typeof ToMerge || true === Array.isArray( arguments[ Index ] ) )
			{
				throw new TypeErrorException(
					`Expected object got ${ typeof ToMerge } at argument ${ Index }.`
				);
			}

			for ( Key in ToMerge )
			{
				ObjectHelper.__mergeConditions( MergedObject, ToMerge[ Key ], Key );
			}
		}

		return MergedObject;
	}
}
