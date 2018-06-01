<script>
/* eslint-disable */
import Vue from 'vue'
import BlubberFormFactory from './components/BlubberFormFactory'
import Utils from './components/Utils.vue'
import Language from './components/Language'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

export default
{
    name: 'Blubber',
    render: function( createElement )
    {
        return this.buildApplication( createElement )
    },
    components: { BlubberFormFactory },
    template: '<div><BlubberFormFactory/></div>',
    //template: '<div></div>',
    data: function()
    {
        var Return = {}
        Return['buildForm'] = false
        Return['blubberGeneratorSteps'] = {}
        Return['blubberGeneratorFormProperties'] = {}
        Return['blubberGeneratorFormStyle'] = {}
        return Return
    },
    mounted: function()
    {
        this.getDefaultLanguage()
        this.getConfiguration()
    },
    methods:
    {
        getConfiguration: function ()
        {
            this.get( './data/config.json', this.evaluateConfiguration )
        },
        evaluateConfiguration: function (Configuration)
        {
            this.$data.blubberGeneratorSteps = Configuration.steps
            this.$data.blubberGeneratorFormProperties  = Configuration.form
            this.$data.blubberFormId = Configuration.name
            this.$data.buildForm = true
            this.updateTemplate()
        },
        updateTemplate: function ()
        {
            this.$forceUpdate()
        },
        getI18nStrings: function ( Key, LanguageCode )
        {
            return this.$data.i18n.tc(Key, LanguageCode)
        },
        buildApplication: function ( createElement )
        {
            if (false === this.$data.buildForm)
            {
                return createElement('div', { attrs:{ id:'application' } },  createElement(BlubberFormFactory, {}, '' ) )
            }
            else
            {
                var I18n = null
                if ( 'undefined' !== typeof this.$data.i18n )
                {
                    I18n = this.getI18nStrings
                }
                let Element = this.buildBlubberForm(
                    createElement,
                    this.$data.blubberFormId,
                    {},
                    Object.copy(this.$data.blubberGeneratorFormProperties),
                    Object.copy(this.$data.blubberGeneratorSteps),
                    I18n
                )
                return createElement('div', { attrs:{ id:'application' } }, [ Element, createElement(BlubberFormFactory, {}, '') ] )
            }
        },
        showPassword: function ()
        {
          
        }
    }
}
</script>

<style>

</style>
