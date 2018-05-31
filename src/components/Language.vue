<script>
import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

Vue.mixin({
    methods:
    {
        getDefaultLanguage: function ()
        {
            this.getLanguage('en')
        },
        getLanguage: function ( LanguageCode )
        {
<<<<<<< HEAD
            if ( 'languages' in this.$data )
            {
                if ( LanguageCode in this.$data.currentLanguages )
                {
                    this.$data.i18n = new VueI18n(
                        {
                            locale: LanguageCode,
                            fallbackLocale: this.$data.fallbackLanguage,
                            messages: this.$data.languages
                        })
                    return
                }
                else
                {
                    this.get( `./data/lang/${LanguageCode}.json`, this.__languageHook )
                }
            }
        },
        __languageHook: function( Response )
        {
            let Key = Response.key
            delete Response.key
            this.$data.languages[Key] = Response
            this.$data.currentLanguages.push( Key )
            this.$data.i18n = new VueI18n(
                {
                    locale: Key,
                    fallbackLocale: this.$data.fallbackLanguage,
                    messages: this.$data.languages
                })
=======
            if ( 'languages' in this.$data || LanguageCode in this.$data.languages )
            {
                this.get(`./data/lang/${LanguageCode}.json`, this.languageHook)
            }
        },
        languageHook: function( Response )
        {
            var Key = Response.key
            delete Response.key
            this.$data.languages[Key] = Response
            this.$data.currentLanguage = Key
            var Languages = this.$data.languages
            this.$data.i18n = new VueI18n({ locale: Key, fallbackLocale: this.$data.fallbackLanguage, messages: Languages })
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
        }
    },
    data: function()
    {
        var Return = {}
        Return['languages'] = {}
<<<<<<< HEAD
        Return['currentLanguages'] = []
=======
        Return['currentLanguage'] = ''
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
        Return['fallbackLanguage'] = 'en'
        Return['i18n'] = null
        return Return
    }
})

export default
{
    name: 'BlubberLanguage'
}
</script>
