import BlubberFields from './Fields';
import Utils from '../../../Utils';
import { InvalidFieldException } from './FieldBase';
/* eslint-disable operator-linebreak */
export default class BlubberStep extends BlubberFields
{
	__Template;
	NodeSchema;

	constructor( Fields, BindedObject, Generator )
	{
		super( null, BindedObject, Generator );
		this.__Template = Fields;
		this.NodeSchema = {};
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
		let Options, Multiple, IsNewModel, Tag;
		const GeneratedStep = new BlubberFields( this.__Template.fields, this._BindedObject, this._LabelGenerator );
		GeneratedStep.build();
		if ( true === Utils.isEmpty( GeneratedStep ) )
		{
			return;
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

		this.Model = GeneratedStep.Model;
		this.Groups = GeneratedStep.Groups;
		this.Fields = GeneratedStep.Fields;

		this.NodeSchema.props = {
		    model: this.Model,
			schema: { fields: this.Fields, groups: this.Groups },
			options: Options,
			multiple: Multiple,
			isNewModel: IsNewModel,
			tag: Tag,
			ref: this.__Template.name
		};
	}

	build()
	{
		let Title, Icon, BeforeChange;

		this.__addDescription();
		this.__buildStep();

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
			throw new InvalidFieldException( BlubberStep.__NO_NAME__ );
		}

		if ( true === this.__Template.hasOwnProperty( 'beforeChange' ) )
		{
			// eslint-disable-next-line
			BeforeChange = this._executeFunctionOrGetAnything( this.__Template.beforeChange, true );
			this.NodeSchema.props.title = Title;
			this.NodeSchema.props.icon = Icon;
			this.NodeSchema.props.beforeChange = BeforeChange;
			this.NodeSchema.attr = { id: this.__Template.name };
		}
		else
		{
			this.NodeSchema.props.title = Title;
			this.NodeSchema.props.icon = Icon;
			this.NodeSchema.attr = { id: this.__Template.name };
		}
	}

	getCondition()
	{
		if (
			true === this.__Template.hasOwnProperty( 'condition' )
        &&
            true === this._executeFunctionOrGetBoolean( this.__Template.condition )
		)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
