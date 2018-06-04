<script>
import Vue from 'vue';
import VueFormGenerator from 'vue-form-generator';
import VueFormWizard from 'vue-form-wizard';
import 'vue-form-wizard/dist/vue-form-wizard.min.css';

Vue.use( VueFormWizard );
Vue.use( VueFormGenerator );

class BaseException {
	constructor( Name, Message ) {
		this.Name = Name;
		this.Message = Message;
	}
}

class InvalidFieldException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldException', Message );
	}
}

class InvalidFieldPropertyException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldPropertyException', Message );
	}
}

class InvalidFieldValueException extends BaseException {
	constructor( Message ) {
		super( 'InvalidFieldValueException', Message );
	}
}

class TypeErrorException extends BaseException {
	constructor( Message ) {
		super( 'TypeErrorException', Message );
	}
}

const ErrorMessages = {
	UNKNOWN_METHOD_OR_PROPERTY: 'Unknown method or property {} of field {} .',
	UNKNOWN_METHOD: 'Unknown method {} of field {} .',
	UNSUPPORTED_TYPE: 'Unsupported type {} in field {}{}. Expected {}.',
	UNKNOWN_FIELDTYPE: 'Unknown fieldtype {} of field {} .',
	NO_VALUES: 'The given field {} has no \'values\' property.',
	CANNOT_SWITCH_VALUES: 'Cannot switch from automatic field definition to manual at field {}.',
	NO_LABEL_INSIDE_BUTTON: 'A insidebutton of field {} has no label.',
	NO_NAME: 'A given field has no name property',
	IVALID_TOP_ITEM: 'Invalid {} got {}, expected {}.'
};

