import StringHelper from '../StringHelper';
import Utils from '../../../Utils';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidFieldPropertyWarning from './Exceptions/InvalidFieldPropertyWarning';
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
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';

/* eslint-disable operator-linebreak */
class BlubberFields extends FieldBase
{
	/* ErrorStrings*/
	static _MODEL_EXISTS_ = 'The given model entry of {} is allready defined.';
	static _UNKNOWN_FIELDTYPE__ = 'The given fieldtype {} of {} is unknown.';
	static _INVALID_DYNAMIC_FIELD_ = 'The given field {} does not work.';
	static _INVALID_SUB_MODEL__ = 'The generated model of field {} does not work.';
	static __INVALID_STEP_ID__ = 'The given step name {} is allready in use.';
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
	/* Properties */
	__ToWrapFields;
	Fields;
	Groups;
	Model;

	constructor( Fields, BindedObject, Generator )
	{
		super( null, BindedObject, Generator );
		this.__ToWrapFields = Fields;
		this.Fields = [];
		this.Groups = [];
		this.Model = {};
	}

	_evaluateRenderCondition( Field )
	{
		if ( true === Field.hasOwnProperty( 'renderCondition' ) )
		{
			Field.renderCondition = this._executeFunctionOrGetBoolean(
				Field.renderCondition
			);
		}
		else
		{
			Field.renderCondition = FieldBase.RenderCondition;
		}
	}

	_evaluateModelCondition( Field )
	{
		if ( true === Field.hasOwnProperty( 'modelRenderCondition' ) )
		{
			Field.modelRenderCondition = this._executeFunctionOrGetBoolean(
				Field.modelRenderCondition
			);
		}
		else
		{
			if ( false === Field.renderCondition )
			{
				Field.modelRenderCondition = FieldBase.ModelRenderCondition;
			}
			else
			{
				Field.modelRenderCondition = true;
			}
		}
	}

