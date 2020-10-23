<template>
  <div>
    <h4>Устройства</h4>
    <component
      :is="device.type"
      v-for="device in devices"
      :key="device.id"
      :device="device"
      @refresh="getDevices"
    />
  </div>
</template>

<script>
import Relay from '@/components/relay'
import Bme280 from '@/components/bme280'
export default {
  components: { Relay, Bme280 },
  async asyncData({ $api }) {
    const devices = await $api.$get('/devices')
    return {
      devices,
    }
  },
  methods: {
    async getDevices() {
      const devices = await this.$api.$get('/devices')
      this.devices = devices
    },
  },
}
</script>
