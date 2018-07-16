import CommonOptionalAttributesAndMethods from './CommonOptionalAttributesAndMethods';
import InvalidFieldException from './Exceptions/InvalidFieldException';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
import InvalidFieldValueException from './Exceptions/InvalidFieldValueException';
import StringHelper from '../StringHelper';

export default class OptionBasedFields extends CommonOptionalAttributesAndMethods {
	/* Errors */
	static _NO_VALUES_ = 'The given field {} has no \'values\' property.';
	static _CANNOT_VALUES_ = 'Cannot switch from automatic field definition to manual at field {}.'

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
					OptionBasedFields._NO_VALUES_,
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
							OptionBasedFields._CANNOT_VALUES_,
							this._Field.name
						)
					);

				}
			} else if ( typeof Mutable[ ValueIndex ] === 'object' ) {
				if ( ValueIsString !== false ) {
					throw new InvalidFieldValueException(
						StringHelper.format(
							OptionBasedFields._CANNOT_VALUES_,
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
						OptionBasedFields._UNSUPPORTED_TYPE_,
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
