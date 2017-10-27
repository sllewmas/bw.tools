/*
bw.cueSystem.js
Christopher Biggs & Samuel Wells

bw.cueSystem is a counter system for triggering and sending cue numbers 
that can be linked to anything, e.g. effect presets or sound file triggers. You
can also customize and store keyboard or MIDI triggers.
*/

autowatch = 1; //update the js file in Max when edited externally
inlets = 1; //the number of inlets
outlets = 2; //the number of outlets

//variable for counting system
var currentCue = 0;  //sets the initial cue from the first argument
var nextCue = jsarguments[1]+1; //sets the initial next cue
var l = jsarguments[1];  //this is variable to store the last number typed 
						 //into the "set/display next cue" integer box
var quiet = jsarguments[2]; //a variable to determine if the parameters are posted to the max window

//variables for keyboard control
var keyTrigger = 32; //the default trigger–spacebar
var learnKeyOpen = 0; //is learning on or off
var keyOn = 1; //does the keyboard work as a trigger

//var for control change messages
var ccTrigger = 64; //the default trigger number
var learnCcOpen = 0; //is learning on or off
var ccOn = 1; //does the midi cc work as a trigger

//var for MIDI note messages
var noteTrigger = 60; //the default trigger number
var learnNoteOpen = 0; //is learning on or off
var noteOn = 1; //does the midi note work as a trigger

//variables to send direct messages to objects based on their scripting names
//nothing will be connected to these objects in the Max patch, but they will change 
var showTriggerNumber; //int box to show trigger number
var showLearnKey; //message box to learn trigger number
var showCcTriggerNumber; //int box to show trigger number
var showCcLearnKey; //message box to learn trigger number
var showNoteTriggerNumber; //int box to show trigger number
var showNoteLearnKey; //message box to learn trigger number

//variables for the timer that prevents unwanted double triggers
var gate_state = true; //initially the gate is opened
var timer = 50; //default time in ms to prevent re-trigger
var TimedGate=new Task(open_gate); //a task track the amount of pasted since the last trigger

//print keyboard assignments to max window
if (quiet != 'quiet') {
    post("cue system keyboard assignments: \n press r to reset \n press l to start at the last cue you entered in the set/disply next cue number box \n press left and right arrows to set the next cue forward or back one number");
}
//initialize the names of the objects to send direct messages: 
//create a variable to hold the name of the objects with scripting names in the same max window
showTriggerNumber = this.patcher.getnamed("showTriggerNumber");
showLearnKey = this.patcher.getnamed("showLearnKey");
showCcNumber = this.patcher.getnamed("showCcTriggerNumber");
showLearnCc = this.patcher.getnamed("showLearnCc");	
showNoteNumber = this.patcher.getnamed("showNoteTriggerNumber");
showLearnNote = this.patcher.getnamed("showLearnNote");	
showVelDial = this.patcher.getnamed("velDial");	
	
//open the learning operations, which are automatically shut off in another function
function learnKey() {
	learnKeyOpen = 1;
	}	
	
function learnCc() {
	learnCcOpen = 1;
	}
	
function learnNote() {
	learnNoteOpen = 1;
	}
	
//if the trigger mechanism is on or off this will
//send messages to change the related graphical objects 
function setKeyOn(i) {
	keyOn = i;	
	if (keyOn == 0) {
		showTriggerNumber.hidden = 1; 
		showLearnKey.hidden = 1; 		
	} else {
		showTriggerNumber.hidden = 0;
		showLearnKey.hidden = 0; 
	}
}	
//this is the same type of function for the objects related to MIDI triggers with CC messages
function setCcOn(i) {
	ccOn = i;
		if (ccOn == 0) {
		showCcNumber.hidden = 1; 
		showLearnCc.hidden = 1; 	
	} else {
		showCcNumber.hidden = 0;
		showLearnCc.hidden = 0;
		}
}
//this is the same type of function for the objects related to MIDI triggering with note on messages
function setNoteOn(i) {
	noteOn = i;
		if (noteOn == 0) {
		showNoteNumber.hidden = 1;
		showLearnNote.hidden = 1;
		showVelDial.hidden = 1;	
	} else {
		showNoteNumber.hidden = 0;
		showLearnNote.hidden = 0;
		showVelDial.hidden = 0;		
		}
}

