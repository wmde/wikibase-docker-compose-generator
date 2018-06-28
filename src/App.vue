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
		/* getClientLanguages: function ()
		{
			let Index, Value, Index2;

			if ( 'undefined' !== typeof window.navigator.language )
			{
				this.$data.defaultLanguage = window.navigator.language.toLowerCase();
				this.$data.languages.push( this.$data.defaultLanguage );
			}

			if ( 'undefined' !== typeof window.navigator.languages )
			{
				for ( Index in window.navigator.languages )
				{

					Value = window.navigator.languages[ Index ].toLowerCase();

					Index2 = Utils.binaryInsertSearch( this.$data.languages, Value );
					if ( 0 > Index2 )
					{
						this.$data.languages.splice(
							-( Index2 + 1 ),
							0,
							Value
						);
					}
				}
			}

			if ( 'undefined' !== typeof window.navigator.systemLanguage )
			{

				Value = window.navigator.systemLanguage.toLowerCase();

				Index2 = Utils.binaryInsertSearch( this.$data.languages, Value );
				if ( 0 > Index2 )
				{
					this.$data.languages.splice(
						-( Index2 + 1 ),
						0,
						Value// any formatter could putted here
					);
				}
				this.$data.defaultLanguage = Value;
			}

			if ( 'undefined' !== typeof window.navigator.browserLanguage )
			{

				Value = window.navigator.browserLanguage.toLowerCase();

				Index2 = Utils.binaryInsertSearch( this.$data.languages, Value );
				if ( 0 > Index2 )
				{
					this.$data.languages.splice(
						-( Index2 + 1 ),
						0,
						Value// any formatter could putted here
					);
				}
				this.$data.defaultLanguage = Value;
			}

			if ( 'undefined' !== typeof window.navigator.userLanguage )
			{

				Value = window.navigator.userLanguage.toLowerCase();

				Index2 = Utils.binaryInsertSearch( this.$data.languages, Value );
				if ( 0 > Index2 )
				{
					this.$data.languages.splice(
						-( Index2 + 1 ),
						0,
						Value// any formatter could putted here
					);
				}
				this.$data.defaultLanguage = Value;
			}
		},
		getCurrentLanguage: function ( SupportedLanguages )
		{
			let Index;

			if ( -1 === SupportedLanguages.indexOf( this.$data.defaultLanguage ) )
			{
				this.$data.languages.splice( this.$data.languages.indexOf( this.$data.defaultLanguage ), 1 );
				for ( Index in this.$data.languages )
				{
					if ( -1 < SupportedLanguages.indexOf( this.$data.languages[ Index ] ) )
					{
						return this.$data.languages[ Index ];
					}
				}

				if ( -1 < SupportedLanguages.indexOf( 'en' ) )
				{
					this.$data.defaultLanguage = 'en';
				}
				else
				{
					this.$data.defaultLanguage = SupportedLanguages[ 0 ];
				}
			}

			return this.$data.defaultLanguage;
		},*/
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
		showGi: function ()
		{

		}
	}
};
</script>

<style>
@import "vue-form-wizard/dist/vue-form-wizard.min.css";

</style>
