import OptionBase from '../OptionBase';

export default class ChoiceField extends OptionBase
{
	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'radios';
		this.__buildChoise();
	}

	__buildChoise()
	{
		this._GeneratedField.radiosOptions = this._addOptionProperty();
		this._GeneratedField.values = this._addValueProperty(
			this._GeneratedField.radiosOptions.name,
			this._GeneratedField.radiosOptions.value
		);
	}
}
