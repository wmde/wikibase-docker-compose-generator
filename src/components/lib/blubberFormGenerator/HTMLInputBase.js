import CommonOptionalAttributesAndMethods from './CommonOptionalAttributesAndMethods';

export default class HTMLInputBase extends CommonOptionalAttributesAndMethods
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'input';
		this._GeneratedField.inputType = this._Field.type;
	}
}
