/*
example of js file that generates messages for bw.playlister.js
Christopher Biggs & Samuel Wells
*/

autowatch = 1;
inlets = 1;
outlets = 1;

//you don't need these variables, if you want to type the quotes in the messages below
var vol = "vol";
var play = "play";
var loop = "loop";
var selection = "selection";
var t = "time";
var on ="on";
var off = "off";
var pitch = "pitch";
var speed = "speed";
var all = "all";
var clearSelection = "clearSelection";

//when a cue is received, send the desired messages
function msg_int(c) {
	if(c==0) {
		outlet(0, "bang");
		outlet(0, t, off);
		outlet(0, vol, all, 0, 25);
		outlet(0, loop, all, 0);
		outlet(0, clearSelection, all);
		outlet(0, pitch, all, 1);
		outlet(0, speed, all, 1);
		outlet(0, vol, 1, -128, 25);	
	}
	if(c==1) {
		outlet(0, play, 1);
		outlet(0, vol, 1, 0, 4000);	
		}
	if(c==2) {
		outlet(0, loop, 2, 1);
		outlet(0, play, 2);
		outlet(0, vol, 1, -128, 100);
		}	
	if(c==3) {
		outlet(0, loop, 2, 0);
		outlet(0, t, on);
		outlet(0, loop, 3, 1);
		outlet(0, play, 3);
		}
	if(c==4) {
		outlet(0, speed, 3, 2);	
		}
	if(c==5) {
		outlet(0, speed, 3, .25);
		outlet(0, vol, 3, 6);
		outlet(0, pitch, 3, 1);
		outlet(0, loop, 2, 1);
		outlet(0, speed, 2, 8);
		outlet(0, vol, 2, -30, 100);
		outlet(0, play, 2);		
		}
	if(c==6) {		
		outlet(0, t, off);
		outlet(0, vol, all, 0, 25);
		outlet(0, loop, all, 0);
		outlet(0, clearSelection, all);
		outlet(0, pitch, all, 1);
		outlet(0, speed, all, 1);}		
}
	