import StringHelper from '../StringHelper';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
import InvalidFieldValueException from './Exceptions/InvalidFieldValueException';
import IdRegister from './IdRegister';
import Utils from '../../../Utils';

/* eslint-disable operator-linebreak */
export default class FieldBase {
	/* ErrorStrings*/
	static _UNSUPPORTED_TYPE_ = 'Unsupported type {} in field {}. Expected {}.';
	static _UNKNOWN_METHOD_ = 'Unknown method {} of field {} .';
	static _NO_NAME_ = 'A given field has no name property';
	static _NO_OBJECT_ = 'The given Field {} has is no pairing.';
	static _INVALID_ID_ = 'The given id {} is allready in use.';
	/* Class Constant*/
	static __IS_ANY__ = 0x0;
	static __IS_BOOLEAN__ = 0x1;
	static __IS_FUNCTION__ = 0x2;
	static __IS_NUMERIC__ = 0x3;
	static __IS_OBJECT__ = 0x4;
	static __IS_STRING__ = 0x5;
	static __ALLOWED_TYPES__ = [ 'any', 'boolean', 'function', 'number', 'object', 'string' ];
	static __WHITESPACES__ = [ 7, 8, 9, 10, 11, 12, 13, 32 ];
	/* Statics */
	static _IdRegistry = new IdRegister();
	static ModelRenderCondition = true;
	static RenderCondition = true;
	/* Properties*/
	_Field;
	_BindedObject;
	_LabelGenerator;
	_GeneratedField;
	_Model;
	__ModelKey;
	__ModelPointer;
	__HasDefaultValue;

	constructor( Field, BindedObject, Generator ) {
		this._Field = Field;
		this._BindedObject = BindedObject;
		this._LabelGenerator = Generator;
		this._GeneratedField = {};
		this._Model = {};
		this.__ModelKey = '';
		this.__ModelPointer = null;
		this.__HasDefaultValue = false;
		if ( Field === null ) {
			this._Field = { name: '"not set"' };
		}
	}

	static _getName( Field ) {
		let Name;
		if ( Field.hasOwnProperty( 'bind' ) === true ) {
			Name = Field.bind;
		} else {
			Name = Field.name;
		}

		if ( typeof Name === 'undefined' ) {
			return '"not set"';
		} else {
			return Name;
		}
	}

	__isLetter( Letter ) {
		return (
			( Letter < 65 || Letter > 90 )
		&&
			( Letter < 97 || Letter > 122 )
		);
	}

	_validateIdentifier( Identifier ) {
		let CurrentCharacter, Index;
		if (
			typeof Identifier !== 'string'
		||
			Utils.isEmpty( Identifier ) === true
		) {
			return false;
		}

		CurrentCharacter = Identifier.charCodeAt( 0 );
		// First char should be a character
		if ( this.__isLetter() === true ) {
			return false;
		} else {
			// no whitespaces
			for ( Index = 1; Index < Identifier.length; Index++ ) {
				CurrentCharacter = Identifier.charCodeAt( Index );
				if ( Utils.binarySearch( FieldBase.__WHITESPACES__, CurrentCharacter ) !== -1 ) {
					return false;
				}
			}

			return true;
		}
	}

	__lookForPropertyAtBindedObject( IsTypeOrFunction ) {
		let Index;
		const Chunks = IsTypeOrFunction.split( '.' );
		let Self = this._BindedObject;

		if ( Self === null ) {
			return null;
		}

		for ( Index in Chunks ) {
			if ( Chunks[ Index ] in Self ) {
				Self = Self[ Chunks[ Index ] ];
			} else {
				return null;
			}
		}

		return Self;
	}

	_genericExecuteFuncionOrGetSomething(
		Value,
		Type,
		ReturnPureFunction = false
	) {
		let Self = null;
		let ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__, ( typeof Value ) );

		if ( ValueType === -1 && FieldBase.__IS_ANY__ !== Type ) {
			throw new InvalidFieldValueException(
				StringHelper.format(
					FieldBase._UNSUPPORTED_TYPE_,
					typeof Value,
					this._Field.name,
					FieldBase.__ALLOWED_TYPES__[ Type ]
				)
			);
		}

