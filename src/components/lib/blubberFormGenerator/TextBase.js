/* eslint-disable operator-linebreak */
import HTMLInputBase from './HTMLInputBase';

export default class TextBase extends HTMLInputBase {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this.__addTextBasedAttributes();
	}

	__addTextBasedAttributes() {
		this._assignBoolean( 'readonly' );
		this._setAutocomplete();
		this._assignNumeric( 'maximum', 'maxlength' );
		this._assignString( 'pattern' );
		this._assignEmptyStringOrLabelString( 'briefDescription', 'placeholder' );
		this._assignNumeric( 'size' );
	}
}
