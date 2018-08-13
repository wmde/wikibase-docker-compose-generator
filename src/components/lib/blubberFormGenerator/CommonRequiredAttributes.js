import FieldBase from './FieldBase';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidIdWarning from './Exceptions/InvalidIdWarning';
import StringHelper from '../StringHelper';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';

export default class CommonRequiredAttributes extends FieldBase {
	static _INVALID_IDENTIFIER_STRING_ = 'The given string {} is not a valid identifier string.';

	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this.__addNeccesaryAttributes();
	}

	__addNeccesaryAttributes() {
		let Id;
		if ( 'class' in this._Field ) {
			this._Field.styleClasses = this._Field.class;
			delete this._Field.class;
		}

		if ( this._Field.hasOwnProperty( 'name' ) === false ) {
			throw new InvalidFieldException( FieldBase._NO_NAME_ );
		}

		if ( this._Field.hasOwnProperty( 'id' ) === true ) {
			Id = this._executeFunctionOrGetString( this._Field.id );

			if ( this._validateIdentifier( Id ) === false ) {
				throw new InvalidFieldPropertyException(
					CommonRequiredAttributes._INVALID_IDENTIFIER_STRING_,
					Id );
			}
		} else {
			Id = this._Field.name;
		}

		if ( this._validateIdentifier( this._Field.name ) === false ) {
			throw new InvalidFieldPropertyException(
				StringHelper.format(
					CommonRequiredAttributes._INVALID_IDENTIFIER_STRING_,
					Id
				)
			);
		}

		// common required properties
		if ( CommonRequiredAttributes._IdRegistry.containsId( Id ) === false ) {
			this._GeneratedField.id = Id;
			CommonRequiredAttributes._IdRegistry.addId( Id );
		} else {
			new InvalidIdWarning(// eslint-disable-line
				StringHelper.format(
					FieldBase._INVALID_ID_,
					Id
				)
			);
		}

		this._GeneratedField.model = `${ this._Field.name }`;

		if ( this._Field.hasOwnProperty( 'label' ) === true ) {
			this._assignPlaceholderOrLabelString( 'label' );
		} else {
			this._assignPlaceholderOrLabelString( 'name', 'label' );
		}
	}
}
