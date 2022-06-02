interface ISignal<T> {
    register(callback: (T) => void): () => void;
    fire: (T) => void;
}

class Signal<T = {}> implements ISignal<T> {
    _event: ((T) => void)[] = [];

    register(callback: (T) => void): () => void {
        const index = this._event.length;
        if (!this._event.includes(callback)) {
            this._event.push(callback);
        }

        return () => {
            this._event.splice(index, 1);
        }
    }

    fire = (arg?: T) => {
        for (let i = 0; i < this._event.length; i++) {
            this._event[i](arg);
        }
    }

}

export default Signal;