import TextField from './TextField';

export default class SearchField extends TextField {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._assignString( 'dir' );
	}
}
