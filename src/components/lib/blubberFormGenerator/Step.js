import StringHelper from '../StringHelper';
import Utils from '../../../Utils';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
import FieldBase from './FieldBase';
import ButtonField from './Fields/ButtonField';
import CheckBoxField from './Fields/CheckBoxField';
import CheckListField from './Fields/CheckListField';
import ChoiceField from './Fields/ChoiceField';
import ColorField from './Fields/ColorField';
import DateField from './Fields/DateField';
import DateTimeLocalField from './Fields/DateTimeLocalField';
import EmailField from './Fields/EmailField';
import FileUploadField from './Fields/FileUploadField';
import HiddenField from './Fields/HiddenField';
import ImageField from './Fields/ImageButtonField';
import LabelField from './Fields/LabelField';
import MonthField from './Fields/MonthField';
import NumberField from './Fields/NumberField';
import PasswordField from './Fields/PasswordField';
import RangeField from './Fields/RangeField';
import ResetField from './Fields/ResetField';
import SearchField from './Fields/SearchField';
import SelectionField from './Fields/SelectionField';
import SubmitField from './Fields/SubmitField';
import SubmitButtonField from './Fields/SubmitButtonField';
import TelField from './Fields/TelField';
import TextArea from './Fields/TextArea';
import TextField from './Fields/TextField';
import TimeField from './Fields/TimeField';
import UrlField from './Fields/UrlField';
import WeekField from './Fields/WeekField';

/* eslint-disable operator-linebreak */
class BlubberFields extends FieldBase
{
	/* ErrorStrings*/
	static _MODEL_EXISTS_ = 'The given model entry of {} is allready defined.';
	static _UNKNOWN_FIELDTYPE__ = 'The given fieldtype {} of {} is unknown.';
	static _INVALID_DYNAMIC_FIED__ = 'The given field {} does not work.';
	static _INVALID_SUB_MODEL__ = 'The generated model of field {} does not work.';
	/* Class Constant*/
	static _FIELDTYPES_ = {
		button: ButtonField,
		checkbox: CheckBoxField,
		checklist: CheckListField,
		choice: ChoiceField,
		color: ColorField,
		date: DateField,
		'datetime-local': DateTimeLocalField,
		email: EmailField,
		file: FileUploadField,
		hidden: HiddenField,
		image: ImageField,
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
		submitButton: SubmitButtonField,
		tel: TelField,
		text: TextField,
		textarea: TextArea,
		textblock: TextArea,
		time: TimeField,
		upload: FileUploadField,
		url: UrlField,
		week: WeekField
	};
	/* Properties*/
	__Fields;
	Fields;
	Groups;
	Model;

	constructor( Fields, BindedObject, Generator )
	{
		super( null, BindedObject, Generator );
		this.__Fields = Fields;
		this.Fields = [];
		this.Groups = [];
		this.Model = {};
	}

	__addSubModel( Field )
	{
		let Self = this.Model;
		let ModelValue = Field.getModel();
		const SubModel = Field.getModelKey();

		while ( 1 < SubModel.length )
		{
			if ( true === Self.hasOwnProperty( SubModel[ 0 ] ) )
			{
				if ( 'object' !== typeof Self[ SubModel[ 0 ] ] )
				{
					throw new InvalidFieldPropertyException(
						StringHelper.format(
							BlubberFields._MODEL_EXISTS_,
							Field.getModelKey().join( '' )
						)
					);
				}

				Self = Self[ SubModel[ 0 ] ];
			}
			else
			{
				Self[ SubModel[ 0 ] ] = {};
				Self = Self[ SubModel[ 0 ] ];
			}

			ModelValue = ModelValue[ SubModel[ 0 ] ];
			SubModel.shift();
		}
		Self[ SubModel[ 0 ] ] = ModelValue[ SubModel[ 0 ] ];
	}

