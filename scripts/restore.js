// Restores a backup made by scripts/backup.js.  DESTRUCTIVE: it replaces the contents of each collection in the backup.
//   node scripts/restore.js backups/lazord-2026-10-22.json.gz --confirm
const fs = require('fs')
const zlib = require('zlib')
const mongoose = require('mongoose')
const { EJSON } = mongoose.mongo.BSON
require('dotenv').config()

const run = async () => {
  const file = process.argv[2]
  if (!file || !process.argv.includes('--confirm')) {
    console.log('Usage: node scripts/restore.js <backup.json.gz> --confirm')
    console.log('This REPLACES the data in every collection found in the backup.')
    return
  }
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI is not set')
  const dump = EJSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString('utf8'))
  await mongoose.connect(process.env.MONGO_URI)
  const db = mongoose.connection.db
  for (const [name, docs] of Object.entries(dump.collections)) {
    // eslint-disable-next-line no-await-in-loop
    await db.collection(name).deleteMany({})
    // eslint-disable-next-line no-await-in-loop
    if (docs.length) await db.collection(name).insertMany(docs)
    console.log(`${name}: restored ${docs.length}`)
  }
  await mongoose.disconnect()
  console.log('Done.')
}

run().catch(err => { console.error(err.message); process.exit(1) })
