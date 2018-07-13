import HTMLInputBase from '../HTMLInputBase';

export default class NumberField extends HTMLInputBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._assignBoolean( 'readonly' );
		this._assignEmptyStringOrLabelString( 'briefDescription', 'placeholder' );
	}
}