	__addToModel( Field )
	{
		const CurrentModelKey = Field.getModelKey();

		if ( true === Array.isArray( CurrentModelKey ) )
		{
			this.__addSubModel( Field );
		}
		else
		{
			if ( this.Model.hasOwnProperty( CurrentModelKey ) )
			{
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						BlubberFields._MODEL_EXISTS_,
						CurrentModelKey
					)
				);
			}
			this.Model = Object.assign( {}, Field.getModel(), this.Model );
		}
	}

	__buildDynamicField( Index )
	{
		let GeneratedFields;
		let FieldExecution;
		const Bind = this._executeFunctionOrGetAnything(
			this.__Fields[ Index ].bind,
			true
		);
		// eslint-disable-next-line
		GeneratedFields = Bind();

		if ( null === GeneratedFields || 'object' !== typeof GeneratedFields )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_DYNAMIC_FIED__,
					this.__Fields[ Index ].bind
				)
			);
		}

		if ( true === Array.isArray( GeneratedFields ) )
		{
			FieldExecution = new BlubberFields(
				GeneratedFields,
				this._BindedObject,
				this._LabelGenerator
			);
			GeneratedFields.build();

			if ( true === Utils.isEmpty( FieldExecution.Model ) )
			{
				throw new InvalidFieldException(
					StringHelper.format(
						BlubberFields._INVALID_SUB_MODEL__,
						this.__Fields[ Index ].bind
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

			this.Model = Object.assign( {}, FieldExecution.Model, this.Model );

			return true;
		}
		else
		{
			this.__Fields[ Index ] = GeneratedFields;
			return false;
		}
	}

	__buildGroup( Index )
	{
		const GroupPointer = this.Groups[ this.Groups.length - 1 ];
		let Generated;

		if ( this.__Fields[ Index ].hasOwnProperty( 'name' ) )
		{
			GroupPointer.legend = this._getStringLabelOrPlaceholder( this.__Fields[ Index ].name );
			GroupPointer.id = this.__Fields[ Index ].name;
		}
		else
		{
			throw new InvalidFieldException( FieldBase._NO_NAME_ );
		}
		// eslint-disable-next-line
		Generated = new BlubberFields(
			this.__Fields[ Index ].group,
			this._BindedObject,
			this._LabelGenerator
		);
		Generated.build();

		if ( true === Utils.isEmpty( Generated.Model ) )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_SUB_MODEL__,
					this.__Fields[ Index ].name
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

		this.Model = Object.assign( {}, Generated.Model, this.Model );

	}

	build()
	{
		let FieldIndex, Field;
		for ( FieldIndex = 0; FieldIndex < this.__Fields.length; FieldIndex++ )
		{
			if ( true === this.__Fields[ FieldIndex ].hasOwnProperty( 'bind' ) )
			{
				if ( false === this.__buildDynamicField( FieldIndex ) )
				{
					FieldIndex--;
				}

				continue;
			}

			if ( true === this.__Fields[ FieldIndex ].hasOwnProperty( 'group' ) )
			{
				this.Groups.push( {} );
				this.__buildGroup( FieldIndex );
				if (
					true === this.__Fields[ FieldIndex ].hasOwnProperty( 'condition' )
				&&
					false === this._executeFunctionOrGetBoolean( this.__Fields[ FieldIndex ].condition )
				)
				{
					this.Groups.pop();
				}
				continue;
			}

			if ( 'undefined' === typeof this.__Fields[ FieldIndex ].type )
			{
				throw new InvalidFieldException(
					StringHelper.format(
						BlubberFields._UNKNOWN_FIELDTYPE__,
						'undefined',
						this.__Fields[ FieldIndex ].name
					)
				);
			}

			this.__Fields[ FieldIndex ].type = this.__Fields[ FieldIndex ].type.toLowerCase();

			if (
				false === BlubberFields._FIELDTYPES_.hasOwnProperty(
					this.__Fields[ FieldIndex ].type
				) )
			{
				throw new InvalidFieldException(
					StringHelper.format(
						BlubberFields._UNKNOWN_FIELDTYPE__,
						this.__Fields[ FieldIndex ].type,
						this.__Fields[ FieldIndex ].name
					)
				);
			}

			Field = new BlubberFields._FIELDTYPES_[ this.__Fields[ FieldIndex ].type ](
				this.__Fields[ FieldIndex ],
				this._BindedObject,
				this._LabelGenerator
			);

			this.__addToModel( Field );

			if (
				true === this.__Fields[ FieldIndex ].hasOwnProperty( 'condition' )
			&&
				false === this._executeFunctionOrGetBoolean( this.__Fields[ FieldIndex ].condition )
			)
			{
				continue;
			}

			this.Fields.push( Field.getGeneratedField() );
		}
	}
}

export default class BlubberStep extends BlubberFields
{
	static _NO_NAME_ = 'The given fieldset has no identifier (name).';
	__Template;
	NodeSchema;
	__Condition;

	constructor( Fields, BindedObject, Generator )
	{
		super( null, BindedObject, Generator );
		this.__Template = Fields;
		this.NodeSchema = { tab: {}, inner: {} };

		if ( true === this.__Template.hasOwnProperty( 'condition' ) )
		{
			this.__Condition = this.__Template.condition;
		}
		else
		{
			this.__Condition = true;
		}
	}

	__addDescription()
	{
		const DescriptionText = this._getStringLabelOrPlaceholder(
			this.__Template.description
		);
		const DescriptionClass = this._getStringLabelOrEmpty( this.__Template.descriptionClass );

		if ( false === Utils.isEmpty( this.__Template.description ) )
		{
			this.NodeSchema.description = {
				attr: {
					'class': DescriptionClass,
					id: this.__Template.description
				},
				domProps: {
					innerHTML: DescriptionText
				}
			};
		}
	}

	__buildStep()
	{
		let Options, Multiple, IsNewModel, Tag, Title, Icon, BeforeChange;
		const GeneratedStep = new BlubberFields(
			this.__Template.fields,
			this._BindedObject,
			this._LabelGenerator
		);
		const Schema = {};
		if ( true === this.__Template.hasOwnProperty( 'fields' ) )
		{
			GeneratedStep.build();
		}

		// this.NodeSchema.schema = GeneratedStep;
		if ( true === this.__Template.hasOwnProperty( 'options' ) )
		{
			Options = this.__Template.options;
		}
		else
		{
			Options = {};
		}

		if ( true === this.__Template.hasOwnProperty( 'isMultiple' ) )
		{
			Multiple = this.__Template.isMultiple;
		}
		else
		{
			Multiple = false;
		}

		if ( true === this.__Template.hasOwnProperty( 'isNewModel' ) )
		{
			IsNewModel = this.__Template.isNewModel;
		}
		else
		{
			IsNewModel = false;
		}

		if ( true === this.__Template.hasOwnProperty( 'tag' ) )
		{
			Tag = this.__Template.tag;
		}
		else
		{
			Tag = 'fieldset';
		}

		if ( true === this.__Template.hasOwnProperty( 'label' ) )
		{
			Title = this._getStringLabelOrPlaceholder(
				this._executeFunctionOrGetString( this.__Template.label )
			);
		}
		else
		{
			Title = this._getStringLabelOrPlaceholder(
				this._executeFunctionOrGetString( this.__Template.name )
			);
		}

		if ( true === this.__Template.hasOwnProperty( 'icon' ) )
		{
			Icon = this._executeFunctionOrGetString( this.__Template.icon );
		}
		else
		{
			Icon = '';
		}

		if ( false === this.__Template.hasOwnProperty( 'name' ) )
		{
			throw new InvalidFieldException( BlubberStep._NO_NAME_ );
		}

		this.Model = GeneratedStep.Model;
		this.Groups = GeneratedStep.Groups;
		this.Fields = GeneratedStep.Fields;

		if ( 0 < this.Fields.length )
		{
			Schema.fields = this.Fields;
		}

		if ( 0 < this.Groups.length )
		{
			Schema.groups = this.Groups;
		}

		if ( true === this.__Template.hasOwnProperty( 'beforeChange' ) )
		{
			// eslint-disable-next-line
			BeforeChange = this._executeFunctionOrGetAnything( this.__Template.beforeChange, true );
			this.NodeSchema.inner = {
				// schema: Schema,
				options: Options,
				multiple: Multiple,
				isNewModel: IsNewModel,
				tag: Tag
			};
			this.NodeSchema.tab = {
				title: Title,
				icon: Icon,
				beforeChange: BeforeChange
			};
		}
		else
		{
			this.NodeSchema.inner = {
				// schema: Schema,
				options: Options,
				multiple: Multiple,
				isNewModel: IsNewModel,
				tag: Tag,
				title: Title,
				icon: Icon
			};
			this.NodeSchema.tab = {
				title: Title,
				icon: Icon
			};
		}
		this.NodeSchema.attr = { id: this.__Template.name };
		this.NodeSchema.ref = this.__Template.name;
	}

	build()
	{
		if ( true === this.__Template.hasOwnProperty( 'description' ) )
		{
			this.__addDescription();
		}
		this.__buildStep();
	}

	getCondition()
	{
		return this._executeFunctionOrGetBoolean( this.__Condition );
	}
}
