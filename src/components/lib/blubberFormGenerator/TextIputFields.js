import TextBase from './TextBase';

export default class TextIputFields extends TextBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._assignString( 'getValuesFromList', 'list' );
	}
}
