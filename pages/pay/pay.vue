<template>
	<view class="container">
		<view>
			<view class="receiver">
				<navigator open-type="navigate" url="/pages/pay/addresses" hover-class="none">
					<list-cell arrow last>
							<view class="receiver-item1">
								<label class="font-size-medium text-color-base mb-10">文珂坪</label>
								<label class="text-color-assist font-size-extra-sm"> 1856582574</label>
							</view>
							<view class="receiver-item2">
								<label class="font-size-sm">广东省深圳市龙岗区坂田街道岗头社区华创云轩B栋</label>
							</view> 
					</list-cell>
				</navigator>
			</view>
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
	
	export default {
		components: {
			listCell
		},
		data() {
			return {
				cart: uni.getStorageSync('cart'),
			}
		},
		computed: {
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
		methods: {
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
