/* ============================================================
 * coss.io API
 * https://github.com/impmja/coss.io
 * ============================================================
 * Copyright 2018-, Jan (impmja) Schulte
 * Released under the MIT License
 * ============================================================ */

const cossAPI = () => {
	const request = require('request');
	const url = require('url');
	
	const API_URL = 'https://exchange.coss.io/api/';
	const API_DEPTH_ENDPOINT = 'integrated-market/depth/';
	const API_MARKET_PAIRS = 'integrated-market/pairs/';

	const USER_AGENT = 'Mozilla/4.0 (compatible; Node COSS API)';
	const CONTENT_TYPE = 'application/x-www-form-urlencoded';


	const publicRequest = (url, data, method = 'GET') => {
        const _data = data || {};
        const options = {
            url: url,
            qs: _data,
            method: method,
            agent: false,
            headers: {
                'User-Agent': USER_AGENT,
                'Content-type': CONTENT_TYPE
            }
		};
		
		return new Promise((resolve, reject) => {
			request(options, (error, response, body) => {
				if (error) {
					return reject(error);
				}
	
				if (response && response.statusCode !== 200) {
					return reject(response);
				}
	
				try {
					resolve(JSON.parse(body));
				} catch(error) {
					reject(error);
				}
			});
		});
	};

	const transformDepth = (data, level) => {
		const _level = level || 5;
		const result = { ask: [], bid: [] };
		if (!data) {
			return result;
		}
		
		const transform = (values) => {
			const result = [];
			const _limit = Math.min(_level, values.length);
			
			for (let i = 0; i < _limit; ++i) {
				const value = values[i];
				result.push({ 
					price: parseFloat(value[0]),
					quantity: parseFloat(value[1])
				});
			}

			return result;
		}

		try {
			return { 
				bids: transform(data[0]),
				asks: transform(data[1])
			};
		} catch(error) {
			console.error('Failed to transform depth data', error);
			return result;
		}
	}

	const requestDepth = (symbol, level) => {
		console.log(`Requesting depth data for '${symbol}'`);
		return publicRequest(url.resolve(url.resolve(API_URL, API_DEPTH_ENDPOINT), symbol)).then(data => {
			return transformDepth(data, level);
		}).catch(error => {
			console.error(`Failed to request depth data for '${symbol}'`, error);
		});
	}

	const transformMarketPairs = (data) => {
		// TODO: Add transformation...
		return data;
	}

	const requestMarketPairs = () => {
		console.log('Requesting market pairs');
		return publicRequest(url.resolve(API_URL, API_MARKET_PAIRS)).then(data => {
			return transformMarketPairs(data);
		}).catch(error => {
			console.error('Failed to request market pairs', error);
		});
	}

	return {
		depth: (symbol, level) => {
			if (!symbol || !symbol.length) {
				throw new Error('Invalid symbol');
			}
			return requestDepth(symbol, level);
		},

		marketPairs: () => {
			return requestMarketPairs();
		}
	}
}

module.exports = cossAPI;