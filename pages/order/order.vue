<template>
	<view class="container">
		<view class="tabbar">
			<view class="item" :class="{active: !tabIndex}" @tap="switchTab(0)">当前订单</view>
			<view class="item" :class="{active: tabIndex}" @tap="switchTab(1)">历史订单</view>
		</view>
		<swiper :current="tabIndex" :duration="300" class="swiper" :show-scrollbar="false">
			<!-- 当前订单 begin -->
			<swiper-item @touchmove.stop="handleSwiperItemChange">
				<view class="no-order-content" v-if="currentOrders.length == 0">
					<image src="https://go.cdn.heytea.com/storage/ad/2020/05/20/0bdb360866d94aa4a4404c0b676a1982.jpg"></image>
					<view class="tips">
						<view>您今天还没有下单</view>
						<view>快去选择一杯喜欢的茶吧</view>
					</view>
					<button type="primary" class="font-size-lg" hover-class="none">去下单</button>
				</view>
				<view class="history-order" v-else>
					<swiper :current="orderMenuIndex" :duration="300" :show-scrollbar="false" class="history-order-swiper">
						<!-- 门店订单 begin -->
						<swiper-item @touchmove.stop="handleSwiperItemChange">
							<scroll-view scroll-y="true" class="orders-scroll">
								<view class="wrapper">
									<view class="order-list">
										<navigator class="order" v-for="(order, index) in currentOrders" :key="index" open-type="navigate" :url="'/pages/order/detail'" @tap="tapOrder(order)">
											<view class="header">
												<view class="flex-fill font-size-medium">{{ order.chooseStore }}</view>
												<view class="status">
													<view>{{ order.statusName }}</view>
													<image src="/static/images/common/black_arrow_right.png"></image>
												</view>
											</view>
											<scroll-view scroll-x>
												<view class="images">
													<image :src="item.image" v-for="(item, index) in order.goodsInOrder" :key="index"></image>
												</view>
											</scroll-view>
											<view class="info">
												<view class="left">
													<view>下单时间：{{ order.time }}</view>
													<view class="mt-10">订单编号：{{ order.orderId }}</view>
												</view>
												<view class="right">
													￥{{ order.totalFee }}
												</view>
											</view>
										</navigator>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<!-- 门店订单 end -->
					</swiper>
				</view>
			</swiper-item>
			<!-- 当前订单 end -->
			<!-- 历史订单 begin -->
			<swiper-item @touchmove.stop="handleSwiperItemChange">
				<view class="no-order-content" v-if="historyOrders.length == 0">
					<image src="https://go.cdn.heytea.com/storage/ad/2020/05/20/0bdb360866d94aa4a4404c0b676a1982.jpg"></image>
					<view class="tips">
						<view>您今天还没有下单</view>
						<view>快去选择一杯喜欢的茶吧</view>
					</view>
					<button type="primary" class="font-size-lg" hover-class="none">去下单</button>
				</view>
				<view class="history-order" v-else>
					<swiper :current="orderMenuIndex" :duration="300" :show-scrollbar="false" class="history-order-swiper">
						<!-- 门店订单 begin -->
						<swiper-item @touchmove.stop="handleSwiperItemChange">
							<scroll-view scroll-y="true" class="orders-scroll">
								<view class="wrapper">
									<view class="order-list">
										<navigator class="order" v-for="(order, index) in historyOrders" :key="index" open-type="navigate" :url="'/pages/order/detail'" @tap="tapOrder(order)">
											<view class="header">
												<view class="flex-fill font-size-medium">{{ order.chooseStore }}</view>
												<view class="status">
													<view>{{ order.statusName }}</view>
													<image src="/static/images/common/black_arrow_right.png"></image>
												</view>
											</view>
											<scroll-view scroll-x>
												<view class="images">
													<image :src="item.image" v-for="(item, index) in order.goodsInOrder" :key="index"></image>
												</view>
											</scroll-view>
											<view class="info">
												<view class="left">
													<view>下单时间：{{ order.time }}</view>
													<view class="mt-10">订单编号：{{ order.orderId }}</view>
												</view>
												<view class="right">
													￥{{ order.totalFee }}
												</view>
											</view>
										</navigator>
									</view>
								</view>
							</scroll-view>
						</swiper-item>
						<!-- 门店订单 end -->
					</swiper>
				</view>
			</swiper-item>
			<!-- 历史订单 end -->
		</swiper>
	</view>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
	
