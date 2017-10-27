/*
bw.polyTargetAll.js
Christopher Biggs & Samuel Wells

This is loaded by bw.polyTargetDefer to target all poly~ instances
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 1; //the number of inlets
outlets = 1; //the number of outlets

//the int, float, and bang function target all poly~ instances with 
//single messages that match that data type
function msg_int(input) {
	outlet(0, "target", 0);
	outlet(0, input);
}

function msg_float(input) {
	outlet(0, "target", 0);
	outlet(0, input);
}

function bang() {
		outlet(0, "target", 0);
	outlet(0, "bang");
}

//the list function targets all poly~ instances with the full content of the list
function list() {
	//an array of appropriate length is generated based on the number
	//of elements in the incoming list
	var input = new Array(arguments.length);
	//fill the input array with the content of arguments
	//this is necessary since the arguments array can not be directly sent out
	//since it is a js object
	for(var i = 0; i < input.length; i++) {
		input[i] = arguments[i];
	}
	outlet(0, "target", 0);
	outlet(0, input);
}

//function to print on a line, with some amount of arguments
function postln(a, b) {
	if(b != null) {
		post("\n" + a + " " + b);
		} else {
			post("\n" + a);
	}
}