	__addSubModel( Field )
	{
		let Self = this.Model;
		const SubModel = Field.getModelKey();
		let ModelValue = Field.getModel();

		while ( 1 < SubModel.length )
		{
			if ( true === Self.hasOwnProperty( SubModel[ 0 ] ) )
			{
				if ( 'object' !== typeof Self[ SubModel[ 0 ] ] )
				{
                    new InvalidFieldPropertyWarning(// eslint-disable-line
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
			if ( true === this.Model.hasOwnProperty( CurrentModelKey ) )
			{
				new InvalidFieldPropertyWarning(// eslint-disable-line
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
		const FieldInsertion = [];
		const Bind = this._executeFunctionOrGetAnything(
			this.__ToWrapFields[ Index ].bind,
			true
		);
		// eslint-disable-next-line
		this._evaluateRenderCondition( this.__ToWrapFields[ Index ] );
		// eslint-disable-next-line
        this._evaluateModelCondition( this.__ToWrapFields[ Index ] );

		if (
			false === this.__ToWrapFields[ Index ].renderCondition
		&&
            false === this.__ToWrapFields[ Index ].modelRenderCondition
		)
		{
			return;
		}

		// eslint-disable-next-line
		GeneratedFields = Bind();

		if ( null === GeneratedFields || 'object' !== typeof GeneratedFields )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_DYNAMIC_FIELD_,
					this.__ToWrapFields[ Index ].bind
				)
			);
		}

		if ( true === Array.isArray( GeneratedFields ) )
		{
			FieldInsertion.push( this.__ToWrapFields.slice( 0, Index ) );
			FieldInsertion.push( GeneratedFields );
			FieldInsertion.push( this.__ToWrapFields.slice( Index + 1 ) );
			this.__ToWrapFields = FieldInsertion[ 0 ].concat(
				FieldInsertion[ 1 ],
				FieldInsertion[ 2 ]
			);
		}
		else
		{
			this.__ToWrapFields[ Index ] = GeneratedFields;
			return false;
		}
	}

	__buildGroup( Index )
	{
		const GroupPointer = {};
		let Generated;
		if ( this.__ToWrapFields[ Index ].hasOwnProperty( 'name' ) )
		{
			GroupPointer.legend = this._getStringLabelOrPlaceholder( this.__ToWrapFields[ Index ].name );
			GroupPointer.id = this.__ToWrapFields[ Index ].name;
		}
		else
		{
			throw new InvalidFieldException( FieldBase._NO_NAME_ );
		}

		// eslint-disable-next-line
		this._evaluateRenderCondition( this.__ToWrapFields[ Index ] );
		// eslint-disable-next-line
		this._evaluateModelCondition( this.__ToWrapFields[ Index ] );

		if (
			false === this.__ToWrapFields[ Index ].renderCondition
		&&
			false === this.__ToWrapFields[ Index ].modelRenderCondition
		)
		{
			return;
		}

		// eslint-disable-next-line
		Generated = new BlubberFields(
			this.__ToWrapFields[ Index ].group,
			this._BindedObject,
			this._LabelGenerator
		);
		Generated.build();

		if ( true === Utils.isEmpty( Generated.Model ) )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_SUB_MODEL__,
					this.__ToWrapFields[ Index ].name
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

		if ( true === this.__ToWrapFields[ Index ].modelRenderCondition )
		{
			this.Model = Object.assign( Generated.Model, this.Model );
		}

		if ( true === this.__ToWrapFields[ Index ].renderCondition )
		{
			this.Groups.push( GroupPointer );
		}
	}

	__buildField( Index )
	{
		let Field;

		// eslint-disable-next-line
        this._evaluateRenderCondition( this.__ToWrapFields[ Index ] );
		// eslint-disable-next-line
        this._evaluateModelCondition( this.__ToWrapFields[ Index ] );
		if (
			false === this.__ToWrapFields[ Index ].renderCondition
        &&
            false === this.__ToWrapFields[ Index ].modelRenderCondition
		)
		{
			return;
		}

		if ( 'undefined' === typeof this.__ToWrapFields[ Index ].type )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._UNKNOWN_FIELDTYPE__,
					'undefined',
					this.__ToWrapFields[ Index ].name
				)
			);
		}

		this.__ToWrapFields[ Index ].type = this.__ToWrapFields[ Index ].type.toLowerCase();

		if (
			false === BlubberFields._FIELDTYPES_.hasOwnProperty(
				this.__ToWrapFields[ Index ].type
			)
		)
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._UNKNOWN_FIELDTYPE__,
					this.__ToWrapFields[ Index ].type,
					this.__ToWrapFields[ Index ].name
				)
			);
		}
		// eslint-disable-next-line
        Field = new BlubberFields._FIELDTYPES_[ this.__ToWrapFields[ Index ].type ](
			this.__ToWrapFields[ Index ],
			this._BindedObject,
			this._LabelGenerator
		);

		if ( true === this.__ToWrapFields[ Index ].modelRenderCondition )
		{
			this.__addToModel( Field );
		}

		if ( true === this.__ToWrapFields[ Index ].renderCondition )
		{
			this.Fields.push( Field.getGeneratedField() );
		}
	}

	build()
	{
		let FieldIndex;
		for ( FieldIndex = 0; FieldIndex < this.__ToWrapFields.length; FieldIndex++ )
		{
			this._evaluateRenderCondition( this.__ToWrapFields[ FieldIndex ] );
			this._evaluateModelCondition( this.__ToWrapFields[ FieldIndex ] );

			if ( true === this.__ToWrapFields[ FieldIndex ].hasOwnProperty( 'bind' ) )
			{
				if ( false === this.__buildDynamicField( FieldIndex ) )
				{
					FieldIndex--;
				}

				continue;
			}

			if ( true === this.__ToWrapFields[ FieldIndex ].hasOwnProperty( 'group' ) )
			{
				this.__buildGroup( FieldIndex );
				continue;
			}

			this.__buildField( FieldIndex );
		}
	}
}

