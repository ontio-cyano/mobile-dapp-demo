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

### 1. 注册`CyanoBridge`的实例

将CyanoBridge实例注册到Vue.prototype上，这样在项目里可以使用`this.cyanoBridge`来方便调用其api。
相关代码在`src/main.js`

```
var cyanoBridge = new CyanoMobile.CyanoBridge()
Vue.prototype.cyanoBridge = cyanoBridge;
```

### 2. getAccount (getIdentity同理)

相关代码在`src/components/login.vue` 

#### 发送消息getAccount

```
async handleGetAccount() {
            const params = {
                dappName: 'dapp name',
                dappIcon: 'dapp icon'
            }
            try{
                const res = await this.cyanoBridge.getAccount();
                this.status = 'Getting account...'
                this.handleGetAccountReturn(res);
            }catch(err) {
                console.log(err)
                 alert(err)
            } 
        },
```


### 3. login

#### 发送login消息

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
                const res = await this.cyanoBridge.login(params);
                this.status = 'Loading...'
                this.handleLoginReturn(res);
            } catch(err) {
                console.log(err)
                alert(err)
            }
        },
```


### 4. invoke smart contract

#### 发送invoke sc消息

```
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
```
