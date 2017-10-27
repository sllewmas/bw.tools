/*
bw.weights.js
Christopher Biggs & Samuel Wells

Trigger events based on a weighted probability.
*/

autowatch =1; //update the js file when saved externally
inlets = 1; //number of inlets
outlets = 2; //number of outlets

var mode = jsarguments[1]; //the mode of operation, weights or events
var name = jsarguments[2]; //the basic name of the send objects
var send; //variable to hold the send name

var weights = new Array(); //hold weights as an array
//the first weight should be zero so that the indexes of the weights array
//correspond to the indexes of the ranges array
//the ranges array requires the first index to be 0, such that the range, 
//the random number range that will trigger that event, goes from 0 to x
weights[0] = 0; 
var sum = 0; //variable to store the sum of all the weights
//array to store the range of numbers that will produce a true result and output
//the event index and the event name when in events mode
var ranges = new Array(); 
//the first index of ranges needs to be zero, such that the first range is 0 to x
ranges[0] = 0;
var eventNames = new Array(); //hold event names

//function that will generate an output when a bang is received
//this function just calls other functions depending on the mode
function bang() {
	if(mode == "events") {
		eventsGo();
	} else {
		weightsGo();
	}
}

//function to execute when a bang is received and bw.weights is in weights mode
function weightsGo() {
	//if there are no weights, post this error
	if(weights[1] == null) {
		postln("no weights assigned");		
		}
	//a variable "r" created, declared, and assigned to a random number multiplied by 
	//total value of all the weights entered
	var r = Math.random()*sum;
	//for each weight do the following
	for(var i = 0; i < weights.length; i++) {
		//if the random number is in the range of a specific index for weights then...
		if(r >= ranges[i] && r < ranges[i+1]) {
			//output the index of the weight, which will be one more than i 
			outlet(0, i+1);
			//create send name to send to a receive
			send = name+(i+1);
			//send a bang to the appropriate receive
			messnamed(send, "bang");
			//break out of the for loop
			break;
				}			
			}
}

//this is the same as the weightsGo() function, but deals with event names
function eventsGo() {
	if(eventNames[0] == null) {
		postln("no events assigned");		
		}
	var r = Math.random()*sum;
	for(var i = 0; i < weights.length+1; i++) {
		if(r >= ranges[i] && r < ranges[i+1]) {
			outlet(0, i+1);
			send = eventNames[i];
			outlet(1, eventNames[i]);
			messnamed(send, "bang");
			break;
				}			
			}
}

//list input will be treated as updating as all the weights
function list() {
	//run when in weights mode
	if(mode == "weights") {
		//reset the sum
		sum = 0;
		//for the number of weights provided...
		for(var i = 0; i< arguments.length; i++) {
			//fill the weights array starting at index 1
			weights[i+1] = arguments[i];
			//fill the ranges array starting at index 1
			ranges[i+1] = weights[i+1] + sum;
			//increase the sum each iteration
			sum = sum + weights[i+1];
		}
	} else {
		postln("mode is events, not weights");
	}
}

//since the event list starts with a string, a function to is required to name the events, 
//since, if the first element of a list is a string, it will be treated as a function name.
//This is similar to the list() function, but we have to treat every other element
//of the incoming list as a event name and a weight
function eventList() {
	if(mode == "events") {
		sum = 0; //reset the sum of the weights
		//iterate through the arguments provided
		//treating every other argument as an event name or a weight
		for(var i = 0; i < arguments.length; i++) {
			//all even arguments will be treated as event names
			if(i%2 == 0) {
				eventNames[Math.floor(i/2)] = arguments[i];	
			} else {
				var index = Math.floor(i/2+1);
				weights[index] = arguments[i];
				ranges[index] = arguments[i]+sum;
				sum = sum + weights[index];
			}			
		}
	}
}

//function to print the values to the max window
function getValues() {
	if(mode == "events") {
		for(var i = 0; i < eventNames.length; i++) {
			postln("percentage chance of " + eventNames[i] + " is", weights[i+1]/sum);		
		}
	} else {
		for(var i = 0; i < weights.length-1; i++) {
			postln("percentage change of event " + i + " is", weights[i+1]/sum);  
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