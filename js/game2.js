
var Game = function() {

}

Game.prototype = {

	keys : [],
	team: 'porsche',
	car : null,
	ctx : null,

	laptimes: ['00.000'],
	lapstarttime: new Date().getTime(),
	laptime: null,
	req: null,
	
	setup: function () {
		window.addEventListener("change", this.radio_handler.bind(this), false);
		window.addEventListener("click", this.button_handler.bind(this), false);
	},

	init : function() {
		console.log(this.team);
		//this.time = new Date().getTime() / 1000;
		hud = document.querySelector('output');
		canvas = document.getElementById("game");
		this.ctx = canvas.getContext("2d");
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		this.keys = [];

		this.world = new Sprite ({
			name: 'Barcelona',
			images: ['img/track.svg?r=' + Math.floor(Math.random() * 100)],
			x: 0,
			y: 4350,
			height: 3200 * 6,
			width: 3200 * 6
		});

		this.world_bridges = new Sprite ({
			name: 'Barcelona racetrack objects',
			images: ['img/track-bridges.svg?r=' + Math.floor(Math.random() * 100)],
			x: 0,
			y: 4350,
			height: 3200 * 6,
			width: 3200 * 6
		});

		floor = {
			x:0,
			y:0
		}

		this.car = new Sprite({
			name: 'user1',
			images: [
				'img/' + this.team + '-0.png',
				'img/' + this.team + '-1.png'
			],
			x: canvas.width / 2,
			y: canvas.height / 2,
			angle: 180,
			mod: 1,
			speed: 0.5,
			maxspeed: 50,
			width: 240,
			height: 180
		});

		this.engine = new Engine(this.car);

		this.blip = document.querySelector('.blip');

		window.addEventListener("keydown", this.keydown_handler.bind(this), false);
		window.addEventListener("keyup", this.keyup_handler.bind(this), false);
		
		
		document.body.removeAttribute('unresolved');

		this.req = window.requestAnimationFrame(this.draw.bind(this));	
		
	},


	draw : function() {
		this.checkUserInput();

		this.engine.updateEngine(this.car.speed);

		this.drawHUD();
		this.drawFloor();

		this.ctx.clearRect(0, 0, canvas.width, canvas.height);
		this.world.draw(this.ctx)
		this.checkGroundType();
		this.car.draw(this.ctx)

		this.world_bridges.draw(this.ctx)

		this.req = window.requestAnimationFrame(this.draw.bind(this));

		var tx = 'translateX(' + (Math.floor(this.world.x / this.world.width * 100) * 3.1 * -1) + 'px)';
		var ty = 'translateY(' + (Math.floor(this.world.y / this.world.height * 100) * 1.9 * -1) + 'px)';

		this.blip.style.transform = tx + ' ' + ty;
	},

	checkGroundType: function () {
		var image = this.ctx.getImageData(canvas.width/2, canvas.height/2, 1,1);
		
		if (image.data[0] == 26) {
			this.car.maxspeed = 50;
		}


		if (image.data[0] == 0 || image.data[0] > 80) {
			if(image.data[0] !== 219) {
				this.car.maxspeed = 20;
			}
		} 

		if(this.car.speed > this.car.maxspeed) {
			this.car.speed -= this.car.speed * 0.02;
		}

		if(image.data[0] === 205) {
			//this.car.angle = 360 - this.car.angle;
			this.car.speed = this.car.speed / 2;
		}

		if(image.data[0] === 219 && image.data[1] === 33 && image.data[2] === 204 ) {
			this.setLapTime();
		}

	},

	setLapTime: function () {
		

		var lapfinish = new Date().getTime();
		// ms to s.
		laptime = (lapfinish - this.lapstarttime ) / 1000;

		if(laptime > 20) {
			this.laptimes.push ( laptime );
			this.lapstarttime = new Date().getTime();
		}

		var laptimes = this.laptimes;
		var last = laptimes[laptimes.length - 1];
		var best = laptimes.sort();

		
		document.querySelector('.laps').innerHTML = laptimes.length;
		document.querySelector('.best').innerHTML = best[0] ? best[0] : '--.---';
		document.querySelector('.last').innerHTML = last ? last : '--.---';

	},

	drawHUD : function() {
		hud.setAttribute('data-speed', Number(this.car.speed * 2).toFixed(3));
		hud.querySelector('.needle').style.transform = 'rotateZ(' + Math.floor(this.car.speed * 2 * 1.8) + 'deg)';
	},

	drawFloor : function() {
		var x = (this.car.speed*this.car.mod) * Math.cos(Math.PI/180 * this.car.angle);
		var y = (this.car.speed*this.car.mod) * Math.sin(Math.PI/180 * this.car.angle);
		
		this.world.x -= x;
		this.world.y -= y;
		this.world_bridges.x -= x;
		this.world_bridges.y -= y;
	},

	checkUserInput : function() {

		if (this.keys[65] == true) {
			
			this.car.mod = 1;

			if (this.car.speed < this.car.maxspeed && !this.keys[90]) {
				//this.car.speed = 1 + (this.car.speed * 1.001);
				this.car.speed += 1;
			}

			if (this.car.speed > this.car.maxspeed) {
				this.car.speed -= this.car.speed * 0.1;
			}

			if (this.car.speed <= 0) this.car.speed = 0.1;

		} else {
			
			if (this.car.speed > 0) this.car.speed = this.car.speed * 0.975;
			
			if (this.car.speed < 0) this.car.speed = 0;
		}

		if (this.keys[90]) {
			this.car.state = 1;
			//this.car.mod = -1;

			if( this.car.speed > 1) {
				this.car.speed = this.car.speed * 0.98;
			}
			
			// if (this.car.speed <= 15 && this.car.speed > 0) {
			// 	this.car.speed = Math.floor(this.car.speed * 0.95);
			// }

			if (this.car.speed <= 0) {
				//console.log(this.car.speed);
				this.car.speed = (this.car.speed - 1) * 2.5;
			}
		}

		if (this.keys[37]) {
			if(Math.floor(this.car.speed) !== 0) {
				this.car.angle -= 3.5;
			}
		}
		if (this.keys[39]) {
			if(Math.floor(this.car.speed) !== 0) {
				this.car.angle += 3.5;
			}
		}
	},

	keyup_handler : function (event) {
		this.keys[event.keyCode] = false;
	
		if (event.keyCode == 65 || event.keyCode == 90) {
			this.car.speed -= 0.5;
			this.car.state = 0;	
		}

		if (event.keyCode == 27) {
			var menu = document.querySelector('#menu');
			if(menu.className === '' ){
				menu.className = 'closed';
			} else {
				menu.className = '';
			}
		}
	},

	keydown_handler : function(event) {
		this.keys[event.keyCode] = true;
	},

	radio_handler : function (event) {
		this.team = event.target.value;
	},

	button_handler : function (event) {
		if(event.target.name == 'race-start') {
			document.querySelector('#menu').className = 'closed';
			this.laptimes = [];
			this.init();
		}
	}

}

window.onload = function() {
	var game = new Game();
	game.setup();
	//game.init();
};
