import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import { FormWizard, TabContent } from 'vue-form-wizard';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';
import Utils from '../Utils';
/* eslint-disable operator-linebreak */
Vue.use( VueFormGenerator );

export default {
	components: {
		FormWizard,
		TabContent
	},
	methods: {
		buildBlubberForm: function ( createElement, Form, LabelGenerator ) {
			let Tab, VGenerator, Description, Step, Index;
			const Tabs = [];
			const FormSchema = new BlubberFormSchemaConstructor( Form, this, LabelGenerator );
			FormSchema.build();

			if ( Array.isArray( FormSchema.Form.Steps[ 0 ] ) === false ) {
				if ( FormSchema.Form.Steps[ 1 ] === true ) {
					if ( Utils.isEmpty( FormSchema.Form.Steps[ 0 ].inner.schema ) === false ) {
						VGenerator = createElement(
							'vue-form-generator',
							{
								props: FormSchema.Form.Steps[ 0 ].inner,
								attr: FormSchema.Form.Steps[ 0 ].attr
							}
						);
					} else {
						VGenerator = '';
					}

					if ( Utils.isEmpty( FormSchema.Form.Steps[ 0 ].description.domProps ) === false ) {
						Description = createElement(
							'div',
							{
								attr: FormSchema.Form.Steps[ 0 ].description.attr,
								domProps: FormSchema.Form.Steps[ 0 ].description.domProps
							}
						);
					} else {
						Description = '';
					}

					return createElement(
						'form-wizard',
						{
							attrs: FormSchema.Form.FormAttributes,
							props: FormSchema.Form.FormProperties,
							on: FormSchema.Form.FormEvents
						},
						[ Description, VGenerator ]
					);
				} else {
					return '';
				}
			} else {
				for ( Index in FormSchema.Form.Steps ) {
					Step = FormSchema.Form.Steps[ Index ][ 0 ];

					if ( FormSchema.Form.Steps[ Index ][ 1 ] === false ) {
						if ( Utils.isEmpty( Step.inner.schema ) === false ) {
							VGenerator = createElement(
								'vue-form-generator',
								{
									props: Step.inner
								}
							);
						} else {
							VGenerator = '';
						}

						if ( Utils.isEmpty( Step.description.domProps ) === false ) {
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

						Tab = createElement(
							'tab-content',
							{
								attr: Step.attr,
								props: Step.tab
							},
							[ Description, VGenerator ]
						);

						Tabs.push( Tab );
					}
				}

				return createElement(
					'form-wizard',
					{
						attrs: FormSchema.Form.FormAttributes,
						props: FormSchema.Form.FormProperties,
						on: FormSchema.Form.FormEvents
					},
					Tabs
				);
			}
			/*

			this.$data.blubberFormSchema[ FormId ] = [];
			this.$data.blubberModel[ FormId ] = {};
			this.$data.currentFormId = FormId;
		}*/
		}
	},
	data: function () {
		return { blubberModel: {}, blubberFormSchema: {} };
	}
};
