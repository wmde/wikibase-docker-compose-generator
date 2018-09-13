<script>
/* eslint-disable operator-linebreak */
import BlubberFormFactory from './components/BlubberFormFactory';
import Utils from './Utils';
import Language from './components/Language';
import ObjectHelper from './components/lib/ObjectHelper';
import AvailableLanguages from './components/data/lang/availableLanguages';
import Validators from './components/lib/Validators';
import { UPDATE_KEEP_MODEL_DATA } from './components/lib/blubberFormGenerator/RenderConstants';
import { saveAs } from 'file-saver';
import StringHelper from './components/lib/StringHelper';

class StaticReference {
	static References = {};
}

export default {
	name: 'Blubber',
	mixins: [ Language, BlubberFormFactory ],
	render: function ( createElement ) {
		return this.buildApplication( createElement );
	},
	template: '<div><BlubberFormFactory/></div>',
	data: function () {
		const Return = {};
		Return.buildForm = false;
		Return.blubberSteps = [];
		Return.blubberFormProperties = {};
		Return.blubberFormStyle = {};
		Return.blubberYAMLTemplate = {};
		Return.blubberGeneratedYML = '';
		Return.blubberCurrentStep = 0;
		return Return;
	},
	mounted: function () {
		let Language;
		this.initLanguages();
		this.getClientLanguages();
		// eslint-disable-next-line
		Language = this.getDefaultLanguage( AvailableLanguages );
		this.getLanguage( Language );
		Utils.waitUntil( this._languageIsLoaded );
		this.getConfiguration();
	},
	methods: {
		getConfiguration: function () {
			Utils.get( './components/data/config.json', this.evaluateConfiguration );
		},
		evaluateConfiguration: function ( Configuration ) {
			this.$data.blubberSteps = Configuration.formModel.steps;
			this.$data.blubberFormProperties = Configuration.formModel.form;
			this.$data.blubberFormProperties.id = Configuration.formModel.name;
			this.$data.blubberYAMLTemplate = Configuration.yaml;
			this.$data.buildForm = true;
			this.$forceUpdate();
		},
		getI18nStrings: function ( Key, LanguageCode ) {
			return this.$data.i18n.tc( Key, LanguageCode );
		},
		buildApplication: function ( createElement ) {
			if ( this.$data.buildForm === false ) {
				return createElement(
					'div',
					{ attrs: { id: 'application' } },
					createElement( BlubberFormFactory, {}, '' )
				);
			} else {
				let I18n = null;
				let Element;

				if ( typeof this.$data.i18n !== 'undefined' ) {
					I18n = this.getI18nStrings;
				}

				StaticReference.References.vue = this;
				StaticReference.References.validator = Validators;
				this.setDefaultModelRenderBehaviour( false );

				// eslint-disable-next-line
				Element = this.buildBlubberForm(
					createElement,
					StaticReference.References,
					{
						formAttributes: ObjectHelper.copyObj( this.$data.blubberFormProperties ),
						formEvents: { Complete: 'done' },
						steps: ObjectHelper.copyObj( this.$data.blubberSteps )
					},
					I18n,
					UPDATE_KEEP_MODEL_DATA
				);
				return createElement(
					'div',
					{ attrs: { id: 'application' } },
					[ Element ]
				);
			}
		},
		refresh: function () {
			this.$forceUpdate();
			return true;
		},
		changeStep: function ( prevIndex, nextIndex ) {
			if ( nextIndex === 2 ) {
				Validators.clearPorts();
			}
		},
		hasComponents: function () {
			if (
				this.$data.blubberModel.hasOwnProperty(
					this.blubberFormProperties.id
				) === false
			) {
				return true;
			} else {
				if (
					this.$data.blubberModel[
						this.blubberFormProperties.id
					].wdqsStep === false
				&&
					this.$data.blubberModel[
						this.blubberFormProperties.id
					].quickstatementsStep === false
				) {
					return false;
				} else {
					return true;
				}
			}
		},
		hasSingelComponenet: function ( WhichField ) {
			let FieldName;
			const WQDS = [
				'wikibaseBlazegraphPort',
				'wikibaseProxyPort',
				'wikibaseFrontendPort'
			];

			if ( WQDS.indexOf( WhichField ) !== -1 ) {
				FieldName = 'wdqsStep';
			} else {
				FieldName = 'quickstatementsStep';
			}

			if (
				this.$data.blubberModel.hasOwnProperty(
					this.blubberFormProperties.id
				) === false
			) {
				return true;
			} else {
				return this.$data.blubberModel[
					this.blubberFormProperties.id
				][ FieldName ];
			}
		},
		validateStep2: function () {
			this.$forceUpdate();
			Validators.clearPorts();
			return this.$refs.componentsConfiguration.validate();
		},
		randomString( Length, Min, Max, Exclude = [] ) {
			const GeneratedString = [];
			let Char, Index;
			if ( Length < 0 ) {
				return '';
			}

			Exclude = Exclude.sort();
			for ( Index = 0; Index < Exclude.length; Index++ ) {
				if ( typeof Exclude[ Index ] === 'string' ) {
					Exclude[ Index ] = Exclude[ Index ].charCodeAt( 0 );
				}
			}

			do {
				Char = Math.round( Math.random() * 100 + Math.random() * 100 );
				if ( Min > 0 && Char < Min ) {
					continue;
				}

				if ( Max > 0 && Char > Max ) {
					continue;
				}

				if ( Utils.binarySearch( Exclude, Char ) !== -1 ) {
					continue;
				}

				Char = String.fromCharCode( Char );
				Length--;
				GeneratedString[ Length ] = Char;
			}
			while ( Length > 0 );

			return GeneratedString.join( '' );
		},
		generateAPassword() {
			const RandomString = this.randomString(
				42,
				33,
				126,
				[ ':', '\'', '"', '=', '{', '[', '(', ')', ']', '}', '$', ';', '`', '\\', '/', '%' ]
			);

			this.$data.blubberModel[
				this.blubberFormProperties.id
			][ arguments[ 1 ].model ] = RandomString;

			this.$forceUpdate();

		},
		prepareForYAML() {
			const ToTransform = [];
			let Index;

			ToTransform.push( this.blubberYAMLTemplate.prolog );
			ToTransform.push( this.blubberYAMLTemplate.wikibase );
			ToTransform.push( this.blubberYAMLTemplate.mysql );

			if ( this.$data.blubberModel[
				this.blubberFormProperties.id
			].elasticsearchStep === true
			) {
				ToTransform[ 1 ] += this.blubberYAMLTemplate.elasticsearch[ 0 ];
				ToTransform.push( this.blubberYAMLTemplate.elasticsearch[ 1 ] );
			}

			if ( this.$data.blubberModel[
				this.blubberFormProperties.id
			].wdqsStep === true
			) {
				for ( Index in this.blubberYAMLTemplate.wdqsComponents ) {
					ToTransform.push( this.blubberYAMLTemplate.wdqsComponents[ Index ] );
				}
			}

			ToTransform.push( this.blubberYAMLTemplate.epilog );

			return ToTransform;
		},
		downloadYAML() {

			const Transformer = ObjectHelper.copyObj(
				this.blubberModel[ this.blubberFormProperties.id ]
			);
			const ToTransform = this.prepareForYAML();
			let Transformed = '';
			let Download = null;

			if ( this.$data.blubberModel[
				this.blubberFormProperties.id
			].elasticsearchStep === true
			) {
				Transformer.dependencyElasticsearch = '\n            - elasticsearch';
			} else {
				Transformer.dependencyElasticsearch = '';
			}

			Transformer.secretkey = this.randomString(
				42,
				33,
				126,
				[ ':', '\'', '"', '=', '{', '[', '(', ')', ']', '}', '$', ';', '`', '\\', '/', '%' ]
			);

			Transformed = StringHelper.format(
				ToTransform.join( '\n' ),
				Transformer
			);

			Download = new File( [ Transformed ], 'docker-compose.yml', { type: 'text/plain;charset=utf-8' } );
			saveAs( Download );
		}
	}
};
</script>
<style>
@import 'vue-form-wizard/dist/vue-form-wizard.min.css';
.vue-form-generator div div
{
    margin-top: 1em;
    margin-bottom: 1em;
}

