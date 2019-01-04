<template>
  <div class="hello">
      <p class="label">已登录账户: {{address}}</p>
    <div class="border">
      <!-- invoke -->
        <div >
          <p> <span class="label"> Contract hash: </span> cd948340ffcf11d4f5494140c93885583110f3e9</p>
          <p> <span class="label"> Operation:  </span> transferNativeAsset</p>
          <p class="label"> Params: </p>
          <textarea name="" id="" cols="50" rows="10" v-model="functions"></textarea>
          <div>
            <label for="" class="label">Transfer amount</label> 
            <input type="text" v-model="amount" @change="handleChangeAmount">
          </div>
        </div>
        <div>
          <input type="checkbox" v-model="auto" @change="handleChangeAuto" style="font-size:20px;">
          <label for="">Automatically invoke sc in every 3 seconds</label>
        </div>
        <button @click="handleInvokeSc" :disabled="auto">Invoke SC</button>
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
        <button @click="handleInvokeRead">InvokeRead SC</button>
        <p><span class="label">Result: </span> {{invokeReadRes}}</p>
    </div>
      
  </div>
</template>

<script>
const client = require('../../static/index').client;
// import { client } from 'cyanobridge'

export default {
  name: 'HelloWorld',
  data () {
  const address = sessionStorage.getItem('address')
    return {
      address,
      amount: 1,
      functions: '',
      msg: 'Hello world',
      address,
      invokeRes: '',

    invokeReadFunctions: ` [{
          "name": "account",
          "type" : 'Address',
          "value": "AQf4Mzu1YJrhz9f3aRkkwSm9n3qhXGSh4p"
        }]`,
    invokeReadRes: '',
    auto: false

    }
  },
  mounted() {
      this.handleInvokeScParams();
  },
  methods: {
    handleInvokeScParams() {
      const amount = this.amont*1e9; // ONG has decimal 1e9
      this.functions = `[{
          "name": "arg0",
          type: 'String',
          "value": "ong"
        }, {
          "name": "arg1",
          type: 'Address',
          "value": ${this.address}
        }, {
          "name": "arg2",
          type: 'Address',
          "value": "AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ"
        }, {
          "name": "arg3",
          type: 'Integer',
          "value": ${amount}
        }]`
    },
    handleChangeAmount() {
      this.handleInvokeScParams();
    },
    async handleInvokeSc() {
      const amount = this.amount*1e9; // ONG has decimal 1e9
      const scriptHash = 'cd948340ffcf11d4f5494140c93885583110f3e9';
      const operation = 'transferNativeAsset';
      const args = [{
          "name": "arg0",
          type: 'String',
          "value": "ong"
        }, {
          "name": "arg1",
          type: 'Address',
          "value": this.address
        }, {
          "name": "arg2",
          type: 'Address',
          "value": "AecaeSEBkt5GcBCxwz1F41TvdjX3dnKBkJ"
        }, {
          "name": "arg3",
          type: 'Integer',
          "value": amount
        }]
        const gasPrice = 500;
        const gasLimit = 20000;
        const payer = this.address;
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
        
        // handle invoke sc 
        if(this.auto) {
          const res = await this.invokePasswordFree(params);
          console.log('first res: ' + JSON.stringify(res))
          // 第一次invokePasswordFree，成功后定时发送交易
          if (res && res.error === 0) {
            this.invokeInterval = setInterval( async ()=> {
              const res = await this.invokePasswordFree(params)
              console.log('afterwords res: ' + JSON.stringify(res))
              // 后续invokePasswordFree, 取消定时发送交易
              if (!res || res.error !== 0) {
                clearInterval(this.invokeInterval)
                return;
              }
            }, 30000)
          }
          
        } else {
          this.invokeSc(params);
        }
    },
    async invokeSc(params) {
      try{
            const res = await client.api.smartContract.invoke(params);
            console.log('dapp receive: ' + JSON.stringify(res));
            this.handleInvokeResponse(res);
          }catch(err) {
            console.log(JSON.stringify(err));
          }
    },
    async invokePasswordFree(params) {
      try{
        const accountRes = await client.api.asset.getAccount();
        console.log('getAccount before invoke: ' + JSON.stringify(accountRes))
        if(!accountRes.result) {
          alert('Invoke getAccount failed')
          return;
        }

        const res = await client.api.smartContract.invokePasswordFree(params);
        console.log('dapp receive: ' + JSON.stringify(res));
        this.handleInvokeResponse(res);
        return res;
      }catch(err) {
        console.log(JSON.stringify(err));
      }
    },
    handleInvokeResponse(res) {
      // dapp logic here
      this.invokeRes = JSON.stringify(res);
      console.log('get handled message: '+ JSON.stringify(res))
    },

    async handleInvokeRead() {
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
    },

    handleChangeAuto() {
      if(!this.auto) {
        clearInterval(this.invokeInterval);
      }
      if(this.auto) {
        this.handleInvokeSc();
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

button:disabled {
  background:#dddddd;
  cursor:not-allowed;
}
</style>
