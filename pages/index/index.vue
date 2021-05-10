<template>
	<view class="container">
		<view class="header">
			<view class="store">
				<view class="buttons">
					<button type="default" class="button" 
							:class="{active: orderType == 'lunch'}" plain 
							hover-class="none" @tap="switchOrderType">
						中餐
					</button>
					<button type="default" class="button" 
							:class="{active: orderType == 'dinner'}" plain 
							hover-class="none" @tap="switchOrderType">
						晚餐
					</button>
				</view>
			</view>
		</view>
			
		<view class="title" v-if="Object.keys(currentStore).length > 0">
			<view class="address">
				<image src="/static/images/order/order_icon_address.png" class="left-icon" />
				<view @tap="tapStore">{{ currentStore.storeName }} </view>
				<view class="iconfont icon-arrow-right mt-5"></view>
			</view>
			<view class="dis font-size-extra-sm">距离您{{ currentStore.distance }}km</view>
		</view>
		<view class="title" v-else>
			<view class="address">
				<image src="/static/images/order/order_icon_address.png" class="left-icon" />
				<view @tap="tapStore">抱歉，当前收获地址无匹配门店</view>
				<view class="iconfont icon-arrow-right mt-5"></view>
			</view>
			<view class="dis font-size-extra-sm">距离您{{ currentStore.distance }}km</view>
		</view>
		
		<view class="main">
			<!-- 左侧菜单 begin -->
			<scroll-view class="menu-bar" scroll-y scroll-with-animation :scroll-top="productsLeftScrollTop">
				<view class="wrapper">
					<view class="menu-item" @tap="handleMenuSelected(category.id_category)" :class="{active: currentCategoryId == category.id_category}" v-for="(category, index) in categories" :key="index">
						<image :src="category.category_image_url" class="image" mode="widthFix"></image>
						<view class="title">{{ category.name }}</view>
					</view>
				</view>
			</scroll-view>
			<!-- 左侧菜单 end -->
			
			<!-- 右侧商品列表 begin -->
			<scroll-view class="product-section" scroll-y scroll-with-animation :scroll-top="productsScrollTop" @scroll="productsScroll">
				<view class="wrapper">
					<view id="ads">
						<!-- 广告栏 begin -->
						<swiper class="ads1" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular>
							<swiper-item v-for="(ad, index) in ads1" :key="index">
								<image :src="ad" class="w-100" mode="widthFix"></image>
							</swiper-item>
						</swiper>
						<!-- 广告栏 end -->
					</view>
					
					<!-- 商品 begin -->
					<view class="products-list" v-for="(category, index) in categories" :key="index" :id="`products-${category.id_category}`">
						<view class="category-name">{{ category.name }}</view>
						<view class="products">
							<view class="product" v-for="(product, key) in category.products" :key="key" 
								@tap="showProductDetailModal(product)">
								<image :src="product.product_img" mode="widthFix" class="image"></image>
								<view class="content">
									<view class="name">{{ product.name }}</view>
									<view class="description">{{product.description}}</view>
									<view class="price">
										<view>￥{{ product.price }}</view>
										<actions :number="productCartNum(product.id_product)"
												@add="handleAddToCart(product)" 
												@minus="handleMinusFromCart(product)" />
									</view>
								</view>
							</view>
						</view>
					</view>
					<!-- 商品 end -->
				</view>
			</scroll-view>
			<!-- 右侧商品列表 end -->
		</view>
		
		<!-- 商品详情 modal begin -->
		<product-modal :product="product" 
						:visible="productModalVisible" 
						@cancel="closeProductDetailModal" 
						@add-to-cart="handleAddToCartInModal" 
		/>
		<!-- 商品详情 modal end -->
		<!-- 购物车栏 begin -->
		<cart-bar :cart="cart" 
				  @add="handleAddToCart" 
				  @minus="handleMinusFromCart"
				  @clear="clearCart"
				  @pay="pay"
		/>
		<!-- 购物车栏 end -->
	</view>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import Actions from './components/actions/actions.vue'
	import CartBar from './components/cartbar/cartbar.vue'
	import ProductModal from './components/product-modal/product-modal.vue'
	import cartPopup from './components/cart-popup/cart-popup.vue'
	
	export default {
		components: {
			Actions,
			CartBar,
			ProductModal,
			cartPopup
		},
		data() {
			return {
				categories: [],
				cart: [],
				product: {},
				currentCategoryId: 0,
				ads1: [
					"https://7463-tcb-9kf1c766c6ytlhcfff934-29a7ad-1304995994.tcb.qcloud.la/微信图片_20210219131024.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/24/38b7f686cf10449c85b0f5489d5d958e.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/21/2315beb5105944e8b795c5c0084ec99f.jpg",
					"https://go.cdn.heytea.com/storage/ad/2020/05/21/b88c6780a73249b0b0166784917a5046.jpg"
				],
				productModalVisible: false,
				cartPopupShow: false,
				productsScrollTop: 0,
				productsLeftScrollTop: 0,
				lastProduct:{},
				currentStore:{}
			}
		},
		computed: {
			...mapState(['orderType','location']),
			productCartNum() {
				//计算单个饮品添加到购物车的数量
				return id_product => this.cart.reduce((acc, cur) => {
						if(cur.id_product === id_product) {
							return acc += cur.number
						}
						return acc
					}, 0)
			}
		},
		 async onLoad() {
			uniCloud.callFunction({
				name:'get-categories',
				success:(e) =>{
					this.categories = e.result.data
					this.currentCategoryId =this.categories.length && this.categories[0].id_category
					this.$nextTick(() => this.calcSize())
				}
			}),
			
			this.getStore()
		},
		methods: {
			...mapMutations(['SET_ORDERTYPE','SET_LOCATION']),
			getStore(){
				let la1 = this.location.latitude
				let lo1 = this.location.longitude
				console.log(this.location)
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
				}).then(resMap => {
					if(resMap.length > 0){
						let storeTemp = resMap[0]
						console.log(storeTemp)
						if(storeTemp.distance <= 2){
							this.currentStore = storeTemp
						}
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
			// 选取门店
			tapStore() {
				uni.navigateTo({
					url: '../stores/stores'
				});
			},
			switchOrderType() {
				if(this.orderType === 'lunch') {
					this.SET_ORDERTYPE('dinner')
				} else {
					this.SET_ORDERTYPE('lunch')
				}
			},
			handleAddToCart(product) {	//添加到购物车
				const index = this.cart.findIndex(item => {
					return item.id_product === product.id_product
				})
				
				if(index > -1) {
					this.cart[index].number += (product.number || 1)
					return
				}
				this.cart.push({
					id_product: product.id_product,
					cate_id: product.category_id,
					name: product.name,
					price: product.price,
					number: product.number || 1,
					image: product.product_img,
					description:product.description
				})
			},
			handleMinusFromCart(product) { //从购物车减商品
				let index = this.cart.findIndex(item => item.id_product == product.id_product)
				this.cart[index].number -= 1
				if(this.cart[index].number <= 0) {
					this.cart.splice(index, 1)
				}
			},
			showProductDetailModal(product) {
				this.product = product
				this.productModalVisible = true
			},
			handleAddToCartInModal(product) {
				this.handleAddToCart(product)
				this.closeProductDetailModal()
			},
			closeProductDetailModal() {
				this.productModalVisible = false
				this.product = {}
			},
			openCartDetailsPopup() {
				this.$refs['cartPopup'].open()
			},
			clearCart() {
				this.cart = []
			},
			handleMenuSelected(id_category) {
				this.productsScrollTop = this.categories.find(item => item.id_category == id_category).top
				this.$nextTick(() => this.currentCategoryId = id_category)
			},
			productsScroll({detail}) {
				const {scrollTop} = detail
				this.lastProduct = this.categories[this.categories.length-1]
				let tabs = this.categories.filter(item=> item.top <= scrollTop).reverse()
				if(tabs.length > 0){
					if(scrollTop >= this.lastProduct.top-200){
						this.currentCategoryId = this.lastProduct.id_category
					}else{
						this.currentCategoryId = tabs[0].id_category
					}
					
					if(tabs.length > this.categories.length/2){
						this.productsLeftScrollTop = this.lastProduct.top
					}else{
						this.productsLeftScrollTop = 0
					}
				}
			},
			calcSize() {
				let h = 0
				let view = uni.createSelectorQuery().select('#ads')
				view.fields({
					size: true
				}, data => {
					h += Math.floor(data.height)
				}).exec()
				
				this.categories.forEach(item => {
					let view = uni.createSelectorQuery().select(`#products-${item.id_category}`)
					view.fields({
						size: true
					}, data => {
						item.top = h
						h += Math.floor(data.height)
						item.bottom = h
					}).exec()
				})
			},
			pay() {
				let payData = {
					orderType: this.orderType,
					goodsInOrder: this.cart
				}
				uni.setStorageSync('cart', this.cart)
				uni.setStorageSync('payData', payData)
				uni.navigateTo({
					url:'../pay/pay'
				})
			}
		}
	}
	
	
</script>

<style lang="scss">
	@import './index.scss';
</style>
