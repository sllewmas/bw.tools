/*
bw.polyTargetAllDb.js
Christopher Biggs & Samuel Wells

This is loaded by bw.polyTargetDefer to target all poly~ instances with volume messages in dB that will be converted to amplitude
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 1; //the number of inlets
outlets = 1; //the number of outlets

// a minimum db level is required since we want to zero out a signal when the db level
//is at a particular level, i.e. the amplitude desired is 0 when we are at a certain dB,
//not really close to zero
var mindB = jsarguments[1];

//function to run when an integer is entered
function msg_int(input) {
	//declare a new variable that will hold our output
	var o;
	//if the input is greater than the minimum dB, convert that db value
	//to an amplitude value and assign that value to the variable o
	if(input > mindB) {
		var o = dbtoa(input); //dbtoa() is a function defined below
		//if the value is equal to or less than our minimum db,
		//assign the variable o to zero
	} else {
		o = 0.;
	}
	//set the target and then output o
	outlet(0, "target", 0);
	outlet(0, o);
}

//this is the same as the int function, but responds to floats
function msg_float(input) {
	var o;
		if(input > mindB) {
			var o = dbtoa(input);
	} else {
		o = 0.;
		}
	outlet(0, "target", 0);
	outlet(0, o);
}

//the list function is similar, but responds to list input
function list() {
	//an array is created that is the length of the number of elements in the incoming list
	var input = new Array(arguments.length);
	//that array is filled with either zero or the converted value, if it is greater
	//than the minimum db level, else it is 0
	for(var i = 0; i < input.length; i++) {
		if(arguments[i] > mindB) {
		input[i] = dbtoa(arguments[i]);
		} else {
		 input[i] = 0;
		}
	}
	//output the entire list
	outlet(0, "target", 0);
	outlet(0, input);
}

//a function to convert decibels to amplitude
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