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
        __genericIsFuncionOrSomething: function ( Value, Type, FieldName, ReturnPureFunction = false )
        {
            var Chunks, Self, Index
            if ( 'function' === typeof Value)
            {
                return Value
            }
            else
            {
                if ( 'string' === typeof Value )
                {
                    Self = this
                    if ( true === Value.hasSubstring( '.' ) )
                    {
                        Chunks = Value.split( '.' )
                        for ( Index in Chunks )
                        {
                            if ( Chunks[Index] in Self )
                            {
                                Self = Self[Chunks[Index]]
                            }
                            else
                            {
                                throw new InvalidFieldException( 'Unknown method ' + Value + ' in field ' + FieldName  + '.')
                                return null
                            }                                
                        }

                        if ( 'function' !== typeof Self )
                        {
                            throw new InvalidFieldException( 'Unsupported field value type ' + typeof Value + ' in field ' + FieldName  + '. Expected ' + Type + ' or function.')
                            return null
                        }
                    }
                    else if ( Value in Self && 'function' === typeof Self[Value] )
                    {
                        Self = this[Value]
                    }

                    if ( true === ReturnPureFunction )
                    {
                        return Self
                    }

                    Value = Self(FieldName)
                }               

                if ( Type === typeof Value || 'any' === Type )
                {
                    return Value
                }
            }

            throw new InvalidFieldException( 'Unsupported field value type ' + typeof Value + ' in field ' + FieldName  + '. Expected ' + Type + ' or function.')
            return null
        },
        executeFunctionOrGetString: function ( Value, FieldName, ReturnPureFunction = false )
        {
            return this.__genericIsFuncionOrSomething( Value, 'string', FieldName, ReturnPureFunction )
        },
        executeFunctionOrGetNumber: function( Value, FieldName, ReturnPureFunction = false )
        {
            return this.__genericIsFuncionOrSomething( Value, 'number', FieldName, ReturnPureFunction )
        },
        executeFunctionOrGetBool: function( Value, FieldName, ReturnPureFunction = false )
        {
            return this.__genericIsFuncionOrSomething( Value, 'boolean', FieldName, ReturnPureFunction )
        },
        executeFunctionOrGetObject: function( Value, FieldName, ReturnPureFunction = false )
        {
            return this.__genericIsFuncionOrSomething( Value, 'object', FieldName, ReturnPureFunction )
        },
        executeFunctionOrGetArray: function ( Value, FieldName, ReturnPureFunction = false )
        {
            var Chunks, Self, Index
            if ( 'function' === typeof Value)
            {
                return Value
            }
            else
            {
                if ( 'string' === typeof Value )
                {
                    Self = this
                    if ( true === Value.hasSubstring( '.' ) )
                    {
                        Chunks = Value.split( '.' )
                        for ( Index in Chunks )
                        {
                            if ( Chunks in Self )
                            {
                                Self = Self[Chunks]
                            }
                            else
                            {
                                throw new InvalidFieldException( 'Unknown method ' + Value + ' in field ' + FieldName  + '.')
                                return null
                            }
                        }
                        
                        if ( 'function' !== typeof Self )
                        {
                            throw new InvalidFieldException( 'Unsupported field value type ' + typeof Value + ' in field ' + FieldName  + '. Expected ' + Type + ' or function.')
                            return null
                        }
                    }
                    else if ( Value in Self && 'function' === typeof Self[Value] )
                    {
                        Self = this[Value]
                    }
                    
                    if ( true === ReturnPureFunction )
                    {
                        return Self
                    }

                    Value = Self(FieldName)
                }

                if ( true === Array.isArray( Value ) )
                {
                    return Value
                }
            }

            throw new InvalidFieldException( 'Unsupported field value type ' + typeof Value + ' in field ' + FieldName + '. Expected array or function.' )
            return null
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
            let Label = this.getStringLabels( LabelGenerator, Key, Field )
            if ( null === Label )
            {
                Label = ''
            }
            return Label
        },
        buildInputField: function ( Type, Field, LabelGenerator )
        {
            function addTextBasedAttributes ( Field, GeneratedField )
            {
                var Mutable

                if ( 'readonly' in Field )
                {
                    GeneratedField['readonly'] = this.executeFunctionOrGetBool( Field['readonly'], Field['name'] )
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
                    GeneratedField['maxlength'] = this.executeFunctionOrGetNumber( Field['maximum'], Field['name'] )
                }

                if ( 'pattern' in Field && 'string' === typeof Field['pattern'] )
                {
                    GeneratedField['pattern'] = this.executeFunctionOrGetString( Field['pattern'], Field['name'] )
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
                    GeneratedField['size'] = this.executeFunctionOrGetNumber( Field['size'], Field['name'] )
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
                    GeneratedField['list'] = this.executeFunctionOrGetString( Field['getValuesFromList'], Field['name'] )
                }

                if ( 'maximum' in Field )
                {
                    GeneratedField['max'] = this.executeFunctionOrGetNumber( Field['maximum'], Field['name'] )
                }

                if ( 'minimum' in Field )
                {
                    GeneratedField['min'] = this.executeFunctionOrGetNumber( Field['minimum'], Field['name'] )
                }

                if ( 'stepSize' in Field )
                {
                    GeneratedField['stepSize'] = this.executeFunctionOrGetNumber( Field['stepSize'], Field['name'] )
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
                    GeneratedField['dir'] = this.executeFunctionOrGetString( Field['dir'], Field['name'] )
                }

                if ( 'getValuesFromList' in Field )
                {
                    GeneratedField['list'] = this.executeFunctionOrGetString( Field['getValuesFromList'], Field['name'] )
                }

                if ( 'email' === Type && 'multipleItems' in Field && 'boolean' === typeof Field['multibleItems'] )
                {
                    GeneratedField['multiple'] = this.executeFunctionOrGetBool( Field['multipleItems'], Field['name'] )
                    GeneratedField['multi'] = this.executeFunctionOrGetBool( Field['multipleItems'], Field['name'] )
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
                    GeneratedField['accept'] = this.executeFunctionOrGetString( Field['accept'], Field['name'] )
                }

                if ( 'multipleInput' in Field && 'boolean' === typeof Field['multibleInput'] )
                {
                    GeneratedField['mulitple'] = this.executeFunctionOrGetBool( Field['multipleItems'], Field['name'] )
                    GeneratedField['multi'] = this.executeFunctionOrGetBool( Field['multipleItems'], Field['name'] )
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
                    GeneratedField['readonly'] = this.executeFunctionOrGetBool( Field['readonly'], Field['name'] )
                }
            }
            else if ( 'number' === Type )
            {
                GeneratedField = addNumericBasedAttributes( Field, GeneratedField, Field['name'] )
                if ( 'readonly' in Field )
                {
                    GeneratedField['readonly'] = this.executeFunctionOrGetBool( Field['readonly'], Field['name'] )
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
                    GeneratedField['list'] = this.executeFunctionOrGetString( Field['getValuesFromList'], Field['name'] )
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
                    Mutable = this.executeFunctionOrGetArray( Field['values'], Field['name'], true )
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
                let GeneratedProperty = {}
                if ( 'options' in Field )
                {
                    GeneratedProperty = this.executeFunctionOrGetObject( Field['options'], Field['name'] )
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
            
            function addInsideButtons( Buttons, FieldName, LabelGenerator )
            {
                var Index
                let Return = []
                let GeneratedButton = {}
                
                Buttons = this.__genericIsFuncionOrSomething( Buttons, 'any', FieldName )
                
                if ( 'object' === typeof Buttons )
                {   
                    if ( 'class' in Buttons )
                    {
                        GeneratedButton['classes'] = this.executeFunctionOrGetString( Buttons['class'], FieldName )
                    }

                    if ( 'label' in Buttons )
                    {
                        Buttons['label'] = this.executeFunctionOrGetString( Buttons['label'], FieldName )
                        try
                        {
                            GeneratedButton['label'] = this.getStringLabelOrEmpty( LabelGenerator, Buttons, 'label' )
                        }
                        catch ( Exception )
                        {
                            GeneratedButton['label'] = Buttons['label']
                        }
                    }
                    else
                    {
                        throw new InvalidFieldException( 'The insideButtons property of ' + FieldName + ' must have a label.' )
                        return null
                    }

                    if ( 'action' in Buttons )
                    {
                        Mutable = this.executeFunctionOrGetString( Buttons['action'], FieldName )
                        if ( 'function' !== typeof Mutable )
                        {
                            throw new InvalidFieldException( 'The action property of insideButtons property of field ' + FieldName + ' at index ' + Index + ' must be a function but string was given.' )
                            return null
                        }
                        GeneratedButton['onClick'] = Mutable
                    }

                    return [GeneratedButton]
                }
                else if ( true === Array.isArray( Buttons ) )
                {
                    for ( Index in Buttons )
                    {
                        GeneratedButton = {}
                        if ( 'object' === typeof Buttons[Index] )
                        {
                            if ( 'class' in Buttons[Index] )
                            {
                                GeneratedButton['classes'] = this.executeFunctionOrGetString( Buttons[Index]['class'], FieldName )
                            }
                            
                            if ( 'label' in Buttons[Index] )
                            {
                                Mutable = this.executeFunctionOrGetString( Buttons[Index]['label'], FieldName )
                                
                                try
                                {
                                    GeneratedButton['label'] = this.getStringLabelOrEmpty( LabelGenerator, Buttons[Index], 'label' )
                                }
                                catch ( Exception )
                                {
                                    GeneratedButton['label'] = Buttons[Index]['label']
                                }
                            }
                            else
                            {
                                throw new InvalidFieldException( 'The insideButtons property of ' + FieldName + ' at index ' + Index + ' must have a label.' )
                                return null
                            }
                            
                            if ( 'action' in Buttons[Index] )
                            {
                                Mutable = this.executeFunctionOrGetString( Buttons[Index]['action'], FieldName )
                                if ( 'function' !== typeof Mutable )
                                {
                                    throw new InvalidFieldException( 'The action property of insideButtons property of field ' + FieldName + ' at index ' + Index + ' must be a function but string was given.' )
                                    return null
                                }
                                
                                GeneratedButton['onClick'] = Mutable
                            }                           
                            
                            Return.push( GeneratedButton )
                        }
                    }
                }
                else
                {
                    throw new InvalidFieldException( 'The insideButtons property of ' + FieldName + ' needs to be a object or a array of objects, but ' + typeof Buttons + ' was given.' )
                    return null
                }
            }
            
            if ( 'class' in Field )
            {
                Field['styleClasses'] = Field['class']
                delete Field['class']
            }

            //common required properties
            if ( 'prefix' in Field )
            {
                if ( 'string' !== Field )
                {
                    throw new InvalidFieldException( 'The given prefix of ' + FieldName + ' must be a string, but ' + typeof Field['prefix'] + ' was given.' )
                    return null
                }
            }

            if ( 'name' in Field )
            {
                if ( 'prefix' in Field )
                {
                    GeneratedField['id'] = Field['prefix'] + '.' + Field['name']
                }
                else
                {
                    GeneratedField['id'] = Field['name']
                }
            }
            else
            {
                throw new InvalidFieldException( 'A given field has no name property' )
                return null
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
                        GeneratedField['listBox'] = this.executeFunctionOrGetBool( Field['asList'], Field['name'] )
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
                    GeneratedField['readonly'] = this.executeFunctionOrGetBool( Field['readonly'], Field['name'] )
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
                    GeneratedField['max'] = this.executeFunctionOrGetNumber( Field['maximum'], Field['name'] )
                }

                if ( 'minimum' in Field )
                {
                    GeneratedField['min'] = this.executeFunctionOrGetNumber( Field['minimum'], Field['name'] )
                }

                if ( true === ('rows' in Field ) )
                {
                    GeneratedField['rows'] = this.executeFunctionOrGetNumber( Field['rows'], Field['name'] )
                }
            }
            else if ( 'label' === Field['type'] )
            {
                /* Do nothing cause there no special attributes */
            }
            else if ( 'submit'  === Field['type'] )
            {
                if ( 'onSubmit' in Field )
                {
                    Mutable = this.executeFunctionOrGetString( Field['onSubmit'], Field['name'] )
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
                    GeneratedField['validateBeforeSubmit'] = this.executeFunctionOrGetBool( Field['validateBeforeSubmit'], Field['name'] )
                }

                if ( 'label' in Field )
                {
                    Field['label'] = this.executeFunctionOrGetString( Field['label'] )
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
                    GeneratedField['visible'] = this.executeFunctionOrGetBool( Field['isVisible'], Field['name'], true )
                }

                if ( 'isDisabled' in Field )
                {
                    GeneratedField['disabled'] = this.executeFunctionOrGetBool( Field['isDisabled'], Field['name'], true )
                }

                return GeneratedField
            }
            //futher types should be placed here
            else
            {
                GeneratedField = this.buildInputField( Field['type'], Field, StringSelector, Language )
            }

            //common required properties
            if ( 'label' in Field )
            {
                Field['label'] = this.executeFunctionOrGetString( Field['label'], Field['name'] )
                try
                {
                    GeneratedField['label'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'label' )
                }
                catch ( Exception )
                {
                    GeneratedField['label'] = Field['label']
                }
            }
            else
            {
                try
                {
                    GeneratedField['label'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'name' )
                }
                catch ( Exception )
                {
                    GeneratedField['label'] = Field['name']
                }
            }

            if ( 'storesIn' in Field )
            {
                if ( 'prefix' in Field )
                {
                    GeneratedField['model'] = Field['prefix'] + '.' + this.executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
                }
                else
                {
                    GeneratedField['model'] = this.executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
                }
            }
            else
            {
                if ( 'prefix' in Field )
                {
                    GeneratedField['model'] = Field['prefix'] + '.' + GeneratedField['id']
                }
                else
                {
                    GeneratedField['model'] = GeneratedField['id']
                }
            }
            
            //common optional properties
            if ( 'isVisible' in Field )
            {
                GeneratedField['visible'] = this.executeFunctionOrGetBool( Field['isVisible'], Field['name'], true )
            }
            
            if ( 'isDisabled' in Field )
            {
                GeneratedField['disabled'] = this.executeFunctionOrGetBool( Field['isDisabled'], Field['name'], true )
            } 

            if ( 'isFeatured' in Field )
            {
                GeneratedField['featured'] = this.executeFunctionOrGetBool( Field['isDisabled'], Field['name'], true )
            }

            if ( 'isRequired'in Field )
            {
                GeneratedField['required'] = this.executeFunctionOrGetBool( Field['isRequired'], Field['name'] )
            }               

            if ( 'defaultValue' in Field )
            {
                GeneratedField['default'] = this.__genericIsFuncionOrSomething( Field['defaultValue'], 'any', Field['name'] )
            }

            if ( 'styleClasses' in Field )
            {
                if ( false === Array.isArray( Field['styleClasses'] ) || 'string' !== typeof Field['styleClasses'] )
                {
                    throw new InvalidFieldException( 'The given property class is supposed to be a string or Array of strings but ' + typeof Field['styleClasses'] )
                    return null
                }
            }

            if ( 'help' in Field )
            {
                Field['help'] = this.executeFunctionOrGetString( Field['help'], Field['name'] )
                try
                {
                    GeneratedField['help'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'help' )
                }
                catch ( Exception )
                {
                    GeneratedField['help'] = Field['help']
                }
            }

            if ( 'hint' in Field )
            {
                Field['hint'] = this.executeFunctionOrGetString( Field['hint'], Field['name'] )
                try
                {
                    GeneratedField['hint'] = this.getStringLabelOrEmpty( LabelGenerator, Field, 'hint' )
                }
                catch ( Exception )
                {
                    GeneratedField['hint'] = Field['hint']
                }
            }

            if ( 'insideButtons' in Field )
            {
                GeneratedField['buttons'] = addInsideButtons( Field['insideButtons'], Field['name'] )
            }

            if ( 'formatter' in Field )
            {
                Mutable = this.executeFunctionOrGetString( Field['formatter'], Field['name'] )
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

            if ( 'afterChanged' in Field )
            {
                Mutable = this.executeFunctionOrGetString( Field['afterChanged'], Field['name'], true )
                if ( 'function' !== typeof Mutable )
                {
                    throw new InvalidFieldException( 'The given afterChanged property of ' + Field['name'] + ' must be a function.' )
                    return null
                }

                GeneratedField['onChanged'] = Mutable
            }

            if ( 'afterValidated' in Field )
            {
                Mutable = this.executeFunctionOrGetString( Field['afterValidated'], Field['name'], true )
                if ( 'function' !== typeof Mutable )
                {
                    throw new InvalidFieldException( 'The given afterValidated property of ' + Field['name'] + ' must be a function.' )
                    return null
                }
                
                GeneratedField['afterValidated'] = Mutable
            }
        
            return GeneratedField
        },
        buildModel: function ( FieldModel )
        {
            var Chunks
            let Self = this.$data.model
            if ( true === FieldModel.hasSubstring('.') )
            {
                Chunks = Value.split( '.' )
                for ( Index in Chunks )
                {
                    if ( Chunks[Index] in Self )
                    {
                        Self = Self[Chunks[Index]]
                    }
                    else
                    {
                        Self[Chunks[Index]] = {}
                        Self = Self[Chunks[Index]]
                    }
                }

                Self[Chunks[Chunks.length-1]] = ''
            }
            else
            {
                Self[FieldModel] = ''
            }
        },
        buildFields: function ( Fields, LabelGenerator )
        {
            let GeneratedFields = []
            let GeneratedGroups = []
            let Model = {}
            var FieldIndex, Mutable

            for ( FieldIndex in Fields )
            {
                if ( 'bind' in Fields[FieldIndex] )
                {
                    GeneratedFields.push( this.buildDynamicField( Fields[FieldIndex], Model, LabelGenerator ) )
                    continue
                }

                if ( 'group' in Fields[FieldIndex] )
                {
                    GeneratedGroups.push( this.buildGroup( Fields[FieldIndex], LabelGenerator ) )
                    continue
                }

                Mutable = this.buildField( Fields[FieldIndex], LabelGenerator )
                this.buildModel( Mutable['model'] )
                GeneratedFields.push( Mutable )
            }

            return GeneratedFields
        },
        buildGroup: function ( Group, LabelGenerator )
        {
            let GeneratedGroup = {}
            let GeneratedFields = []
            var Mutable
            if ( 'label' in Group )
            {
                Mutable = this.executeFunctionOrGetString( Buttons['label'], FieldName )
                try
                {
                    GeneratedGroup['legend'] = this.getStringLabelOrEmpty( LabelGenerator, Buttons, 'label' )
                }
                catch ( Exception )
                {
                    GeneratedGroup['legend'] = Mutable
                }
            }
            else
            {
                throw new InvalidFieldException( 'Unexspected field binding method ' + typeof Value + ' in field ' + Field['name'] )
                return null
            }
            
            if ( 'fields' in Group )
            {
                GeneratedGroup['fields'] = []
                for ( Index in Group['fields'] )
                {
                    if ( 'prefix' in Group && false === ( 'prefix' in Group['fields'][Index]) )
                    {
                        Group['fields'][Index]['prefix'] = Group['prefix']
                    }
                    
                    GeneratedGroup['fields'].push( this.buildField( Group['fields'][Index], LabelGenerator ) )
                }
            }
        },
        buildDynamicField: function ( Field, LabelGenerator )
        {
            let GeneratedFields = []
            let GeneratedGroups = []
            let Dynamic = this.executeFunctionOrGetString( Field['bind'], Field['name'] )
            if ( 'function' !== typeof Dynamic )
            {
                throw new InvalidFieldException( 'Unexspected field binding method ' + typeof Value + ' in field ' + Field['name'] )
                return null
            }

            GeneratedFields = Field['bind']()
            if ( true === Array.isArray( GeneratedFields ) )
            {
                if ( 'prefix' in Field )
                {
                    return [  this.buildFields( GeneratedFields, LabelGenerator, Field['prefix']  ), null, null ]
                }
                else
                {
                    return [ this.buildFields( GeneratedFields, LabelGenerator ), null, null ]
                }
            }
            else
            {
                if ( 'prefix' in Field )
                {
                    GeneratedFields['prefix'] = Field['prefix']
                }
                
                if ( 'group' in GeneratedFields )
                {
                    return [ null, this.buildGroup( GeneratedFields, LabelGenerator ), null ]
                }
                else
                {
                    return [ null, null, this.buildField( GeneratedFields, LabelGenerator ) ]
                }
            }
        },
        buildBlubberForm: function ( createElement, FormAttributes, FormProperties, Steps, LabelGenerator )
        {
            var Return, StepIndex;
            //set formproperties and add label  strings
            let FormPropertiesLabels = ['subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];
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
    },
    data: function ()
    {
        return { model: {} }
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
