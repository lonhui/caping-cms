<template>
  <news :is-edit="true" :is-draft="true"></news>
</template>

<script>
  import news from './components/news'

  export default {
    components: { news }
  }
</script>