h1,h2,h3,h4,h5,h6,p,ul, label, button
{
    font-family:
            'Helvetica Neue',
            'Helvetica',
            'Nimbus Sans L',
            'Arial',
            'Liberation Sans',
            sans-serif !important;
    text-align: left;
}

h4.wizard-title
{
    font-weight: 600 !important;
    font-size: 1.2em;
    margin-left: 0;
    margin-bottom: 0;
}

p
{
    margin: 0px 0px 0px 0px;
    margin-bottom:1em;
    font-size: 1em;
    font-family:
            'Helvetica Neue',
            'Helvetica',
            'Nimbus Sans L',
            'Arial',
            'Liberation Sans',
            sans-serif !important;
}

input:focus
{
    outline:none;
}

input
{
    border-radius: 2px;
    border-style:solid;
    border-width: 1px;
    border-color: #2e5b01;
    padding-left: 5px;
}

.help span /*.helpText*/
{
    visibility: hidden;
    width: 50%;
    background-color: #555;
    color: #fff;
    text-align: left;
    border-radius: 6px;
    margin-top: -0.1em;
    position: absolute;
    z-index: 1;
    opacity: 0;
    transition: opacity 0.3s;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left:10px;
    padding-right:10px;
}

.help span a
{
    color: #4683ff;
}

.help *
{
    display: inline-block;
}
.help:after
{
    content: "?";
    color:white;
    border: 1px solid black;
    border-radius: 15px;
    background-color: #3366cc;
    margin-left: 0.5em;
    padding-top: 3px;
    padding-bottom: 3px;
    padding-left:8px;
    padding-right:8px;
    font-size: 0.9em;
    display: inline-block!important;
}

.help:hover span /* .helpText */
{
    visibility: visible;
    opacity: 1;
}

.help:hover:after
{
    display: none;

}

#components .form-group
{
    margin-top: 1.5em;
}

#components .form-group:nth-child(1)
{
    margin-top: 0em;
}

#components label
{
    display: inline-block;
}

#components .field-wrap
{
    margin: 0px 0px 0px 0px;
    margin-left: 1em;
}

#components input
{
    height: 1.2em;
}

#components .radio-list *
{
    display: inline-block;
}

#components .radio-list input
{
    float: left;
}
</style>
