import FieldBase from './FieldBase';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidIdWarning from './Exceptions/InvalidIdWarning';
import StringHelper from '../StringHelper';

export default class CommonRequiredAttributes extends FieldBase {
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
		} else {
			Id = this._Field.name;
		}

		// common required properties
		if ( FieldBase._IdRegistry.containsId( Id ) === false ) {
			this._GeneratedField.id = this._executeFunctionOrGetString( Id );
			FieldBase._IdRegistry.addId( Id );
		} else {
			new InvalidIdWarning( StringHelper.format( FieldBase._INVALID_ID_, Id ) );// eslint-disable-line
		}

		this._GeneratedField.model = `${ this._Field.name }`;

		if ( this._Field.hasOwnProperty( 'label' ) === true ) {
			this._assignPlaceholderOrLabelString( 'label' );
		} else {
			this._assignPlaceholderOrLabelString( 'name', 'label' );
		}
	}
}