		if ( FieldBase.__IS_FUNCTION__ === ValueType ) {
			if ( ReturnPureFunction === true ) {
				return Value;
			}

			Value = Value( this._Field.name );
		} else {
			if ( FieldBase.__IS_STRING__ === ValueType ) {
				if ( Value.includes( '.' ) === true ) {
					Self = this.__lookForPropertyAtBindedObject( Value );
					ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__,
						( typeof Self )
					);
				} else if ( this._BindedObject !== null && typeof this._BindedObject[ Value ] === 'function' ) {
					Self = this._BindedObject[ Value ];
					ValueType = FieldBase.__IS_FUNCTION__;
				}
			}

			if ( Self !== null ) {
				if ( FieldBase.__IS_FUNCTION__ === ValueType ) {
					if ( ReturnPureFunction === true ) {
						return Self;
					}

					Value = Self( this._Field.name );
					ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__,
						( typeof Value )
					);
				}
			} else if ( ReturnPureFunction === true ) {
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase._UNKNOWN_METHOD_,
						Value,
						this._Field.name
					)
				);
			}
		}

		if ( ValueType === Type || FieldBase.__IS_ANY__ === Type ) {
			return Value;
		}

		throw new InvalidFieldValueException(
			StringHelper.format(
				FieldBase._UNSUPPORTED_TYPE_,
				typeof Value,
				this._Field.name,
				FieldBase.__ALLOWED_TYPES__[ Type ]
			)
		);
	}

	_executeFunctionOrGetString(
		Value,
		ReturnPureFunction = false
	) {
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_STRING__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetNumber(
		Value,
		ReturnPureFunction = false
	) {
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_NUMERIC__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetBoolean(
		Value,
		ReturnPureFunction = false
	) {
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_BOOLEAN__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetObject(
		Value,
		ReturnPureFunction = false
	) {
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_OBJECT__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetAnything(
		Value,
		ReturnPureFunction = false
	) {
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_ANY__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetArray(
		Value,
		ReturnPureFunction = false
	) {
		let Self = null;
		let ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__, ( typeof Value ) );
		if ( ValueType === -1 && Array.isArray( Value ) === false ) {
			throw new InvalidFieldException(
				StringHelper.format(
					FieldBase._UNSUPPORTED_TYPE_,
					ValueType,
					this._Field.name,
					'',
					'array'
				)
			);
		}

		if ( FieldBase.__IS_FUNCTION__ === ValueType ) {
			if ( ReturnPureFunction === true ) {
				return Value;
			}

			Value = Value( this._Field.name );
		} else {
			if ( FieldBase.__IS_STRING__ === ValueType ) {
				if ( Value.includes( '.' ) === true ) {
					Self = this.__lookForPropertyAtVueObject( Value );
					ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__, ( typeof Self ) );
				} else if ( this._BindedObject !== null && typeof this._BindedObject[ Value ] === 'function' ) {
					Self = this._BindedObject[ Value ];
					ValueType = FieldBase.__IS_FUNCTION__;
				}
			}

			if ( Self !== null ) {
				if ( FieldBase.__IS_FUNCTION__ === ValueType ) {
					if ( ReturnPureFunction === true ) {
						return Self;
					}

					Value = Self( this._Field.name );
				}
			} else if ( ReturnPureFunction === true ) {
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase._UNKNOWN_METHOD_,
						Value,
						this._Field.name
					)
				);
			}
		}

		if ( Array.isArray( Value ) === true ) {
			return Value;
		}

		throw new InvalidFieldException(
			StringHelper.format(
				FieldBase._UNSUPPORTED_TYPE_,
				ValueType,
				this._Field.name,
				'',
				'array'
			)
		);
	}

	_getStringLabelOrEmpty( Label ) {
		let LabelValue;

		if ( Utils.isEmpty( Label ) === true ) {
			return '';
		} else {
			if ( this._Field.name !== Label ) {
				if ( typeof Label === 'function' ) {
					Label = Label( this._Field.name );
				}

				LabelValue = this._LabelGenerator( Label );
			} else {
				LabelValue = this._LabelGenerator( this._Field.name );
			}

			if ( Utils.isEmpty( LabelValue ) === true || Label === LabelValue ) {
				return '';
			}
			return LabelValue;
		}
	}

	_getStringLabelOrPlaceholder( Label ) {
		let LabelValue;

		if ( Utils.isEmpty( Label ) === true ) {
			return '';
		} else {
			if ( this._Field === null || this._Field.name !== Label ) {
				if ( typeof Label === 'function' ) {
					Label = Label( this._Field.name );
				}

				LabelValue = this._LabelGenerator( Label );
			} else {
				LabelValue = this._LabelGenerator( this._Field.name );
			}

			if ( Utils.isEmpty( LabelValue ) === true ) {
				return Label;
			} else {
				return LabelValue;
			}
		}
	}

	__assignGeneric( FieldLabel, AssignmentLabel, AssignFunction ) {
		if ( this._Field.hasOwnProperty( FieldLabel ) === true ) {
			if ( AssignmentLabel.length > 0 ) {
				this._GeneratedField[ AssignmentLabel ] = this[ AssignFunction ](
					this._Field[ FieldLabel ]
				);
			} else {
				this._GeneratedField[ FieldLabel ] = this[ AssignFunction ](
					this._Field[ FieldLabel ]
				);
			}
		} else if (
			typeof AssignmentLabel === 'string'
		&&
			AssignmentLabel.length > 0
		&&
			this._Field.hasOwnProperty( AssignmentLabel ) === true
		) {
			this._GeneratedField[ AssignmentLabel ] = this[ AssignFunction ](
				this._Field[ AssignmentLabel ]
			);
		}

	}

	_assignString( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetString' );
	}

	_assignNumeric( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetNumber' );
	}

	_assignBoolean( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetBoolean' );
	}

	_assignAnything( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetAnything' );
	}

	_assignFunction( FieldLabel, AssignmentLabel = '' ) {
		if ( this._Field.hasOwnProperty( FieldLabel ) === true ) {
			if ( AssignmentLabel.length > 0 ) {
				this._GeneratedField[ AssignmentLabel ] = this._executeFunctionOrGetAnything(
					this._Field[ FieldLabel ],
					true
				);
			} else {
				this._GeneratedField[ FieldLabel ] = this._executeFunctionOrGetAnything(
					this._Field[ FieldLabel ],
					true
				);
			}
		} else if (
			typeof AssignmentLabel === 'string'
		&&
			AssignmentLabel.length > 0
		&&
			this._Field.hasOwnProperty( AssignmentLabel ) === true
		) {
			this._GeneratedField[ AssignmentLabel ] = this._executeFunctionOrGetAnything(
				this._Field[ AssignmentLabel ]
			);
		}
	}

	_assignEmptyStringOrLabelString( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_getStringLabelOrEmpty' );
	}

	_assignPlaceholderOrLabelString( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_getStringLabelOrPlaceholder' );
	}

	_addKeyToModel( Key ) {
		let Index, Chunks;
		let Self = this._Model;

		if ( Key.length === 0 ) {
			throw new InvalidFieldPropertyException( FieldBase._NO_NAME_ );
		}

		if ( Self === null ) {
			throw new InvalidFieldException(
				StringHelper.format(
					FieldBase._NO_OBJECT_,
					this._Field.name
				)
			);
		}

		if ( Key.includes( '.' ) === true ) {
			Chunks = Key.split( '.' );
			this.__ModelKey = Chunks;
			for ( Index = 0; Index < Chunks.length - 1; Index++ ) {
				Self[ Chunks[ Index ] ] = {};
				Self = Self[ Chunks[ Index ] ];
			}

			Self[ Chunks[ Chunks.length - 1 ] ] = '';
		} else {
			Self[ Key ] = '';
			this.__ModelKey = Key;
		}

		this.__ModelPointer = Self;
	}

	_addValueToModel( Value ) {
		if ( Array.isArray( this.__ModelKey ) === true ) {
			this.__ModelPointer[ this.__ModelKey[ this.__ModelKey.length - 1 ] ] = Value;
		} else {
			this.__ModelPointer[ this.__ModelKey ] = Value;
		}

		if ( Utils.isEmpty( Value ) === false ) {
			this.__HasDefaultValue = true;
		}
	}

	_fieldTakesMultibleValues() {
		if ( this.__HasDefaultValue === true ) {
			if ( Array.isArray( this.__ModelKey ) === true ) {
				this._addValueToModel(
					this.__ModelPointer[ this.__ModelKey[ this.__ModelKey.length - 1 ] ]
				);
			} else {
				this._addValueToModel(
					this.__ModelPointer[ this.__ModelKey ]
				);
			}
		} else {
			this._addValueToModel( [] );
		}
	}

	isInModel( Key ) {
		if ( Array.isArray( this.__ModelKey ) === true ) {
			return this.__ModelKey.join( '' ) === Key;
		} else {
			return this.__ModelKey === Key;
		}
	}

	hasDefalutValue() {
		return this.__HasDefaultValue;
	}

	getModel() {
		return this._Model;
	}

	getModelKey() {
		return this.__ModelKey;
	}

	getGeneratedField() {
		return this._GeneratedField;
	}
}
