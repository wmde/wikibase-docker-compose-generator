import VueFormGenerator from 'vue-form-generator';
import { FormWizard, TabContent } from 'vue-form-wizard';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';
import Utils from '../Utils';
import ObjectHelper from './lib/ObjectHelper';
import FieldBase from './lib/blubberFormGenerator/FieldBase';
import {
	UPDATE_FORCE_COMPLETE_UPDATE,
	UPDATE_KEEP_MODEL,
	UPDATE_DEFAULT,
	UPDATE_KEEP_MODEL_DATA
} from './lib/blubberFormGenerator/RenderConstants';
import InvalidFormException from './lib/blubberFormGenerator/Exceptions/InvalidFieldException';
/* eslint-disable operator-linebreak */
export default {
	components: {
		FormWizard,
		TabContent,
		'vue-form-generator': VueFormGenerator.component
	},
	methods: {
		__generateAStep( createElement, Step ) {
			let VGenerator, Description;

			if (
				Step.inner.schema.hasOwnProperty( 'fields' ) === true
			&&
				Step.inner.schema.fields.length === 0 ) {
				delete Step.inner.schema.fields;
			}

			if (
				Step.inner.schema.hasOwnProperty( 'groups' ) === true
			&&
				Step.inner.schema.groups.length === 0
			) {
				delete Step.inner.schema.groups;
			}

			if (
				Step.inner.schema.hasOwnProperty( 'fields' ) === true
			||
				Step.inner.schema.hasOwnProperty( 'groups' ) === true
			) {
				VGenerator = createElement(
					'vue-form-generator',
					{
						props: Step.inner,
						ref: Step.ref
					}
				);
			} else {
				VGenerator = '';
			}

			if (
				Step.hasOwnProperty( 'description' ) === true
			&&
				Utils.isEmpty( Step.description.domProps ) === false
			) {
				Description = createElement(
					'div',
					{
						attr: Step.description.attr,
						domProps: Step.description.domProps
					}
				);
			} else {
				Description = '';
			}

			return [ Description, VGenerator ];
		},
		__generateFromSchema: function ( createElement, Schema ) {
			let Tab, Index, Fields;
			const Tabs = [];

			if ( Schema.JustFields === true ) {
				if ( Schema.Steps[ 0 ].inner.renderCondition === true ) {
					Fields = this.__generateAStep( createElement, Schema.Steps[ 0 ] );

					return createElement(
						'form-wizard',
						{
							attrs: Schema.FormAttributes,
							props: Schema.FormProperties,
							on: Schema.FormEvents,
							ref: Schema.FormRef
						},
						[
							createElement(
								'div',
								{
									attrs: Schema.Steps[ 0 ].attr
								},
								[ Fields[ 0 ], Fields[ 1 ] ]
							)
						]
					);
				} else {
					return '';
				}
			} else {
				for ( Index in Schema.Steps ) {
					if ( Schema.Steps[ Index ].inner.renderCondition === true ) {
						Fields = this.__generateAStep( createElement, Schema.Steps[ Index ] );
						Tab = createElement(
							'tab-content',
							{
								props: Schema.Steps[ Index ].tab
							},
							[
								createElement(
									'div',
									{
										attrs: Schema.Steps[ Index ].attr
									},
									[ Fields[ 0 ], Fields[ 1 ] ]
								)
							]
						);

						Tabs.push( Tab );
					}
				}

				return createElement(
					'form-wizard',
					{
						attrs: Schema.FormAttributes,
						props: Schema.FormProperties,
						on: Schema.FormEvents,
						ref: Schema.FormRef
					},
					Tabs
				);
			}
		},
		__copyModelData: function ( Source, Target ) {
			let Index;
			for ( Index in Source ) {
				if ( Target.hasOwnProperty( Index ) === false ) {
					continue;
				}

				if (
					typeof Source[ Index ] === 'object'
				&&
					typeof Target[ Index ] === 'object'
				) {
					this.__copyModelData( Target[ Index ], Source[ Index ] );
				} else {
					Target[ Index ] = Source[ Index ];
				}
			}
		},
		__buildForm: function ( createElement, BindedObject, Form, LabelGenerator, ReRenderFlag ) {
			const Ids = FieldBase._IdRegistry.getStore();
			const FormSchema = new BlubberFormSchemaConstructor(
				Form,
				BindedObject,
				LabelGenerator
			);
			FormSchema.build();

			if (
				UPDATE_FORCE_COMPLETE_UPDATE !== ReRenderFlag
			&&
				this.$data.blubberModel.hasOwnProperty( Form.formAttributes.id ) === true
			) {
				if ( UPDATE_KEEP_MODEL === ReRenderFlag ) {
					FormSchema.refresh(
						Object.assign(
							FormSchema.Form.Model,
							ObjectHelper.copyObj(
								this.$data.blubberModel[ Form.formAttributes.id ]
							)
						)
					);
				} else if ( UPDATE_KEEP_MODEL_DATA === ReRenderFlag ) {
					this.__copyModelData(
						this.$data.blubberModel[ Form.formAttributes.id ],
						FormSchema.Form.Model );
				}
			}

			this.$data.blubberModel[ Form.formAttributes.id ] = FormSchema.Form.Model;
			this.$data.blubberSchema[ Form.formAttributes.id ] = FormSchema.Form.Schema;
			this.$data.blubberRaw[ Form.formAttributes.id ] = FormSchema;
			this.$data.blubberIdTracker[
				Form.formAttributes.id
			] = FieldBase._IdRegistry.intersection( Ids );
			return this.__generateFromSchema( createElement, FormSchema.Form );
		},
		buildBlubberForm: function (
			createElement,
			BindedObject,
			Form,
			LabelGenerator = null,
			ReRenderFlag = UPDATE_DEFAULT
		) {
			if (
				Form.hasOwnProperty( 'formAttributes' ) === false
			||
				(
					Form.hasOwnProperty( 'formAttributes' ) === true
				&&
					Form.formAttributes.hasOwnProperty( 'id' ) === false
				)
			) {
				throw new InvalidFormException( 'There was no form id given.' );
			}

			if ( this.$data.blubberIdTracker.hasOwnProperty( Form.formAttributes.id ) === true ) {
				FieldBase._IdRegistry.removeIds(
					this.$data.blubberIdTracker[ Form.formAttributes.id ]
				);
			} else if (
				FieldBase._IdRegistry.containsId( Form.formAttributes.id ) === true
			) {
				throw new InvalidFormException( 'The given form id is allready in use.' );
			}

			FieldBase._IdRegistry.addId( Form.formAttributes.id );

			if (
				this.$data.blubberRaw.hasOwnProperty( Form.formAttributes.id ) === true
			&&
				Utils.isEmpty( this.$data.blubberRaw[ Form.formAttributes.id ] ) === false
			&&
                UPDATE_DEFAULT === ReRenderFlag
			) {
				this.$data.blubberRaw[ Form.formAttributes.id ].refresh(
					ObjectHelper.copyObj( this.$data.blubberModel[ Form.formAttributes.id ] )
				);

				this.$data.blubberModel[
					Form.formAttributes.id
				] = this.$data.blubberRaw[
					Form.formAttributes.id
				].Form.Model;
				return this.__generateFromSchema(
					createElement,
					this.$data.blubberRaw[ Form.formAttributes.id ].Form
				);
			} else {
				return this.__buildForm(
					createElement,
					BindedObject,
					Form,
					LabelGenerator,
					ReRenderFlag
				);
			}

		},
		setDefaultRenderBehaviour: function ( Value ) {
			FieldBase.RenderCondition = Value;
		},
		setDefaultModelRenderBehaviour: function ( Value ) {
			FieldBase.ModelRenderCondition = Value;
		}
	},
	data: function () {
		return {
			blubberModel: {},
			blubberSchema: {},
			blubberRaw: {},
			blubberIdTracker: {}
		};
	}
};
