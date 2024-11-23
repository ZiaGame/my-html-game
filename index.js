	const canvas = document.querySelector('canvas') // Сохраняем JS отдельно, чтоб при расширении в вертикальной игре можно было тут что-то менять без сложностей
	const c = canvas.getContext('2d') // помещаем все в 2д

	canvas.width = 1024 + 885
	canvas.height = 576 + 300

	const scaledCanvas = {
		width: canvas.width / 4,
		height: canvas.height / 4
	}

	const floorCollisions2D = []
	for (let i = 0; i< floorCollisions.length; i += 36) {
		floorCollisions2D.push(floorCollisions.slice(i, i + 36))
	}

	const collisionBlocks = []
	floorCollisions2D.forEach((row, y) =>{
		row.forEach((symbol, x) => {
			if (symbol === 973) {
				console.log('draw a block here!')
				collisionBlocks.push(
					new CollisionBlock ({
						position: {
							x: x * 16,
							y: y * 16,
						},
					})
				)
			}
		})
	})

	const platformCollisions2D = []
	for (let i = 0; i< platformCollisions.length; i += 36) {
		platformCollisions2D.push(platformCollisions.slice(i, i + 36))
	}

		const platformCollisionBlocks = []
	platformCollisions2D.forEach((row, y) =>{
		row.forEach((symbol, x) => {
			if (symbol === 973) {
				console.log('draw a block here!')
				platformCollisionBlocks.push(
					new CollisionBlock ({
						position: {
							x: x * 16,
							y: y * 16,
						},
						height: 4,
					})
				)
			}
		})
	})
	
	console.log(collisionBlocks)

	const gravity = 0.1
	
	const player = new Player({
		position: {
		x: 100,
		y: 300,
		},
		collisionBlocks,
		platformCollisionBlocks,
		imageSrc: './img/lololowka/idle.png',
		frameRate: 2,
		animations: {
			idle: {
				imageSrc: './img/lololowka/idle.png',
				frameRate: 2,
				frameBuffer: 7,
			},
			run: {
				imageSrc: './img/lololowka/run.png',
				frameRate: 2,
				frameBuffer: 5,
			},
			jump: {
				imageSrc: './img/lololowka/jump.png',
				frameRate: 2,
				frameBuffer: 3,
			},
			fall: {
				imageSrc: './img/lololowka/fall.png',
				frameRate: 2,
				frameBuffer: 3,
			},
			fallLeft: {
				imageSrc: './img/lololowka/fallLeft.png',
				frameRate: 2,
				frameBuffer: 3,
			},
			runLeft: {
				imageSrc: './img/lololowka/runLeft.png',
				frameRate: 2,
				frameBuffer: 5,
			},
			jumpLeft: {
				imageSrc: './img/lololowka/jumpLeft.png',
				frameRate: 2,
				frameBuffer: 3,
			},
			idleLeft: {
				imageSrc: './img/lololowka/idleLeft.png',
				frameRate: 2,
				frameBuffer: 7,
			},
		},
	})
	
	const keys = {
		d: {
			pressed: false
		},
		a: {
			pressed: false
		},
	}

	const background = new Sprite ({
		position: {
			x: 0,
			y: 0,
		},
		imageSrc: './img/background.png',
	})

	const heightFonovogoImage = 432

	const camera = {
		position: {
			x: 0,
			y: -heightFonovogoImage + scaledCanvas.height,
		},
	}

	function animate () {
		window.requestAnimationFrame(animate)
			c.fillStyle = 'white'
			c.fillRect(0, 0, canvas.width, canvas.height)

			c.save()
			c.scale(4,4)
			c.translate(camera.position.x, camera.position.y )
			background.update()
			// collisionBlocks.forEach(collisionBlock => {
			// 	collisionBlock.update()
			// })

			// platformCollisionBlocks.forEach(block => {
			// 	block.update()
			// })

			player.chtobNeUpalZaKartu()
			player.update()

			player.velocity.x = 0
			if (keys.d.pressed) {
				player.swapSprite('run')
				player.velocity.x = 2
				player.posledneeDirection = 'right'
				player.canCameraToLeft({canvas, camera})
			}
				else if (keys.a.pressed) {
					player.swapSprite('runLeft')
					player.velocity.x = -2
					player.posledneeDirection = 'left'
					player.canCameraToRight({canvas, camera})
				}

				else if (player.velocity.y === 0) {
					if (player.posledneeDirection === 'right') player.swapSprite('idle')
						else player.swapSprite('idleLeft')
				}

				if(player.velocity.y < 0) {
					player.canCameraDown({camera, canvas})
					if (player.posledneeDirection === 'right') player.swapSprite('jump')
						else player.swapSprite('jumpLeft')
				}
					else if (player.velocity.y > 0) {
						player.canCameraUp({camera, canvas})
						if (player.posledneeDirection === 'right') player.swapSprite('fall')
						else player.swapSprite('fallLeft')
					}

			c.restore()
	

			
	}

	animate()

	window.addEventListener('keydown', (event) => {
		switch (event.key){
			case 'd':
			keys.d.pressed = true
			break
			case 'a':
			keys.a.pressed = true
			break
			case 'w':
			player.velocity.y = -3 //двигаться вверх. но из-зи присутствия гравитации падать
			break
		}
	}) //нажатие клавиш, обработчик событий

	window.addEventListener('keyup', (event) => {
		switch (event.key){
			case 'd':
			keys.d.pressed = false
			break
			case 'a':
			keys.a.pressed = false
			break
		}
	}) //отпускание клавиш, обработчик событий


