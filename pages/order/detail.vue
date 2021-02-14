<template>
	<view class="container">
		<view class="header"></view>
		<view class="content" v-if="Object.keys(order).length>0">
			<view class="order-box">
				<view class="text-color-primary font-size-lg font-weight-bold mb-40">订单已完成</view>
				<view class="text-color-assist font-size-sm">感谢您对喜茶的支持，欢迎再次光临</view>
			</view>
			
			<view class="flex-fill overflow-auto">
				<view class="">
					<list-cell padding="50rpx 40rpx">
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
					<list-cell padding="0 40rpx">
						<view class="w-100 d-flex flex-column">
							<view class="d-flex align-items-center mt-40" v-for="(item, index) in order.items" :key="index">
								<view><image :src="item.images.data[index].url" class="pro-img"></image></view>
								<view class="flex-fill d-flex flex-column ml-30">
									<view class="font-size-base mb-10">{{ item.sname }}</view>
									<view class="font-size-extra-sm text-color-assist">
										{{ materialsText(item.materials) }}
									</view>
								</view>
								<view class="flex-shrink-0 font-weight-bold ml-40">x{{ item.quantity }}</view>
								<view class="flex-shrink-0 font-weight-bold ml-40">￥{{ item.price }}</view>
							</view>
							<view class="d-flex justify-content-between align-items-center mt-40 pb-30 border-dashed"></view>
							<view class="d-flex justify-content-between align-items-center font-size-lg font-weight-bold mt-30 mb-40">
								<view>合计</view>
								<view>￥{{ order.total_fee }}</view>
							</view>
						</view>
					</list-cell>
					<list-cell padding="30rpx 40rpx" last style="border-radius: 0 0 30rpx 30rpx;">
						<view class="w-100 d-flex flex-column font-size-extra-sm text-color-assist">
							<view class="mb-10">下单时间：{{ order.paid_at }}</view>
							<view class="mb-10">订单编号：{{ order.no }}</view>
							<view class="mb-10">备注信息：{{ order.remarks }}</view>
						</view>
					</list-cell>
				</view>
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
	display: flex;
	justify-content: flex-end;
	align-items: center;
	padding: 20rpx 0;
}

.content {
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	
	.order-box {
		z-index: 10;
		height: 15vh;
		border-radius: 30rpx 30rpx 0 0;
		box-shadow: 0 0 20rpx 0 rgba($color: #333, $alpha: 0.1);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: $bg-color-white;
		flex-shrink: 0;
	}
}

.phone-icon, .map-icon {
	width: 64rpx;
	height: 64rpx;
}

.phone-icon {
	margin-right: 40rpx;
}

.border-dashed {
	border-bottom: 1rpx dashed $border-color;
}




.pro-img {
	width: 150rpx;
	height: 120rpx;
}
</style>
