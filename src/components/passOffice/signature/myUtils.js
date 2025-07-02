export function Button() {
	this.Bounds // in Screen coordinates
	this.Text
	this.Click
}

export function Rectangle(x, y, width, height) {
	this.x = x
	this.y = y
	this.width = width
	this.height = height

	this.Contains = pt => {
		if (
			pt.x >= this.x &&
			pt.x <= this.x + this.width &&
			pt.y >= this.y &&
			pt.y <= this.y + this.height
		) {
			return true
		} else {
			return false
		}
	}
}

export function Point(x, y) {
	this.x = x
	this.y = y
}
