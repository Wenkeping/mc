'use strict';
const db = uniCloud.database();
const categoryDB = db.collection('db-category');
exports.main = async (event, context) => {
let res = await categoryDB.aggregate()
					.lookup({
						from:"db-product",
						localField:"id_category",
						foreignField:"category_id",
						as:"products"
					})
					.end();
	return res;
};
