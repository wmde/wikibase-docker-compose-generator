import HTMLInputBase from '../HTMLInputBase';

export default class FileUploadField extends HTMLInputBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );

		this._assignString( 'accept' );
		this._assignBoolean( 'multipleInput', 'multiple' );
		if ( true === this._GeneratedField.hasOwnProperty( 'multiple' ) )
		{
			this._GeneratedField.multi = this._GeneratedField.multiple;
			this._fieldTakesMultibleValues();
		}
	}
}
