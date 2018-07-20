import TypeErrorException from './Exceptions/TypeErrorException';
/* eslint-disable operator-linebreak */
export default class ObjectHelper {

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

	static __mergeConditions( Merge, ToMerge, Key ) {
		if ( Merge.hasOwnProperty( Key ) === true ) {
			if (
				typeof Merge[ Key ] === 'object'
			&&
                typeof ToMerge === 'object'
			) {
				if (
					Array.isArray( Merge[ Key ] ) === true &&
                    Array.isArray( ToMerge ) === true
				) {
					Merge[ Key ] = Merge[ Key ].concat( ToMerge );
				} else {
					Merge[ Key ] = ObjectHelper.mergeObj( Merge[ Key ], ToMerge );
				}
			} else {
				Merge[ Key ] = ToMerge;
			}
		} else {
			if ( typeof ToMerge === 'object' ) {
				Merge[ Key ] = ObjectHelper.copyObj( ToMerge );
			} else {
				Merge[ Key ] = ToMerge;
			}
		}
	}

	static mergeObj() {
		let Index, Key, ToMerge;
		const MergedObject = arguments[ 0 ];

		if ( arguments.length === 0 ) {
			return null;
		}

		if ( arguments.length === 1 ) {
			return ObjectHelper.copyObj( arguments[ 0 ] );
		}

		if ( typeof arguments[ 0 ] !== 'object' || Array.isArray( arguments[ 0 ] ) === true ) {
			throw new TypeErrorException(
				`Expected object got ${ typeof arguments[ 0 ] } at argument 0.`
			);
		}

		for ( Index = 1; arguments.length > Index; Index++ ) {
			ToMerge = arguments[ Index ];
			if ( typeof ToMerge !== 'object' || Array.isArray( arguments[ Index ] ) === true ) {
				throw new TypeErrorException(
					`Expected object got ${ typeof ToMerge } at argument ${ Index }.`
				);
			}

			for ( Key in ToMerge ) {
				ObjectHelper.__mergeConditions( MergedObject, ToMerge[ Key ], Key );
			}
		}

		return MergedObject;
	}
}
