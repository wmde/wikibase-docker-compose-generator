import { DateTimeLocalField, DateField, MonthField, NumberField, RangeField, TimeField, WeekField } from './NumericBasedFields';
import { ColorField, HiddenField, FileField, LabelField, TextBlock, ResetField, SubmitField } from './MiscellaneousBasedFields';
import { EmailField, PasswordField, SearchField, TelField, TextField, UrlField } from './TextBasedFields';
import { CheckListField, ChoiceField, SelectionField } from './OptionBasedFields';
import { FieldBase, InvalidFieldException, InvalidFieldPropertyException } from './FieldBase';
import StringHelper from '../StringHelper';
import Utils from '../../../Utils';
import ObjectHelper from '../ObjectHelper';
/* eslint-disable operator-linebreak */

export default class BlubberFields extends FieldBase
{
	/* ErrorStrings*/
	static __MODEL_ENTRY_EXISTS__ = 'The given model entry of {} is allready defined.';
	static __UNKNOWN__FIELDTYPE__ = 'The given fieldtype {} of {} is unknown.';
	static __INVALID__DYNAMIC_FIED__ = 'The given field {} does not work.';
	static __INVALID__SUB_MODEL__ = 'The generated model of field {} does not work.';
	/* Class Constant*/
	static __FIELDTYPES__ = {
		checkbox: CheckListField,
		checklist: CheckListField,
		choise: ChoiceField,
		color: ColorField,
		date: DateField,
		'datetime-local': DateTimeLocalField,
		email: EmailField,
		file: FileField,
		hidden: HiddenField,
		label: LabelField,
		month: MonthField,
		number: NumberField,
		password: PasswordField,
		pick: CheckListField,
		radios: ChoiceField,
		range: RangeField,
		reset: ResetField,
		search: SearchField,
		select: SelectionField,
		submit: SubmitField,
		tel: TelField,
		text: TextField,
		textarea: TextBlock,
		textblock: TextBlock,
		time: TimeField,
		url: UrlField,
		week: WeekField
	};
	/* Properties*/
	__Templates;
	Fields;
	Groups;
	Model;

	constructor( Fields, BindedObject, Generator )
	{
		super( null, BindedObject, Generator );
		this.__Templates = Fields;
		this.Fields = [];
		this.Groups = [];
		this.Model = {};
	}

	__addToModel( Field )
	{
		//const CurrentModelKey = Field.getModelKey();
		//let Key;

		/*if ( true === Array.isArray( CurrentModelKey ) )
		{
			for ( Key in CurrentModelKey )
			{
				if ( false === this.Model.hasOwnProperty( Key ) )
				{
					break;
				}
			}

			/*throw new InvalidFieldPropertyException(
				StringHelper.format(
					BlubberFields.__MODEL_ENTRY_EXISTS__,
                    CurrentModelKey
				)
			);
		}*/

		this.Model = ObjectHelper.mergeObj( Field.getModel(), this.Model );
	}

	__buildDynamicField( Index )
	{
		let GeneratedFields;
		let FieldExecution;
		const Bind = this._executeFunctionOrGetAnything(
			this.__Templates[ Index ].bind,
			true
		);
		// eslint-disable-next-line
		GeneratedFields = Bind();

		if ( null === GeneratedFields || 'object' !== typeof GeneratedFields )
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
			GeneratedFields.build();

			if ( true === Utils.isEmpty( FieldExecution.Model ) )
			{
				throw new InvalidFieldException(
					StringHelper.format(
						BlubberFields.__INVALID__SUB_MODEL__,
						this.__Templates[ Index ].bind
					)
				);
			}

			if ( 0 < FieldExecution.Fields.length )
			{
				this.Fields = this.Fields.concat( FieldExecution.Fields );
			}

			if ( 0 < FieldExecution.Groups.length )
			{
				this.Groups = this.Groups.concat( FieldExecution.Groups );
			}

			this.Model = ObjectHelper.mergeObj( FieldExecution.Model, this.Model );

			return true;
		}
		else
		{
			this.__Templates[ Index ] = GeneratedFields;
			return false;
		}
	}

	__buildGroup( Index )
	{
		const GroupPointer = this.Groups[ this.Groups.length - 1 ];
		let Generated;

		if ( this.__Templates[ Index ].hasOwnProperty( 'name' ) )
		{
			GroupPointer.legend = this._getStringLabelOrPlaceholder( this.__Templates[ Index ].name );
			GroupPointer.id = this.__Templates[ Index ].name;
		}
		else
		{
			throw new InvalidFieldException( FieldBase.__NO_NAME__ );
		}
		// eslint-disable-next-line
		Generated = new BlubberFields(
			this.__Templates[ Index ].fields,
			this._BindedObject, this._LabelGenerator
		);
		Generated.build();

		if ( true === Utils.isEmpty( Generated.Model ) )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields.__INVALID__SUB_MODEL__,
					this.__Templates[ Index ].name
				)
			);
		}

		if ( 0 < Generated.Fields.length )
		{
			GroupPointer.fields = Generated.Fields;
		}

		if ( 0 < Generated.Groups.length )
		{
			GroupPointer.groups = Generated.Groups;
		}

		this.Model = ObjectHelper.mergeObj( Generated.Model, this.Model );

	}

	build()
	{
		let FieldIndex, Field;
		for ( FieldIndex = 0; FieldIndex < this.__Templates.length; FieldIndex++ )
		{
			if ( true === this.__Templates[ FieldIndex ].hasOwnProperty( 'bind' ) )
			{
				if ( false === this.__buildDynamicField( FieldIndex ) )
				{
					FieldIndex--;
				}

				continue;
			}

			if ( true === this.__Templates[ FieldIndex ].hasOwnProperty( 'group' ) )
			{
				this.Groups.push( {} );
				this.__buildGroup( FieldIndex );
				if (
					true === this.__Templates[ FieldIndex ].hasOwnProperty( 'condition' )
				&&
					true === this._executeFunctionOrGetBool( this.__Templates[ FieldIndex ].condition )
				)
				{
					this.Groups.pop();
				}
				continue;
			}

			this.__Templates[ FieldIndex ].type = this.__Templates[ FieldIndex ].type.toLowerCase();
			if ( false === BlubberFields.__FIELDTYPES__.hasOwnProperty( this.__Templates[ FieldIndex ].type ) )
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

			this.__addToModel( Field );

			if (
				true === this.__Templates[ FieldIndex ].hasOwnProperty( 'condition' )
			&&
				true === this._executeFunctionOrGetBool( this.__Templates[ FieldIndex ].condition )
			)
			{
				continue;
			}

			this.Fields.push( Field );
		}

	}
}
