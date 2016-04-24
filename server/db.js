import fs from 'fs'

export default class Database {
  constructor(file) {
    this.file = file
    if(fs.existsSync(this.file)) {
      const json = fs.readFileSync(this.file, 'utf8')
      this.data = JSON.parse(json)
    }
    else {
      this.data = {}
    }
  }
  all(table) {
    return this.data[table]
  }
  add(table, record) {
    this.data[table] = [...this.data[table] || [], record]
    this.write()
    return this.all(table)
  }
  drop(table) {
    this.data[table] = []
    this.write()
  }
  // Private
  write() {
    const json = JSON.stringify(this.data)
    fs.writeFileSync(this.file, json, 'utf8')
  }
}
