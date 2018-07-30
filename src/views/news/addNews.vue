<template>
  <news :is-edit="false" :is-draft="false"></news>
</template>

<script>
  import news from './components/news'

  export default {
    components: { news }
  }
</script>
