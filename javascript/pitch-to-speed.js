/*
pitch-to-speed.js
Christopher Biggs & Samuel Wells

For Max objects for which the playback speed impacts the pitch, 
this function will convert musical intervals and output
the appropriate speed
*/

function msg_float(f) {
	outlet(0, Math.pow(2, f/12));
}