import { CommonRequiredAttributes, CommonOptionalAttributesAndMethods } from './FieldBase';

export class SubmitField extends CommonRequiredAttributes
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._addSubmitAttribute();
		this._GeneratedField.type = 'submit';
	}

	_addSubmitAttribute()
	{
		this._assignFunction( 'onSubmit' );
		this._assignBoolean( 'validateBeforeSubmit' );
		this._assignBoolean( 'isVisible', 'visible' );
		this._assignBoolean( 'isDisabled', 'disabled' );
		this._addLabel();
	}

	_addLabel()
	{
		let Mutable;
		if ( this._Field.hasOwnProperty( 'label' ) )
		{
			Mutable = this._executeFunctionOrGetString( this._Field.label );
			this._GeneratedField.buttonText = this._getStringLabelOrPlaceholder(
				Mutable
			);
		}
		else
		{
			Mutable = this._executeFunctionOrGetString( this._Field.name );
			this._GeneratedField.buttonText = this._getStringLabelOrPlaceholder(
				Mutable
			);
		}
	}
}

export class TextBlock extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'textarea';
		this._buildField();
	}

	_buildField()
	{
		this._setAutocomplete();
		this._assignBoolean( 'readonly' );
		this._assignEmptyStringOrLabelString( 'briefDescription', 'placeholder' );
		this._assignNumeric( 'maximum', 'max' );
		this._assignNumeric( 'minimum', 'min' );
		this._assignNumeric( 'rows' );
	}
}

export class FileField extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'input';
		this._GeneratedField.inputType = this._Field.type;

		this._assignString( 'accept' );
		this._assignBoolean( 'multipleInput', 'multiple' );
		if ( true === this._GeneratedField.hasOwnProperty( 'multiple' ) )
		{
			this._GeneratedField.multi = this._GeneratedField.multiple;
			this._fieldTakesMultibleValues();
		}
	}
}

export class ColorField extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'input';
		this._GeneratedField.inputType = this._Field.type;
		this._setAutocomplete();
		this._assignString( 'getValuesFromList', 'list' );
	}
}

export class ResetField extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'input';
		this._GeneratedField.inputType = this._Field.type;
	}
}

export class HiddenField extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'input';
		this._GeneratedField.inputType = this._Field.type;
	}
}

export class LabelField extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'label';
	}
}
