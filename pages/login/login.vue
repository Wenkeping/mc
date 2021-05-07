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
			<button type="primary" size="default" class="login-btn"  lang="zh_CN" @tap="wxLogin">
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
			wxLogin(e) {
				const that = this;
				uni.showLoading({
					title: '登录中...'
				})
				
				uni.getUserProfile({
					desc:'获取用户资料',
					success: res =>{
						console.log('res:',res)
						let userInfo = res.userInfo
						return new Promise((resolve, reject)=>{
								uni.login({
									provider:'weixin',
									success(login_res) {
										if (login_res.code) {
											resolve(login_res.code)
										} else {
											reject(new Error('微信登录失败'))
										}
									},
									fail(e) {
										reject(new Error('微信登录失败'))
									}
								})
								
							}).then((code)=>{
								console.log("code:", code)
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
								console.log("token:", res.result.token)
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
						
					},
					
					fail: res =>{
						//如果用户不允许访问其用户头像和昵称,自动为用户匹配账号和头像
						let userInfo = {
							'nickName':'微信用户',
							'avatarUrl':"https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132"
						}
						
						return new Promise((resolve, reject)=>{
								uni.login({
									provider:'weixin',
									success(login_res) {
										if (login_res.code) {
											resolve(login_res.code)
										} else {
											reject(new Error('微信登录失败'))
										}
									},
									fail(e) {
										reject(new Error('微信登录失败'))
									}
								})
							}).then((code)=>{
								console.log("code:", code)
								return uniCloud.callFunction({
									name: 'user-center',
									data: {
										action: 'loginByWeixin',
										params: {
											code
										}
									}
								})
							}).then((res)=>{
								console.log("token:", res.result.token)
								uni.hideLoading()
								if (res.result.code === 0) {
									that.Login(userInfo)
									uni.setStorageSync('mc_token', res.result.token)
								}else{
									return Promise.reject(new Error(res.result.msg))
								}
								uni.navigateBack()
							
							}).catch((err) => {
								console.error(e)
								uni.hideLoading()
								uni.showModal({
									showCancel: false,
									content: '微信登录失败，请稍后再试'
								})
						})
					}
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
