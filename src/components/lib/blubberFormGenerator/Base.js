import StringHelper from '../StringHelper';
import { BaseException } from '../BaseExceptions';
import Utils from '../../../Utils';
import CommonRequiredAttributes from "./CommonRequiredAttributes";
/* eslint-disable operator-linebreak */
export class InvalidFieldException extends BaseException
{
    constructor( Message )
    {
        super( 'InvalidFieldException', Message );
    }
}

export class InvalidFieldValueException extends BaseException
{
    constructor( Message )
    {
        super( 'InvalidFieldValueException', Message );
    }
}


export class InvalidFieldPropertyException extends BaseException
{
    constructor( Message )
    {
        super( 'InvalidFieldPropertyException', Message );
    }
}

export class FieldBase
{
    /*ErrorStrings*/
    static __UNSUPPORTED_TYPE__ = 'Unsupported type {} in field {}{}. Expected {}.';
    static __UNKNOWN_METHOD__ = 'Unknown method {} of field {} .';
    static __NO_NAME__ = 'A given field has no name property';
    /*Class Constant*/
    static __IS_ANY__ = 0x0;
    static __IS_BOOLEAN__ = 0x1;
    static __IS_FUNCTION__ = 0x2;
    static __IS_NUMERIC__ = 0x3;
    static __IS_OBJECT__ = 0x4;
    static __IS_STRING__ = 0x5;
    static __ALLOWED_TYPES__ = [ 'any', 'boolean', 'function', 'number', 'object', 'string' ];
    /*Properties*/
    _Field;
    _BindedObject;
    _LabelGenerator;
    _GeneratedField;
    _Model;

    constructor( Field, BindedObject, Generator )
    {
        this._Field = Field;
        this._BindedObject = BindedObject;
        this._LabelGenerator = Generator;
        this._GeneratedField = {};
        this._Model = {};
    }

    __lookForPropertyAtVueObject( IsTypeOrFunction )
    {
        let Index;
        const Chunks = IsTypeOrFunction.split( '.' );
        var Self = this._BindedObject;
        if( null === Self )
        {
            return null;
        }

        for ( Index in Chunks )
        {
            if ( Chunks[ Index ] in Self )
            {
                Self = Self[ Chunks[ Index ] ];
            }
            else
            {
                return null;
                break;
            }
        }

        return Self;
    }

    _genericExecuteFuncionOrGetSomething(
        Value,
        Type,
        ReturnPureFunction = false
    )
    {
        let Self = null;
        let ValueType = FieldBase.__ALLOWED_TYPES__.indexOf( ( typeof Value ) );
        if ( -1 === ValueType )
        {
            throw new InvalidFieldValueException(
                StringHelper.format(
                    FieldBase.__UNSUPPORTED_TYPE__,
                    ValueType,
                    this._Field.name,
                    '',
                    FieldBase.__ALLOWED_TYPES__[ Type ]
                )
            );
        }

        if ( FieldBase.__IS_FUNCTION__ === ValueType )
        {
            if ( true === ReturnPureFunction )
            {
                return Value;
            }

            Value = Value( this._Field.name );
        }
        else
        {
            if ( FieldBase.__IS_STRING__ === ValueType )
            {
                if ( true === Value.includes( '.' ) )
                {
                    Self = this.__lookForPropertyAtVueObject( Value );
                    ValueType = FieldBase.__ALLOWED_TYPES__.indexOf( ( typeof Self ) );
                }
                else if ( null !== this._BindedObject && 'function' === typeof this._BindedObject[ Value ] )
                {
                    Self = this._BindedObject[ Value ];
                    ValueType = FieldBase.__IS_FUNCTION__;
                }
            }

            if ( null !== Self )
            {
                if ( FieldBase.__IS_FUNCTION__ === ValueType )
                {
                    if ( true === ReturnPureFunction )
                    {
                        return Self;
                    }

                    Value = Self( this._Field.name );
                }
            }
            else if ( true === ReturnPureFunction )
            {
                throw new InvalidFieldPropertyException(
                    StringHelper.format(
                        FieldBase.__UNKNOWN_METHOD__,
                        Value,
                        this._Field.name
                    )
                );
            }
        }

        if ( ValueType === Type || FieldBase.__IS_ANY__ === Type )
        {
            return Value;
        }

        throw new InvalidFieldValueException(
            StringHelper.format(
                FieldBase.__UNSUPPORTED_TYPE__,
                ValueType,
                this._Field.name,
                '',
                FieldBase.__ALLOWED_TYPES__[ Type ]
            )
        );
    }

    _executeFunctionOrGetString(
        Value,
        ReturnPureFunction = false
    )
    {
        return this._genericExecuteFuncionOrGetSomething(
            Value,
            FieldBase.__IS_STRING__,
            ReturnPureFunction
        );
    }

