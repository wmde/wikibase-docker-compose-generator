/* eslint-disable operator-linebreak */
import { CommonOptionalAttributesAndMethods } from './Base';

class TextBasedFields extends CommonOptionalAttributesAndMethods
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this._GeneratedField.type = 'input';
        this._GeneratedField.inputType = this._Field.type;
        this.__addTextBasedAttributes();
    }

    __addTextBasedAttributes()
    {
        this._assignBoolean( 'readonly' );
        this._setAutocomplete();
        this._assignNumeric( 'maximum', 'maxlength' );
        this._assignString( 'pattern' );
        this._assignEmptyStringOrLabelString( 'briefDescription', 'placeholder');
        this.__assignOptionalFieldNumeric( 'size' );
    }
}

class TextIputFields extends TextBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this._assignString( 'getValuesFromList', 'list' );
    }
}

export class TextField extends TextIputFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this._assignString( 'dir' );
    }
}

export class SearchField extends TextField
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
    }
}

export class UrlField extends TextIputFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
    }
}

export class TelField extends TextIputFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
    }
}

export class EmailField extends TextIputFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this._assignBoolean( 'multipleInput', 'multiple' );
        if ( this._GeneratedField.hasOwnProperty( 'multiple' ) )
        {
            this._GeneratedField.multi = this._GeneratedField.multiple;
            this._fieldTakesMultibleValues();
        }
    }
}

export class PasswordField extends TextBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
    }
}
