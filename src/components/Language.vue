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
        }
    },
    data: function()
    {
        var Return = {}
        Return['languages'] = {}
        Return['currentLanguages'] = []
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
