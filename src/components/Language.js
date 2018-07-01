import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Utils from '../Utils';
import DefaultLanguage from './data/lang/en';

Vue.use( VueI18n );

const BlubberLanguage = {
	methods: {
		initLanguages()
		{
			this.$data.currentLanguages.push( 'en' );
			delete DefaultLanguage.key;
			this.$data.languages.en = DefaultLanguage;
		},
		getClientLanguages: function ()
		{
			let Index, Value, Index2;
			if ( 'undefined' !== typeof window.navigator.language )
			{
				this.$data.defaultLanguage = window.navigator.language.toLowerCase();
				this.$data.clientLanguages.push( this.$data.defaultLanguage );
			}
			if ( 'undefined' !== typeof window.navigator.languages )
			{
				for ( Index in window.navigator.languages )
				{
					Value = window.navigator.languages[ Index ].toLowerCase();
					Index2 = Utils.binaryInsertSearch( this.$data.clientLanguages, Value );
					if ( 0 > Index2 )
					{
						this.$data.clientLanguages.splice(
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
						Value
					);
				}
				this.$data.defaultLanguage = Value;
				this.$data.clientLanguages.push( this.$data.defaultLanguage );
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
						Value
					);
				}
				this.$data.defaultLanguage = Value;
				this.$data.clientLanguages.push( this.$data.defaultLanguage );
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
				this.$data.clientLanguages.push( this.$data.defaultLanguage );
			}
		},
		getDefaultLanguage: function ( SupportedLanguages )
		{
			let Index;
			if ( -1 === SupportedLanguages.indexOf( this.$data.defaultLanguage ) )
			{
				this.$data.clientLanguages.splice(
					this.$data.clientLanguages.indexOf( this.$data.defaultLanguage ),
					1
				);
				for ( Index in this.$data.clientLanguages )
				{
					if ( -1 < SupportedLanguages.indexOf( this.$data.clientLanguages[ Index ] ) )
					{
						return this.$data.clientLanguages[ Index ];
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
		},
		getLanguage: function ( LanguageCode )
		{
			this.$data.i18n = null;

			if ( -1 < this.$data.currentLanguages.indexOf( LanguageCode ) )
			{
				this.$data.i18n = new VueI18n(
					{
						locale: LanguageCode,
						fallbackLocale: this.$data.fallbackLanguage,
						messages: this.$data.languages
					} );
				return;
			}
			else
			{
				Utils.get( `./components/data/lang/${LanguageCode}.json`, this.__languageHook );
			}
		},
		__languageHook: function ( Response )
		{
			const Key = Response.key;
			delete Response.key;
			this.$data.languages[ Key ] = Response;
			this.$data.currentLanguages.push( Key );
			this.$data.i18n = new VueI18n(
				{
					locale: Key,
					fallbackLocale: this.$data.fallbackLanguage,
					messages: this.$data.languages
				} );
		},
		_languageIsLoaded: function ()
		{
			return null === this.$data.i18n;
		}
	},
	data: function ()
	{
		const Return = {};
		Return.languages = {};
		Return.clientLanguages = [];
		Return.defaultLanguage = '';
		Return.currentLanguages = [];
		Return.fallbackLanguage = 'en';
		Return.i18n = null;
		return Return;
	}
};

export default BlubberLanguage;
