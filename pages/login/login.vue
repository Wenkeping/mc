<template>
	<view class="container">
		<view class="intro">
			<image src="/static/images/logo.png"></image>
			<view class="tips">
				一杯好茶，一口软欧包
				<br>
				在奈雪遇见两种美好
			</view>
		</view>
		<view class="bottom">
	
				<button type="primary" size="default" class="login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="loginByWeixin">
					微信一键登录
				</button>
		</view>
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	
	export default {
		data() {
			return {
				
			}
		},

		methods: {
			...mapMutations(['Login']),
			getWeixinCode() {
				return new Promise((resolve, reject) => {
					uni.login({
						provider: 'weixin',
						success(res) {
							resolve(res.code)
						},
						fail(err) {
							reject(new Error('微信登录失败'))
						}
					})
				})
			},
			loginByWeixin(e) {
				const that = this;
				let userInfo = e.detail.userInfo;
				
				uni.showLoading({
					title: '登录中...'
				})
				
				this.getWeixinCode().then((code) => {
					return uniCloud.callFunction({
						name: 'user-center',
						data: {
							action: 'loginByWeixin',
							params: {
								code
							}
						}
					})
				}).then((res) => {
					uni.hideLoading()
					if (res.result.code === 0) {
						that.Login(userInfo)
						uni.setStorageSync('mc_token', res.result.token)
					}else{
						return Promise.reject(new Error(res.result.msg))
					}
					uni.navigateBack()
				}).catch((e) => {
					console.error(e)
					uni.hideLoading()
					uni.showModal({
						showCancel: false,
						content: '微信登录失败，请稍后再试'
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.intro {
		width: 100%;
		height: 60vh;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;
		font-size: $font-size-base;
		color: $text-color-assist;
		
		image {
			width: 165rpx;
			height: 165rpx;
		}
		
		.tips {
			line-height: 72rpx;
			text-align: center;
		}
	}
	
	.bottom {
		height: 40vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding: 0 40rpx;
		
		.login-btn {
			width: 100%;
			border-radius: 50rem !important;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 10rpx 0;
			
			image {
				width: 36rpx;
				height: 30rpx;
				margin-right: 10rpx;
			}
		}
		
		.row {
			.grid {
				width: 20%;
				image {
					width: 60rpx;
					height: 60rpx;
					margin-bottom: 10rpx;
				}
			}
		}
	}
</style>
