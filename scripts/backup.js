// Dumps every MongoDB collection to a compressed JSON file in ./backups
//   node scripts/backup.js
// Uses MONGO_URI from .env (or the environment). Safe to run any time; it only reads.
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')
const mongoose = require('mongoose')
const { EJSON } = mongoose.mongo.BSON
require('dotenv').config()

const run = async () => {
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set')
  await mongoose.connect(process.env.MONGO_URI)
  const db = mongoose.connection.db
  const dump = { createdAt: new Date().toISOString(), collections: {} }

  const cols = await db.listCollections().toArray()
  for (const c of cols) {
    if (c.name.startsWith('system.')) continue
    // eslint-disable-next-line no-await-in-loop
    const docs = await db.collection(c.name).find({}).toArray()
    dump.collections[c.name] = docs
    console.log(`${c.name}: ${docs.length} documents`)
  }

  const dir = path.join(__dirname, '..', 'backups')
  fs.mkdirSync(dir, { recursive: true })
  const file = path.join(dir, `lazord-${new Date().toISOString().slice(0, 10)}.json.gz`)
  fs.writeFileSync(file, zlib.gzipSync(EJSON.stringify(dump, { relaxed: false })))
  console.log('Backup written:', file)
  await mongoose.disconnect()
}

run().catch(err => { console.error(err.message); process.exit(1) })
