import categories from './categories.js'
import orders from './orders.js'
import orderDetail from './orderDetail.js'

const json = {
	categories,
	orders,
	orderDetail
}

export default (name, loading = true) => {
	if(loading) {
		uni.showLoading()
	}
	
	return new Promise(resolve => {
		setTimeout(() => {
			uni.hideLoading()
			resolve(json[name])
		}, 500)
	})
}