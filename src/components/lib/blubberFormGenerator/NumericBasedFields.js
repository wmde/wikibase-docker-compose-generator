import CommonOptionalAttributesAndMethods from './CommonOptionalAttributesAndMethods';

class NumericBasedFields extends CommonOptionalAttributesAndMethods
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this._GeneratedField.type = 'input';
        this._GeneratedField.inputType = this._Field.type;
    }
}

export class RangeField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super(Field, BindedObject, Generator);
        this._assignBoolean( 'readonly' );
    }
}

export class MonthField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super(Field, BindedObject, Generator);
    }
}

export class WeekField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super(Field, BindedObject, Generator);
    }
}


export class DateField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super(Field, BindedObject, Generator);
    }
}

export class DateTimeLocalField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super(Field, BindedObject, Generator);
    }
}

export class TimeField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super(Field, BindedObject, Generator);
    }
}

export class NumberField extends NumericBasedFields
{
    constructor( Field, BindedObject, Generator )
    {
        super( Field, BindedObject, Generator );
        this._assignBoolean('readonly');
        this._assignEmptyStringOrLabelString('briefDescription', 'placeholder');
    }
}
