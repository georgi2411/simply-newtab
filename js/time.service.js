export default class TimeService {
	constructor(clockElement, greetingElement) {
		this.clockElement = clockElement;
		this.greetingElement = greetingElement;
	}

	bootstrap() {
		this.update();

		setInterval(() => {
			this.update();
		}, 500);
	}

	update() {
		const parts = this.getTimeParts();
		const hourFormatted = parts.hour.toString().padStart(2, "0");
		const minuteFormatted = parts.minute.toString().padStart(2, "0");

		this.clockElement.textContent = `${hourFormatted}:${minuteFormatted}`;
		this.greetingElement.textContent = `Good ${this.getGreetMessage(parts.hour)}`;
	}

	getTimeParts() {
		const now = new Date();

		return {
			hour: now.getHours() % 24,
			minute: now.getMinutes()
		};
	}

	getGreetMessage(hour) {
		if (hour >= 5 && hour <= 11) {
			return "morning."
		}  else if (hour >= 12 && hour <= 16) {
			return "afternoon."
		} else if (hour >= 17 || hour <= 4) {
			return "evening."
		}
	}

	get getCurrentDate() {
		return new Date().toJSON().slice(0, 10).replace(/-/g, '/')
	}
}
