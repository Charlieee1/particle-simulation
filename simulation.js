const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var attractions = [ [[.2,8],[.2,50],[.1,50],[0,26]],
					[[.3,10],[.2,30],[.05,10],[.05,10]],
					[[.05,10],[.2,50],[.2,30],[.3,10]],
					[[.2,25],[.1,50],[.2,50],[.3,10]]];
var max_speed = 1;
var width = 1000; // 1900 or 500
var height = 700; // 850 or 500
var population = 1000; // 2000 or 500
var view_radius = 40;
var typesOfParticles = 4;
canvas.width = width;
canvas.height = height;
var diagonal = Math.sqrt(width*width+height*height);

function stop() {
	stopped = true;
}

function start() {
	stopped = false;
	window.requestAnimationFrame(draw);
}

function step() {
	window.requestAnimationFrame(draw);
}

class Cell {
	constructor(type, x, y) {
		this.type = type;
		this.x = x;
		this.y = y;
		this.move = [0, 0];
	}
	update() {
		this.move = normalize(this.move);
		this.x = (this.x + this.move[0]) % width;
		this.y = (this.y + this.move[1]) % height;
		if(this.x<0){this.x = width + this.x;}
		if(this.y<0){this.y = height + this.y;}
	}
}

function getColor(cell) {
	switch(cell.type) {
		case 0:
			return "blue";
		case 1:
			return "red";
		case 2:
			return "yellow";
		case 3:
			return "white";
	}
}

function randomizeSimulationParameters() {
	for(let i=0;i<typesOfParticles;i++) {
		for(let j=0;j<typesOfParticles;j++) {
			attractions[i][j][0] = Math.random() * 2 - 1;
			attractions[i][j][1] = Math.round(Math.random()*50);
		}
	}
}

function addV(v1, v2) {
	return [v1[0]+v2[0],v1[1]+v2[1]];
}

function clear() {
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, width, height);
}

function distance(p1, p2) {
	let dx = DX(p1, p2);
	let dy = DY(p1, p2);
	return Math.sqrt(dx*dx+dy*dy);
}

function L2(p1, p2) {
	return DX(p1, p2) + DY(p1, p2);
}

function DX(p1, p2) {
	let dx = Math.abs(p2.x-p1.x);
	return Math.min(dx, width - dx);
}

function DY(p1, p2) {
	let dy = Math.abs(p2.y-p1.y);
	return Math.min(dy, height - dy);
}

function magnitude(v) {
	return Math.sqrt(v[0]*v[0]+v[1]*v[1]);
}

function normalize(move) {
	let d = magnitude(move);
	if(d > max_speed) {
		return [max_speed*move[0]/d,max_speed*move[1]/d];
	}
	return move;
}

function findMovementVector(c1, c2, d, dx, dy) {
	if(d > 10) {
		let a = .1 * attractions[c1.type][c2.type][0] * (attractions[c1.type][c2.type][1] - d);
		return [a*dx, a*dy];
	} else {
		return [-1 * dx, -1 * dy];
	}
}



function render(items) {
	for(let i=0;i<items.length;i++) {
		ctx.fillStyle = getColor(items[i]);
		ctx.fillRect(items[i].x - 2, items[i].y - 2, 5, 5);
	}
}

function update(items) {
	for(let i=0;i<items.length-1;i++) {
		for(let j=i+1;j<items.length;j++) {
			c1 = items[i];
			c2 = items[j];
			let dx = DX(c1, c2);
			let dy = DY(c1, c2);
			if(i!=j && dx + dy <= view_radius) {
				let d = distance(c1, c2);
				c1.move = addV(c1.move, findMovementVector(c1, c2, d, dx, dy));
				c2.move = addV(c2.move, findMovementVector(c2, c1, d, -dx, -dy));
			}
		}
	}

	for(let i=0;i<items.length;i++) {
		items[i].update();
	}
}

function draw() {
	update(cells);
	clear();
	render(cells);
	if(!stopped) {
		window.requestAnimationFrame(draw);
	}
}

const cells = [];
for(let i=0;i<population;i++) {
	cells.push(new Cell(Math.random() < .5 ? 0 : Math.random() < .15 ? 1 : Math.random() < .15 ? 2 : 3, Math.round(Math.random() * width), Math.round(Math.random() * height)));
}

var stopped = false;
window.requestAnimationFrame(draw);
