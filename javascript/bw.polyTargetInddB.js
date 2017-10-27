/*
bw.polyTargetInddB.js
Christopher Biggs & Samuel Wells

This is loaded by bw.polyTargetDefer to target individual poly~ instances from individual inlets 
and to convert dB values to amplitude values with a minimum dB that will result in an amplitude of 0
*/

autowatch = 1; //update the js in Max when edited in an external editor
//the first argument is the number of instances 
//which corresponds to the number of poly~ instances
inlets = jsarguments[1];
outlets = 1; //the number of outlets

//variable to hold the minimum db
//this is necessary because when dB values are converted to amplitude the dB level that will result in an amplitude of 0 is extremely low
//the minimum dB level or lower will generate an amplitude value of 0
var mindB = jsarguments[2];

//function that will respond to integer input
function msg_int(input) {
	//a variable to hold the value to output
	var o;
	//if the input is greater than the minimum db level,
	//convert the input to db and assign it to the variable o
	if(input > mindB) {
		var o = dbtoa(input);
		//if it is equal to or less than the minimum db level,
		//assign the variable o to zero
	} else {
		o = 0.;
	}
	//target a poly~ instance based on the inlet in which the value was received
	outlet(0, "target", inlet+1);
	//output o
	outlet(0, o);
}

//this is the same as the msg_int function, but will respond to floats
function msg_float(input) {
	var o;
		if(input > mindB) {
			var o = dbtoa(input);
	} else {
		o = 0.;
		}
	outlet(0, "target", inlet+1);
	outlet(0, o);
}

//function that will respond to list input
function list() {
	//create an array that will be the size of the incoming list 
	var input = new Array(arguments.length);
	//fill the input array with the incoming values
	for(var i = 0; i < input.length; i++) {
		//if the value coming in is greater than the minimum db,
		//convert that value to db and assign that to the appropriate element of the 
		//input array
		if(arguments[i] > mindB) {
		input[i] = dbtoa(arguments[i]);
		//if the coming value is equal to or less than the minimum db,
		//assign that element of the input array to zero
			} else {
		 input[i] = 0;
		}
	}
	//set the target based on the inlet in which the list entered
	outlet(0, "target", inlet+1);
	//output the list
	outlet(0, input);
}

//convert db values to amplitudes
function dbtoa(d) {
	var a = Math.pow(10, d/20);
	return a;
}

//function to print on a line, with some amount of arguments
function postln(a, b) {
	if(b != null) {
		post("\n" + a + " " + b);
		} else {
			post("\n" + a);
	}
}