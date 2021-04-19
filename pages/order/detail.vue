<template>
	<view class="container">
		<view class="header"></view>
		<view v-if="Object.keys(order).length > 0">
			<view class="order-box">
				<view class="text-color-primary font-size-lg font-weight-bold mb-40">订单已完成</view>
				<view class="text-color-assist font-size-sm">感谢您对喜茶的支持，欢迎再次光临</view>
			</view>
				
			<view class="section">
				<list-cell :hover="false" padding="50rpx 40rpx">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column overflow-hidden">
							<view class="font-size-lg mb-10">{{ order.shop.name }}</view>
							<view class="font-size-extra-sm text-color-assist text-truncate">{{ order.shop.address }}</view>
						</view>
						<view class="d-flex align-items-center ml-20">
							<image src="/static/images/order/icon_phone.png" class="phone-icon"></image>
							<image src="/static/images/order/icon_map.png" class="map-icon"></image>
						</view>
					</view>
				</list-cell>
			</view>
			<view class="section">
				<list-cell :hover="false" padding="0 40rpx">
					<view class="w-100 d-flex flex-column">
						<view class="d-flex align-items-around mt-40" v-for="(item, index) in order.items" :key="index">
							<view><image :src="item.images.data[index].url" class="pro-img"></image></view>
							<view class="flex-fill ml-30 w-100">
								<view class="font-size-base mb-10">{{ item.sname }}</view>
								<view class="font-size-extra-sm text-color-assist">
									{{ materialsText(item.materials) }}
								</view>
							</view>
							<view class="flex-fill ml-30 w-25">
								<view class="flex-shrink-0 font-weight-bold">￥{{ item.price }}</view>
								<view class="flex-shrink-0  mt-20 ml-70 font-size-extra-sm text-color-assist">x{{ item.quantity }}</view>
							</view>
						</view>
						<view class="d-flex justify-content-between align-items-center font-size-lg font-weight-bold mt-30 mb-40">
							<view>合计</view>
							<view>￥{{ order.total_fee }}</view>
						</view>
					</view>
				</list-cell>
			</view>
			
			<list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
				<view class="w-100 d-flex flex-column font-size-extra-sm text-color-assist">
					<view class="mb-10">下单时间：{{ order.paid_at }}</view>
					<view class="mb-10">订单编号：{{ order.no }}</view>
					<view class="mb-10">备注信息：{{ order.remarks }}</view>
				</view>
			</list-cell>
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
				order: {}
			}
		},
		computed: {
			materialsText() {
				return materials => {
					let arr = []
					materials.forEach(item => arr.push(item.name))
					return arr.join(',')
				}
			}
		},
		async onLoad(options) {
			/* 为了方便测试，这里使用同一个订单数据 */
			this.order = await this.$api('orderDetail')
		}
	}
</script>

<style lang="scss" scoped>
.container {
	background-color: #f6f6f6;
	padding: 0 40rpx;
}

.header {
	padding: 20rpx 0;
}

.order-box {
		height: 15vh;
		border-radius: 30rpx 30rpx 0 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: $bg-color-white;
		margin-bottom: 15rpx;
	}

.phone-icon, .map-icon {
	width: 64rpx;
	height: 64rpx;
}

.phone-icon {
	margin-right: 40rpx;
}


.pro-img {
	width: 150rpx;
	height: 120rpx;
}

@mixin arch {
		content: "";
		position: absolute;
		background-color: $bg-color;
		width: 30rpx;
		height: 30rpx;
		bottom: -15rpx;
		z-index: 10;
		border-radius: 100%;
	}
	
	.section {
		position: relative;
		
		&::before {
			@include arch;
			left: -15rpx;
		}
		
		&::after {
			@include arch;
			right: -15rpx;
		}
	}
	
	
</style>
