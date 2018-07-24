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
class BlubberFields extends FieldBase {
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

	constructor( Fields, BindedObject, Generator ) {
		super( null, BindedObject, Generator );
		this.__ToWrapFields = Fields;
		this.Fields = [];
		this.Groups = [];
		this.Model = {};
	}

	_evaluateRenderCondition( Field ) {
		if ( Field.hasOwnProperty( 'renderCondition' ) === true ) {
			Field.renderCondition = this._executeFunctionOrGetBoolean(
				Field.renderCondition
			);
		} else {
			Field.renderCondition = FieldBase.RenderCondition;
		}
	}

	_evaluateModelCondition( Field ) {
		if ( Field.hasOwnProperty( 'modelRenderCondition' ) === true ) {
			Field.modelRenderCondition = this._executeFunctionOrGetBoolean(
				Field.modelRenderCondition
			);
		} else {
			if ( Field.renderCondition === false ) {
				Field.modelRenderCondition = FieldBase.ModelRenderCondition;
			} else {
				Field.modelRenderCondition = true;
			}
		}
	}

	__addSubModel( Field ) {
		let Self = this.Model;
		const SubModel = Field.getModelKey();
		let ModelValue = Field.getModel();

		while ( SubModel.length > 1 ) {
			if ( Self.hasOwnProperty( SubModel[ 0 ] ) === true ) {
				if ( typeof Self[ SubModel[ 0 ] ] !== 'object' ) {
                    new InvalidFieldPropertyWarning(// eslint-disable-line
						StringHelper.format(
							BlubberFields._MODEL_EXISTS_,
							Field.getModelKey().join( '' )
						)
					);
				}

				Self = Self[ SubModel[ 0 ] ];
			} else {
				Self[ SubModel[ 0 ] ] = {};
				Self = Self[ SubModel[ 0 ] ];
			}

			ModelValue = ModelValue[ SubModel[ 0 ] ];
			SubModel.shift();
		}
		Self[ SubModel[ 0 ] ] = ModelValue[ SubModel[ 0 ] ];
	}

	__addToModel( Field ) {
		const CurrentModelKey = Field.getModelKey();

		if ( Array.isArray( CurrentModelKey ) === true ) {
			this.__addSubModel( Field );
		} else {
			if ( this.Model.hasOwnProperty( CurrentModelKey ) === true ) {
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

	__buildDynamicField( Index ) {
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
			this.__ToWrapFields[ Index ].renderCondition === false
		&&
            this.__ToWrapFields[ Index ].modelRenderCondition === false
		) {
			return;
		}

		// eslint-disable-next-line
		GeneratedFields = Bind();

		if ( GeneratedFields === null || typeof GeneratedFields !== 'object' ) {
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_DYNAMIC_FIELD_,
					this.__ToWrapFields[ Index ].bind
				)
			);
		}

		if ( Array.isArray( GeneratedFields ) === true ) {
			FieldInsertion.push( this.__ToWrapFields.slice( 0, Index ) );
			FieldInsertion.push( GeneratedFields );
			FieldInsertion.push( this.__ToWrapFields.slice( Index + 1 ) );
			this.__ToWrapFields = FieldInsertion[ 0 ].concat(
				FieldInsertion[ 1 ],
				FieldInsertion[ 2 ]
			);
		} else {
			this.__ToWrapFields[ Index ] = GeneratedFields;
			return false;
		}
	}

	__buildGroup( Index ) {
		const GroupPointer = {};
		let Generated;
		if ( this.__ToWrapFields[ Index ].hasOwnProperty( 'name' ) ) {
			GroupPointer.legend = this._getStringLabelOrPlaceholder( this.__ToWrapFields[ Index ].name );
			GroupPointer.id = this.__ToWrapFields[ Index ].name;
		} else {
			throw new InvalidFieldException( FieldBase._NO_NAME_ );
		}

		// eslint-disable-next-line
		this._evaluateRenderCondition( this.__ToWrapFields[ Index ] );
		// eslint-disable-next-line
		this._evaluateModelCondition( this.__ToWrapFields[ Index ] );

		if (
			this.__ToWrapFields[ Index ].renderCondition === false
		&&
			this.__ToWrapFields[ Index ].modelRenderCondition === false
		) {
			return;
		}

		// eslint-disable-next-line
		Generated = new BlubberFields(
			this.__ToWrapFields[ Index ].group,
			this._BindedObject,
			this._LabelGenerator
		);
		Generated.build();

		if ( Utils.isEmpty( Generated.Model ) === true ) {
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_SUB_MODEL__,
					this.__ToWrapFields[ Index ].name
				)
			);
		}

		if ( Generated.Fields.length > 0 ) {
			GroupPointer.fields = Generated.Fields;
		}

		if ( Generated.Groups.length > 0 ) {
			GroupPointer.groups = Generated.Groups;
		}

		if ( this.__ToWrapFields[ Index ].modelRenderCondition === true ) {
			this.Model = Object.assign( Generated.Model, this.Model );
		}

		if ( this.__ToWrapFields[ Index ].renderCondition === true ) {
			this.Groups.push( GroupPointer );
		}
	}

	__buildField( Index ) {
		let Field;

		// eslint-disable-next-line
        this._evaluateRenderCondition( this.__ToWrapFields[ Index ] );
		// eslint-disable-next-line
        this._evaluateModelCondition( this.__ToWrapFields[ Index ] );
		if (
			this.__ToWrapFields[ Index ].renderCondition === false
        &&
            this.__ToWrapFields[ Index ].modelRenderCondition === false
		) {
			return;
		}

		if ( typeof this.__ToWrapFields[ Index ].type === 'undefined' ) {
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
			BlubberFields._FIELDTYPES_.hasOwnProperty(
				this.__ToWrapFields[ Index ].type
			) === false
		) {
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

		if ( this.__ToWrapFields[ Index ].modelRenderCondition === true ) {
			this.__addToModel( Field );
		}

		if ( this.__ToWrapFields[ Index ].renderCondition === true ) {
			this.Fields.push( Field.getGeneratedField() );
		}
	}

	build() {
		let FieldIndex;
		for ( FieldIndex = 0; FieldIndex < this.__ToWrapFields.length; FieldIndex++ ) {
			this._evaluateRenderCondition( this.__ToWrapFields[ FieldIndex ] );
			this._evaluateModelCondition( this.__ToWrapFields[ FieldIndex ] );

			if ( this.__ToWrapFields[ FieldIndex ].hasOwnProperty( 'bind' ) === true ) {
				if ( this.__buildDynamicField( FieldIndex ) === false ) {
					FieldIndex--;
				}

				continue;
			}

			if ( this.__ToWrapFields[ FieldIndex ].hasOwnProperty( 'group' ) === true ) {
				this.__buildGroup( FieldIndex );
				continue;
			}

			this.__buildField( FieldIndex );
		}
	}
}

