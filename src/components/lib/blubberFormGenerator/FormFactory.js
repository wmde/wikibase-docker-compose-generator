import BlubberStep from './Step';
import BlubberFields from './Fields';
import ObjectHelper from '../ObjectHelper';
import { TypeErrorException, BaseException } from '../BaseExceptions';
import Utils from '../../../Utils';

class InvalidFormException extends BaseException
{
	constructor()
	{
		super( 'InvalidFormException', 'The given form is invalid.' );
	}
}

export default class BlubberFormFactory
{
	static __INVALID_FORM__ = 'The given Form is invalid.';
	__LabelGenerator;
	__BindedObject;
	__From;
	Form;

	constructor( Form, BindedObject, Generator )
	{
		this.__LabelGenerator = Generator;
		this.__BindedObject = BindedObject;
		this.__From = Form;
		console.log( Form )
		this.Form = { schema: {}, model: {} };
		this.validateProperties();
	}

	validateProperties()
	{
		if ( 'function' !== typeof this.__LabelGenerator )
		{
			throw new TypeErrorException( 'Invalid Labelgenerator' );
		}

		if ( true === Utils.isEmpty( this.__From.id ) )
		{
			throw new InvalidFormException();
		}

		if ( 'object' !== typeof this.__From.formAttributes )
		{
			this.__From.formAttributes = { id: this.__From.id };
		}
		else
		{
			this.__From.formAttributes.id = this.__From.id;
		}
	}

	build()
	{
		let Generated, Index;
		if ( true === this.__From.hasOwnProperty( 'fields' ) )
		{
			Generated = new BlubberFields( this.__From[ 'fields' ], this.__BindedObject, this.__LabelGenerator );
			this.Form.schema = {
				fields: Generated.Fields,
				groups: Generated.Groups
			};

			this.Form.model = Generated.Model;
		}
		else if ( true === this.__From.hasOwnProperty( 'steps' ) && true === Array.isArray( this.__From.steps ) )
		{
			this.Form.schema = [];
			for ( Index in this.__From[ 'steps' ] )
			{
                console.log( Index )
				Generated = new BlubberStep( this.__From[ 'steps' ][ Index ], this.__BindedObject, this.__LabelGenerator );
				Generated.build();
				this.Form.model = ObjectHelper.mergeObj( Generated['NodeSchema'].props.model, this.Form.model );
				if ( true === Generated.getCondition() )
				{
					continue;
				}

				this.Form.schema.push( Generated['NodeSchema'].props.schema );
			}
		}
		else
		{
			throw new InvalidFormException();
		}
	}
}
