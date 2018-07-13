import CommonOptionalAttributesAndMethods from '../CommonOptionalAttributesAndMethods';

export default class TextArea extends CommonOptionalAttributesAndMethods
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
