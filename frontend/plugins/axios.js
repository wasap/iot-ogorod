import config from '../../config'
export default function ({ $axios }, inject) {
  // Create a custom axios instance
  const api = $axios.create({
    headers: {
      common: {
        token: config.token,
      },
    },
  })

  // Set baseURL to something different
  api.setBaseURL(config.apiUrl)

  // Inject to context as $api
  inject('api', api)
}
