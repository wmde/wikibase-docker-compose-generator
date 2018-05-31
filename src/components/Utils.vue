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
<<<<<<< HEAD
        super( "RuntimeErrorException", Message )
    }
}

class ValueErrorException extends BaseException
{
    constructor( Message )
    {
      super( "ValueErrorException", Message )
=======
        super("RuntimeErrorException", Message)
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
    }
}

class AssertErrorException extends BaseException
{
    constructor( Message )
    {
<<<<<<< HEAD
        super( "AssertErrorException", Message )
    }
}

Object.size = function ( Self )
=======
        super("AssertErrorException", Message)
    }
}

Object.size = function( Self )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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

<<<<<<< HEAD
Object.isEmpty = function ( Self )
=======
Object.isEmpty = function( Self )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
{
    return 0 === Object.size(Self)
}

<<<<<<< HEAD
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
=======
Object.copy = function( Self,  Depth = -1 )
{
    var Dolly = Object.assign({}, Self)
    var Key
    if(0 === Depth )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
    {
        return Dolly
    }

<<<<<<< HEAD
    for ( Key in Dolly )
=======
    for( Key in Dolly )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
    {
        if( 'object' === typeof Dolly[Key] )
        {
            Dolly[Key] = Object.copy(Dolly[Key], Depth-1)
        }
    }

    return Dolly
}

<<<<<<< HEAD
Object.merge = function ( Object1, Object2, KeepOrign = true )
=======
Object.merge = function( Object1, Object2, KeepOrign = true )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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

<<<<<<< HEAD
String.prototype.hasSubstring = function ( Substring )
{
   return String.includes( Substring )
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
=======

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

>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
}

String.prototype.isEmpty = function ()
{
    return 0 === this.length
}

<<<<<<< HEAD
Array.isEmpty = function ( Self )
=======
Array.isEmpty = function( Self )
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
{
    return 0 === Self.length
}

<<<<<<< HEAD
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
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
            {
                await this.sleep(10)
            }

<<<<<<< HEAD
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
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
        },
        getIntern: async function ( File, Hook )
        {
            var Response
            var Error
<<<<<<< HEAD
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
=======
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
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
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
<<<<<<< HEAD
                else if ( true === Array.isArray( Str ) )
                {
                    return Array.isEmpty( Str )
                }
                else if ( 'object' === typeof Str )
                {
                    return Object.isEmpty( Str )
=======
                else if( true === Array.isArray(Str) )
                {
                    return Array.isEmpty(Str)
                }
                else if( 'object' === typeof Str )
                {
                    return Object.isEmpty(Str)
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
                }
                else
                {
                    return false
                }
            }
        },
<<<<<<< HEAD
        sleep: function ( Milliseconds )
        {
            return new Promise( Resolve => setTimeout( Resolve, Milliseconds ) )
        },
        debugObjectPrint: function ( Object, Id )
        {
            let Element = document.getElementById(Id)
            Element.innerHTML = '<pre>' + JSON.stringify(Object, undefined, 4) + '</pre>'
=======
        sleep: function( Milliseconds )
        {
            return new Promise(resolve => setTimeout(resolve, Milliseconds))
>>>>>>> 8adcfd1f6651b6fe5c52d4da21f242c4847829dd
        }
    }
})

export default
{
    name: 'BlubberUtils'
}
</script>
