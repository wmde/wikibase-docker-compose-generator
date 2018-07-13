import BlubberStep from './Step';
import TypeErrorException from '../Exceptions/TypeErrorException';
import Utils from '../../../Utils';
import FieldBase from './FieldBase';
import InvalidFormException from './Exceptions/InvalidFormException';

export default class BlubberFormSchemaConstructor extends FieldBase
{
	static _FORM_PROPERTIES_ = [ 'backButtonText', 'finishButtonText', 'nextButtonText', 'subtitle', 'title' ];
	static _FORM_ATTRIBUTES_ = [ 'class', 'id' ];
	static _FORM_EVENTS_ = [ 'onComplete', 'onLoading', 'onValidate', 'onError', 'onChange' ];
	static _BOOLEAN_PROPERTIES_ = [ 'validateOnBack' ];
	static _NUMERIC_PROPERTIES_ = [ 'startIndex' ];

	__Form;
	Form;

	constructor( Form, BindedObject, Generator )
	{
		super( null, BindedObject, Generator );
		this.__Form = Form;
		this.Form = {
			JustField: false,
			FormEvents: {},
			FormProperties: {},
			FormAttributes: {},
			FormRef: '',
			Schema: {},
			Model: {},
			Steps: []
		};
		this.__validateProperties();
		this.__setFormPropterties();
	}

	__validateProperties()
	{
		if ( 'function' !== typeof this._LabelGenerator )
		{
			throw new TypeErrorException( 'Invalid Labelgenerator' );
		}

		if ( true === Utils.isEmpty( this.__Form.formAttributes.id ) )
		{
			throw new InvalidFormException();
		}
	}

	__setFormPropterties()
	{
		let Label, AssigmentLabel;
		this.Form.FormRef = this.__Form.formAttributes.id;
		for ( Label in this.__Form.formAttributes )
		{
			if ( -1 !== BlubberFormSchemaConstructor._FORM_EVENTS_.indexOf( Label ) )
			{
				AssigmentLabel = `on-${ Label.substring( 2 ).toLowerCase() }`;
				this.Form.FormEvents[ AssigmentLabel ] = this._executeFunctionOrGetAnything(
					this.__Form.formAttributes[ Label ],
					true
				);
			}
			else if ( -1 !== BlubberFormSchemaConstructor._FORM_ATTRIBUTES_.indexOf( Label ) )
			{
				this.Form.FormAttributes[ Label ] = this.__Form.formAttributes[ Label ];
			}
			else if (
				-1 !== BlubberFormSchemaConstructor._FORM_PROPERTIES_.indexOf( Label )
			)
			{
				this.Form.FormProperties[ Label ] = this._getStringLabelOrPlaceholder(
					this.__Form.formAttributes[ Label ]
				);
			}
			else if ( -1 !== BlubberFormSchemaConstructor._BOOLEAN_PROPERTIES_.indexOf( Label ) )
			{
				this.Form.FormProperties[ Label ] = this._executeFunctionOrGetBoolean(
					this.__Form.formAttributes[ Label ]
				);
			}
			else if ( -1 !== BlubberFormSchemaConstructor._NUMERIC_PROPERTIES_.indexOf( Label ) )
			{
				this.Form.FormProperties[ Label ] = this._executeFunctionOrGetNumber(
					parseInt( this.__Form.formAttributes[ Label ] )
				);
			}
			else
			{
				this.Form.FormProperties[ Label ] = this.__Form.formAttributes[ Label ];
			}
		}
	}

	build()
	{
		let Generated, Index;

		if ( true === this.__Form.hasOwnProperty( 'fields' ) )
		{
			Generated = new BlubberStep(
				this.__Form.fields,
				this._BindedObject,
				this._LabelGenerator
			);
			Generated.build();
			this.Form.Schema = {
				fields: Generated.Fields,
				groups: Generated.Groups
			};

			this.Form.JustField = true;
			this.Form.Model = Generated.Model;
			this.Form.Steps = Generated.NodeSchema;
			this.Form.Steps[ 0 ].inner.schema = this.Form.Schema;
			this.Form.Steps[ 0 ].inner.model = this.Form.Model;
		}
		else if ( true === this.__Form.hasOwnProperty( 'steps' ) && true === Array.isArray( this.__Form.steps ) )
		{
			this.Form.Schema = [];
			this.Form.JustField = false;
			for ( Index in this.__Form.steps )
			{
				Generated = new BlubberStep(
					this.__Form.steps[ Index ],
					this._BindedObject,
					this._LabelGenerator
				);

				Generated.build();

				this.Form.Model = Object.assign( {}, Generated.Model, this.Form.Model );
				if ( false === Generated.getCondition() )
				{
					continue;
				}

				this.Form.Schema.push( {
					fields: Generated.Fields,
					groups: Generated.Groups
				} );

				this.Form.Steps.push( [ Generated.NodeSchema, Generated.getCondition() ] );
			}

			for ( Index in this.Form.Steps )
			{
				this.Form.Steps[ Index ][ 0 ].inner.model = this.Form.Model;
				this.Form.Steps[ Index ][ 0 ].inner.schema = this.Form.Schema[ Index ];
			}
		}
		else
		{
			throw new InvalidFormException();
		}
	}

	refresh( Model )
	{
		let Index;
		this.Form.Model = Model;
		if ( true === this.Form.JustField )
		{
			this.Form.Steps[ 0 ].inner.model = Model;
		}
		else
		{
			for ( Index in this.Form.Steps )
			{
				this.Form.Steps[ Index ][ 0 ].inner.model = this.Form.Model;
			}
		}
	}
}
