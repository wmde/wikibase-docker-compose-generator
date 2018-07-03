import {
	CommonOptionalAttributesAndMethods,
	InvalidFieldException,
	InvalidFieldPropertyException,
	InvalidFieldValueException
} from './FieldBase';
import StringHelper from '../StringHelper';

class OptionBasedFields extends CommonOptionalAttributesAndMethods {
	/* Errors */
	static __NO_VALUES__ = 'The given field {} has no \'values\' property.';
	static __CANNOT_SWITCH_VALUES__ = 'Cannot switch from automatic field definition to manual at field {}.'

	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
	}

	__addLabel( Source, Target, Label ) {
		if ( Source.hasOwnProperty( Label ) ) {
			Target[ Label ] = this._getStringLabelOrPlaceholder( Source[ Label ] );
		}
	}

	_addValueProperty( LabelKey, ValueKey ) {
		let Mutable, GeneratedValue, ValueIndex, ValueIsString;
		const GeneratedValues = [];
		if ( this._Field.hasOwnProperty( 'values' ) === true ) {
			Mutable = this._executeFunctionOrGetArray( this._Field.values );
		} else {
			throw new InvalidFieldException(
				StringHelper.format(
					OptionBasedFields.__NO_VALUES__,
					this._Field.name
				)
			);
		}

		if ( Array.isArray( Mutable ) === false ) {
			return Mutable;
		}

		if ( typeof Mutable[ 0 ] === 'string' ) {
			ValueIsString = true;
		} else {
			ValueIsString = false;
		}

		for ( ValueIndex in Mutable ) {
			if ( typeof Mutable[ ValueIndex ] === 'string' ) {
				if ( ValueIsString === true ) {
					GeneratedValues.push( Mutable[ ValueIndex ] );
				} else {
					throw new InvalidFieldValueException(
						StringHelper.format(
							OptionBasedFields.__CANNOT_SWITCH_VALUES__,
							this._Field.name
						)
					);

				}
			} else if ( typeof Mutable[ ValueIndex ] === 'object' ) {
				if ( ValueIsString !== false ) {
					throw new InvalidFieldValueException(
						StringHelper.format(
							OptionBasedFields.__CANNOT_SWITCH_VALUES__,
							this._Field.name
						)
					);

				}

				GeneratedValue = {};
				GeneratedValue[ ValueKey ] = Mutable[ ValueIndex ][ ValueKey ];
				this.__addLabel(
					Mutable[ ValueIndex ],
					GeneratedValue,
					LabelKey
				);
				GeneratedValues.push( GeneratedValue );
			} else {
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						OptionBasedFields.__UNSUPPORTED_TYPE__,
						typeof Mutable[ ValueIndex ],
						this._Field.name,
						'at values',
						'object or string'
					)
				);
			}
		}
		return GeneratedValues;
	}

	_addOptionProperty() {
		let GeneratedProperty;
		if ( this._Field.hasOwnProperty( 'options' ) === true ) {
			GeneratedProperty = this._executeFunctionOrGetObject( this._Field.options );
		} else {
			GeneratedProperty = {};
		}

		if ( ( 'value' in GeneratedProperty ) === false ) {
			GeneratedProperty.value = 'value';
		}

		if ( ( 'name' in GeneratedProperty ) === false ) {
			GeneratedProperty.name = 'label';
		}

		return GeneratedProperty;
	}
}

export class ChoiceField extends OptionBasedFields {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'radios';
		this.__buildChoise();
	}

	__buildChoise() {
		this._GeneratedField.radiosOptions = this._addOptionProperty();
		this._GeneratedField.values = this._addValueProperty(
			this._GeneratedField.radiosOptions.name,
			this._GeneratedField.radiosOptions.value
		);
	}
}

export class SelectionField extends OptionBasedFields {

	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'select';
		this.__buildSelection();
	}

	__buildSelection() {
		this._GeneratedField.selectOptions = this._addOptionProperty();

		this._GeneratedField.selectOptions.hideNoneSelectedText = false;

		if ( this._GeneratedField.selectOptions.hasOwnProperty( 'noneSelectedText' ) === true ) {
			this._GeneratedField.selectOptions.noneSelectedText = this._getStringLabelOrPlaceholder(
				this._GeneratedField.selectOptions.noneSelectedText
			);

			if ( this._GeneratedField.selectOptions.hasOwnProperty( 'hideNoneSelectedText' ) === true ) {
				this._GeneratedField.selectOptions.hideNoneSelectedText = true;
			}
		} else {
			if ( this._GeneratedField.selectOptions.hasOwnProperty( 'hideNoneSelectedText' ) === true ) {
				this._GeneratedField.selectOptions.hideNoneSelectedText = true;
			}
		}

		this._GeneratedField.values = this._addValueProperty(
			this._GeneratedField.selectOptions.name,
			this._GeneratedField.selectOptions.value
		);

	}
}

export class CheckListField extends OptionBasedFields {
	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this._GeneratedField.type = 'checklist';
		this.__buildCheckList();
	}

	__buildCheckList() {
		if ( this._Field.hasOwnProperty( 'asList' ) ) {
			this._GeneratedField.listBox = this._executeFunctionOrGetBoolean( this._Field.asList );
		} else {
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
