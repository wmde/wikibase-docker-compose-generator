import BlubberStep from './Step';
import { TypeErrorException, BaseException } from '../BaseExceptions';
import Utils from '../../../Utils';
import { FieldBase } from './FieldBase';

class InvalidFormException extends BaseException {
	constructor() {
		super( 'InvalidFormException', 'The given form is invalid.' );
	}
}

export default class BlubberFormSchemaConstructor extends FieldBase {
	static __FORM_LABELED_PROPERTIES__ = [ 'backButtonText', 'finishButtonText', 'nextButtonText', 'subtitle', 'title' ];
	static __FORM_ATTRIBUTES__ = [ 'class', 'id' ];
	static __FORM_EVENTS__ = [ 'onComplete', 'onLoading', 'onValidate', 'onError', 'onChange' ];
	static __BOOLEAN_PROPERTIES__ = [ 'validateOnBack' ];
	static __NUMERIC_PROPERTIES__ = [ 'startIndex' ];

	__Form;
	Form;

	constructor( Form, BindedObject, Generator ) {
		super( null, BindedObject, Generator );
		this.__Form = Form;
		this.Form = {
			FormEvents: {},
			FormProperties: {},
			FormAttributes: {},
			Schema: {},
			Model: {},
			Steps: []
		};
		this.__validateProperties();
		this.__setFormPropterties();
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
		let Label;
		for ( Label in this.__Form.formAttributes ) {
			if ( BlubberFormSchemaConstructor.__FORM_EVENTS__.indexOf( Label ) !== -1 ) {
				Label = Label.substring( 2 ).toLowerCase();
				this.Form.FormEvents[ Label ] = this._executeFunctionOrGetAnything(
					this.__Form.formAttributes[ Label ],
					true
				);
			} else if ( BlubberFormSchemaConstructor.__FORM_ATTRIBUTES__.indexOf( Label ) !== -1 ) {
				this.Form.FormAttributes[ Label ] = this.__Form.formAttributes[ Label ];
			} else if (
				BlubberFormSchemaConstructor.__FORM_LABELED_PROPERTIES__.indexOf( Label ) !== -1
			) {
				this.Form.FormProperties[ Label ] = this._getStringLabelOrPlaceholder(
					this.__Form.formAttributes[ Label ]
				);
			} else if ( BlubberFormSchemaConstructor.__BOOLEAN_PROPERTIES__.indexOf( Label ) !== -1 ) {
				this.Form.FormProperties[ Label ] = this._executeFunctionOrGetBoolean(
					this.__Form.formAttributes[ Label ]
				);
			} else if ( BlubberFormSchemaConstructor.__NUMERIC_PROPERTIES__.indexOf( Label ) !== -1 ) {
				this.Form.FormProperties[ Label ] = this._executeFunctionOrGetNumber(
					parseInt( this.__Form.formAttributes[ Label ] )
				);
			} else {
				this.Form.FormProperties[ Label ] = this.__Form.formAttributes[ Label ];
			}
		}
	}

	build() {
		let Generated, Index;

		if ( this.__Form.hasOwnProperty( 'fields' ) === true ) {
			Generated = new BlubberStep( this.__Form.fields, this._BindedObject, this._LabelGenerator );
			this.Form.Schema = {
				fields: Generated.Fields,
				groups: Generated.Groups
			};

			this.Form.model = Generated.Model;
			this.Form.Steps = Generated.NodeSchema;
		} else if ( this.__Form.hasOwnProperty( 'steps' ) === true && Array.isArray( this.__Form.steps ) === true ) {
			this.Form.Schema = [];
			for ( Index in this.__Form.steps ) {
				Generated = new BlubberStep(
					this.__Form.steps[ Index ],
					this._BindedObject,
					this._LabelGenerator
				);
				Generated.build();
                console.log(Generated)
				this.Form.Model = Object.assign( {}, Generated.Model, this.Form.Model );
				if ( Generated.getCondition() === true ) {
					continue;
				}

				this.Form.Schema.push( {
					fields: Generated.Fields,
					groups: Generated.Groups
				} );

				this.Form.Steps.push( [ Generated.NodeSchema, Generated.getCondition() ] );
			}
		} else {
			throw new InvalidFormException();
		}
	}
}
