import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Utils from '../Utils';

Vue.use( VueI18n );

const BlubberLanguage = {
	methods: {
		getClientLanguages: function ()
		{
			if ( 'undefined' !== typeof window.navigator.language )
			{
				this.$data.defaultClientLanguage = window.navigator.language.toLowerCase();
			}

			if ( 'undefined' !== typeof window.navigator.systemLanguage )
			{
				this.$data.defaultClientLanguage = window.navigator.systemLanguage.toLowerCase();
			}

			if ( 'undefined' !== typeof window.navigator.browserLanguage )
			{
				this.$data.defaultClientLanguage = window.navigator.browserLanguage.toLowerCase();
			}

			if ( 'undefined' !== typeof window.navigator.userLanguage )
			{
				this.$data.defaultClientLanguage = window.navigator.userLanguage.toLowerCase();
			}
		},
		getDefaultLanguage: function ()
		{
			this.getLanguage( 'en' );
		},
		getLanguage: function ( LanguageCode )
		{
			this.$data.i18n = null;
			if ( 'languages' in this.$data )
			{
				if ( LanguageCode in this.$data.currentLanguages )
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
		Return.currentLanguages = [];
		Return.fallbackLanguage = 'en';
		Return.i18n = null;
		return Return;
	}
};

export default BlubberLanguage;
