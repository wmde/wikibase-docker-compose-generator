<script>
import Vue from 'vue'
import BlubberFormFactory from './components/BlubberFormFactory'
import Utils from './components/Utils'
import Language from './components/Language'

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
<<<<<<< HEAD
            this.get( './data/config.json', this.evaluateConfiguration )
=======
            this.get('./data/config.json', this.evaluateConfiguration)
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
        },
        evaluateConfiguration: function (Configuration)
        {
            this.$data.blubberGeneratorSteps = Configuration.steps
            this.$data.blubberGeneratorFormProperties  = Configuration.form
<<<<<<< HEAD
            this.$data.blubberFormId = Configuration.name
=======
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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
<<<<<<< HEAD
                    this.$data.blubberFormId,
                    {},
=======
                    { id:'blubberForm' },
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                    Object.copy(this.$data.blubberGeneratorFormProperties),
                    Object.copy(this.$data.blubberGeneratorSteps),
                    I18n
                )
                return createElement('div', { attrs:{ id:'application' } }, [ Element, createElement(BlubberFormFactory, {}, '') ] )
            }
        }
    }
}
</script>

<style>

</style>
