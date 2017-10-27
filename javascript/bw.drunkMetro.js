/*
bw.drunkMetro.js
Christopher Biggs & Samuel Wells

A metronome that changes speed similar to how the drunk object changes numbers; however,
 the likelihood that the speed increases or decreases and the step size for increases and decreases are distinct variables
*/

autowatch = 1; //update the js in Max when edited in an external editor
inlets = 8; //specify the number of inputs
outlets = 3; //specify the number of outputs

//creates a Task object called m that will call the function metro
var m = new Task(metro, this);

//create an array to hold the names of the parameters
//this will facilitate printed the parameter names along with their values
var paramNames = new Array(7);
paramNames[0] = "initial speed";
paramNames[1] = "fastest speed";
paramNames[2] = "slowest speed";
paramNames[3] = "step size faster";
paramNames[4] = "step size slower";
paramNames[5] = "probability of moving faster";
paramNames[6] = "probability of moving slower";

//default parameters  for any parameter that is not defined by arguments
var defaultParams = [150, 100, 500, 25, 25, 1, 1];

//this is an array to hold the value of the basic parameters needed for drunk metro
var params = new Array(7);

//fill the params array with the number of arguments that are entered
//since the first argument entered in the js object in max is indexed at 1, since index 0 is the file name,
//index 0 of the params will map to index 1 of the jsarguments array 
var numberOfParametersEnteredAsArguments = jsarguments.length - 1;
for(var i = 0; i < numberOfParametersEnteredAsArguments; i++) {
	params[i] = jsarguments[i+1];
	}
//for any undefined elements of params, fill with the default parameters
for(var i = numberOfParametersEnteredAsArguments; i < 7 ; i++) {
	params[i] = defaultParams[i];
}
//the step size faster will need to be negative, since it will be a decrease from the previous speed
params[3] = params[3]*-1;

//to return to the initial speed the current speed must be a distinct variable
var currentSpeed = params[0];
//set the initial speed of the metro
m.interval = currentSpeed;
// a variable to hold the change in speed,  which will either be the step size faster or slower 
var stepSize;

//the likelihood of stepping faster or slower is determined by the relative values of the weights entered
//the proportions between the weights must be normalized to values that add to 1
//therefore, sum of the entered weights is required
var totalWeight = params[5] + params[6];
//the probability of going faster will be the weight of going faster divided by the sum of the weights
//the probability of going slower is not required, since that value between the percentFaster variable and 1
var percentFaster = params[5]/totalWeight;
//when drunkMetro reaches the minimum or maximum speed, distinct functions are called
//the function called is determined by the mode
//the possible modes are "continue," "reset," "reverse," or "stop" */
var md = jsarguments[8];
md = md.toLowerCase(); //make sure that the mode is lower case

//if the mode is not set or is not set to a valid option, then print that information
// and set the mode to "continue"
if((md != "continue") && (md != "reverse") && (md != "stop") && (md != "reset")) {
	md = "continue";
	postln("mode is not set or is not set appropriately");
}

//is the process on or off
var on = 0;
//a variable to hold  number of times the parameters have reversed, when in reverse mode
var reverseCount = 0;

//when an integer enters in inlet 0, start or stop
//otherwise, treat the incoming message as an updated parameter
function msg_int(input) {
	if(inlet == 0) {
		on = input;
		//whenever on is non-zero, drunk metro will be on
		if(on != 0 ) {
			m.repeat(); //repeat will call the metro() function forever 
			} else {
				//this is a function to call when the metro is shut off
				off();
				}	
		} else {
			//assign the incoming value to a value of the params array based on the inlet 
			//in which that value entered
			//the inlet variable is native variable that is assigned to the inlet number that a message entered
			params[inlet-1] = input;
			//if one of the probabilities changed, redo the total and update the percentFaster variable
			if((inlet == 6) || (inlet == 7)) {
				totalWeight = params[5] + params[6];
				percentFaster = params[5]/totalWeight;
				}
			//if the step size faster is changed, make it negative
			if(inlet == 4) {
				params[3] = params[3]*-1;		
				}
	}
}

