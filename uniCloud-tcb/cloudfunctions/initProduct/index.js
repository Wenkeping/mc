'use strict';
const db = uniCloud.database();
const productDB = db.collection('db-product');
exports.main = async (event, context) => {
	let productArry = [{
        "id_product": 1001,
        "name": "老姜炒鸡",
        "description": "",
        "category_id": 3,
        "sort": 1,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1002,
        "name": "麻辣鸡块",
        "description": "",
        "category_id": 3,
        "sort": 2,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1003,
        "name": "酸辣鸡杂",
        "description": "",
        "category_id": 3,
        "sort": 3,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1004,
        "name": "黄焖鸡",
        "description": "",
        "category_id": 3,
        "sort": 4,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1005,
        "name": "姜母鸭",
        "description": "",
        "category_id": 6,
        "sort": 5,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1006,
        "name": "乡村血鸭",
        "description": "",
        "category_id": 6,
        "sort": 6,
        "price": 18,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1007,
        "name": "香辣啤酒鸭",
        "description": "",
        "category_id": 6,
        "sort": 7,
        "price": 18,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1008,
        "name": "红烧鱼块",
        "description": "",
        "category_id": 9,
        "sort": 8,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1009,
        "name": "小鱼小虾",
        "description": "",
        "category_id": 9,
        "sort": 9,
        "price": 9,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1010,
        "name": "红烧鲫鱼",
        "description": "",
        "category_id": 9,
        "sort": 10,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1011,
        "name": "香煎鳕鱼",
        "description": "",
        "category_id": 9,
        "sort": 11,
        "price": 18,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1012,
        "name": "香辣小鱼干",
        "description": "",
        "category_id": 9,
        "sort": 12,
        "price": 19,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1013,
        "name": "辣椒炒肉",
        "description": "",
        "category_id": 12,
        "sort": 13,
        "price": 9,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1014,
        "name": "酸菜炒油渣",
        "description": "",
        "category_id": 12,
        "sort": 14,
        "price": 19,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1015,
        "name": "干锅肥肠",
        "description": "",
        "category_id": 12,
        "sort": 15,
        "price": 19,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1016,
        "name": "爆炒猪肝",
        "description": "",
        "category_id": 12,
        "sort": 16,
        "price": 19,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1017,
        "name": "黄焖猪脚",
        "description": "",
        "category_id": 12,
        "sort": 17,
        "price": 21,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1018,
        "name": "小炒黄牛肉",
        "description": "",
        "category_id": 15,
        "sort": 18,
        "price": 21,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1019,
        "name": "孜然羊肉",
        "description": "",
        "category_id": 18,
        "sort": 19,
        "price": 21,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1020,
        "name": "虾煲",
        "description": "",
        "category_id": 21,
        "sort": 20,
        "price": 21,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1021,
        "name": "牛杂煲",
        "description": "",
        "category_id": 21,
        "sort": 21,
        "price": 21,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1022,
        "name": "鸡公煲",
        "description": "",
        "category_id": 21,
        "sort": 22,
        "price": 21,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1023,
        "name": "酸辣土豆丝",
        "description": "",
        "category_id": 24,
        "sort": 23,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1024,
        "name": "清炒丝瓜",
        "description": "",
        "category_id": 24,
        "sort": 24,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1025,
        "name": "木须炒蛋",
        "description": "",
        "category_id": 24,
        "sort": 25,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1026,
        "name": "西红柿炒蛋",
        "description": "",
        "category_id": 24,
        "sort": 26,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1027,
        "name": "麻婆豆腐",
        "description": "",
        "category_id": 24,
        "sort": 27,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1028,
        "name": "柴火香干",
        "description": "",
        "category_id": 24,
        "sort": 28,
        "price": 8,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1029,
        "name": "油豆腐肉沫",
        "description": "",
        "category_id": 24,
        "sort": 29,
        "price": 9,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1030,
        "name": "四季豆回锅肉",
        "description": "",
        "category_id": 24,
        "sort": 30,
        "price": 18,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1031,
        "name": "卤鸡翅",
        "description": "",
        "category_id": 27,
        "sort": 31,
        "price": 18,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      },{
        "id_product": 1032,
        "name": "团子",
        "description": "",
        "category_id": 27,
        "sort": 32,
        "price": 6,
		"product_img":"https://go.cdn.heytea.com/storage/product/2020/05/18/fbcdfbd39c6548b185c1d0eef790808d.jpg"
      }];
	
	let ret = await productDB.add(productArry);
	return ret;
};
