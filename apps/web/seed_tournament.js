require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Mongoose Models
const UserSchema = new mongoose.Schema({}, { strict: false });
const TournamentSchema = new mongoose.Schema({}, { strict: false });
const EventSchema = new mongoose.Schema({}, { strict: false });
const RegistrationSchema = new mongoose.Schema({}, { strict: false });

const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
const TournamentModel = mongoose.models.Tournament || mongoose.model('Tournament', TournamentSchema);
const EventModel = mongoose.models.TournamentEvent || mongoose.model('TournamentEvent', EventSchema);
const RegistrationModel = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);

async function seed() {
  try {
    const mongoUri = 'mongodb://127.0.0.1:27018/test';
    await mongoose.connect(mongoUri);
    console.log('Connected to DB');

    // 1. Find or create tournament "check 1"
    let tournament = await TournamentModel.findOne({ name: /check 1/i });
    if (!tournament) {
      console.log('Tournament "check 1" not found. Looking for any tournament...');
      tournament = await TournamentModel.findOne();
      if (!tournament) {
        console.log('No tournament found. Creating a dummy tournament...');
        tournament = await TournamentModel.create({
          name: 'check 1',
          status: 'Published',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
    console.log(`Using Tournament: ${tournament.name} (${tournament._id})`);

    // 2. Ensure categories/events exist for this tournament
    let events = await EventModel.find({ tournamentId: tournament._id });
    if (events.length === 0) {
      console.log('No events found for tournament. Creating standard events...');
      const eventData = [
        { name: 'Men\'s Singles Open', eventType: 'Singles', gender: 'Male', ageCategory: 'Open' },
        { name: 'Women\'s Singles Open', eventType: 'Singles', gender: 'Female', ageCategory: 'Open' },
        { name: 'Men\'s Doubles', eventType: 'Doubles', gender: 'Male', ageCategory: 'Open' }
      ];
      events = await Promise.all(eventData.map(e => EventModel.create({
        ...e,
        tournamentId: tournament._id,
        status: 'Active',
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })));
    }
    console.log(`Using Events: ${events.map(e => e.name).join(', ')}`);

    // 3. Create 100 Players
    console.log('Creating 100 players...');
    const playerIds = [];
    for (let i = 1; i <= 100; i++) {
      const email = `player${i}@example.com`;
      let user = await UserModel.findOne({ email });
      if (!user) {
        user = await UserModel.create({
          email,
          name: `Player ${i}`,
          authProvider: 'LOCAL',
          systemRole: 'PLAYER',
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
      playerIds.push(user._id);
    }
    console.log('100 Players ready.');

    // 4. Register players into categories
    console.log('Registering players...');
    await RegistrationModel.deleteMany({ tournamentId: tournament._id }); // Clear existing for clean slate
    let registrations = [];

    // Distribute players into the events
    const singlesEvents = events.filter(e => e.eventType === 'Singles');
    const doublesEvents = events.filter(e => e.eventType === 'Doubles');

    // Register 40 in first singles, 40 in second singles, 20 in doubles (10 pairs)
    for (let i = 0; i < 40; i++) {
      if (singlesEvents[0]) {
        registrations.push({
          tournamentId: tournament._id,
          eventId: singlesEvents[0]._id,
          participantIds: [playerIds[i]],
          status: 'Approved',
          paymentStatus: 'Paid',
          paymentUtr: `UTR-S1-${i}`,
          auditLog: [],
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    for (let i = 40; i < 80; i++) {
      if (singlesEvents[1] || singlesEvents[0]) {
        const ev = singlesEvents[1] || singlesEvents[0];
        registrations.push({
          tournamentId: tournament._id,
          eventId: ev._id,
          participantIds: [playerIds[i]],
          status: 'Approved',
          paymentStatus: 'Paid',
          paymentUtr: `UTR-S2-${i}`,
          auditLog: [],
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // Doubles pairs (remaining 20 players = 10 pairs)
    if (doublesEvents.length > 0) {
      for (let i = 80; i < 100; i += 2) {
        registrations.push({
          tournamentId: tournament._id,
          eventId: doublesEvents[0]._id,
          participantIds: [playerIds[i], playerIds[i+1]],
          status: 'Approved',
          paymentStatus: 'Paid',
          paymentUtr: `UTR-D-${i}`,
          auditLog: [],
          isDeleted: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    await RegistrationModel.insertMany(registrations);
    console.log(`Successfully seeded ${registrations.length} approved registrations across different categories!`);

    process.exit(0);
  } catch (error) {
    console.error('Seed Error:', error);
    process.exit(1);
  }
}

seed();