    _executeFunctionOrGetNumber(
        Value,
        ReturnPureFunction = false
    )
    {
        return this._genericExecuteFuncionOrGetSomething(
            Value,
            FieldBase.__IS_NUMERIC__,
            ReturnPureFunction
        );
    }

    _executeFunctionOrGetBool(
        Value,
        ReturnPureFunction = false
    )
    {
        return this._genericExecuteFuncionOrGetSomething(
            Value,
            FieldBase.__IS_BOOLEAN__,
            ReturnPureFunction
        );
    }

    _executeFunctionOrGetObject(
        Value,
        ReturnPureFunction = false
    )
    {
        return this._genericExecuteFuncionOrGetSomething(
            Value,
            FieldBase.__IS_OBJECT__,
            ReturnPureFunction
        );
    }

    _executeFunctionOrGetAnything(
        Value,
        ReturnPureFunction = false
    )
    {
        return this._genericExecuteFuncionOrGetSomething(
            Value,
            FieldBase.__IS_ANY__,
            ReturnPureFunction
        );
    }

    _executeFunctionOrGetArray(
        Value,
        ReturnPureFunction = false
    )
    {
        let Self = null;
        let ValueType = FieldBase.__ALLOWED_TYPES__.indexOf( ( typeof Value ) );
        if ( -1 === ValueType )
        {
            throw new InvalidFieldException(
                StringHelper.format(
                    FieldBase.__UNSUPPORTED_TYPE__,
                    ValueType,
                    this._Field.name,
                    '',
                    FieldBase.__ALLOWED_TYPES__[ Type ]
                )
            );
        }

        if ( FieldBase.__IS_FUNCTION__ === ValueType )
        {
            if ( true === ReturnPureFunction )
            {
                return Value;
            }

            Value = Value( this._Field.name );
        }
        else
        {
            if ( FieldBase.__IS_STRING__ === ValueType )
            {
                if ( true === Value.includes( '.' ) )
                {
                    Self = this.__lookForPropertyAtVueObject( Value );
                    ValueType = FieldBase.__ALLOWED_TYPES__.indexOf( ( typeof Self ) );
                }
                else if ( null !== this.__BindedObject && 'function' === typeof this.__BindedObject[ Value ] )
                {
                    Self = this._BindedObject[ Value ];
                    ValueType = FieldBase.__IS_FUNCTION__;
                }
            }

            if ( null !== Self )
            {
                if ( FieldBase.__IS_FUNCTION__ === ValueType )
                {
                    if ( true === ReturnPureFunction )
                    {
                        return Self;
                    }

                    Value = Self( this._Field.name );
                }
            }
            else if ( true === ReturnPureFunction )
            {
                throw new InvalidFieldPropertyException(
                    StringHelper.format(
                        FieldBase.__UNKNOWN_METHOD__,
                        Value,
                        this.__Field.name
                    )
                );
            }
        }

        if ( true === Array.isArray( Value ) )
        {
            return Value;
        }

        throw new InvalidFieldException(
            StringHelper.format(
                FieldBase.__UNSUPPORTED_TYPE__,
                ValueType,
                this._Field.name,
                '',
                FieldBase.__ALLOWED_TYPES__[ Type ]
            )
        );
    }

    _getStringLabelOrEmpty( Label )
    {
        let LabelValue;

        if ( true === Utils.isEmpty( Label ) )
        {
            return '';
        }
        else
        {
            if( 'function' === typeof Label )
            {
                Label = Label( this._Field.name );
            }

            LabelValue = this._LabelGenerator( Label );

            if ( true === Utils.isEmpty( LabelValue ) || Label === LabelValue )
            {
                return '';
            }
            return Label;
        }
    }

    _getStringLabelOrPlaceholder( Label )
    {
        let LabelValue;

        if ( true === Utils.isEmpty( Label ) )
        {
            return '';
        }
        else
        {
            if( 'function' === typeof Label )
            {
                Label = Label( this._Field.name );
            }

            LabelValue = this._LabelGenerator( Label );

            if ( true === Utils.isEmpty( LabelValue ) )
            {
                return Label;
            }
            else
            {
                return LabelValue;
            }
        }
    }

    __assignGeneric( FieldLabel, AssignmentLabel, AssignFunction )
    {
        if ( true === this._Field.hasOwnProperty( FieldLabel ) )
        {
            if ( 0 === AssignmentLabel.length )
            {
                this._GeneratedField[ AssignmentLabel ] = AssignFunction(
                    this._Field[ FieldLabel ]
                );
            }
            else
            {
                this._GeneratedField[ FieldLabel ] = AssignFunction(
                    this._Field[ FieldLabel ]
                );
            }
        }
    }

