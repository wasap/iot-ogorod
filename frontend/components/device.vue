<template>
  <div class="device">
    <div>
      <img :src="device.img" class="device-img" />
    </div>
    <div class="device-status">
      {{ device.name }}
      <i-switch :value="isOn" @on-change="toggleDevice"></i-switch>
    </div>
    <div v-if="device.on">
      <div v-if="disableRange">выключится через {{ disableRange }}</div>
    </div>
    <TimePicker
      v-else
      type="time"
      placeholder="Выключить через"
      style="width: 168px"
      @on-change="changeDisableDate"
    ></TimePicker>
  </div>
</template>

<script>
import moment from 'moment'
export default {
  props: ['device'],
  data() {
    return {
      disableDate: null,
      disableRange: '',
      clearInterval: null,
    }
  },
  computed: {
    isOn() {
      if (this.device.on && !this.device.disableDate) return true
      return this.device.on && moment(this.device.disableDate) >= moment()
    },
  },
  watch: {
    'device.on'() {
      this.startInterval()
      this.disableDate = ''
      this.disableRange = ''
    },
  },
  mounted() {
    this.startInterval()
  },
  beforeDestroy() {
    clearInterval(this.clearInterval)
  },
  methods: {
    async toggleDevice(value) {
      const disableDate =
        moment(this.disableDate) > moment() ? this.disableDate : undefined
      try {
        await this.$api.post(`/devices/${this.device.id}`, {
          on: value,
          disableDate,
          disableSecs: disableDate
            ? Math.ceil(moment(disableDate).diff(moment()) / 1000)
            : undefined,
        })
        this.$emit('refresh')
      } catch (e) {
        this.$Message.error({
          content: JSON.stringify(e.response || e),
          duration: 10,
          closable: true,
        })
      }
    },
    changeDisableDate(val) {
      this.disableDate = moment()
        .add(val.slice(0, 2), 'h')
        .add(val.slice(3, 5), 'm')
        .add(val.slice(-2), 's')
    },
    calcDisableRange() {
      if (!this.device.disableDate) {
        this.disableDate = ''
        return
      }

      const duration = moment.duration(
        moment(this.device.disableDate).diff(moment())
      )
      if (duration.asMilliseconds() <= 0) {
        this.device.on = false
        this.disableDate = ''
        return
      }
      this.disableRange = `${Math.floor(duration.asHours())}:${Math.floor(
        duration.asMinutes() % 60
      )}:${Math.floor((duration.asSeconds() % 3600) % 60)}`
    },
    startInterval(on) {
      if (this.device.on) {
        if (this.device.disableDate)
          this.clearInterval = setInterval(this.calcDisableRange, 1000)
      } else {
        clearInterval(this.clearInterval)
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.device {
  padding: 8px 0;
  &-img {
    max-width: 100px;
    max-height: 100px;
  }
  &-status {
    padding: 8px 0;
  }
}
</style>
