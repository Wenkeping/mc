<template>
	<view class="container">
		<!-- 地图部分 -->
		<view class="page-map">
			<map style="width: 100%; height: 400rpx;" :latitude="latitude" :longitude="longitude"
			:markers="markers"></map>
		</view>
		<!-- 门店信息 -->
		<view class="content">
			<view class="store" v-for="(store,index) in storeData" :key="index" @tap="tapStore(store)">
				<view class="store-left">
					<view class="store-title">
						<view class="store-name">{{store.storeName}}</view>
					</view>
					<view class="store-content">
						<view class="d-flex justify-content-start">
							<view class="iconfont icon-dingwei"></view>
							<view class="store-text">{{store.storeName}}</view>
						</view>
						<view class="d-flex justify-content-start">
							<view class="iconfont icon-clock"></view>
							<view class="store-text">10:00~21:00</view>
						</view>
						<view class="store-status"> 营业中</view>
					</view>
				</view>
				<view class="store-right">
					<view class="store-text">去下单</view>
					<text class="look">距离 {{store.distance}}km</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data () {
			return {
				latitude:'',
				longitude:'',
				markers:[],
				storeData:[]
			}
		},
		onLoad() {
			this.getStoreData()
		},
		
		methods:{
			...mapMutations(['SET_LOCATION']),
			getStoreData() {
				return new Promise((resolve,reject)=>{
					// 获取用户收货地址定位
					uni.getLocation({
						type:'gcj02',
						success(resLocation) {
							if(resLocation.latitude && resLocation.longitude) {
								resolve(resLocation)
							}
						}
					})

				}).then(local =>{
					let la1 = local.latitude
					let lo1 = local.longitude
					return uniCloud.callFunction({
						name:'stores'
					}).then(resStore =>{
						let temp = []
						let storeLength = resStore.result.data.length
						if(storeLength >= 1){
							for(let i = 0; i < storeLength; i++) {
								let element = resStore.result.data[i]
								let d = this.distance(element.latitude,element.longitude,la1,lo1)
								element.distance = d
								temp.push(element)
							}
							this.storeData = temp.sort(function(a,b){
								return a.distance - b.distance
							})
							
							return this.storeData
						}
					})
				}).then(resMap => {
					this.latitude = resMap[0].latitude
					this.longitude = resMap[0].longitude
					let map =[]
					let len =resMap.length
					if(len >= 1){
						for(let i=0; i<len; i++) {
							let maps = {}
							maps.id = i
							maps.latitude = resMap[i].latitude
							maps.longitude = resMap[i].longitude
							maps.iconPath ='/static/images/order/order_icon_address.png'
							maps.width = 20
							maps.height = 20
							maps.callout = {'content':resMap[i].name,'display':'ALWAYS'}
							map.push(maps)
						}
						
						this.markers = map
						console.log(this.markers)
					}
				})
			},
			// 计算距离
			distance(la1, lo1, la2, lo2) {
					var La1 = la1 * Math.PI / 180.0;
					var La2 = la2 * Math.PI / 180.0;
					var La3 = La1 - La2;
					var Lb3 = lo1 * Math.PI / 180.0 - lo2 * Math.PI / 180.0;
					var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(La3 / 2), 2) + Math.cos(La1) * Math.cos(La2) * Math.pow(Math.sin(Lb3 / 2), 2)));
					s = s * 6378.137;//地球半径
					s = Math.round(s * 10000) / 10000;
					s = s.toFixed(1);
					return s
			},
				
			// 选取门店地址并且跳转到点餐界面
			tapStore(store) {
				this.SET_LOCATION(store)
				uni.switchTab({
					url:'../index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {
		width: 100%;
		height: 100%;
	}
	
	.page-map {
		width: 100%;
		height: 400rpx;
	}
	.content {
		width: 100%;
		height: 100%;
	}
	.store {
		display: flex;
		flex-wrap: nowrap;
		margin: 20rpx 20rpx;
		padding: 20rpx;
		background-color: #FFFFFF;
		box-shadow: $box-shadow;
		align-items: center;
	}
	.store-left {
		width: 80%;
		display: flex;
		flex-direction: column;
		.store-title {
			display: flex;
			flex-wrap: nowrap;
			.store-name {
				color: $text-color-black;
				font-size: $font-size-lg;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
		
		.store-content {
			margin-top: 20rpx;
			font-size: $font-size-medium;
			display: flex;
			flex-direction: column;
			color: $text-color-assist;
			.store-text {
				margin-bottom: 10rpx;
				margin-left: 10rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.store-status {
				margin-top: 10rpx;
				width: 71rpx;
				color: $color-primary;
				font-size: 20rpx;
				padding: 5rpx;
				border: 3rpx solid $color-primary;
				white-space: nowrap;
				border-radius: 10%;
			}
		}
	}
	.store-right {
		padding-top: 30rpx;
		width: 30%;
		height: 150rpx;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-left: 3rpx solid $border-color;
		white-space: nowrap;
		text-overflow: ellipsis;
		.look {
			font-size: $font-size-sm;
			color: $text-color-assist;
			margin-top: 10rpx;
		}

	}
</style>
