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
        buildDynamicFields: function(createElement, Field)
        {

        },
        buildGroup: function(createElement, Group)
        {

        },
        buildFields: function(createElement, Fields)
        {
            var GeneratedFields = []
            var GeneratedField

            for( Field in Fields)
            {
                GeneratedField = {}
                if('bind' in Fields[Field])
                {    
                    continue
                }
                
                if('group' === Fields[Field])
                {
                    GeneratedFields.push(this.buildGroup(createElement, Fields[Field]))
                    continue
                }
                
                
                switch (Field[Field]['type'])
                {

                    case 'text':
                    {           
                        GeneratedField['type'] = 'input'
                        if (true === 'default' in Fields[Field] )
                        {
                            GeneratedField['placeholder'] = Fields[Field]['default']
                        }

                        break;
                    }
                    case 'choise':
                    {    
                        GeneratedField['type'] = 'radios'
                        break;
                    }
                    case 'select':
                    {    
                        GeneratedField['type'] = 'select'
                        break;    
                    }
                    case 'pick':
                    {
                        GeneratedField['type'] = 'checkbox'
                        break;
                    }
                    case 'pick-list':
                    {
                        GeneratedField['type'] = 'checklist'
                        break;
                    }
                    //futher types should be placed here
                    default:
                    {
                        throw new InvalidFieldException('Unknown fieldtype ' + Field[Field]['type'])
                        break
                    }                        
                }

                GeneratedField['id'] = Fields['name']

                //optional Settings
                if (true === 'default' in Fields[Field] )
                {
                    GeneratedField['default'] = Fields[Field]['default']
                }
            }
        },
        getStringLabels: function(StringSelector, Language, Key, Field)        
        {
            if(true === ( Key in Field ) && false === this.isEmpty(Field[Key]) && null !== StringSelector)
            {
                return StringSelector(Field[Key], Language)
            }
            else
            {
                return null
            }            
        },
        buildBlubberForm: function(createElement, FormAttributes, FormProperties, Steps, StringSelector, Language)
        {
            var Return, Step;
            //set formproperties and add label  strings
            var FormPropertiesLabels = ['subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];
            var LabelString, Label;
            for ( Label in FormPropertiesLabels )
            {
                LabelString = this.getStringLabels(StringSelector, Language, FormPropertiesLabels[Label], FormProperties)
                if(null === LabelString)
                {
                    continue
                }
                FormProperties[FormPropertiesLabels[Label]] = LabelString
            }

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

export default
{
    name: 'BlubberFormFactory',
    template: '<div></div>'
}
</script>

<style>

</style>
