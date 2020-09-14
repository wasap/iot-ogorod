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
      await this.$api.post(`/devices/${this.device.id}`, {
        on: value,
        disableDate:
          moment(this.disableDate) > moment() ? this.disableDate : undefined,
      })
      this.$emit('refresh')
    },
    changeDisableDate(val) {
      this.disableDate = moment()
        .add(val.slice(0, 2), 'h')
        .add(val.slice(3, 5), 'm')
        .add(val.slice(-2), 's')
    },
    calcDisableRange() {
      console.log('calc')
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
      console.log(this.device.on)
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