    _assignString( FieldLabel, AssignmentLabel = '' )
    {
        this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetString );
    }

    _assignNumeric( FieldLabel, AssignmentLabel = '' )
    {
        this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetNumber );
    }

    _assignBoolean( FieldLabel, AssignmentLabel = '' )
    {
        this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetBool );
    }

    _assignObject( FieldLabel, AssignmentLabel = '' )
    {
        this.__assignGeneric( FieldLabel, AssignmentLabel, this._executeFunctionOrGetObject );
    }

    _assignFunction( FieldLabel, AssignmentLabel = '' )
    {
        if ( true === this.__Field.hasOwnProperty( FieldLabel ) )
        {
            if ( 0 === AssignmentLabel.length )
            {
                this._GeneratedField[ AssignmentLabel ] = this._executeFunctionOrGetAnything(
                    this._Field[ FieldLabel ],
                    true
                );
            }
        }
        else
        {
            this._GeneratedField[ FieldLabel ] = this._executeFunctionOrGetAnything(
                this._Field[ FieldLabel ],
                true
            );
        }
    }

    _assignEmptyStringOrLabelString( FieldLabel, AssignmentLabel = '' )
    {
        this.__assignGeneric( FieldLabel, AssignmentLabel, this._getStringLabelOrEmpty );
    }

    _assignPlaceholderOrLabelString( FieldLabel, AssignmentLabel = '' )
    {
        this.__assignGeneric( FieldLabel, AssignmentLabel, this._getStringLabelOrPlaceholder );
    }

    _addKeyToModel( Key, Prefix = '' )
    {
        if( 0 < Prefix )
        {
            if( false === this._Model.hasOwnProperty( Prefix ) )
            {
                this._Model[ Prefix ] = {};
            }

            this._Model = this._Model[ Prefix ];
        }

        this._Model[ Key ] = '';
    }

    _addValueToModel( Key, Value )
    {
        this._Model[ Key ] = Value;
    }

    _isInModel( Key )
    {
        return this._Model.hasOwnProperty( Key );
    }
}

