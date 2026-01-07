interface Callback {
  (data?: any): void;
}

interface Events {
  [eventName: string]: Callback[];
}

class EventEmitter {
  private events: Events = {};

  on(eventName: string, callback: Callback): void {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: Callback): void {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(eventName: string, data?: any): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(data));
    }
  }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
