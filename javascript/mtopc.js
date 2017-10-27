/*
mtopc.js
Christopher Biggs & Samuel Wells

A utility to convert MIDI note number to pitch classes
*/

autowatch = 1; //update js file when saved externally
inlets = 2; //the number of inlets
outlets = 1; //the number of outlets

var noteNumber; //variable to hold the note number
var velocity; //variable to hold the velocity

function msg_int(input) {
//if more than one argument is entered, then do this
	if(arguments.length > 1) {
		//assign the note number to argument[0]
		noteNumber = arguments[0];
		//assign the velocity to argument[1]
		velocity = arguments[1];
		//if the velocity is greater than zero, then do this
		if(velocity > 0) {
			//outlet the remainder of the incoming note number divided by 12
			outlet(0, noteNumber%12);
		}
	//if there is only one argument provided, then do this
	} else {
	//if a single number entered in inlet 0, then assign it to the noteNumber
		if(inlet == 0) {
			noteNumber = input;
			//if the last message was not a note off message
				if(velocity > 0) {
				//output the pitch class
				outlet(0, noteNumber%12);
			}
		} else if(inlet == 1) {
			velocity = input;
			}
	}
}