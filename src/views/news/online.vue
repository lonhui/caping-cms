<template>
  <news-list :status='8'></news-list>
</template>

<script>
  import newsList from './components/newsList'

  export default {
    components: { newsList }
  }
</script>
