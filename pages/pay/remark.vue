<template>
	<view class="container">
		<view class="textarea-box">
			<textarea class="textarea" v-model="remark" placeholder-class="placeholder" :maxlength="50" @input="handleTextareaInput"></textarea>
			<view class="tips">{{ remark.length }} / 50</view>
		</view>
		<button type="info" class="w-100 font-size-extra-lg border-radius-lg" style="margin-top: 50rpx;" @tap="submit">提交</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				remark: ''
			}
		},
		onShow() {
			this.remark = this.$store.state.remark
		},
		methods: {
			handleTextareaInput(e) {
				if(e.detail.value.length >= 50) {
					uni.showToast({icon: 'none', title: '最多备注50个字符'})
					return
				}
			},
			submit() {
				this.$store.commit('SET_REMARK', this.remark)
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss">
	.container {
		background-color: #FFFFFF;
		padding: 40rpx;
	}
	
	.textarea-box {
		.textarea {
			width: 100%;
			border: 1rpx solid rgba($color: $border-color, $alpha: 0.6);
			padding: 20rpx;
			font-size: $font-size-medium;
		}
	}
</style>
