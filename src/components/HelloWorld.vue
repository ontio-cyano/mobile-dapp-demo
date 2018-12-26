<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <p>已登录账户: {{address}}</p>
      <p>Contract hash: cd948340ffcf11d4f5494140c93885583110f3e9</p>
      <p>
        <textarea name="" id="" cols="50" rows="10" v-model="functions"></textarea>
      </p>
     
    </div>
    <button @click="invokeSc">Invoke SC</button>
     
     <p>Result: {{invokeRes}}</p>
  </div>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
  const address = sessionStorage.getItem('address')
    return {
      functions: `[{
 "operation": "transferNativeAsset",
 "args": [{
  "name": "arg0",
  "value": "String:ont"
 }, {
  "name": "arg1",
  "value": "Address:${address}" 
 }, {
  "name": "arg2",
  "value": "Address:AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ"
 }, {
  "name": "arg3",
  "value": 10
 }]
}]`,
      msg: 'Hello world',
      address,
      invokeRes: ''
    }
  },
  mounted() {
 
  },
  methods: {
    async invokeSc() {
      const address = sessionStorage.getItem('address')
      const params = {
        "action": "invoke",
        "params": {
          "login": true,
          "message": "invoke smart contract test",
          "invokeConfig": {
            "contractHash": "cd948340ffcf11d4f5494140c93885583110f3e9",
            "functions": JSON.parse(this.functions),
            "gasLimit": 20000,
            "gasPrice": 500,
            "payer": address
          }
        }
      }
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
        try{
          const res = await this.cyanoBridge.invoke(scriptHash, operation, args, gasPrice, gasLimit, payer, config);
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
</style>
