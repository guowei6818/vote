<!--
 * @Author: your name
 * @Date: 2019-11-16 20:17:42
 * @LastEditTime: 2019-11-16 21:10:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \Vote\voter\src\App.vue
 -->
<template>
  <div id="app">
    <Vote />
  </div>
</template>

<script>
import Vote from './components/Vote.vue';

export default {
  name: 'app',
  components: {
    Vote,
  },
};
</script>
<style lang="scss">

</style>
