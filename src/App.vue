<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>
<script>

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
  margin-top: 10px;
}
 img {
  width: 100px;
}
p {
  margin:0;
  white-space: normal;
  word-break: break-word;
  word-wrap: break-word;
}
button {
  border: 1px solid green;
  background:#ffffff;
  padding: 5px 10px;
}
</style>
