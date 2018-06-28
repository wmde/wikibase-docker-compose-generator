import { DateTimeLocalField, DateField, MonthField, NumberField, RangeField, TimeField, WeekField } from './NumericBasedFields';
import { ColorField, HiddenField, FileField, LabelField, TextBlock, ResetField, SubmitField } from './MiscellaneousBasedFields';
import { EmailField, PasswordField, SearchField, TelField, TextField, UrlField } from './TextBasedFields';
import { CheckListField, ChoiceField, SelectionField } from './OptionBasedFields';
import {FieldBase, InvalidFieldException, InvalidFieldPropertyException} from './FieldBase';
import StringHelper from '../StringHelper';
import Utils from '../../../Utils';

export class BlubberFields extends FieldBase
{
    /*ErrorStrings*/
    static __Model_Entry_EXISTS__ = 'The given model entry of {} is allready defined.';
    static __UNKNOWN__FIELDTYPE__ = 'The given fieldtype {} of {} is unknown.';
    static __INVALID__DYNAMIC_FIED__ = 'The given field {} does not work.';
    /*Class Constant*/
    static __FIELDTYPES__ = {
        'checkbox': CheckListField,
        'checklist': CheckListField,
        'choise': ChoiceField,
        'color': ColorField,
        'date': DateField,
        'datetime-local': DateTimeLocalField,
        'email': EmailField,
        'file': FileField,
        'hidden': HiddenField,
        'label': LabelField,
        'month': MonthField,
        'number': NumberField,
        'password': PasswordField,
        'pick': CheckListField,
        'radios': ChoiceField,
        'range': RangeField,
        'reset': ResetField,
        'search': SearchField,
        'select': SelectionField,
        'submit': SubmitField,
        'tel': TelField,
        'text': TextField,
        'textarea': TextBlock,
        'textblock': TextBlock,
        'time': TimeField,
        'url': UrlField,
        'week': WeekField
    };
    /*Properties*/
    __InterimFields;
    __InterimGroups;
    __InterimModel;
    __Templates;
    Fields;
    Groups;
    Model;
    __CurrentField;

    constructor( Fields, BindedObject, Generator )
    {
        super( null, BindedObject, Generator );
        this.__Templates = Fields;
        this.Fields = [];
        this.Groups = [];
        this.Model = {};
        this.__CurrentField = null;
    }

    _addToModel()
    {
        let CurrentModelKey = this.__CurrentField.getModelKey();
        let Key, Self;

        if( true === Array.isArray( CurrentModelKey ) )
        {
            Self = this.Model;
            for( Key in CurrentModelKey )
            {
                if( false === Self.hasOwnProperty( Key ) )
                {
                    break;
                }
            }

            throw new InvalidFieldPropertyException(
                StringHelper.format(
                    BlubberFields.__Model_Entry_EXISTS__,
                    this._Field.name
                )
            );
        }
        
        this.Model = Object.assign( {}, this.__CurrentField.getModel(), this.Model);
    }

    __buildDynamicField( Index )
    {
        let GeneratedFields;
        let FieldExecution;
        let Bind = this._executeFunctionOrGetAnything(
            this.__Templates[ Index ].bind,
            true
        );

        GeneratedFields = Bind();

        if( null === GeneratedFields || 'object' !== typeof GeneratedFields )
        {
            throw new InvalidFieldException(
                StringHelper.format(
                    BlubberFields.__INVALID__DYNAMIC_FIED__,
                    this.__Templates[ Index ].bind
                )
            );
        }

        if ( true === Array.isArray( GeneratedFields ) )
        {
            FieldExecution = new BlubberFields( GeneratedFields, this._BindedObject, this._LabelGenerator );
            if( 0 < FieldExecution.Fields.length )
            {
                this.Fields = this.Fields.concat( FieldExecution.Fields );
            }

            if( 0 < FieldExecution.Groups.length )
            {
                this.Groups = this.Groups.concat( FieldExecution.Groups );
            }

            if( true === Utils.isEmpty( FieldExecution.Model ) )
            {
                throw new InvalidFieldException(
                    StringHelper.format(
                        BlubberFields.__INVALID__DYNAMIC_FIED__,
                        this.__Templates[ Index ].bind
                    )
                );
            }

            this.Model = Object.assign( {}, FieldExecution.Model, this.Model);
        }
        else
        {
            this.__Templates[ Index ] = GeneratedFields;
        }
    }

    __buildGroup( Index )
    {
        let GroupPointer = this.Groups[ this.Groups.length - 1 ];

        if ( this.__Templates[ Index ].hasOwnProperty( 'name' ) )
        {
            GroupPointer.legend = this._getStringLabelOrPlaceholder( this.__Templates[ Index ].name );
            GroupPointer.id = this.__Templates[ Index ].name;
        }
        else
        {
            throw new InvalidFieldException( FieldBase.__NO_NAME__ );
        }

        GroupPointer.fields = [];
        GroupPointer.fields = new BlubberFields(
            this.__Templates[ Index ].fields,
            this._BindedObject, this._LabelGenerator
        );
    }

    _buildFields()
    {
        let FieldIndex, Field;
        for ( FieldIndex = 0; FieldIndex < this.__Templates.length; FieldIndex++ )
        {
            if ( true === this.__Templates[ FieldIndex ].hasOwnProperty( 'bind' ) )
            {
                this.__buildDynamicField( FieldIndex );
                FieldIndex--;
                continue;
            }

            if ( true === this.__Templates[ FieldIndex ].hasOwnProperty( 'group' ) )
            {
                this.Groups.push( {} );
                this.__buildGroup( FieldIndex );
                continue;
            }

            this.__Templates[ FieldIndex ].type = this.__Templates[ FieldIndex ].type.toLowerCase();
            if( false === BlubberFields.__FIELDTYPES__.hasOwnProperty( this.__Templates[ FieldIndex ].type ) )
            {
                throw new InvalidFieldException(
                    StringHelper.format(
                        BlubberFields.__UNKNOWN__FIELDTYPE__,
                        this.__Templates[ FieldIndex ].type,
                        this.__Templates[ FieldIndex ].name
                    )
                );
            }

            Field = new BlubberFields.__FIELDTYPES__[ this.__Templates[ FieldIndex ].type ](
                this.__Templates[ FieldIndex ],
                this._BindedObject,
                this._LabelGenerator
            );

            this.Fields.push( Field );
        }
    }
}