export default class BlubberStep extends BlubberFields {
	static _NO_NAME_ = 'The given fieldset has no identifier (name).';
    static _INVALID_DYNAMIC_STEP_ = 'The return value of {} cannot be a valid step,';
	__Template;
	__GlobalModel;
	NodeSchema;

	constructor( Fields, BindedObject, Generator, GlobalModelReference ) {
		super( null, BindedObject, Generator );
		this.__Template = Fields;
		this.NodeSchema = { tab: {}, inner: {} };

		this._evaluateRenderCondition( this.__Template );
		this._evaluateModelCondition( this.__Template );

		if (
			this.__Template.hasOwnProperty( 'bind' ) === true
		&&
			(
				this.__Template.renderCondition === true
			||
				this.__Template.modelRenderCondition === true
			)
		) {
			this.__buildDynamicStep();
			this._evaluateRenderCondition( this.__Template );
			this._evaluateModelCondition( this.__Template );
		}

		this.__GlobalModel = GlobalModelReference;
	}

	__buildDynamicStep() {
		let GeneratedStep;
		const Bind = this._executeFunctionOrGetAnything(
			this.__Template.bind,
			true
		);

		// eslint-disable-next-line
        GeneratedStep = Bind();

		if ( GeneratedStep === null || typeof GeneratedStep !== 'object' ) {
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

	__addDescription() {
		const DescriptionText = this._getStringLabelOrPlaceholder(
			this.__Template.description
		);
		const DescriptionClass = this._getStringLabelOrEmpty( this.__Template.descriptionClass );

		if ( Utils.isEmpty( this.__Template.description ) === false ) {
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

	__getOptions() {
		let Option;
		const StepOptions = {};
		if ( this.__Template.hasOwnProperty( 'options' ) === true ) {
			for ( Option in this.__Template.options ) {
				if (
					Option === 'validationErrorClass'
				||
                    Option === 'validationSuccessClass'
				) {
					StepOptions[ Option ] = this._executeFunctionOrGetString(
						this.__Template.options[ Option ]
					);
				}

				if ( Option === 'validateAfterChanged' ) {
					StepOptions[ Option ] = this._executeFunctionOrGetBoolean(
						this.__Template.options[ Option ]
					);
				}
			}
		}

		return StepOptions;
	}

	__buildStep() {
		let Options, Multiple, IsNewModel, Tag, Title, Icon, BeforeChange;
		const GeneratedStep = new BlubberFields(
			this.__Template.fields,
			this._BindedObject,
			this._LabelGenerator
		);
		const Schema = {};
		if ( this.__Template.hasOwnProperty( 'fields' ) === true ) {
			GeneratedStep.build();
		}

		// eslint-disable-next-line
		Options = this.__getOptions();

		if ( this.__Template.hasOwnProperty( 'isMultiple' ) === true ) {
			Multiple = this._executeFunctionOrGetBoolean( this.__Template.isMultiple );
		} else {
			Multiple = false;
		}

		if ( this.__Template.hasOwnProperty( 'isNewModel' ) === true ) {
			IsNewModel = this._executeFunctionOrGetBoolean( this.__Template.isNewModel );
		} else {
			IsNewModel = false;
		}

		if ( this.__Template.hasOwnProperty( 'tag' ) === true ) {
			Tag = this._executeFunctionOrGetString( this.__Template.tag );
		} else {
			Tag = 'fieldset';
		}

		if ( this.__Template.hasOwnProperty( 'label' ) === true ) {
			Title = this._getStringLabelOrPlaceholder(
				this._executeFunctionOrGetString( this.__Template.label )
			);
		} else {
			Title = this._getStringLabelOrPlaceholder(
				this._executeFunctionOrGetString( this.__Template.name )
			);
		}

		if ( this.__Template.hasOwnProperty( 'icon' ) === true ) {
			Icon = this._executeFunctionOrGetString( this.__Template.icon );
		} else {
			Icon = '';
		}

		if ( this.__Template.hasOwnProperty( 'name' ) === false ) {
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

		if ( this.__Template.hasOwnProperty( 'beforeChange' ) === true ) {
			// eslint-disable-next-line
			BeforeChange = this._executeFunctionOrGetAnything( this.__Template.beforeChange, true );
			this.NodeSchema.tab.beforeChange = BeforeChange;
		}

		if ( FieldBase._IdRegistry.containsId( this.__Template.name ) === true ) {

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

	build() {
		if ( this.__Template.hasOwnProperty( 'description' ) === true ) {
			this.__addDescription();
		}
		this.__buildStep();
	}

	getCondition() {
		return this.__Template.renderCondition;
	}
}
