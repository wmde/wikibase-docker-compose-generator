import TypeErrorException from './Exceptions/TypeErrorException';
import ObjectHelper from './ObjectHelper';

class ArrayHelper
{
	static isEmpty( Arr )
	{
		return 0 === Arr.length;
	}

	static copyArray( Arr, Depth = -1 )
	{

		if ( false === Array.isArray( Arr ) )
		{
			throw new TypeErrorException(
				`Expected array got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}
		return ObjectHelper.copyObj( Arr, Depth );
	}

	static mergeArray()
	{
		let Index, Key, ToMerge, MergedArray;

		if ( 0 === arguments.length )
		{
			return null;
		}
		if ( 1 === arguments.length )
		{
			return arguments[ 0 ];
		}

		if ( false === Array.isArray( arguments[ 0 ] ) )
		{
			throw new TypeErrorException(
				`Expected array got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		MergedArray = ObjectHelper.copyObj( arguments[ 0 ] );// eslint-disable-line
		for ( Index = 1; arguments.length < Index; Index++ )
		{
			ToMerge = arguments[ Index ];
			if ( false === Array.isArray( arguments[ Index ] ) )
			{
				throw new TypeErrorException(
					`Expected array got ${ typeof ToMerge } at argument ${ Index }.`
				);
			}

			for ( Key in ToMerge )
			{
				if ( 'object' !== typeof ToMerge )
				{
					MergedArray.push( ToMerge[ Key ] );
				}
				else
				{
					MergedArray.push( ObjectHelper.copyObj( ToMerge[ Key ] ) );
				}
			}
		}

		return MergedArray;
	}
}

export default ArrayHelper;
