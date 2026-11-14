import {create} from 'zustand';
export const audio=new Audio();
audio.preload='metadata';
export const usePlayer=create((set,get)=>({song:null,queue:[],playing:false,loading:false,error:'',time:0,duration:0,volume:0.7,muted:false,shuffle:false,repeat:false,panel:false,
 play:async(song,queue)=>{if(!song?.uri)return;const changed=get().song?.id!==song.id;set({song,queue:queue||get().queue,error:'',loading:true,...(changed?{time:0,duration:0}:{})});if(changed)audio.src=song.uri;try{await audio.play();}catch(e){if(e.name!=='AbortError')set({error:'This audio could not be played. Try another track.',loading:false,playing:false});}},
 toggle:()=>{if(!get().song)return;if(audio.paused)get().play(get().song);else audio.pause();},
 next:(direction=1)=>{const s=get();if(!s.queue.length)return;let i=s.queue.findIndex(t=>t.id===s.song?.id);i=s.shuffle&&s.queue.length>1?(i+1+Math.floor(Math.random()*(s.queue.length-1)))%s.queue.length:(i+direction+s.queue.length)%s.queue.length;s.play(s.queue[i]);},
 seek:t=>{if(Number.isFinite(audio.duration)){audio.currentTime=t;set({time:t});}},
 setVolume:v=>{audio.volume=v;audio.muted=false;set({volume:v,muted:false});},mute:()=>{audio.muted=!audio.muted;set({muted:audio.muted});},toggleShuffle:()=>set(s=>({shuffle:!s.shuffle})),toggleRepeat:()=>set(s=>({repeat:!s.repeat})),setPanel:panel=>set({panel})}));
audio.volume=.7;
for(const event of ['play','pause','waiting','playing','loadedmetadata','durationchange','timeupdate','error','ended'])audio.addEventListener(event,()=>{const s=usePlayer.getState();if(event==='ended'){if(s.repeat){audio.currentTime=0;s.play(s.song);}else if(s.shuffle||s.queue.findIndex(t=>t.id===s.song?.id)<s.queue.length-1)s.next();else usePlayer.setState({playing:false});return;}usePlayer.setState({playing:!audio.paused,loading:event==='waiting'?true:event==='playing'||event==='error'?false:s.loading,time:audio.currentTime||0,duration:Number.isFinite(audio.duration)?audio.duration:0,...(event==='error'?{error:'Audio unavailable. The file may have been removed.',loading:false}:{} )});});
