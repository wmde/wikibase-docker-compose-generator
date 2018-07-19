import FieldBase from './FieldBase';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidIdWarning from './Exceptions/InvalidIdWarning';
import StringHelper from '../StringHelper';

export default class CommonRequiredAttributes extends FieldBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this.__addNeccesaryAttributes();
	}

	__addNeccesaryAttributes()
	{
		let Id;
		if ( 'class' in this._Field )
		{
			this._Field.styleClasses = this._Field.class;
			delete this._Field.class;
		}

		if ( false === this._Field.hasOwnProperty( 'name' ) )
		{
			throw new InvalidFieldException( FieldBase._NO_NAME_ );
		}

		if ( true === this._Field.hasOwnProperty( 'id' ) )
		{
			Id = this._executeFunctionOrGetString( this._Field.id );
		}
		else
		{
			Id = this._Field.name;
		}

		// common required properties
		if ( false === CommonRequiredAttributes._IdRegistry.containsId( Id ) )
		{
			this._GeneratedField.id = Id;
			CommonRequiredAttributes._IdRegistry.addId( Id );
		}
		else
		{
			new InvalidIdWarning( StringHelper.format( FieldBase._INVALID_ID_, Id ) );// eslint-disable-line
		}

		this._GeneratedField.model = `${ this._Field.name }`;

		if ( true === this._Field.hasOwnProperty( 'label' ) )
		{
			this._assignPlaceholderOrLabelString( 'label' );
		}
		else
		{
			this._assignPlaceholderOrLabelString( 'name', 'label' );
		}
	}
}
