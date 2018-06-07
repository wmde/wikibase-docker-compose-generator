<script>
import BlubberFormFactory from './components/BlubberFormFactory';
import './components/Utils.vue';
import './components/Language';

export default
{
	name: 'Blubber',
	render: function ( createElement ) {
		return this.buildApplication( createElement );
	},
	components: { BlubberFormFactory },
	template: '<div><BlubberFormFactory/></div>',
	// template: '<div></div>',
	data: function () {
		const Return = {};
		Return.buildForm = false;
		Return.blubberGeneratorSteps = {};
		Return.blubberGeneratorFormProperties = {};
		Return.blubberGeneratorFormStyle = {};
		return Return;
	},
	mounted: function () {
		this.getDefaultLanguage();
		this.getConfiguration();
	},
	methods:
	{
		getConfiguration: function () {
			this.get( './data/config.json', this.evaluateConfiguration );
		},
		evaluateConfiguration: function ( Configuration ) {
			this.$data.blubberGeneratorSteps = Configuration.steps;
			this.$data.blubberGeneratorFormProperties = Configuration.form;
			this.$data.blubberFormId = Configuration.name;
			this.$data.buildForm = true;
			this.updateTemplate();
		},
		updateTemplate: function () {
			this.$forceUpdate();
		},
		getI18nStrings: function ( Key, LanguageCode ) {
			return this.$data.i18n.tc( Key, LanguageCode );
		},
		buildApplication: function ( createElement ) {
			if ( this.$data.buildForm === false ) {
				return createElement( 'div', { attrs: { id: 'application' } }, createElement( BlubberFormFactory, {}, '' ) );
			} else {
				let I18n = null;
				if ( typeof this.$data.i18n !== 'undefined' ) {
					I18n = this.getI18nStrings;
				}
				const Element = this.buildBlubberForm(
					createElement,
					this.$data.blubberFormId,
					{},
					Object.copy( this.$data.blubberGeneratorFormProperties ),
					Object.copy( this.$data.blubberGeneratorSteps ),
					I18n
				);
				return createElement( 'div', { attrs: { id: 'application' } }, [ Element, createElement( BlubberFormFactory, {}, '' ) ] );
			}
		},
		showPassword: function () {

		}
	}
};
</script>

<style>
@import "vue-form-wizard/dist/vue-form-wizard.min.css";

</style>
