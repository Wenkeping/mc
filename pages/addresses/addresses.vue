<template>
	<view class="container">
		<view class="content">
			<uni-swipe-action>
				<uni-swipe-action-item :right-options="swipeOption" @click="handleSwipeClick(address._id)" v-for="(address, index) in addressList" :key="index">
					<list-cell>
						<view class="address">
							<view class="info">
								<view class="address-row">
									<view class="is-default">默认地址</view>
									<view class="address">{{ `${address.address} ${address.detailInfo}` }}</view>
								</view>
								<view class="user-row">
									{{ `${address.userName} ( ${address.gender ? '女士' : '先生'} ) ${address.telNumber}` }}
								</view>
							</view>
							<image src="/static/images/common/edit.png" @tap.stop="edit(address._id)" class="edit-btn"></image>
						</view>
					</list-cell>
				</uni-swipe-action-item>
			</uni-swipe-action>
		</view>
		<view class="footer">
			<button @tap="imp">+微信导入</button>
			<button @tap="add">+添加地址</button>
		</view>
	</view>
	
</template>

<script>
	import uniSwipeAction from '@/uni_modules/uni-swipe-action/components/uni-swipe-action/uni-swipe-action.vue'
	import uniSwipeActionItem from '@/uni_modules/uni-swipe-action/components/uni-swipe-action-item/uni-swipe-action-item.vue'
	import listCell from '@/components/list-cell/list-cell.vue'
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		components: {
			listCell,
			uniSwipeAction,
			uniSwipeActionItem
		},
		data() {
			return {
				addressList:[],
				swipeOption: [
					{
						text: '删除',
						style: {
							backgroundColor: '#ff383e'
						}
					}
				]
			}
		},
		computed: {
			...mapState(['addresses'])
		},
		onLoad() {
			this.getAddress()
		},
		onShow() {
			this.getAddress()
		},
		methods: {
			...mapMutations(['SET_ADDRESS', 'SET_ORDER_TYPE']),
			// 获取地址列表
			getAddress() {
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
							name:'address',
							data:{
								token:uni.getStorageSync('mc_token'),
								action:'getList'
							}
						})
					} else {
						uni.navigateTo({url: '/pages/login/login'})
					}
				}).then((resData) =>{
					this.addressList = resData.result.data
				})
			},
			imp() {
				 uni.chooseAddress({
				   success(res) {
					 let data = {}
				     data.userName = res.userName
					 data.address = res.provinceName + res.cityName + res.countyName
					 data.detailInfo = res.detailInfo
					 data.telNumber = res.telNumber
				     data.latitude = res.latitude
				     data.longitude = res.longitude
					 
					 return uniCloud.callFunction({
					 	name:'address',
					 	data:{
					 		token:uni.getStorageSync('mc_token'),
					 		data:data,
					 		action:'addAddress'
					 	}
					 }).then((res)=>{
					 	if(res.result.status === 0) {
					 		uni.showToast({
					 			title:'添加成功'
					 		})
					 		uni.navigateBack({
					 			
					 		})
					 	} else {
					 		uni.showModal({
					 			content:res.result.msg,
					 			showCancel:false
					 		})
					 	}
					 })
				   }
				})
			},
			add() {
				uni.navigateTo({
					url: '/pages/addresses/add'
				})
			},
			edit(id) {
				uni.navigateTo({
					url: '/pages/addresses/add?id=' + id
				})
			},
			// 删除地址
			handleSwipeClick(id) {
				console.log(id)
				uni.showModal({
					title: '提示',
					content: '确定要删除？',
					success: res => {
						if(res.confirm) {
							return uniCloud.callFunction({
								name:'address',
								data:{
									token:uni.getStorageSync('mc_token'),
									id:id,
									action:'deleteAddress'
									}
							}).then((res)=>{
								if(res.result.status === 0) {
									uni.showToast({title: '删除成功！', icon: 'success'})
									this.getAddress()
								}
								uni.showModal({
									content: res.result.msg,
									showCancel: false
								})
							})
						}
					}
				})
			},
			choose(address) {
				this.SET_ADDRESS(address)
				this.SET_ORDER_TYPE('takeout')
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
	}
	
	.content {
		padding: 30rpx;
		height: auto;
	}
	
	.address {
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
		
		.edit-btn {
			width: 30rpx;
			height: 30rpx;
			margin-right: 20rpx;
		}
	}
	
	.footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 10;
		background-color: $bg-color;
		display: flex;
		align-items: center;
		justify-content: space-around;
		height: 120rpx;
		padding:30rpx;
		
		button {
			border-radius: $border-radius-lg;
			padding:10rpx;
			width: 45%;
			font-size: $font-size-medium;
			color: $color-primary;
			background-color: $bg-color-white;
			border-color: $color-primary;
			border: 2rpx solid #eeeeee;
		}
	}
</style>
