import StringHelper from '../StringHelper';
import { BaseException } from '../BaseExceptions';
import Utils from '../../../Utils';

/* eslint-disable operator-linebreak */
export class InvalidFieldException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldException', Message );
	}
}

export class InvalidFieldValueException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldValueException', Message );
	}
}

export class InvalidFieldPropertyException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldPropertyException', Message );
	}
}

export class FieldBase {
	/* ErrorStrings*/
	static __UNSUPPORTED_TYPE__ = 'Unsupported type {} in field {}. Expected {}.';
	static __UNKNOWN_METHOD__ = 'Unknown method {} of field {} .';
	static __NO_NAME__ = 'A given field has no name property';
	static __NO_BINDED_OBJECT__ = 'The given Field {} has is no pairing.';
	/* Class Constant*/
	static __IS_ANY__ = 0x0;
	static __IS_BOOLEAN__ = 0x1;
	static __IS_FUNCTION__ = 0x2;
	static __IS_NUMERIC__ = 0x3;
	static __IS_OBJECT__ = 0x4;
	static __IS_STRING__ = 0x5;
	static __ALLOWED_TYPES__ = [ 'any', 'boolean', 'function', 'number', 'object', 'string' ];
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
	}

	__lookForPropertyAtVueObject( IsTypeOrFunction ) {
		let Index;
		const Chunks = IsTypeOrFunction.split( '.' );
		let Self = this._BindedObject;
		if ( Self === null ) {
			return null;
		}

		for ( Index in Chunks ) {
			if ( Self.hasOwnProperty( Chunks[ Index ] ) === true ) {
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

		if ( this._Field === null ) {
			this._Field = { name: 'not set' };
		}

		if ( ValueType === -1 && FieldBase.__IS_ANY__ !== Type ) {
			throw new InvalidFieldValueException(
				StringHelper.format(
					FieldBase.__UNSUPPORTED_TYPE__,
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
					Self = this.__lookForPropertyAtVueObject( Value );
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
						FieldBase.__UNKNOWN_METHOD__,
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
				FieldBase.__UNSUPPORTED_TYPE__,
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
					FieldBase.__UNSUPPORTED_TYPE__,
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
						FieldBase.__UNKNOWN_METHOD__,
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
				FieldBase.__UNSUPPORTED_TYPE__,
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
			if ( typeof Label === 'function' ) {
				Label = Label( this._Field.name );
			}

			LabelValue = this._LabelGenerator( Label );

			if ( Utils.isEmpty( LabelValue ) === true || Label === LabelValue ) {
				return '';
			}
			return Label;
		}
	}

	_getStringLabelOrPlaceholder( Label ) {
		let LabelValue;

		if ( Utils.isEmpty( Label ) === true ) {
			return '';
		} else {
			if ( typeof Label === 'function' ) {
				Label = Label( this._Field.name );
			}

			LabelValue = this._LabelGenerator( Label );

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
				this._GeneratedField[ AssignmentLabel ] = AssignFunction(
					this._Field[ FieldLabel ]
				);
			} else {
				this._GeneratedField[ FieldLabel ] = AssignFunction(
					this._Field[ FieldLabel ]
				);
			}
		}
	}

	_assignString( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetString );
	}

	_assignNumeric( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetNumber );
	}

	_assignBoolean( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetBoolean );
	}

	/* _assignObject( FieldLabel, AssignmentLabel = '' )
	{
	this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetObject );
	}*/

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
		}
	}

	_assignEmptyStringOrLabelString( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, this._getStringLabelOrEmpty );
	}

	_assignPlaceholderOrLabelString( FieldLabel, AssignmentLabel = '' ) {
		this.__assignGeneric( FieldLabel, AssignmentLabel, this._getStringLabelOrPlaceholder );
	}

	_addKeyToModel( Key, Prefix = '' ) {
		let Index, Chunks;
		let Self = this._Model;

		if ( Key.length === 0 ) {
			throw new InvalidFieldPropertyException( FieldBase.__NO_NAME__ );
		}

		if ( Prefix.length > 0 ) {
			Key = `${ Prefix }.${ Key }`;
		}

		if ( Self === null ) {
			throw new InvalidFieldException(
				StringHelper.format(
					FieldBase.__NO_BINDED_OBJECT__,
					this._Field.name
				)
			);
		}

		if ( Key.includes( '.' ) === true ) {
			Chunks = Key.split( '.' );
			this.__ModelKey = Chunks;
			for ( Index in Chunks ) {
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
		this.__ModelPointer = Value;
		this.__HasDefaultValue = true;
	}

	_fieldTakesMultibleValues() {
		if ( this.__HasDefaultValue === true ) {
			this.__ModelPointer = [ this.__ModelPointer ];
		} else {
			this.__ModelPointer = [];
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

export class CommonRequiredAttributes extends FieldBase {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this.__addNeccesaryAttributes();
	}

	__addNeccesaryAttributes() {
		if ( 'class' in this._Field ) {
			this._Field.styleClasses = this._Field.class;
			delete this._Field.class;
		}

		if ( this._Field.hasOwnProperty( 'name' ) === false ) {
			throw new InvalidFieldException( FieldBase.__NO_NAME__ );
		}

		// common required properties
		if ( this._Field.hasOwnProperty( 'prefix' ) === true ) {
			if ( this._Field.prefix !== 'string' ) {
				throw new InvalidFieldException(
					StringHelper.format(
						FieldBase.__UNSUPPORTED_TYPE__,
						typeof this._Field,
						this._Field.name,
						'at prefix',
						'string'
					)
				);
			} else {
				this._GeneratedField.id = `${ this._Field.prefix }_${ this._Field.name }`;
			}
		} else {
			this._GeneratedField.id = this._Field.name;
		}
	}
}

export class CommonOptionalAttributesAndMethods extends CommonRequiredAttributes {
	/* ERRORS*/
	static __NO_LABEL_INSIDE_BUTTON__ = 'A insidebutton of field {} has no label.';

	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this.__addStore();
		this.__addCommonOptionalProperties();
	}

	_setAutocomplete() {
		if (
			this._Field.hasOwnProperty( 'autocomplete' ) === true
		&&
			this._Field.autocomplete === false
		) {
			this._GeneratedField.autocomplete = 'off';
		} else {
			this._GeneratedField.autocomplete = 'on';
		}
	}

	__addStore() {
		if ( this._Field.hasOwnProperty( 'storesIn' ) === true ) {
			if ( this._Field.hasOwnProperty( 'prefix' ) === true ) {
				this._addKeyToModel(
					this._executeFunctionOrGetString( this._Field.storesIn ),
					this._Field.prefix
				);
			} else {
				this._addKeyToModel( this._executeFunctionOrGetString( this._Field.storesIn ) );
			}
		} else {
			if ( this._Field.hasOwnProperty( 'prefix' ) === true ) {
				this._addKeyToModel(
					this._executeFunctionOrGetString( this._Field.name ),
					this._Field.prefix
				);
			} else {
				this._addKeyToModel( this._executeFunctionOrGetString( this._Field.name ) );
			}
		}
	}

	__addVisibilityType() {
		this._assignBoolean( 'isVisible', 'visible' );
		this._assignBoolean( 'isDisabled', 'disabled' );
		this._assignBoolean( 'isFeatured', 'featured' );
	}

	__addMiscellaneous() {
		this._assignBoolean( 'isRequired', 'required' );
		this._assignString( 'defaultValue', 'default' );
		if ( this._GeneratedField.hasOwnProperty( 'default' ) === true ) {
			this._Model._addValueToModel( this._GeneratedField.default );
		}
	}

	__addStringBasedAttributes() {
		this._assignPlaceholderOrLabelString( 'help' );
		this._assignPlaceholderOrLabelString( 'hint' );
	}

	__addMethods() {
		this._assignFunction( 'setFormatter', 'set' );
		this._assignFunction( 'getFormatter', 'get' );
	}

	__addEvents() {
		this._assignFunction( 'afterChanged', 'onChanged' );
		this._assignFunction( 'afterValidated', 'onValidated' );
		this._assignFunction( 'validator' );
	}

	__addClass() {
		let Miscellaneous;
		if ( this._Field.hasOwnProperty( 'styleClasses' ) ) {
			if ( Array.isArray( this._Field.styleClasses ) === false && typeof this._Field.styleClasses !== 'string' ) {
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase.__UNSUPPORTED_TYPE__,
						typeof this._Field.styleClasses,
						this._Field.name,
						' at styleClasses property',
						'array of strings or string'
					)
				);

			} else if ( Array.isArray( this._Field.styleClasses ) === true ) {
				for ( Miscellaneous in this._Field.styleClasses ) {
					if ( typeof this._Field.styleClasses[ Miscellaneous ] !== 'string' ) {
						throw new InvalidFieldPropertyException(
							StringHelper.format(
								FieldBase.__UNSUPPORTED_TYPE__,
								typeof this._Field.styleClasses[ Miscellaneous ],
								this._Field.name,
								` at styleClasses property at Index ${Miscellaneous}`,
								'string'
							)
						);
					}
				}
			}
		}
	}

	__wrapInsideButton( Button ) {
		let Mutable;
		const GeneratedButton = {};

		if ( Button.hasOwnProperty( 'class' ) === true ) {
			GeneratedButton.classes = this._executeFunctionOrGetString( Button.class );
		}

		if ( Button.hasOwnProperty( 'label' ) === true ) {
			Mutable = this._executeFunctionOrGetString( Button.label );
			GeneratedButton.label = this._getStringLabelOrPlaceholder( Mutable );
		} else {
			throw new InvalidFieldPropertyException(
				StringHelper.format(
					CommonOptionalAttributesAndMethods.__NO_LABEL_INSIDE_BUTTON__,
					this._Field.name
				)
			);
		}

		GeneratedButton.onclick = this._executeFunctionOrGetAnything( Button.action, true );
		return GeneratedButton;
	}

	__addInsideButton() {
		let Index, GeneratedButton, InsideButtons;
		const Buttons = [];

		if ( this._Field.hasOwnProperty( 'buttons' ) === false ) {
			return;
		}
		// eslint-disable-next-line
		InsideButtons = this._executeFunctionOrGetAnything(this._Field['buttons']);

		if ( typeof InsideButtons === 'object' ) {
			Buttons.push( this.__wrapInsideButton( InsideButtons ) );
		} else if ( Array.isArray( InsideButtons ) === true ) {
			for ( Index in InsideButtons ) {
				GeneratedButton = {};
				if ( typeof InsideButtons[ Index ] === 'object' ) {
					GeneratedButton = this.__wrapInsideButton( InsideButtons[ Index ] );
					Buttons.push( GeneratedButton );
				} else {
					throw new InvalidFieldPropertyException(
						StringHelper.format(
							FieldBase.__UNSUPPORTED_TYPE__,
							typeof InsideButtons[ Index ],
							this._Field.name,
							'at insideButtons',
							'array of objects or object'
						)
					);
				}
			}
		} else {
			throw new InvalidFieldPropertyException(
				StringHelper.format(
					FieldBase.__UNSUPPORTED_TYPE__,
					typeof InsideButtons,
					this._Field.name,
					'at insideButtons',
					'array of objects or object'
				)
			);
		}

		this._GeneratedField.buttons = Buttons;
	}

	__addCommonOptionalProperties() {
		this.__addClass();
		this.__addVisibilityType();
		this.__addMiscellaneous();
		this.__addInsideButton();
		this.__addStringBasedAttributes();
		this.__addMethods();
		this.__addEvents();
	}
}
