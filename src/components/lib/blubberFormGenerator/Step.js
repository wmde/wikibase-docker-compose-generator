import StringHelper from '../StringHelper';
import Utils from '../../../Utils';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
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

/* eslint-disable operator-linebreak */
class BlubberFields extends FieldBase {
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

	constructor( Fields, BindedObject, Generator ) {
		super( null, BindedObject, Generator );
		this.__Fields = Fields;
		this.Fields = [];
		this.Groups = [];
		this.Model = {};
	}

	__addSubModel( Field ) {
		let Self = this.Model;
		let ModelValue = Field.getModel();
		const SubModel = Field.getModelKey();

		while ( SubModel.length > 1 ) {
			if ( Self.hasOwnProperty( SubModel[ 0 ] ) === true ) {
				if ( typeof Self[ SubModel[ 0 ] ] !== 'object' ) {
					throw new InvalidFieldPropertyException(
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
			if ( this.Model.hasOwnProperty( CurrentModelKey ) ) {
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
		let FieldExecution;
		const Bind = this._executeFunctionOrGetAnything(
			this.__Fields[ Index ].bind,
			true
		);
		// eslint-disable-next-line
		GeneratedFields = Bind();

		if ( GeneratedFields === null || typeof GeneratedFields !== 'object' ) {
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_DYNAMIC_FIED__,
					this.__Fields[ Index ].bind
				)
			);
		}

		if ( Array.isArray( GeneratedFields ) === true ) {
			FieldExecution = new BlubberFields(
				GeneratedFields,
				this._BindedObject,
				this._LabelGenerator
			);
			GeneratedFields.build();

			if ( Utils.isEmpty( FieldExecution.Model ) === true ) {
				throw new InvalidFieldException(
					StringHelper.format(
						BlubberFields._INVALID_SUB_MODEL__,
						this.__Fields[ Index ].bind
					)
				);
			}

			if ( FieldExecution.Fields.length > 0 ) {
				this.Fields = this.Fields.concat( FieldExecution.Fields );
			}

			if ( FieldExecution.Groups.length > 0 ) {
				this.Groups = this.Groups.concat( FieldExecution.Groups );
			}

			this.Model = Object.assign( {}, FieldExecution.Model, this.Model );

			return true;
		} else {
			this.__Fields[ Index ] = GeneratedFields;
			return false;
		}
	}

	__buildGroup( Index ) {
		const GroupPointer = this.Groups[ this.Groups.length - 1 ];
		let Generated;

		if ( this.__Fields[ Index ].hasOwnProperty( 'name' ) ) {
			GroupPointer.legend = this._getStringLabelOrPlaceholder( this.__Fields[ Index ].name );
			GroupPointer.id = this.__Fields[ Index ].name;
		} else {
			throw new InvalidFieldException( FieldBase._NO_NAME_ );
		}
		// eslint-disable-next-line
		Generated = new BlubberFields(
			this.__Fields[ Index ].group,
			this._BindedObject,
			this._LabelGenerator
		);
		Generated.build();

		if ( Utils.isEmpty( Generated.Model ) === true ) {
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields._INVALID_SUB_MODEL__,
					this.__Fields[ Index ].name
				)
			);
		}

		if ( Generated.Fields.length > 0 ) {
			GroupPointer.fields = Generated.Fields;
		}

		if ( Generated.Groups.length > 0 ) {
			GroupPointer.groups = Generated.Groups;
		}

		this.Model = Object.assign( {}, Generated.Model, this.Model );

	}

	build() {
		let FieldIndex, Field;
		for ( FieldIndex = 0; FieldIndex < this.__Fields.length; FieldIndex++ ) {
			if ( this.__Fields[ FieldIndex ].hasOwnProperty( 'bind' ) === true ) {
				if ( this.__buildDynamicField( FieldIndex ) === false ) {
					FieldIndex--;
				}

				continue;
			}

			if ( this.__Fields[ FieldIndex ].hasOwnProperty( 'group' ) === true ) {
				this.Groups.push( {} );
				this.__buildGroup( FieldIndex );
				if (
					this.__Fields[ FieldIndex ].hasOwnProperty( 'condition' ) === true
				&&
					this._executeFunctionOrGetBoolean( this.__Fields[ FieldIndex ].condition ) === false
				) {
					this.Groups.pop();
				}
				continue;
			}

			if ( typeof this.__Fields[ FieldIndex ].type === 'undefined' ) {
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
				BlubberFields._FIELDTYPES_.hasOwnProperty(
					this.__Fields[ FieldIndex ].type
				) === false ) {
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
				this.__Fields[ FieldIndex ].hasOwnProperty( 'condition' ) === true
			&&
				this._executeFunctionOrGetBoolean( this.__Fields[ FieldIndex ].condition ) === false
			) {
				continue;
			}

			this.Fields.push( Field.getGeneratedField() );
		}
	}
}

export default class BlubberStep extends BlubberFields {
	static _NO_NAME_ = 'The given fieldset has no identifier (name).';
	__Template;
	NodeSchema;
	__Condition;

	constructor( Fields, BindedObject, Generator ) {
		super( null, BindedObject, Generator );
		this.__Template = Fields;
		this.NodeSchema = { tab: {}, inner: {} };

		if ( this.__Template.hasOwnProperty( 'condition' ) === true ) {
			this.__Condition = this.__Template.condition;
		} else {
			this.__Condition = true;
		}
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

		// this.NodeSchema.schema = GeneratedStep;
		if ( this.__Template.hasOwnProperty( 'options' ) === true ) {
			Options = this.__Template.options;
		} else {
			Options = {};
		}

		if ( this.__Template.hasOwnProperty( 'isMultiple' ) === true ) {
			Multiple = this.__Template.isMultiple;
		} else {
			Multiple = false;
		}

		if ( this.__Template.hasOwnProperty( 'isNewModel' ) === true ) {
			IsNewModel = this.__Template.isNewModel;
		} else {
			IsNewModel = false;
		}

		if ( this.__Template.hasOwnProperty( 'tag' ) === true ) {
			Tag = this.__Template.tag;
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

		if ( this.Fields.length > 0 ) {
			Schema.fields = this.Fields;
		}

		if ( this.Groups.length > 0 ) {
			Schema.groups = this.Groups;
		}

		if ( this.__Template.hasOwnProperty( 'beforeChange' ) === true ) {
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
		} else {
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

	build() {
		if ( this.__Template.hasOwnProperty( 'description' ) === true ) {
			this.__addDescription();
		}
		this.__buildStep();
	}

	getCondition() {
		return this._executeFunctionOrGetBoolean( this.__Condition );
	}
}
