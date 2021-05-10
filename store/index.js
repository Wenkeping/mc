import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		orderType: '',
		userInfo:{},
		choseAddress:{},
		orderCurrent:{},
		location:{},
		choseStore:{},
		remark:''
	},
    mutations: {
		//登录
		Login(state,res) {
			state.userInfo = res
			uni.setStorageSync({
			        key: 'mc_userInfo',
			        data: res
			      })
		},
	
		SET_ORDERTYPE(state,orderType) {
			state.orderType = orderType
		},
		SET_ADDRESS(state,choseAddress) {
			state.choseAddress = choseAddress
		},
		SET_REMARK(state,remark) {
			state.remark =remark
		},
		SET_ORDERCURRENT(state,orderCurrent) {
			state.orderCurrent = orderCurrent
		},
		SET_LOCATION(state,location) {
			state.location = location
		},
		SET_STORE(state,choseStore) {
			state.choseStore = choseStore
		}
	},
    actions: {}
})
export default store