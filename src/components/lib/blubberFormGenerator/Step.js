import Utils from '../../../Utils';
import { DateTimeLocalField, DateField, MonthField, NumberField, RangeField, TimeField, WeekField } from './NumericBasedFields';
import { ColorField, HiddenField, FileField, LabelField, TextBlock, ResetField, SubmitField } from './MiscellaneousBasedFields';
import { EmailField, PasswordField, SearchField, TelField, TextField, UrlField } from './TextBasedFields';
import { CheckListField, ChoiceField, SelectionField } from './OptionBasedFields';
import { FieldBase, InvalidFieldException } from './FieldBase';
import StringHelper from '../StringHelper';
/* eslint-disable operator-linebreak */
class BlubberFields extends FieldBase {
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

	__addToModel( Field ) {
		const CurrentModelKey = Field.getModelKey();
		let Key;

		if ( Array.isArray( CurrentModelKey ) === true ) {
			for ( Key in CurrentModelKey ) {
				if ( this.Model.hasOwnProperty( Key ) === false ) {
					break;
				}
			}

			/* throw new InvalidFieldPropertyException(
				StringHelper.format(
					BlubberFields.__MODEL_ENTRY_EXISTS__,
					CurrentModelKey
				)
			);*/
		}

		this.Model = Object.assign( {}, Field.getModel(), this.Model );
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
					BlubberFields.__INVALID__DYNAMIC_FIED__,
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
						BlubberFields.__INVALID__SUB_MODEL__,
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
			throw new InvalidFieldException( FieldBase.__NO_NAME__ );
		}
		// eslint-disable-next-line
		Generated = new BlubberFields(
			this.__Fields[ Index ].group,
			this._BindedObject, this._LabelGenerator
		);
		Generated.build();

		if ( Utils.isEmpty( Generated.Model ) === true ) {
			throw new InvalidFieldException(
				StringHelper.format(
					BlubberFields.__INVALID__SUB_MODEL__,
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

		// console.log( this.Model )
		this.Model = Object.assign( {}, Generated.Model, this.Model );
		// console.log( this.Model )

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
					this._executeFunctionOrGetBoolean( this.__Fields[ FieldIndex ].condition ) === true
				) {
					this.Groups.pop();
				}
				continue;
			}

			this.__Fields[ FieldIndex ].type = this.__Fields[ FieldIndex ].type.toLowerCase();
			if (
				BlubberFields.__FIELDTYPES__.hasOwnProperty(
					this.__Fields[ FieldIndex ].type
				) === false ) {
				throw new InvalidFieldException(
					StringHelper.format(
						BlubberFields.__UNKNOWN__FIELDTYPE__,
						this.__Fields[ FieldIndex ].type,
						this.__Fields[ FieldIndex ].name
					)
				);
			}

			Field = new BlubberFields.__FIELDTYPES__[ this.__Fields[ FieldIndex ].type ](
				this.__Fields[ FieldIndex ],
				this._BindedObject,
				this._LabelGenerator
			);

			this.__addToModel( Field );

			if (
				this.__Fields[ FieldIndex ].hasOwnProperty( 'condition' ) === true
				&&
				this._executeFunctionOrGetBoolean( this.__Fields[ FieldIndex ].condition ) === true
			) {
				continue;
			}

			this.Fields.push( Field.getGeneratedField() );
		}
	}
}
export default class BlubberStep extends BlubberFields {
	static __NO_NAME__ = 'The given fieldset has no identifier (name).';
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
			this.__Condition = false;
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
			throw new InvalidFieldException( BlubberStep.__NO_NAME__ );
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
				model: this.Model,
				schema: Schema,
				options: Options,
				multiple: Multiple,
				isNewModel: IsNewModel,
				tag: Tag,
				ref: this.__Template.name
			};
			this.NodeSchema.tab = {
				title: Title,
				icon: Icon,
				beforeChange: BeforeChange
			};
		} else {
			this.NodeSchema.inner = {
				model: this.Model,
				schema: Schema,
				options: Options,
				multiple: Multiple,
				isNewModel: IsNewModel,
				tag: Tag,
				title: Title,
				icon: Icon,
				ref: this.__Template.name
			};
			this.NodeSchema.tab = {
				title: Title,
				icon: Icon
			};
		}
		this.NodeSchema.attr = { id: this.__Template.name };
	}

	build() {
		this.__addDescription();
		this.__buildStep();
	}

	getCondition() {
		return this._executeFunctionOrGetBoolean( this.__Condition );
	}
}
