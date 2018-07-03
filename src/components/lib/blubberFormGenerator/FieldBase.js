import StringHelper from '../StringHelper';
import { BaseException } from '../BaseExceptions';
import Utils from '../../../Utils';

/* eslint-disable operator-linebreak */
export class InvalidFieldException extends BaseException
{
	constructor( Message )
	{
		super( 'InvalidFieldException', Message );
	}
}

export class InvalidFieldValueException extends BaseException
{
	constructor( Message )
	{
		super( 'InvalidFieldValueException', Message );
	}
}

export class InvalidFieldPropertyException extends BaseException
{
	constructor( Message )
	{
		super( 'InvalidFieldPropertyException', Message );
	}
}

export class FieldBase
{
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

	constructor( Field, BindedObject, Generator )
	{
		this._Field = Field;
		this._BindedObject = BindedObject;
		this._LabelGenerator = Generator;
		this._GeneratedField = {};
		this._Model = {};
		this.__ModelKey = '';
		this.__ModelPointer = null;
		this.__HasDefaultValue = false;
	}

	__lookForPropertyAtVueObject( IsTypeOrFunction )
	{
		let Index;
		const Chunks = IsTypeOrFunction.split( '.' );
		let Self = this._BindedObject;

		if ( null === Self )
		{
			return null;
		}

		for ( Index in Chunks )
		{
			if ( Chunks[ Index ] in Self )
			{
				Self = Self[ Chunks[ Index ] ];
			}
			else
			{
				return null;
			}
		}

		return Self;
	}

	_genericExecuteFuncionOrGetSomething(
		Value,
		Type,
		ReturnPureFunction = false
	)
	{
		let Self = null;
		let ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__, ( typeof Value ) );

		if ( null === this._Field )
		{
			this._Field = { name: 'not set' };
		}

		if ( -1 === ValueType && FieldBase.__IS_ANY__ !== Type )
		{
			throw new InvalidFieldValueException(
				StringHelper.format(
					FieldBase.__UNSUPPORTED_TYPE__,
					typeof Value,
					this._Field.name,
					FieldBase.__ALLOWED_TYPES__[ Type ]
				)
			);
		}

		if ( FieldBase.__IS_FUNCTION__ === ValueType )
		{
			if ( true === ReturnPureFunction )
			{
				return Value;
			}

			Value = Value( this._Field.name );
		}
		else
		{
			if ( FieldBase.__IS_STRING__ === ValueType )
			{
				if ( true === Value.includes( '.' ) )
				{
					Self = this.__lookForPropertyAtVueObject( Value );
					ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__,
						( typeof Self )
					);
				}
				else if ( null !== this._BindedObject && 'function' === typeof this._BindedObject[ Value ] )
				{
					Self = this._BindedObject[ Value ];
					ValueType = FieldBase.__IS_FUNCTION__;
				}
			}

