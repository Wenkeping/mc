<template>
	<view class="actions">
		<image src="/static/images/common/round_minus.png" class="minus-btn" v-show="number" @tap.stop="minus"></image>
		<view v-show="number" class="number">{{ number }}</view>
		<image src="/static/images/common/round_add_normal.png" class="add-btn" @tap.stop="add"></image>
	</view>
</template>

<script>
	export default {
		name: 'Actions',
		props: {
			number: {
				type: Number,
				default: 0
			}
		},
		methods: {
			add() {
				this.$emit('add')
			},
			minus() {
				this.$emit('minus')
			}
		}
	}
</script>

<style lang="scss" scoped>
.actions {
	margin-right: 20rpx;
	display: flex;
	align-items: center;

	.add-btn,
	.minus-btn {
		width: 44rpx;
		height: 44rpx;
	}

	.number {
		width: 44rpx;
		height: 44rpx;
		margin: 0 20rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-extra-lg;
	}
}
</style>
