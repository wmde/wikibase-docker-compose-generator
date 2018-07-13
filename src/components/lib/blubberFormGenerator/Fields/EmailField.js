import TextIputFields from '../TextIputFields';

export default class EmailField extends TextIputFields
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._assignBoolean( 'multipleInput', 'multiple' );
		if ( this._GeneratedField.hasOwnProperty( 'multiple' ) )
		{
			this._GeneratedField.multi = this._GeneratedField.multiple;
			this._fieldTakesMultibleValues();
		}
	}
}
