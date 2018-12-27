<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
      <p class="label">已登录账户: {{address}}</p>
    <div class="border">
      <!-- invoke -->
        <div >
          <p> <span class="label"> Contract hash: </span> cd948340ffcf11d4f5494140c93885583110f3e9</p>
          <p> <span class="label"> Operation:  </span> transferNativeAsset</p>
          <p class="label"> Params: </p>
          <textarea name="" id="" cols="50" rows="10" v-model="functions"></textarea>
     
        </div>
        <button @click="invokeSc">Invoke SC</button>
        <p> <span class="label">Result: </span> {{invokeRes}}</p>
    </div>
    <!-- invokeRead -->
    <div class="border">
      <div>
          <p><span class="label"> Contract hash: </span> b5a1f2cd4e27b7453111a2f5eb737714ead8fded</p>
          <p><span class="label"> Operation:  </span>balanceOf</p>
          <p class="label"> Params: </p>
          <textarea name="" id="" cols="50" rows="10" v-model="invokeReadFunctions"></textarea>
     
        </div>
        <button @click="invokeRead">InvokeRead SC</button>
        <p><span class="label">Result: </span> {{invokeReadRes}}</p>
    </div>
      
  </div>
</template>

<script>
// const client = require('../../static/index').client;
import { client } from 'cyanobridge'

export default {
  name: 'HelloWorld',
  data () {
  const address = sessionStorage.getItem('address')
    return {
      functions: `[{
          "name": "arg0",
          type: 'String',
          "value": "ong"
        }, {
          "name": "arg1",
          type: 'Address',
          "value": address
        }, {
          "name": "arg2",
          type: 'Address',
          "value": "AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ"
        }, {
          "name": "arg3",
          type: 'Integer',
          "value": 1
        }]`,
      msg: 'Hello world',
      address,
      invokeRes: '',

    invokeReadFunctions: ` [{
          "name": "account",
          "type" : 'Address',
          "value": "AQf4Mzu1YJrhz9f3aRkkwSm9n3qhXGSh4p"
        }]`,
    invokeReadRes: ''

    }
  },
  mounted() {
 
  },
  methods: {
    async invokeSc() {
      const address = sessionStorage.getItem('address')
      const scriptHash = 'cd948340ffcf11d4f5494140c93885583110f3e9';
      const operation = 'transferNativeAsset';
      const args = [{
          "name": "arg0",
          type: 'String',
          "value": "ong"
        }, {
          "name": "arg1",
          type: 'Address',
          "value": address
        }, {
          "name": "arg2",
          type: 'Address',
          "value": "AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ"
        }, {
          "name": "arg3",
          type: 'Integer',
          "value": 1
        }]
        const gasPrice = 500;
        const gasLimit = 20000;
        const payer = address;
        const config = {
          "login": true,
          "message": "invoke smart contract test",
          "url": ""
        }
        const params = {
          scriptHash,
          operation,
          args,
          gasPrice,
          gasLimit,
          payer,
          config
        }
        try{
          const res = await client.api.smartContract.invoke(params);
          console.log('dapp receive: ' + JSON.stringify(res));
          this.handleInvokeResponse(res);
        }catch(err) {
          console.log(err);
        }
    },
    handleInvokeResponse(res) {
      // dapp logic here
      this.invokeRes = JSON.stringify(res);
      console.log('get handled message: '+ JSON.stringify(res))
    },

    async invokeRead() {
      const scriptHash = 'b5a1f2cd4e27b7453111a2f5eb737714ead8fded';
      const operation = 'balanceOf';
      const args = [{
          "name": "account",
          "type" : 'Address',
          "value": "AQf4Mzu1YJrhz9f3aRkkwSm9n3qhXGSh4p"
        }]
        const gasPrice = 500;
        const gasLimit = 20000;
        const config = {
          "login": true,
          "message": "invoke read smart contract test",
          "url": ""
        }
        const params = {
          scriptHash,
          operation,
          args,
          gasPrice,
          gasLimit,
          config
        }
        try{
          const res = await client.api.smartContract.invokeRead(params);
          console.log('dapp receive: ' + JSON.stringify(res));
          this.invokeReadRes = JSON.stringify(res);
        }catch(err) {
          console.log('err:' + JSON.stringify(err));
        }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.label {
  font-weight: bold;
}
.border {
  padding: 10px;
  border: 1px solid #dddddd;
  width: 700px;
  margin:10px auto;
}

@media only screen and (max-width: 768px) {
  p {
    text-align: left;
    margin-bottom: 5px;
  }
.border {
  border: 1px solid #dddddd;
  width: 90%;
  margin: 10px auto;
}
}
</style>
