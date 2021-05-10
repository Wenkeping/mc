'use strict';
const db = uniCloud.database();
const categoryDB = db.collection('db-category');
exports.main = async (event, context) => {
	// 门店列表
	const res = await db.collection('db-stores').get()
	const resData = res.data
	return {
		status:0,
		data:resData
	}
};