//trigger based on keyboard input or learn a new trigger
function key(k) {
//only access this code, if keyboard triggering is on
	if(keyOn==1) { 
	//if learning is off, then check to see if this is the current keyboard trigger, 
	//if it is the appropriate trigger, then trigger the counter	
			if((learnKeyOpen == 0 && k == keyTrigger)) {
				bang(); //call the bang() function, defined below
			}	
	}
//if learning is open, learn the key, if it is not already assigned as a key command, 
//and then turn off learning and update the related integer box
		if(learnKeyOpen == 1) {		
			if (k == 114 || k == 28 || k == 29 ||k == 108) {
				post("this key is already assigned \n select another key");
				learnKeyOpen = 1;			
				} else {	
				keyTrigger = k; //assign keyTrigger to incoming value
				learnKeyOpen = 0; //turn off learning, now that a new key is assigned
				//update properties of objects as needed
				showLearnKey.message("text", keyTrigger);
				showTriggerNumber.message("set", keyTrigger);
				showTriggerNumber.message("bang");
				showLearnKey.message(0);
				}
		}
		//if the key is "r" then reset the counter on the next trigger
		if (k==114) {
			currentCue = jsarguments[1];
			outlet(1, "set", currentCue);
		}
		//if the key is "l" then  go to the last entered cue number on the next trigger
		if (k==108) {
			currentCue = l;
			outlet(1,  "set", currentCue);
		}
		// if the key is a left arrow, set the next cue back one
		if (k == 28) {
		 	currentCue--;
			outlet(1,  "set", currentCue);
		}
		//if the key is a right arrow, set the next cue forward one
	if(k == 29) {
		currentCue++;
		outlet(1, "set", currentCue);
		}	
}

//trigger based MIDI CC input or learn a new trigger
function cc() {
	if(ccOn == 1) {	
		if((learnCcOpen == 0 && arguments[1] == ccTrigger && arguments[0] == 127)) {
		bang();
			}	
	if(learnCcOpen == 1) {
				ccTrigger = arguments[1];
				learnCcOpen = 0;
				showLearnCc.message("text", ccTrigger);
				showCcNumber.message("set", ccTrigger);
				showCcNumber.message("bang");
				showLearnCc.message(0);
			}
		} 
}		

//trigger based on MIDI note input or learn a new trigger
function note() {
	if(noteOn == 1) {	
		if((learnNoteOpen == 0 && arguments[0] == noteTrigger && arguments[1] > arguments[2])) {
		bang();
			}	
	if(learnNoteOpen == 1) {
				noteTrigger = arguments[0];
				learnNoteOpen = 0;
				showLearnNote.message("text", noteTrigger);
				showNoteNumber.message("set", noteTrigger);
				showNoteNumber.message("bang");
				showLearnNote.message(0);
			}
		} 
}

//when the next cue is typed in, update the the counter to that number 
function updateNextCue(n) {
	currentCue = n;
	l = n;
}

//counting function with timed gate: each time the function is called, it will not be outputted again for a specified interval of time
//this isn't the same as the speedlim object because any triggers inputted during this interval are ignored
function bang() {	
	//if the gate_state variable evaluates as true, run the code
	if (gate_state) {
		gate_state = false; //set the gate state to false
		 //can the open_gate() function, once the timer interval is reached
		 //when open_gate() is called, the gate_state variable will evaluate as true again
		TimedGate.schedule(timer);
		nextCue = currentCue + 1; //update the display of next cue
		outlet(1,  "set", nextCue); //output the next cue
		outlet(0, currentCue);	 //output the current cue
		currentCue++; //add 1 to the current cue
	}
}	

//function to update the timing interval for the gate
function preventTime() {
	timer = arguments[0];
}

//function for timer	that is called after the interval specified by the variable "timer"
function open_gate(){
	gate_state = true;
}
