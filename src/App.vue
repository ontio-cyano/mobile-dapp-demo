<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>
<script>
// import {utils} from 'ontology-ts-sdk'

// var EventEmitter = new utils.EventEmitter();
// EventEmitter.on('login_callback', (message) => {
//   console.log(message)
// })

// EventEmitter.on('scInvoke_callback', (message) => {
//   console.log(message)
// })


export default {
  name: 'App'
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