export default class BlubberStep extends BlubberFields
{
	static _NO_NAME_ = 'The given fieldset has no identifier (name).';
    static _INVALID_DYNAMIC_STEP_ = 'The return value of {} cannot be a valid step,';
	__Template;
	__GlobalModel;
	NodeSchema;

	constructor( Fields, BindedObject, Generator, GlobalModelReference )
	{
		super( null, BindedObject, Generator );
		this.__Template = Fields;
		this.NodeSchema = { tab: {}, inner: {} };

		this._evaluateRenderCondition( this.__Template );
		this._evaluateModelCondition( this.__Template );

		if (
			true === this.__Template.hasOwnProperty( 'bind' )
		&&
			(
				true === this.__Template.renderCondition
			||
				true === this.__Template.modelRenderCondition
			)
		)
		{
			this.__buildDynamicStep();
			this._evaluateRenderCondition( this.__Template );
			this._evaluateModelCondition( this.__Template );
		}

		this.__GlobalModel = GlobalModelReference;
	}

	__buildDynamicStep()
	{
		let GeneratedStep;
		const Bind = this._executeFunctionOrGetAnything(
			this.__Template.bind,
			true
		);

		// eslint-disable-next-line
        GeneratedStep = Bind();

		if ( null === GeneratedStep || 'object' !== typeof GeneratedStep )
		{
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberStep._INVALID_DYNAMIC_STEP_,
					this.__Template.bind
				)
			);
		}

		this.__Template = Object.assign( this.__Template, GeneratedStep );
		delete this.__Template.bind;
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

	__getOptions()
	{
		let Option;
		const StepOptions = {};
		if ( true === this.__Template.hasOwnProperty( 'options' ) )
		{
			for ( Option in this.__Template.options )
			{
				if (
					'validationErrorClass' === Option
				||
                    'validationSuccessClass' === Option
				)
				{
					StepOptions[ Option ] = this._executeFunctionOrGetString( this.__Template.options[ Option ] );
				}

				if ( 'validateAfterChanged' === Option )
				{
					StepOptions[ Option ] = this._executeFunctionOrGetBoolean( this.__Template.options[ Option ] );
				}
			}
		}

		return StepOptions;
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

		// eslint-disable-next-line
		Options = this.__getOptions();

		if ( true === this.__Template.hasOwnProperty( 'isMultiple' ) )
		{
			Multiple = this._executeFunctionOrGetBoolean( this.__Template.isMultiple );
		}
		else
		{
			Multiple = false;
		}

		if ( true === this.__Template.hasOwnProperty( 'isNewModel' ) )
		{
			IsNewModel = this._executeFunctionOrGetBoolean( this.__Template.isNewModel );
		}
		else
		{
			IsNewModel = false;
		}

		if ( true === this.__Template.hasOwnProperty( 'tag' ) )
		{
			Tag = this._executeFunctionOrGetString( this.__Template.tag );
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

		Schema.fields = this.Fields;
		Schema.groups = this.Groups;

		this.NodeSchema.inner = {
			options: Options,
			multiple: Multiple,
			isNewModel: IsNewModel,
			tag: Tag,
			schema: Schema,
			model: this.__GlobalModel
		};

		this.NodeSchema.tab = {
			title: Title,
			icon: Icon
		};

		if ( true === this.__Template.hasOwnProperty( 'beforeChange' ) )
		{
			// eslint-disable-next-line
			BeforeChange = this._executeFunctionOrGetAnything( this.__Template.beforeChange, true );
			this.NodeSchema.tab.beforeChange = BeforeChange;
		}

		if ( true === FieldBase._IdRegistry.containsId( this.__Template.name ) )
		{

			throw new InvalidFieldPropertyException(
				StringHelper.format(
					BlubberStep.__INVALID_STEP_ID__,
					this.__Template.name
				)
			);
		}

		BlubberStep._IdRegistry.addId( this.__Template.name );
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
		return this.__Template.renderCondition;
	}
}
