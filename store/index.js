import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		orderType: '',
		userInfo:{},
		choseAddress:{},
		choseStore:{},
		orderCurrent:{}
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
	
		SET_ORDERTYPE(state,type) {
			state.orderType = type
		},
		
			
		SET_ADDRESS(state,address) {
			state.choseAddress = address
		},
		
		SET_STORE(state,store) {
			state.choseStore =store
		},
		SET_ORDERCURRENT(state,current) {
			state.orderCurrent = current
		},
		CHEAR_CURRENT(state) {
			state.orderCurrent = {}
		},
		SET_ORDERCURRENTSTATUS(state,status) {
			state.orderCurrent.status = status
		}
	},
    actions: {}
})
export default store