<template>
	<scroll-view scroll-y scroll-with-animation class="h-100">
	<view class="container">
		<view class="payment bg-white">
			<view class="w-100 d-flex align-items-center justify-content-between">
				<view class="font-size-lg">送达时间</view>
				<view class="buttons">
					<button type="default" class="button" 
							:class="{active: orderType == 'lunch'}" plain 
							hover-class="none" @tap="switchOrderType">
						中餐
					</button>
					<button type="default" class="button" 
							:class="{active: orderType == 'dinner'}" plain 
							hover-class="none" @tap="switchOrderType">
						晚餐
					</button>
				</view>
			</view>
			<view v-if="orderType == 'lunch'" class="mt-30">成功下单后，次日 8:00-9:00 现做， 9:30-11:00 送达</view>
			<view v-else class="mt-30">成功下单后，次日 14:00-15:00 现做, 15:30-17:00 送达</view>
		</view>
		
		<navigator class="mt-20" open-type="navigate" url="/pages/pay/addresses" hover-class="none">
			<list-cell arrow last>
					<view class="address">
						<view class="info"  v-if="address.userName == undefined">
							请填写地址
						</view>
						<view class="info" v-else>
							<view class="address-row">
								<view class="address">{{ `${address.address} ${address.detailInfo}` }}</view>
							</view>
							<view class="user-row">
								{{ `${address.userName} ( ${address.gender ? '女士' : '先生'} ) ${address.telNumber}` }}
							</view>
						</view>
					</view>
			</list-cell>
		</navigator>
		<view class="flex-fill overflow-auto border-radius-lg mt-20">
			<list-cell padding="0 40rpx">
				<view class="w-100 d-flex flex-column">
					<view class="d-flex align-items-center mt-40" v-for="(item, index) in cart" :key="index">
						<view><image :src="item.image" class="pro-img"></image></view>
						<view class="flex-fill ml-30 w-100">
							<view class="font-size-base mb-10">{{ item.name }}</view>
							<view class="font-size-extra-sm text-color-assist">
								<!-- {{ item.description }} -->啊嘎嘎哈哈风格和，色高山上的成功
							</view>
						</view>
						<view class="flex-fill ml-30 w-25">
							<view class="flex-shrink-0  mt-20 ml-70 font-weight-bold">￥{{ item.price }}</view>
							<view class="flex-shrink-0  mt-20 ml-85 font-size-extra-sm text-color-assist">x{{ item.number }}</view>
						</view>
					</view>
					<view class="d-flex justify-content-between align-items-center mt-40 pb-30 border-dashed"></view>
				</view>
			</list-cell>

			<list-cell arrow last>
				<navigator hover-class="none" class="flex-fill ml-80 text-truncate text-right" open-type="navigate" url="/pages/pay/remark">
					<view class="w-100 d-flex align-items-center justify-content-between overflow-hidden">
						<view  class="mr-10">备注</view>
						{{ remark }}
					</view>
				</navigator>
			</list-cell>
			<list-cell last>
				<view class="w-100 d-flex justify-content-end align-items-center">
					<text class="font-size-sm">共{{ cartNum }}件商品，小计</text>
					<text class="font-size-lg font-weight-bold">￥{{ cartAmount }}</text>
				</view>
			</list-cell>
		</view>
		
		<view class="payment mt-20 mb-150 bg-white w-100 d-flex align-items-center justify-content-between">
			<view>支付方式</view>
			<view class="d-flex align-items-around">
				<image src="../../static/images/pay/weichat-pay.png" class="image"></image>
				<view class="ml-20">微信支付</view>
			</view>
		</view>
		
		<view class="footer">
			<view class="mr-30">
				合计：<text class="font-size-lg font-weight-bold">￥{{ cartAmount }}</text>
			</view>
			<button type="primary" @tap="pay">支付</button>
		</view>
	</view>
	</scroll-view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell.vue'
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		components: {
			listCell
		},
		computed: {
			...mapState(['orderType','choseAddress','orderCurrent']),
			cartNum() {
				return this.cart.reduce((acc, cur) => acc + cur.number, 0)
			},
			cartAmount() {
				return this.cart.reduce((acc, cur) => acc + cur.number * cur.price, 0)
			},
			remark() {
				return this.$store.state.remark
			}
		},
		data() {
			return {
				cart: uni.getStorageSync('cart'),
				address: {
					userName: '',
					telNumber: '',
					address: '',
					detailInfo: ''
				}
			}
		},
		onLoad() {
			this.getOneAddress(1)
		},
		onShow() {
			this.getOneAddress(2)
		},
		methods: {
			...mapMutations(['SET_ORDERTYPE','SET_ADDRESS','SET_ORDERCURRENT']),
			// 获取地址列表
			getOneAddress(type) {
				return uniCloud.callFunction({
					name:'address',
					data:{
						token:uni.getStorageSync('mc_token'),
						action:'getOneAddress'
					}
				}).then((res)=>{
					if(res.result.status === 0) {
						let resData = res.result.data
						
						if(type === 1){
							if(resData.length === 0){
								this.SET_ADDRESS(resData)
								uni.navigateTo({url: '/pages/pay/addresses'})
							}else{
								this.SET_ADDRESS(resData[0])
								this.address = resData[0]
							}
						}else{
							if(resData.length === 0){
								this.SET_ADDRESS(resData)
								this.address = this.choseAddress
							}else{
								this.address = this.choseAddress
							}
						}
					}else {
						uni.showModal({
							content:res.result.msg,
							showCancel:false
						})
					}
				})
			},
			switchOrderType() {
				if(this.orderType === 'lunch') {
					this.SET_ORDERTYPE('dinner')
				} else {
					this.SET_ORDERTYPE('lunch')
				}
			},
			pay(){
				uni.showLoading({
					title: '数据加载中...'
				})
				
				return uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'validateToken',
						params: {
							mcToken: uni.getStorageSync('mc_token')
						}
					}
				}).then(res => {
					uni.hideLoading();
					if (res.result.code === 0) {
						let payData = uni.getStorageSync('payData');
							payData.chooseStore = '深圳龙岗坂田长龙MALL店'
							payData.remark = this.remark			
						return uniCloud.callFunction({
							name: 'order',
							data: {
								token:uni.getStorageSync('mc_token'),
								action: 'submitOrder',
								data: payData
							}
						})
					}else{
						uni.navigateTo({url: '/pages/login/login'})
					}
				}).then(resData =>{
					console.log(resData)
					if(resData.result.length != 0){
						this.SET_ORDERCURRENT(resData.result[0])
						uni.removeStorageSync('cart');
						uni.reLaunch({
							url: '/pages/order/detail'
						})
					}else{
						console.log('支付失败');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		padding:30rpx;
		background-color: #f6f6f6;
	}
	
	.buttons {
		display: flex;
		align-items: stretch;
		background-color: #f6f6f6;
		border-radius: 50rem !important;
		padding: 4rpx;
		border: 2rpx solid #eaeaea;
	
		.button {
			height: 100%;
			width: 50%;
			border-radius: 50rem !important;
			border: 0 !important;
			font-size: $font-size-sm !important;
			line-height: 2.4 !important;
	
			&.active {
				background-color: #343434;
				color: #ffffff !important;
				transition: all 0.3s;
			}
		}
	}
	
	.pro-img {
		width: 150rpx;
		height: 120rpx;
		margin-left: -50rpx;
	}
	
	.receiver{
		border-radius: $border-radius-lg;
		overflow: auto;
		.receiver-item1 {
			flex: 1;
			display: flex;
			flex-direction: column;
			
		}
		.receiver-item2 {
			margin-left: 50rpx;
		}
	}
	
	.address {
		border-radius: $border-radius-lg;
		width: 100%;
		display: flex;
		align-items: center;
		
		.info {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin-right: 20rpx;
			overflow: hidden;
			
			.user-row {
				font-size: $font-size-sm;
				margin-bottom: 10rpx;
				color: $text-color-assist;
				margin-top: 10rpx;
			}
			
			.address-row {
				display: flex;
				align-items: center;
				
				.is-default {
					background-color: #faf5ef;
					font-size: 16rpx;
					color: $color-primary;
					padding: 4rpx;
					flex-shrink: 0;
					margin: 10rpx;
				}
				
				.address {
					font-size: $font-size-base;
					overflow: hidden;
					white-space: nowrap;
					text-overflow: ellipsis;
				}
			}
		}
	}
	
	
	.payment {
		padding: 30rpx;
		border-radius: $border-radius-lg;
		
		.image {
			width: 40rpx;
			height: 40rpx;
		}
	}
	
	.footer {
		background-color: #FFFFFF;
		z-index: 10;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		
		button {
			width: 250rpx;
			text-align: center;
			padding: 0;
			height: 100%;
			line-height: 100rpx;
			border-radius: 0 !important;
			font-size: $font-size-lg;
		}
	}
	
</style>
