export const notes = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
export const notesCalcKey = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#',
'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];
export const tonality = ['Major', 'Minor'];
export const chordProgression = [1, 4, 7, 3, 6, 2, 5, 1]
export let chordProgressionManipulate = [...chordProgression];


export function calculateNotesKey(startingNote, tonality) {
    let key = [];
    let startingNoteIndex;

    if (tonality === 'Major') {
        startingNoteIndex = notesCalcKey.indexOf(startingNote);
    } else {
        startingNoteIndex = notesCalcKey.indexOf(startingNote) + 3;
    }

    key.push({note: startingNote, tonality: tonality});

    if (tonality === 'Minor') {
        key.push({note: notesCalcKey[startingNoteIndex + 11], tonality: "Diminished"});
        key.push({note: notesCalcKey[startingNoteIndex + 12], tonality: "Major"});
        key.push({note: notesCalcKey[startingNoteIndex + 2], tonality: "Minor"});
        key.push({note: notesCalcKey[startingNoteIndex + 4], tonality: "Minor"});
        key.push({note: notesCalcKey[startingNoteIndex + 5], tonality: "Major"});
        key.push({note: notesCalcKey[startingNoteIndex + 7], tonality: "Major"});
        key.push({note: notesCalcKey[startingNoteIndex + 9], tonality: "Minor"});
    } else {
        key.push({note: notesCalcKey[startingNoteIndex + 2], tonality: "Minor"});
        key.push({note: notesCalcKey[startingNoteIndex + 4], tonality: "Minor"});
        key.push({note: notesCalcKey[startingNoteIndex + 5], tonality: "Major"});
        key.push({note: notesCalcKey[startingNoteIndex + 7], tonality: "Major"});
        key.push({note: notesCalcKey[startingNoteIndex + 9], tonality: "Minor"});
        key.push({note: notesCalcKey[startingNoteIndex + 11], tonality: "Diminished"});
        key.push({note: notesCalcKey[startingNoteIndex + 12], tonality: "Major"});
    }

    return key;
}

export function createButton(id, text, container) {
    let button = document.createElement('button');
    button.id = id;
    button.textContent = text;
    container.appendChild(button);
    return button;
}

export function createParagraph(id, text, container) {
    let paragraph = document.createElement('p');
    paragraph.id = id;
    paragraph.textContent = text;
    container.appendChild(paragraph);
    return paragraph;
}

export function handleChordButtonClick(event, chordCounter, keyChords, localChordProgressionManipulate) {
    if (chordCounter <= 4) {
        let randomChord;

        if (chordCounter === 1) {
            randomChord = keyChords[0];
        } else {
            let randomChordIndex;
            if (chordCounter <= 2) {
                randomChordIndex = Math.floor(Math.random() * (localChordProgressionManipulate.length - 1));
            } else {
                randomChordIndex = Math.floor(Math.random() * localChordProgressionManipulate.length);
            }
            randomChord = keyChords[localChordProgressionManipulate[randomChordIndex] - 1];

            localChordProgressionManipulate.splice(0, randomChordIndex);
        }

        let chordP = createParagraph(`chordP${chordCounter}`, `${randomChord.note}: ${randomChord.tonality}`, chordContainer);

        chordCounter += 1;
    } 

    if (chordCounter === 5) {
        chordBtn.remove();
        let playBtn = createButton('playBtn', 'Play', chordContainer);
        playBtn.addEventListener('click', handlePlayButtonClick);
    }

    return chordCounter;
}

export function handlePlayButtonClick(event) {
    let chords = document.querySelectorAll('p');
    let chordNotes = [];

    chords.forEach(chord => {
        if (chord.textContent.split(': ')[1] === 'Major') {
            chordNotes.push(createMajorChord(chord.textContent.split(': ')[0]));
        } else if (chord.textContent.split(': ')[1] === 'Minor') {
            chordNotes.push(createMinorChord(chord.textContent.split(': ')[0]));
        } else {
            chordNotes.push(createDiminishedChord(chord.textContent.split(': ')[0]));
        }
    });

    for (let i = 0; i < 2; i++) {
        chordNotes.shift();
    }
    

    chordNotes.forEach(chordNote => {
        console.log(chordNote);
    });

    Tone.Transport.cancel();
    Tone.Transport.stop();

    let synth = new Tone.PolySynth(Tone.Synth).toDestination();
    Tone.Transport.bpm.value = 120;

    chordNotes.forEach((chord, index) => {
        Tone.Transport.schedule(time => {
            synth.triggerAttackRelease(chord, '1n', time);
        }, index * 2);
    });

    Tone.Transport.start();


    // let synthChords = chordNotes.map(chord => {
    //     let synthChord = new Tone.Frequency(chord).toNote();
    //     return synthChord;
    // });

    // let synthChordsLength = synthChords.length;
    // let synthChordsIndex = 0;

    // Tone.Transport.scheduleRepeat(time => {
    //     synth.triggerAttackRelease(synthChords[synthChordsIndex], '4n', time);
    //     synthChordsIndex += 1;
    //     if (synthChordsIndex === synthChordsLength) {
    //         synthChordsIndex = 0;
    //     }
    // }, '4n');

    // Tone.Transport.start();
}

export function createMajorChord(note) {
    let majorChord = [
        note + "4", 
        notesCalcKey[notesCalcKey.indexOf(note) + 4] + "4", 
        notesCalcKey[notesCalcKey.indexOf(note) + 7] + "4"
    ];
    return majorChord;
}

export function createMinorChord(note) {
    let minorChord = [
        note + "4", 
        notesCalcKey[notesCalcKey.indexOf(note) + 3] + "4", 
        notesCalcKey[notesCalcKey.indexOf(note) + 7] + "4"
    ];
    return minorChord;
}

export function createDiminishedChord(note) {
    let diminishedChord = [
        note + "4", 
        notesCalcKey[notesCalcKey.indexOf(note) + 3] + "4", 
        notesCalcKey[notesCalcKey.indexOf(note) + 6] + "4"
    ];
    return diminishedChord;
}