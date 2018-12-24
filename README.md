# onto-dapi-demo

> A Vue.js project

实现Cyano移动端协议的demo。

这个demo适用于在ONTO或其他钱包应用中打开的dapp。dapp可以是任何web应用，原生应用需要集成了Ontology的SDK，实现了Cyano的provider功能，处理dapp的请求。现在可用的SDK有android sdk, ts sdk。

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

## 工作原理

关键是实现dapp（webview）与原生客户端的通信。我们制定了接口规范，dapp根据接口定义，发送特定消息给原生，原生拦截到消息，处理后发送回dapp。
webview和原生通信都是通过 `window.postMessage` 的方式。

我们提供了dapp端的工具类`CyanoBridge`，负责包装dapi请求，并通过`window.postMessage`的方式发送给Provider（原生应用）。我们也会提供原生应用端Provider的sdk，用于接收和处理请求，并将结果通过`window.postMessage` 的形式发送给dapp端。`CyanoBridge`可以用来监听`message`事件，接收到Provider返回的响应。

## API说明

### 1. 注册`CyanoBridge`的实例

将CyanoBridge实例注册到Vue.prototype上，这样在项目里可以使用`this.cyanoBridge`来方便调用其api。
相关代码在`src/main.js`

```
var cyanoBridge = new mdApi.CyanoBridge()
Vue.prototype.cyanoBridge = cyanoBridge;
```

### 2. getAccount (getIdentity同理)

相关代码在`src/components/login.vue` 

#### 发送消息getAccount

```
handleGetAccount() {
            const params = {
                dappName: 'dapp name',
                dappIcon: 'dapp icon'
            }
            this.cyanoBridge.getAccount();
        },
```

#### 注册事件回调

我们在`mounted`这个组件生命周期里注册事件回调，用来处理响应。

```
mounted() {
    const handler = (res) => {
        if(res.action === 'getAccount') {
            this.handleGetAccountReturn(res)
        } else if(res.action === 'login') {
            this.handleLoginReturn(res)
        }
    }
    this.cyanoBridge.onMessage(handler);
},
```

#### 接收getAccount返回

```
handleGetAccountReturn(res) {
            console.log('in handling login'+ JSON.stringify(res));
            if(res.error === 0) {
                const address = res.result;
                sessionStorage.setItem('address', address)
                this.$router.push({name: 'HelloWorld'})
            } else {
                console.log(res.result)
            }
        }
```



### 3. login

#### 发送login消息

```
 handleLogin() {
    const  params = {
            type: 'account',
            dappName: 'My dapp',
            dappIcon: 'some url of the dapp icon',
            message: 'test message',
            expired: new Date().getTime(),
            callback: ''
        }
    this.cyanoBridge.login(params);
},
```

#### 接收login返回消息

```
handleLoginReturn(res) {
            console.log('in handling login'+ JSON.stringify(res));
            if(res.error === 0) {
                this.status = 'Verifying signature...'
                // verify signature
                const result = res.result
                const pk = new Crypto.PublicKey(result.publicKey)
                const message = utils.isHexString(result.message) ? result.message : utils.str2hexstr(result.message);
                const signature = Crypto.Signature.deserializeHex(result.signature)
                const verified = pk.verify(message, signature)
                if(verified) {
                    const address = res.result.address;
                    sessionStorage.setItem('address', address)
                    this.$router.push({name: 'HelloWorld'})
                } else {
                    console.log('verify failed')
                    alert('verify failed')
                }
            } else {
                console.log(res.result)
            }
        },
```



### 4. invoke smart contract

#### 发送invoke sc消息

```
invokeSc() {
      const scriptHash = 'cd948340ffcf11d4f5494140c93885583110f3e9';
      const operation = 'transferNativeAsset';
      const args = [{
          "name": "arg0",
          type: 'String',
          "value": "ont"
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
          "value": 10
        }]
        const gasPrice = 500;
        const gasLimit = 20000;
        const payer = address;
        const config = {
          "login": true,
          "message": "invoke smart contract test",
          "url": ""
        }
        this.cyanoBridge.invoke(scriptHash, operation, args, gasPrice, gasLimit, payer, config);
    },
```

#### 注册回调和处理返回

```
 mounted() {
    const handler = (res) => {
            this.handleInvokeResponse(res);
        }
    this.cyanoBridge.onMessage(handler);
  },
```

```
handleInvokeResponse(res) {
      // dapp logic here
      this.invokeRes = JSON.stringify(res);
      console.log('get handled message: '+ JSON.stringify(res))
    }
```

