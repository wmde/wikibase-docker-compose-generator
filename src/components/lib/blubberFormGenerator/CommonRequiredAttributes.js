import FieldBase from './FieldBase';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidIdWarning from './Exceptions/InvalidIdWarning';
import StringHelper from '../StringHelper';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';

export default class CommonRequiredAttributes extends FieldBase
{
	static _INVALID_IDENTIFIER_STRING_ = 'The given string {} is not a valid identifier string.';

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

			if ( false === this._validateIdentifier( Id ) )
			{
				throw new InvalidFieldPropertyException(
					CommonRequiredAttributes._INVALID_IDENTIFIER_STRING_,
					Id );
			}
		}
		else
		{
			Id = this._Field.name;
		}

		if ( false === this._validateIdentifier( this._Field.name ) )
		{
			throw new InvalidFieldPropertyException(
				StringHelper.format(
					CommonRequiredAttributes._INVALID_IDENTIFIER_STRING_,
					Id
				)
			);
		}

		// common required properties
		if ( false === CommonRequiredAttributes._IdRegistry.containsId( Id ) )
		{
			this._GeneratedField.id = Id;
			CommonRequiredAttributes._IdRegistry.addId( Id );
		}
		else
		{
			new InvalidIdWarning(// eslint-disable-line
				StringHelper.format(
					FieldBase._INVALID_ID_,
					Id
				)
			);
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
