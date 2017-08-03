class LocalStorageMock {
  store: object;

  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: any) {
    this.store[key] = value;
  }

  removeItem(key: string) {
    delete this.store[key];
  }
}

global['localStorage'] = new LocalStorageMock(); //tslint:disable-line