//the msg_float function duplicates the msg_int function, but will respond to float input
function msg_float(input) {
	if(inlet == 0) {
	on = input;
		if(on != 0 ) {
			m.repeat(); 
			} else {
				off();
				}	
		} else {
			params[inlet-1] = input;
			if((inlet == 6) || (inlet == 7)) {
				totalWeight = params[5] + params[6];
				percentFaster = params[5]/totalWeight;
				}
			if(inlet == 4) {
				params[3] = params[3]*-1;		
				}
	}
}

//a function called by the repeat function of the task object "m"
function metro() {
	//output the value of currentSpeed
	outlet(1, currentSpeed);
	//output a bang
	outlet(0, "bang");
	//call the changeSpeed function, which will set a new speed
	changeSpeed();
}

//generate a new speed
function changeSpeed() {
	//generate a random number between 0, inclusive, and 1, exclusive, which will be used to determine
	//if we step faster or slower
	var r = Math.random();
	//determine if we step faster or slower based on the random number
	if(r < percentFaster ) {
		stepSize = params[3];
			} else {
				stepSize = params[4];
		}	
	//update currentSpeed, stepSize will be negative, if we are moving faster
	currentSpeed = currentSpeed + stepSize;
	//if we have reached the upper or lower limit of our speed range, call the mode function
	if(currentSpeed <= params[1] || currentSpeed >= params[2]) {
		mode();
	}
	//set the metro speed to the current rate
	m.interval = currentSpeed;
}

//function to turn off the metro and do what needs to be done when that happens
function off() {
		//cancel repeat function of m task object
		m.cancel();
		//reset the current speed to the initial speed
		currentSpeed = params[0];
		//send out a carry bang
		outlet(2, "bang");	
		//if the number of times the parameters have been reserved is odd
		//reverse them again and reset the count, such that when we start again, the parameters will be arguments or last inputted parameters, 
		//not the reverse of those parameters
		if(reverseCount%2 == 1) {
			reverseParams();
			reverseCount = 0;
		}
}

//function to determine what happens when limits are reached
function mode() {	
	if(md == "continue") {
		//constrain the speed to the minimum and maximum
		//Math.max will assign currentSpeed to the maximum between the current speed and the minimum speed
		//Math.min will then assign currentSpeed to the minimum of that result and the maximum speed
		currentSpeed = Math.min(Math.max(currentSpeed, params[1]), params[2]);
	}
	//call the off() function when limits are reached
	if(md == "stop") {
		off();
	}
	//return to initial speed when limits are reached
	if(md == "reset") {
		currentSpeed = params[0];
	}
	//call the reverseParams function when the limits are reached
	if(md == "reverse") {
		reverseParams();
	}
}

//function to reverse weights and step sizes
function reverseParams() {
	//constrain the value of currentSpeed
	currentSpeed = Math.min(Math.max(currentSpeed, params[1]), params[2]);
	//parameters to hold the current settings for the values to reverse
	var holdStepSizeFaster = params[3];
	var holdStepSizeSlower = params[4];
	var holdWeightFaster = params[5];
	var holdWeightSlower = params[6];
	//set the values to the opposite parameters and change sign if necessary
	params[3] = holdStepSizeSlower*-1;
	params[4] = holdStepSizeFaster*-1;
	params[5] = holdWeightSlower;
	params[6] = holdWeightFaster;
	//update the weights and percent faster	
	totalWeight = params[5] + params[6];
	percentFaster = params[5]/totalWeight;
	//increment reserve count
	reverseCount++;	
}

//function to update the mode
function setMode(input) {
	md = input;
	if((md != "continue") && (md != "reverse") && (md != "stop") && (md != "reset")) {
		md = "continue";
		postln("mode is not set or is not set appropriately: mode will be continue");
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
		if(arguments[i] > 0) {
			params[i] = arguments[i];
			}
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
