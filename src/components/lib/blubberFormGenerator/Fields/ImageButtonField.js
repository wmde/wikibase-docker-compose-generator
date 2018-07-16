import HTMLInputBase from '../HTMLInputBase';

export default class ImageButtonField extends HTMLInputBase {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
	}

	__addAttributes() {
		this._assignString( 'alt' );
		this._assignString( 'formaction' );
		this._assignString( 'formEncoding', 'formenctype' );
		this._assignString( 'formmethod' );
		this._assignString( 'formnovalidate' );
		this._assignString( 'formtarget' );
		this._assignNumeric( 'height' );
	}
}
