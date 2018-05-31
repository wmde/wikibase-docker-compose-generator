<script>
import Vue from 'vue'
import VueFormGenerator from "vue-form-generator";
//import { VueFormWizard, FormWizard, TabContent } from 'vue-form-wizard'
import VueFormWizard from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'

Vue.use( VueFormWizard )
Vue.use( VueFormGenerator )

class BaseException
{
    constructor ( Name, Message )
    {
        this.Name = Name
        this.Message = Message
        console.trace()
    }
}

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
    }
}

class InvalidFieldValueException extends BaseException
{
    constructor ( Message )
    {
        super( 'InvalidFieldValueException', Message )
    }
}

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

            GeneratedField['type'] = 'input'
            GeneratedField['inputType'] = Type
            if ( 'text' === Type || 'search' === Type || 'url' === Type || 'tel' === Type || 'email' === Type )
            {
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
                }
            }
            else if ( 'password' === Type )
            {
                GeneratedField = addTextBasedAttributes( Field, GeneratedField, Field['name'] )
            }
            else if ( 'file' === Type )
            {
                this.__assignOptionalFieldString( Field, GeneratedField, 'accept' )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'multipleInput', 'multiple')
                if ( 'multiple' in GeneratedField )
                {
                    GeneratedField['multi'] = GeneratedField['multiple']
                }
            }
            else if (
                'range' === Type
            ||
                'month' === Type || 'time' === Type || 'week' === Type || 'date' === Type || 'datetime-local' === Type
            )
            {
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

            //specific  properties
            Field['type'] = Field['type'].toLowerCase()
            if (  'choise'  === Field['type'] )
            {
                GeneratedField['type'] = 'radios'
                GeneratedField['radiosOptions'] = this.__addOptionProperty( Field )
                GeneratedField['values'] = this.__addValueProperty( Field,
                                                                    GeneratedField['radiosOptions']['name'],
                                                                    GeneratedField['radiosOptions']['value'],
                                                                    LabelGenerator )
            }
            else if (  'select'  === Field['type'] )
            {
                GeneratedField['type'] = 'select'
                GeneratedField['selectOptions'] = this.__addOptionProperty( Field )

                if ( 'noneSelectedText' in GeneratedField['selectOptions'] )
                {
                    GeneratedField['selectOptions']['noneSelectedText'] = this.__getStringLabelOrPlaceholder( LabelGenerator,
                                                                                                              GeneratedField['selectOptions']['noneSelectedText'] )

                    if ( false === ( 'hideNoneSelectedText' in GeneratedField['selectOptions'] ) )
                    {
                        GeneratedField['selectOptions']['hideNoneSelectedText'] = false
                    }
                }
                else
                {
                    if ( false === ( 'hideNoneSelectedText' in GeneratedField['selectOptions'] ) )
                    {
                        GeneratedField['selectOptions']['hideNoneSelectedText'] = true
                    }
                }

                GeneratedField['values'] = this.__addValueProperty( Field,
                                                                    GeneratedField['selectOptions']['name'],
                                                                    GeneratedField['selectOptions']['value'],
                                                                    LabelGenerator )
            }
            else if ( 'pick'  === Field['type'] )
            {
                if( 'multipleItems' in Field && true === Field['multibleItems'] )
                {
                    GeneratedField['type'] = "checklist"
                    if ( 'asList' in Field )
                    {
                        GeneratedField['listBox'] = this.__executeFunctionOrGetBool( Field['asList'], Field['name'] )
                    }
                    else
                    {
                        GeneratedField['listBox'] = false
                    }

                    GeneratedField['checklistOptions'] = this.__addOptionProperty( Field )
                    GeneratedField['values'] = this.__addValueProperty( Field,
                                                                        GeneratedField['checklistOptions']['name'],
                                                                        GeneratedField['checklistOptions']['value'],
                                                                        LabelGenerator )
                }
                else
                {
                    GeneratedField['type'] = 'checkbox'
                    this.__addAutocompleteProperty( Field, GeneratedField )
                }
            }
            else if ( 'textBlock' === Field['type'] )
            {
                GeneratedField['type'] = 'textarea'
                this.__addAutocompleteProperty( Field, GeneratedField )
                this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' )
                this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' )
                this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'max' )
                this.__assignOptionalFieldNumeric( Field, GeneratedField, 'minimum', 'min' )
                this.__assignOptionalFieldNumeric( Field, GeneratedField, 'rows' )
            }
            else if ( 'label' === Field['type'] )
            {
                /* Do nothing cause there no special attributes */
            }
            else if ( 'submit'  === Field['type'] )
            {
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

                return GeneratedField
            }
            //futher types should be placed here
            else
            {
                GeneratedField = this._buildInputField( Field['type'], Field, LabelGenerator )
            }

            //common required properties
            if ( 'label' in Field )
            {
                Mutable = this.__executeFunctionOrGetString( Field['label'], Field['name'] )
                GeneratedField['label'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Field['label'] )
            }
            else
            {
                GeneratedField['label'] = this.__getStringLabelOrPlaceholder( LabelGenerator, Field['name'] )
            }

            if ( 'storesIn' in Field )
            {
                if ( 'prefix' in Field )
                {
                    GeneratedField['model'] = Field['prefix'] + '.' + this.__executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
                }
                else
                {
                    GeneratedField['model'] = this.__executeFunctionOrGetString( Field['storesIn'], Field['Name'] )
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

            if ( 'fields' in Group )
            {
                GeneratedGroup['fields'] = []
                for ( Index in Group['fields'] )
                {
                    if ( 'prefix' in Group && false === ( 'prefix' in Group['fields'][Index]) )
                    {
                        Group['fields'][Index]['prefix'] = Group['prefix']
                    }

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
            if ( true === Array.isArray( GeneratedFields ) )
            {
                if ( 'prefix' in Field )
                {
                    return [  this._buildFields( GeneratedFields, LabelGenerator, Field['prefix']  ), null, null ]
                }
                else
                {
                    return [ this._buildFields( GeneratedFields, LabelGenerator ), null, null ]
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
            return Return
        }
    },
    data: function ()
    {
        return { __currentFormId:'', _blubberModel: {}, _blubberFormSchema: {} }
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
