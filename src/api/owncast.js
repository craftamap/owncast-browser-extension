function OwnCast(instance) {
	this.getConfig = async () => {
		return fetch(instance + 'api/config')
			.then(response => {
				return response.json()
			})
	};

	this.getStatus = async () => {
		return fetch(instance + 'api/status')
			.then(response => {
				return response.json()
			})
	}

	this.getYp = async () => {
		return fetch(instance + 'api/yp')
			.then(response => {
				return response.json()
			})
	};
}


export default {
	OwnCast
};
