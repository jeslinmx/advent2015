#!/usr/bin/node

var solutions = [];

solutions[0] = null;

solutions[1] = function (input) { // floor traversal
	var floor = 0;
	for (var i = 0; i < input.length; i++) {
		switch (input.charAt(i)) {
			case "(":
				floor++; break;
			case ")":
				floor--; break;
			default:
				throw("???");
		}
	}
	return floor;
}

solutions[2] = function (input) { // wrapping paper
	var size = 0;
	input.split('\n').forEach(function(c,i,a) {
		var dim = c.split('x').map(parseFloat);
		var x = dim[0] * dim [1], y = dim[1] * dim[2], z = dim[2] * dim[0];
		size += 2 * x + 2 * y + 2 * z + Math.min(x, y, z);
	})
	return size;
}

solutions[3] = function (input) { // house visits
	var x = 0, y = 0, visited = { 0 : { 0 : true }};
	for (var i = 0; i < input.length; i++) {
		switch (input.charAt(i)) {
			case "^": y++; break;
			case "v": y--; break;
			case "<": x--; break;
			case ">": x++; break;
			default: break;
		}
		visited[x] = visited[x] || Object.create(null);
		visited[x][y] = true;
	}
	var count = 0;
	for (var col of Object.getOwnPropertyNames(visited)) {
		count += Object.getOwnPropertyNames(visited[col]).length;
	}
	return count;
}

solutions[4] = function (input) { // advent coins
	for (var crypto = require('crypto'), i = 0, cur = ""; cur.substr(0, 5) != "00000"; cur = crypto.createHash('md5').update(input + (++i)).digest('hex')) {}
	return i;
}

solutions[5] = function (input) { // naughty strings
	'use strict';
	var strings = input.split('\n'), nice = 0;
	strings:
	for (let string of strings) {
		let vowels = 0, consec = false, prev;
		chars:
		for (var i = 0; i < string.length; i++) {
			let cur = string.charAt(i);
			if (prev) {
				switch (prev + cur) {
					case 'ab': case 'cd': case 'pq': case 'xy': continue strings; break;
					default: break;
				}
				consec = consec || (prev == cur);
			}
			switch (cur) {
				case 'a': case 'e': case 'i': case 'o': case 'u': vowels++; break;
				default: break;
			}
			prev = cur;
		}
		((vowels >= 3) && (consec)) && (nice++);
	}
	return nice;
}

solutions[6] = function (input) { // lights grid
	'use strict';
	// var grid, instructions;
	// grid = new Array(1000); grid.fill(new Array(1000));
	// instructions = input.replace(/toggle/g, "x").replace(/turn off/g, "0").replace(/turn on/g, "1").replace(/through /g, "").replace(/,/g, " ").split('\n').map(function(c) { return c.split(" ") });
	// for (var instruction of instructions) {
	// 	var op = parseInt(instruction[0]), x1 = instruction[1], y1 = instruction[2], x2 = instruction[3], y2 = instruction[4];
	// 	for (var i = x1; i <= x2; i++) {
	// 		for (var j = y1; j <= y2; j++) {
	// 			grid[i][j] = (isNaN(op)) ? !grid[i][j] : op;
	// 			continue;
	// 		}
	// 	}
	// }
	var instructions = input.replace(/toggle/g, "x").replace(/turn off/g, "0").replace(/turn on/g, "1").replace(/through /g, "").replace(/,/g, " ").split('\n').map(function(c) { return c.split(" ") }), on = 0;
	for (var i = 0; i < 1000; i++) {
		for (var j = 0; j < 1000; j++) {
			let state = false;
			for (let instruction of instructions) {
				var op = parseInt(instruction[0]), x1 = instruction[1], y1 = instruction[2], x2 = instruction[3], y2 = instruction[4];
				if ((i >= x1) && (i <= x2) && (j >= y1) && (j <= y2)) state = (isNaN(op)) ? !state : op;
			}
			on += state;
		}
	}
}

solutions[7] = function (input) { // logic gate
	var instructions = input.split('\n'), connections = {};
	var nodeValue = function (node) {
		if (!isNaN(parseInt(node))) return parseInt(node);
		if (typeof(connections[node]) == "number") return connections[node];
		var stage = new Uint16Array(1);
		switch (connections[node].op) {
			case "AND":
				stage[0] = nodeValue(connections[node].a) & nodeValue(connections[node].b);
				break;
			case "OR":
				stage[0] = nodeValue(connections[node].a) | nodeValue(connections[node].b);
				break;
			case "LSHIFT":
				stage[0] = nodeValue(connections[node].a) << nodeValue(connections[node].b);
				break;
			case "RSHIFT":
				stage[0] = nodeValue(connections[node].a) >>> nodeValue(connections[node].b);
				break;
			case "NOT":
				stage[0] = ~nodeValue(connections[node].a);
				break;
			default:
				stage[0] = nodeValue(connections[node].a);
		}
		return connections[node] = stage[0];
	}
	instructions.forEach(function (c,i,a) {
		c = c.split(" ");
		switch (c.length) {
			case 5:
				connections[c[4]] = {
					op: c[1],
					a: c[0],
					b: c[2]
				};
				break;
			case 4:
				connections[c[3]] = {
					op: "NOT",
					a: c[1]
				};
				break;
			case 3:
				connections[c[2]] = {
					a: c[0]
				}
		}
	});
	return nodeValue("a");
}

