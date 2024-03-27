// import * as Tone from 'https://cdn.skypack.dev/tone';
import { notes, tonality, chordProgression, notesCalcKey, chordProgressionManipulate } from './resources.js';
import { calculateNotesKey, createButton, createParagraph, handleChordButtonClick,
handlePlayButtonClick } from './resources.js';

const synth = new Tone.Synth().toDestination();
Tone.Transport.bpm.value = 120;

let keyContainer = document.getElementById('keyContainer');
let keyBtn = document.getElementById('keyBtn');
let pickKeyText = document.getElementById('pickKeyText');
let chordContainer = document.getElementById('chordContainer');
let chordBtn = document.getElementById('chordBtn');
let chordCounter = 1;


keyBtn.addEventListener('click', async () => {
    let randomNote = notes[Math.floor(Math.random() * notes.length)];
    let randomTonality = tonality[Math.floor(Math.random() * tonality.length)];

    pickKeyText.textContent = `Your Key: ${randomNote} ${randomTonality}`;
    keyBtn.textContent = 'New Key';

    let keyChords = calculateNotesKey(randomNote, randomTonality);

    let keyNotesP = document.getElementById('keyNotesP');
    let keyChordsText = keyChords.map(chord => `${chord.note}: ${chord.tonality}`).join(', ');

    if (keyNotesP) {
        keyNotesP.textContent = keyChordsText;
    } else {
        keyNotesP = createParagraph('keyNotesP', keyChordsText, keyContainer);
    }

    let chordBtn = document.getElementById('chordBtn');

    if (!chordBtn) {
        chordBtn = createButton('chordBtn', 'Pick Chord', chordContainer);
    }

    chordCounter = 1;

    // This code will remove all <p> tags inside chordContainer
    let pTags = chordContainer.getElementsByTagName('p');
    let playBtn = document.getElementById('playBtn');
    while(pTags.length > 0){
        pTags[0].parentNode.removeChild(pTags[0]);
        playBtn.remove();
    }

    // Reset localChordProgressionManipulate here
    let localChordProgressionManipulate = [...chordProgression];

    // Pass localChordProgressionManipulate to handleChordButtonClick
    chordBtn.addEventListener('click', (event) => {
        chordCounter = handleChordButtonClick(event, chordCounter, keyChords, localChordProgressionManipulate);
    });

});
