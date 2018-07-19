import VueFormGenerator from 'vue-form-generator';
import { FormWizard, TabContent } from 'vue-form-wizard';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';
import Utils from '../Utils';
import ObjectHelper from './lib/ObjectHelper';
import FieldBase from './lib/blubberFormGenerator/FieldBase';
import { UPDATE_FORCE_COMPLETE_UPDATE, UPDATE_KEEP_MODEL, UPDATE_DEFAULT } from './lib/blubberFormGenerator/RenderConstants';
/* eslint-disable operator-linebreak */
export default {
	components: {
		FormWizard,
		TabContent,
		'vue-form-generator': VueFormGenerator.component
	},
	methods: {
		__generateAStep( createElement, Step )
		{
			let VGenerator, Description;

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

			return [ Description, VGenerator ];
		},
		__generateFromSchema: function ( createElement, Schema )
		{
			let Tab, Index, Fields;
			const Tabs = [];

			if ( true === Schema.JustFields )
			{
				if ( true === Schema.Steps[ 1 ] )
				{
					Fields = this.__generateAStep( createElement, Schema.Steps[ 0 ][ 0 ] );

					return createElement(
						'form-wizard',
						{
							attrs: Schema.FormAttributes,
							props: Schema.FormProperties,
							on: Schema.FormEvents,
							ref: Schema.FormRef
						},
						[ Fields[ 0 ], Fields[ 1 ] ]
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
					if ( true === Schema.Steps[ Index ][ 1 ] )
					{
						Fields = this.__generateAStep( createElement, Schema.Steps[ Index ][ 0 ] );
						Tab = createElement(
							'tab-content',
							{
								attr: Schema.Steps[ Index ][ 0 ].attr,
								props: Schema.Steps[ Index ][ 0 ].tab
							},
							[ Fields[ 0 ], Fields[ 1 ] ]
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
		buildBlubberForm: function ( createElement, Form, LabelGenerator, ReRenderFlag = UPDATE_DEFAULT )
		{
			let FormSchema;
            
            if( 
                false === Form.hasOwnProperty( 'formAttributes' ) 
            ||
                ( 
                    true === Form.hasOwnProperty( 'formAttributes' )
                &&
                    false === Form.formAttributes.hasOwnProperty( 'id' )
                )
            )
            {
                return '';
            }

		    FieldBase._IdRegistry.addId( Form.formAttributes.id );
        
            if (
				true === this.$data.blubberRaw.hasOwnProperty( Form.formAttributes.id )
			&&
				false === Utils.isEmpty( this.$data.blubberRaw[ Form.formAttributes.id ] )
			&&
				UPDATE_FORCE_COMPLETE_UPDATE !== ReRenderFlag
			)
			{
                if( UPDATE_DEFAULT === ReRenderFlag )
                {
    				this.$data.blubberRaw[ Form.formAttributes.id ].refresh(
	    				ObjectHelper.copyObj( this.$data.blubberModel[ Form.formAttributes.id ] )
		    		);
			    	this.$data.blubberModel[ Form.formAttributes.id ] = this.$data.blubberRaw[ Form.formAttributes.id ].Form.Model;
				    return this.__generateFromSchema( createElement, this.$data.blubberRaw[ Form.formAttributes.id ].Form );
                }
                else
                {
                    FormSchema =  new BlubberFormSchemaConstructor( Form, this, LabelGenerator );
                    FormSchema.build();
                    FormSchema.refresh(
                        Object.assign( 
                            FormSchema.Form.Model,
                            ObjectHelper.copyObj(this.$data.blubberModel[ Form.formAttributes.id ] )
                        )
                    );
                    
                    this.$data.blubberModel[ Form.formAttributes.id ] = FormSchema.Form.Model;
                    this.$data.blubberSchema[ Form.formAttributes.id ] = FormSchema.Form.Schema;
                    this.$data.blubberRaw[ Form.formAttributes.id ] = FormSchema;
                }
			}
			else
			{
				FormSchema = new BlubberFormSchemaConstructor( Form, this, LabelGenerator );
				FormSchema.build();
                console.log("hier");
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
}
