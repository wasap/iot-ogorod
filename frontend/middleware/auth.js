import config from '../../config'
export default ({ route, redirect }) => {
  if (route) return // todo remove
  if (route.query.token !== config.token) {
    redirect('/404')
  }
}
