<script>
import Vue from 'vue'
import VueFormGenerator from "vue-form-generator";
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use( VueFormGenerator )
Vue.use( VueFormWizard )
class BaseException
{
    constructor ( Name, Message )
    {
        this.Name = Name
        this.Message = Message
        console.trace()
    }
}

class InvalidStepException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidStepException', Message )
    }
}

class InvalidFieldException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidStepException', Message )
    }
}

class InvalidFieldValueException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidFieldValueException', Message )
    }
}

class InvalidLabelException extends BaseException
{
    constructor ( Label )
    {
        super( 'InvalidLabelException', 'Unknown label: ' + Label )
    }
}

Vue.mixin({
    methods:
    {
        __genericIsFuncionOrSomething: function ( Value, Type, Descriptor )
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

                if ( Type === typeof Value )
                {
                    return Value
                }
            }

            throw new InvalidFieldException( 'Unsupported field value type ' + typeof Value + ' in field ' + Descriptor  + '. Exspected ' + Type + ' or function.')
            return null
        },
        isFunctionOrString: function ( Value, Descriptor )
        {
            return this.__genericIsFuncionOrSomething( Value, 'string', Descriptor )
        },
        isFunctionOrNumber: function( Value, Descriptor )
        {
            return this.__genericIsFuncionOrSomething( Value, 'number', Descriptor )
        },
        isFunctionOrBool: function( Value, Descriptor )
        {
            return this.__genericIsFuncionOrSomething( Value, 'boolean', Descriptor )
        },
        isFunctionOrObject: function( Value, Descriptor )
        {
            return this.__genericIsFuncionOrSomething( Value, 'object', Descriptor )
        },
        isFunctionOrArray: function ( Value, Descriptor )
        {
            if( 'function' === typeof Value )
            {
                return Value
            }
            else
            {
                if ( 'string' === typeof Value )
                {
                    if( 'function' === typeof this[Value] )
                    {
                        return this[Value]
                    }
                }

                if ( true === Array.isArray( Value ) )
                {
                    return Value
                }
            }

            throw new InvalidFieldException( 'Unsupported field value type ' + typeof Value + ' in field ' + Descriptor + '. Exspected array or function.' )
            return null
        },
        assignValueOrFunction: function ( GeneratedField, Mutable, Key, Field )
        {
            if ( 'function' === typeof Mutable )
            {
                GeneratedField[Key] = Mutable( Object.copy( Field ) )
            }
            else
            {
                GeneratedField[Key] = Mutable
            }
        },
        getStringLabels: function ( LabelGenerator, Key, Field )
        {
            var Label
            if( Key in Field && false === this.isEmpty( Field[Key] ) && null !== LabelGenerator )
            {
                Label = LabelGenerator( Field[Key] )
                if ( Label === Field[Key] )
                {
                    throw new InvalidLabelException( Field[Key] )
                }

                return Label
            }
            else
            {
                return null
            }
        },
        getStringLabelOrEmpty: function ( LabelGenerator, Key, Field )
        {
            var Label = this.getStringLabels( LabelGenerator, Key, Field )
            if ( null === Label )
            {
                Label = ''
            }
            return Label
        },
        checkField: function ( Field )
        {

        },
        buildDynamicField: function ( Field, LabelGenerator )
        {
            var GeneratedFields
            var Dynamic = this.isFunctionOrString( Field['bind'], Field['name'] )
            if ( 'function' !== typeof Dynamic )
            {
                throw new InvalidFieldException( 'Unexspected field binding method ' + typeof Value + ' in field ' + Field['name'] )
                return null
            }

            GeneratedFields = Field['bind']()
            if ( true === Array.isArray( GeneratedFields ) )
            {
                return this.buildFields( GeneratedFields, LabelGenerator )
            }
            else
            {
                if ( 'group' in GeneratedFields )
                {
                    return this.buildGroup( GeneratedFields, LabelGenerator )
                }
                else
                {
                    return this.buildField( GeneratedFields, LabelGenerator )
                }
            }
        },
        buildGroup: function ( Group, LabelGenerator )
        {

        },
        buildInputField: function ( Type, Field, LabelGenerator )
        {
            function addTextBasedAttributes ( Field, GeneratedField )
            {
                var Mutable

                if ( 'readonly' in Field )
                {
                    Mutable = this.isFunctionOrBool( Field['readonly'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'readonly', Field )
                }

                if ( 'autocomplete' in Field  && false === Field['autocomplete'] )
                {
                    GeneratedField['autocomplete'] = 'off'
                }
                else
                {
                    GeneratedField['autocomplete'] = 'on'
                }

                if ( 'maximum' in Field  && false === Field['maximum'] )
                {
                    Mutable = this.isFunctionOrNumber( Field['maximum'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'maxlength', Field )
                }

                if ( 'pattern' in Field && 'string' === typeof Field['pattern'] )
                {
                    Mutable = this.isFunctionOrString( Field['pattern'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'pattern', Field )
                }

                if ( 'briefDescription' in Field )
                {
                    Mutable = Field['briefDescription']
                    try
                    {
                        GeneratedField['placeholder'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'briefDescription' )
                    }
                    catch ( Exception )
                    {
                        GeneratedField['placeholder'] = Mutable
                    }
                }

                if ( 'size' in Field  && false === Field['size'] )
                {
                    Mutable = this.isFunctionOrNumber( Field['size'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'size', Field )
                }

                return GeneratedField
            }

            function addNumericBasedAttributes ( Field, GeneratedField )
            {
                var Mutable

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
                    Mutable = this.isFunctionOrString( Field['getValuesFromList'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'list', Field )
                }

                if ( 'maximum' in Field )
                {
                    Mutable = this.isFunctionOrNumber( Field['maximum'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'max', Field )
                }

                if ( 'minimum' in Field )
                {
                    Mutable = this.isFunctionOrNumber( Field['minimum'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'min', Field )
                }

                if ( true === ('stepSize' in Field ) )
                {
                    Mutable = this.isFunctionOrNumber( Field['stepSize'], Field['id'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'stepSize', Field )
                }

                return GeneratedField
            }

            var GeneratedField, Mutable

            GeneratedField['type'] = 'input'
            GeneratedField['inputType'] = Type
            if ( 'text' === Type || 'search' === Type || 'url' === Type || 'tel' === Type || 'email' === Type )
            {
                GeneratedField = addTextBasedAttributes(Field, GeneratedField, Field['name'])

                if ( 'dir' in Field && ( 'text' === Type || 'search' === Type ) )
                {
                    Value = this.isFunctionOrString( Field['dir'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'dir', Field )
                }

                if ( 'getValuesFromList' in Field )
                {
                    Mutable = this.isFunctionOrString( Field['getValuesFromList'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'list' )
                }

                if ( 'email' === Type && 'multipleItems' in Field && 'boolean' === typeof Field['multibleItems'] )
                {
                    Mutable = this.isFunctionOrBool( Field['multipleItems'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'multiple', Field )
                }
            }
            else if ( 'password' === Type )
            {
                GeneratedField = addTextBasedAttributes( Field, GeneratedField, Field['name'] )
            }
            else if ( 'file' === Type )
            {
                if ( 'accept' in Field && 'accept' === typeof Field['accept'] )
                {
                    Mutable = this.isFunctionOrString( Field['accept'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'accept', Field )
                }

                if ( 'multipleInput' in Field && 'boolean' === typeof Field['multibleInput'] )
                {
                    Mutable = this.isFunctionOrBool( Field['multipleItems'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'multiple', Field )
                }
            }
            else if (
                'range' === Type
            ||
                'month' === Type || 'time' === Type || 'week' === Type || 'date' === Type || 'datetime-local' === Type
            )
            {
                GeneratedField = addNumericBasedAttributes(Field, GeneratedField, Filed['id'])
                if ( 'readonly' in Field && 'range' !== Type )
                {
                    Mutable = this.isFunctionOrBool(Field['readonly'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'readonly', Field )
                }
            }
            else if ( 'number' === Type )
            {
                GeneratedField = addNumericBasedAttributes( Field, GeneratedField, Field['name'] )
                if ( 'readonly' in Field )
                {
                    Mutable = this.isFunctionOrBool( Field['readonly'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'readonly', Field )
                }
                if ( 'briefDescription' in Field )
                {
                    Mutable = Field['briefDescription']
                    try
                    {
                        GeneratedField['placeholder'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'briefDescription' )
                    }
                    catch ( Exception )
                    {
                        GeneratedField['placeholder'] = Mutable
                    }
                }
            }
            else if ( 'color' === Type )
            {
                if ( 'autocomplete' in Field && false === Field['autocomplete'] )
                {
                    GeneratedField['autocomplete'] = 'off'
                }
                else
                {
                    GeneratedField['autocomplete'] = 'on'
                }

                if ( 'getValuesFromList' in Field )
                {
                    Mutable = this.isFunctionOrString( Field['getValuesFromList'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'list', Field )
                }
            }
            else if( 'reset' === Type || 'hidden' === Type )
            {
                /* Do nothing cause there are no other additional attributes */
            }
            //Futher types could placed here
            else
            {
                throw new InvalidFieldException ( 'Unknown fieldtype ' + Type + ' in field ' + Field['name'] )
                return null
            }

            return GeneratedField
        },
        buildField: function ( Field, LabelGenerator )
        {
            var GeneratedField, Mutable
            function addValuesProperty ( Field, LabelKey, LabelGenerator )
            {
                var Mutable, Mutable2, GeneratedValues, ValueIndex
                if ( 'values' in Field )
                {
                    Mutable = this.isFunctionOrArray( Field['values'], Field['name'] )
                }
                else
                {
                    throw new InvalidFieldException('The given field ' + Field['name'] + ' has no values property.')
                    return null
                }

                if ( false === Array.isArray( Mutable ) )
                {
                    return Mutable
                }

                GeneratedValues = []
                for ( ValueIndex in Mutable )
                {
                    if ( 'string' === typeof Mutable[ValueIndex] )
                    {
                        GeneratedValues.push( Mutable[ValueIndex] )
                    }
                    else if ( 'object' === typeof Mutable[ValueIndex] )
                    {
                        if ( LabelKey in Mutable[ValueIndex] )
                        {
                            Mutable2 = Mutable[ValueIndex][LabelKey]
                            try
                            {
                                Mutable[ValueIndex][LabelKey] = this.getStringLabelOrEmpty( LabelGenerator, Mutable[ValueIndex], LabelKey )
                            }
                            catch ( Exception )
                            {
                                Mutable[ValueIndex][LabelKey] = Mutable2
                            }

                            GeneratedValues.push( Mutable[ValueIndex] )
                        }
                        else
                        {
                            throw new InvalidFieldValueException( 'The a given value of field ' + Field['name'] + ' contains no label.' )
                            return null
                        }
                    }
                    else
                    {
                        throw new InvalidFieldValueException( 'The given values of field ' + Field['name'] + ' contains a ' + typeof Mutable[Value] + ' but only objects or strings are allowed.' )
                        return null
                    }
                }

                return GeneratedValues
            }

            function addOptionProperty( Field )
            {
                var GeneratedProperty = {}
                if ( 'options' in Field )
                {
                    Mutable = this.isFunctionOrObject( Field['options'], Field['name'] )
                    if ( 'function' === typeof Mutable )
                    {
                        GeneratedProperty = Mutable( Object.copy( Field ) )
                    }
                    else
                    {
                        GeneratedProperty = Mutable
                    }
                }

                if ( false === ( 'value' in GeneratedProperty ) )
                {
                    GeneratedProperty['value'] = 'value'
                }

                if ( false === ( 'name' in GeneratedProperty ) )
                {
                    GeneratedProperty['name'] = 'label'
                }

                return GeneratedProperty
            }

           if ( 'class' in Field )
           {
              Field['styleClasses'] = Field['class']
              delete Field['class']
           }

            //specific  properties
            Field['type'] = Field['type'].toLowerCase()
            if (  'choise'  === Field['type'] )
            {
                GeneratedField['type'] = 'radios'
                GeneratedField['radiosOptions'] = addOptionProperty( Field )
                GeneratedField['values'] = addValueProperty( Field, GeneratedField['radiosOptions']['name'], LabelGenerator )
            }
            else if (  'select'  === Field['type'] )
            {
                GeneratedField['type'] = 'select'

                GeneratedField['selectOptions'] = addOptionProperty( Field )

                if ( 'noneSelectedText' in GeneratedField['selectOptions'] )
                {
                    Mutable = GeneratedField['selectOptions']['noneSelectedText']
                    try
                    {
                        GeneratedField['selectOptions']['noneSelectedText'] = this.getStringLabelOrEmpty( LabelGenerator, GeneratedField['selectOptions'], 'noneSelectedText' )
                    }
                    catch ( Exception )
                    {
                        GeneratedField['selectOptions']['noneSelectedText'] = Mutable
                    }
                }
                else
                {
                    GeneratedField['hideNoneSelectedText'] = true
                }

                GeneratedField['values'] = addValueProperty( Field, GeneratedField['selectOptions']['name'], LabelGenerator )
            }
            else if ( 'pick'  === Field['type'] )
            {
                if( 'multipleItems' in Field && true === Field['multibleItems'] )
                {
                    GeneratedField['type'] = "checklist"
                    if ( 'asList' in Field && true === Field['asList'] )
                    {
                        Mutable = this.isFunctionOrBool( Field['asList'], Field['name'] )
                        this.assignValueOrFunction( GeneratedField, Mutable, 'listBox', Field )
                    }
                    else
                    {
                        GeneratedField['listBox'] = false
                    }

                    GeneratedField['checklistOptions'] = addOptionProperty( Field )
                    GeneratedField['values'] = addValueProperty( Field, GeneratedField['checklistOptions']['name'], LabelGenerator )
                }
                else
                {
                    GeneratedField['type'] = 'checkbox'
                    if ( 'autocomplete' in Field && false === Field['autocomplete'] )
                    {
                        GeneratedField['autocomplete'] = 'off'
                    }
                    else
                    {
                        GeneratedField['autocomplete'] = 'on'
                    }
                }
            }
            else if ( 'textBlock' === Field['type'] )
            {
                GeneratedField['type'] = 'textarea'
                if ( 'autocomplete' in Field && false === Field['autocomplete'] )
                {
                    GeneratedField['autocomplete'] = 'off'
                }
                else
                {
                    GeneratedField['autocomplete'] = 'on'
                }

                if ( 'readonly' in Field )
                {
                    Mutable = this.isFunctionOrBool( Field['readonly'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'readonly', Field )
                }
                if ( 'briefDescription' in Field )
                {
                    Mutable = Field['briefDescription']
                    try
                    {
                        GeneratedField['placeholder'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'briefDescription' )
                    }
                    catch ( Exception )
                    {
                        GeneratedField['placeholder'] = Mutable
                    }
                }

                if ( 'maximum' in Field )
                {
                    Mutable = this.isFunctionOrNumber( Field['maximum'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'max', Field )
                }

                if ( 'minimum' in Field )
                {
                    Mutable = this.isFunctionOrNumber( Field['minimum'], Field['name'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'min', Field )
                }

                if ( true === ('rows' in Field ) )
                {
                    Mutable = this.isFunctionOrNumber( Field['stepSize'], Field['id'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'stepSize', Field )
                }
            }
            else if ( 'label' === Field['type'] )
            {
                /* Do nothing cause there no special attributes */
            }
            else if ( 'submit'  === Field['type'] )
            {
                GeneratedField['id'] = Field['name']
                if ( 'onSubmit' in Field )
                {
                    Mutable = this.isFunctionOrString( Field['onSubmit'], Field['name'] )
                    if ( 'function' !== typeof Mutable )
                    {
                        throw new InvalidFieldException( 'The given submit function of ' + Field['name'] + ' is not a function.' )
                        return null
                    }
                    else
                    {
                        GeneratedField['onSubmit'] = Mutable
                    }
                }

                if ( 'validateBeforeSubmit' in Field )
                {
                    Mutable = this.isFunctionOrBool( Field['validateBeforeSubmit'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'validateBeforeSubmit', Field )
                }

                if ( 'label' in Field )
                {
                    Field['label'] = this.isFunctionOrString( Field['label'] )
                    try
                    {
                        GeneratedField['buttonText'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'label' )
                    }
                    catch ( Exception )
                    {
                        GeneratedField['buttonText'] = Field['label']
                    }
                }
                else
                {
                    try
                    {
                        GeneratedField['buttonText'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'name' )
                    }
                    catch ( Exception )
                    {
                        GeneratedField['buttonText'] = Field['name']
                    }
                }

                if ( 'isVisible' in Field )
                {
                    Mutable = this.isFunctionOrBool( Field['isVisible'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'visible', Field)
                }

                if ( 'isDisabled' in Field )
                {
                    Mutable = this.isFunctionOrBool( Field['isDisabled'] )
                    this.assignValueOrFunction( GeneratedField, Mutable, 'disabled', Field)
                }

                return GeneratedField
            }
            //futher types should be placed here
            else
            {
                GeneratedField = this.buildInputField( Field['type'], Field, StringSelector, Language )
            }
            //common settings
            GeneratedField['id'] = Field['name']

            //common optional Settings
            if ( 'default' in Field )
            {
                GeneratedField['default'] = Field['default']
            }

            if ( 'help' in Field )
            {
                GeneratedField['help'] = this.getStringLabelOrEmpty( LabelGenerator, 'help', Field )
            }

            if ( 'hint' in Field )
            {
                GeneratedField['hint'] = this.getStringLabelOrEmpty( LabelGenerator, 'hint', Field )
            }

            if ( 'formatter' in Field )
            {
                Mutable = this.isFunctionOrString( Field['formatter'], Field['name'] )
                if ( 'function' !== typeof Mutable )
                {
                    throw new InvalidFieldException( 'The given formatter of ' + Field['name'] + ' must be a function.' )
                    return null
                }
                else
                {
                    GeneratedField['get'] = Mutable
                }
            }

            Mutable = this.isFunctionOrString(Field['buttons'], Descriptor)
            if ( 'buttons' in Field && Field['buttons'] in this  && 'function' === typeof this.Field['buttons'] )
            {
                GeneratedField['buttons'] = this[Field['buttons']]()
            }

            return GeneratedField
        },
        buildFields: function ( Fields, LabelGenerator )
        {
            var GeneratedFields = []
            var Model = {}
            var FieldIndex

            for ( FieldIndex in Fields )
            {
                if ( 'bind' in Fields[Field] )
                {
                    GeneratedFields.push( this.buildDynamicField( Fields[FieldIndex], Model, LabelGenerator ) )
                    continue
                }

                if ( 'group' === Fields[FieldIndex] )
                {
                    GeneratedFields.push( this.buildGroup( Fields[FieldIndex], LabelGenerator ) )
                    continue
                }

                GeneratedFields.push( this.buildField( Fields[FieldIndex], LabelGenerator ) )
            }

            return [ Model, GeneratedFields ]

        },
        buildBlubberForm: function ( createElement, FormAttributes, FormProperties, Steps, LabelGenerator )
        {
            var Return, StepIndex;
            //set formproperties and add label  strings
            var FormPropertiesLabels = ['subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];
            var LabelString, LabelIndex;
            for ( LabelIndex in FormPropertiesLabels )
            {
                LabelString = this.getStringLabels( LabelGenerator, FormPropertiesLabels[LabelIndex], FormProperties )
                if ( null === LabelString )
                {
                    continue
                }
                FormProperties[FormPropertiesLabels[LabelIndex]] = LabelString
            }

            for ( StepIndex in Steps )
            {

            }
            Return = createElement( 'form-wizard', {
                attrs:FormAttributes,
                props:FormProperties
            }, '' )
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
