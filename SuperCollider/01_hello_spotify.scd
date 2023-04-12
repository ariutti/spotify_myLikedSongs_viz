s.boot;

(
"parsing myTracks JSON".postln;
{
	// READ AN ALREADY EXHISTING JSON FILE
	var path = PathName("/home/nicola/Documents/progetto_spotify_API/myTracks.json");
	//var path = PathName("/home/nicola/Documents/repos/FONDAMENTA/sound_atto_1/SC/settings/speakers_v3.json");

	// read a JSON file
	var f = File( path.fullPath, "r");
	//~dict_speakers = Dictionary.new;
	~dict_mytracks = f.readAllString.parseJson; // a dictionary
}.value();
);


~dict_mytracks.size; // 972 tracks (perchè sono meno delle mie tracce preferite??)

// Track keys are
// + danceability,
// + energy,
// + speechiness,
// + acousticness,
// + loudness,
// + valence,
// + id,
// + preview_url,
// + duration_ms,
// + tempo,
// + liveness,
// + instrumentalness,
// + artist,
// + key,
// + time_signature,
// + name,
// + mode
~dict_mytracks[0].keys
~dict_mytracks[0]["id"]

~dict_mytracks.do({ |track| track["id"].postln });


// LOAD PREVIEW FILES ////////////////////////////////////////////////////////////////////////////////////////////////////////
// try to load in memory all the preview files
~preview_audiofile_folder = PathName("/home/nicola/Documents/progetto_spotify_API/previews/WAV/");


// TODO: esamina anche "loadCollection" della classe Buffer oppure anche "DiskIn"

// fist fill a List with all the String representing the filenames of the files inside the preview audiofiles folder
~id_previews_list = List.new();
(
~preview_audiofile_folder.entries.do({
	|e|
	var filename = e.fileNameWithoutExtension;
	filename.postln;
	~id_previews_list = ~id_previews_list.add( filename.asSymbol );
});
)
~id_previews_list.size; // we have only 647 preview sound file



// non ce la fa a caircare tutto, prova piuttosto a caricare solo
(
"\nSTARTING".postln;
~dict_mytracks.do({
	|track, index|
	{
		// TODO: dal momento che non tutte le tracce hanno un file WAV di preview associato,
		// prima di caricare il file sul buffer occorrerebbe verificare se il file esiste effettivamente o meno
		var id = track["id"];
		var filepath = ~preview_audiofile_folder +/+ "%.wav".format(id);
		var filename = filepath.fileNameWithoutExtension;
		var b;
		{
		if( ~id_previews_list.includesEqual( filename.asString ), {
			"%) track %\t-\tincluded\n".postf(index, filename);
			b = Buffer.readChannel(s, filepath.fullPath, channels:0 );
			1.wait;
			//s.sync;
		},{
			"%) track %\t-\tpreview NOT present\n".postf(index, filename);
		});
		}.fork;

	}.value();
});
)