<script>
import Vue from 'vue'
import Axios from 'axios'

class RuntimeErrorException
{
  constructor(Message)
  {
    this.Name = "RuntimeErrorException"
    this.Message = Message
  }
}

Vue.mixin({
  methods:
  {
    getExtern: async function(File, Hook)
    {
      var Error
      var Response

      Axios.get(File).then(response => (Response = response)).catch(error => (Error = Error))

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
    getIntern: async function (File, Hook)
    {
      var Response
      var Error
      Response = await import('' + File).catch(error => (Error = error))

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
          return 0 === Str.length
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

export default {
  name: 'BlubberUtils'
}
</script>
