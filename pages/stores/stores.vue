<template>
	<view class="container">
		<!-- 地图部分 -->
		<view class="page-map">
			<map style="width: 100%; height: 400rpx;" :latitude="latitude" :longitude="longitude"
			:markers="markers"></map>
		</view>
		
		<!-- 门店信息 -->
		<view class="stores">
			<view v-for="(v,i) in storeData" :key="i">
				<view 
				class="item"
				:class="{ 
					'active':(type=='radio' && index == i)
				}"
				:data-i="i"
				@tap="change">
					<view class="store">
						<view class="store-left">
							<view class="store-title">
								<view class="store-name">{{v.storeName}}</view>
							</view>
							<view class="store-content">
								<view class="d-flex justify-content-start">
									<view class="iconfont icon-dingwei"></view>
									<view class="store-text">{{v.storeName}}</view>
								</view>
								<view class="d-flex justify-content-start">
									<view class="iconfont icon-clock"></view>
									<view class="store-text">10:00~21:00</view>
								</view>
								<view class="store-status"> 营业中</view>
							</view>
						</view>
						<view class="store-right" @tap="tapStore(v,i)">
							<view class="store-text">去下单</view>
							<text class="look">距离 {{v.distance}} km</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	
	export default {
		data() {
			return {
				latitude:'',
				longitude:'',
				markers:[],
				storeData:[],
				index:-1,
				type:'radio',
				copyListData:'',
				copyIndexData:-1
			};
		},
		onLoad() {
			this.getStoreData()
		},
		computed: {
			...mapState(['location'])
		},
		methods: {
			...mapMutations(['SET_LOCATION']),
			getStoreData() {
				return new Promise((resolve,reject)=>{
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
					let map = []
					let len = resMap.length
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
					}
					
					if(this.location.index){
						this.index = this.location.index;
					}else{
						this.index = 0
					}
					this.latitude = this.location.latitude
					this.longitude = this.location.longitude
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
			/* 切换 */
			change(e){
				let i = Number(e.currentTarget.dataset.i);
				this.index = i;
				this.$nextTick(()=>{
					this.$emit("change",this.get(),this.$props.keyName);
				})
				
				this.setMarkers(i)
			},
			/* 设置值 */
			set(data) {
				this.type = 'radio';
				this.index = data.index >= 0 ? data.index : -1;
				this.storeData = data.storeData;
				
				if(data.maxSize > 0 && data.maxFn){
					this.maxSize = data.maxSize;
					this.maxFn = data.maxFn;					
				}else{
					this.maxSize = undefined;
					this.maxFn = undefined;
				}
				
				// 存储数据
				this.copyListData = JSON.stringify(data.storeData);
				this.copyIndexData = data.index === undefined ? -1 : data.index;
			},
			/* 获取值 */
			get(){
				if(this.index >= 0){
					return this.storeData[this.index];
				}else{
					return null;
				}
				
				let arr=[];
				this.storeData.forEach((item,index)=>{
					if(item.checked == true){
						arr.push(item);
					}
				});
				return arr.length > 0 ? arr : null;
			},
			tapStore(store,index) {
				console.log("store",store.storeName)
				store.index = index
				this.SET_LOCATION(store)
				uni.switchTab({
					url:'../index/index'
				})
			},
			setMarkers(i){
				let store = this.storeData[this.index];
				this.latitude = store.latitude
				this.longitude = store.longitude
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container{
		width: 100%;
		height: 100%;
	}
	.page-map {
		width: 100%;
		height: 400rpx;
	}
	
	
	.stores{
		width: 100%;
		height: 100%;
		padding: 20rpx;
		
		&>view{
			padding: 10rpx;
			box-sizing: border-box;
		}

		.item{
			box-sizing: border-box;
			border: #e5e5e5 solid 1px;
			background-color: #fff;
			color: #333;
			position: relative;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			
			// 未选中状态下的禁用样式
			&.disabled{
				background-color: #f1f1f1;
				color: #d8d8d8;
			}
			
			&.active{
				background-color: #FFFFFF;
				color: $color-primary;
				border: $color-primary solid 1px;
				
				&::before{
					content: '';
					display:block;
					width: 20px;
					height: 20px;
					background-color: $color-primary;
					position: absolute;
					right: -1px;
					bottom: -1px;
					z-index: 1;
					clip-path: polygon(100% 0, 0% 100%, 100% 100%);
				}
				&::after{
					content: '';
					display:block;
					width: 3px;
					height: 6px;
					border-right: #fff solid 2px;
					border-bottom: #fff solid 2px;
					transform:rotate(25deg);
					position: absolute;
					right: 3px;
					bottom: 3px;
					z-index: 2;
				}
				
				// 选中状态下的禁用样式
				&.disabled{
					background-color: #f1f1f1;
					color: #d8d8d8;
					border: #e5e5e5 solid 1px;
					
					&::before{
						background-color: #d9d9d9;
					}
				}
			}
		}
	}

	.store {
		display: flex;
		flex-wrap: nowrap;
		margin: 20rpx 20rpx;
		padding: 10rpx;
		background-color: #FFFFFF;
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
