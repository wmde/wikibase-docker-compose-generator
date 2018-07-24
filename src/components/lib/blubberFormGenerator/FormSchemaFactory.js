import BlubberStep from './Step';
import TypeErrorException from '../Exceptions/TypeErrorException';
import Utils from '../../../Utils';
import FieldBase from './FieldBase';
import InvalidFormException from './Exceptions/InvalidFormException';

export default class BlubberFormSchemaConstructor extends FieldBase {
	static _FORM_PROPERTIES_ = [ 'backButtonText', 'finishButtonText', 'nextButtonText', 'subtitle', 'title' ];
	static _FORM_ATTRIBUTES_ = [ 'class', 'id' ];
	static _FORM_EVENTS_ = [ 'onComplete', 'onLoading', 'onValidate', 'onError', 'onChange' ];
	static _BOOLEAN_PROPERTIES_ = [ 'validateOnBack' ];
	static _NUMERIC_PROPERTIES_ = [ 'startIndex' ];

	__Form;
	Form;

	constructor( Form, BindedObject, Generator ) {
		super( null, BindedObject, Generator );
		this.__Form = Form;
		this.Form = {
			JustFields: false,
			FormEvents: {},
			FormProperties: {},
			FormAttributes: {},
			FormRef: '',
			Schema: [],
			Model: {},
			Steps: []
		};

		if ( this.__Form.hasOwnProperty( 'bind' ) === true ) {
			this.__buildDynamicForm();
		}

		this.__validateProperties();
		this.__setFormPropterties();
		this.cleanUpStructure();
	}

	cleanUpStructure() {
		delete this._Model;
		delete this.__HasDefaultValue;
		delete this.__ModelKey;
		delete this.__ModelPointer;
		delete this._GeneratedField;
	}

	__buildDynamicForm() {
		let GeneratedForm;
		const Bind = this._executeFunctionOrGetAnything(
			this.__Form.bind,
			true
		);

		// eslint-disable-next-line
        GeneratedForm = Bind();

		if ( GeneratedForm === null || typeof GeneratedForm !== 'object' ) {
			throw new InvalidFormException();
		}

		this.__Form = Object.assign( this.__Form, GeneratedForm );
		delete this.__Form.bind;
	}

	__validateProperties() {
		if ( typeof this._LabelGenerator !== 'function' ) {
			throw new TypeErrorException( 'Invalid Labelgenerator' );
		}

		if ( Utils.isEmpty( this.__Form.formAttributes.id ) === true ) {
			throw new InvalidFormException();
		}
	}

	__setFormPropterties() {
		let Label, AssigmentLabel;
		this.Form.FormRef = this.__Form.formAttributes.id;

		for ( Label in this.__Form.formAttributes ) {
			if ( BlubberFormSchemaConstructor._FORM_EVENTS_.indexOf( Label ) !== -1 ) {
				AssigmentLabel = `on-${ Label.substring( 2 ).toLowerCase() }`;
				this.Form.FormEvents[ AssigmentLabel ] = this._executeFunctionOrGetAnything(
					this.__Form.formAttributes[ Label ],
					true
				);
			} else if ( BlubberFormSchemaConstructor._FORM_ATTRIBUTES_.indexOf( Label ) !== -1 ) {
				this.Form.FormAttributes[ Label ] = this.__Form.formAttributes[ Label ];
			} else if (
				BlubberFormSchemaConstructor._FORM_PROPERTIES_.indexOf( Label ) !== -1
			) {
				this.Form.FormProperties[ Label ] = this._getStringLabelOrPlaceholder(
					this.__Form.formAttributes[ Label ]
				);
			} else if ( BlubberFormSchemaConstructor._BOOLEAN_PROPERTIES_.indexOf( Label ) !== -1 ) {
				this.Form.FormProperties[ Label ] = this._executeFunctionOrGetBoolean(
					this.__Form.formAttributes[ Label ]
				);
			} else if ( BlubberFormSchemaConstructor._NUMERIC_PROPERTIES_.indexOf( Label ) !== -1 ) {
				this.Form.FormProperties[ Label ] = this._executeFunctionOrGetNumber(
					parseInt( this.__Form.formAttributes[ Label ] )
				);
			} else {
				this.Form.FormProperties[ Label ] = this.__Form.formAttributes[ Label ];
			}
		}
	}

	__build( Steps ) {
		const Generated = new BlubberStep(
			Steps,
			this._BindedObject,
			this._LabelGenerator,
			this.Form.Model
		);
		Generated.build();

		Object.assign( this.Form.Model, Generated.Model );

		this.Form.Steps.push( [ Generated.NodeSchema, Generated.getCondition() ] );
		this.Form.Schema.push( Generated.NodeSchema.inner.schema );
	}

	build() {
		let Index;

		if ( this.__Form.hasOwnProperty( 'fields' ) === true && Array.isArray( this.__Form.fields ) === true ) {
			this.__build( this.__Form.fields );
			this.Form.JustFields = true;
		} else if ( this.__Form.hasOwnProperty( 'steps' ) === true && Array.isArray( this.__Form.steps ) === true ) {
			this.Form.Schema = [];
			this.Form.JustFields = false;
			for ( Index in this.__Form.steps ) {
				this.__build( this.__Form.steps[ Index ] );
			}
		} else {
			throw new InvalidFormException();
		}

		delete this.__Form;
	}

	refresh( Model ) {
		let Index;
		this.Form.Model = Model;
		if ( this.Form.JustField === true ) {
			this.Form.Steps[ 0 ].inner.model = Model;
		} else {
			for ( Index in this.Form.Steps ) {
				this.Form.Steps[ Index ][ 0 ].inner.model = this.Form.Model;
			}
		}
	}
}
