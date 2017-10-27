/*
bw.countEvents.js
Christopher Biggs & Samuel Wells

Keep track of the number of occurrences of multiple events
*/

autowatch = 1; //update the js file when saved in an external editor
inlets = 1; //the number of inlets
//the number of outlets equals the argument after the bw.countEvents text + 1
//the number of outputs equals the number of events + 1 because each outlet outputs
//the count of an event and the final output sends all the event counts as a list
outlets = jsarguments[1]+1;

//global variables
var l = jsarguments[1]; //this is the number of events that can be counted
var eventNames = new Array(l); //an array to store the event names
var eventCount = new Array(l); //an array to store the count for each event

//name all the events with a sequential number starting at 0 as the default name
for(var i = 0; i < l; i++) {		
	eventNames[i] = i;	
	eventCount[i] = 0;	
}

//the text event followed by a single event name or a list will count the event or
//list of events
function event() {
	//the inner for loop runs through the necessary iterations
	//for each member of an input list
	//the outer for loop runs for each member of the inputted list
	for(var j = 0; j < arguments.length; j++) {
			for(var i = 0; i < l; i++) {
				if(arguments[j] == eventNames[i]) {
					eventCount[i]++;
					outlet(i, eventCount[i]);
					break; //when the if statement is true, run the code and exit the loop
				}
			}
	}
	outlet(l, eventCount);
}

//a list following the text defineEvents will determine the event names to count
//these will replace the default names, which are sequential integers starting at zero 
//and reset the count of the specified events
function defineEvents() {
	for(var i = 0; i < arguments.length; i++) {
		eventNames[i] = arguments[i];
		eventCount[i] = 0;
		}	
}	

//reset all the counts to zero and output the events if "reset" is received
//if "reset" followed the names of one or more events is received,
//then reset the counts for only those events
function reset() {
	//if there are no arguments following reset, reset all event counts
	if(arguments.length == 0) {
		for (var i = 0; i < l; i++) {
			eventCount[i] = 0;
			outlet(i, eventCount[i]);
			outlet(l, eventCount);
			}
	//if there are arguments match each argument with the event name and reset 
	//the count for only those events
	} else {
		for(var j = 0; j < arguments.length; j++) {
				for(var i = 0; i < l; i++) {
					if(arguments[j] == eventNames[i]) {
						eventCount[i] = 0;
						outlet(i, eventCount[i]);
						outlet(l, eventCount);
						break;
					}
				}
		}
	}
}

//replace a single event name with another event name and reset the count of that event
function replace() {
		for(var i = 0; i < l; i++) {
			if(arguments[0] == eventNames[i]) {
				eventNames[i] = arguments[1];
					if(arguments[2] == "reset") {
						reset(arguments[1]);
					}
				break;
			}
		}
}
	
//this function allows you print the events you are counting to the max window
//with the event count
function printEvents() {
	for(var i = 0; i < l; i++) {
	postln(eventNames[i], eventCount[i]);	
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
