<script>
import Vue from 'vue'
import VueFormGenerator from "vue-form-generator";
<<<<<<< HEAD
//import { VueFormWizard, FormWizard, TabContent } from 'vue-form-wizard'
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use( VueFormWizard )
Vue.use( VueFormGenerator )

=======
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use( VueFormGenerator )
Vue.use( VueFormWizard )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
class BaseException
{
    constructor ( Name, Message )
    {
        this.Name = Name
        this.Message = Message
        console.trace()
    }
}

<<<<<<< HEAD
class InvalidFieldException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidFieldException', Message )
    }
}

class InvalidFieldPropertyException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidFieldPropertyException', Message )
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
    }
}

class InvalidFieldValueException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidFieldValueException', Message )
    }
}

<<<<<<< HEAD
class TypeErrorException extends BaseException
{
    constructor( Message )
    {
        super( "TypeErrorException", Message )
    }
}

const ErrorMessages = {
    UNKNOWN_METHOD_OR_PROPERTY: 'Unknown method or property {} of field {} .',
    UNKNOWN_METHOD: 'Unknown method {} of field {} .',
    UNSUPPORTED_TYPE: 'Unsupported type {} in field {}{}. Expected {}.',
    UNKNOWN_FIELDTYPE: 'Unknown fieldtype {} of field {} .',
    NO_VALUES: 'The given field {} has no \'values\' property.',
    CANNOT_SWITCH_VALUES: 'Cannot switch from automatic field definition to manual at field {}.',
    NO_LABEL_INSIDE_BUTTON: 'A insidebutton of field {} has no label.',
    NO_NAME: 'A given field has no name property',
    IVALID_TOP_ITEM: 'Invalid {} got {}, expected {}.'
}

