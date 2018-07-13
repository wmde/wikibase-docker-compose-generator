import OptionBase from '../OptionBase';

export default class SelectionField extends OptionBase
{

	constructor( Field, BindedObject, Generator )
	{
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'select';
		this.__buildSelection();
	}

	__buildSelection()
	{
		this._GeneratedField.selectOptions = this._addOptionProperty();

		this._GeneratedField.selectOptions.hideNoneSelectedText = false;

		if ( true === this._GeneratedField.selectOptions.hasOwnProperty( 'noneSelectedText' ) )
		{
			this._GeneratedField.selectOptions.noneSelectedText = this._getStringLabelOrPlaceholder(
				this._GeneratedField.selectOptions.noneSelectedText
			);

			if ( true === this._GeneratedField.selectOptions.hasOwnProperty( 'hideNoneSelectedText' ) )
			{
				this._GeneratedField.selectOptions.hideNoneSelectedText = true;
			}
		}
		else
		{
			if ( true === this._GeneratedField.selectOptions.hasOwnProperty( 'hideNoneSelectedText' ) )
			{
				this._GeneratedField.selectOptions.hideNoneSelectedText = true;
			}
		}

		this._GeneratedField.values = this._addValueProperty(
			this._GeneratedField.selectOptions.name,
			this._GeneratedField.selectOptions.value
		);

	}
}
