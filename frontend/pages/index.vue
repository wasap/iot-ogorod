<template>
  <div>
    <h4>Список устройств</h4>
  </div>
</template>

<script>
export default {
  async asyncData({ $api }) {
    const devices = await $api.$get('/devices')
    return {
      devices,
    }
  },
}
</script>
