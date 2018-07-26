import FieldBase from './FieldBase';
import StringHelper from '../StringHelper';
import CommonRequiredAttributes from './CommonRequiredAttributes';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
import Utils from '../../../Utils';

export default class CommonOptionalAttributesAndMethods extends CommonRequiredAttributes
{
	/* ERRORS*/
	static _NO_BUTTON_ = 'A insidebutton of field {} has no label.';

	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this.__addStore();
		this.__addCommonOptionalProperties();
	}

	_setAutocomplete()
	{
		if (
			true === this._Field.hasOwnProperty( 'autocomplete' ) &&
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

		if (
			(
				true === this._Field.hasOwnProperty( 'default' ) &&
				false === Utils.isEmpty( this._Field.default )
			) ||
			'boolean' !== typeof this._Field.default
		)
		{
			this._addValueToModel( this._executeFunctionOrGetAnything( this._Field.default ) );
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
		this._assignFunction( 'onChanged' );
		this._assignFunction( 'onValidated' );
		this._assignFunction( 'validator' );
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
						FieldBase._UNSUPPORTED_TYPE_,
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
								FieldBase._UNSUPPORTED_TYPE_,
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
					CommonOptionalAttributesAndMethods._NO_BUTTON_,
					this._Field.name
				)
			);
		}

		GeneratedButton.onclick = this._executeFunctionOrGetAnything( Button.action, true );
		return GeneratedButton;
	}

	__addInsideButton()
	{
		let Index, InsideButtons;
		const Buttons = [];

		if ( false === this._Field.hasOwnProperty( 'buttons' ) )
		{
			return;
		}
		// eslint-disable-next-line
		InsideButtons = this._executeFunctionOrGetAnything(this._Field['buttons']);

		if ( 'object' === typeof InsideButtons && false === Array.isArray( InsideButtons ) )
		{
			if (
				true === InsideButtons.hasOwnProperty( 'renderCondition' ) &&
				false === this._executeFunctionOrGetBoolean( InsideButtons.renderCondition )
			)
			{
				return;
			}
			Buttons.push( this.__wrapInsideButton( InsideButtons ) );
		}
		else if ( true === Array.isArray( InsideButtons ) )
		{
			for ( Index in InsideButtons )
			{
				if (
					true === InsideButtons[ Index ].hasOwnProperty( 'renderCondition' ) &&
					false === this._executeFunctionOrGetBoolean( InsideButtons[ Index ].renderCondition )
				)
				{
					continue;
				}

				if ( 'object' === typeof InsideButtons[ Index ] )
				{
					Buttons.push( this.__wrapInsideButton( InsideButtons[ Index ] ) );
				}
				else
				{
					throw new InvalidFieldPropertyException(
						StringHelper.format(
							FieldBase._UNSUPPORTED_TYPE_,
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
					FieldBase._UNSUPPORTED_TYPE_,
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
