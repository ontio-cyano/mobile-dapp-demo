# onto-dapi-demo

> A Vue.js project

实现Cyano移动端协议的demo。

这个demo适用于在ONTO或其他钱包应用中打开的dapp。dapp可以是任何web应用，原生应用需要集成了Ontology的SDK，实现了Cyano的provider功能，处理dapp的请求。

## 实现功能

1. login（发送message到原生端用Identity或者Account签名，然后dapp对签名验签，验证通过则成功登录）。
2. getAccount（getIdentity同理）
3. invoke smart contract

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## API说明

### 1. 注册`CyanoBridge`的client

必须在程序初始的地方初始化client。
相关代码在`src/main.js`

```
import { client } from 'cyanobridge'

client.registerClient();
```

### 2. getAccount (getIdentity同理)

相关代码在`src/components/login.vue` 


```
async handleGetAccount() {
            const params = {
                dappName: 'dapp name',
                dappIcon: 'dapp icon'
            }
            try{
                const res = await client.api.asset.getAccount(params);
                this.status = 'Getting account...'
                this.handleGetAccountReturn(res);
            }catch(err) {
                console.log(err)
                 alert(err)
            } 
        },
```


### 3. login

相关代码在`src/components/login.vue` 
```
async handleLogin() {
            const  params = {
                    type: 'account',
                    dappName: 'My dapp',
                    dappIcon: 'some url of the dapp icon',
                    message: 'test message',
                    expired: new Date().getTime(),
                    callback: ''
                }
            try {
                const res = await client.api.message.login(params);
                this.status = 'Loading...'
                this.handleLoginReturn(res);
            } catch(err) {
                console.log(err)
                alert(err)
            }
        },
```


### 4. invoke smart contract

相关代码在`src/components/helloworld.vue` 

```
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
```
### 5. invokeRead smart contract

预执行合约方法。一般用来查询合约数据

```
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
```