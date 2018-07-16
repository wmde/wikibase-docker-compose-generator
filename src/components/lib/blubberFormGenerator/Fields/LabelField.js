import CommonOptionalAttributesAndMethods from '../CommonOptionalAttributesAndMethods';

export default class LabelField extends CommonOptionalAttributesAndMethods {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'label';
	}
}
