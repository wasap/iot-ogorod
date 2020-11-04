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
      <div>
        <label>Месяц</label>
        <Select
          v-model="dateRange"
          style="width: 80px"
          @on-select="onRangeChange"
        >
          <Option v-for="item in dateOptions" :key="item" :value="item">{{
            item
          }}</Option>
        </Select>
        <label>Количество точек</label>
        <Select
          :value="itemCount"
          style="width: 80px"
          @on-select="onItemCountChange"
        >
          <Option
            v-for="item in itemCountOptions"
            :key="item.value"
            :value="item.value"
            >{{ item.label }}</Option
          >
        </Select>
      </div>
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
      dateRange: moment().format('MM-YYYY'),
      itemCount: 50,
      itemCountOptions: [
        { label: 50, value: 50 },
        { label: 100, value: 100 },
        { label: 300, value: 300 },
        { label: 500, value: 500 },
        { label: 'Все', value: 99999999 },
      ],
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
    dateOptions() {
      const range = moment().diff(moment('2020/10/01'), 'months')
      const options = []
      for (let i = 0; i <= range; i++) {
        options.push(moment().add(-i, 'month').format('MM-YYYY'))
      }
      return options
    },
  },
  mounted() {
    this.getTelemetry()
  },
  methods: {
    async getTelemetry(date = '') {
      this.telemetry = await this.$api.$get(
        `/telemetry/${this.device.id}/${date}`
      )
    },
    drawCharts() {
      this.modal = true
      this.metrics.forEach((metric, id) => {
        const telemetry = this.telemetry.slice(-this.itemCount)
        this.$refs[metric.ref].renderChart({
          labels: telemetry.map((x) => moment(x[0]).format('DD/MM HH:mm')),
          datasets: [
            {
              label: metric.key,
              backgroundColor: metric.color,
              data: telemetry.map((x) => x[1][id]),
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
    async onRangeChange(value) {
      await this.getTelemetry(value)
      this.drawCharts()
    },
    onItemCountChange(value) {
      this.itemCount = value
      this.drawCharts()
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
