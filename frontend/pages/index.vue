<template>
  <div>
    <h4>Устройства</h4>
    <device
      v-for="device in devices"
      :key="device.id"
      :device="device"
      @refresh="getDevices"
    />
  </div>
</template>

<script>
import Device from '@/components/device'
export default {
  components: { Device },
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
