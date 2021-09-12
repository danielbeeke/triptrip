import initSqlJs from 'sql.js'

export class EasyDatabase {

    private db: any
    private fileHandle: FileSystemFileHandle

    constructor (fileHandle: FileSystemFileHandle) {
        this.fileHandle = fileHandle
    }

    async init () {
        const databaseFile = await this.fileHandle.getFile()
        const SQL = await initSqlJs({ locateFile: file => `/wasm/${file}`})
        this.db = new SQL.Database(databaseFile.arrayBuffer())
        this.writeSchemas()
        await this.save()
    }

    async save () {
        const binaryArray = this.db.export()
        const writableStream = await this.fileHandle.createWritable()
        await writableStream.write(binaryArray)
        await writableStream.close()
    }

    writeSchemas () {
        this.db.run(`CREATE TABLE IF NOT EXISTS media(
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            type TEXT NOT NULL,
            path TEXT NOT NULL UNIQUE,
            hash TEXT,
            name TEXT NOT NULL,
            startTime INTEGER NOT NULL,
            endTime INTEGER NOT NULL,
            latitude REAL,
            longitude REAL,
            filesize INTEGER NOT NULL
        );`)
    }

    upsert (table: string, object: {}) {
        const query = `INSERT INTO ${table}(${Object.keys(object)}) values(${Object.values(object).map(value => {
            if (!value) return '""'
            return typeof value === 'string' ? `"${value}"` : value
        }).join(', ')})`
        this.db.run(query)
        // console.log(query)
    }

    query (statement: string) {
        return this.db.exec(statement)
    }
}
