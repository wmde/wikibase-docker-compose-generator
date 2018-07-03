<script>
import BlubberFormFactory from './components/BlubberFormFactory';
import Utils from './Utils';
import Language from './components/Language';
import ObjectHelper from './components/lib/ObjectHelper';
import AvailableLanguages from './components/data/lang/availableLanguages';

export default {
	name: 'Blubber',
	mixins: [ Language, BlubberFormFactory ],
	render: function ( createElement ) {
		return this.buildApplication( createElement );
	},
	template: '<div><BlubberFormFactory/></div>',
	data: function () {
		const Return = {};
		Return.buildForm = false;
		Return.blubberGeneratorSteps = [];
		Return.blubberGeneratorFormProperties = {};
		Return.blubberGeneratorFormStyle = {};
		return Return;
	},
	mounted: function () {
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
		getConfiguration: function () {
			Utils.get( './components/data/config.json', this.evaluateConfiguration );
		},
		evaluateConfiguration: function ( Configuration ) {
			this.$data.blubberGeneratorSteps = Configuration.steps;
			this.$data.blubberGeneratorFormProperties = Configuration.form;
			this.$data.blubberGeneratorFormProperties.id = Configuration.name;
			this.$data.buildForm = true;
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
					{
						formAttributes: ObjectHelper.copyObj( this.$data.blubberGeneratorFormProperties ),
						steps: ObjectHelper.copyObj( this.$data.blubberGeneratorSteps )
					},
					I18n
				);
				return createElement( 'div', { attrs: { id: 'application' } }, [ Element ] );
			}
		},
		showGi: function () {

		}
	}
};
</script>
