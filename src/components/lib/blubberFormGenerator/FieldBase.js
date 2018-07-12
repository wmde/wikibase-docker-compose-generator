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

export class IdRegister {
	static __IdStore = [];

	static containsId( Id ) {
		return IdRegister.__IdStore.indexOf( Id ) !== -1;
	}

	static addId( Id ) {
		if ( IdRegister.containsId( Id ) === false ) {
			IdRegister.__IdStore.push( Id );
			return true;
		} else {
			return false;
		}
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

		if ( this._Field === null ) {
			this._Field = { name: '"not set"' };
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
			return Label;
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
			throw new InvalidFieldPropertyException( FieldBase.__NO_NAME__ );
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
					this.__ModelPointer[
						this.__ModelKey[
							this.__ModelKey.length - 1 ]
					]
				);
			} else {
				this._addValueToModel( this.__ModelPointer[ this.__ModelKey ] );
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

export class CommonRequiredAttributes extends FieldBase {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this.__addNeccesaryAttributes();
	}

	__addNeccesaryAttributes() {
		let Id;
		if ( 'class' in this._Field ) {
			this._Field.styleClasses = this._Field.class;
			delete this._Field.class;
		}

		if ( this._Field.hasOwnProperty( 'name' ) === false ) {
			throw new InvalidFieldException( FieldBase.__NO_NAME__ );
		}

		if ( this._Field.hasOwnProperty( 'id' ) === true ) {
			Id = this._executeFunctionOrGetString( this._Field.id );
		} else {
			Id = this._Field.name;
		}

		// common required properties
		if ( IdRegister.containsId( Id ) === false ) {
			this._GeneratedField.id = this._executeFunctionOrGetString( Id );
			IdRegister.addId( Id );
		} else {
			this._GeneratedField.id = 'invalidId';
		}

		this._GeneratedField.model = `${ this._Field.name }`;

		if ( this._Field.hasOwnProperty( 'label' ) === true ) {
			this._assignPlaceholderOrLabelString( 'label' );
		} else {
			this._assignPlaceholderOrLabelString( 'name', 'label' );
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
			this._addKeyToModel( this._executeFunctionOrGetString( this._Field.storesIn, false ) );
		} else {
			this._addKeyToModel( this._executeFunctionOrGetString( this._Field.name ) );
		}
	}

	__addVisibilityType() {
		this._assignBoolean( 'isVisible', 'visible' );
		this._assignBoolean( 'isDisabled', 'disabled' );
		this._assignBoolean( 'isFeatured', 'featured' );
	}

	__addMiscellaneous() {
		this._assignBoolean( 'required' );

		if (
			(
				this._Field.hasOwnProperty( 'default' ) === true
			&&
				Utils.isEmpty( this._Field.default ) === false
			)

		||
			typeof this._Field.default !== 'boolean'
		) {
			this._addValueToModel( this._executeFunctionOrGetAnything( this._Field.default ) );
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
		this.__addValidator();
	}

	__addValidator() {
		if ( typeof this._BindedObject.getValidator !== 'function' ) {
			return '';
		}

		if ( this._Field.name.includes( '.' ) === true ) {
			this._GeneratedField.validator = this._BindedObject.getValidator( this._Field.name.split( '.' ) );
		} else {
			this._GeneratedField.validator = this._BindedObject.getValidator( [ this._Field.name ] );
		}
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
		let Index, InsideButtons;
		const Buttons = [];

		if ( this._Field.hasOwnProperty( 'buttons' ) === false ) {
			return;
		}
		// eslint-disable-next-line
		InsideButtons = this._executeFunctionOrGetAnything(this._Field['buttons']);

		if ( typeof InsideButtons === 'object' && Array.isArray( InsideButtons ) === false ) {
			if (
				InsideButtons.hasOwnProperty( 'condition' ) === true
			&&
				this._executeFunctionOrGetBoolean( InsideButtons.condition ) === false
			) {
				return;
			}
			Buttons.push( this.__wrapInsideButton( InsideButtons ) );
		} else if ( Array.isArray( InsideButtons ) === true ) {
			for ( Index in InsideButtons ) {
				if (
					InsideButtons[ Index ].hasOwnProperty( 'condition' ) === true
				&&
					this._executeFunctionOrGetBoolean( InsideButtons[ Index ].condition ) === false
				) {
					continue;
				}

				if ( typeof InsideButtons[ Index ] === 'object' ) {
					Buttons.push( this.__wrapInsideButton( InsideButtons[ Index ] ) );
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
