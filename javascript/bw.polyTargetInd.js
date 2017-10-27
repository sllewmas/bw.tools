/*
bw.polyTargetInd.js
Christopher Biggs & Samuel Wells

This is loaded by bw.polyTargetDefer to target individual poly~ instances from individual inlets
*/

autowatch = 1; //update the js in Max when edited in an external editor
//the first argument is the number of instances 
//which corresponds to the number of poly~ instances
inlets = jsarguments[1];
outlets = 1; //the number of outlets

//function that will respond to integer input
function msg_int(input) {
	//target a poly~ instance based on the inlet that the integer entered
	//inlet is a native variable that is assigned to the inlet number in which a message most
	//recently entered
	outlet(0, "target", inlet+1);
	//output the input
	outlet(0, input);
}

//this will be the same as the integer function, but it deals with floats
function msg_float(input) {
	outlet(0, "target", inlet+1);
	outlet(0, input);
}

//this will be the same as the other two function, but it outputs a bang
function bang() {
		outlet(0, "target", inlet+1);
		outlet(0, "bang");
}

//function that will respond to list input
function list() {
	//create an array that will be the length of the incoming list
	var input = new Array(arguments.length);
	//fill the input array with the incoming list
	// we can not directly output the arguments array because it is a js object
	for(var i = 0; i < input.length; i++) {
		input[i] = arguments[i];
	}
	//target a specific poly instance based on the inlet in which the list entered
	outlet(0, "target", inlet+1);
	//output the entire array
	outlet(0, input);
}