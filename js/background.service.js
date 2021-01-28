export default class BackgroundService {
	LOCAL_STORAGE_ITEM_KEY = "simply-tab-data";
	AUTHORIZATION_TOKEN = "2qU2OO7KbOUaxG6D8p4bSeILLTvu30dwzlK-tYX3s1U";

	constructor(elements, currentDate) {
		this.elements = elements;
		this.currentDate = currentDate;
	}

	bootstrap() {
		const localBackgroundData = this.getLocalBackgroundData(this.LOCAL_STORAGE_ITEM_KEY);

		if (localBackgroundData !== null && localBackgroundData.activeDate === this.currentDate ||
			localBackgroundData !== null && !navigator.onLine) {
			this.updateUiElements(this.elements, localBackgroundData);
		} else {
			this.getBackgroundData();
		}
	}

	async fetchBackgroundData(key) {
		const queries = [
			"animal",
			"nature",
			"house",
			"village",
			"country",
			"food-drink",
			"street-photography",
			"interiors",
			"travel",
			"textures-patterns",
			"wallpapers",
			"flower",
			"forest",
			"mountain",
			"river",
			"waterfall"
		];
		const randomQuery = queries[Math.floor(Math.random() * queries.length)];

		const response = await fetch(`https://api.unsplash.com/photos/random?orientation=landscape&query=${randomQuery}`, {
			headers: {
				"Authorization": `Client-ID ${key}`
			}
		})
			.then(response => response.json())
			.catch(error => console.error("Failed to fetch background data", error));

		if (response) {
			const { user, location, urls } = response;

			return  {
				backgroundImage: urls.regular,
				author: {
					name: user.name,
					profileLink: user.links.html
				},
				location: location.country
			}
		}
	}

	async retryMechanism(setStorage) {
		try {
			setStorage()
		} catch (error) {
			this.getBackgroundData();
		}
	}

	storeBackgroundData(data, callback) {
		this.convertImageToBase64(data.backgroundImage, async base64Image => {
			const { author, location } = data;

			localStorage.removeItem(this.LOCAL_STORAGE_ITEM_KEY);

			await this.retryMechanism(() =>
				localStorage.setItem(this.LOCAL_STORAGE_ITEM_KEY, JSON.stringify({
					background: base64Image,
					activeDate: this.currentDate,
					author,
					location
				}))
			);

			callback(this.getLocalBackgroundData(this.LOCAL_STORAGE_ITEM_KEY))
		});
	};

	getBackgroundData() {
		this.internetListener(async () => {
			const backgroundData = await this.fetchBackgroundData(this.AUTHORIZATION_TOKEN).then(response => response);

			this.storeBackgroundData(backgroundData, data => {
				this.updateUiElements(this.elements, data);
			})
		})
	}

	convertImageToBase64(url, callback){
		const img = new Image();

		img.crossOrigin = 'Anonymous';
		img.onload = () => {
			let canvas = document.createElement('CANVAS'),
				ctx = canvas.getContext('2d'), dataURL;

			canvas.height = img.height;
			canvas.width = img.width;
			ctx.drawImage(img, 0, 0);
			dataURL = canvas.toDataURL();
			callback(dataURL);
			canvas = null;
		};

		img.src = url;
	}

	updateUiElements(elements, backgroundData) {
		const referral = "?utm_source=simply_new_tab&utm_medium=referral";

		elements.backgroundImage.style.backgroundImage = `url(${backgroundData.background})`;
		elements.backgroundImage.className = "fadein"
		elements.country.textContent = backgroundData.location;
		elements.author.textContent = backgroundData.author.name;
		elements.author.href = `${backgroundData.author.profileLink}/${referral}`;
		elements.source.textContent = "on Unsplash";
		elements.source.href = `https://unsplash.com/${referral}`;
	}

	getLocalBackgroundData(itemKey) {
		return JSON.parse(localStorage.getItem(itemKey));
	}

	internetListener(callback) {
		window.addEventListener("load",  () => {
			if (navigator.onLine) {
				callback();
			}
		});

		window.addEventListener("online", () => {
			callback();
		})
	}
}
