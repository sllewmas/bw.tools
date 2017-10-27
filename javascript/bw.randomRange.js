/*
bw.randomRange.js
Christopher Biggs & Samuel Wells

Creates any number of random numbers within a specific range
*/

autowatch = 1; //update the js file in max when saved in an external editor
inlets = 4; //specify number of inlets 
//the number of outlets must change so that each random number can 
//have a distinct outlet, with one additional outlet for the complete list
if(jsarguments[5]>1) {
	outlets = jsarguments[5]+1;
	} else {
		outlets = 1;
		}
	 
//an array to hold the parameter names
var paramNames = ["minimum output", "maximum output", "exponent", "mode", "quantity"];
//an array to hold the default values
var defaultParams = [-1, 1, 1., "f", 1];
//an array to hold the actual parameters
var params = new Array(5); 
//store the number of parameters entered, not including the js file name
var numberOfParametersEntered = jsarguments.length - 1;
//fill the params array with the number of parameters entered
for(var i = 0; i < numberOfParametersEntered; i++) {
	params[i] = jsarguments[i+1];
}
//if parameters were not provided, fill with the default parameters
for(var i = numberOfParametersEntered; i < params.length; i++) {
	params[i] = defaultParams[i];
}
//call a function that checks if the exponent is an appropriate value
checkExponent();

//calla function to checks if the mode has been properly set
checkMode();

//if the number of random numbers to output is less than 1, then assign it to 1
if(params[4] <1) {
	params[4] = 1;
	}

var randVal = new Array(params[4]); //variable to hold the random values

//function that generates random values within a range when a bang is received
function bang() {
	//if the the inlet number that the bang entered is zero, then generate a random number
	if(inlet == 0) {	
		//if the the mode is float
		if (params[3] == "f") {	
			//generate the number of random numbers desired
			for(var i = 0; i < params[4]; i++) {
				//generate and map the random value
				randVal[i] = Math.pow(Math.random(), params[2]) * (params[1] - params[0])+ params[0];
				//individual output
				outlet(i, randVal[i]);
				}
				//output the list, if there is more than one random number
				if(params[4]>1) {
					//list output
					outlet(params[4], randVal);	
					}
		}	
		if(params[3] == "i") {	
			for(var i = 0; i < params[4]; i++) {	
				randVal[i] = Math.floor(Math.pow(Math.random(), params[2]) * (params[1] - params[0]+1)) + params[0];
				outlet(i, randVal[i]);
				}
				if(params[4]>1) {
					outlet(params[4], randVal);
					}
			}	
	}
}

//update parameters with integer input
function msg_int(input) {
	//only update, if the inlet number is within the appropriate range
	if(inlet>0) {
		params[inlet-1] = input;	
		checkExponent();		
	}
}

//update parameters with float input
function msg_float(input) {
	//only update, if the inlet number is within the appropriate range
	if(inlet>0) {
		params[inlet-1] = input;	
		checkExponent();		
	}
}

//a list will update the number of parameters specified
function list() {
	//create a variable to hold the number of incoming values from a list
	var numberOfArgumentsEntered = arguments.length;
	//if that value is greater than the number of parameters, make that number smaller
	if(numberOfArgumentsEntered > 4) {
		numberOfArgumentsEntered = 4;
		}
	//fill the params array with the incoming arguments
	for(var i = 0; i < numberOfArgumentsEntered; i++) {
			params[i] = arguments[i];
		}
	checkExponent();
	checkMode();
}

//update if it is an int or float output
function changeType() {
	params[3]=arguments[0];
	checkMode();
}

//make sure that the exponent is greater than zero
function checkExponent() {
	if(params[2] <=0) {
		//postln(paramNames[2], "must greater than zero");
		params[2] = defaultParams[2];
	}
}

//make sure the mode is set to a valid string
function checkMode() {
	if((params[3] != "i") && (params[3] != "f")) {
		//postln(paramNames[3], "is not valid");
		params[3] = defaultParams[3];
		}
}

//function to print on a line, with some amount of arguments
function postln(a, b) {
	if(b != null) {
		post("\n" + a + " " + b);
		} else {
			post("\n" + a);
	}
}

