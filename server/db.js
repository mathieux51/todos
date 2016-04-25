import fs from 'fs'

export default class {
  constructor(file, options = {}) {
    this.options = {
      writeOnChange: false,
      ...options
    }
    this.data = {}

    this.file = file
    this.read()
  }
  all(table) {
    return this.data[table]
  }
  add(table, record) {
    this.data[table] = [...this.data[table] || [], record]
    if(this.options.writeOnChange)
      this.write()
    return this.all(table)
  }
  drop(table) {
    this.data[table] = []
    if(this.options.writeOnChange)
      this.write()
  }
  read() {
    if(fs.existsSync(this.file)) {
      const json = fs.readFileSync(this.file, 'utf8')
      this.data = JSON.parse(json)
    }
  }
  write() {
    const json = JSON.stringify(this.data)
    fs.writeFileSync(this.file, json, 'utf8')
  }
}