Vue.mixin({
//    components: { FormWizard, TabContent },
    methods:
    {
        __genericExecuteFuncionOrGetSomething: function ( IsTypeOrFunction, Type, FieldName, ReturnPureFunction = false )
        {
            var Chunks, Self, Index
            if ( 'function' === typeof IsTypeOrFunction )
            {
                if ( true === ReturnPureFunction )
                {
                    return IsTypeOrFunction
                }

                IsTypeOrFunction = IsTypeOrFunction( FieldName )
            }
            else
            {
                Self = this
                if ( 'string' === typeof IsTypeOrFunction )
                {
                    if ( true === IsTypeOrFunction.hasSubstring( '.' ) )
                    {
                        Chunks = IsTypeOrFunction.split( '.' )
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                        for ( Index in Chunks )
                        {
                            if ( Chunks[Index] in Self )
                            {
                                Self = Self[Chunks[Index]]
                            }
                            else
                            {
<<<<<<< HEAD
                                Self = null
                                break
                            }
                        }
                    }
                    else if ( IsTypeOrFunction in Self && 'function' === typeof Self[IsTypeOrFunction] )
                    {
                        Self = this[IsTypeOrFunction]
                    }
                    else
                    {
                        Self = null
                    }

                    if ( null !== Self )
                    {
                        if ( 'function' === typeof Self )
                        {
                            if ( true === ReturnPureFunction )
                            {
                                return Self
                            }

                            IsTypeOrFunction = Self(FieldName)
                        }
                        else
                        {
                            if ( true === ReturnPureFunction )
                            {
                                throw new InvalidFieldPropertyException( ErrorMessages.UNKNOWN_METHOD.format( IsTypeOrFunction, FieldName ) )
                                return null
                            }
                            IsTypeOrFunction = Self
                        }
                    }
                }
            }

            if ( typeof IsTypeOrFunction === Type || 'any' === Type )
            {
                return IsTypeOrFunction
            }

            throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof IsTypeOrFunction, FieldName, '', Type ) )
            return null
        },
        __executeFunctionOrGetString: function ( IsTypeOrFunction, FieldName, ReturnPureFunction = false )
        {
            return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'string', FieldName, ReturnPureFunction )
        },
        __executeFunctionOrGetNumber: function( IsTypeOrFunction, FieldName, ReturnPureFunction = false )
        {
            return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'number', FieldName, ReturnPureFunction )
        },
        __executeFunctionOrGetBool: function( IsTypeOrFunction, FieldName, ReturnPureFunction = false )
        {
            return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'boolean', FieldName, ReturnPureFunction )
        },
        __executeFunctionOrGetObject: function( IsTypeOrFunction, FieldName, ReturnPureFunction = false )
        {
            return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'object', FieldName, ReturnPureFunction )
        },
        __executeFunctionOrGetArray: function ( IsTypeOrFunction, FieldName, ReturnPureFunction = false )
        {
            var Chunks, Self, Index
            if ( 'function' === typeof IsTypeOrFunction )
            {
                if ( true === ReturnPureFunction )
                {
                    return IsTypeOrFunction
                }

                IsTypeOrFunction = IsTypeOrFunction( FieldName )
            }
            else
            {
                Self = this
                if ( 'string' === typeof IsTypeOrFunction )
                {
                    if ( true === IsTypeOrFunction.hasSubstring( '.' ) )
                    {
                        Chunks = IsTypeOrFunction.split( '.' )
                        for ( Index in Chunks )
                        {
                            if ( Chunks[Index] in Self )
                            {
                                Self = Self[Chunks[Index]]
                            }
                            else
                            {
                                Self = null
                                break
                            }
                        }
                    }
                    else if ( IsTypeOrFunction in Self && 'function' === typeof Self[IsTypeOrFunction] )
                    {
                        Self = this[IsTypeOrFunction]
                    }

                    if ( null !== Self )
                    {
                        if ( 'function' === typeof Self )
                        {
                            if (true === ReturnPureFunction)
                            {
                                return Self
                            }

                            IsTypeOrFunction = Self(FieldName)
                        }
                    }
                    else
                    {
                        throw new InvalidFieldException(ErrorMessages.UNKNOWN_METHOD_OR_PROPERTY.format(IsTypeOrFunction, FieldName))
                        return null
                    }
                }
            }

            if ( true === Array.isArray( IsTypeOrFunction ) )
            {
                return IsTypeOrFunction
            }

            throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof IsTypeOrFunction, FieldName, '', 'array' ) )
            return null
        },
        __getStringLabelOrEmpty: function ( LabelGenerator, Label )
        {
            var LabelValue

            if ( true === this.isEmpty( Label ) )
            {
                return ''
            }
            else
            {
                LabelValue = LabelGenerator( Label )
                if ( true === this.isEmpty( LabelValue ) || Label === LabelValue )
                {
                    return ''
                }
                return Label
            }
        },
        __getStringLabelOrPlaceholder: function ( LabelGenerator, Label )
        {
            var LabelValue

            if ( true === this.isEmpty( Label ) )
            {
                return ''
            }
            else
            {
                LabelValue = LabelGenerator( Label )
                if ( true === this.isEmpty( LabelValue ) )
                {
                    return Label
                }
                else
                {
                    return LabelValue
                }
            }
        },
        __assignOptionalFieldString: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            if ( FieldLabel in Field )
            {
                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = this.__executeFunctionOrGetString( Field[FieldLabel], Field['name'] )
                }
                else
                {
                    GeneratedField[FieldLabel] = this.__executeFunctionOrGetString( Field[FieldLabel], Field['name'] )
                }
            }
        },
        __assignOptionalFieldNumeric: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            if ( FieldLabel in Field )
            {
                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = this.__executeFunctionOrGetNumber( Field[FieldLabel], Field['name'] )
                }
                else
                {
                    GeneratedField[FieldLabel] = this.__executeFunctionOrGetNumber( Field[FieldLabel], Field['name'] )
                }
            }
        },
        __assignOptionalFieldBoolean: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            if ( FieldLabel in Field )
            {
                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = this.__executeFunctionOrGetBool( Field[FieldLabel], Field['name'] )
                }
                else
                {
                    GeneratedField[FieldLabel] = this.__executeFunctionOrGetBool( Field[FieldLabel], Field['name'] )
                }
            }
        },
        __assignOptionalFieldObject: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            if ( FieldLabel in Field )
            {
                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = this.__executeFunctionOrGetObject( Field[FieldLabel], Field['name'] )
                }
                else
                {
                    GeneratedField[FieldLabel] = this.__executeFunctionOrGetObject( Field[FieldLabel], Field['name'] )
                }
            }
        },
        __assignOptionalFieldFunction: function (  Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            var Mutable
            if ( FieldLabel in Field )
            {
                Mutable = this.__executeFunctionOrGetString( Field[FieldLabel], Field['name'], true )
                if ( 'function' !== typeof Mutable )
                {
                    throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof Mutable, Field['name'], '', 'function' ) )
                    return null
                }

                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = Mutable
                }
                else
                {
                    GeneratedField[FieldLabel] = Mutable
                }
            }
        },
        __assignOptionalEmptyStringOrLabelString: function ( LabelGenerator, Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            if ( FieldLabel in Field )
            {
                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = this.__getStringLabelOrEmpty(LabelGenerator, Field[FieldLabel])
                }
                else
                {
                    GeneratedField[FieldLabel] = this.__getStringLabelOrEmpty(LabelGenerator, Field[FieldLabel])
                }
            }
        },
        __assignOptionalPlaceholderOrLabelString: function ( LabelGenerator, Field, GeneratedField, FieldLabel, AssignmentLabel = '' )
        {
            if ( FieldLabel in Field )
            {
                if ( false === AssignmentLabel.isEmpty() )
                {
                    GeneratedField[AssignmentLabel] = this.__getStringLabelOrPlaceholder(LabelGenerator, Field[FieldLabel])
                }
                else
                {
                    GeneratedField[FieldLabel] = this.__getStringLabelOrPlaceholder(LabelGenerator, Field[FieldLabel])
                }
            }
        },
        __addAutocompleteProperty: function ( Field, GeneratedField )
        {
            if ( 'autocomplete' in Field && false === Field['autocomplete'] )
            {
                GeneratedField['autocomplete'] = 'off'
            }
            else
            {
                GeneratedField['autocomplete'] = 'on'
            }
        },
        __addTextBasedAttributes: function ( Field, GeneratedField, LabelGenerator )
        {
            this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' )
            this.__addAutocompleteProperty( Field, GeneratedField )
            this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'maxlength' )
            this.__assignOptionalFieldString( Field, GeneratedField, 'pattern' )
            this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' )
            this.__assignOptionalFieldNumeric( Field, GeneratedField, 'size' )

            return GeneratedField
        },
        __addNumericBasedAttributes: function ( Field, GeneratedField )
        {
            this.__addAutocompleteProperty( Field, GeneratedField )
            this.__assignOptionalFieldString( Field, GeneratedField, 'getValuesFromList', 'list' )
            this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'max' )
            this.__assignOptionalFieldNumeric( Field, GeneratedField, 'minimum', 'min' )
            this.__assignOptionalFieldNumeric( Field, GeneratedField, 'stepSize' )
            return GeneratedField
        },
        _buildInputField: function ( Type, Field, LabelGenerator )
        {
            let GeneratedField = {}
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd

            GeneratedField['type'] = 'input'
            GeneratedField['inputType'] = Type
            if ( 'text' === Type || 'search' === Type || 'url' === Type || 'tel' === Type || 'email' === Type )
            {
<<<<<<< HEAD
                GeneratedField = this.__addTextBasedAttributes(Field, GeneratedField )

                if ( 'text' === Type || 'search' === Type )
                {
                    this.__assignOptionalFieldString( Field, GeneratedField, 'dir' )
                }

                this.__assignOptionalFieldString( Field, GeneratedField, 'getValuesFromList', 'list' )

                if ( 'email' === Type )
                {
                    this.__assignOptionalFieldBoolean( Field, GeneratedField, 'multipleInput', 'multiple')
                    if ( 'multiple' in GeneratedField )
                    {
                        GeneratedField['multi'] = GeneratedField['multiple']
                    }
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                }
            }
            else if ( 'password' === Type )
            {
                GeneratedField = addTextBasedAttributes( Field, GeneratedField, Field['name'] )
            }
            else if ( 'file' === Type )
            {
<<<<<<< HEAD
                this.__assignOptionalFieldString( Field, GeneratedField, 'accept' )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'multipleInput', 'multiple')
                if ( 'multiple' in GeneratedField )
                {
                    GeneratedField['multi'] = GeneratedField['multiple']
=======
                if ( 'accept' in Field && 'accept' === typeof Field['accept'] )
                {
                    GeneratedField['accept'] = this.executeFunctionOrGetString( Field['accept'], Field['name'] )
                }

                if ( 'multipleInput' in Field && 'boolean' === typeof Field['multibleInput'] )
                {
                    GeneratedField['mulitple'] = this.executeFunctionOrGetBool( Field['multipleItems'], Field['name'] )
                    GeneratedField['multi'] = this.executeFunctionOrGetBool( Field['multipleItems'], Field['name'] )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                }
            }
            else if (
                'range' === Type
            ||
                'month' === Type || 'time' === Type || 'week' === Type || 'date' === Type || 'datetime-local' === Type
            )
            {
<<<<<<< HEAD
                GeneratedField = this.__addNumericBasedAttributes( Field, GeneratedField, Filed['name'] )
                if ( 'range' !== Type )
                {
                    this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' )
                }

            }
            else if ( 'number' === Type )
            {
                GeneratedField = this.__addNumericBasedAttributes( Field, GeneratedField, Field['name'] )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' )
                this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' )
            }
            else if ( 'color' === Type )
            {
              this.__addAutocompleteProperty( Field, GeneratedField )
                this.__assignOptionalFieldString( Field, GeneratedField, 'getValuesFromList', 'list' )
            }
            else if( 'reset' === Type || 'hidden' === Type )
            {
                /* Do nothing cause there are no other additional attributes */
            }
            //Futher types can placed here
            else
            {
                throw new InvalidFieldException ( ErrorMessages.UNKNOWN_FIELDTYPE.format( Type, Field['name'] ) )
                return null
            }

            return GeneratedField
        },
        __addValueProperty: function ( Field, LabelKey, ValueKey, LabelGenerator )
        {
            var Mutable, GeneratedValues, GeneratedValue, ValueIndex, ValueIsString
            if ( 'values' in Field )
            {
                Mutable = this.__executeFunctionOrGetArray( Field['values'], Field['name'] )
            }
            else
            {
                throw new InvalidFieldException( ErrorMessages.NO_VALUES.format( Field['name'] ) )
                return null
            }

            if ( false === Array.isArray( Mutable ) )
            {
                return Mutable
            }

            GeneratedValues = []

            if ( 'string' === typeof Mutable[0] )
            {
                ValueIsString = true
            }
            else
            {
                ValueIsString = false
            }

            for ( ValueIndex in Mutable )
            {
                if ( 'string' === typeof Mutable[ValueIndex] )
                {
                    if ( true === ValueIsString )
                    {
                        GeneratedValues.push( Mutable[ValueIndex] )
                    }
                    else
                    {
                        throw new InvalidFieldValueExecption( ErrorMessages.CANNOT_SWITCH_VALUES.format( Field['name'] ) )
                        return null
                    }
                }
                else if ( 'object' === typeof Mutable[ValueIndex] )
                {
                    if (  false !== ValueIsString )
                    {
                        throw new InvalidFieldValueExecption( ErrorMessages.CANNOT_SWITCH_VALUES.format( Field['name'] ) )
                        return null
                    }
                    GeneratedValue = {}
                    GeneratedValue[ValueKey] = Mutable[ValueIndex][ValueKey]
                    this.__assignOptionalPlaceholderOrLabelString( LabelGenerator, Mutable[ValueIndex], GeneratedValue, LabelKey )
                    GeneratedValues.push( GeneratedValue )
                }
                else
                {
                    throw new InvalidFieldValueException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof Mutable[ValueIndex], Field['name'], 'at values', 'object or string' ) )
                    return null
                }
            }

            return GeneratedValues
        },
        __addOptionProperty: function ( Field )
        {
            let GeneratedProperty = {}
            this.__assignOptionalFieldObject( Field, GeneratedProperty, 'options' )

            if ( false === ( 'value' in GeneratedProperty ) )
            {
                GeneratedProperty['value'] = 'value'
            }

            if ( false === ( 'name' in GeneratedProperty ) )
            {
                GeneratedProperty['name'] = 'label'
            }

            return GeneratedProperty
        },
        __addInsideButtons: function ( Buttons, FieldName, LabelGenerator )
        {
            var Index, Mutable
            let Return = []
            let GeneratedButton = {}

            let InsideButtons = this.__genericExecuteFuncionOrGetSomething( Buttons, 'any', FieldName )

            if ( 'object' === typeof InsideButtons )
            {
                InsideButtons['name'] = FieldName
                this.__assignOptionalFieldString( InsideButtons, GeneratedButton, 'class', 'classes' )

                if ( 'label' in InsideButtons )
                {
                    Mutable = this.__executeFunctionOrGetString( InsideButtons['label'], FieldName )
                    GeneratedButton['label'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable )
                }
                else
                {
                    throw new InvalidFieldException( ErrorMessages.NO_LABEL_INSIDE_BUTTON.format( FieldName ) )
                    return null
                }

                this.__assignOptionalFieldFunction(  Buttons, GeneratedButton, 'action', 'onClick' )

                return [GeneratedButton]
            }
            else if ( true === Array.isArray( InsideButtons ) )
            {
                for ( Index in InsideButtons )
                {
                    GeneratedButton = {}
                    if ( 'object' === typeof InsideButtons[Index] )
                    {
                        this.__assignOptionalFieldString( InsideButtons[Index], GeneratedButton, 'class', 'classes' )

                        if ( 'label' in Buttons )
                        {
                            Mutable = this.__executeFunctionOrGetString( InsideButtons[Index]['label'], FieldName )
                            GeneratedButton['label'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable )
                        }
                        else
                        {
                            throw new InvalidFieldException( ErrorMessages.NO_LABEL_INSIDE_BUTTON.format( FieldName ) )
                            return null
                        }

                        this.__assignOptionalFieldFunction(  InsideButtons[Index], GeneratedButton, 'action', 'onClick' )
                        Return.push( GeneratedButton )
                    }
                    else
                    {
                        throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof InsideButtons[Index], FieldName, 'at insideButtons', 'array of objects or object' ) )
                        return null
                    }
                }
                return Return
            }
            else
            {
                throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof InsideButtons, FieldName, 'at insideButtons', 'array of objects or object' ) )
                return null
            }
        },
        _buildField: function ( Field, LabelGenerator )
        {
            var Mutable
            let GeneratedField = {}

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
                    throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof Field['prefix'], Field['name'], 'at prefix', 'string' ) )
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
                throw new InvalidFieldException( ErrorMessages.NO_NAME )
                return null
            }

