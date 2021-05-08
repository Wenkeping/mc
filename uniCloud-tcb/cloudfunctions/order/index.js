'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	
	// 获取openId
	let token = event.token
	const userInDB = await db.collection('uni-id-users').where({token}).get()
	if (userInDB.data.length !== 1) {
	  return {
	    status: -1,
	    errCode: 'TOKEN_INVALID',
	    msg: '查无此人'
	  }
	}
	 const openId = userInDB.data[0].wx_openid
	
	// 判定 order 行为
	if(event.action == 'submitOrder') {
		// 获取 openId 和 carts
		const {orderType,goodsInOrder,chooseStore,remark} = event.data
		// 生成订单号
		const orderId = parseInt(Date.now() / 1000)
		// 计算订单总金额
		const totalFee = goodsInOrder.reduce((acc, cur) => acc + cur.number * cur.price, 0)
		// 订单状态 1-已支付，2-待烹饪，3-烹饪中，4-派送中，5-已完成
		const status = 0
		// 状态名称
		const statusName = '待烹饪'
		// 当前时间
		const time = new Date().toLocaleDateString() +" "+ new Date().toLocaleTimeString()
		// 生成订单
		const orderResult = await db.collection('db-order').add({
			openId,        // 用户openid
			orderId,       // 用户和时间编译的订单号
			orderType,     // lunch-为中餐,dinner-为晚餐
			goodsInOrder,  // 购物车列表
			totalFee,      // 订单总价
			chooseStore,   // 选择的门店
			status,        // 1-已支付，2-待烹饪，3-烹饪中，4-派送中，5-已完成
			statusName,    // 状态名称
			remark,        // 备注
			time           // 下单时间
		})
		
		if(!orderResult.id) {
			return {
				code: -3,
				msg: '提交订单失败,请稍后再试'
			}
		}
		const orderInfo = await db.collection('db-order').where({openId:openId,orderId:orderId}).get()
		return orderInfo.data
		
		
	}else if(event.action == 'getOrder'){
		let result = {}
		// 当前订单
		const currentOrder = await db.collection('db-order').where({openId:openId,status:{"$lt":3}}).orderBy("time", "desc").get()
		// 历史订单
		const historyOrder = await db.collection('db-order').where({openId:openId,status:3}).orderBy("time", "desc").get()
		
		result.currentOrder = currentOrder.data
		result.historyOrder = historyOrder.data
		return {
			status:0,
			data:result
		}
	}
	
	
	
};
