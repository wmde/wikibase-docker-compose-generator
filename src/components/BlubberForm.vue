<script>
import Vue from 'vue'
import VueFormGenerator from "vue-form-generator";
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use(VueFormGenerator)
Vue.use(VueFormWizard)
class BaseException
{
  constructor(Name, Message)
  {
    this.Name = Name
    this.Message = Message
    console.trace()
  }
}

class InvalidStepException extends BaseException
{
  constructor(Message)
  {
    super("InvalidStepException", Message)
  }
}

class InvalidFieldException extends BaseException
{
  constructor(Message)
  {
    super("InvalidStepException", Message)
  }
}

Vue.mixin({
    methods:
    {
      buildBlubberForm: function(createElement, FormAttributes, FormProperties, Steps)
      {
        var Return, Step
        for (Step in Steps)
        {

        }
        Return = createElement('form-wizard', {
          attrs:FormAttributes,
          props:FormProperties
        }, '')
        return Return
      }
    }
})

export default {
  name: 'BlubberFormFactory'
}
</script>

<style scoped>

</style>
