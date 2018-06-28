import {
	CommonOptionalAttributesAndMethods,
	InvalidFieldException,
	InvalidFieldPropertyException,
	InvalidFieldValueException
} from './Base';
import StringHelper from '../StringHelper';

class OptionBasedFields extends CommonOptionalAttributesAndMethods
{
	/* Errors */
	static __NO_VALUES__ = 'The given field {} has no \'values\' property.';
	static __CANNOT_SWITCH_VALUES__ = 'Cannot switch from automatic field definition to manual at field {}.'

	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
	}

	__addLabel( Where, Label, AssignmentLabel )
	{
		if ( Where.hasOwnProperty( Label ) )
		{
			Where[ AssignmentLabel ] = this.__getStringLabelOrPlaceholder( Where[ Label ] );
		}
	}

	_addValueProperty( LabelKey, ValueKey )
	{
		let Mutable, GeneratedValue, ValueIndex, ValueIsString;
		const GeneratedValues = [];
		if ( true === this._Field.hasOwnProperty( 'values' ) )
		{
			Mutable = this._executeFunctionOrGetArray( this._Field.values );
		}
		else
		{
			throw new InvalidFieldException(
				StringHelper.format(
					OptionBasedFields.__NO_VALUES__,
					this._Field.name
				)
			);
		}

		if ( false === Array.isArray( Mutable ) )
		{
			return Mutable;
		}

		if ( 'string' === typeof Mutable[ 0 ] )
		{
			ValueIsString = true;
		}
		else
		{
			ValueIsString = false;
		}

		for ( ValueIndex in Mutable )
		{
			if ( 'string' === typeof Mutable[ ValueIndex ] )
			{
				if ( true === ValueIsString )
				{
					GeneratedValues.push( Mutable[ ValueIndex ] );
				}
				else
				{
					throw new InvalidFieldValueException(
						StringHelper.format(
							OptionBasedFields.__CANNOT_SWITCH_VALUES__,
							this._Field.name
						)
					);

				}
			}
			else if ( 'object' === typeof Mutable[ ValueIndex ] )
			{
				if ( false !== ValueIsString )
				{
					throw new InvalidFieldValueException(
						StringHelper.format(
							OptionBasedFields.__CANNOT_SWITCH_VALUES__,
							this._Field.name
						)
					);

				}

				GeneratedValue = {};
				GeneratedValue[ ValueKey ] = Mutable[ ValueIndex ][ ValueKey ];
				this.__addLabel(
					GeneratedValue,
					Mutable[ ValueIndex ],
					LabelKey
				);

				GeneratedValues.push( GeneratedValue );
			}
			else
			{
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						OptionBasedFields.__UNSUPPORTED_TYPE__,
						typeof Mutable[ ValueIndex ],
						this._Field.name,
						'at values',
						'object or string'
					)
				);
			}
		}

		return GeneratedValues;
	}

	_addOptionProperty()
	{
		const GeneratedProperty = {};
		this._GeneratedField.options = GeneratedProperty;

		if ( false === ( 'value' in GeneratedProperty ) )
		{
			GeneratedProperty.value = 'value';
		}

		if ( false === ( 'name' in GeneratedProperty ) )
		{
			GeneratedProperty.name = 'label';
		}
	}
}

export class ChoiceField extends OptionBasedFields
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'radios';
		this.__buildChoise();
	}

	__buildChoise()
	{
		this._GeneratedField.radiosOptions = this._addOptionProperty();
		this._GeneratedField.values = this._addValueProperty(
			this._GeneratedField.radiosOptions.name,
			this._GeneratedField.radiosOptions.value
		);
	}
}

export class SelectionField extends OptionBasedFields
{

	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'select';
		this.__buildSelection();
	}

	__buildSelection()
	{
		this._GeneratedField.selectOptions = this._addOptionProperty();
		this._GeneratedField.selectOptions.hideNoneSelectedText = false;

		if ( true === this._GeneratedField.selectOptions.hasOwnProperty( 'noneSelectedText' ) )
		{
			this._GeneratedField.selectOptions.noneSelectedText = this._getStringLabelOrPlaceholder(
				this._GeneratedField.selectOptions.noneSelectedText
			);

			if ( true === this._GeneratedField.selectOptions.hasOwnProperty( 'hideNoneSelectedText' ) )
			{
				this._GeneratedField.selectOptions.hideNoneSelectedText = true;
			}
		}
		else
		{
			if ( true === this._GeneratedField.selectOptions.hasOwnProperty( 'hideNoneSelectedText' ) )
			{
				this._GeneratedField.selectOptions.hideNoneSelectedText = true;
			}
		}

		this._GeneratedField.selectOptions.values = this._addValueProperty(
			this._GeneratedField.selectOptions.name,
			this._GeneratedField.selectOptions.value
		);
	}
}

export class CheckListField extends OptionBasedFields
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'checklist';
		this.__buildCheckList();
	}

	__buildCheckList()
	{
		if ( this._Field.hasOwnProperty( 'asList' ) )
		{
			this._GeneratedField.listBox = this._executeFunctionOrGetBool( this._Field.asList );
		}
		else
		{
			this._GeneratedField.listBox = false;
			this._setAutocomplete();
		}

		this._fieldTakesMultibleValues();

		this._GeneratedField.checklistOptions = this.__addOptionProperty();
		this._GeneratedField.values = this.__addValueProperty(
			this._GeneratedField.checklistOptions.name,
			this._GeneratedField.checklistOptions.value
		);
	}
}