export class CommonOptionalAttributesAndMethods extends CommonRequiredAttributes
{
    /*ERRORS*/
    static __NO_LABEL_INSIDE_BUTTON__ = 'A insidebutton of field {} has no label.'

    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this.__addStore();
        this.__addCommonOptionalProperties();
    }

    _setAutocomplete()
    {
        if (
            true === this._Field.hasOwnProperty( 'autocomplete' )
            &&
            false === this._Field.autocomplete
        )
        {
            this._GeneratedField.autocomplete = 'off';
        }
        else
        {
            this._GeneratedField.autocomplete = 'on';
        }
    }

    __addStore()
    {
        if ( true === this._Field.hasOwnProperty( 'storesIn' ) )
        {
            if ( true === this._Field.hasOwnProperty( 'prefix' ) )
            {
                this._addKeyToModel(
                    this._Field[ 'prefix' ],
                    this._executeFunctionOrGetString( this._Field[ 'storesIn' ] )
                );
            }
            else
            {
                this._addKeyToModel( this._executeFunctionOrGetString( this._Field[ 'storesIn' ] ) );
            }
        }
        else
        {
            if ( 'prefix' in Field )
            {
                this._addKeyToModel(
                    this._Field[ 'prefix' ],
                    this._executeFunctionOrGetString( this._Field[ 'name' ] )
                );
            }
            else
            {
                this._addKeyToModel( this._executeFunctionOrGetString( this._Field[ 'name' ] ) );
            }
        }
    }

    __addVisibilityType()
    {
        this._assignBoolean( 'isVisible', 'visible' );
        this._assignBoolean( 'isDisabled', 'disabled' );
        this._assignBoolean( 'isFeatured', 'featured' );
    }

    __addMiscellaneous()
    {
        this._assignBoolean( 'isRequired', 'required' );
        this._assignString( 'defaultValue', 'default' );
        if ( this._isInModel( this._Field.name ) && true === this._GeneratedField.hasOwnProperty( 'default' ) )
        {
            this._Model._addValueToModel( this._Field.name, this._GeneratedField.default );
        }
    }

    __addStringBasedAttributes()
    {
        this._assignPlaceholderOrLabelString( 'help' );
        this._assignPlaceholderOrLabelString( 'hint' );
    }

    __addMethods()
    {
        this._assignFunction( 'setFormatter', 'set' );
        this._assignFunction( 'getFormatter', 'get' );
    }

    __addEvents()
    {
        this._assignFunction( 'afterChanged', 'onChanged' );
        this._assignFunction( 'afterValidated', 'onValidated' );
    }

    __addClass()
    {
        var Miscellaneous;
        if ( this._Field.hasOwnProperty( 'styleClasses' ) )
        {
            if ( false === Array.isArray( this._Field.styleClasses ) && 'string' !== typeof this._Field.styleClasses )
            {
                throw new InvalidFieldPropertyException(
                    StringHelper.format(
                        FieldBase.__UNSUPPORTED_TYPE__,
                        typeof this._Field.styleClasses,
                        this._Field.name,
                        ' at styleClasses property',
                        'array of strings or string'
                    )
                );

            }
            else if ( true === Array.isArray( this._Field.styleClasses ) )
            {
                for ( Miscellaneous in this._Field.styleClasses )
                {
                    if ( 'string' !== typeof this._Field.styleClasses[ Miscellaneous ] )
                    {
                        throw new InvalidFieldPropertyException(
                            StringHelper.format(
                                FieldBase.__UNSUPPORTED_TYPE__,
                                typeof this._Field.styleClasses[ Miscellaneous ],
                                this._Field.name,
                                ` at styleClasses property at Index ${Miscellaneous}`,
                                'string'
                            )
                        );
                    }
                }
            }
        }
    }

    __wrapInsideButton( InsideButton )
    {
        let Mutable;
        const GeneratedButton = {};


        GeneratedButton[ 'classes' ] = this._executeFunctionOrGetString( this._Field[ 'buttons' ]['class'] );

        if ( true === this._Field.hasOwnProperty( 'label' ) )
        {
            Mutable = this._executeFunctionOrGetString( this._Field[ 'buttons' ][' label '] );
            GeneratedButton.label = this._getStringLabelOrPlaceholder( Mutable );
        }
        else
        {
            throw new InvalidFieldPropertyException(
                StringHelper.format(
                    CommonOptionalAttributesAndMethods.__NO_LABEL_INSIDE_BUTTON__,
                    this._Field.name
                )
            );
        }

        GeneratedButton[ 'onclick' ] = this._executeFunctionOrGetAnything( this._Field[ 'buttons' ]['action'], true );
        return GeneratedButton;
    }

    __addInsideButton()
    {
        let Index, GeneratedButton, InsideButtons;
        const Buttons = [];

        if( false === this._Field.hasOwnProperty( 'buttons' ) )
        {
            return;
        }
        // eslint-disable-next-line
        InsideButtons = this._executeFunctionOrGetAnything( this._Field[ 'buttons' ] );

        if ( 'object' === typeof InsideButtons )
        {
            Buttons.push( this.__wrapInsideButton( InsideButtons ) );
        }
        else if ( true === Array.isArray( InsideButtons ) )
        {
            for ( Index in InsideButtons )
            {
                GeneratedButton = {};
                if ( 'object' === typeof InsideButtons[ Index ] )
                {
                    GeneratedButton = this.__wrapInsideButton( InsideButtons );
                    Buttons.push( GeneratedButton );
                }
                else
                {
                    throw new InvalidFieldPropertyException(
                        StringHelper.format(
                            FieldBase.__UNSUPPORTED_TYPE__,
                            typeof InsideButtons[ Index ],
                            this._Field.name,
                            'at insideButtons',
                            'array of objects or object'
                        )
                    );
                }
            }
        }
        else
        {
            throw new InvalidFieldPropertyException(
                StringHelper.format(
                    FieldBase.__UNSUPPORTED_TYPE__,
                    typeof InsideButtons,
                    this._Field.name,
                    'at insideButtons',
                    'array of objects or object'
                )
            );
        }

        this._GeneratedField.buttons = Buttons;
    }

    __addCommonOptionalProperties()
    {
        this.__addVisibilityType();
        this.__addMiscellaneous();
        this.__addInsideButton();
        this.__addStringBasedAttributes();
        this.__addMethods();
        this.__addEvents();
    }
}

export class CommonRequiredAttributes extends FieldBase
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this.__addNeccesaryAttributes();
    }

    __addNeccesaryAttributes()
    {
        if ( 'class' in this._Field )
        {
            this._Field.styleClasses = this._Field.class;
            delete this._Field.class;
        }

        if ( false === this._Field.hasOwnProperty( 'name' ) )
        {
            throw new InvalidFieldException( FieldBase.__NO_NAME__ );
        }

        // common required properties
        if ( true === this._Field.hasOwnProperty( 'prefix' ) )
        {
            if ( 'string' !== this._Field.prefix )
            {
                throw new InvalidFieldException(
                    StringHelper.format(
                        FieldBase.__UNSUPPORTED_TYPE__,
                        typeof this._Field,
                        this._Field.name,
                        'at prefix',
                        'string'
                    )
                );
            }
            else
            {
                this._GeneratedField.id = `${ this._Field.prefix }_${ this._Field.name }`;
            }
        }
        else
        {
            this._GeneratedField.id = this._Field.name;
        }
    }
}
