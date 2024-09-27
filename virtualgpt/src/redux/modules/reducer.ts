import { ActionType } from "./types"
import { combineReducers } from 'redux';
import { ActionObject } from "./actions";
import { store } from "../..";


type textInputType={
    toggle:boolean
}
export type gptAskType={
    type:string
    payload:string
}

const textInputState:textInputType={
    toggle:false
}
const gptAskState:gptAskType={
    type:'',
    payload:''
}

export const getSpeech = (text:any) => {
    let voices:any = [];
    console.log('check')
    console.log(text.payload)
    //디바이스에 내장된 voice를 가져온다.
    const setVoiceList = async() => {
      voices = await window.speechSynthesis.getVoices();
    };
    
    setVoiceList();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      //voice list에 변경됐을때, voice를 다시 가져온다.
      window.speechSynthesis.onvoiceschanged = setVoiceList;
    }
  
    const speech = (txt:string) => {
      // const lang = "ko-KR"; 
      const lang = "en-US"
      const utterThis = new SpeechSynthesisUtterance(txt);
  
      utterThis.lang = lang;
      console.log(voices)
      /* 한국어 vocie 찾기
         디바이스 별로 한국어는 ko-KR 또는 ko_KR로 voice가 정의되어 있다.
      */
      const kor_voice = voices.find(
        (elem:any) => elem.lang === lang || elem.lang === lang.replace("-", "_")
      );
  
      //힌국어 voice가 있다면 ? utterance에 목소리를 설정한다 : 리턴하여 목소리가 나오지 않도록 한다.
      if (kor_voice) {
        console.log('good')
        utterThis.voice = kor_voice;
      } else {
        console.log('bad')
        return;
      }
  
      //utterance를 재생(speak)한다.
      window.speechSynthesis.speak(utterThis);
    };
   setTimeout(()=>{
    speech(text.payload);
   },100)
    
  };






const textInputReducer =(state:textInputType=textInputState,action:ActionObject) =>{
    switch(action.type){
        case ActionType.TEXT_INPUT:
            if (state.toggle){
                return{
                    toggle:false
                }
            }
            else{
                return{
                    toggle:true
                }
            }

       default:
         return state;  
      }
    };  
const gptAskReducer =(state:gptAskType=gptAskState,action:ActionObject) =>{

    switch(action.type){
        case ActionType.POST_GPT:
            return{
                type:ActionType.POST_GPT,
                payload:state.payload
            }
        case ActionType.POST_GPT_SUCCESS:
            getSpeech(action)
            console.log(state)
            console.log(action)


            return{
                type:ActionType.POST_GPT_SUCCESS,
                payload:action
            }    
        case ActionType.POST_GPT_FAIL:
            return{
                answer:'fail'
            }   
        default:
            return state;  
        }
    };      

const rootReducer=combineReducers({
    textInputReducer,
    gptAskReducer
}) 

export type RootState=ReturnType<typeof rootReducer>

export{rootReducer}

