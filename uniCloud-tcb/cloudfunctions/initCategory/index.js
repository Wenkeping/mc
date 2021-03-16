'use strict';

const db = uniCloud.database();
const categoryDB = db.collection('db-category')
exports.main = async (event, context) => {
	let categoryArry = [{
	  "id_category": 3,
	  "name": "鸡",
	  "sort": 1,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/23/f77f2e333a34410384c21da48e138599.jpg"
	},
	{
	  "id_category": 6,
	  "name": "鸭",
	  "sort": 2,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/05/02/c9d862a735af48d280ab8b21a2315514.jpg"
	},
	{
	  "id_category": 9,
	  "name": "鱼",
	  "sort": 3,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/23/3b52e3d18fae4290b0a668a776b21645.jpg"
	},
	{
	  "id_category": 12,
	  "name": "猪",
	  "sort": 4,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/21/ef7b2a24507a4e20b50355eccc3261db.jpg"
	},
	{
	  "id_category": 15,
	  "name": "牛",
	  "sort": 5,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/23/ac7a2ff85b6944fe83df06a79cc19834.jpg"
	},
	{
	  "id_category": 18,
	  "name": "羊",
	  "sort": 6,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/21/3de570175dbb4c74a6291e1b6df4eb6a.jpg"
	},
	{
	  "id_category": 21,
	  "name": "煲",
	  "sort": 7,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/23/50609654ded746f28ea60485a7e715b5.jpg"
	},
	{
	  "id_category": 24,
	  "name": "时蔬",
	  "sort": 8,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/21/43c745f3ead64208830401107c44eef2.jpg"
	},
	{
	  "id_category": 27,
	  "name": "小吃",
	  "sort": 9,
	  "category_image_url": "https://go.cdn.heytea.com/storage/category/2020/04/21/19047118303443b09ba73f82c54e4f03.jpg"
	}];
	
	let ret = await categoryDB.add(categoryArry);
	return ret;
};
