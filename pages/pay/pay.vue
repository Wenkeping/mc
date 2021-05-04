<template>
	<view class="container">
		<view>
			<navigator open-type="navigate" url="/pages/pay/addresses" hover-class="none">
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
			<view class="flex-fill overflow-auto border-radius-lg mt-20 mb-150">
				<list-cell padding="0 40rpx">
					<view class="w-100 d-flex flex-column">
						<view class="d-flex align-items-center mt-40" v-for="(item, index) in cart" :key="index">
							<view><image :src="item.image" class="pro-img"></image></view>
							<view class="flex-fill d-flex flex-column ml-30">
								<view class="font-size-base mb-10">{{ item.name }}</view>
								<view class="font-size-extra-sm text-color-assist">
									{{ item.description }}
								</view>
							</view>
							<view class="flex-shrink-0 font-weight-bold ml-40">x{{ item.number }}</view>
							<view class="flex-shrink-0 font-weight-bold ml-40">￥{{ item.price }}</view>
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
			
			<view class="footer">
				<view class="mr-30">
					合计：<text class="font-size-lg font-weight-bold">￥{{ cartAmount }}</text>
				</view>
				<button type="primary" @tap="pay">支付</button>
			</view>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell.vue'
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		components: {
			listCell
		},
		computed: {
			...mapState(['choseAddress']),
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
			...mapMutations(['SET_ADDRESS']),
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
						let resData = res.result.data[0]
						this.SET_ADDRESS(resData)
						
						if(type === 1){
							if(res.result.data.length === 0){
								uni.navigateTo({url: '/pages/pay/addresses'})
							}else{
								this.address = resData
							}
						}else{
							this.address = this.choseAddress
						}
						if(res.result.data.length === 0){
							this.SET_ADDRESS(resData)
							uni.navigateTo({url: '/pages/pay/addresses'})
						}else{
							if(type === 1){
								this.address = resData
								this.SET_ADDRESS(resData)
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
							payData.openId = res.result.userInfo.wx_openid.mp-weixin
							payData.chooseStore = '华为店'
							payData.remark = this.remark			
						return uniCloud.callFunction({
							name: 'order',
							data: {
								action: 'submitOrder',
								data: payData
							}
						})
					}else{
						uni.navigateTo({url: '/pages/login/login'})
					}
				}).then(resData =>{
					if(resData.result.orderId){
						console.log(resData.result.orderId)
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
		padding:40rpx;
		background-color: #f6f6f6;
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
