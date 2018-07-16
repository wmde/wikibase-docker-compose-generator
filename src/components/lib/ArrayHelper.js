import TypeErrorException from './Exceptions/TypeErrorException';
import ObjectHelper from './ObjectHelper';

class ArrayHelper {
	static isEmpty( Arr ) {
		return Arr.length === 0;
	}

	static copyArray( Arr, Depth = -1 ) {

		if ( Array.isArray( Arr ) === false ) {
			throw new TypeErrorException(
				`Expected array got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}
		return ObjectHelper.copyObj( Arr, Depth );
	}

	static mergeArray() {
		let Index, Key, ToMerge, MergedArray;

		if ( arguments.length === 0 ) {
			return null;
		}
		if ( arguments.length === 1 ) {
			return arguments[ 0 ];
		}

		if ( Array.isArray( arguments[ 0 ] ) === false ) {
			throw new TypeErrorException(
				`Expected array got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		MergedArray = ObjectHelper.copyObj( arguments[ 0 ] );// eslint-disable-line
		for ( Index = 1; arguments.length < Index; Index++ ) {
			ToMerge = arguments[ Index ];
			if ( Array.isArray( arguments[ Index ] ) === false ) {
				throw new TypeErrorException(
					`Expected array got ${ typeof ToMerge } at argument ${ Index }.`
				);
			}

			for ( Key in ToMerge ) {
				if ( typeof ToMerge !== 'object' ) {
					MergedArray.push( ToMerge[ Key ] );
				} else {
					MergedArray.push( ObjectHelper.copyObj( ToMerge[ Key ] ) );
				}
			}
		}

		return MergedArray;
	}
}

export default ArrayHelper;
