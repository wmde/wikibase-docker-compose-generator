import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import VueFormWizard from 'vue-form-wizard';
import StringHelper from './lib/StringHelper';
import FormFactory from './lib/blubberFormGenerator/FormSchemaFactory';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import BlubberFormSchemaConstructor from './lib/blubberFormGenerator/FormSchemaFactory';

Vue.use( VueFormWizard );
Vue.use( VueFormGenerator );

const BlubberFormFactory = {
	methods: {
		buildBlubberForm: function ( createElement, Form, LabelGenerator )
		{
			let Tab, VGenerator, Description;
			const Tabs = [];
			const FormSchema = new BlubberFormSchemaConstructor( Form, this, LabelGenerator );
			FormSchema.build();
			console.log( FormSchema.Form );

			if( 0 === FormSchema.Steps.length )
			{

			}
			else
			{

			}
			/*

            this.$data.blubberFormSchema[ FormId ] = [];
            this.$data.blubberModel[ FormId ] = {};
            this.$data.currentFormId = FormId;

            VGenerator = createElement(
                'vue-form-generator',
                {
                    props: {
                        model: Generated.NodeSchema.model,
                        schema: Generated.NodeSchema.schema,
                        isNewModel: Generated.NodeSchema.isNewModel,
                        multiple: Generated.NodeSchema.multiple,
                        ref: Generated.NodeSchema.ref,
                        tag: Generated.NodeSchema.tag
                    }
                }
            );

            Description = createElement(
                'div',
                {
                    attr: Generated.NodeSchema.description.attr,
                    domProps: Generated.NodeSchema.description.domProps
                }
            );

            Tab = createElement(
                'tab-content',
                {
                    attr: {
                        id: Generated.NodeSchema.id
                    },
                    props: {
                        title: Generated.NodeSchema.title,
                        icon: Generated.NodeSchema.icon
                    }
                },
                [ Description, VGenerator ]
            );

            Tabs.push( Tab );
        }

        return createElement( 'form-wizard', {
            attrs: FormAttributes,
            props: FormProperties
        }, Tabs );*/
		}
	},
	data: function ()
	{
		return { blubberModel: {}, blubberFormSchema: {} };
	}
};

export default BlubberFormFactory;
