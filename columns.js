"use strict";
const col=9, line=16, empty="rgb(0, 0, 0)";
let color = (x, y) => $('#'+x+'_'+y).css('background-color');
let changeColor = (x, y, newColor) => $('#'+x+'_'+y).css('background-color', newColor); //.addClass('filled');
let removeColor = (x, y) => $('#'+x+'_'+y).css('background-color', empty).removeClass('filled');

// ------- gameBoard -------
const columns = {

	colors: ['red', 'green', 'blue', 'yellow', 'purple'],
	curX: 4,
	curY: 2,
	speed: 800,
	score: 0,
	level: 1,
	
	drawBoard: function(container) {
		this.board = container;
		for(let i=0; i < col*line; i++){
			$(container).append("<div class='block' id='" + (i%col) + "_" + (Math.trunc(i/col)) + "'></div>");
		}
	},

	drawBlock: function(){
		this.curX = 4;
		this.curY = 2;
		for(let i=this.curY-3; i<3; i++) {
			changeColor(this.curX, i, this.colors[Math.floor(Math.random()*this.colors.length)]);
		}
	},

	goDown: function() {
		if(color(this.curX, this.curY+1) == empty && this.curY < line-2) {
			this.curY++;
			for(let i=0; i<3; i++){
				changeColor(this.curX, this.curY-i, color(this.curX, this.curY-i-1));
			}
			removeColor(this.curX, this.curY-3);
		}
	},

	goRight: function() {
		if(color(this.curX+1, this.curY) == empty && this.curX < col-2) {
			for(let i=0; i<3; i++){
				changeColor(this.curX+1, this.curY-i, color(this.curX, this.curY-i));
				removeColor(this.curX, this.curY-i);
			}
			this.curX++;
		}
	},

	goLeft: function() {
		if(color(this.curX-1, this.curY) == empty && this.curX > 1) {
			for(let i=0; i<3; i++){
				changeColor(this.curX-1, this.curY-i, color(this.curX, this.curY-i));
				removeColor(this.curX, this.curY-i);
			}
			this.curX--;
		}
	},

	rotateBlocks: function() {
		let temp = color(this.curX, this.curY-2);
		changeColor(this.curX, this.curY-2, color(this.curX, this.curY-1));
		changeColor(this.curX, this.curY-1, color(this.curX, this.curY-0));
		changeColor(this.curX, this.curY-0, temp);
	},

	dropBlocks: function() {
		while(color(this.curX, this.curY+1) == empty && this.curY < line-2){
			this.goDown();
		}
	},

	checkBoard: function() {
		$('.filled').each(function(){
			let x = Number($(this).attr('id').substring(0,1));
			let y = Number($(this).attr('id').substring(2));
			// -
			if(color(x, y) == color(x-1, y) && color(x, y) == color(x+1, y)) {
				$('#'+x+'_'+y).addClass('dead');
				$('#'+(x-1)+'_'+y).addClass('dead');
				$('#'+(x+1)+'_'+y).addClass('dead');
			}
			// |
			if(color(x, y) == color(x, y-1) && color(x, y) == color(x, y+1)) {
				$('#'+x+'_'+y).addClass('dead');
				$('#'+x+'_'+(y-1)).addClass('dead');
				$('#'+x+'_'+(y+1)).addClass('dead');
			}
			// /
			if(color(x, y) == color(x-1, y+1) && color(x, y) == color(x+1, y-1)) {
				$('#'+x+'_'+y).addClass('dead');
				$('#'+(x-1)+'_'+(y+1)).addClass('dead');
				$('#'+(x+1)+'_'+(y-1)).addClass('dead');
			}
			// \
			if(color(x, y) == color(x-1, y-1) && color(x, y) == color(x+1, y+1)) {
				$('#'+x+'_'+y).addClass('dead');
				$('#'+(x-1)+'_'+(y-1)).addClass('dead');
				$('#'+(x+1)+'_'+(y+1)).addClass('dead');
			}
		});
		this.score += $('.dead').length;
		let self = this;
		$('.dead').fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100, function(){
			self.clearBoard();
		});
	},

	clearBoard: function() {
		let hasDead = false;
		$('.dead').each(function(){
			hasDead = true;
			$(this).css('background-color', empty);
			$(this).removeClass('dead');
			$(this).removeClass('filled');
		});
		
		if(hasDead){
			this.gravity();
			this.checkBoard();
		}
	},

	gravity: function() {
		$($(".filled").get().reverse()).each(function(){
			let x = Number($(this).attr('id').substring(0,1));
			let y = Number($(this).attr('id').substring(2));
			let i = 1;
			if(y < 14){
				while(color(x, y+i) == empty && y+i <= 14){
					changeColor(x, y+i, color(x, y+i-1));
					removeColor(x, y+i-1);
					$('#'+x+'_'+(y+i)).addClass('filled');
					i++;
				}
			}
		});
	}
};


// ------- Events -------
$(document).ready(function() {

	columns.drawBlock();

	$(document).keydown(function(e) {
		switch(e.keyCode){
			case 32:
				columns.dropBlocks();
				break;
			case 37:
				columns.goLeft();
				break;
			case 38:
				columns.rotateBlocks();
				break;
			case 39:
				columns.goRight();
				break;
			case 40:
				columns.goDown();
				break;
		}
	});

	var timer = setInterval(function() {
		if(color(columns.curX, columns.curY+1) == empty && columns.curY < line-2) {
			columns.goDown();
		}else{
			if(columns.curY <=3){
				$(document).off('keydown');
				console.log("GAME OVER!!!");
				clearInterval(timer);
			}else{
				for(let i=0; i<3; i++){
					$('#'+columns.curX+'_'+(columns.curY-i)).addClass('filled');
				}
				columns.checkBoard();
				$('#score span').html(columns.score);
				columns.level = parseInt(columns.score / 100) + 1;
				$('#level span').html(columns.level);
				columns.drawBlock();
			}
		}
	}, columns.speed);

});
