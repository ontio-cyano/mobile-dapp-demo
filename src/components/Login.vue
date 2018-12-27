<template>
    <div>
        <p> This is Login Page new </p>
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
// const client = require('../../static/index').client;
import { client } from 'cyanobridge'

export default {
    name: 'Login',
    data() {
        return {
            status: ''
        }
    },
    mounted() {

    },
    methods: {
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
        async handleGetAccount() {
            const params = {
                dappName: 'dapp name',
                dappIcon: 'dapp icon'
            }
            try{
                // const res = await this.cyanoBridge.getAccount();
                const res = await client.api.asset.getAccount(params);
                this.status = 'Getting account...'
                this.handleGetAccountReturn(res);
            }catch(err) {
                console.log(err)
                 alert(err)
            } 
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
