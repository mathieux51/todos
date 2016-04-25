import fs from 'fs'

export default new class {
  constructor() {
    this.options = {
      writeOnChange: false
    }
    this.data = {}
  }
  connect(options) {
    this.options = {
      ...this.options,
      ...options
    }
    this.read()
  }
  get file() { return this.options.file }  
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
    if(this.options.file === undefined) throw "No File Specified"
    if(fs.existsSync(this.options.file)) {
      console.log("Reading DB...")
      const json = fs.readFileSync(this.options.file, 'utf8')
      this.data = JSON.parse(json)
    }
  }
  write() {
    if(this.options.file === undefined) throw "No File Specified"
    const json = JSON.stringify(this.data, null, '  ')
    fs.writeFileSync(this.options.file, json, 'utf8')
  }
}
