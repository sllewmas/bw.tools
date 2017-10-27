/*
bw.polyTargetLisdB.js
Christopher Biggs & Samuel Wells

This is loaded by bw.polyTargetDefer to target individual poly~ instances from a single list
and to convert dB values to amplitude values with a minimum dB that will result in an amplitude of 0
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 1; //the number of inlets
outlets = 1; //the number of outlets

//a minimum db level is needed such that 
//an amplitude of zero will result at that minimum level
var mindB = jsarguments[1];
//In order to only pass elements of the array that change
//there needs to be an array to store the elements of the previous input
var previous = [];

//a function that will respond to list input
function list() {
	//create an array that is the length of the incoming list
	var current = new Array(arguments.length);
	//fill the current array with the incoming list 
	//set the element of the list to zero, if it is equal to or less than the minimum db
	//or assign the element after converting the incoming db level to amplitude
	for(var i = 0; i < arguments.length; i++) {
		if(arguments[i] > mindB) {
			current[i] = dbtoa(arguments[i]);
		} else {
			current[i] = 0;
		}
		//if the current element is different than the previous element, sent it out
		if(current[i] != previous[i]) {
			outlet(0, "target", i+1);
			outlet(0, current[i]);
		}
	}
	//the previous array should now equal the current array
	//such that it can compared to the next array that enters
	previous = current;
}

//a function to convert dB values to amplitude
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