// Adds the "British School for sale" listing. Run once from the lazord-server folder:   node seed/seedBritishSchool.js
// Safe to run again: it skips if a listing with the same title already exists.
const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const Property = require('../models/Property')

// Photos live in the UI project (lazord-UI/public/properties). Change SITE if your website address is different.
const SITE = process.env.CLIENT_URL ? process.env.CLIENT_URL.split(',')[0].trim().replace(/\/$/, '') : 'https://lazord-ui.vercel.app'

const listing = {
  title: 'British School for Sale: Operating Curriculum School in Al Mamzar',
  type: 'Buy',
  category: 'Commercial',
  price: 130000000,
  location: 'Al Mamzar',
  community: 'Al Mamzar',
  bedrooms: 0,
  bathrooms: 0,
  area: 100000,
  image: `${SITE}/properties/british-school-main.jpg`,
  gallery: [
    `${SITE}/properties/british-school-sports.jpg`,
    `${SITE}/properties/british-school-library.jpg`,
    `${SITE}/properties/british-school-lab.jpg`
  ],
  featured: true,
  status: 'Available',
  tag: 'Rare Opportunity',
  description:
    'A rare investment opportunity: a fully operating, licensed British curriculum school for sale in Al Mamzar, Dubai. ' +
    'The school is licensed from FS1 to Year 13 and sits on land exceeding 100,000 sq ft. The building is ground floor plus first floor, ' +
    'with approval to add one more floor. Facilities include science laboratories, a library, a sports hall, a theatre and a cafeteria. ' +
    'The property is free of any financial obligations. Asking price AED 130,000,000, negotiable.',
  amenities: [
    'British curriculum (FS1 to Year 13)',
    'Land over 100,000 sq ft',
    'Ground + 1 floor (approval for an additional floor)',
    'Science laboratories',
    'Library',
    'Sports hall',
    'Theatre',
    'Cafeteria',
    'Free of financial obligations',
    'Price negotiable'
  ]
}

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI)
  const exists = await Property.findOne({ title: listing.title })
  if (exists) {
    console.log('Already added, nothing to do.')
  } else {
    const p = await Property.create(listing)
    console.log('Added:', p.title, '(' + p._id + ')')
  }
  await mongoose.disconnect()
}

run().catch(e => { console.error(e.message); process.exit(1) })
