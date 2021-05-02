<template>
	<view class="container">
		<view class="address-form">
			<list-cell padding="30rpx">
				<view class="form-item">
					<view class="label">联系人</view>
					<input type="text" v-model="form.userName" placeholder="请填写收货人的姓名" placeholder-class="placeholder"/>
				</view>
			</list-cell>
			<list-cell padding="30rpx">
				<view class="form-item">
					<view class="label">性别</view>
					<view class="radio" @tap="form.gender = !form.gender">
						<image :src="form.gender ? '/static/images/common/gouxuankuang.png' : '/static/images/common/round-black-selected.png'"></image>
						<view>先生</view>
					</view>
					<view class="radio" @tap="form.gender = !form.gender">
						<image :src="!form.gender ? '/static/images/common/gouxuankuang.png' : '/static/images/common/round-black-selected.png'"></image>
						<view>女士</view>
					</view>
				</view>
			</list-cell>
			<list-cell padding="30rpx">
				<view class="form-item">
					<view class="label">手机号</view>
					<input type="text" v-model="form.telNumber" placeholder="请填写收货手机号码" placeholder-class="placeholder"/>
				</view>
			</list-cell>
			<list-cell padding="30rpx">
				<view class="form-item">
					<view class="label">收货地址</view>
					<input type="text" @tap="chooseLocation" v-model="form.address" placeholder="点击选择" placeholder-class="placeholder"/>
					<image src="/static/images/common/icon_jump_black3.png" class="jump-icon"></image>
				</view>
			</list-cell>
			<list-cell padding="30rpx">
				<view class="form-item">
					<view class="label">门牌号</view>
					<input type="text" v-model="form.detailInfo" placeholder="例:B座6楼606室" placeholder-class="placeholder"/>
				</view>
			</list-cell>
			
			<list-cell padding="30rpx" last>
				<view class="form-item">
					<view class="radio" @tap="form.is_default = !form.is_default">
						<image :src="!form.is_default ? '/static/images/common/gouxuankuang.png' : '/static/images/common/round-black-selected.png'"></image>
						<view>设为默认地址</view>
					</view>
				</view>
			</list-cell>
		</view>
		
		<view class="save-btn">
			<button type="info" @tap="save">保存</button>
		</view>
	</view>
</template>

<script>
	import listCell from '@/components/list-cell/list-cell.vue'
	
	export default {
		components: {
			listCell
		},
		data() {
			return {
				form: {
					userName: '',
					gender: 0,
					telNumber: '',
					address: '',
					detailInfo: '',
					latitude: '',
					longitude: '',
					is_default: 0
				}
			}
		},
		onLoad({id}) {
			if(id) {
				this.form = this.$store.state.addresses.find(item => item.id == id)
			}
		},
		methods: {
			chooseLocation() {
				uni.chooseLocation({
					success: res => {
						if(res.errMsg === "chooseLocation:ok") {
							console.log(res)
							this.form.address = res.address
							this.form.latitude = res.latitude
							this.form.longitude = res.longitude
						}
					}
				})
			},
			save() {
				return uniCloud.callFunction({
					name: 'user-center',
					data: {
						action: 'validateToken',
						params: {
							mcToken: uni.getStorageSync('mc_token')
						}
					}
				}).then(res => {
					if (res.result.code === 0) {
					 	let data = this.form
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
						
					 }else{
						 uni.navigateTo({url: '/pages/login/login'})
					 }
				})
			}
		}
		
	}
</script>

<style lang="scss" scoped>
.address-form {
	padding: 30rpx;
	
	.form-item {
		width: 100%;
		display: flex;
		align-items: center;
		
		.label {
			width: 160rpx;
		}
		
		input {
			flex: 1;
		}
		
		.jump-icon {
			width: 30rpx;
			height: 48rpx;
		}
		
		.radio {
			display: flex;
			margin-right: 50rpx;
			image {
				width: 40rpx;
				height: 40rpx;
				margin-right: 20rpx;
			}
		}
	}
}

.save-btn {
	padding: 0 30rpx;
	margin-top: 60rpx;
	
	button {
		width: 100%;
		font-size: $font-size-extra-lg;
		border-radius: $border-radius-lg;
	}
}
</style>
