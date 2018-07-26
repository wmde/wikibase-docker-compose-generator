<script>
import BlubberFormFactory from './components/BlubberFormFactory';
import Utils from './Utils';
import Language from './components/Language';
import ObjectHelper from './components/lib/ObjectHelper';
import AvailableLanguages from './components/data/lang/availableLanguages';
import Validators from './components/lib/Validators';
import { UPDATE_KEEP_MODEL_DATA } from './components/lib/blubberFormGenerator/RenderConstants';

class StaticReference
{
    static References = {};
}

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
		Return.blubberGeneratedYML = '';
		Return.blubberCurrentStep = 0;
		Return.blubberFirstLoad = true;
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
		evaluateConfiguration: function ( Configuration )
		{
			this.$data.blubberGeneratedSteps = Configuration.steps;
			this.$data.blubberGeneratedFormProperties = Configuration.form;
			this.$data.blubberGeneratedFormProperties.id = Configuration.name;
			this.$data.buildForm = true;
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

				StaticReference.References.vue = this;
				StaticReference.References.validator = Validators;
				this.setDefaultModelRenderBehaviour( false );

				const Element = this.buildBlubberForm(
					createElement,
					StaticReference.References,
					{
						formAttributes: ObjectHelper.copyObj( this.$data.blubberGeneratedFormProperties ),
						formEvents: { Complete: 'done' },
						steps: ObjectHelper.copyObj( this.$data.blubberGeneratedSteps )
					},
					I18n,
					UPDATE_KEEP_MODEL_DATA
				);
				// eslint-disable-next-line
				return createElement( 'div', { attrs: { id: 'application' } }, [ Element ] );
			}
		},
		refresh: function ()
		{
			this.$forceUpdate();
		},
		changeStep: function ( prevIndex, nextIndex )
		{
			if ( 2 === nextIndex )
			{
				Validators.clearPorts();
			}
		},
		hasComponents: function ()
		{
			if ( 0 === ObjectHelper.objectSize( this.$data.blubberModel ) )
			{
				return true;
			}
			else
			{
				if (
					false === this.$data.blubberModel.BlubberForm.wdqsStep &&
                    false === this.$data.blubberModel.BlubberForm.quickstatementsStep
				)
				{
					return false;
				}
				else
				{
					return true;
				}
			}
		},
		hasWDQS: function ()
		{
			if ( 0 === ObjectHelper.objectSize( this.$data.blubberModel ) )
			{
				return true;
			}
			else
			{
				return this.$data.blubberModel.BlubberForm.wdqsStep;
			}
		},
		hasQuickstatements: function ()
		{
			if ( 0 === ObjectHelper.objectSize( this.$data.blubberModel ) )
			{
				return true;
			}
			else
			{
				return this.$data.blubberModel.BlubberForm.quickstatementsStep;
			}
		},
		validateStep2: function ()
		{
			this.$forceUpdate();
            Validators.clearPorts();
            console.log(Validators.__UsedPorts)
            console.log(this.$refs.componentsConfiguration.validate())
			return this.$refs.componentsConfiguration.validate();
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

.help span
{
    visibility: hidden;
    width: 50%;
    background-color: #555;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    margin-top: -0.1em;
    position: absolute;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left:10px;
    padding-right:10px;
}

.help span a
{
    color: #4683ff;
}

.help *
{
    display: inline-block;
}
.help:after
{
    content: "?";
    color:white;
    border: 1px solid black;
    border-radius: 15px;
    background-color: #3366cc;
    margin-left: 0.5em;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left:8px;
    padding-right:8px;
    font-size: 0.9em;
    display: inline-block!important;
}

.help:hover span
{
    visibility: visible;
    opacity: 1;
}

.help:hover:after
{
    display: none;

}

#components .form-group
{
    margin-top: 1.5em;
}

#components .form-group:nth-child(1)
{
    margin-top: 0em;
}

#components label
{
    display: inline-block;
}

#components .field-wrap
{
    margin: 0px 0px 0px 0px;
    margin-left: 1em;
}

#components input
{
    height: 1.2em;
}

#components .radio-list *
{
    display: inline-block;
}

#components .radio-list input
{
    float: left;
}
</style>