solutions[8] = function (input) { // escaping strings
	var difference = 0;
	input.split('\n').forEach(function (c, i, a) {
		difference += 2; // opening and closing quotes
		for (var i = 0; i < c.length; i++) {
			if (c.charCodeAt(i) == 92) { // \
				switch (c.charCodeAt(i + 1)) {
					case 92: case 34: // \, "
						difference++;
						i++;
						break;
					case 120: // x
						difference += 3;
						i += 3;
						break;
				}
			}
		}
	});
	return difference;
}

solutions[9] = function (input) { // travelling santaman
	var list = input.split('\n').map(function (c) { return c.split(' ') }), places = [], vertices = [], min = Infinity;
	list.forEach(function (c) {
		var a = places.indexOf(c[0]); (a == -1) && (a = (places.push(c[0]) - 1));
		var b = places.indexOf(c[2]); (b == -1) && (b = (places.push(c[2]) - 1));
		vertices[a] = vertices[a] || [];
		vertices[b] = vertices[b] || [];
		vertices[a][b] = vertices[b][a] = parseInt(c[4]);
	})
	outer:
	for (var i = Math.pow(vertices.length, vertices.length - 2); i < Math.pow(vertices.length, vertices.length); i++) {
		var path = i.toString(vertices.length); path = (path.length < vertices.length) ? "0" + path : path;
		var visited = new Uint8Array(vertices.length);
		var length = 0;
		for (var j = 0; j < path.length; j++) {
			if (++visited[parseInt(path.charAt(j))] > 1) continue outer;
			if (j >= 1) length += vertices[parseInt(path.charAt(j))][parseInt(path.charAt(j - 1))];
		}
		min = (length < min) ? length : min
	}
	return min;
}

solutions[10] = function (input) { // look-say
	var cur = input, prev;
	for (var i = 0; i < 40; i++) {
		prev = cur; cur = "";
		for (var j = 0; j < prev.length; j) {
			var charAtj = prev.charAt(j);
			for (var k = 0; prev.charAt(j) == charAtj; (++j) && (++k)) {}
			cur += k.toString() + charAtj;
		}
	}
	return cur.length;
}

solutions[11] = function (input) { // password generator
	var increment = function (input) {
		var overflow = false, result = input, cur = result.length - 1;
		do {
			if (result[cur] == 'z') {
				result[cur] = 'a';
				overflow = true;
				cur--;
				continue;
			}
			result[cur] = String.fromCharCode(result[cur].charCodeAt(0) + 1);
			overflow = false;
		} while (overflow)
		return result;
	};
	var result = input.split("");
	outer:
	while (true) {
		result = increment(result);
		var incr = false, repeat = 0;
		for (var i = 0; i < result.length; i++) {
			if ((result[i] == 'i') || (result[i] == 'o') || (result[i] == 'l')) continue outer;
			if ((result[i] == result[i + 1]) && (result[i] != result[i - 1])) repeat++;
			if ((i >= 2) && (result[i].charCodeAt(0) == (result[i - 1].charCodeAt(0) + 1)) && (result[i].charCodeAt(0) == (result[i - 2].charCodeAt(0) + 2))) incr = true;
		}
		if ((repeat < 2) || (!incr)) continue outer;
		break;
	}
	return result.join("");
}

solutions[12] = function (input) { // find numbers
	return input.match(/-?[0-9]+/g).reduce(function(p, c) { return Number(p) + Number(c); });
}

solutions[13] = function (input) { // circular tsp (code adapted from day 9)
	var list = input.split('\n').map(function (c) { return c.slice(0, -1).split(' ') }), people = [], vertices = [], max = -Infinity;
	list.forEach(function (c) {
		var a = people.indexOf(c[0]); (a == -1) && (a = (people.push(c[0]) - 1));
		var b = people.indexOf(c[10]); (b == -1) && (b = (people.push(c[10]) - 1));
		vertices[a] = vertices[a] || [];
		vertices[b] = vertices[b] || [];
		vertices[a][b] = parseInt(c[3]) * ((c[2] == 'gain') * 2 - 1);
	})
	outer:
	for (var i = Math.pow(vertices.length, vertices.length - 2); i < Math.pow(vertices.length, vertices.length); i++) {
		var path = i.toString(vertices.length); path = (path.length < vertices.length) ? "0" + path : path; path = path.split("").map(Number);
		var visited = new Uint8Array(vertices.length);
		var length = (vertices[path[0]][path[path.length - 1]] + vertices[path[path.length - 1]][path[0]]);
		for (var j = 0; j < path.length; j++) {
			if (++visited[path[j]] > 1) continue outer;
			if (j >= 1) length += (vertices[path[j]][path[j - 1]] + vertices[path[j - 1]][path[j]]);
		}
		max = (length > max) ? length : max
	}
	return max;
}

solutions[14] = function (input) {
	
}

solutions[15] = function (input) {
	
}

solutions[16] = function (input) {
	
}

solutions[17] = function (input) {
	
}

solutions[18] = function (input) {
	
}

solutions[19] = function (input) {
	
}

solutions[20] = function (input) {
	
}

solutions[21] = function (input) {
	
}

solutions[22] = function (input) {
	
}

solutions[23] = function (input) {
	
}

solutions[24] = function (input) {
	
}

solutions[25] = function (x, y) { // copy protection
	x = parseInt(x); y = parseInt(y);
	var bird = 20151125, punch = 252533, veil = 33554393;
	for (var i = 0; i < (x + y - 1 ) * (x + y) / 2 - y; i++) {
		bird = (bird * punch) % veil;
	}
	return bird;
}

var day = parseInt(process.argv[2]), input = process.argv[3] ? process.argv.slice(3) : [require('fs').readFileSync(day.toString(10), 'utf8').trim()];
console.log(solutions[day](...input));