export default {
	data() {
		return {
			tabIndex: 0,
			orderMenuIndex: 0,
			currentOrders: [],
			historyOrders: []
		}
	},
	computed: {
		...mapState(['orderCurrent'])
	},
	onLoad() {
		this.getOrders()
	},
	onShow() {
		this.getOrders()
	},
	methods: {
		...mapMutations(['SET_ORDERCURRENT']),
		switchTab(index) {
			 this.tabIndex = index
		},
		handleSwiperItemChange() {	//禁止手动滑动
			return true
		},
		 getOrders() {
			uni.showLoading({
				title:'数据加载中...'
			});
			return uniCloud.callFunction({
				name: 'user-center',
				data: {
					action: 'validateToken',
					params: {
						mcToken: uni.getStorageSync('mc_token')
					}
				}
			}).then((res)=>{
				uni.hideLoading()
				if(res.result.code === 0) {
					return uniCloud.callFunction({
						name:'order',
						data:{
							token:uni.getStorageSync('mc_token'),
							action:'getOrder'
						}
					})
				} else {
					uni.navigateTo({url: '/pages/login/login'})
				}
			}).then((resData) =>{
				this.currentOrders = resData.result.data.currentOrder
				this.historyOrders = resData.result.data.historyOrder
			})
		},
		tapOrder(order) {
			this.SET_ORDERCURRENT(order)
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f6f6f6;
}


.tabbar {
	height: 100rpx;
	background-color: $bg-color-white;
	display: flex;
	align-items: center;
	justify-content: space-around;
	
	.item {
		height: 100%;
		font-size: $font-size-lg;
		color: $text-color-assist;
		font-weight: 400 !important;
		display: flex;
		align-items: center;
		
		&.active {
			color: $text-color-base;
			border-bottom: 4rpx solid $text-color-base;
		}
	}
}

.swiper {
	width: 100%;
	height: calc(100vh - 4px - var(--status-bar-height) - 10rpx);
	/* #ifdef H5 */
	height: calc(100vh - 4px - var(--status-bar-height) - 10rpx - 100rpx);
	/* #endif */
}

.no-order-content {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	image {
		width: 300rpx;
		height: 300rpx;
		margin-bottom: 50rpx;
	}

	.tips {
		color: $text-color-assist;
		display: flex;
		flex-direction: column;
		align-items: center;
		line-height: 1.2rem !important;
		margin-bottom: 70rpx;
	}

	button {
		width: 50%;
	}
}

.history-order {
	padding: 30rpx;
	width: 100%;
	height: 100%;
	position: relative;
	
	.menu {
		padding: 18rpx 30rpx;
		display: flex;
		align-items: center;
		font-size: $font-size-base;
		color: $text-color-grey;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 10;
		
		.item {
			padding: 14rpx 30rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			
			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 10rpx;
			}
			
			&.active {
				color: $color-primary;
				background-color: $bg-color-white;
			}
		}
	}
	
	.history-order-swiper {
		width: 100%;
		height: 100%;
	}
}

.orders-scroll {
	width: 100%;
	height: 100%;
}

.order-list {
	display: flex;
	width: 100%;
	flex-direction: column;
	
	.order {
		background-color: $bg-color-white;
		padding: 30rpx 40rpx;
		margin-bottom: 18rpx;
		border-radius: 30rpx;
		
		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			
			.status {
				font-size: $font-size-base;
				color: $text-color-grey;
				display: flex;
				align-items: center;
				image {
					width: 30rpx;
					height: 30rpx;
					margin-left: $spacing-row-sm;
				}
			}
		}
		
		.images {
			display: flex;
			padding: 30rpx 0;
			margin-left: -50rpx;
			image {
				flex-shrink: 0;
				width: 150rpx;
				height: 112.5rpx;
			}
		}
		
		.info {
			display: flex;
			align-items: center;
			margin-bottom: 30rpx;
			
			.left {
				flex: 1;
				display: flex;
				flex-direction: column;
				font-size: $font-size-extra-sm;
				color: $text-color-assist;;
			}
			
			.right {
				font-size: $font-size-lg;
				color: $text-color-base;
			}
		}
	}
}
</style>
