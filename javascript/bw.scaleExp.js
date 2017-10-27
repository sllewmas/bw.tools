/*
bw.scaleExp.js
Christopher Biggs & Samuel Wells

Remap Values with an expoential scaling factor. 
The output value is constrained to the output range.
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 6; //the number of inlets
outlets = 1; //the number of outlets

//an array to hold the parameter names
var paramNames = ["input minimum", "input maximum", "output minimum", "output maximum", "exponent"];
//an array to hold the default parameters
var defaultParams = [0, 127, 0, 127, 1];
//an array to hold the parameters that are set
var params = new Array(5);
//determine the number of parameters entered as arguments, not including the js file name
var numberOfParametersEntered = jsarguments.length - 1;
//fill the params array with the number of parameters provided
for(var i = 0; i < numberOfParametersEntered; i++) {
	params[i] = jsarguments[i+1];
}
//for parameters not provided, fill with the default parameters
for(var i = numberOfParametersEntered; i < params.length; i++) {
	params[i] = defaultParams[i];
}

//if the exponent is not greater than zero, set it to the default
checkExponent();

//variable to hold the scaled output value
var scaledValue;

//function to generate remapped value and output float
function msg_float(input) {	
	if(inlet ==0) {
		//constrain the input to the input range
		//this effectively constrains the output range
		input = clamp(input);
		//calculate the scaled value
		scaledValue = ((params[3]-params[2]) * Math.pow((input-params[0])/(params[1] - params[0]), params[4])) + params[2];	
		//output the scaled value
		outlet(0, scaledValue);	
	} else {
		//if a value enteres an inlet other than inlet 0, update the 
		//corresponding parameter
		params[inlet-1] = input;
		checkExponent();
		}
	}
	
//function to generate remapped value and output integer
//similar to the float function, but the scaling with output integers, not floats	
function msg_int(input) {	
	if(inlet ==0) {
		input = clamp(input);
		scaledValue =  Math.floor((params[3]-params[2]) * Math.pow((input-params[0])/(params[1] - params[0]+1), params[4])) + params[2];	
		outlet(0, scaledValue);	
		} else {
			params[inlet-1] = input;
			checkExponent();
		}
	}
	
//a list will update all the parameters
function list() {
	//create a variable to hold the number of incoming values from a list
	var numberOfArgumentsEntered = arguments.length;
	//if that value is greater than the number of parameters, make that number smaller
	if(numberOfArgumentsEntered > params.length) {
		numberOfArgumentsEntered = params.length;
		}
	//fill the params array with the incoming arguments
	for(var i = 0; i < numberOfArgumentsEntered; i++) {
			params[i] = arguments[i];
		}
	//check that the minimum and maximum speed are appropriate
	checkExponent();
}
	
//constrain the input value to the input range
function clamp(a) {
	var v = currentSpeed = Math.min(Math.max(a, params[0]), params[1]);
	return v;	
}
		

//make sure that the exponent is greater than zero
function checkExponent() {
	if(params[4] <=0) {
		postln(paramNames[4], "must greater than zero");
		params[4] = defaultParams[4];
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