			if ( null !== Self )
			{
				if ( FieldBase.__IS_FUNCTION__ === ValueType )
				{
					if ( true === ReturnPureFunction )
					{
						return Self;
					}

					Value = Self( this._Field.name );
					ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__,
						( typeof Value )
					);
				}
			}
			else if ( true === ReturnPureFunction )
			{
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase.__UNKNOWN_METHOD__,
						Value,
						this._Field.name
					)
				);
			}
		}

		if ( ValueType === Type || FieldBase.__IS_ANY__ === Type )
		{
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
	)
	{
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_STRING__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetNumber(
		Value,
		ReturnPureFunction = false
	)
	{
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_NUMERIC__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetBoolean(
		Value,
		ReturnPureFunction = false
	)
	{
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_BOOLEAN__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetObject(
		Value,
		ReturnPureFunction = false
	)
	{
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_OBJECT__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetAnything(
		Value,
		ReturnPureFunction = false
	)
	{
		return this._genericExecuteFuncionOrGetSomething(
			Value,
			FieldBase.__IS_ANY__,
			ReturnPureFunction
		);
	}

	_executeFunctionOrGetArray(
		Value,
		ReturnPureFunction = false
	)
	{
		let Self = null;
		let ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__, ( typeof Value ) );
		if ( -1 === ValueType && false === Array.isArray( Value ) )
		{
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

		if ( FieldBase.__IS_FUNCTION__ === ValueType )
		{
			if ( true === ReturnPureFunction )
			{
				return Value;
			}

			Value = Value( this._Field.name );
		}
		else
		{
			if ( FieldBase.__IS_STRING__ === ValueType )
			{
				if ( true === Value.includes( '.' ) )
				{
					Self = this.__lookForPropertyAtVueObject( Value );
					ValueType = Utils.binarySearch( FieldBase.__ALLOWED_TYPES__, ( typeof Self ) );
				}
				else if ( null !== this._BindedObject && 'function' === typeof this._BindedObject[ Value ] )
				{
					Self = this._BindedObject[ Value ];
					ValueType = FieldBase.__IS_FUNCTION__;
				}
			}

			if ( null !== Self )
			{
				if ( FieldBase.__IS_FUNCTION__ === ValueType )
				{
					if ( true === ReturnPureFunction )
					{
						return Self;
					}

					Value = Self( this._Field.name );
				}
			}
			else if ( true === ReturnPureFunction )
			{
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase.__UNKNOWN_METHOD__,
						Value,
						this._Field.name
					)
				);
			}
		}

		if ( true === Array.isArray( Value ) )
		{
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

	_getStringLabelOrEmpty( Label )
	{
		let LabelValue;

		if ( true === Utils.isEmpty( Label ) )
		{
			return '';
		}
		else
		{
			if ( this._Field.name !== Label )
			{
				if ( 'function' === typeof Label )
				{
					Label = Label( this._Field.name );
				}

				LabelValue = this._LabelGenerator( Label );
			}
			else
			{
				LabelValue = this._LabelGenerator( this._Field.name );
			}

			if ( true === Utils.isEmpty( LabelValue ) || Label === LabelValue )
			{
				return '';
			}
			return Label;
		}
	}

	_getStringLabelOrPlaceholder( Label )
	{
		let LabelValue;

		if ( true === Utils.isEmpty( Label ) )
		{
			return '';
		}
		else
		{
			if ( null === this._Field || this._Field.name !== Label )
			{
				if ( 'function' === typeof Label )
				{
					Label = Label( this._Field.name );
				}

				LabelValue = this._LabelGenerator( Label );
			}
			else
			{
				LabelValue = this._LabelGenerator( this._Field.name );
			}

			if ( true === Utils.isEmpty( LabelValue ) )
			{
				return Label;
			}
			else
			{
				return LabelValue;
			}
		}
	}

	__assignGeneric( FieldLabel, AssignmentLabel, AssignFunction )
	{
		if ( true === this._Field.hasOwnProperty( FieldLabel ) )
		{
			if ( 0 < AssignmentLabel.length )
			{
				this._GeneratedField[ AssignmentLabel ] = this[ AssignFunction ](
					this._Field[ FieldLabel ]
				);
			}
			else
			{
				this._GeneratedField[ FieldLabel ] = this[ AssignFunction ](
					this._Field[ FieldLabel ]
				);
			}
		}
	}

	_assignString( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetString' );
	}

	_assignNumeric( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetNumber' );
	}

	_assignBoolean( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetBoolean' );
	}

	/* _assignObject( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetObject' );
	}*/

	_assignAnything( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_executeFunctionOrGetAnything' );
	}

	_assignFunction( FieldLabel, AssignmentLabel = '' )
	{
		if ( true === this._Field.hasOwnProperty( FieldLabel ) )
		{
			if ( 0 < AssignmentLabel.length )
			{
				this._GeneratedField[ AssignmentLabel ] = this._executeFunctionOrGetAnything(
					this._Field[ FieldLabel ],
					true
				);
			}
			else
			{
				this._GeneratedField[ FieldLabel ] = this._executeFunctionOrGetAnything(
					this._Field[ FieldLabel ],
					true
				);
			}
		}
	}

	_assignEmptyStringOrLabelString( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_getStringLabelOrEmpty' );
	}

	_assignPlaceholderOrLabelString( FieldLabel, AssignmentLabel = '' )
	{
		this.__assignGeneric( FieldLabel, AssignmentLabel, '_getStringLabelOrPlaceholder' );
	}

	_addKeyToModel( Key )
	{
		let Index, Chunks;
		let Self = this._Model;

		if ( 0 === Key.length )
		{
			throw new InvalidFieldPropertyException( FieldBase.__NO_NAME__ );
		}

		if ( null === Self )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					FieldBase.__NO_BINDED_OBJECT__,
					this._Field.name
				)
			);
		}

		if ( true === Key.includes( '.' ) )
		{
			Chunks = Key.split( '.' );
			this.__ModelKey = Chunks;
			for ( Index = 0; Index < Chunks.length - 1; Index++ )
			{
				Self[ Chunks[ Index ] ] = {};
				Self = Self[ Chunks[ Index ] ];
			}

			Self[ Chunks[ Chunks.length - 1 ] ] = '';
		}
		else
		{
			Self[ Key ] = '';
			this.__ModelKey = Key;
		}

		this.__ModelPointer = Self;
	}

	_addValueToModel( Value )
	{
		if ( true === Array.isArray( this.__ModelKey ) )
		{
			this.__ModelPointer[ this.__ModelKey[ this.__ModelKey.length - 1 ] ] = Value;
		}
		else
		{
			this.__ModelPointer[ this.__ModelKey ] = Value;
		}
		this.__HasDefaultValue = true;
	}

	_fieldTakesMultibleValues()
	{
		if ( true === this.__HasDefaultValue )
		{
			this.__ModelPointer[ this.__ModelKey ] = [ this.__ModelPointer[ this.__ModelKey[ this.__ModelKey.length - 1 ] ] ];
		}
		else
		{
			this.__ModelPointer[ this.__ModelKey ] = [];
		}
	}

	isInModel( Key )
	{
		if ( true === Array.isArray( this.__ModelKey ) )
		{
			return this.__ModelKey.join( '' ) === Key;
		}
		else
		{
			return this.__ModelKey === Key;
		}
	}

	hasDefalutValue()
	{
		return this.__HasDefaultValue;
	}

	getModel()
	{
		return this._Model;
	}

	getModelKey()
	{
		return this.__ModelKey;
	}

	getGeneratedField()
	{
		return this._GeneratedField;
	}
}

