import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';

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

			if ( false === Array.isArray( FormSchema.Form.Steps ) )
			{
				Description = createElement(
					'div',
					{
						attr: FormSchema.Form.Steps.description.attr,
						domProps: FormSchema.Form.Steps.description.domProps
					}
				);

				VGenerator = createElement(
					'vue-form-generator',
					{
						props: FormSchema.Form.Steps.inner,
						attr: FormSchema.Form.Steps.attr
					}
				);
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
				for ( Index in FormSchema.Form.Steps )
				{
					Step = FormSchema.Form.Steps[ Index ];
					VGenerator = createElement(
						'vue-form-generator',
						{
							props: Step.inner
						}
					);

					Description = createElement(
						'div',
						{
							attr: Step.description.attr,
							domProps: Step.description.domProps
						}
					);

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
