
<script>
import Vue from 'vue'
import Factory from './components/BlubberForm'
import Utils from './components/Utils'
import Language from './components/Language'

export default
{
  name: 'Blubber',
  render: function(createElement)
  {
    return this.buildApplication(createElement)
  },
  template: '<div></div>',
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
    buildApplication: function(createElement)
    {
      if (false === this.$data.buildForm)
      {
        return createElement('div', {}, '')
      }
      else
      {
          let Elements = [createElement('div', {}, ''),
            this.buildBlubberForm(createElement,
              {id:'blubberForm'},
              this.$data.blubberGeneratorFormProperties,
              this.$data.blubberGeneratorSteps)]
          return createElement('div', {attrs:{id:'application'}}, Elements)
      }
    }
  }
}
</script>

<style>

</style>