export class CommonRequiredAttributes extends FieldBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this.__addNeccesaryAttributes();
	}

	__addNeccesaryAttributes()
	{
		if ( 'class' in this._Field )
		{
			this._Field.styleClasses = this._Field.class;
			delete this._Field.class;
		}

		if ( false === this._Field.hasOwnProperty( 'name' ) )
		{
			throw new InvalidFieldException( FieldBase.__NO_NAME__ );
		}

		// common required properties
		this._GeneratedField.id = this._Field.name;
        this._GeneratedField.model = `${ this._Field.name }`;

		if ( true === this._Field.hasOwnProperty( 'label' ) )
		{
			this._assignPlaceholderOrLabelString( 'label' );
		}
		else
		{
			this._assignPlaceholderOrLabelString( 'name', 'label' );
		}
	}
}

export class CommonOptionalAttributesAndMethods extends CommonRequiredAttributes
{
	/* ERRORS*/
	static __NO_LABEL_INSIDE_BUTTON__ = 'A insidebutton of field {} has no label.';

	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this.__addStore();
		this.__addCommonOptionalProperties();
	}

	_setAutocomplete()
	{
		if (
			true === this._Field.hasOwnProperty( 'autocomplete' )
		&&
			false === this._Field.autocomplete
		)
		{
			this._GeneratedField.autocomplete = 'off';
		}
		else
		{
			this._GeneratedField.autocomplete = 'on';
		}
	}

	__addStore()
	{
		if ( true === this._Field.hasOwnProperty( 'storesIn' ) )
		{
			this._addKeyToModel( this._executeFunctionOrGetString( this._Field.storesIn, false ) );
		}
		else
		{
			this._addKeyToModel( this._executeFunctionOrGetString( this._Field.name ) );
		}
	}

	__addVisibilityType()
	{
		this._assignBoolean( 'isVisible', 'visible' );
		this._assignBoolean( 'isDisabled', 'disabled' );
		this._assignBoolean( 'isFeatured', 'featured' );
	}

	__addMiscellaneous()
	{
		this._assignBoolean( 'required' );
		this._assignAnything( 'default' );

		if (
			(
				true === this._Field.hasOwnProperty( 'default' )
			&&
				false === Utils.isEmpty( this._Field.default )
			)

		||
			'boolean' !== typeof this._Field.default
		)
		{
			this._addValueToModel( this._Field.default );
		}
	}

	__addStringBasedAttributes()
	{
		this._assignPlaceholderOrLabelString( 'help' );
		this._assignPlaceholderOrLabelString( 'hint' );
	}

	__addMethods()
	{
		this._assignFunction( 'setFormatter', 'set' );
		this._assignFunction( 'getFormatter', 'get' );
	}

	__addEvents()
	{
		this._assignFunction( 'afterChanged', 'onChanged' );
		this._assignFunction( 'afterValidated', 'onValidated' );
		this.__addValidator();
	}

	__addValidator()
	{
		let FieldName;

		if ( 'function' !== typeof this._BindedObject.getValidator )
		{
			return '';
		}

		if( true === this._Field.name.includes( '.' ) )
		{
            this._GeneratedField.validator = this._BindedObject.getValidator( this._Field.name.split( '.' ) );
		}
		else
		{
            this._GeneratedField.validator = this._BindedObject.getValidator( [ this._Field.name ] );
        }
	}

	__addClass()
	{
		let Miscellaneous;
		if ( this._Field.hasOwnProperty( 'styleClasses' ) )
		{
			if ( false === Array.isArray( this._Field.styleClasses ) && 'string' !== typeof this._Field.styleClasses )
			{
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase.__UNSUPPORTED_TYPE__,
						typeof this._Field.styleClasses,
						this._Field.name,
						' at styleClasses property',
						'array of strings or string'
					)
				);

			}
			else if ( true === Array.isArray( this._Field.styleClasses ) )
			{
				for ( Miscellaneous in this._Field.styleClasses )
				{
					if ( 'string' !== typeof this._Field.styleClasses[ Miscellaneous ] )
					{
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

	__wrapInsideButton( Button )
	{
		let Mutable;
		const GeneratedButton = {};

		if ( true === Button.hasOwnProperty( 'class' ) )
		{
			GeneratedButton.classes = this._executeFunctionOrGetString( Button.class );
		}

		if ( true === Button.hasOwnProperty( 'label' ) )
		{
			Mutable = this._executeFunctionOrGetString( Button.label );
			GeneratedButton.label = this._getStringLabelOrPlaceholder( Mutable );
		}
		else
		{
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

	__addInsideButton()
	{
		let Index, GeneratedButton, InsideButtons;
		const Buttons = [];

		if ( false === this._Field.hasOwnProperty( 'buttons' ) )
		{
			return;
		}
		// eslint-disable-next-line
		InsideButtons = this._executeFunctionOrGetAnything(this._Field['buttons']);

		if ( 'object' === typeof InsideButtons )
		{
			Buttons.push( this.__wrapInsideButton( InsideButtons ) );
		}
		else if ( true === Array.isArray( InsideButtons ) )
		{
			for ( Index in InsideButtons )
			{
				GeneratedButton = {};
				if ( 'object' === typeof InsideButtons[ Index ] )
				{
					GeneratedButton = this.__wrapInsideButton( InsideButtons[ Index ] );
					Buttons.push( GeneratedButton );
				}
				else
				{
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
		}
		else
		{
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

	__addCommonOptionalProperties()
	{
		this.__addClass();
		this.__addVisibilityType();
		this.__addMiscellaneous();
		this.__addInsideButton();
		this.__addStringBasedAttributes();
		this.__addMethods();
		this.__addEvents();
	}
}
