<script>
import Vue from 'vue'
import VueFormGenerator from "vue-form-generator";
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use(VueFormGenerator)
Vue.use(VueFormWizard)
class BaseException
{
    constructor( Name, Message )
    {
        this.Name = Name
        this.Message = Message
        console.trace()
    }
}

class InvalidStepException extends BaseException
{
    constructor( Message )
    {
        super("InvalidStepException", Message)
    }
}

class InvalidFieldException extends BaseException
{
    constructor( Message )
    {
        super("InvalidStepException", Message)
    }
}

class InvalidLabel extends BaseException
{
    constructor( Label )
    {
        super('InvalidLabel', 'Unknown string label: ' + Label)
    }
}

Vue.mixin({
    methods:
    {
        isFunctionOrString: function( Value, Descriptor )
        {
            if( 'function' === typeof Value)
            {
                return Value
            }
            else
            {
                if( 'string' === typeof Value )
                {
                    if( 'function' === typeof this[Value] )
                    {
                        return this[Value]
                    }
                    else
                    {
                        return Value
                    }
                }
            }

            throw new InvalidFieldException('Unsupported field value type ' + typeof Value + ' in field ' + Descriptor)
            return null
        },
        isFunctionOrNumber: function( Value, Descriptor )
        {
            if( 'function' === typeof Value)
            {
                return Value
            }
            else
            {
                if( 'string' === typeof Value )
                {
                    if ('function' === typeof this[Value])
                    {
                        return this[Value]
                    }
                }

                if ( 'number' === typeof Value )
                {
                    return Value
                }
            }

            throw new InvalidFieldException('Unsupported field value type ' + typeof Value + ' in field ' + Descriptor)
            return null
        },
        isFunctionOrBool: function( Value, Descriptor )
        {
            if( 'function' === typeof Value)
            {
                return Value
            }
            else
            {
                if( 'string' === typeof Value )
                {
                    if ('function' === typeof this[Value])
                    {
                        return this[Value]
                    }
                }

                if ( 'boolean' === typeof Value )
                {
                    return Value
                }
            }

            throw new InvalidFieldException('Unsupported field value type ' + typeof Value + ' in field ' + Descriptor)
            return null
        },
        getStringLabels: function(LabelGenerator, Key, Field)
        {
            var Label
            if( Key in Field && false === this.isEmpty(Field[Key]) && null !== LabelGenerator)
            {
                Label = LabelGenerator(Field[Key])
                if ( Label === Field[Key])
                {
                    throw new InvalidLabel(Field[Key])
                }

                return Label
            }
            else
            {
                return null
            }
        },
        getStringLabelOrEmpty: function(LabelGenerator, Key, Field)
        {
            var Label = this.getStringLabels(LabelGenerator, Key, Field)
            if ( null === Label )
            {
                Label = ''
            }
            return Label
        },
        evaluateField: function( Field )
        {

        },
        buildDynamicField: function( Field, LabelGenerator)
        {
            var Generated
            var Dynamic = this.isFunctionOrString(Field['bind'], Field['name'])
            if( 'function' !== typeof Dynamic)
            {
                throw new InvalidFieldException('Unexspected field binding method ' + typeof Value + ' in field ' + Field['name'])
                return null
            }

            Generated = Field['bind']()
            return this.buildFields(Generated, LabelGenerator)
        },
        buildGroup: function( Group, LabelGenerator )
        {

        },
        buildInputField: function( Type, Field, LabelGenerator )
        {
            function textBasedAttributes( Field, GeneratedField )
            {
                var Value

                if ( 'readonly' in Field )
                {
                    Value = this.isFunctionOrBool(Field['readonly'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['readonly'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['readonly'] = Value
                    }
                }

                if( 'autocomplete' in Field  && false === Field['autocomplete'] )
                {
                    GeneratedField['autocomplete'] = 'off'
                }
                else
                {
                    GeneratedField['autocomplete'] = 'on'
                }

                if( 'maximum' in Field  && false === Field['maximum'] )
                {
                    Value = this.isFunctionOrNumber(Field['maximum'], Field['name'])
                    if ('function' === typeof Value)
                    {
                        GeneratedField['maxlength'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['maxlength'] = Value
                    }
                }

                if ( 'pattern' in Field && 'string' === typeof Field['pattern'] )
                {
                    Value = this.isFunctionOrString(Field['pattern'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['pattern'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['pattern'] = Value
                    }
                }

                if ( 'briefDescription' in Field )
                {
                    try
                    {
                        GeneratedField['placeholder'] = this.getStringLabelOrEmpty(LabelGenerator, Field, 'briefDescription')
                    }
                    catch ( Exception )
                    {
                        GeneratedField['placeholder'] = Field['briefDescription']
                    }
                }

                if( 'size' in Field  && false === Field['size'] )
                {
                    Value = this.isFunctionOrNumber(Field['size'], Field['name'])
                    if ('function' === typeof Value)
                    {
                        GeneratedField['size'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['size'] = Value
                    }
                }

                return GeneratedField
            }

            function numericBasedAttributes( Field, GeneratedField )
            {
                var Value

                if( 'autocomplete' in Field && false === Field['autocomplete'] )
                {
                    GeneratedField['autocomplete'] = 'off'
                }
                else
                {
                    GeneratedField['autocomplete'] = 'on'
                }

                if ( 'getValuesFromList' in Field )
                {
                    Value = this.isFunctionOrString(Field['getValuesFromList'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['list'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['list'] = Value
                    }
                }

                if ( 'maximum' in Field )
                {
                    Value = this.isFunctionOrNumber(Field['maximum'], Field['name'])
                    if ( 'function' === typeof Value )
                    {
                        GeneratedField['max'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['max'] = Value
                    }
                }

                if ( 'minimum' in Field )
                {
                    Value = this.isFunctionOrNumber(Field['minimum'], Field['name'])
                    if ( 'function' === typeof Value )
                    {
                        GeneratedField['min'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['min'] = Value
                    }
                }

                if( true === ('stepSize' in Field ) )
                {
                    Value = this.isFunctionOrNumber(Field['stepSize'], Filed['id'])
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['step'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['step'] = Value
                    }
                }

                return GeneratedField
            }

            var GeneratedField, Value

            GeneratedField['type'] = 'input'
            GeneratedField['inputType'] = Type
            if ( 'text' === Type || 'search' === Type || 'url' === Type || 'tel' === Type || 'email' === Type )
            {
                GeneratedField = textBasedAttributes(Field, GeneratedField, Field['name'])

                if( 'dir' in Field && ( 'text' === Type || 'search' === Type ) )
                {
                    Value = this.isFunctionOrString(Field['dir'], Field['name'] )
                    if( true === ( 'function' === typeof Value ) )
                    {
                        GeneratedField['list'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['list'] = Value
                    }
                }

                if ( 'getValuesFromList' in Field )
                {
                    Value = this.isFunctionOrString(Field['getValuesFromList'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['list'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['list'] = Value
                    }
                }

                if ( 'email' === Type && 'multibleInput' in Field && 'boolean' === typeof Field['multibleInput'] )
                {
                    Value = this.isFunctionOrBool(Value, Field['name'])
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['multible'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['multible'] = Value
                    }
                }
            }
            else if( 'password' === Type )
            {
                GeneratedField = textBasedAttributes(Field, GeneratedField, Field['name'])
            }
            else if( 'file' === Type )
            {
                if( 'accept' in Field && 'accept' === typeof Field['accept'] )
                {
                    Value = this.isFunctionOrString(Field['accept'], Field['name'])
                    if ('function' === typeof Value)
                    {
                        GeneratedField['accept'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['accept'] = Value
                    }
                }

                if( 'multibleInput' in Field && 'boolean' === typeof Field['multibleInput'] )
                {
                    Value = this.isFunctionOrBool(Value, Field['name'])
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['multible'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['multible'] = Value
                    }
                }
            }
            else if(  'range' === Type
            ||
                      'month' === Type || 'time' === Type || 'week' === Type || 'date' === Type || 'datetime-local' === Type )
            {
                GeneratedField = numericBasedAttributes(Field, GeneratedField, Filed['id'])
                if ( 'readonly' in Field && 'range' !== Type )
                {
                    Value = this.isFunctionOrBool(Field['readonly'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['readonly'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['readonly'] = Value
                    }
                }
            }
            else if( 'number' === Type )
            {
                GeneratedField = numericBasedAttributes(Field, GeneratedField, Field['name'])
                if ( 'readonly' in Field )
                {
                    Value = this.isFunctionOrBool(Field['readonly'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['readonly'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['readonly'] = Value
                    }
                }
                if ( 'briefDescription' in Field )
                {
                    try
                    {
                        GeneratedField['placeholder'] = this.getStringLabelOrEmpty(LabelGenerator, Field, 'briefDescription')
                    }
                    catch ( Exception )
                    {
                        GeneratedField['placeholder'] = Field['briefDescription']
                    }
                }
            }
            else if( 'color' === Type )
            {
                if( 'autocomplete' in Field && false === Field['autocomplete'] )
                {
                    GeneratedField['autocomplete'] = 'off'
                }
                else
                {
                    GeneratedField['autocomplete'] = 'on'
                }

                if ( 'getValuesFromList' in Field )
                {
                    Value = this.isFunctionOrString(Field['getValuesFromList'], Field['name'] )
                    if( 'function' === typeof Value )
                    {
                        GeneratedField['list'] = Value(Object.copy(Field))
                    }
                    else
                    {
                        GeneratedField['list'] = Value
                    }
                }
            }
            else if( 'reset' === Type || 'hidden' === Type )
            {
                /* Do nothing cause there are no other additional attributes */
            }
            //Futher types could placed here
            else
            {
                throw new InvalidFieldException('Unknown fieldtype ' + Type + ' in field ' + Field['name'])
                return null
            }

            return GeneratedField
        },
        buildField: function(Field, LabelGenerator)
        {
            var GeneratedField, Mutable

            //common additional properties
            if ( 'additionalAttributes' in Field && 'object' === typeof Field )
            {
                //if we want to add a class attribute
                if ( 'class' in Field['additionalAttributes'] )
                {
                    Field['additionalAttributes']['styleClasses'] = Field['additionalAttributes']['class']
                }
                //just to make sure we do not open a backdoor to our field properties
                GeneratedField = Object.copy(Field['additionalAttributes'])
                delete Field['additionalAttributes']
                Field = Object.merge(GeneratedField, Field, false)
            }

            //specific  properties
            Field['type'] = Field['type'].toLowerCase()
            if (  'choise'  === Field['type'] )
            {
                GeneratedField['type'] = 'radios'
            }
            else if (  'select'  === Field['type'] )
            {
                GeneratedField['type'] = 'select'
            }
            else if ( 'pick'  === Field['type'] )
            {
                if( 'multible' in Field && true === Field['multible'] )
                {
                    GeneratedField['type'] = "checklist"
                    if( 'asList' in Field && true === Field['asList'] )
                    {
                        GeneratedField['listBox'] = true
                    }
                    else
                    {
                        GeneratedField['listBox'] = false
                    }
                }
                else
                {
                    GeneratedField['type'] = 'checkbox'
                    if( 'autocomplete' in Field && false === Field['autocomplete'] )
                    {
                        GeneratedField['autocomplete'] = 'off'
                    }
                    else
                    {
                        GeneratedField['autocomplete'] = 'on'
                    }
                }
            }
            else if ( 'textBlock'  === Field['type'] )
            {
                GeneratedField['type'] = 'textarea'
            }
            else if ( 'label'  === Field['type'] )
            {

            }
            else if ( 'submit'  === Field['type'] )
            {

            }
            //futher types should be placed here
            else
            {
                GeneratedField = this.buildInputField(Field['type'], Field, StringSelector, Language)
            }
            //common settings
            GeneratedField['name'] = Field['name']

            //common optional Settings
            if ( 'default' in Field )
            {
                GeneratedField['default'] = Field['default']
            }

            if( 'help' in Field )
            {
                GeneratedField['help'] = this.getStringLabelOrEmpty(LabelGenerator, 'help', Field)
            }

            if( 'hint' in Field )
            {
                GeneratedField['hint'] = this.getStringLabelOrEmpty(LabelGenerator, 'hint', Field)
            }

            Mutable = this.isFunctionOrString(Field['buttons'], Descriptor)
            if ( 'buttons' in Field && Field['buttons'] in this  && 'function' === typeof this.Field['buttons'] )
            {
                GenerateField['buttons'] = this[Field['buttons']]()
            }


            return GeneratedField
        },
        buildFields: function(Fields, LabelGenerator)
        {
            var GeneratedFields = []
            var Model = {}
            var Field

            for( Field in Fields )
            {
                if( 'bind' in Fields[Field] )
                {
                    GeneratedFields.push(this.buildDynamicField(Fields[Field], Model, LabelGenerator))
                    continue
                }

                if( 'group' === Fields[Field] )
                {
                    GeneratedFields.push(this.buildGroup(Fields[Field], LabelGenerator))
                    continue
                }

                GeneratedFields.push(this.buildField(Fields[Field], LabelGenerator))
            }

            return [Model, GeneratedFields]

        },
        buildBlubberForm: function(createElement, FormAttributes, FormProperties, Steps, LabelGenerator)
        {
            var Return, Step;
            //set formproperties and add label  strings
            var FormPropertiesLabels = ['subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];
            var LabelString, Label;
            for ( Label in FormPropertiesLabels )
            {
                LabelString = this.getStringLabels(LabelGenerator, FormPropertiesLabels[Label], FormProperties)
                if( null === LabelString )
                {
                    continue
                }
                FormProperties[FormPropertiesLabels[Label]] = LabelString
            }

            for ( Step in Steps )
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
