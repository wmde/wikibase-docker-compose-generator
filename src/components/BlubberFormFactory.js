import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import VueFormWizard from 'vue-form-wizard';
import { BaseException, TypeErrorException } from './lib/BaseExceptions';
import StringHelper from './lib/StringHelper';
import ObjectHelper from './lib/ObjectHelper';
import Utils from '../Utils';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

Vue.use( VueFormWizard );
Vue.use( VueFormGenerator );

const BlubberFormFactory = {
	methods: {
		
		__buildVueGenerator: function ( createElement, Step, LabelGenerator )
		{
			let Options;
			const Index = this.$data.blubberFormSchema[ this.$data.currentFormId ].length;
			const GeneratedStep = this._buildFields( Step.fields, LabelGenerator );
			this.$data.blubberFormSchema[ this.$data.currentFormId ].push( GeneratedStep );

			if ( 'options' in Step )
			{
				Options = Step.options;
			}
			else
			{
				Options = {};
			}

			return createElement(
				'vue-form-generator',
				{
					props: {
						model: this.$data.blubberModel[ this.$data.currentFormId ],
						schema: this.$data.blubberFormSchema[ this.$data.currentFormId ][ Index ],
						options: Options,
						ref: StringHelper.format( '{}_{}', this.$data.currentFormId, Index )
					}
				} );
		},
		_buildStep: function ( createElement, Step, LabelGenerator )
		{
			let Title, Icon, Mutable;
			const BeforeChange = {};
			const Description = this.__addDescription( createElement, Step, LabelGenerator );
			const VueGenerator = this.__buildVueGenerator( createElement, Step, LabelGenerator );

			if ( 'label' in Step )
			{
				Mutable = this.__executeFunctionOrGetString( Step.label, Step[ '"name"' ] );
				Title = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable );
			}
			else
			{
				Title = this.__getStringLabelOrPlaceholder( LabelGenerator, Step.name );
			}

			if ( 'icon' in Step )
			{
				Icon = Step.icon;
			}
			else
			{
				Icon = '';
			}

			if ( 'beforeChange' in Step )
			{
				this.__assignOptionalFieldFunction( Step, BeforeChange, 'beforeChange' );
				return createElement( 'tab-content',
					{
						attr: {
							id: Step.name
						},
						props: {
							title: Title,
							icon: Icon,
							beforeChange: BeforeChange.beforeChange
						}
					},
					[ Description, VueGenerator ]
				);
			}
			else
			{
				return createElement( 'tab-content',
					{
						attr: {
							id: Step.name
						},
						props: {
							title: Title,
							icon: Icon
						}
					},
					[ Description, VueGenerator ]
				);
			}

		},
		buildBlubberForm: function (
			createElement,
			FormId,
			FormAttributes,
			FormProperties,
			Steps,
			LabelGenerator
		)
		{
			let StepIndex, LabelString, LabelIndex;
			const Tabs = [];
			// set formproperties and add labels
			const FormPropertiesLabels = [ 'subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];

			if ( 'string' !== typeof FormId || true === StringHelper.isEmpty( FormId ) )
			{
				throw new TypeErrorException(
					StringHelper.format(
						ErrorMessages.IVALID_TOP_ITEM,
						'FormId',
						typeof FormId,
						'non empty string'
					)
				);

			}

			if ( 'function' !== typeof LabelGenerator )
			{
				throw new TypeErrorException(
					StringHelper.format(
						ErrorMessages.IVALID_TOP_ITEM,
						'LabelGenerator',
						typeof LabelGenerator,
						'function'
					)
				);

			}

			if ( 'object' !== typeof FormAttributes )
			{
				FormAttributes = { id: FormId };
			}
			else
			{
				FormAttributes.id = FormId;
			}

			for ( LabelIndex in FormPropertiesLabels )
			{
				LabelString = this.__getStringLabelOrPlaceholder(
					LabelGenerator,
					FormProperties[ FormPropertiesLabels[ LabelIndex ] ],
					FormProperties );
				FormProperties[ FormPropertiesLabels[ LabelIndex ] ] = LabelString;
			}

			this.$data.blubberFormSchema[ FormId ] = [];
			this.$data.blubberModel[ FormId ] = {};
			this.$data.currentFormId = FormId;

			for ( StepIndex in Steps )
			{
				Tabs.push( this._buildStep( createElement, Steps[ StepIndex ], LabelGenerator ) );
			}

			return createElement( 'form-wizard', {
				attrs: FormAttributes,
				props: FormProperties
			}, Tabs );

		}
	},
	data: function ()
	{
		return { currentFormId: '', blubberModel: {}, blubberFormSchema: {} };
	}
};

export default BlubberFormFactory;
