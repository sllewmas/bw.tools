/*
bw.polyTargetLis.js
Christopher Biggs & Samuel Wells

This is loaded by bw.polyTargetDefer to target individual poly~ instances from a single list
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 1; //the number of inlets
outlets = 1; //the number of outlets

//an array to hold the previous values from the incoming list
//this array can be compared to an incoming array and 
//only the values have changed will be outputted
var previous = [];

function list() {
	//creates an array that is the size of the incoming list
	current = new Array(arguments.length);
	//fill the array with each element of the incoming list
	for(var i = 0; i < arguments.length; i++) {
		current[i] = arguments[i];
		//output each element, if it has changed
		if(current[i] != previous[i]) {
			outlet(0, "target", i+1);
			outlet(0, current[i]);
		}
	}
	//set the previous array to equal the current array
	previous = current;
}