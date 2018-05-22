<script>
import Vue from 'vue'
import Axios from 'axios'

class BaseException
{
    constructor(Name, Message)
    {
        this.Name = Name
        this.Message = Message
        console.trace()
    }
}

class RuntimeErrorException extends BaseException
{
    constructor(Message)
    {
        super("RuntimeErrorException", Message)
    }
}

class AssertErrorException extends BaseException
{
    constructor(Message)
    {
        super("AssertErrorException", Message)
    }
}

Object.size = function(Self)
{
    let Size = 0, Key;
    for (Key in Self)
    {
        if (Self.hasOwnProperty(Key))
        {
            Size++;
        }
    }
    return Size;
}

Object.isEmpty = function(self)
{
    return 0 === Object.size(self)
}

String.isEmpty = function(self)
{
    return 0 === self.length
}

Array.isEmpty = function(self)
{
    return 0 === self.length
}

function assert(Condition)
{
    if (false === Condition)
    {
        throw new AssertErrorException('Failed condition')
    }
}

Vue.mixin({
    methods:
    {
        evaluateRequest: async function(Response, Error, Hook)
        {
            while(true === this.isEmpty(Response))
            {
                await this.sleep(10)
            }
            
            if (false === this.isEmpty(Error))
            {
                throw new RuntimeErrorException(Error)
            }

            Hook(Response)
        },
        getExtern: async function(File, Hook)
        {
            var Error
            var Response
            Axios.get(File).then(response => (Response = response)).catch(error => (Error = Error))
            this.evaluateRequest(Response, Error, Hook)
        },
        getIntern: async function (File, Hook)
        {
            var Response
            var Error
            Response = await import('' + File).catch(error => (Error = error))

            this.evaluateRequest(Response, Error, Hook)
        },
        get: function(File, Hook)
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
        isEmpty: function(Str)
        {
            if ('undefined' === typeof Str || null === Str)
            {
                return true
            }
            else
            {
                if ('string' === typeof Str)
                {
                    return String.isEmpty(Str)
                }
                else if(true === Array.isArray(Str))
                {
                    return Array.isEmpty(Str)
                }
                else if('object' === typeof Str)
                {
                    return Object.isEmpty(Str)
                }
                else
                {
                    return false
                }
            }
        },
        sleep: function(Milliseconds)
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
