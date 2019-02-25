<style scoped>
.item {
    border: 1px solid #dddddd;
    padding: 20px;
    margin: 10px 0;
}
.title {
    font-size: 18px;
    color:#000000;
    font-weight: bold;
    margin-bottom: 15px;
}
.input-ontid {
    border: 1px solid #dddddd;
    height:30px;
    width:300px;
    margin-bottom: 10px;
}
.form-item {
    width:100%;
    text-align: left;
    margin-bottom: 10px;
}
.form-item label {
    font-weight: bold;
    margin-right:10px;
}
.form-item input {
    display: inline-block;
    width:60%;
    text-indent: 5px;
    height:30px;
    border:1px solid #dddddd;
    text-indent: 5px;
}
.form-item select {
    height:30px;
    border:1px solid #dddddd;
}
</style>

<template>
    <div>
        <div class="item">
            <p class="title"> Test  Account & Smart contract</p>
            <p>{{status}}</p>
            <button @click="handleLogin">Login by signed message</button>
            <br>
            <br>
            <button @click="handleGetAccount">Login by getAccount</button>
        </div>

        <div class="item">
            <p class="title">
                Test Transfer Asset
            </p>
            <div class="form-item">
                <label for="">Sender:</label>
                <input type="text" v-model="sender" readonly>
            </div>
            <div class="form-item">
                <label for="">Asset Type:</label>
                <select name="" id="" v-model="tokenType">
                    <option value="ONT">ONT</option>
                    <option value="ONG">ONG</option>
                </select>
            </div>
            <div class="form-item">
                <label for="">Amount:</label>
                <input type="text" v-model="amount" >
            </div>
            <div class="form-item">
                <label for="">Receiver:</label>
                <input type="text" v-model="receiver">
            </div>
            <button @click="handleSend">Send</button>
            
        </div>
        
        <div class="item">
            <p class="title"> Test ONT ID Authentication & Authorization</p>
            <button @click="handleAuthentication">Get Identity</button>
            <br>
            <br>
            <div>
                <p>Input your ONT ID:</p>
                <input type="text" v-model="ontid" class="input-ontid" readonly>
            </div>
            <button @click="handleAuthorization">Authorization</button>
        </div>

    </div>
</template>

<script>
// const Ont = require('ontology-ts-sdk')
import {Crypto, utils} from 'ontology-ts-sdk'
const client = require('../../static/index').client;
// import { client } from 'cyanobridge'

export default {
    name: 'Login',
    data() {
        return {
            status: '',
            ontid: '',
            tokenType: 'ONT',
            amount: 0,
            sender: '',
            receiver: ''
        }
    },
    async mounted() {
        // get account and set as sender
        try {
            const res = await client.api.asset.getAccount();
            if(res.error === 0){
                this.sender = res.result
            }
       }catch(err) {
           console.log(err)
       }
        
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
                const pk = new Crypto.PublicKey(result.publickey)
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
        },

        /**
         * 调用cyanobridge 接口获取身份，如果有没有则进入ONT ID创建和身份认证过程。
         */
        async handleAuthentication() {
            const res = await client.api.identity.authentication({
               subaction: 'getIdentity'
            })
            if(res && res.error ==0) {
                this.ontid = res.result
            }
        },
        /**
         * 调用cyanobridge 接口请求授权,授权结果最终保存在dapp后台。再次打开dapp时从后台获取授权结果。
         * 需要根据ONTPass的规范填参数
         */
        async handleAuthorization() {
            if(!this.ontid) {
                alert('No user ontid')
                return;
            };
            const dappUrl = window.location.href;
            const params = {
                "subaction": "requestAuthorization",
                "seqNo": "0001",
                "userOntid": this.ontid, // for test
                "dappOntid": "did:ont:AL2yjtLZJmRmQ4muFiVexYcyVsYb4DkyYL", // for test
                "dappName": "candy box",
                "callback": "http://cybox.com/callbackand",
                "dappUrl": dappUrl, // for test
                "authTemplate": "authtemplate_kyc01"
            }
            const res = await client.api.identity.authorization(params)
        },

        async handleSend() {
            if(!this.sender || !this.amount || !this.receiver) {
                alert('Please fill the blank fields.')
                return;
            }
            const params = {
                from: this.sender,
                to: this.receiver,
                asset: this.tokenType,
                amount: this.tokenType === 'ONG' ? parseInt(this.amount)*1e9 : this.amount,
                gasPrice: 500,
                gasLimit: 20000
            }
            try {
                const res = await client.api.asset.transfer(params);
                    console.log(res)
                if(res.error === 0) {
                    alert('Transaciton has been sent. The transaction hash is: ' + res.result)
                }
            } catch(err) {
                console.log(err)
            }
        }
    }
}
</script>
