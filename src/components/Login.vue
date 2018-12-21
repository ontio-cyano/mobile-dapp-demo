<template>
    <div>
        <p> This is Login Page </p>
        <p>{{status}}</p>
        <button @click="handleLogin">Login by signed message</button>
        <br>
        <br>
        <button @click="handleGetAccount">Login by getAccount</button>
    </div>
</template>

<script>
// const Ont = require('ontology-ts-sdk')
import {Crypto, utils} from 'ontology-ts-sdk'
export default {
    name: 'Login',
    data() {
        return {
            status: ''
        }
    },
    mounted() {

        // register login callback
        /**
         * 在组件加载完后注册事件监听。我们约定发送的消息是经过转字符串 --》encodeURIComponent --》转base64处理的，
         * 在接收消息时都要做同样的相反的处理。
         */
        // this.ep.on('OntMessage', (message) => {
        //     console.log('handle login: ' + message)
        //     const res = JSON.parse(decodeURIComponent(atob(message)));
        //     if(res.action === 'getAccount') {
        //         this.handleGetAccountReturn(res)
        //     } else if(res.action === 'login') {
        //         this.handleLoginReturn(res)
        //     }
        // })

        const handler = (res) => {
            if(res.action === 'getAccount') {
                this.handleGetAccountReturn(res)
            } else if(res.action === 'login') {
                this.handleLoginReturn(res)
            }
        }
        this.cyanoBridge.onMessage(handler);
        //
        // this.ee.on('OntMessage', (message) => {})
    },
    methods: {
        handleLogin() {
            // const req = {
            //     action: 'login',
            //     version: 'v1.0.0',
            //     params: {
            //         type: 'account',
            //         dappName: 'My dapp',
            //         dappIcon: 'some url of the dapp icon',
            //         message: 'test message',
            //         expired: new Date().getTime(),
            //         callback: ''
            //     }
            // }
            // const msg = btoa(encodeURIComponent(JSON.stringify(req))); 
            // /**
            //  * 我们构造好的消息，加上我们约定协议'ontprovider://ont.io?'后就可以发送给原生客户端
            //  * 发送的方式我们不限制，只要原生能够拦截处理即可。比如
            //  * 1. window.location.href = uri
            //  * 2. window.postMessage
            //  * 3. window.prompt
            //  * 这里我们以window.prompt为例。
            //  */
            // const uri = 'ontprovider://ont.io?params='+msg;
            // this.status = 'Loading...'
            // window.prompt(uri);
            const  params = {
                    type: 'account',
                    dappName: 'My dapp',
                    dappIcon: 'some url of the dapp icon',
                    message: 'test message',
                    expired: new Date().getTime(),
                    callback: ''
                }
            const uri =this.cyanoBridge.login(params);
            this.status = 'Loading...'
            // window.prompt(uri);
        },
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
        handleGetAccount() {
            // const req = {
            //     action: 'getAccount',
            //     version: 'v1.0.0',
            //     params: {
            //         dappName: 'my dapp',
            //         dappIcon: 'some url of dapp icon'
            //     }
            // }
            // const msg = btoa(encodeURIComponent(JSON.stringify(req))); 
            // const uri = 'ontprovider://ont.io?params='+msg;
            // this.status = 'Getting account...'
            // window.prompt(uri);
            const params = {
                dappName: 'dapp name',
                dappIcon: 'dapp icon'
            }
            const uri = this.cyanoBridge.getAccount();
            this.status = 'Getting account...'
            // window.prompt(uri);
        },
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
    }
}
</script>
