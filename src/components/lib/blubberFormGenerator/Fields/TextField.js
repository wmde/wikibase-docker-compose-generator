import TextIputFields from '../TextIputFields';

export default class TextField extends TextIputFields {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._assignString( 'dir' );
	}
}
