import type { Step } from "react-joyride";

const JOYRIDE_STEPS: Step[] = [
  {
    target: '#open-song-file-button',
    title: "Load a song",
    content: "Start by opening a song. Any common format (.mp3, .wav) should work!",
  },
  {
    target: '#data-panel-length-input',
    title: "Lyrics' length",
    content: "If you've opened a song, the length of the lyrics file will update automatically."
  },
  {
    target: '#data-panel-title-input',
    title: "Song's title",
    content: "Let's write the title of the song before continuing."
  },
  {
    target: '#data-panel-lyrics-input',
    title: "Lyrics",
    content: "Now, we need to write down (or paste) the lyrics of the song. Separate lines with newlines naturally.",
  },
  {
    target: '#lyrics-timeline',
    title: "Lyrics timeline",
    content: "This is the timeline of your song. You can make the scale bigger or smaller by moving your mouse wheel while pressing Ctrl.",
    placement: 'left',
  },
  {
    target: '#lyrics-timeline',
    title: "Lyrics timeline",
    content: "If you hover your mouse over the timeline, a light blue cursor will appear. You can press the '+' button on its left to add the next line at that exact position. Below the cursor, you can see which line will be added at that exact point if you choose to do so.",
    placement: 'left',
  },
  {
    target: '#lyrics-timeline',
    title: "Lyrics lines",
    content: "You can drag each line up and down as you like! The order of the lyrics will never change, you are just moving the timestamps.",
    placement: 'left',
  },
  {
    target: '#music-player',
    title: "Music player",
    content: "While a song is opened, a music player will appear below.",
    blockTargetInteraction: true,
  },
  {
    target: '#music-player-play-button',
    title: "Play the song",
    content: "Press the play button to play the song (be careful with the volume!).",
  },
  {
    target: '#lyrics-timeline',
    title: "Adding lyrics",
    content: "While the song is playing, you can see a yellow cursor indicating exactly where the song is right now. You can press the 'A' key at any moment to add the next line of the song to the timeline. Add a few lines!",
    placement: 'left',
  },
  {
    target: '#lyrics-timeline',
    title: "Lyrics lines",
    content: "You can press anywhere on the timeline to play the song from that point. You can also press the green 'play' button in each line to play the song from the exact moment that line becomes active.",
    placement: 'left',
  },
  {
    target: '#ribbon-commit-button',
    title: "Commit",
    content: "At any point, you can press the 'Commit' button to save your progress to the browser. When you reopen this tab, your progress will be loaded exactly where it is now.",
  },
  {
    target: '#ribbon-save-button',
    title: "Save",
    content: "Once you've finished, you can press the 'Save' button to save your .lrc document to a file in your disk.",
  },
  {
    target: '#editor-panel-tab-code-button',
    title: "Code tab",
    content: "If you are privy to what .lrc files are, you can edit the code directly. If you press 'Apply' afterwards, your changes will be validated and applied to the file.",
  },
  {
    target: '#editor-panel-tab-preview-button',
    title: "Preview tab",
    content: "If you want to preview how your .lrc file will look like in a music player, you can head to this tab and play the song normally.",
  },
  {
    target: '#ribbon-start-tour',
    title: "Take tour again",
    content: "If you ever need to replay this explanation, you can do so here.",
    blockTargetInteraction: true
  },
]

export default JOYRIDE_STEPS;
