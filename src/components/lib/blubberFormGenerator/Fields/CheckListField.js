import OptionBase from '../OptionBase';

export default class CheckListField extends OptionBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'checklist';
		this.__buildCheckList();
	}

	__buildCheckList()
	{
		if ( this._Field.hasOwnProperty( 'asList' ) )
		{
			this._GeneratedField.listBox = this._executeFunctionOrGetBoolean( this._Field.asList );
		}
		else
		{
			this._GeneratedField.listBox = false;
			this._setAutocomplete();
		}

		this._GeneratedField.multi = this._GeneratedField.multiple;
		this._fieldTakesMultibleValues();

		this._GeneratedField.checklistOptions = this._addOptionProperty();
		this._GeneratedField.values = this._addValueProperty(
			this._GeneratedField.checklistOptions.name,
			this._GeneratedField.checklistOptions.value
		);
	}
}
