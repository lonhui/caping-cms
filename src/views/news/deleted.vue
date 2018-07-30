<template>
  <news-list :status='2'></news-list>
</template>

<script>
  import newsList from './components/newsList'

  export default {
    components: { newsList }
  }
</script>
