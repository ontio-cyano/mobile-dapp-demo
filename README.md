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

## 关键原理

关键是实现dapp（webview）与原生客户端的通信。我们制定了接口规范，dapp根据接口定义，发送特定消息给原生，原生拦截到消息，处理后发送回dapp。dapp需要首先注册好事件监听，原生通过调用js函数，触发事件，将处理结果返回给dapp。demo里有具体实现可以参考。

这里需要注意的地方有：

1. 发送的消息需要经过JSON转字符串 --》encodeURIComponent 字符串 —》字符串转base64 的处理过程。接收消息后也需要经过同样相反顺序的处理。

2. dapp发送消息给原生的方式没有限制，常用的有 

   * window.location.href = uri;
   * window.postMessage
   * window.prompt

   我们的demo里使用的是window.prompt

3. dapp需要首先在全局变量里注册好事件监听，原生通过触发事件，把处理结果返回给dapp。demo里使用了第三方库eventproxy来注册监听事件，通过让原生调用js的全局方法触发事件。

## API说明

### 1. getAccount (getIdentity同理)

相关代码在`src/components/login.vue` 

#### 发送消息getAccount

```
handleGetAccount() {
            const req = {
                action: 'getAccount',
                version: 'v1.0.0',
                params: {
                    dappName: 'my dapp',
                    dappIcon: 'some url of dapp icon'
                }
            }
            const msg = btoa(encodeURIComponent(JSON.stringify(req))); 
            const uri = 'ontprovider://ont.io?params='+msg;
            this.status = 'Getting account...'
            window.prompt(uri);
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



### 2. login

#### 发送login消息

```
 handleLogin() {
            const req = {
                action: 'login',
                version: 'v1.0.0',
                params: {
                    type: 'account',
                    dappName: 'My dapp',
                    dappIcon: 'some url of the dapp icon',
                    message: 'test message',
                    expired: new Date().getTime(),
                    callback: ''
                }
            }
            const msg = btoa(encodeURIComponent(JSON.stringify(req))); 
            /**
             * 我们构造好的消息，加上我们约定协议'ontprovider://ont.io?'后就可以发送给原生客户端
             * 发送的方式我们不限制，只要原生能够拦截处理即可。比如
             * 1. window.location.href = uri
             * 2. window.postMessage
             * 3. window.prompt
             * 这里我们以window.prompt为例。
             */
            const uri = 'ontprovider://ont.io?params='+msg;
            this.status = 'Loading...'
            window.prompt(uri);
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



### 3. invoke smart contract

#### 发送invoke sc消息

```
invokeSc() {
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
      console.log(JSON.stringify(params))
      const msg = btoa(encodeURIComponent(JSON.stringify(params))); 
      const uri = 'ontprovider://ont.io?params='+msg;
      window.prompt(uri)
    },
```

#### 接收invoke sc返回消息

```
handleMessage(message) {
      // dapp logic here
      console.log('get handled message: '+ JSON.stringify(message))
    }
```

