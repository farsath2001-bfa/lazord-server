// Adds agents from the list below. Run from the lazord-server folder:   node seed/seedAgents.js
// EDIT THE LIST FIRST with your real team (name, phone, WhatsApp, photo URL). Existing names are skipped,
// so you can add more people later and run it again.
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Agent = require('../models/Agent')

const agents = [
  {
    name: 'Mohammed Al',
    title: 'CEO & Founder',
    experience: '22 Years Experience',
    phone: '+971 42 999 088',
    whatsapp: '97142999088',
    email: 'mohammed@lazordrealestate.com',
    photo: '',
    languages: 'Arabic, English',
    speciality: 'Luxury Villas & Penthouses',
    areas: ['Downtown Dubai', 'Palm Jumeirah', 'Emirates Hills'],
    order: 1
  },
  {
    name: 'Sarah',
    title: 'Senior Sales Director',
    experience: '14 Years Experience',
    phone: '+971 42 981 078',
    whatsapp: '97142981078',
    email: 'sarah@lazordrealestate.com',
    photo: '',
    languages: 'English, French',
    speciality: 'Off Plan & Investments',
    areas: ['Dubai Creek Harbour', 'Business Bay', 'DIFC'],
    order: 2
  }
]

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  let added = 0
  for (const a of agents) {
    // eslint-disable-next-line no-await-in-loop
    if (await Agent.exists({ name: a.name })) { console.log('skip (exists):', a.name); continue }
    // eslint-disable-next-line no-await-in-loop
    await Agent.create(a)
    added += 1
    console.log('added:', a.name)
  }
  console.log(`Done. ${added} agent(s) added.`)
  await mongoose.disconnect()
}

run().catch(err => { console.error(err); process.exit(1) })
