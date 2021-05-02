'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	// 判定 order 行为
	if(event.action == 'submitOrder') {
		
		// 获取 openId 和 carts
		const {openId,orderType,goodsInOrder,chooseStore,remark} = event.data
		
		// 生成订单号
		const orderId = parseInt(Date.now() / 1000)
		console.log(orderId)
		
		// 计算订单总金额
		const totalFee = goodsInOrder.reduce((acc, cur) => acc + cur.number * cur.price, 0)
		console.log(totalFee)
		
		
		// 订单状态
		const status = 1
		
		// 当前时间
		const time = new Date().toLocaleDateString() +" "+ new Date().toLocaleTimeString()
		
		// 生成订单
		const orderResult = await db.collection('db-order').add({
			openId,           // 用户openid
			orderId,       // 用户和时间编译的订单号
			orderType,     // lunch-为中餐,dinner-为晚餐
			goodsInOrder,  // 购物车列表
			totalFee,      // 订单总价
			chooseStore,   // 选择的门店
			status,         // 1-为未支付,2-为已经支付
			remark,
			time
		})
		
		if(!orderResult.id) {
			return {
				code: -3,
				msg: '提交订单失败,请稍后再试'
			}
		}
		return {
			orderId
		}
	}
	
	
	
};
