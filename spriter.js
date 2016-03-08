'use strict';

class Spriter {

	constructor() {

		this.canvas = document.querySelector('#sprite_image');
		this.canvasPosition = this.canvas.getBoundingClientRect();
		this.context = this.canvas.getContext("2d");
		this.preview = document.querySelector('#sprite_preview');

		this.initCanvas();

		this.onStart = this.onStart.bind(this);
		this.onMove = this.onMove.bind(this);
		this.onEnd = this.onEnd.bind(this);
		this.update = this.update.bind(this);
		this.addSprite = this.addSprite.bind(this);
		this.generateCSSOutput = this.generateCSSOutput.bind(this);
		this.clearActions = this.clearActions.bind(this);

		this.trackingTouch = false;

		this.startX = 0;
		this.startY = 0;

		this.endX = 0;
		this.endY = 0;
		
		this.rectWidth = 0;
		this.rectHeight = 0;

		this.sprites = {};	

		this.addEventListeners();

		requestAnimationFrame(this.update);

	}

	initCanvas () {

		this.width = 639;
		this.height = 314;
		this.background = 'sprites.png';

		const dPR = window.devicePixelRatio || 1;

		this.canvas.width = this.width * dPR;
		this.canvas.height = this.height * dPR;

		this.canvas.style.width = `${this.width}px`;
		this.canvas.style.height = `${this.height}px`;
		this.canvas.style.background = `url('${this.background}')`;

		this.context.scale(dPR, dPR);

		// Preview
		this.preview.style.width = `${this.rectWidth}px`;
		this.preview.style.height = `${this.rectHeight}px`;
		this.preview.style.background = `url('${this.background}')`;

	}

	onStart (event) {

		if ( event.target !== this.canvas ) return;

		this.startX = (event.pageX || event.touches[0].pageX) - this.canvasPosition.left;
		this.startY = (event.pageY || event.touches[0].pageY) - this.canvasPosition.top;

		event.preventDefault();
		this.trackingTouch = true;

	}

	onMove (event) {

		if (!this.trackingTouch) return;

		this.endX = (event.pageX || event.touches[0].pageX) - this.canvasPosition.left;
		this.endY = (event.pageY || event.touches[0].pageY) - this.canvasPosition.top;

	}

	onEnd () {

		this.trackingTouch = false;

		requestAnimationFrame(this.update);
	}

	update () {

		if ( this.endX < this.startX || this.endY < this.startY ) return;

		this.rectWidth = (this.endX - this.startX);
		this.rectHeight = (this.endY - this.startY);

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

		this.context.strokeStyle = '#FF0000';
		this.context.strokeRect(
			this.startX, 
			this.startY,
			this.rectWidth,
			this.rectHeight
		);

		this.spritePositionX = this.canvas.width - this.startX;
		this.spritePositionY = this.canvas.height - this.startY;

		this.preview.style.width = `${this.rectWidth}px`;
		this.preview.style.height = `${this.rectHeight}px`;
		this.preview.style.backgroundPosition = `${this.spritePositionX}px ${this.spritePositionY}px`;

		this.endX = 0;
		this.endY = 0;
	}

	addSprite () {

		var sprite = {};

		var name = window.prompt('Type the name of your new sprite: ');

		if ( ! name || name == "" ) {
			alert('The name can not be empty');
			return;
		}

		sprite.width  = this.rectWidth;
		sprite.height = this.rectHeight;

		sprite.x = this.spritePositionX;
		sprite.y = this.spritePositionY;

		this.sprites[name] = sprite;

		this.clearActions();

	}

	clearActions () {

		this.preview.style.width = `0px`;
		this.preview.style.height = `0px`;

		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	generateCSSOutput () {

		var sprites_name = [];
		var spritesStyleList = [];

		for (var name in this.sprites) {

			sprites_name.push(`.${name}`);

			var sprite_style = `
				.${name} {
					width: ${this.sprites[name].width}px;
					height: ${this.sprites[name].height}px;
					background-position: ${this.sprites[name].x}px ${this.sprites[name].y}px;
				}
			`;

			spritesStyleList.push(sprite_style);

		}

		var CSSoutput = `
			/* 
			 * 		SPRITES GENERATED WITH SPRITER
			 *		http://github.com/tarcisiozf/spriter
			 */

			${sprites_name.join(', ')} {
				background-image: url('${this.background}');
			}

			${spritesStyleList.join('\n')}
		`;

		var output = document.querySelector('#output')

		output.style.display = 'block';
		output.value = CSSoutput;

	}

	addEventListeners () {
		document.addEventListener('touchstart', this.onStart);
		document.addEventListener('touchmove', this.onMove);
		document.addEventListener('touchend', this.onEnd);

		document.addEventListener('mousedown', this.onStart);
		document.addEventListener('mousemove', this.onMove);
		document.addEventListener('mouseup', this.onEnd);

		document.querySelector('#bt_add').addEventListener("click", this.addSprite);
		document.querySelector('#bt_gen').addEventListener("click", this.generateCSSOutput);
	}

	removeEventListeners () {
		document.removeEventListener('touchstart');
		document.removeEventListener('touchmove');
		document.removeEventListener('touchend');

		document.removeEventListener('mousedown');
		document.removeEventListener('mousemove');
		document.removeEventListener('mouseup');

		document.querySelector('#bt_add').removeEventListener("click");
		document.querySelector('#bt_gen').removeEventListener("click");
	}

}

window.addEventListener('load', () => new Spriter());