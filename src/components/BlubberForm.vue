<script>
import Vue from 'vue'

Object.size = function(Self)
{
  let Size = 0, Key;
  for (Key in Self)
  {
    if (Self.hasOwnProperty(Key))
    {
      Size++;
    }
  }
  return Size;
}

class InvalidStepException
{
  constructor(Message)
  {
    this.Name = "InvalidStepException"
    this.Message = Message
  }
}

class InvalidFieldException
{
  constructor(Message)
  {
    this.Name = "InvalidStepException"
    this.Message = Message
  }
}

Vue.mixin({
    render: function (createElement)
    {
      if ( false === ('steps' in this.$data) || 0 === Object.size(this.$data.steps))
      {
        return createElement('App', {}, '')
      }

      for ( Step in this.$data.steps)
      {
        /*if(false == ('fields' in this.$data.steps[Step]))
        {
          throw  new InvalidStepException('The structure of the given steps is invalid at step ' + Step + '. Fields is missing.')
        }
        Generator = createElement('vue-form-generator', {props:{
            'model':this.$data.model,
            'schema':Schema,
            'options':Options,
            'ref':this.$data.steps[Step]['id']}})

        StepStrings = getStringsOfStep(Step)
        Description = createElement('p', {domProps: { innerHTML: StepStrings[1]}}, '')


        Childes.push(createElement('tab-content', {props:{'title':StepStrings[0], 'icon':this.$data.steps[Step]['icon']}}, [Description, Generator]))
        */
      }


      /*let Form = createElement('form-wizard', {on:{complete:'onComplete()'}, props:{'subtitle':'','title':'test'}}, Childes)

      return createElement('App', {attr: {'id': 'blubberForm'}}, '')*/
      return createElement('App', {}, '')

    },
    mounted: function()
    {
      if( 0 === Object.size(this.$data.steps))
      {
        this.getConfiguration()
      }
    },
    methods:
    {
      getConfiguration: function()
      {
        this.get('./data/config.json', this.evaluateConfiguration)
      },
      evaluateConfiguration: function(Configuration)
      {
        this.$data.formProperties = Configuration.form
        this.$data.steps = Configuration.steps
        this.updateTemplate()
      },
      updateTemplate: function()
      {
        this.$forceUpdate()
      }
    },
    data: function()
    {
      let Return = {}
      Return['steps'] = {}
      Return['formProperties'] = {}
      Return['output'] = []
      return Return
    }
})

export default {
  name: 'BlubberFormBuilder'
}
</script>

<style scoped>

</style>
