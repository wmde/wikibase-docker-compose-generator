import Vue from 'vue';
import VueI18n from 'vue-i18n';
import Utils from './Utils';

Vue.use( VueI18n );

const BlubberLanguage = {
	methods: {
		getDefaultLanguage: function () {
			this.getLanguage( 'en' );
		},
		getLanguage: function ( LanguageCode ) {
			this.$data.i18n = null;
			if ( 'languages' in this.$data ) {
				if ( LanguageCode in this.$data.currentLanguages ) {
					this.$data.i18n = new VueI18n(
						{
							locale: LanguageCode,
							fallbackLocale: this.$data.fallbackLanguage,
							messages: this.$data.languages
						} );
					return;
				} else {
					Utils.get( `./data/lang/${LanguageCode}.json`, this.__languageHook );
				}
			}
		},
		__languageHook: function ( Response ) {
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
		_languageIsLoaded: function () {
			return this.$data.i18n === null;
		}
	},
	data: function () {
		const Return = {};
		Return.languages = {};
		Return.currentLanguages = [];
		Return.fallbackLanguage = 'en';
		Return.i18n = null;
		return Return;
	}
};

export default BlubberLanguage;
