<template>
  <news :is-edit="true" :is-draft="false"></news>
</template>

<script>
  import news from './components/news'

  export default {
    components: { news }
  }
</script>
