<script>
import Vue from 'vue'
import Axios from 'axios'

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
        super("RuntimeErrorException", Message)
    }
}

class AssertErrorException extends BaseException
{
    constructor( Message )
    {
        super("AssertErrorException", Message)
    }
}

Object.size = function( Self )
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

Object.isEmpty = function( Self )
{
    return 0 === Object.size(Self)
}

Object.copy = function( Self,  Depth = -1 )
{
    var Dolly = Object.assign({}, Self)
    var Key
    if(0 === Depth )
    {
        return Dolly
    }

    for( Key in Dolly )
    {
        if( 'object' === typeof Dolly[Key] )
        {
            Dolly[Key] = Object.copy(Dolly[Key], Depth-1)
        }
    }

    return Dolly
}

Object.merge = function( Object1, Object2, KeepOrign = true )
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
    }
}


//we could replace that with sunday...but here it is so far not neccessary...so we use that slow method
String.prototype.hasSubstring = function ( Substring )
{
    var Index
    var SubstringIndex
    if ( 'string' === typeof Substring && false === Substring.isEmpty() )
    {
        return false
    }

    if ( this.length < Substring.length )
    {
        return false
    }

    if ( this.length === Substring.length && this === Substring )
    {
        return true
    }

    for ( Index = 0; this.length > Index; Index++ )
    {
        for ( SubstringIndex = 0; Substring.length > SubstringIndex; SubstringIndex++ )
        {
            if ( Substring[SubstringIndex] !== this[Index+SubstringIndex] )
            {
                break;
            }
        }
    }

    return false

}

String.prototype.isEmpty = function ()
{
    return 0 === this.length
}

Array.isEmpty = function( Self )
{
    return 0 === Self.length
}

function assert( Condition )
{
    if ( false === Condition )
    {
        throw new AssertErrorException('Failed condition')
    }
}

Vue.mixin({
    methods:
    {
        evaluateRequest: async function( Response, Error, Hook )
        {
            while( true === this.isEmpty(Response) )
            {
                await this.sleep(10)
            }

            if ( false === this.isEmpty(Error) )
            {
                throw new RuntimeErrorException(Error)
            }

            Hook(Response)
        },
        getExtern: async function( File, Hook )
        {
            var Error
            var Response
            Axios.get(File).then(response => (Response = response)).catch(error => (Error = Error))
            this.evaluateRequest(Response, Error, Hook)
        },
        getIntern: async function ( File, Hook )
        {
            var Response
            var Error
            Response = await import('' + File).catch(error => (Error = error))

            this.evaluateRequest(Response, Error, Hook)
        },
        get: function( File, Hook )
        {
            if(true === File.startsWith('http://'))
            {
                this.getExtern(File, Hook)
            }
            else
            {
                this.getIntern(File, Hook)
            }
        },
        isEmpty: function( Str )
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
                else if( true === Array.isArray(Str) )
                {
                    return Array.isEmpty(Str)
                }
                else if( 'object' === typeof Str )
                {
                    return Object.isEmpty(Str)
                }
                else
                {
                    return false
                }
            }
        },
        sleep: function( Milliseconds )
        {
            return new Promise(resolve => setTimeout(resolve, Milliseconds))
        }
    }
})

export default
{
    name: 'BlubberUtils'
}
</script>
