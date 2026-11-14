import {test} from 'node:test';
import assert from 'node:assert/strict';
class FakeAudio extends EventTarget {
  paused=true;duration=120;currentTime=0;volume=1;muted=false;
  async play(){this.paused=false;this.dispatchEvent(new Event('playing'));}
  pause(){this.paused=true;this.dispatchEvent(new Event('pause'));}
}
globalThis.Audio=FakeAudio;
const {audio,usePlayer}=await import('./player.js');
const tracks=[{id:'a',title:'A',uri:'https://example.test/a.mp3'},{id:'b',title:'B',uri:'https://example.test/b.mp3'}];
test('shared player supports queue, seek, mute, volume and pause',async()=>{
  const p=usePlayer.getState();await p.play(tracks[0],tracks);
  assert.equal(audio.src,tracks[0].uri);assert.equal(usePlayer.getState().playing,true);
  p.seek(40);assert.equal(audio.currentTime,40);
  p.setVolume(.3);assert.equal(audio.volume,.3);p.mute();assert.equal(audio.muted,true);
  p.toggle();assert.equal(usePlayer.getState().playing,false);
  p.next();assert.equal(usePlayer.getState().song.id,'b');p.next(-1);assert.equal(usePlayer.getState().song.id,'a');
});
test('ended respects repeat-one and stops at the queue end',async()=>{
  const p=usePlayer.getState();await p.play(tracks[1],tracks);audio.dispatchEvent(new Event('ended'));
  assert.equal(usePlayer.getState().playing,false);p.toggleRepeat();audio.currentTime=120;
  audio.dispatchEvent(new Event('ended'));assert.equal(audio.currentTime,0);assert.equal(usePlayer.getState().song.id,'b');p.toggleRepeat();
});
