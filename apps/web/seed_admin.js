const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simulate the model structure manually so we don't have to fight TS compilation in Node
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String },
    hashedPassword: { type: String }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seed() {
    try {
        await mongoose.connect('mongodb://localhost:27017/daft_arena');
        console.log('Connected to DB');

        const hashedPassword = await bcrypt.hash('Daftlabs@2026', 10);
        
        // Find existing or create
        let user = await User.findOne({ email: 'daftlabs' });
        if (user) {
            user.hashedPassword = hashedPassword;
            await user.save();
            console.log('Updated existing admin user');
        } else {
            await User.create({
                email: 'daftlabs',
                name: 'Admin User',
                hashedPassword
            });
            console.log('Created new admin user');
        }
    } catch (e) {
        console.error('Error seeding', e);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
