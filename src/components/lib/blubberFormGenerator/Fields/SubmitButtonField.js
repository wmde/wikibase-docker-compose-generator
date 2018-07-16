import ButtonField from './ButtonField';

export default class SubmitButtonField extends ButtonField {
	constructor( Field, BindedObject, Generator ) {
		Field.type = 'submit';
		super( Field, BindedObject, Generator );
		this.__addAttributes();
	}

	__addAttributes() {
		this._assignString( 'formaction' );
		this._assignString( 'formEncoding', 'formenctype' );
		this._assignString( 'formmethod' );
		this._assignString( 'formnovalidate' );
		this._assignString( 'formtarget' );
	}
}
