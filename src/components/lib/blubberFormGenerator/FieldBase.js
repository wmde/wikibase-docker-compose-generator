import StringHelper from '../StringHelper';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
import InvalidFieldValueException from './Exceptions/InvalidFieldValueException';
import IdRegister from './IdRegister';
import Utils from '../../../Utils';

/* eslint-disable operator-linebreak */
export default class FieldBase
{
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
	/* Statics */
	static _IdRegistry = new IdRegister();
	static ModelRenderCondition = true;
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
			this._Field = { name: '"not set"' };
		}

		if ( -1 === ValueType && FieldBase.__IS_ANY__ !== Type )
		{
			throw new InvalidFieldValueException(
				StringHelper.format(
					FieldBase._UNSUPPORTED_TYPE_,
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
						FieldBase._UNKNOWN_METHOD_,
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
					FieldBase._UNSUPPORTED_TYPE_,
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
						FieldBase._UNKNOWN_METHOD_,
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
				FieldBase._UNSUPPORTED_TYPE_,
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
			throw new InvalidFieldPropertyException( FieldBase._NO_NAME_ );
		}

		if ( null === Self )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					FieldBase._NO_OBJECT_,
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

		if ( false === Utils.isEmpty( Value ) )
		{
			this.__HasDefaultValue = true;
		}
	}

	_fieldTakesMultibleValues()
	{
		if ( true === this.__HasDefaultValue )
		{
			if ( true === Array.isArray( this.__ModelKey ) )
			{
				this._addValueToModel( this.__ModelPointer[ this.__ModelKey[ this.__ModelKey.length - 1 ] ] );
			}
			else
			{
				this._addValueToModel( this.__ModelPointer[ this.__ModelKey ] );
			}
		}
		else
		{
			this._addValueToModel( [] );
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
