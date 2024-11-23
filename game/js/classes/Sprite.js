class Sprite {
	constructor({position, imageSrc, frameRate = 1, frameBuffer = 9, scale = 1}) {
		this.position = position
		this.loaded = false
		this.scale = scale
		this.image = new Image()
		this.image.onload = () => {
			this.width = (this.image.width / this.frameRate) * this.scale //размер, ширина игрока
			this.height = this.image.height * this.scale //размер, высота игрока
			this.loaded = true
		}
		this.image.src = imageSrc
		this.frameRate = frameRate
		this. currentFrame = 0
		this.frameBuffer = frameBuffer
		this.elapsedFrames = 0
	}

	draw() {
		if (!this.image) return

		const cropbox = {
			position: {
				x: this.currentFrame * (this.image.width / this.frameRate),
				y:0,
			},
			width: this.image.width / this.frameRate,
			height: this.image.height,
		}

		c.drawImage(
			this.image, 
			cropbox.position.x, //рамка для крокбокса(рамка для обрезки)
			cropbox.position.y, //рамка для крокбокса
			cropbox.width, //рамка для крокбокса
			cropbox.height, //рамка для крокбокса
			this.position.x, 
			this.position.y,
			this.width,
			this.height
			)
	}

	update() {
		this.draw()
		this.updateFrames()
	}
	updateFrames() {
		this.elapsedFrames++

		if(this.elapsedFrames % this.frameBuffer ===0) {
		if (this.currentFrame < this.frameRate - 1) this.currentFrame++
		else this.currentFrame = 0
		}
	}
}