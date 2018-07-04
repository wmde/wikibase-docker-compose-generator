export default class Validators
{
    static InvalidPort_No_Integer;
    static InvalidPort_Well_Known;
    static InvalidPort_In_Use;
    static InvalidString;
    static InvalidArray;
    static __LastInteger;
    static __UsedPorts = {};

    static isInteger( Integer )
    {
        let Index;
        if( 'number' === typeof Integer )
        {
            Integer = `${ Integer }`;
        }
        else if( 'string' !== typeof Integer )
        {
            return false;
        }

        for( Index in Integer )
        {
            if( 48 > Integer[ Index ] && 57 < Integer[ Index ] )
            {
                return false;
            }
        }

        Validators.__LastInteger = parseInt( Integer );
        return true;
    }

    static string( Value )
    {
        if( 'string' !== typeof Value || 0 === Value.length )
        {
            return [ Validators.InvalidString ];
        }

        return [];
    }

    static ports( Value, Schema)
    {
        let Index;
        if( false === Validators.isInteger( Value ) )
        {
            return [ Validators.InvalidPort_No_Integer ];
        }

        if( 1024 >= Validators.__LastInteger )
        {
            return [ Validators.InvalidPort_Well_Known ];
        }

        for( Index in Validators.__UsedPorts )
        {
            if( Index === Schema.id )
            {
                continue;
            }

            if( Validators.__LastInteger === Validators.__UsedPorts[ Index ] )
            {
                return [ Validators.InvalidPort_In_Use ];
            }
        }

        Validators.__UsedPorts[ Schema.id ] = Validators.__LastInteger;

        return [];
    }

    static steps( Value )
    {
        if( false === Array.isArray( Value ) || 0 === Value.length )
        {
            return [ Validators.InvalidArray ];
        }

        return [];
    }
}
