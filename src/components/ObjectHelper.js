import TypeErrorException from './BaseExceptions';

class ObjectHelper {

	static objectSize( Obj ) {
		let Key;
		let Size = 0;
		for ( Key in Obj ) {
			if ( Obj.hasOwnProperty( Key ) === true ) {
				Size++;
			}
		}
		return Size;
	}

	static isEmpty( Obj ) {
		return ObjectHelper.objectSize( Obj ) === 0;
	}

	static copyObj( Obj, Depth = -1 ) {
		let Dolly, Key;

		if ( typeof Obj !== 'object' ) {
			throw new TypeErrorException(
				`Expected object got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		if ( Array.isArray( Obj ) === true ) {
			Dolly = Obj.slice( 0 );
		} else {
			Dolly = Object.assign( {}, Obj );
		}

		if ( Depth === 0 ) {
			return Dolly;
		}

		for ( Key in Dolly ) {
			if ( typeof Dolly[ Key ] === 'object' ) {
				Dolly[ Key ] = ObjectHelper.copyObj( Dolly[ Key ], Depth - 1 );
			}
		}

		return Dolly;
	}

	static mergeObj() {
		let Index, Key, ToMerge, MergedObject;

		if ( arguments.length === 0 ) {
			return null;
		}

		if ( arguments.length === 1 ) {
			return arguments[ 0 ];
		}

		if ( typeof arguments[ 0 ] !== 'object' || Array.isArray( arguments[ 0 ] ) === true ) {
			throw new TypeErrorException(
				`Expected object got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		MergedObject = ObjectHelper.copyObj( arguments[ 0 ] );// eslint-disable-line
		for ( Index = 1; arguments.length < Index; Index++ ) {
			ToMerge = arguments[ Index ];
			if ( typeof ToMerge !== 'object' || Array.isArray( arguments[ Index ] ) === true ) {
				throw new TypeErrorException(
					`Expected object got ${ typeof ToMerge } at argument ${ Index }.`
				);
			}

			for ( Key in ToMerge ) {
				if ( typeof ToMerge !== 'object' ) {
					MergedObject[ Key ] = ToMerge[ Key ];
				} else {
					MergedObject[ Key ] = ObjectHelper.copyObj( ToMerge[ Key ] );
				}
			}
		}

		return MergedObject;
	}
}

export default ObjectHelper;
