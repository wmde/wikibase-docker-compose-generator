<script>
import BlubberFormFactory from './components/BlubberFormFactory';
import Utils from './Utils';
import Language from './components/Language';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';
import ObjectHelper from './components/lib/ObjectHelper';

export default {
	name: 'Blubber',
	mixins: [ BlubberFormFactory, Language ],
	render: function ( createElement )
	{
		return this.buildApplication( createElement );
	},
	template: '<div><BlubberFormFactory/></div>',
	data: function ()
	{
		const Return = {};
		Return.buildForm = false;
		Return.blubberGeneratorSteps = {};
		Return.blubberGeneratorFormProperties = {};
		Return.blubberGeneratorFormStyle = {};
		return Return;
	},
	mounted: function ()
	{
		this.getDefaultLanguage();
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
			this.$data.blubberGeneratorSteps = Configuration.steps;
			this.$data.blubberGeneratorFormProperties = Configuration.form;
			this.$data.blubberFormId = Configuration.name;
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
				const Element = this.buildBlubberForm(
					createElement,
					this.$data.blubberFormId,
					{},
					ObjectHelper.copyObj( this.$data.blubberGeneratorFormProperties ),
					ObjectHelper.copyObj( this.$data.blubberGeneratorSteps ),
					I18n
				);
				return createElement( 'div', { attrs: { id: 'application' } }, [ Element ] );
			}
		},
		showPassword: function ()
		{
            alert('gi')
		}
	}
};
</script>

<style>
@import "vue-form-wizard/dist/vue-form-wizard.min.css";

</style>
