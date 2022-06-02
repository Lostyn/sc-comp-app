export type ReducerOption<T> = {
	name: string,
	initialState: T,
	reducers: { [key: string]: (state: T, payload?: any) => void }
}

export type Reducer<T> = {
	state: T,
	actions: { [key: string]: (_) => void };
}

export namespace _reduce {
	export let state: { [action: string]: any } = {}
}

export function createReducer<T>(options: ReducerOption<T>): Reducer<T> {
	const { name, initialState, reducers } = options;

	const reducerNames = Object.keys(reducers)
	const actions = {};

	let state = initialState;
	_reduce.state[name] = state;

	reducerNames.forEach(reducerName => {
		actions[reducerName] = function (payload) {
			const newState = Object.assign({}, state);
			reducers[reducerName](newState, payload);
			_reduce.state[name] = newState;
		};
	});


	return {
		state,
		actions
	};
}