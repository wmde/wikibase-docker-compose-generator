<script>
import BlubberFormFactory from './components/BlubberFormFactory';
import Utils from './Utils';
import Language from './components/Language';
import ObjectHelper from './components/lib/ObjectHelper';
import AvailableLanguages from './components/data/lang/availableLanguages';
import Validator from './components/lib/Validators';
import StringHelper from "./components/lib/StringHelper";

export default {
	name: 'Blubber',
	mixins: [ Language, BlubberFormFactory ],
	render: function ( createElement )
	{
		return this.buildApplication( createElement );
	},
	template: '<div><BlubberFormFactory/></div>',
	data: function ()
	{
		const Return = {};
		Return.buildForm = false;
		Return.blubberGeneratorSteps = [];
		Return.blubberGeneratorFormProperties = {};
		Return.blubberGeneratorFormStyle = {};
		Return.forReadOnly = {};
		return Return;
	},
	mounted: function ()
	{
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
		getConfiguration: function ()
		{
			Utils.get( './components/data/config.json', this.evaluateConfiguration );
		},
		evaluateConfiguration: function ( Configuration )
		{
			this.$data.blubberGeneratorSteps = Configuration.steps;
			this.$data.blubberGeneratorFormProperties = Configuration.form;
			this.$data.blubberGeneratorFormProperties.id = Configuration.name;
			this.$data.buildForm = true;
			this.$forceUpdate();
		},
		getI18nStrings: function ( Key, LanguageCode )
		{
			return this.$data.i18n.tc( Key, LanguageCode );
		},
		buildApplication: function ( createElement )
		{
			if ( false === this.$data.buildForm )
			{
				return createElement( 'div', { attrs: { id: 'application' } }, createElement( BlubberFormFactory, {}, '' ) );
			}
			else
			{
				let I18n = null;
				let Return;

				if ( 'undefined' !== typeof this.$data.i18n )
				{
					I18n = this.getI18nStrings;
					Validator.InvalidPortNoInteger = this.getI18nStrings( 'invalid_port_integer' );
					Validator.InvalidPortWellKnown = this.getI18nStrings( 'is_well_known_port' );
					Validator.InvalidPortInUse = this.getI18nStrings( 'port_is_in_use' );
					Validator.InvalidString = this.getI18nStrings( 'invalid_string' );
					Validator.InvalidArray = this.getI18nStrings( 'invalid_step' );
				}

				const Element = this.buildBlubberForm(
					createElement,
					{
						formAttributes: ObjectHelper.copyObj( this.$data.blubberGeneratorFormProperties ),
						formEvents: { Complete: 'done' },
						steps: ObjectHelper.copyObj( this.$data.blubberGeneratorSteps )
					},
					I18n
				);
				// eslint-disable-next-line
				return createElement( 'div', { attrs: { id: 'application' } }, [ Element ] );
			}
		},
		getValidator( FieldId )
		{
			const Validators = {
				steps: Validator.steps,
				mediawikiAdminName: Validator.string,
				mediawikiAdminPassword: Validator.string,
				databaseHost: Validator.string,
				databaseName: Validator.string,
				databaseUser: Validator.string,
				databaseUserPassword: Validator.string,
				wikibaseAlias: Validator.string,
				wikibaseQuickstatementsAlias: Validator.string,
				wikibaseQuickstatementsNamespaceItem: Validator.string,
				wikibaseQuickstatementsNamespaceProperty: Validator.string,
				wikibaseQuickstatementsPrefixProperty: Validator.string,
				wikibaseQuickstatementsPrefixItem: Validator.string,
				wikibaseBlazegraphAlias: Validator.string,
				wikibaseUIAlias: Validator.string,
				databasePort: Validator.ports,
				wikibasePort: Validator.ports,
				wikibaseQuickstatementsPort: Validator.ports,
				wikibaseBlazegraphPort: Validator.ports,
				wikibaseUIPort: Validator.ports
			};

			FieldId = FieldId[ 0 ];

			if ( false === Validators.hasOwnProperty( FieldId ) )
			{
				return '';
			}
			else
			{
				return Validators[ FieldId ];
			}
		},
		showPasswords: function ( Id, Offset )
		{
			let Scroll;
			let Node = document.getElementById( Id );
			let GetHideLabel = true;
			if ( 'text' === Node.getAttribute( 'type' ) )
			{
				Node.setAttribute( 'type', 'password' );
				GetHideLabel = false;
			}
			else
			{
				Node.setAttribute( 'type', 'text' );
			}

			Node = Node.parentNode.nextSibling.firstChild;
			for ( Scroll = 0; Scroll <= Offset; Scroll++ )
			{
				Node = Node.nextSibling;
			}

			if ( true === GetHideLabel )
			{
				Node.innerText = this.getI18nStrings( 'hidePassword' );
			}
			else
			{
				Node.innerText = this.getI18nStrings( 'showPassword' );
			}
		},
		randomString( Length, Min, Max, Exclude = [] )
		{
			const GeneratedString = [];
			let Char, Index;
			if ( 0 > Length )
			{
				return '';
			}

			Exclude = Exclude.sort();
			for ( Index = 0; Index < Exclude.length; Index++ )
			{
				if ( 'string' === typeof Exclude[ Index ] )
				{
					Exclude[ Index ] = Exclude[ Index ].charCodeAt( 0 );
				}
			}

			do
			{
				Char = Math.round( Math.random() * 100 + Math.random() * 100 );
				if ( 0 < Min && Char < Min )
				{
					continue;
				}

				if ( 0 < Max && Char > Max )
				{
					continue;
				}

				if ( -1 !== Utils.binarySearch( Exclude, Char ) )
				{
					continue;
				}

				Char = String.fromCharCode( Char );
				Length--;
				GeneratedString[ Length ] = Char;
			}
			while ( 0 < Length );

			return GeneratedString.join( '' );
		},
		generateAPassword( Key )
		{
			const RandomString = this.randomString(
				42,
				33,
				126,
				[ ':', '\'', '"', '=', '{', '[', '(', ')', ']', '}', '$', ';', '`', '\\', '/', '%' ]
			);

			this.$data.blubberModel[
				this.$data.blubberGeneratorFormProperties.id
			][ Key ] = RandomString;

			this.$forceUpdate();
		},
		showMWAdminPassword: function ()
		{
			this.showPasswords( 'mediawikiAdminPassword' );
		},
		generateMWAdminPassword: function ()
		{
			this.generateAPassword( 'mediawikiAdminPassword' );
		},
		showDBPassword: function ()
		{
			this.showPasswords( 'databaseUserPassword' );
		},
		generateDBAdminPassword: function ()
		{
			this.generateAPassword( 'databaseUserPassword' );
		},
		validateMediaWiki: function ()
		{
			this.$forceUpdate();
			return this.$refs.mediawiki.validate();
		},
		validateDatabase: function ()
		{
			this.$forceUpdate();
			return this.$refs.database.validate();
		},
		validateUpdater: function ()
		{
			const Return = this.$refs[ 'wdqs-updater' ].validate();
			this.$forceUpdate();
			return Return;
		},
		validateWikibase: function ()
		{
			this.$forceUpdate();
			return this.$refs.wikibase.validate();
		},
		validateWikibaseBlazegraph: function ()
		{
			this.$forceUpdate();
			return this.$refs.wikibaseBlazegraph.validate();
		},
		validateWikibaseProxy: function ()
		{
			this.$forceUpdate();
			return this.$refs.wikibaseProxy.validate();
		},
		validateWikibaseQuickstatements: function ()
		{
			this.$forceUpdate();
			return this.$refs.wikibaseQuickstatements.validate();
		},
		validateWikibaseUI: function ()
		{
			this.$forceUpdate();
			return this.$refs.wikibaseUI.validate();
		},
		isWikibseAliasSet()
		{
			return true;
		},
		isWikibasePortSet()
		{
			return true;
		},
		isWikibaseBlazegraphAliasSet()
		{
			return true;
		},
		isWikibaseBlazegraphPortSet()
		{
			return true;
		},
        jumpToTheEnd()
        {
            this.$refs[ this.$data.blubberGeneratorFormProperties.id ].changeTab(
                0,
                this.$data.blubberSchema[ this.$data.blubberGeneratorFormProperties.id ].length - 1
            );
        },
        showYmlFile()
        {
            let Index;
            let ToPrint = [];
            let Place = document.getElementById( 'yml' ).firstChild;

            if( false === this.$data.blubberModel[
                this.$data.blubberGeneratorFormProperties.id
                ].hasOwnProperty( 'secretkey' ) )
            {
                this.$data.blubberModel[
                    this.$data.blubberGeneratorFormProperties.id
                    ].secretkey = this.randomString(
                    42,
                    33,
                    126,
                    [':', '\'', '"', '=', '{', '[', '(', ')', ']', '}', '$', ';', '`', '\\', '/', '%']
                );
            }
            for ( Index = 0; Index < this.$data.blubberGeneratorSteps.length - 1; Index++ )
            {
                if(
                    false === this.$data.blubberGeneratorSteps[Index].hasOwnProperty( 'template' )
                ||
                    true === Utils.isEmpty( this.$data.blubberGeneratorSteps[Index].template )
                )
                {
                    continue;
                }
                ToPrint.push( StringHelper.format(
                    this.$data.blubberGeneratorSteps[Index].template,
                    this.$data.blubberModel[ this.$data.blubberGeneratorFormProperties.id ]
                ) );
            }

            ToPrint.splice(
                0,
                0,
                this.$data.blubberGeneratorSteps[ this.$data.blubberGeneratorSteps.length - 1 ].template[0]
            );

            ToPrint.push( this.$data.blubberGeneratorSteps[ this.$data.blubberGeneratorSteps.length - 1 ].template[1] );
            ToPrint.push( this.$data.blubberGeneratorSteps[ this.$data.blubberGeneratorSteps.length - 1 ].template[2] );
            Place.innerHTML = ToPrint.join("\n");
        },
		done()
		{
            let Index;
            let ToPrint = [];

            if( false === this.$data.blubberModel[
                this.$data.blubberGeneratorFormProperties.id
                ].hasOwnProperty( 'secretKey' ) )
            {
                this.$data.blubberModel[
                    this.$data.blubberGeneratorFormProperties.id
                    ].secretKey = this.randomString(
                    42,
                    33,
                    126,
                    [':', '\'', '"', '=', '{', '[', '(', ')', ']', '}', '$', ';', '`', '\\', '/', '%']
                );
            }
            for ( Index = 0; Index < this.$data.blubberGeneratorSteps.length - 1; Index++ )
            {
                if(
                    false === this.$data.blubberGeneratorSteps[Index].hasOwnProperty( 'template' )
                    ||
                    true === Utils.isEmpty( this.$data.blubberGeneratorSteps[Index].template )
                )
                {
                    continue;
                }
                ToPrint.push( StringHelper.format(
                    this.$data.blubberGeneratorSteps[Index].template,
                    this.$data.blubberModel[ this.$data.blubberGeneratorFormProperties.id ]
                ) );
            }

            ToPrint.splice(
                0,
                0,
                this.$data.blubberGeneratorSteps[ this.$data.blubberGeneratorSteps.length - 1 ].template[0]
            );

            ToPrint.push( this.$data.blubberGeneratorSteps[ this.$data.blubberGeneratorSteps.length - 1 ].template[1] );
            ToPrint.push( this.$data.blubberGeneratorSteps[ this.$data.blubberGeneratorSteps.length - 1 ].template[2] );
		}
	}
};
</script>
<style>
@import 'vue-form-wizard/dist/vue-form-wizard.min.css';
</style>
