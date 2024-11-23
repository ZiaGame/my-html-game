class Player extends Sprite{
		constructor({position, 
			collisionBlocks,
			platformCollisionBlocks,
			imageSrc, 
			frameRate, 
			scale = 1, //размер игрока
			animations
		}) {
			super({ imageSrc,frameRate, scale})
			this.position = position
			this.velocity = { // Скорость перемещения
				x: 0,
				y: 1,
			}

			this.collisionBlocks = collisionBlocks
			this.platformCollisionBlocks = platformCollisionBlocks
			this.hitbox = {
				position: {
					x: this.position.x,
					y: this.position.y,
				},
				width: 10,
				height:10,
			}
			
			this.animations = animations
			this.posledneeDirection = 'right'

			for(let key in this.animations) {
				const image = new Image()
				image.src = this.animations[key].imageSrc

				this.animations[key].image = image

			}

			this.camerabox = {
				position: {
					x: this.position.x,
					y: this.position.y,
				},
				width: 200,
				height: 80,
			}
		}

		
		swapSprite(key) {
			if (this.image === this.animations[key].image || !this.loaded) 
				return

			this.currentFrame = 0
			this.image = this.animations[key].image
		}

		updateCamerabox() {
				this.camerabox = {
				position: {
					x: this.position.x - 85,
					y: this.position.y,
				},
				width: 200,
				height: 80,
			}
		}

		chtobNeUpalZaKartu() {
			if(this.hitbox.position.x + this.hitbox.width + this.velocity.x >= 576 ||
				this.position.x + this.velocity.x <= 0
				) {
				this.velocity.x = 0
			}
		}

		canCameraToLeft({canvas, camera}) {
			const cameraboxRightSide = this.camerabox.position.x + this.camerabox.width
			const scaledDownCanvasWidth = canvas.width / 4

			if (cameraboxRightSide >= 576) return

			if (cameraboxRightSide >= scaledDownCanvasWidth + Math.abs(camera.position.x)) {
				camera.position.x -= this.velocity.x
			}
 		}

 		canCameraToRight({canvas, camera}) {
 			if (this.camerabox.position.x <= 0) return

 			if (this.camerabox.position.x <= Math.abs(camera.position.x)) {
 				camera.position.x -= this.velocity.x
 			}
 		}

 		canCameraDown({canvas, camera}) {
 			if (this.camerabox.position.y + this.velocity.y <= 0) return

 			if (this.camerabox.position.y <= Math.abs(camera.position.y)) {
 				camera.position.y -= this.velocity.y
 			}
 		}

 		canCameraUp({canvas, camera}) {
 			if (this.camerabox.position.y + this.camerabox.height + this.velocity.y >= 432) return

 			const scaledCanvasHeight = canvas.height / 4

 			if (this.camerabox.position.y + this.camerabox.height >= Math.abs(camera.position.y) + scaledCanvasHeight) {
 				camera.position.y -= this.velocity.y
 			}
 		}

		update() {
			this.updateFrames()
			this.updateHitbox()


			this.updateCamerabox()
			// блок, чтоб видеть движение камеры при перемещении 
			// c.fillStyle = 'rgba(0, 0, 255, 0.2)'
			// 	c.fillRect(this.camerabox.position.x, 
			// 		this.camerabox.position.y, 
			// 		this.camerabox.width, 
			// 		this.camerabox.height)


				/*c.fillStyle = 'rgba(0, 255, 0, 0.2)'
				c.fillRect(this.position.x, this.position.y, this.width, this.height)
				
				this.draw()
				
				//hitbox
				c.fillStyle = 'rgba(255, 0, 0, 0.2)'
				c.fillRect(this.hitbox.position.x, 
					this.hitbox.position.y, 
					this.hitbox.width, 
					this.hitbox.height)*/
				
				this.draw()

				this.position.x += this.velocity.x
				this.updateHitbox()
				this.checkForHorizontalCollisions()
				this.applyGravity()	
				this.updateHitbox()	
				this.checkForVerticalCollisions()
		}

		updateHitbox() {
			this.collisionBlocks = collisionBlocks
			this.hitbox = {
				position: {
					x: this.position.x + 11,
					y: this.position.y,
				},
				width: 16,
				height:29,
			}
		}

		checkForHorizontalCollisions() {
			for (let i=0; i < collisionBlocks.length; i++) {
				const collisionBlock = this.collisionBlocks[i]
				
				if( 
				collision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
					) {
					if (this.velocity.x > 0) {
						this.velocity.x = 0

						const offset = this.hitbox.position.x - this.position.x + this.hitbox.width

						this.position.x = collisionBlock.position.x - offset - 0.01
						break
					}

					if (this.velocity.x < 0) {
						this.velocity.x = 0

						const offset = this.hitbox.position.x - this.position.x

						this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01
						break
					}
				}
			}
		}

		applyGravity() {
			this.velocity.y += gravity
			this.position.y += this.velocity.y
		}

		checkForVerticalCollisions() {
			for (let i=0; i < collisionBlocks.length; i++) {
				const collisionBlock = this.collisionBlocks[i]
				if( 
				collision({
					object1: this.hitbox,
					object2: collisionBlock,
				})
					) {
					if (this.velocity.y > 0) {
						this.velocity.y = 0

						const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

						this.position.y = collisionBlock.position.y - offset - 0.01
						break
					}

					if (this.velocity.y < 0) {
						this.velocity.y = 0

						const offset = this.hitbox.position.y - this.position.y

						this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01
						break
					}
				}
			}


			//для блоков с платформами
			for (let i=0; i < platformCollisionBlocks.length; i++) {
				const platformCollisionBlock = this.platformCollisionBlocks[i]
				if( 
				platformCollision({
					object1: this.hitbox,
					object2: platformCollisionBlock,
				})
					) {
					if (this.velocity.y > 0) {
						this.velocity.y = 0

						const offset = this.hitbox.position.y - this.position.y + this.hitbox.height

						this.position.y = platformCollisionBlock.position.y - offset - 0.01
						break
					}

				
				}
			}
		}
	}