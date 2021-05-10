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
						<view class="store-status"> 营业中</view>
						<view class="store-name">{{store.storeName}}</view>
					</view>
					<view class="store-content">
						<text class="store-text">{{store.storeName}}</text>
						<text class="store-text">距离您 {{store.distance}}km</text>
					</view>
				</view>
				<view class="store-right">
					<view class="look">去下单</view>
					<view class="icon">
						<view class="round">
							<image src="../../static/images/store/store-tel.png" ></image>
						</view>
						<view class="round">
							<image src="../../static/images/store/store-nav.png" ></image>
						</view>
					</view>
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
			...mapMutations(['SET_STORE']),
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
							maps.iconPath ='/static/images/logo.png'
							maps.width = 30
							maps.height = 30
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
				this.SET_STORE(store)
				uni.switchTab({
					url:'../menu/menu'
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
		margin: 10rpx 20rpx;
		padding: 20rpx;
		background-color: #FFFFFF;
		box-shadow: $box-shadow;
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
				margin-left: 20rpx;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
			.store-status {
				color: $color-primary;
				font-size: $font-size-sm;
				padding: 5rpx;
				border: 1rpx solid $color-primary;
				white-space: nowrap;
			}
		}
		
		.store-content {
			margin-top: 60rpx;
			font-size: $font-size-sm;
			display: flex;
			flex-direction: column;
			.store-text {
				color: $text-color-assist;
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
			}
		}
	}
	.store-right {
		width: 30%;
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		.look {
			font-size: $font-size-sm;
			color: $color-primary;
		}
		.icon{
			display: flex;
			flex-wrap: nowrap;
			align-items: center;
			margin-top: 60rpx;
			justify-content: flex-end;
			.round {
				border-radius: 50%;
				width: 60rpx;
				height: 60rpx;
				margin: 10rpx;
				background-color: #cad43f;
				image {
					display: block;
					width: 40rpx;
					height: 40rpx;
					margin: 10rpx;
					align-items: center;
				}
			}
		}
	}
</style>
