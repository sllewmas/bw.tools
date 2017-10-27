/*
bw.generateRandomRangeObjects.js
Christopher Biggs & Samuel Wells

Generates the objects necessary for bw.randomRange, which creates any number of random numbers within a specific range
*/

autowatch = 1; //update the js in Max when edited via an external editor
inlets = 1; //the number of inlets
outlets = 1; //the number of outlets

//the number of outlets will be the total number of random numbers plus the outlet
//for the entire list
var numberOfOutlets = jsarguments[1]+1;
//a variable to avoid typing this.patcher repeatedly
var p = this.patcher;
//a variable to hold the object for the js file that makes the random numbers
var js = p.newdefault(10, 50, "js", "bw.randomRange.js", "#1", "#2", "#3", "#4", "#5");
//an array to hold the inlet objects 
var inlets = new Array(4);
//generate the inlets and and connect them to the js object
for(var i = 0; i < 4; i++) {
	inlets[i] = p.newdefault(10+50*i, 10, "inlet");
	p.connect(inlets[i], 0, js, i);
	}
//variable to hold the outlets
var outlets = new Array(numberOfOutlets);
//generate the outlets and connect the js object to the outlets
for(var i = 0; i <outlets.length; i++) {
	outlets[i] = p.newdefault(10+50*i, 150, "outlet");
	p.connect(js, i, outlets[i], 0);
}
