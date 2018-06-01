<script>
/* eslint-disable */
import Vue from 'vue';
import Axios from 'axios';

class BaseException
{
    constructor( Name, Message )
    {
        this.Name = Name
        this.Message = Message
        console.trace()
    }
}

class RuntimeErrorException extends BaseException
{
    constructor( Message )
    {
        super( "RuntimeErrorException", Message )
    }
}

class ValueErrorException extends BaseException
{
    constructor( Message )
    {
      super( "ValueErrorException", Message )
    }
}

class AssertErrorException extends BaseException
{
    constructor( Message )
    {
        super( "AssertErrorException", Message )
    }
}

Object.size = function ( Self )
{
    let Size = 0, Key;
    for ( Key in Self )
    {
        if ( true === Self.hasOwnProperty(Key) )
        {
            Size++;
        }
    }
    return Size;
}

Object.isEmpty = function ( Self )
{
    return 0 === Object.size(Self)
}

Object.copy = function ( Self,  Depth = -1 )
{
    var Dolly, Key;

    if ( true === Array.isArray( Self ) )
    {
        Dolly = Self.slice(0)
    }
    else
    {
        Dolly = Object.assign({}, Self)
    }

    if ( 0 === Depth )
    {
        return Dolly
    }

    for ( Key in Dolly )
    {
        if( 'object' === typeof Dolly[Key] )
        {
            Dolly[Key] = Object.copy(Dolly[Key], Depth-1)
        }
    }

    return Dolly
}

Object.merge = function ( Object1, Object2, KeepOrign = true )
{
    var Key
    if ( true === KeepOrign )
    {
        var Return = {}
        Return = Object.assign( {}, Object1, Object2 )
        for ( Key in Return )
        {
            if( 'object' === typeof Return[Key] )
            {
                Return[Key] = Object.copy( Return[Key] )
            }
        }

        return Return
    }
    else
    {
        Object1 = Object.assign( {}, Object1, Object2 )
        for ( Key in Object2 )
        {
            if ( 'object' === typeof Object1[Key] )
            {
                Object1[Key] = Object.copy( Object1[Key] )
            }
        }

        return Object1
    }
}

//just a simple implementation...we do not need for this project more
String.prototype.format = function ()
{
    var Index, LookAHead, UserDefinedIndex, LastStartPoint
    let FoundFormatIndices = []
    let Counter = 0
    let Manual = false
    let Return = ''
    for ( Index = 0; this.length > Index; Index++ )
    {
        if ( '{' === this.charAt( Index ) )
        {
            LookAHead = 1+Index
            UserDefinedIndex = ''
            while ( 47 < this.charCodeAt( LookAHead ) && 58 > this.charCodeAt( LookAHead ) )
            {
                UserDefinedIndex += this.charAt( LookAHead )
                LookAHead++
            }

            if ( '}' === this.charAt( LookAHead ) )
            {
                if ( false === UserDefinedIndex.isEmpty() )
                {
                    FoundFormatIndices.push( [ Index, LookAHead, parseInt( UserDefinedIndex ) ] )
                    Manual = true
                }
                else
                {
                    FoundFormatIndices.push( [ Index, LookAHead, Counter ] )
                    Counter++
                }

                Index = LookAHead
            }
        }
    }

    if ( 0 !== Counter && true === Manual )
    {
        throw new ValueErrorException( 'Cannot switch from automatic field numbering to manual field specification.' )
        return null
    }
    else
    {
        if ( 0 === FoundFormatIndices.length )
        {
            return this
        }
        else
        {
            LastStartPoint = 0
            for ( Index in FoundFormatIndices )
            {
                console.log( FoundFormatIndices[Index][2] )
                if ( false === ( FoundFormatIndices[Index][2] in arguments ) )
                {
                    throw new ValueErrorException( "To few arguments." )
                    return null
                }

                Return += this.substring( LastStartPoint, FoundFormatIndices[Index][0] ) + arguments[FoundFormatIndices[Index][2]]
                LastStartPoint = FoundFormatIndices[Index][1]+1
            }

            Return += this.substring(LastStartPoint)
        }
    }

    return Return
}

String.prototype.isEmpty = function ()
{
    return 0 === this.length
}

Array.isEmpty = function ( Self )
{
    return 0 === Self.length
}

function assert ( Condition )
{
    if ( false === Condition )
    {
        throw new AssertErrorException( 'Failed condition' )
    }
}

const ErrorMessages = {

}

Vue.mixin({
    methods:
    {
        evaluateRequest: async function ( Response, Error, Hook )
        {
            while ( true === this.isEmpty( Response ) )
            {
                await this.sleep(10)
            }

            if ( false === this.isEmpty( Error ) )
            {
                throw new RuntimeErrorException( Error )
            }

            Hook( Response )
        },
        getExtern: async function ( File, Hook )
        {
            var Error
            var Response
            Axios.get( File ).then( response => ( Response = response ) ).catch( error => ( Error = error ) )
            this.evaluateRequest( Response, Error, Hook )
        },
        getIntern: async function ( File, Hook )
        {
            var Response
            var Error
            Response = await import( '' + File ).catch( error => ( Error = error ) )

            this.evaluateRequest( Response, Error, Hook )
        },
        get: function ( File, Hook )
        {
            if ( true === File.startsWith( 'http://' ) )
            {
                this.getExtern( File, Hook )
            }
            else
            {
                this.getIntern( File, Hook )
            }
        },
        isEmpty: function ( Str )
        {
            if ( 'undefined' === typeof Str || null === Str )
            {
                return true
            }
            else
            {
                if ( 'string' === typeof Str )
                {
                    return Str.isEmpty()
                }
                else if ( true === Array.isArray( Str ) )
                {
                    return Array.isEmpty( Str )
                }
                else if ( 'object' === typeof Str )
                {
                    return Object.isEmpty( Str )
                }
                else
                {
                    return false
                }
            }
        },
        sleep: function ( Milliseconds )
        {
            return new Promise( Resolve => setTimeout( Resolve, Milliseconds ) )
        },
        debugObjectPrint: function ( Object, Id )
        {
            let Element = document.getElementById(Id)
            Element.innerHTML = '<pre>' + JSON.stringify(Object, undefined, 4) + '</pre>'
        }
    }
})

export default
{
    name: 'BlubberUtils'
}
</script>
