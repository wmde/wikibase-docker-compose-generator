import VueFormGenerator from 'vue-form-generator';
import { FormWizard, TabContent } from 'vue-form-wizard';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';
import Utils from '../Utils';
import ObjectHelper from './lib/ObjectHelper';
/* eslint-disable operator-linebreak */

export default {
	components: {
		FormWizard,
		TabContent,
		'vue-form-generator': VueFormGenerator.component
	},
	methods: {
		__generateFromSchema: function ( createElement, Schema )
		{
			let Tab, VGenerator, Description, Step, Index;
			const Tabs = [];
			if ( false === Array.isArray( Schema.Steps[ 0 ] ) )
			{
				if ( true === Schema.Steps[ 1 ] )
				{
					if ( false === Utils.isEmpty( Schema.Steps[ 0 ].inner.schema ) )
					{
						VGenerator = createElement(
							'vue-form-generator',
							{
								props: Schema.Steps[ 0 ].inner,
								attr: Schema.Steps[ 0 ].attr
							}
						);
					}
					else
					{
						VGenerator = '';
					}

					if (
						true === Schema.Steps[ 0 ].hasOwnProperty( 'description' )
                    &&
                        false === Utils.isEmpty( Schema.Steps[ 0 ].description.domProps )
					)
					{
						Description = createElement(
							'div',
							{
								attr: Schema.Steps[ 0 ].description.attr,
								domProps: Schema.Steps[ 0 ].description.domProps
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
							attrs: Schema.FormAttributes,
							props: Schema.FormProperties,
							on: Schema.FormEvents,
                            ref: Schema.FormRef
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
				for ( Index in Schema.Steps )
				{
					Step = Schema.Steps[ Index ][ 0 ];

					if ( true === Schema.Steps[ Index ][ 1 ] )
					{
						if (
                            0 < Step.inner.schema.fields.length
						||
							0 < Step.inner.schema.groups.length
						)
						{
							VGenerator = createElement(
								'vue-form-generator',
								{
									props: Step.inner,
									ref: Step.ref
								}
							);
						}
						else
						{
							VGenerator = '';
						}

						if (
							true === Step.hasOwnProperty( 'description' )
                        &&
                            false === Utils.isEmpty( Step.description.domProps )
						)
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
						attrs: Schema.FormAttributes,
						props: Schema.FormProperties,
						on: Schema.FormEvents,
						ref: Schema.FormRef
					},
					Tabs
				);
			}
		},
		buildBlubberForm: function ( createElement, Form, LabelGenerator, ForceReload = false )
		{
			let FormSchema;
			if ( false === Form.formAttributes.hasOwnProperty( 'id' ) )
			{
				return;
			}

			if (
				this.$data.blubberRaw.hasOwnProperty( Form.formAttributes.id )
			&&
				false === Utils.isEmpty( this.$data.blubberRaw[ Form.formAttributes.id ] )
			&&
				false === ForceReload
			)
			{
				this.$data.blubberRaw[ Form.formAttributes.id ].refresh(
					ObjectHelper.copyObj( this.$data.blubberModel[ Form.formAttributes.id ] )
				);
				this.$data.blubberModel[ Form.formAttributes.id ] = this.$data.blubberRaw[ Form.formAttributes.id ].Form.Model;
				return this.__generateFromSchema( createElement, this.$data.blubberRaw[ Form.formAttributes.id ].Form );
			}
			else
			{
				FormSchema = new BlubberFormSchemaConstructor( Form, this, LabelGenerator );
				FormSchema.build();
				this.$data.blubberModel[ Form.formAttributes.id ] = FormSchema.Form.Model;
				this.$data.blubberSchema[ Form.formAttributes.id ] = FormSchema.Form.Schema;
				this.$data.blubberRaw[ Form.formAttributes.id ] = FormSchema;
				return this.__generateFromSchema( createElement, FormSchema.Form );
			}

		}
	},
	data: function ()
	{
		return { blubberModel: {}, blubberSchema: {}, blubberRaw: {} };
	}
};
