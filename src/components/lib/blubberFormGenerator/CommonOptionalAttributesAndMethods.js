import FieldBase from './FieldBase';
import StringHelper from '../StringHelper';
import CommonRequiredAttributes from './CommonRequiredAttributes';
import InvalidFieldPropertyException from './Exceptions/InvalidFieldPropertyException';
import Utils from '../../../Utils';
/* eslint-disable operator-linebreak */
export default class CommonOptionalAttributesAndMethods extends CommonRequiredAttributes {
	/* ERRORS*/
	static _NO_BUTTON_ = 'A insidebutton of field {} has no label.';

	constructor( Field, BindedObject, Generator ) {
		super( Field, BindedObject, Generator );
		this.__addStore();
		this.__addCommonOptionalProperties();
	}

	_setAutocomplete() {
		if (
			this._Field.hasOwnProperty( 'autocomplete' ) === true
		&&
			this._Field.autocomplete === false
		) {
			this._GeneratedField.autocomplete = 'off';
		} else {
			this._GeneratedField.autocomplete = 'on';
		}
	}

	__addStore() {
		if ( this._Field.hasOwnProperty( 'storesIn' ) === true ) {
			this._addKeyToModel( this._executeFunctionOrGetString( this._Field.storesIn, false ) );
		} else {
			this._addKeyToModel( this._executeFunctionOrGetString( this._Field.name ) );
		}
	}

	__addVisibilityType() {
		this._assignBoolean( 'isVisible', 'visible' );
		this._assignBoolean( 'isDisabled', 'disabled' );
		this._assignBoolean( 'isFeatured', 'featured' );
	}

	__addMiscellaneous() {
		this._assignBoolean( 'required' );

		if (
			(
				this._Field.hasOwnProperty( 'default' ) === true &&
				Utils.isEmpty( this._Field.default ) === false
			)
		||
			typeof this._Field.default !== 'boolean'
		) {
			this._addValueToModel( this._executeFunctionOrGetAnything( this._Field.default ) );
		}
	}

	__addStringBasedAttributes() {
		this._assignPlaceholderOrLabelString( 'help' );
		this._assignPlaceholderOrLabelString( 'hint' );
	}

	__addMethods() {
		this._assignFunction( 'setFormatter', 'set' );
		this._assignFunction( 'getFormatter', 'get' );
	}

	__addEvents() {
		this._assignFunction( 'onChanged' );
		this._assignFunction( 'onValidated' );
		this._assignFunction( 'validator' );
	}

	__addClass() {
		let Miscellaneous;
		if ( this._Field.hasOwnProperty( 'styleClasses' ) ) {
			if ( Array.isArray( this._Field.styleClasses ) === false && typeof this._Field.styleClasses !== 'string' ) {
				throw new InvalidFieldPropertyException(
					StringHelper.format(
						FieldBase._UNSUPPORTED_TYPE_,
						typeof this._Field.styleClasses,
						this._Field.name,
						' at styleClasses property',
						'array of strings or string'
					)
				);

			} else if ( Array.isArray( this._Field.styleClasses ) === true ) {
				for ( Miscellaneous in this._Field.styleClasses ) {
					if ( typeof this._Field.styleClasses[ Miscellaneous ] !== 'string' ) {
						throw new InvalidFieldPropertyException(
							StringHelper.format(
								FieldBase._UNSUPPORTED_TYPE_,
								typeof this._Field.styleClasses[ Miscellaneous ],
								this._Field.name,
								` at styleClasses property at Index ${Miscellaneous}`,
								'string'
							)
						);
					}
				}
			}
		}
	}

	__wrapInsideButton( Button ) {
		let Mutable;
		const GeneratedButton = {};
		if ( Button.hasOwnProperty( 'class' ) === true ) {
			GeneratedButton.classes = this._executeFunctionOrGetString( Button.class );
		}

		if ( Button.hasOwnProperty( 'label' ) === true ) {
			Mutable = this._executeFunctionOrGetString( Button.label );
			GeneratedButton.label = this._getStringLabelOrPlaceholder( Mutable );
		} else {
			throw new InvalidFieldPropertyException(
				StringHelper.format(
					CommonOptionalAttributesAndMethods._NO_BUTTON_,
					this._Field.name
				)
			);
		}

		GeneratedButton.onclick = this._executeFunctionOrGetAnything( Button.action, true );
		return GeneratedButton;
	}

	__addInsideButton() {
		let Index, InsideButtons;
		const Buttons = [];

		if ( this._Field.hasOwnProperty( 'buttons' ) === false ) {
			return;
		}
		// eslint-disable-next-line
		InsideButtons = this._executeFunctionOrGetAnything(this._Field['buttons']);

		if ( typeof InsideButtons === 'object' && Array.isArray( InsideButtons ) === false ) {
			if (
				InsideButtons.hasOwnProperty( 'renderCondition' ) === true &&
				this._executeFunctionOrGetBoolean( InsideButtons.renderCondition ) === false
			) {
				return;
			}
			Buttons.push( this.__wrapInsideButton( InsideButtons ) );
		} else if ( Array.isArray( InsideButtons ) === true ) {
			for ( Index in InsideButtons ) {
				if (
					InsideButtons[ Index ].hasOwnProperty( 'renderCondition' ) === true
				&&
					this._executeFunctionOrGetBoolean(
						InsideButtons[ Index ].renderCondition
					) === false
				) {
					continue;
				}

				if ( typeof InsideButtons[ Index ] === 'object' ) {
					Buttons.push( this.__wrapInsideButton( InsideButtons[ Index ] ) );
				} else {
					throw new InvalidFieldPropertyException(
						StringHelper.format(
							FieldBase._UNSUPPORTED_TYPE_,
							typeof InsideButtons[ Index ],
							this._Field.name,
							'at insideButtons',
							'array of objects or object'
						)
					);
				}
			}
		} else {
			throw new InvalidFieldPropertyException(
				StringHelper.format(
					FieldBase._UNSUPPORTED_TYPE_,
					typeof InsideButtons,
					this._Field.name,
					'at insideButtons',
					'array of objects or object'
				)
			);
		}

		this._GeneratedField.buttons = Buttons;
	}

	__addCommonOptionalProperties() {
		this.__addClass();
		this.__addVisibilityType();
		this.__addMiscellaneous();
		this.__addInsideButton();
		this.__addStringBasedAttributes();
		this.__addMethods();
		this.__addEvents();
	}
}
