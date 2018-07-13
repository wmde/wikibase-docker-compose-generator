import HTMLInputBase from '../HTMLInputBase';

export default class RangeField extends HTMLInputBase {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._assignBoolean( 'readonly' );
	}
}
