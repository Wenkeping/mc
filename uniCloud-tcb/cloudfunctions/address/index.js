'use strict';
const db = uniCloud.database()
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
	
	if(event.action == 'getList') {
		// 地址列表
		const res = await db.collection('db-addresses').where({openId}).get()
		const resData = res.data
		return {
			status:0,
			data:resData
		}
		
	} else if (event.action == 'deleteAddress') {
		// 删除地址
		let _id = event.id
		const res = await db.collection('db-addresses').where({_id}).remove()
		 console.log(res)
		if(res.requestId){
			  return {
				  status:0,
				  msg:'删除成功'
			  }
		}
		return {
			status:-1,
			msg:'删除失败'
		}
		
	} else if(event.action == 'addAddress') {
		// 添加地址
		const data = event.data
		data.openId = openId
		
		const detailInfo = event.data.detailInfo
		const addressDB = await db.collection('db-addresses').where({openId},{detailInfo}).get()
		if(addressDB.data.length === 0){
			  const res = await db.collection('db-addresses').add(data)
			  return {
				  status:0,
				  msg:'添加成功'
			  }
		}
		return {
			status:-1,
			msg:'地址已存在'
		}
		
	}else if(event.action == 'editAddress') {
		// 编辑地址
		let _id = event.data._id
		let fields = {
			  userName: event.data.userName,
			  gender: event.data.gender,
			  telNumber: event.data.telNumber,
			  address:event.data.address,
			  detailInfo: event.data.detailInfo,
			  latitude: event.data.latitude,
			  longitude: event.data.longitude,
			  is_default: event.data.is_default
		}
		const res = await db.collection('db-addresses').where({_id}).update({...fields})
		if(res.updated === 1){
			return {
				status:0,
				msg:'数据修改成功'
			}
		}
		
	} else if (event.action == 'getOne') {
		// 获取选中的地址
		const _id = event.id
		const res = await db.collection('db-addresses').where({_id}).limit(1).get()
		const resData = res.data
		return {
			status:0,
			data:resData
		}
	}
};
