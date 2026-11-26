import axios from 'axios';
export const api=axios.create({baseURL:import.meta.env.VITE_API_BASE_URL||'/api',withCredentials:true,timeout:20000});
export const uploadSong=async body=>{
  try {
    return await api.post('/music/upload',body,{timeout:120000});
  } catch(error) {
    if(error.code==='ECONNABORTED')throw new Error('Upload confirmation took longer than two minutes. Check the catalog before retrying; the server may still finish uploading your song.');
    if(error.response?.status===413)throw new Error('This audio file exceeds the deployment upload-size limit. Try a smaller file.');
    throw error;
  }
};
export const errorMessage=e=>e.response?.data?.message||e.response?.data?.messages||(e.code==='ECONNABORTED'?'The server took too long to respond. Please try again.':'Unable to connect. Check that the music server is running.');
export const fetchSongs=async()=>{const {data}=await api.get('/music');return data.musics.map(s=>({...s,id:s._id,artistName:s.artist?.username||'Independent artist'}));};
