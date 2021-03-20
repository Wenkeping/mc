'use strict';

const uniID = require('uni-id');
exports.main = async (event) => {
	/* 如果你通过云函数Url访问
	 * 使用GET时参数位于event.queryStringParameters
	 * 使用POST时参数位于event.body
	 * 请自行处理上述场景
	 */
	let params = event.params || {}
	let payload = {}
	let noCheckAction = [ 'loginByWeixin']

	const {code,mcToken} = params
	
	if (noCheckAction.indexOf('loginByWeixin') === -1) {
		if (!mcToken) {
			return {
				code: 403,
				msg: '缺少token'
			}
		}
		
		payload = await uniID.checkToken(mcToken, {needPermission: true})
		if (payload.code && payload.code > 0) {
			return payload
		}
	}
	
	let res = {}
	switch (event.action) {
		case 'loginByWeixin':
			{
				res = await uniID.loginByWeixin({
					code
				});
				break;
			}
		default:
			res = {
				code: 403,
				msg: '非法访问'
			}
			break;
	}
	return res
};
