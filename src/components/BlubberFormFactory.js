import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';
import Utils from '../Utils';
/* eslint-disable operator-linebreak */
Vue.use( VueFormWizard );
Vue.use( VueFormGenerator );

const BlubberFormFactory = {
	methods: {
		buildBlubberForm: function ( createElement, Form, LabelGenerator )
		{
			let Tab, VGenerator, Description, Step, Index;
			const Tabs = [];
			const FormSchema = new BlubberFormSchemaConstructor( Form, this, LabelGenerator );
			FormSchema.build();

			if ( false === Array.isArray( FormSchema.Form.Steps[ 0 ] ) )
			{
				if ( true === FormSchema.Form.Steps[ 1 ] )
				{
					if ( false === Utils.isEmpty( FormSchema.Form.Steps[ 0 ].inner.schema ) )
					{
						VGenerator = createElement(
							'vue-form-generator',
							{
								props: FormSchema.Form.Steps[ 0 ].inner,
								attr: FormSchema.Form.Steps[ 0 ].attr
							}
						);
					}
					else
					{
						VGenerator = '';
					}

					if ( false === Utils.isEmpty( FormSchema.Form.Steps[ 0 ].description.domProps ) )
					{
						Description = createElement(
							'div',
							{
								attr: FormSchema.Form.Steps[ 0 ].description.attr,
								domProps: FormSchema.Form.Steps[ 0 ].description.domProps
							}
						);
					}
					else
					{
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
				}
				else
				{
					return '';
				}
			}
			else
			{
				for ( Index in FormSchema.Form.Steps )
				{
					Step = FormSchema.Form.Steps[ Index ][ 0 ];

					if ( false === FormSchema.Form.Steps[ Index ][ 1 ] )
					{
						if ( false === Utils.isEmpty( Step.inner.schema ) )
						{
							VGenerator = createElement(
								'vue-form-generator',
								{
									props: Step.inner
								}
							);
						}
						else
						{
							VGenerator = '';
						}

						if ( false === Utils.isEmpty( Step.description.domProps ) )
						{
							Description = createElement(
								'div',
								{
									attr: Step.description.attr,
									domProps: Step.description.domProps
								}
							);
						}
						else
						{
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

		}

		r*/
		}
	},
	data: function ()
	{
		return { blubberModel: {}, blubberFormSchema: {} };
	}
};

export default BlubberFormFactory;
