const cossAPI = require('./coss-api');

const main = async () => {
	console.log('COSS.io API Example');

	const api = cossAPI();

	try {
		const marketPairs = await api.marketPairs();
		console.log('Market Pairs', marketPairs);
	} catch(error) {
		console.error('Failed to request market pairs', error);
	}

	const intervalDepth = async () => {
		try {
			const depth = await api.depth('coss-eth');
			console.log('First Bid', depth.bids[0]);
			console.log('First Ask', depth.asks[0]);
		} catch(error) {
			console.error('Failed to request depth data', error);
		}
	}

	intervalDepth();
	setInterval(intervalDepth, 10000);
}

main();