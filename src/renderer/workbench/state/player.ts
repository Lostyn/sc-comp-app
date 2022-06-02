import { createReducer } from '../../services/state/createReducer';

export type BaseState = {
	audioPath: string
}
const reducer = createReducer<BaseState>({
	name: "base",
	initialState: {
		audioPath: ''
	},
	reducers: {
		setAudioPath: (state, payload: string) => {
			state.audioPath = payload;
		}
	}
});

export const { setAudioPath } = reducer.actions;