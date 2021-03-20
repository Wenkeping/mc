<template>
	<view class="container">
		<swiper class="banner-swiper" indicator-dots circular autoplay>
			<swiper-item v-for="(item, index) in swipers" :key="index">
				<image :src="item"></image>
			</swiper-item>
		</swiper>
		
		<view class="content">
			<view class="section-1">
				<view class="item" @tap="lunch" hover-class="none">
					<image src="/static/images/home/home_icon_ziqu1.png" mode="widthFix"></image>
					<view class="wenyue-font">门店</view>
				</view>
				<view class="item" @tap="dinner" hover-class="none">
					<image src="/static/images/home/home_icon_waimai1.png" mode="widthFix"></image>
					<view class="wenyue-font">外卖</view>
				</view>
			</view>
	
		</view>
	</view>
</template>

<script>
	import {mapState} from 'vuex'
	export default {
		data() {
			return {
				swipers: [
					"https://go.cdn.heytea.com/storage/ad/2020/05/21/bfd57914d80d4671b19f5d0ccc176cd5.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/24/49f9b50738dd47878cf1ab54c2eee2e0.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/01/e1c6915022c849fd9492377021aef454.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/04/27/db60b797c1cd4afabe9666e7df958ffd.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/21/4ba53dda599345bdaf28a08420dd1b6f.jpg"
				]
			}
		},
		 onLoad() {
			 
		},
		computed: {
			...mapState(['isLogin','orderType','userInfo','chooseStore'])
		},
		methods: {
			lunch() {
				let mcToken = uni.getStorageSync('mc_token')
				if(!mcToken) {
					uni.navigateTo({url: '/pages/login/login'})
					
				}else{
					this.$store.commit('SET_ORDERTYPE',' Lunch');
					uni.switchTab({
						url:'../index/index'
					})
				}
			},
			dinner() {
				let mcToken = uni.getStorageSync('mc_token')
				if(!mcToken) {
					uni.navigateTo({url: '/pages/login/login'})
				}else{
					this.$store.commit('SET_ORDERTYPE','Dinner');
					uni.switchTab({
						url:'../index/index'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		max-height: 100%;
	}
	
	.banner-swiper {
		width: 100%;
		height: 700rpx;
	}
	
	.banner-swiper image{
		width: 100%;
		height: 100%;
	}

	.content {
		padding: 0 30rpx;
		position: relative;
	}
	
	.section-1 {
		position: relative;
		display: flex;
		margin-top: -120rpx;
		border-radius: $border-radius-lg;
		padding: 60rpx 0;
		box-shadow: $box-shadow;
		margin-bottom: 30rpx;
		.item {
			flex: 1;
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			
			&:nth-child(1):after {
				content: '';
				position: absolute;
				right: 0;
				top: 10;
				bottom: 0;
				width: 2rpx;
				height: 100rpx;
				background-color: $border-color;
			}
			
			image {
				width: 120rpx;
				margin-bottom: 20rpx;
			}
			.wenyue-font {
				font-size: 48rpx;
				margin-bottom: 10rpx;
			}	
		}
	}
	
	.section-2 {
		margin-bottom: 20rpx;
		color: $text-color-assist;
		padding: 20rpx;
		background-color: #EAEBEC;
		border-radius: $border-radius-lg;
		
		.integrals {
			font-size: $font-size-lg;
			color: $text-color-base;
			margin-bottom: 10rpx;
		}
	}
	
</style>
