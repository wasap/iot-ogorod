<template>
  <div class="device">
    <div class="metrics">
      <div>
        <img :src="device.img" class="device-img" />
        <div class="device-status">
          {{ device.name }}
        </div>
      </div>
      <div @click="drawCharts">
        <div v-if="lastMetrics">
          <div>
            <b>{{ lastMetrics.time }}</b>
          </div>
          <div
            v-for="metric in lastMetrics.metrics"
            :key="metric.value"
            class="last-metric"
            :style="{ borderColor: metric.color }"
          >
            {{ metric.value }}
          </div>
        </div>
        <Button :loading="loading" @click.stop="loadSensor">Обновить</Button>
      </div>
    </div>

    <Modal v-model="modal" width="auto">
      <line-chart ref="tempChart" />
      <line-chart ref="pressureChart" />
      <line-chart ref="humidityChart" />
    </Modal>
  </div>
</template>

<script>
import { Line as LineChart } from 'vue-chartjs'
import moment from 'moment'
export default {
  components: { LineChart },
  props: ['device'],
  data() {
    return {
      telemetry: [],
      metrics: [
        { key: 'Температура', ref: 'tempChart', color: '#f6a2a2' },
        { key: 'Давление', ref: 'pressureChart', color: 'lightblue' },
        { key: 'Влажность', ref: 'humidityChart', color: 'blue' },
      ],
      modal: false,
      loading: false,
    }
  },
  computed: {
    lastMetrics() {
      if (!this.telemetry.length) return false
      const last = this.telemetry.slice(-1)[0]
      const time = moment(last[0]).format('DD/MM HH:mm')
      const metrics = this.metrics.map((metric, id) => ({
        value: `${metric.key} : ${last[1][id]}`,
        color: metric.color,
      }))
      return { time, metrics }
    },
  },
  mounted() {
    this.getTelemetry()
  },
  methods: {
    async getTelemetry(date) {
      this.telemetry = await this.$api.$get('/telemetry/' + this.device.id)
    },
    drawCharts() {
      this.modal = true
      this.metrics.forEach((metric, id) => {
        this.$refs[metric.ref].renderChart({
          labels: this.telemetry.map((x) => moment(x[0]).format('DD/MM HH:mm')),
          datasets: [
            {
              label: `${metric.key} ${this.telemetry.slice(-1)[0][1][id]}`,
              backgroundColor: metric.color,
              data: this.telemetry.map((x) => x[1][id]),
            },
          ],
        })
      })
    },
    async loadSensor() {
      this.loading = true
      try {
        await this.$api.post(`/telemetry/${this.device.id}`)
        await new Promise((resolve, reject) => setTimeout(resolve, 3000))
        await this.getTelemetry()
      } catch (e) {
        this.$Message.error({
          content: JSON.stringify(e.response || e),
          duration: 10,
          closable: true,
        })
      }
      this.loading = false
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
  .metrics {
    display: grid;
    grid-template-columns: max-content auto;
    grid-gap: 16px;
  }
  .last-metric {
    border-left: 4px solid;
    padding-left: 4px;
    margin-bottom: 8px;
  }
}
</style>
