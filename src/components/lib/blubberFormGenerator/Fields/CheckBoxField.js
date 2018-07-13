import CommonOptionalAttributesAndMethods from '../CommonOptionalAttributesAndMethods';

export default class CheckBoxField extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'checkbox';
		this._setAutocomplete();
	}
}
