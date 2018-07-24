<script>
import BlubberFormFactory from './components/BlubberFormFactory';
import Utils from './Utils';
import Language from './components/Language';
import ObjectHelper from './components/lib/ObjectHelper';
import AvailableLanguages from './components/data/lang/availableLanguages';

export default {
	name: 'Blubber',
	mixins: [ Language, BlubberFormFactory ],
	render: function ( createElement )
	{
		return this.buildApplication( createElement );
	},
	template: '<div><BlubberFormFactory/></div>',
	data: function ()
	{
		const Return = {};
		Return.buildForm = false;
		Return.blubberGeneratedSteps = [];
		Return.blubberGeneratedFormProperties = {};
		Return.blubberGeneratedFormStyle = {};
		Return.forReadOnly = {};
		Return.blubberGeneratedYML = '';
		Return.blubberCurrentStep = 0;
		Return.blubberStepNames = [];
		return Return;
	},
	mounted: function ()
	{
		let Language;
		this.initLanguages();
		this.getClientLanguages();
		// eslint-disable-next-line
		Language = this.getDefaultLanguage( AvailableLanguages );
		this.getLanguage( Language );
		Utils.waitUntil( this._languageIsLoaded );
		this.getConfiguration();
	},
	methods: {
		getConfiguration: function ()
		{
			Utils.get( './components/data/config.json', this.evaluateConfiguration );
		},
		getStepNames: function ()
		{
			let Index;
			for ( Index in this.$data.blubberGeneratedSteps )
			{
				this.$data.blubberStepNames.push(
					this.$data.blubberGeneratedSteps[ Index ].name
				);
			}
		},
		evaluateConfiguration: function ( Configuration )
		{
			this.$data.blubberGeneratedSteps = Configuration.steps;
			this.$data.blubberGeneratedFormProperties = Configuration.form;
			this.$data.blubberGeneratedFormProperties.id = Configuration.name;
			this.$data.buildForm = true;
			this.$data.blubberDependencies = Configuration.dependencies;
			this.getStepNames();
			this.$forceUpdate();
		},
		getI18nStrings: function ( Key, LanguageCode )
		{
			return this.$data.i18n.tc( Key, LanguageCode );
		},
		buildApplication: function ( createElement )
		{
			if ( false === this.$data.buildForm )
			{
				return createElement( 'div', { attrs: { id: 'application' } }, createElement( BlubberFormFactory, {}, '' ) );
			}
			else
			{
				let I18n = null;

				if ( 'undefined' !== typeof this.$data.i18n )
				{
					I18n = this.getI18nStrings;
				}

				const Element = this.buildBlubberForm(
					createElement,
					{
						formAttributes: ObjectHelper.copyObj( this.$data.blubberGeneratedFormProperties ),
						formEvents: { Complete: 'done' },
						steps: ObjectHelper.copyObj( this.$data.blubberGeneratedSteps )
					},
					I18n
				);
				// eslint-disable-next-line
				return createElement( 'div', { attrs: { id: 'application' } }, [ Element ] );
			}
		},
        goOn()
        {
            /* Do nothing so far */
        },
        done()
        {
            /* Do nothing so far */
        }
	}
};
</script>
<style>
@import 'vue-form-wizard/dist/vue-form-wizard.min.css';
.vue-form-generator div div
{
    margin-top: 1em;
    margin-bottom: 1em;
}

h1,h2,h3,h4,h5,h6,p,ul, button
{
    font-family: 'Helvetica Neue','Helvetica','Nimbus Sans L','Arial','Liberation Sans', sans-serif !important;
    text-align: left;
}

h4.wizard-title
{
    font-weight: 600 !important;
    font-size: 1.2em;
    margin-left: 0;
    margin-bottom: 0;
}

p
{
    margin: 0px 0px 0px 0px;
    margin-bottom:1em;
    font-size: 1em;
    font-family: 'Helvetica Neue','Helvetica','Nimbus Sans L','Arial','Liberation Sans', sans-serif !important;
}

input:focus
{
    outline:none;
}

input
{
    border-radius: 2px;
    border-style:solid;
    border-width: 1px;
    border-color: #2e5b01;
    padding-left: 5px;
}
</style>
