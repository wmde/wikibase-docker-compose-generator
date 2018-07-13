import HTMLInputBase from '../HTMLInputBase';

export default class ColorField extends HTMLInputBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._setAutocomplete();
		this._assignString( 'getValuesFromList', 'list' );
	}
}
