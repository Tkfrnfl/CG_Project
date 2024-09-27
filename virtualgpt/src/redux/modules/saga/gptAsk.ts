// sagas/userTicket.js
import { all, fork, put, call, takeLatest } from "redux-saga/effects";
import { ActionType } from "../types";
import axios from "axios";
import { askGpt } from "../actions";
import { gptAskType } from "../reducer";
import { store } from "../../..";
//import { gptAskState } from "../reducer";

const message=[{"role": "user", "content": "Hello!"}]

const data={
    model:"gpt-3.5-turbo",
    messages: message,
    max_tokens:500
}
const headers={
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${'gpt key'}`,
}

function getResponseGptApi(action:gptAskType) {
  console.log('test2')
  console.log(action)
  return axios.post("https://api.openai.com/v1/chat/completions",{
     
  messages: [
    { role: "user", content: action.payload },
  ],
  max_tokens: 256,
  n: 1,
  temperature: 0.85,
  model: "gpt-3.5-turbo",
},
{
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${'gpt key'}`,
  },
    });
}



function* getResponseGpt(action:any):Generator<any> {
  try {
    // // api 통신할때는 call
    // const result:any = yield call(getResponseGptApi, action);

    // // 아래와 같이 api 결과를 핸들링하여 dispatch 가능 (gpt 활성화 코드)
    // yield put({ type: ActionType.POST_GPT_SUCCESS, payload: result.data.choices[0].message.content });
    const userMessage = action.payload; // 사용자가 입력한 데이터
    
    // 입력된 데이터를 바로 dispatch
    yield put({
      type: ActionType.POST_GPT_SUCCESS, 
      payload: userMessage // API 응답 대신 입력된 데이터를 그대로 사용
    });
  } catch (err:any) {
    console.log(err)
    yield put({ type: ActionType.POST_GPT_FAIL, payload: err.response.data });
  }
}
// function* getSpeech(action:any):Generator<any> {

//   console.log('test1')

// }



function* watchPostGpt() {
  yield takeLatest(ActionType.POST_GPT, getResponseGpt);
}

// function* watchResponseGpt(){
//   yield takeLatest(ActionType.POST_GPT_SUCCESS, getSpeech);
// }

// export function* postSaga2(){
//   yield all([fork(watchResponseGpt)]);
// }

export default function* postSaga() {
  yield all([fork(watchPostGpt)]);
}