Vue.mixin( {
//    components: { FormWizard, TabContent },
	methods:
	{
		__genericExecuteFuncionOrGetSomething: function (
			IsTypeOrFunction,
			Type,
			FieldName,
			ReturnPureFunction = false
		) {
			let Chunks, Self, Index;
			if ( typeof IsTypeOrFunction === 'function' ) {
				if ( ReturnPureFunction === true ) {
					return IsTypeOrFunction;
				}

				IsTypeOrFunction = IsTypeOrFunction( FieldName );
			} else {
				Self = this;
				if ( typeof IsTypeOrFunction === 'string' ) {
					if ( IsTypeOrFunction.includes( '.' ) === true ) {
						Chunks = IsTypeOrFunction.split( '.' );
						for ( Index in Chunks ) {
							if ( Chunks[ Index ] in Self ) {
								Self = Self[ Chunks[ Index ] ];
							} else {
								Self = null;
								break;
							}
						}
					} else if ( IsTypeOrFunction in Self && typeof Self[ IsTypeOrFunction ] === 'function' ) {
						Self = this[ IsTypeOrFunction ];
					} else {
						Self = null;
					}

					if ( Self !== null ) {
						if ( typeof Self === 'function' ) {
							if ( ReturnPureFunction === true ) {
								return Self;
							}

							IsTypeOrFunction = Self( FieldName );
						} else {
							if ( ReturnPureFunction === true ) {
								throw new InvalidFieldPropertyException(
									ErrorMessages.UNKNOWN_METHOD.format(
										IsTypeOrFunction,
										FieldName
									)
								);
							}
							IsTypeOrFunction = Self;
						}
					}
				}
			}

			if ( typeof IsTypeOrFunction === Type || Type === 'any' ) {
				return IsTypeOrFunction;
			}

			throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof IsTypeOrFunction, FieldName, '', Type ) );
		},
		__executeFunctionOrGetString: function (
			IsTypeOrFunction,
			FieldName,
			ReturnPureFunction = false
		) {
			return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'string', FieldName, ReturnPureFunction );
		},
		__executeFunctionOrGetNumber: function (
			IsTypeOrFunction,
			FieldName,
			ReturnPureFunction = false
		) {
			return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'number', FieldName, ReturnPureFunction );
		},
		__executeFunctionOrGetBool: function (
			IsTypeOrFunction,
			FieldName,
			ReturnPureFunction = false
		) {
			return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'boolean', FieldName, ReturnPureFunction );
		},
		__executeFunctionOrGetObject: function (
			IsTypeOrFunction,
			FieldName,
			ReturnPureFunction = false
		) {
			return this.__genericExecuteFuncionOrGetSomething( IsTypeOrFunction, 'object', FieldName, ReturnPureFunction );
		},
		__executeFunctionOrGetArray: function (
			IsTypeOrFunction,
			FieldName,
			ReturnPureFunction = false
		) {
			let Chunks, Self, Index;
			if ( typeof IsTypeOrFunction === 'function' ) {
				if ( ReturnPureFunction === true ) {
					return IsTypeOrFunction;
				}

				IsTypeOrFunction = IsTypeOrFunction( FieldName );
			} else {
				Self = this;
				if ( typeof IsTypeOrFunction === 'string' ) {
					if ( IsTypeOrFunction.includes( '.' ) === true ) {
						Chunks = IsTypeOrFunction.split( '.' );
						for ( Index in Chunks ) {
							if ( Chunks[ Index ] in Self ) {
								Self = Self[ Chunks[ Index ] ];
							} else {
								Self = null;
								break;
							}
						}
					} else if ( IsTypeOrFunction in Self && typeof Self[ IsTypeOrFunction ] === 'function' ) {
						Self = this[ IsTypeOrFunction ];
					}

					if ( Self !== null ) {
						if ( typeof Self === 'function' ) {
							if ( ReturnPureFunction === true ) {
								return Self;
							}

							IsTypeOrFunction = Self( FieldName );
						}
					} else {
						throw new InvalidFieldException(
							ErrorMessages.UNKNOWN_METHOD_OR_PROPERTY.format( IsTypeOrFunction, FieldName )
						);
					}
				}
			}

			if ( Array.isArray( IsTypeOrFunction ) === true ) {
				return IsTypeOrFunction;
			}

			throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof IsTypeOrFunction, FieldName, '', 'array' ) );
		},
		__getStringLabelOrEmpty: function ( LabelGenerator, Label ) {
			let LabelValue;

			if ( this.isEmpty( Label ) === true ) {
				return '';
			} else {
				LabelValue = LabelGenerator( Label );
				if ( this.isEmpty( LabelValue ) === true || Label === LabelValue ) {
					return '';
				}
				return Label;
			}
		},
		__getStringLabelOrPlaceholder: function ( LabelGenerator, Label ) {
			let LabelValue;

			if ( this.isEmpty( Label ) === true ) {
				return '';
			} else {
				LabelValue = LabelGenerator( Label );
				if ( this.isEmpty( LabelValue ) === true ) {
					return Label;
				} else {
					return LabelValue;
				}
			}
		},
		__assignOptionalFieldString: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			if ( FieldLabel in Field ) {
				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = this.__executeFunctionOrGetString(
						Field[ FieldLabel ],
						Field.name
					);
				} else {
					GeneratedField[ FieldLabel ] = this.__executeFunctionOrGetString(
						Field[ FieldLabel ],
						Field.name
					);
				}
			}
		},
		__assignOptionalFieldNumeric: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			if ( FieldLabel in Field ) {
				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = this.__executeFunctionOrGetNumber(
						Field[ FieldLabel ],
						Field.name
					);
				} else {
					GeneratedField[ FieldLabel ] = this.__executeFunctionOrGetNumber(
						Field[ FieldLabel ],
						Field.name
					);
				}
			}
		},
		__assignOptionalFieldBoolean: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			if ( FieldLabel in Field ) {
				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = this.__executeFunctionOrGetBool(
						Field[ FieldLabel ],
						Field.name
					);
				} else {
					GeneratedField[ FieldLabel ] = this.__executeFunctionOrGetBool(
						Field[ FieldLabel ],
						Field.name
					);
				}
			}
		},
		__assignOptionalFieldObject: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			if ( FieldLabel in Field ) {
				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = this.__executeFunctionOrGetObject(
						Field[ FieldLabel ],
						Field.name
					);
				} else {
					GeneratedField[ FieldLabel ] = this.__executeFunctionOrGetObject(
						Field[ FieldLabel ],
						Field.name
					);
				}
			}
		},
		__assignOptionalFieldFunction: function ( Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			let Mutable;
			if ( FieldLabel in Field ) {
				Mutable = this.__executeFunctionOrGetString( Field[ FieldLabel ], Field.name, true );
				if ( typeof Mutable !== 'function' ) {
					throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof Mutable, Field.name, '', 'function' ) );
				}

				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = Mutable;
				} else {
					GeneratedField[ FieldLabel ] = Mutable;
				}
			}
		},
		__assignOptionalEmptyStringOrLabelString: function ( LabelGenerator, Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			if ( FieldLabel in Field ) {
				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = this.__getStringLabelOrEmpty(
						LabelGenerator,
						Field[ FieldLabel ]
					);
				} else {
					GeneratedField[ FieldLabel ] = this.__getStringLabelOrEmpty(
						LabelGenerator,
						Field[ FieldLabel ]
					);
				}
			}
		},
		__assignOptionalPlaceholderOrLabelString: function ( LabelGenerator, Field, GeneratedField, FieldLabel, AssignmentLabel = '' ) {
			if ( FieldLabel in Field ) {
				if ( AssignmentLabel.length > 0 ) {
					GeneratedField[ AssignmentLabel ] = this.__getStringLabelOrPlaceholder(
						LabelGenerator,
						Field[ FieldLabel ]
					);
				} else {
					GeneratedField[ FieldLabel ] = this.__getStringLabelOrPlaceholder(
						LabelGenerator,
						Field[ FieldLabel ]
					);
				}
			}
		},
		__addAutocompleteProperty: function ( Field, GeneratedField ) {
			if ( 'autocomplete' in Field && Field.autocomplete === false ) {
				GeneratedField.autocomplete = 'off';
			} else {
				GeneratedField.autocomplete = 'on';
			}
		},
		__addTextBasedAttributes: function ( Field, GeneratedField, LabelGenerator ) {
			this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' );
			this.__addAutocompleteProperty( Field, GeneratedField );
			this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'maxlength' );
			this.__assignOptionalFieldString( Field, GeneratedField, 'pattern' );
			this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' );
			this.__assignOptionalFieldNumeric( Field, GeneratedField, 'size' );

			return GeneratedField;
		},
		__addNumericBasedAttributes: function ( Field, GeneratedField ) {
			this.__addAutocompleteProperty( Field, GeneratedField );
			this.__assignOptionalFieldString( Field, GeneratedField, 'getValuesFromList', 'list' );
			this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'max' );
			this.__assignOptionalFieldNumeric( Field, GeneratedField, 'minimum', 'min' );
			this.__assignOptionalFieldNumeric( Field, GeneratedField, 'stepSize' );
			return GeneratedField;
		},
		_buildInputField: function ( Type, Field, LabelGenerator ) {
			let GeneratedField = {};

			GeneratedField.type = 'input';
			GeneratedField.inputType = Type;
			if ( Type === 'text' || Type === 'search' || Type === 'url' || Type === 'tel' || Type === 'email' ) {
				GeneratedField = this.__addTextBasedAttributes( Field, GeneratedField );

				if ( Type === 'text' || Type === 'search' ) {
					this.__assignOptionalFieldString( Field, GeneratedField, 'dir' );
				}

				this.__assignOptionalFieldString( Field, GeneratedField, 'getValuesFromList', 'list' );

				if ( Type === 'email' ) {
					this.__assignOptionalFieldBoolean( Field, GeneratedField, 'multipleInput', 'multiple' );
					if ( 'multiple' in GeneratedField ) {
						GeneratedField.multi = GeneratedField.multiple;
					}
				}
			} else if ( Type === 'password' ) {
				GeneratedField = this.__addTextBasedAttributes( Field, GeneratedField, Field.name );
			} else if ( Type === 'file' ) {
				this.__assignOptionalFieldString( Field, GeneratedField, 'accept' );
				this.__assignOptionalFieldBoolean( Field, GeneratedField, 'multipleInput', 'multiple' );
				if ( 'multiple' in GeneratedField ) {
					GeneratedField.multi = GeneratedField.multiple;
				}
			} else if (
				Type === 'range' ||
				Type === 'month' || Type === 'time' || Type === 'week' || Type === 'date' || Type === 'datetime-local'
			) {
				GeneratedField = this.__addNumericBasedAttributes( Field, GeneratedField, Field.name );
				if ( Type !== 'range' ) {
					this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' );
				}

			} else if ( Type === 'number' ) {
				GeneratedField = this.__addNumericBasedAttributes( Field, GeneratedField, Field.name );
				this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' );
				this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' );
			} else if ( Type === 'color' ) {
				this.__addAutocompleteProperty( Field, GeneratedField );
				this.__assignOptionalFieldString( Field, GeneratedField, 'getValuesFromList', 'list' );
			} else if ( Type !== 'reset' && Type !== 'hidden' ) {
				throw new InvalidFieldException(
					ErrorMessages.UNKNOWN_FIELDTYPE.format( Type, Field.name )
				);
			}

			return GeneratedField;
		},
		__addValueProperty: function ( Field, LabelKey, ValueKey, LabelGenerator ) {
			let Mutable, ValueIndex, ValueIsString;
			const GeneratedValues = [];
			if ( 'values' in Field ) {
				Mutable = this.__executeFunctionOrGetArray( Field.values, Field.name );
			} else {
				throw new InvalidFieldException( ErrorMessages.NO_VALUES.format( Field.name ) );
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
							ErrorMessages.CANNOT_SWITCH_VALUES.format( Field.name )
						);
					}
				} else if ( typeof Mutable[ ValueIndex ] === 'object' ) {
					if ( ValueIsString !== false ) {
						throw new InvalidFieldValueException(
							ErrorMessages.CANNOT_SWITCH_VALUES.format( Field.name )
						);
					}
					const GeneratedValue = {};
					GeneratedValue[ ValueKey ] = Mutable[ ValueIndex ][ ValueKey ];
					this.__assignOptionalPlaceholderOrLabelString(
						LabelGenerator,
						Mutable[ ValueIndex ],
						GeneratedValue,
						LabelKey
					);
					GeneratedValues.push( GeneratedValue );
				} else {
					throw new InvalidFieldValueException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof Mutable[ ValueIndex ], Field.name, 'at values', 'object or string' ) );
				}
			}

			return GeneratedValues;
		},
		__addOptionProperty: function ( Field ) {
			const GeneratedProperty = {};
			this.__assignOptionalFieldObject( Field, GeneratedProperty, 'options' );

			if ( ( 'value' in GeneratedProperty ) === false ) {
				GeneratedProperty.value = 'value';
			}

			if ( ( 'name' in GeneratedProperty ) === false ) {
				GeneratedProperty.name = 'label';
			}

			return GeneratedProperty;
		},
		__addButtons: function ( Buttons, FieldName, LabelGenerator ) {
			let Index, Mutable;
			const Return = [];
			let GeneratedButton = {};

			const InsideButtons = this.__genericExecuteFuncionOrGetSomething( Buttons, 'any', FieldName );

			if ( typeof InsideButtons === 'object' ) {
				InsideButtons.name = FieldName;
				this.__assignOptionalFieldString( InsideButtons, GeneratedButton, 'class', 'classes' );

				if ( 'label' in InsideButtons ) {
					Mutable = this.__executeFunctionOrGetString( InsideButtons.label, FieldName );
					GeneratedButton.label = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable );
				} else {
					throw new InvalidFieldException(
						ErrorMessages.NO_LABEL_INSIDE_BUTTON.format( FieldName )
					);
				}

				this.__assignOptionalFieldFunction( Buttons, GeneratedButton, 'action', 'onClick' );

				return [ GeneratedButton ];
			} else if ( Array.isArray( InsideButtons ) === true ) {
				for ( Index in InsideButtons ) {
					GeneratedButton = {};
					if ( typeof InsideButtons[ Index ] === 'object' ) {
						this.__assignOptionalFieldString( InsideButtons[ Index ], GeneratedButton, 'class', 'classes' );

						if ( 'label' in Buttons ) {
							Mutable = this.__executeFunctionOrGetString(
								InsideButtons[ Index ].label,
								FieldName
							);
							GeneratedButton.label = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable );
						} else {
							throw new InvalidFieldException(
								ErrorMessages.NO_LABEL_INSIDE_BUTTON.format( FieldName )
							);
						}

						this.__assignOptionalFieldFunction( InsideButtons[ Index ], GeneratedButton, 'action', 'onClick' );
						Return.push( GeneratedButton );
					} else {
						throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof InsideButtons[ Index ], FieldName, 'at insideButtons', 'array of objects or object' ) );
					}
				}
				return Return;
			} else {
				throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof InsideButtons, FieldName, 'at insideButtons', 'array of objects or object' ) );
			}
		},
		_buildField: function ( Field, LabelGenerator ) {
			let Mutable;
			let GeneratedField = {};

			if ( 'class' in Field ) {
				Field.styleClasses = Field.class;
				delete Field.class;
			}

			// common required properties
			if ( 'prefix' in Field ) {
				if ( Field !== 'string' ) {
					throw new InvalidFieldException( ErrorMessages.UNSUPPORTED_TYPE.format( typeof Field.prefix, Field.name, 'at prefix', 'string' ) );
				}
			}

			if ( 'name' in Field ) {
				if ( 'prefix' in Field ) {
					GeneratedField.id = `${Field.prefix }.${ Field.name}`;
				} else {
					GeneratedField.id = Field.name;
				}
			} else {
				throw new InvalidFieldException( ErrorMessages.NO_NAME );
			}

			// specific  properties
			Field.type = Field.type.toLowerCase();
			if ( Field.type === 'choise' ) {
				GeneratedField.type = 'radios';
				GeneratedField.radiosOptions = this.__addOptionProperty( Field );
				GeneratedField.values = this.__addValueProperty( Field,
					GeneratedField.radiosOptions.name,
					GeneratedField.radiosOptions.value,
					LabelGenerator );
			} else if ( Field.type === 'select' ) {
				GeneratedField.type = 'select';
				GeneratedField.selectOptions = this.__addOptionProperty( Field );

				if ( 'noneSelectedText' in GeneratedField.selectOptions ) {
					GeneratedField.selectOptions.noneSelectedText = this.__getStringLabelOrPlaceholder(
						LabelGenerator,
						GeneratedField.selectOptions.noneSelectedText
					);

					if ( ( 'hideNoneSelectedText' in GeneratedField.selectOptions ) === false ) {
						GeneratedField.selectOptions.hideNoneSelectedText = false;
					}
				} else {
					if ( ( 'hideNoneSelectedText' in GeneratedField.selectOptions ) === false ) {
						GeneratedField.selectOptions.hideNoneSelectedText = true;
					}
				}

				GeneratedField.values = this.__addValueProperty( Field,
					GeneratedField.selectOptions.name,
					GeneratedField.selectOptions.value,
					LabelGenerator );
			} else if ( Field.type === 'pick' ) {
				if ( 'multipleItems' in Field && Field.multibleItems === true ) {
					GeneratedField.type = 'checklist';
					if ( 'asList' in Field ) {
						GeneratedField.listBox = this.__executeFunctionOrGetBool( Field.asList, Field.name );
					} else {
						GeneratedField.listBox = false;
					}

					GeneratedField.checklistOptions = this.__addOptionProperty( Field );
					GeneratedField.values = this.__addValueProperty( Field,
						GeneratedField.checklistOptions.name,
						GeneratedField.checklistOptions.value,
						LabelGenerator );
				} else {
					GeneratedField.type = 'checkbox';
					this.__addAutocompleteProperty( Field, GeneratedField );
				}
			} else if ( Field.type === 'textBlock' ) {
				GeneratedField.type = 'textarea';
				this.__addAutocompleteProperty( Field, GeneratedField );
				this.__assignOptionalFieldBoolean( Field, GeneratedField, 'readonly' );
				this.__assignOptionalEmptyStringOrLabelString( LabelGenerator, Field, GeneratedField, 'briefDescription', 'placeholder' );
				this.__assignOptionalFieldNumeric( Field, GeneratedField, 'maximum', 'max' );
				this.__assignOptionalFieldNumeric( Field, GeneratedField, 'minimum', 'min' );
				this.__assignOptionalFieldNumeric( Field, GeneratedField, 'rows' );
			} else if ( Field.type === 'label' ) {
				/* Do nothing cause there no special attributes */
			} else if ( Field.type === 'submit' ) {
				this.__assignOptionalFieldFunction( Field, GeneratedField, 'onSubmit' );
				this.__assignOptionalFieldBoolean( Field, GeneratedField, 'validateBeforeSubmit' );

				if ( 'label' in Field ) {
					Mutable = this.__executeFunctionOrGetString( Field.label, Field.name );
					GeneratedField.buttonText = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable );
				} else {
					GeneratedField.buttonText = this.__getStringLabelOrPlaceholder(
						LabelGenerator,
						Field.name
					);
				}

				this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isVisible', 'visible' );
				this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isDisabled', 'disabled' );

				return GeneratedField;
			} else {
				GeneratedField = Object.merge(
					GeneratedField,
					this._buildInputField( Field.type, Field, LabelGenerator )
				);
			}

			// common required properties
			if ( 'label' in Field ) {
				Mutable = this.__executeFunctionOrGetString( Field.label, Field.name );
				GeneratedField.label = this.__getStringLabelOrPlaceholder( LabelGenerator, Field.label );
			} else {
				GeneratedField.label = this.__getStringLabelOrPlaceholder( LabelGenerator, Field.name );
			}

			if ( 'storesIn' in Field ) {
				if ( 'prefix' in Field ) {
					GeneratedField.model = `${Field.prefix }.${ this.__executeFunctionOrGetString( Field.storesIn, Field.Name )}`;
				} else {
					GeneratedField.model = this.__executeFunctionOrGetString( Field.storesIn, Field.Name );
				}
			} else {
				if ( 'prefix' in Field ) {
					GeneratedField.model = `${Field.prefix }.${ Field.name}`;
				} else {
					GeneratedField.model = Field.name;
				}
			}

			// common optional properties
			this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isVisible', 'visible' );
			this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isDisabled', 'disabled' );
			this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isFeatured', 'featured' );
			this.__assignOptionalFieldBoolean( Field, GeneratedField, 'isRequired', 'required' );
			this.__assignOptionalFieldString( Field, GeneratedField, 'defaultValue', 'default' );

			if ( 'styleClasses' in Field ) {
				if ( Array.isArray( Field.styleClasses ) === false && typeof Field.styleClasses !== 'string' ) {
					throw new InvalidFieldException(
						ErrorMessages.UNSUPPORTED_TYPE.format(
							typeof Field.styleClasses,
							Field.name,
							' at styleClasses property',
							'array of strings or string' ) );
				} else if ( Array.isArray( Field.styleClasses ) === true ) {
					for ( Mutable in Field.styleClasses ) {
						if ( typeof Field.styleClasses[ Mutable ] !== 'string' ) {
							throw new InvalidFieldException(
								ErrorMessages.UNSUPPORTED_TYPE.format(
									typeof Field.styleClasses[ Mutable ],
									Field.name,
									` at styleClasses property at Index ${Mutable}`,
									'string' ) );
						}
					}
				}
			}

			this.__assignOptionalPlaceholderOrLabelString( LabelGenerator, Field, GeneratedField, 'help' );
			this.__assignOptionalPlaceholderOrLabelString( LabelGenerator, Field, GeneratedField, 'hint' );

			if ( 'buttons' in Field ) {
				GeneratedField.buttons = this.__addButtons( Field.buttons, Field.name, LabelGenerator );
			}

			this.__assignOptionalFieldFunction( Field, GeneratedField, 'setFormatter', 'set' );
			this.__assignOptionalFieldFunction( Field, GeneratedField, 'getFormatter', 'get' );
			this.__assignOptionalFieldFunction( Field, GeneratedField, 'afterChanged', 'onChanged' );
			this.__assignOptionalFieldFunction( Field, GeneratedField, 'afterValidated' );

			return GeneratedField;
		},
		_buildModel: function ( FieldModel, MultipleValues = false ) {
			let Chunks, Index;

			let Self = this.$data.blubberModel[ this.$data.currentFormId ];
			// let Self = this.$data.model

			if ( FieldModel.includes( '.' ) === true ) {
				Chunks = FieldModel.split( '.' );
				for ( Index in Chunks ) {
					if ( Chunks[ Index ] in Self ) {
						Self = Self[ Chunks[ Index ] ];
					} else {
						Self[ Chunks[ Index ] ] = {};
						Self = Self[ Chunks[ Index ] ];
					}
				}

				if ( MultipleValues === true ) {
					Self[ Chunks[ Chunks.length - 1 ] ] = [];
				} else {
					Self[ Chunks[ Chunks.length - 1 ] ] = '';
				}
			} else {
				if ( MultipleValues === true ) {
					Self[ FieldModel ] = [];
				} else {
					Self[ FieldModel ] = '';
				}
			}
		},
		_buildGroup: function ( Group, LabelGenerator ) {
			let Index, Mutable;
			const GeneratedGroup = {};
			if ( 'name' in Group ) {
				GeneratedGroup.legend = this.__getStringLabelOrPlaceholder( LabelGenerator, Group.name );
				GeneratedGroup.id = Group.name;
			} else {
				throw new InvalidFieldException( ErrorMessages.NO_NAME );
			}

			GeneratedGroup.fields = [];
			for ( Index in Group.group ) {
				if ( 'prefix' in Group && ( 'prefix' in Group.group[ Index ] ) === false ) {
					Group.fields[ Index ].prefix = Group.prefix;
				}

				Mutable = this._buildField( Group.group[ Index ], LabelGenerator );
				this._buildModel( Mutable.model );
				GeneratedGroup.fields.push( Mutable );
			}

			return GeneratedGroup;
		},
		_buildDynamicField: function ( Field, LabelGenerator ) {
			let GeneratedFields = {};
			this.__assignOptionalFieldFunction( Field, GeneratedFields, 'bind' );
			GeneratedFields = GeneratedFields.bind();
			if ( Array.isArray( GeneratedFields ) === true ) {
				if ( 'prefix' in Field ) {
					return [ this._buildFields( GeneratedFields, LabelGenerator, Field.prefix ), null, null ];
				} else {
					return [ this._buildFields( GeneratedFields, LabelGenerator ), null, null ];
				}
			} else {
				if ( 'prefix' in Field ) {
					GeneratedFields.prefix = Field.prefix;
				}

				if ( 'group' in GeneratedFields ) {
					return [ null, this._buildGroup( GeneratedFields, LabelGenerator ), null ];
				} else {
					return [ null, null, this._buildField( GeneratedFields, LabelGenerator ) ];
				}
			}
		},
		_buildFields: function ( Fields, LabelGenerator ) {
			let GeneratedFields = [];
			const GeneratedGroups = [];
			const Model = {};
			const Return = {};
			let FieldIndex, Mutable;

			for ( FieldIndex in Fields ) {
				if ( 'bind' in Fields[ FieldIndex ] ) {
					Mutable = this._buildDynamicField( Fields[ FieldIndex ], Model, LabelGenerator );
					if ( Mutable[ 1 ] === null && Mutable[ 2 ] === null ) {
						GeneratedFields = GeneratedFields.concat( Mutable );
					} else if ( Mutable[ 0 ] === null && Mutable[ 2 ] === null ) {
						GeneratedGroups.push( Mutable );
					} else {
						Mutable = this._buildField( Fields[ FieldIndex ], LabelGenerator );
						if ( 'multi' in Mutable ) {
							this._buildModel( Mutable.model, Mutable.multi );
						} else {
							this._buildModel( Mutable.model );
						}

						GeneratedFields.push( Mutable );
					}
					continue;
				}

				if ( 'group' in Fields[ FieldIndex ] ) {
					GeneratedGroups.push( this._buildGroup( Fields[ FieldIndex ], LabelGenerator ) );
					continue;
				}

				Mutable = this._buildField( Fields[ FieldIndex ], LabelGenerator );
				if ( 'multi' in Mutable ) {
					this._buildModel( Mutable.model, Mutable.multi );
				} else {
					this._buildModel( Mutable.model );
				}

				GeneratedFields.push( Mutable );
			}

			if ( Object.isEmpty( GeneratedFields ) === false ) {
				Return.fields = GeneratedFields;
			}

			if ( Object.isEmpty( GeneratedGroups ) === false ) {
				Return.groups = GeneratedGroups;
			}

			return Return;
		},
		__addDescription: function ( createElement, Step, LabelGenerator ) {
			const DescriptionText = this.__getStringLabelOrPlaceholder(
				LabelGenerator,
				Step.description
			);
			if ( DescriptionText.length === 0 ) {
				return createElement( 'p', {
					attr: {
						'class': 'blubberDescription',
						id: Step.description
					},
					domProps: {
						innerHTML: DescriptionText
					}
				} );
			} else {
				return '';
			}
		},
		__buildVueGenerator: function ( createElement, Step, LabelGenerator ) {
			let Options;
			const Index = this.$data.blubberFormSchema[ this.$data.currentFormId ].length;
			const GeneratedStep = this._buildFields( Step.fields, LabelGenerator );
			this.$data.blubberFormSchema[ this.$data.currentFormId ].push( GeneratedStep );

			if ( 'options' in Step ) {
				Options = Step.options;
			} else {
				Options = {};
			}

			return createElement( 'vue-form-generator', {
				props: {
					model: this.$data.blubberModel[ this.$data.currentFormId ],
					schema: this.$data.blubberFormSchema[ this.$data.currentFormId ][ Index ],
					options: Options,
					ref: '{}_{}'.format( this.$data.currentFormId, Index )
				}
			} );
		},
		_buildStep: function ( createElement, Step, LabelGenerator ) {
			let Title, Icon, Mutable;
			const BeforeChange = {};

			const Description = this.__addDescription( createElement, Step, LabelGenerator );
			const VueGenerator = this.__buildVueGenerator( createElement, Step, LabelGenerator );

			if ( 'label' in Step ) {
				Mutable = this.__executeFunctionOrGetString( Step.label, Step[ '"name"' ] );
				Title = this.__getStringLabelOrPlaceholder( LabelGenerator, Mutable );
			} else {
				Title = this.__getStringLabelOrPlaceholder( LabelGenerator, Step.name );
			}

			if ( 'icon' in Step ) {
				Icon = Step.icon;
			} else {
				Icon = '';
			}

			if ( 'beforeChange' in Step ) {
				this.__assignOptionalFieldFunction( Step, BeforeChange, 'beforeChange' );
				return createElement( 'tab-content',
					{
						attr:
							{
								id: Step.name
							},
						props:
							{
								title: Title,
								icon: Icon,
								beforeChange: BeforeChange.beforeChange
							}
					},
					[ Description, VueGenerator ]
				);
			} else {
				return createElement( 'tab-content',
					{
						attr:
							{
								id: Step.name
							},
						props:
							{
								title: Title,
								icon: Icon
							}
					},
					[ Description, VueGenerator ]
				);
			}

		},
		buildBlubberForm: function (
			createElement,
			FormId,
			FormAttributes,
			FormProperties,
			Steps,
			LabelGenerator
		) {
			let StepIndex, LabelString, LabelIndex;
			const Tabs = [];
			// set formproperties and add labels
			const FormPropertiesLabels = [ 'subtitle', 'nextButtonText', 'backButtonText', 'finishButtonText' ];

			if ( typeof FormId !== 'string' || FormId.length === 0 ) {
				throw new TypeErrorException( ErrorMessages.IVALID_TOP_ITEM.format( 'FormId', typeof FormId, 'non empty string' ) );
			}

			if ( typeof LabelGenerator !== 'function' ) {
				throw new TypeErrorException( ErrorMessages.IVALID_TOP_ITEM.format( 'LabelGenerator', typeof LabelGenerator, 'function' ) );
			}

			if ( typeof FormAttributes !== 'object' ) {
				FormAttributes = { id: FormId };
			} else {
				FormAttributes.id = FormId;
			}

			for ( LabelIndex in FormPropertiesLabels ) {
				LabelString = this.__getStringLabelOrPlaceholder(
					LabelGenerator,
					FormProperties[ FormPropertiesLabels[ LabelIndex ] ],
					FormProperties );
				FormProperties[ FormPropertiesLabels[ LabelIndex ] ] = LabelString;
			}
			this.$data.blubberFormSchema[ FormId ] = [];
			this.$data.blubberModel[ FormId ] = {};
			this.$data.currentFormId = FormId;
			for ( StepIndex in Steps ) {
				Tabs.push( this._buildStep( createElement, Steps[ StepIndex ], LabelGenerator ) );
			}

			return createElement( 'form-wizard', {
				attrs: FormAttributes,
				props: FormProperties
			}, Tabs );
		}
	},
	data: function () {
		return { currentFormId: '', blubberModel: {}, blubberFormSchema: {} };
	}
} );

export default
{
	name: 'BlubberFormFactory',
	template: '<div></div>'
};
</script>

<style>

</style>
