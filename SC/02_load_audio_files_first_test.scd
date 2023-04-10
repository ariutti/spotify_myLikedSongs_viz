// load a lot of soundfiles with FluCoMa
s.boot;
s.quit;

// load all the soundfiles inside a single buffer
~loader = FluidLoadFolder("/home/nicola/Documents/progetto_spotify_API/previews/WAV/mono_3s");
// actually do this
~loader.play(s, {"done".postln;});
// get a dictionary with alle the necessary information inside
~loader.index.size
~loader.files.size // a list of the loaded file


FluidWaveform(~loader.buffer) // makes the server crash if jack is not active

// approx
44100 * 647 * 29.712 // (sr * numb of files * files duration in seconds)
// are frames inside the buffer
847783369

~loader.index.asArray[0][\bounds]

(
~loader.index.do({
	|file|
	file[\path].postln;
	file[\bounds].postln;
	file[\numchans].postln;
	file[\sr].postln;
})
)

// lets examine the first identity dictionary
~startBound = ~loader.index.asArray[0][\bounds][0] // this is the 'start' bound
~endBound = ~loader.index.asArray[0][\bounds][1] // this is the 'end' bound
~endBound - ~startBound

44100 * 30

(
SynthDef(\playslice, {
	|out=0, amp=1.0, start=0, end=999, buf|
	var sig = Phasor.ar(1.0, BufRateScale.ir(buf),start, end);
	sig = BufRd.ar(1, buf, sig, loop:0.0) * amp;
	Out.ar(out, sig!2);
}).add;
)
// when playing the buffer like this the servere seems to have some glitch
x = Synth(\playslice, [\buf, ~loader.buffer, \start, ~startBound, \end, ~endBound]);
x.free;

y = {SinOsc.ar(1000) * 0.25}.play;
y.free;


(
~func_play_a_given_index = {
	|index|
	var path = ~loader.index.asArray[ index ][\path];
	var start = ~loader.index.asArray[ index ][\bounds][0];
	var end = ~loader.index.asArray[ index ][\bounds][1];
	[ index, path.split($/).last ].postln;
	Synth(\playslice, [\buf, ~loader.buffer, \start, start, \end, end]);
}
)

~func_play_a_given_index.( 0.rrand(~loader.files.size) );
x.free;
s.plotTree


// sembra che ci siano problemi a cercare di riprodurre
// alcuni delle 'slice' probabilmente per problemi di eccessiva memoria allocata
// non sembra nemmeno legato all'indice. Dapprincipio mi sarei detto che sarebbero stati gli indici
// più alti ad avere più problemi ed invece no.
// non sembra risolversi nemmeno se aumentiamo il block size
// non sembra ci siano sostanziali miglioramenti se uso file mono della durata di 3 anzichè di stereo di 30.


