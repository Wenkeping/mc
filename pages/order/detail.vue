<template>
	<view class="container">
		<view class="header"></view>
		<view v-if="Object.keys(order).length > 0">
		
			<view class="order-status" v-if="order.statusName == '已完成'">
				<view class="order-step">
					<uni-steps :options="[{title: '待烹饪'}, {title: '烹饪中'}, {title: '派送中'}, {title: '已完成'}]" :active="order.status" active-color="#DBA871"></uni-steps>
				</view>
				<view class="order-desc">
					<view class="text-color-assist font-size-sm">感谢您对喜茶的支持，欢迎再次光临</view>
				</view>
			</view>
			<view class="order-status" v-else>
				<view class="order-step">
					<uni-steps :options="[{title: '待烹饪'}, {title: '烹饪中'}, {title: '派送中'}, {title: '已完成'}]" :active="order.status" active-color="#DBA871"></uni-steps>
				</view>
				<view class="order-desc">
					<view class="text-color-assist font-size-sm" v-if="order.orderType == 'lunch'">您选择的是中餐，预计 9:30-11:00 送达</view>
					<view class="text-color-assist font-size-sm" v-else>您选择的是晚餐，预计 15:30-17:00 送达</view>
				</view>
			</view>
			<view class="section">
				<list-cell :hover="false" padding="50rpx 40rpx">
					<view class="w-100 d-flex align-items-center">
						<view class="flex-fill d-flex flex-column overflow-hidden">
							<view class="font-size-lg mb-10">{{ order.chooseStore }}</view>
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
						<view class="d-flex align-items-around mt-40" v-for="(item, index) in order.goodsInOrder" :key="index">
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
						<view class="d-flex justify-content-between align-items-center font-size-lg font-weight-bold mt-50 mb-40">
							<view>合计</view>
							<view>￥{{ order.totalFee }}</view>
						</view>
					</view>
				</list-cell>
			</view>
			
			<list-cell :hover="false" padding="50rpx 30rpx 20rpx" last>
				<view class="w-100 d-flex flex-column font-size-extra-sm text-color-assist">
					<view class="mb-10">下单时间：{{ order.time }}</view>
					<view class="mb-10">订单编号：{{ order.orderId }}</view>
					<view class="mb-10">备注信息：{{ order.remark }}</view>
				</view>
			</list-cell>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell.vue'
	import {mapState} from 'vuex'
	
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
			...mapState(['orderCurrent'])
		},
		async onLoad() {
			this.order = await this.orderCurrent
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

.order-status{
		margin-top: 20rpx;
		height: 20vh;
		border-radius: 30rpx 30rpx 0 0;
		background-color: $bg-color-white;
		margin-bottom: 15rpx;
		
		.order-step{
			padding-top: 50rpx;
			
		}
		
		.order-desc{
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-top: 40rpx;
		}
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
	margin-left: -50rpx;
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
