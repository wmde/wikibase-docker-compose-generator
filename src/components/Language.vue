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
        getLanguage: function (LanguageCode)
        {
            if (false === ('language' in this.$data) || false === (LanguageCode in this.$data.language))
            {
                this.get(`./data/lang/${LanguageCode}.json`, this.languageHook)
            }
        },
        languageHook: function(Response)
        {
            var Key = Response.key
            delete Response.key
            this.$data.languages[Key] = Response
            this.$data.currentLanguage = Key
            var Languages = this.$data.languages
            this.$data.i18n = new VueI18n({locale: Key, messages: Languages})
        }
    },
    data: function()
    {
        var Return = {}
        Return['languages'] = {}
        Return['currentLanguage'] = ''
        Return['i18n'] = null
        return Return
    }
})

export default 
{
    name: 'BlubberLanguage'
}
</script>

<style scoped>

</style>
