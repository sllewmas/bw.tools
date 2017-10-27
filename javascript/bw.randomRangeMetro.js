/*
bw.randomRangeMetro.js
Christopher Biggs & Samuel Wells

Metronome that ouputs bangs at random intervals within the specified range
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 5; //inlets to turn off/on or updating arguments
outlets = 3; //outlets for bang, interval in ms, and carry bang

//creates a Task object called m that will call the function met, 
//which will repeatedly send out a bang and change the output rate
//within the specified range
var m = new Task(met, this);

//create an array to hold the parameter names
var paramNames = ["initial speed", "minimum speed", "maximum speed", "exponent"];
//the default parameters that are assigned when insufficient or no arguments are provided
var defaultParams = [200, 100, 500, 1.];
//an array to hold the actual parameters
var params = new Array(4); 
//determine the number of parameters that were entered, not including the js file name
var numberOfParametersEntered = jsarguments.length - 1;
//fill the params array with the number of parameters that were provided
for(var i = 0; i < numberOfParametersEntered; i++) {
	params[i] = jsarguments[i+1];
}
//if parameters were not provided, fill with the default parameters
for(var i = numberOfParametersEntered; i < params.length; i++) {
	params[i] = defaultParams[i];
}
//if the initial, minimum, or maximum speed are not greater than zero
//set them to the default parameters, same with the exponent
for(var i = 0; i < 4; i++) {
	if(params[i] <=0) {
		//postln(paramNames[i], "must greater than zero");
		params[i] = defaultParams[i];
	}
}
//make sure that the minimum speed is not greater than the maximum speed and
//make sure that the maximum speed is not less than the minimum speed
//if either is true set them to one greater than or one less than the other
checkMinMaxSpeed();

//set the speed of the m object to the initial speed with the method interval
m.interval = params[0];

//turn on or off the trask function and update parameters
function msg_int(input) {
	//if the inlet is 0, we stop or start the metro
	if(inlet == 0) {
		//if the incoming value in inlet 0 is anything other than zero, 
		//the metronome will start
		if(input != 0) {
			m.repeat(); //repeat will call met() forever when no argument is specified
			} else {
				m.cancel(); //this will stop met() from being run
				m.interval = params[0]; //reset the interval to the initial value
				outlet(2, "bang"); //output a carry bang
				}	
			} else {
				//if the inlet is not zero, assign the incoming value to the appropriate
				//member of the array, as long as that value is greater than zero
				if(input>0) {
					params[inlet-1] = input;
					//make sure these values are appropriate
					checkMinMaxSpeed();										
					}	
				}
}

//we need to do the same thing, but with floats
function msg_float(input) {
	if(inlet == 0) {
		if(input != 0) {
			m.repeat(); 
			} else {
				m.cancel(); 
				m.interval = params[0];
				outlet(2, "bang");
				}	
			} else {
				if(input>0) {
					params[inlet-1] = input;
					checkMinMaxSpeed();										
					}							
				}
	}

//output bangs and update the speed
function met() {
	outlet(1, m.interval);
	outlet(0, "bang");
	//call a function to change the speed
	setSpeed();
}

function setSpeed() {
		//will generatere random integers between the minimum and maximum values
		m.interval =  Math.floor(Math.pow(Math.random(), params[3]) * (params[2] - params[1]+1)) + params[1];
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
		if(arguments[i] > 0) {
			params[i] = arguments[i];
			}
		}
	//check that the minimum and maximum speed are appropriate
	checkMinMaxSpeed();	
}

//make sure the minimum and maximum speed are appropriate
function checkMinMaxSpeed() {
	if(params[1]>params[2]) {
		params[1] = params[2]-1;
		postln(paramNames[1], "must be less than " + paramNames[2]);
	} else if(params[2]<params[1]) {
		params[2] = params[1]+1;
		postln(paramNames[2], "must be greater than " + paramNames[1]);
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