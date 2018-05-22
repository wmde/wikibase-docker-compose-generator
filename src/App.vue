<script>
import Vue from 'vue'
import BlubberFormFactory from './components/BlubberFormFactory'
import Utils from './components/Utils'
import Language from './components/Language'

export default
{
    name: 'Blubber',
    component: {BlubberFormFactory},
    render: function(createElement)
    {
        return this.buildApplication(createElement)
    },
    template: '<div><BlubberFormFactory/></div>',
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
            this.get('./data/config.json', this.evaluateConfiguration)
        },
        evaluateConfiguration: function (Configuration)
        {
            this.$data.blubberGeneratorSteps = Configuration.steps
            this.$data.blubberGeneratorFormProperties  = Configuration.form
            this.$data.buildForm = true
            this.updateTemplate()
        },
        updateTemplate: function ()        
        {
            this.$forceUpdate()
        },
        getI18nStrings: function(Key, LanguageCode)
        {
            return this.$data.i18n.tc(Key, LanguageCode)
        },
        buildApplication: function(createElement)
        {
            if (false === this.$data.buildForm)     
            {
                return createElement('div', {attrs:{id:'application'}}, createElement(BlubberFormFactory, {}, ''))
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
                    {id:'blubberForm'},
                    this.$data.blubberGeneratorFormProperties,
                    this.$data.blubberGeneratorSteps,
                    I18n,
                    this.$data.currentLanguage
                )
                return createElement('div', {attrs:{id:'application'}}, [Element, createElement(BlubberFormFactory, {}, '')])
            }
        }
    }
}
</script>

<style>

</style>
