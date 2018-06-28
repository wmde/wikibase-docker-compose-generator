import BlubberStep from './Step';
import BlubberFields from './Fields';
import ObjectHelper from '../ObjectHelper';
import { TypeErrorException, BaseException } from '../BaseExceptions';

class InvalidFormException extends BaseException
{
	constructor()
	{
		super( 'InvalidFormException', 'The given form is invalid.' );
	}
}

export class BlubberFormFactory
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
    		Generated = new BlubberFields( this.__From, this.__BindedObject, this.__LabelGenerator );
    		this.Form.schema = {
    			fields: Generated.Fields,
    			groups: Generated.Groups
    		};

    		this.Form.model = Generated.Model;
    	}
    	else if ( true === this.__From.hasOwnProperty( 'steps' ) && true === Array.isArray( this.__From.steps ) )
    	{
    		this.Form.schema = [];
    		for ( Index in this.__From )
    		{
    			Generated = new BlubberStep( this.__From[ Index ], this.__BindedObject, this.__LabelGenerator );
    			this.Form.model = ObjectHelper.mergeObj( Generated.props.model, this.Form.model );
    			Generated.props.model = this.Form.model;
    			if (
    				true === this.__Templates[ FieldIndex ].hasOwnProperty( 'condition' ) &&
                    true === this._executeFunctionOrGetBool( this.__Templates[ FieldIndex ].condition )
    			)
    			{
    				continue;
    			}

    			this.Form.schema.push( Generated.props.schema );
    		}
    	}
    	else
    	{
    		throw new InvalidFormException();
    	}
    }
}
