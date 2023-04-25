# TODO

* add a div just below the canvas in order to display the `name`, `artists` and `tempo` fields of the track you are in over on;
* find a way to display edges that connects the active particle to all the other particles that share the same artist (e metti tutto i lresto in opacità);
* find a way to display a grid;
* {DONE] add instruction inside the HTML page;
* add arrows to the axis;
* add name to the axis:
* [ONGOING] add a counter to keep track of all the saved songs and maybe a <div> where to list them also;
* [NOT NEEDED ANYMORE] add a popup to alert the user a new song has been added to the saved list;
* change the behaviour of visited to saved (i pallozzi diventano opachi solo se li hai salvati);
* upload your Json file
* aggiusta il volume della traccia basandoti sul valore di loudness
* aggiungi uno step di caricamento iniziale del JSON tramite drag-and-drop. Inoltre, il parser del JSON appena caricato, dovrebbe controllare l'esistenza dei campi X e Y e, in caso esistano, evitare di fare il "cirle-packing" dei pallozzi ma usare le coordinate esistenti (https://p5js.org/reference/#/p5/createFileInput, https://p5js.org/reference/#/p5.Element/drop);

* [DONE] inserire un campo di testo dove l'utente possa digitare nome del brano e dell'artista per fare una ricerca di tutti i pallozzi che abbiano le caratteristiche compatibili (input: https://p5js.org/reference/#/p5/input);
* [DONE] usa un modo per filtrare i brani in base al loro BPM o alla loro "danzabilità" (magari usando degli sliders: https://p5js.org/reference/#/p5/createSlider)

* [ONGOING] cambia fonts
* grey out the "save playlist" button if you have not saver any tracks!

## BUGS

* togli lo stroke e fai piuttosto il fill nella barra di loading
