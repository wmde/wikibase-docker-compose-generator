import CommonRequiredAttributes from '../CommonOptionalAttributesAndMethods';

export default class SubmitField extends CommonRequiredAttributes {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._addSubmitAttribute();
		this._GeneratedField.type = 'submit';
	}

	_addSubmitAttribute() {
		this._assignFunction( 'onSubmit' );
		this._assignBoolean( 'validateBeforeSubmit' );
		this._assignBoolean( 'isVisible', 'visible' );
		this._assignBoolean( 'isDisabled', 'disabled' );
		this._addLabel();
	}

	_addLabel() {
		let Mutable;
		if ( this._Field.hasOwnProperty( 'label' ) ) {
			Mutable = this._executeFunctionOrGetString( this._Field.label );
			this._GeneratedField.buttonText = this._getStringLabelOrPlaceholder(
				Mutable
			);
		} else {
			Mutable = this._executeFunctionOrGetString( this._Field.name );
			this._GeneratedField.buttonText = this._getStringLabelOrPlaceholder(
				Mutable
			);
		}
	}
}
