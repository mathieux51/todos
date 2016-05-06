export default new class {
  constructor() {
    this._config = {
      default: 'property'
    }
  }
  config(config) {
    this._config = {...this._config, ...config}
  }
  get name() {
    return this._config.name
  }
}

console.log("Hello")