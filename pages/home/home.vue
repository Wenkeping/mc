<template>
	<view class="container">
		<swiper class="banner-swiper" indicator-dots circular autoplay>
			<swiper-item v-for="(item, index) in swipers" :key="index">
				<image :src="item"></image>
			</swiper-item>
		</swiper>
		
		<view class="content">
			<view class="section-1">
				<navigator class="item" open-type="switchTab" url="/pages/index/index" hover-class="none">
					<image src="/static/images/home/home_icon_ziqu1.png" mode="widthFix"></image>
					<view class="wenyue-font">中餐</view>
					<view class="text-color-assist">次日 9:30-11:00 送达</view>
				</navigator>
				<navigator class="item" open-type="navigate" url="/pages/addresses/addresses" hover-class="none">
					<image src="/static/images/home/home_icon_waimai1.png" mode="widthFix"></image>
					<view class="wenyue-font">晚餐</view>
					<view class="text-color-assist">次日 15:30-17:00 送达</view>
				</navigator>
			</view>
			
			<view class="section-2">
				<view class="integrals">
					<view>服务说明</view>
				</view>
				<view>
					本服务需提前一天预定中餐或晚餐<br>
					当日可下单时间：7:00-22:00 <br>
					中餐：次日 8:00-9:00 现做食材, 9:30-11:00 送达<br>
					晚餐：次日 14:00-15:00 现做食材, 15:30-17:00 送达<br>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