=======
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
            
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            //specific  properties
            Field['type'] = Field['type'].toLowerCase()
            if (  'choise'  === Field['type'] )
            {
                GeneratedField['type'] = 'radios'
<<<<<<< HEAD
                GeneratedField['radiosOptions'] = this.__addOptionProperty( Field )
                GeneratedField['values'] = this.__addValueProperty( Field,
                                                                    GeneratedField['radiosOptions']['name'],
                                                                    GeneratedField['radiosOptions']['value'],
                                                                    LabelGenerator )
=======
                GeneratedField['radiosOptions'] = addOptionProperty( Field )
                GeneratedField['values'] = addValueProperty( Field, GeneratedField['radiosOptions']['name'], LabelGenerator )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            }
            else if (  'select'  === Field['type'] )
            {
                GeneratedField['type'] = 'select'
<<<<<<< HEAD
                GeneratedField['selectOptions'] = this.__addOptionProperty( Field )

                if ( 'noneSelectedText' in GeneratedField['selectOptions'] )
                {
                    GeneratedField['selectOptions']['noneSelectedText'] = this.__getStringLabelOrPlaceholder( LabelGenerator,
                                                                                                              GeneratedField['selectOptions']['noneSelectedText'] )

                    if ( false === ( 'hideNoneSelectedText' in GeneratedField['selectOptions'] ) )
                    {
                        GeneratedField['selectOptions']['hideNoneSelectedText'] = false
=======

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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                    }
                }
                else
                {
<<<<<<< HEAD
                    if ( false === ( 'hideNoneSelectedText' in GeneratedField['selectOptions'] ) )
                    {
                        GeneratedField['selectOptions']['hideNoneSelectedText'] = true
                    }
                }

                GeneratedField['values'] = this.__addValueProperty( Field,
                                                                    GeneratedField['selectOptions']['name'],
                                                                    GeneratedField['selectOptions']['value'],
                                                                    LabelGenerator )
=======
                    GeneratedField['hideNoneSelectedText'] = true
                }

                GeneratedField['values'] = addValueProperty( Field, GeneratedField['selectOptions']['name'], LabelGenerator )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            }
            else if ( 'pick'  === Field['type'] )
            {
                if( 'multipleItems' in Field && true === Field['multibleItems'] )
                {
                    GeneratedField['type'] = "checklist"
<<<<<<< HEAD
                    if ( 'asList' in Field )
                    {
                        GeneratedField['listBox'] = this.__executeFunctionOrGetBool( Field['asList'], Field['name'] )
=======
                    if ( 'asList' in Field && true === Field['asList'] )
                    {
                        GeneratedField['listBox'] = this.executeFunctionOrGetBool( Field['asList'], Field['name'] )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                    }
                    else
                    {
                        GeneratedField['listBox'] = false
                    }

<<<<<<< HEAD
                    GeneratedField['checklistOptions'] = this.__addOptionProperty( Field )
                    GeneratedField['values'] = this.__addValueProperty( Field,
                                                                        GeneratedField['checklistOptions']['name'],
                                                                        GeneratedField['checklistOptions']['value'],
                                                                        LabelGenerator )
=======
                    GeneratedField['checklistOptions'] = addOptionProperty( Field )
                    GeneratedField['values'] = addValueProperty( Field, GeneratedField['checklistOptions']['name'], LabelGenerator )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                }
                else
                {
                    GeneratedField['type'] = 'checkbox'
<<<<<<< HEAD
                    this.__addAutocompleteProperty( Field, GeneratedField )
=======
                    if ( 'autocomplete' in Field && false === Field['autocomplete'] )
                    {
                        GeneratedField['autocomplete'] = 'off'
                    }
                    else
                    {
                        GeneratedField['autocomplete'] = 'on'
                    }
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                }
            }
            else if ( 'textBlock' === Field['type'] )
            {
                GeneratedField['type'] = 'textarea'
<<<<<<< HEAD
                this.__addAutocompleteProperty( Field, GeneratedField )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' )
                this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' )
                this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'max' )
                this.__assignOptionalFieldNumeric( Field, GeneratedField, 'minimum', 'min' )
                this.__assignOptionalFieldNumeric( Field, GeneratedField, 'rows' )
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            }
            else if ( 'label' === Field['type'] )
            {
                /* Do nothing cause there no special attributes */
            }
            else if ( 'submit'  === Field['type'] )
            {
<<<<<<< HEAD
                this.__assignOptionalFieldFunction(  Field, GeneratedField, 'onSubmit' )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'validateBeforeSubmit' )

                if ( 'label' in Field )
                {
                    Mutable = this.__executeFunctionOrGetString( Field['label'], Field['name'] )
                    GeneratedField['buttonText'] = this.__getStringLabelOrPlaceholder( LabelGenerator,Mutable )
                }
                else
                {
                    GeneratedField['buttonText'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Field['name'] )
                }

                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isVisible', 'visible' )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isDisabled', 'disabled' )
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd

                return GeneratedField
            }
            //futher types should be placed here
            else
            {
<<<<<<< HEAD
                GeneratedField = this._buildInputField( Field['type'], Field, LabelGenerator )
=======
                GeneratedField = this.buildInputField( Field['type'], Field, StringSelector, Language )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            }

            //common required properties
            if ( 'label' in Field )
            {
<<<<<<< HEAD
                Mutable = this.__executeFunctionOrGetString( Field['label'], Field['name'] )
                GeneratedField['label'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Field['label'] )
            }
            else
            {
                GeneratedField['label'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Field['name'] )
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            }

            if ( 'storesIn' in Field )
            {
                if ( 'prefix' in Field )
                {
<<<<<<< HEAD
                    GeneratedField['model'] = Field['prefix'] + '.' + this.__executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
                }
                else
                {
                    GeneratedField['model'] = this.__executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
=======
                    GeneratedField['model'] = Field['prefix'] + '.' + this.executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
                }
                else
                {
                    GeneratedField['model'] = this.executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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
<<<<<<< HEAD

            //common optional properties
            this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isVisible', 'visible' )
            this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isDisabled', 'disabled' )
            this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isFeatured', 'featured' )
            this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isRequired', 'required' )
            this.__assignOptionalFieldString( Field, GeneratedField, 'defaultValue', 'default')

            if ( 'styleClasses' in Field )
            {
                if ( false === Array.isArray( Field['styleClasses'] ) && 'string' !== typeof Field['styleClasses'] )
                {
                    throw new InvalidFieldException(
                        ErrorMessages.UNSUPPORTED_TYPE.format(
                            typeof Field['styleClasses'],
                            Field['name'],
                            ' at styleClasses property',
                            'array of strings or string' ) )
                    return null
                }
                else if ( true === Array.isArray( Field['styleClasses'] ) )
                {
                    for ( Mutable in Field['styleClasses'] )
                    {
                        if ( 'string' !== typeof Field['styleClasses'][Mutable] )
                        {
                            throw new InvalidFieldException(
                                ErrorMessages.UNSUPPORTED_TYPE.format(
                                    typeof Field['styleClasses'][Mutable],
                                    Field['name'],
                                    ` at styleClasses property at Index ${Mutable}`,
                                    'string' ) )
                            return null
                        }
                    }
                }
            }

            this.__assignOptionalPlaceholderOrLabelString( LabelGenerator, Field, GeneratedField, 'help' )
            this.__assignOptionalPlaceholderOrLabelString( LabelGenerator, Field, GeneratedField, 'hint' )

            if ( 'insideButtons' in Field )
            {
                GeneratedField['buttons'] = this.__addInsideButtons( Field['insideButtons'], Field['name'] )
            }

            this.__assignOptionalFieldFunction(  Field, GeneratedField, 'setFormatter', 'set' )
            this.__assignOptionalFieldFunction(  Field, GeneratedField, 'getFormatter', 'get' )
            this.__assignOptionalFieldFunction(  Field, GeneratedField, 'afterChanged', 'onChanged' )
            this.__assignOptionalFieldFunction(  Field, GeneratedField, 'afterValidated' )

            return GeneratedField
        },
        _buildModel: function ( FieldModel, MultipleValues = false )
        {
            var Chunks, Index

            let Self = this.$data._blubberModel[this.$data.__currentFormId]
            //let Self = this.$data.model

=======
            
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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

<<<<<<< HEAD
                if ( true === MultipleValues )
                {
                    Self[Chunks[Chunks.length-1]] = []
                }
                else
                {
                    Self[Chunks[Chunks.length-1]] = ''
                }
            }
            else
            {
                if ( true === MultipleValues )
                {
                  Self[FieldModel] = []
                }
                else
                {
                  Self[FieldModel] = ''
                }
            }
        },
        _buildGroup: function ( Group, LabelGenerator )
        {
            var Index, Mutable
            let GeneratedGroup = {}
            var Mutable


            if ( 'name' in Group )
            {
                GeneratedGroup['legend'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Group['name'] )
            }
            else
            {
                throw new InvalidFieldException( ErrorMessages.NO_NAME )
                return null
            }

=======
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
            
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            if ( 'fields' in Group )
            {
                GeneratedGroup['fields'] = []
                for ( Index in Group['fields'] )
                {
                    if ( 'prefix' in Group && false === ( 'prefix' in Group['fields'][Index]) )
                    {
                        Group['fields'][Index]['prefix'] = Group['prefix']
                    }
<<<<<<< HEAD

                    Mutable = this._buildField( Group['fields'][Index], LabelGenerator )
                    this._buildModel( Mutable['model'] )
                    GeneratedGroup['fields'].push( Mutable )
                }
            }

            return GeneratedGroup
        },
        _buildDynamicField: function ( Field, LabelGenerator )
        {
            let GeneratedFields = {}
            this.__assignOptionalFieldFunction(  Field, GeneratedFields, 'bind' )
            GeneratedFields = GeneratedFields['bind']()
=======
                    
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            if ( true === Array.isArray( GeneratedFields ) )
            {
                if ( 'prefix' in Field )
                {
<<<<<<< HEAD
                    return [  this._buildFields( GeneratedFields, LabelGenerator, Field['prefix']  ), null, null ]
                }
                else
                {
                    return [ this._buildFields( GeneratedFields, LabelGenerator ), null, null ]
=======
                    return [  this.buildFields( GeneratedFields, LabelGenerator, Field['prefix']  ), null, null ]
                }
                else
                {
                    return [ this.buildFields( GeneratedFields, LabelGenerator ), null, null ]
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                }
            }
            else
            {
                if ( 'prefix' in Field )
                {
                    GeneratedFields['prefix'] = Field['prefix']
                }
<<<<<<< HEAD

                if ( 'group' in GeneratedFields )
                {
                    return [ null, this._buildGroup( GeneratedFields, LabelGenerator ), null ]
                }
                else
                {
                    return [ null, null, this._buildField( GeneratedFields, LabelGenerator ) ]
                }
            }
        },
        _buildFields: function ( Fields, LabelGenerator )
        {
            let GeneratedFields = []
            let GeneratedGroups = []
            let Model = {}
            var FieldIndex, Mutable

            for ( FieldIndex in Fields )
            {
                if ( 'bind' in Fields[FieldIndex] )
                {
                    Mutable = this._buildDynamicField( Fields[FieldIndex], Model, LabelGenerator )
                    if ( null === Mutable[1] && null === Mutable[2] )
                    {
                        GeneratedFields = GeneratedFields.concat( Mutable )
                    }
                    else if ( null === Mutable[0] && null === Mutable[2] )
                    {
                        GeneratedGroups.push( Mutable )
                    }
                    else
                    {
                        Mutable = this._buildField( Fields[FieldIndex], LabelGenerator )
                        if ('multi' in Mutable )
                        {
                            this._buildModel( Mutable['model'], Mutable['multi'] )
                        }
                        else
                        {
                            this._buildModel( Mutable['model'] )
                        }

                        GeneratedFields.push( Mutable )
                    }
                    continue
                }

                if ( 'group' in Fields[FieldIndex] )
                {
                    GeneratedGroups.push( this.buildGroup( Fields[FieldIndex], LabelGenerator ) )
                    continue
                }

                Mutable = this._buildField( Fields[FieldIndex], LabelGenerator )
                if ('multi' in Mutable )
                {
                    this._buildModel( Mutable['model'], Mutable['multi'] )
                }
                else
                {
                    this._buildModel( Mutable['model'] )
                }

                GeneratedFields.push( Mutable )
            }

            if ( false === this.isEmpty( GeneratedGroups ) )
            {
                return { fields: GeneratedFields, groups: GeneratedGroups }
            }
            else
            {
                return { fields: GeneratedFields }
            }
        },
        __addDescription: function ( createElement, Step, LabelGenerator )
        {
            let DescriptionText = this.__getStringLabelOrPlaceholder( LabelGenerator, Step['description'] )
            if ( false === DescriptionText.isEmpty() )
            {
                return createElement('p',
                {
                    attr:
                      {
                        class: 'blubberDescription',
                        id: Step['description']
                      },
                    domProps:
                    {
                      innerHTML: DescriptionText
                    }
                })
            }
            else
            {
                return ''
            }
        },
        __buildVueGenerator: function ( createElement, Step, LabelGenerator )
        {
            var Options
            let Index = this.$data._blubberFormSchema[this.$data.__currentFormId].length
            this.$data._blubberFormSchema[this.$data.__currentFormId].push( this._buildFields( Step['fields'], LabelGenerator ) )

            if ( 'options' in Step )
            {
                Options = Step['options']
            }
            else
            {
                Options = {}
            }

            return createElement(
                  'vue-form-generator',
                  {
                      props:
                      {
                          model: this.$data._blubberModel[this.$data.__currentFormId],
                          schema: this.$data._blubberFormSchema[this.$data.__currentFormId][Index],
                          options: Options,
                          ref: '{}_{}'.format(this.$data.__currentFormId, Index)
                      }
                  })
        },
        _buildStep: function ( createElement, Step, LabelGenerator )
        {
            var VueGenerator, Description, Title, Icon, Mutable
            let BeforeChange = {}

            Description = this.__addDescription( createElement, Step, LabelGenerator )
            VueGenerator = this.__buildVueGenerator( createElement, Step, LabelGenerator )

            if( 'label' in Step )
            {
                Mutable = this.__executeFunctionOrGetString( Step['label'], Step['"name"'] )
                Title = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable)
            }
            else
            {
                Title = this.__getStringLabelOrPlaceholder( LabelGenerator, Step['name'] )
            }

            if ( 'icon' in Step)
            {
                Icon = Step['icon']
            }
            else
            {
                Icon = ''
            }

            if ( 'beforeChange' in Step )
            {
                this.__assignOptionalFieldFunction( Step, BeforeChange, 'beforeChange' )
                return createElement( 'tab-content',
                    {
                        attr:
                            {
                                id: Step['name']
                            },
                        props:
                            {
                                title: Title,
                                icon: Icon,
                                beforeChange: BeforeChange['beforeChange']
                            }
                    },
                    [ Description, VueGenerator ]
                )
            }
            else
            {
                return createElement( 'tab-content',
                    {
                        attr:
                            {
                                id: Step['name']
                            },
                        props:
                            {
                                title: Title,
                                icon: Icon
                            }
                    },
                    [ Description, VueGenerator ]
                )
              }


        },
        buildBlubberForm: function ( createElement, FormId, FormAttributes, FormProperties, Steps, LabelGenerator )
        {
            var Return, StepIndex, LabelString, LabelIndex;
            let Tabs = []
            //set formproperties and add labels
            let FormPropertiesLabels = ['subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];

            if ( 'string' !== typeof FormId || true === FormId.isEmpty() )
            {
                throw new TypeErrorException( ErrorMessages.IVALID_TOP_ITEM.format( 'FormId', typeof FormId, 'non empty string' ) )
                return null
            }

            if ( 'function' !== typeof LabelGenerator )
            {
                throw new TypeErrorException( ErrorMessages.IVALID_TOP_ITEM.format( 'LabelGenerator', typeof LabelGenerator, 'function' ) )
                return null
            }

            if ( 'object' !== typeof FormAttributes )
            {
                FormAttributes = { id: FormId }
            }
            else
            {
                FormAttributes['id'] = FormId
            }

            for ( LabelIndex in FormPropertiesLabels )
            {
                LabelString = this.__getStringLabelOrPlaceholder(
                    LabelGenerator,
                    FormProperties[FormPropertiesLabels[LabelIndex]],
                    FormProperties )
                FormProperties[FormPropertiesLabels[LabelIndex]] = LabelString
            }

            this.$data._blubberFormSchema[FormId] = []
            this.$data._blubberModel[FormId] = {}
            this.$data.__currentFormId = FormId
            for ( StepIndex in Steps )
            {
                Tabs.push( this._buildStep( createElement, Steps[StepIndex], LabelGenerator ) )
            }

            Return = createElement( 'form-wizard', {
                attrs:FormAttributes,
                props:FormProperties
            }, Tabs )
=======
                
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            return Return
        }
    },
    data: function ()
    {
<<<<<<< HEAD
        return { __currentFormId:'', _blubberModel: {}, _blubberFormSchema: {} }
=======
        return { model: {} }
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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
