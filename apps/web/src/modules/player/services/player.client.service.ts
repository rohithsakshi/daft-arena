// @ts-nocheck
export class PlayerService {
  async getProfile(...args: any[]) {
    try {
      if (typeof window === 'undefined') {
        const { cookies } = await import('next/headers');
        const cookieStore = await cookies();
        const token = cookieStore.get('daft_token')?.value || cookieStore.get('daft_superadmin_token')?.value || cookieStore.get('token')?.value;
        if (token) {
          const { verifyToken } = await import('@/lib/auth/jwt');
          const payload = await verifyToken(token);
          if (payload?.sub) {
            const { connectDB } = await import('@/lib/mongodb');
            const { UserModel } = await import('@/modules/iam/models/User');
            await connectDB();
            const p = await UserModel.findById(payload.sub).lean();
            if (p) {
              const uId = String(p._id || p.id);
              const shortId = uId.length > 8 ? `${uId.slice(0, 8)}...` : uId;
              const name = p.name || p.fullName || (p.email ? p.email.split('@')[0] : 'Player');

              return {
                id: shortId,
                userId: uId,
                fullName: name,
                email: p.email || '',
                phone: p.phone || '',
                city: p.city || '',
                state: p.state || '',
                country: p.country || '',
                bio: p.bio || '',
                sports: Array.isArray(p.sports) ? p.sports : ['Badminton'],
                medicalDetails: p.medicalDetails || {},
                emergencyContact: p.emergencyContact || {},
                role: p.systemRole || 'PLAYER',
                stats: { winRatio: 0, matchesPlayed: 0, matchesWon: 0, tournamentsWon: 0, tournamentsEntered: 0, medals: { gold: 0, silver: 0, bronze: 0 } }
              };
            }
          }
        }
      } else {
        const res = await fetch('/api/player/profile', { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            const p = json.data;
            const uId = String(p._id || p.id);
            const shortId = uId.length > 8 ? `${uId.slice(0, 8)}...` : uId;
            const name = p.name || p.fullName || (p.email ? p.email.split('@')[0] : 'Player');

            return {
              id: shortId,
              userId: uId,
              fullName: name,
              email: p.email || '',
              phone: p.phone || '',
              city: p.city || '',
              state: p.state || '',
              country: p.country || '',
              bio: p.bio || '',
              sports: Array.isArray(p.sports) ? p.sports : ['Badminton'],
              medicalDetails: p.medicalDetails || {},
              emergencyContact: p.emergencyContact || {},
              role: p.systemRole || 'PLAYER',
              stats: { winRatio: 0, matchesPlayed: 0, matchesWon: 0, tournamentsWon: 0, tournamentsEntered: 0, medals: { gold: 0, silver: 0, bronze: 0 } }
            };
          }
        }
      }
    } catch (e) {
      console.error('getProfile error:', e);
    }
    return { id: 'usr_1', userId: 'usr_1', fullName: 'Competitor', role: 'PLAYER', sports: ['Badminton'], stats: { winRatio: 0, matchesPlayed: 0, matchesWon: 0, tournamentsWon: 0, tournamentsEntered: 0, medals: { gold: 0, silver: 0, bronze: 0 } } } as any;
  }

  static async getProfile(...args: any[]) {
    return new PlayerService().getProfile(...args);
  }

  async saveProfile(userId: string, updatedData: any) {
    const res = await fetch('/api/player/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error || 'Failed to save profile');
    }
    const json = await res.json();
    const p = json.data || {};
    const uId = String(p._id || p.id);
    const shortId = uId.length > 8 ? `${uId.slice(0, 8)}...` : uId;
    const name = p.name || p.fullName || (p.email ? p.email.split('@')[0] : 'Player');

    return {
      id: shortId,
      userId: uId,
      fullName: name,
      email: p.email || '',
      phone: p.phone || '',
      city: p.city || '',
      state: p.state || '',
      country: p.country || '',
      bio: p.bio || '',
      sports: Array.isArray(p.sports) ? p.sports : ['Badminton'],
      medicalDetails: p.medicalDetails || {},
      emergencyContact: p.emergencyContact || {},
      role: p.systemRole || 'PLAYER',
      stats: { winRatio: 0, matchesPlayed: 0, matchesWon: 0, tournamentsWon: 0, tournamentsEntered: 0, medals: { gold: 0, silver: 0, bronze: 0 } }
    };
  }

  static async saveProfile(userId: string, updatedData: any) {
    return new PlayerService().saveProfile(userId, updatedData);
  }

  async discoverTournaments(...args: any[]) {
    try {
      let items: any[] = [];
      if (typeof window === 'undefined') {
        const { connectDB } = await import('@/lib/mongodb');
        const { TournamentModel } = await import('@/modules/tournaments/models/Tournament');
        await connectDB();
        items = await TournamentModel.find({}).sort({ createdAt: -1 }).lean();
      } else {
        const res = await fetch('/api/tournaments?limit=100');
        if (res.ok) {
          const json = await res.json();
          items = json.data || [];
        }
      }

      return items.map((t: any) => {
        const name = t.name || t.title || 'Tournament';
        let sportsList: string[] = [];
        if (Array.isArray(t.sports) && t.sports.length > 0) {
          sportsList = t.sports;
        } else if (t.sportName) {
          sportsList = [t.sportName];
        } else {
          // Detect sport from tournament name or default to Badminton
          const knownSports = ['Badminton', 'Tennis', 'Pickleball', 'Table Tennis'];
          const matched = knownSports.filter((s) => name.toLowerCase().includes(s.toLowerCase()));
          sportsList = matched.length > 0 ? matched : ['Badminton'];
        }

        const primarySport = sportsList[0] || 'Badminton';

        return {
          id: String(t._id || t.id),
          title: name,
          name: name,
          slug: t.slug || name.toLowerCase().replace(/\s+/g, '-'),
          sports: sportsList,
          sport: primarySport,
          sportId: t.sportId ? String(t.sportId) : '',
          organizer: t.organizerName || 'DAFT Arena',
          organizerName: t.organizerName || 'DAFT Arena',
          status: t.status || 'RegistrationOpen',
          startDate: t.tournamentDates?.startDate ? new Date(t.tournamentDates.startDate).toISOString() : new Date().toISOString(),
          endDate: t.tournamentDates?.endDate ? new Date(t.tournamentDates.endDate).toISOString() : new Date().toISOString(),
          registrationDeadline: t.registrationWindow?.endDate ? new Date(t.registrationWindow.endDate).toISOString() : new Date().toISOString(),
          venue: t.venueName || 'Main Sports Complex',
          venueName: t.venueName || 'Main Sports Complex',
          city: t.city || 'Pollachi',
          location: t.city || 'Pollachi',
          bannerUrl: t.bannerUrl || '',
          logoUrl: t.logoUrl || '',
          entryFee: t.entryFee ?? t.paymentConfiguration?.entryFee ?? 0,
          baseEntryFee: t.entryFee ?? t.paymentConfiguration?.entryFee ?? 0,
          isFreeEntry: t.isFreeEntry ?? t.paymentConfiguration?.isFreeEntry ?? false,
          currency: t.currency || 'INR',
          capacity: t.capacity || 64,
          registeredCount: t.registeredCount || 0,
        };
      });
    } catch (err) {
      console.error('discoverTournaments error:', err);
      return [];
    }
  }

  static async discoverTournaments(...args: any[]) {
    return new PlayerService().discoverTournaments(...args);
  }

  async getRankings(...args: any[]) {
    return [
      {
        categoryId: 'cat_mens_singles',
        categoryName: "Men's Singles Open",
        points: 2450,
        districtRank: 4,
        stateRank: 12,
        nationalRank: 156,
        history: [
          { month: 'Jan', points: 1200 },
          { month: 'Feb', points: 1450 },
          { month: 'Mar', points: 1450 },
          { month: 'Apr', points: 1800 },
          { month: 'May', points: 2100 },
          { month: 'Jun', points: 2450 },
        ],
      },
      {
        categoryId: 'cat_mens_doubles',
        categoryName: "Men's Doubles Open",
        points: 1800,
        districtRank: 8,
        stateRank: 24,
        nationalRank: 312,
        history: [
          { month: 'Jan', points: 800 },
          { month: 'Feb', points: 950 },
          { month: 'Mar', points: 1100 },
          { month: 'Apr', points: 1400 },
          { month: 'May', points: 1650 },
          { month: 'Jun', points: 1800 },
        ],
      },
      {
        categoryId: 'cat_mixed_doubles',
        categoryName: "Mixed Doubles",
        points: 950,
        districtRank: 15,
        stateRank: 42,
        nationalRank: null,
        history: [
          { month: 'Jan', points: 200 },
          { month: 'Feb', points: 400 },
          { month: 'Mar', points: 400 },
          { month: 'Apr', points: 650 },
          { month: 'May', points: 800 },
          { month: 'Jun', points: 950 },
        ],
      }
    ];
  }
  static async getRankings(...args: any[]) { return new PlayerService().getRankings(...args); }
  async getTimeline(...args: any[]) { return [] as any; }
  static async getTimeline(...args: any[]) { return [] as any; }
  async getTournamentDetail(id: string) {
    try {
      let t: any = null;
      let events: any[] = [];
      if (typeof window === 'undefined') {
        const { connectDB } = await import('@/lib/mongodb');
        const { TournamentModel } = await import('@/modules/tournaments/models/Tournament');
        const { TournamentEventModel } = await import('@/modules/tournaments/models/Event');
        await connectDB();
        const { isValidObjectId } = await import('mongoose');
        if (id && isValidObjectId(id)) {
          t = await TournamentModel.findById(id).lean();
        }
        if (!t && id) {
          t = await TournamentModel.findOne({ slug: id }).lean();
        }
        if (!t) {
          t = await TournamentModel.findOne({}).lean();
        }
        if (t) {
          // Use raw ObjectId — stored tournamentId is ObjectId, not string
          events = await TournamentEventModel.find({ tournamentId: t._id }).lean();
        }
      } else {
        const res = await fetch(`/api/tournaments/${id}`);
        if (res.ok) {
          const json = await res.json();
          t = json.data;
        }
        // Fetch events separately from the events API
        if (t) {
          const tournId = String(t._id || t.id);
          const evRes = await fetch(`/api/tournaments/${tournId}/events`);
          if (evRes.ok) {
            const evJson = await evRes.json();
            events = evJson.data || [];
          }
        }
      }

      if (!t) return null;

      const name = t.name || t.title || 'Tournament';
      let sportsList: string[] = [];
      if (Array.isArray(t.sports) && t.sports.length > 0) {
        sportsList = t.sports;
      } else if (t.sportName) {
        sportsList = [t.sportName];
      } else {
        const knownSports = ['Badminton', 'Tennis', 'Pickleball', 'Table Tennis'];
        const matched = knownSports.filter((s) => name.toLowerCase().includes(s.toLowerCase()));
        sportsList = matched.length > 0 ? matched : ['Badminton'];
      }

      const primarySport = sportsList[0] || 'Badminton';
      const baseEntryFee = t.entryFee ?? t.paymentConfiguration?.entryFee ?? 0;

      const defaultTournamentCapacity = t.capacity || 64;
      const defaultEventLimit = events.length === 1 ? defaultTournamentCapacity : 32;

      const mappedEvents = events.map((ev: any) => ({
        id: String(ev._id || ev.id),
        name: ev.name || 'Event',
        category: ev.ageCategory || ev.gender || 'Open',
        entryFee: ev.entryFee ?? baseEntryFee,
        maxParticipants: ev.maxEntries || ev.maxParticipants || defaultEventLimit,
        currentParticipants: ev.registeredCount || 0,
      }));

      const calculatedCapacity = mappedEvents.reduce((acc: number, ev: any) => acc + (ev.maxParticipants || 0), 0);
      const finalCapacity = t.capacity || (calculatedCapacity > 0 ? calculatedCapacity : 64);

      return {
        id: String(t._id || t.id),
        title: name,
        name: name,
        description: t.description || 'Join our upcoming tournament competition.',
        slug: t.slug || name.toLowerCase().replace(/\s+/g, '-'),
        sports: sportsList,
        sport: primarySport,
        sportId: t.sportId ? String(t.sportId) : '',
        organizer: t.organizerName || 'DAFT Arena',
        organizerName: t.organizerName || 'DAFT Arena',
        status: t.status || 'RegistrationOpen',
        startDate: t.tournamentDates?.startDate ? new Date(t.tournamentDates.startDate).toISOString() : new Date().toISOString(),
        endDate: t.tournamentDates?.endDate ? new Date(t.tournamentDates.endDate).toISOString() : new Date().toISOString(),
        registrationDeadline: t.registrationWindow?.endDate ? new Date(t.registrationWindow.endDate).toISOString() : new Date().toISOString(),
        venue: t.venueName || 'Main Sports Complex',
        venueName: t.venueName || 'Main Sports Complex',
        city: t.city || 'Pollachi',
        location: t.city || 'Pollachi',
        bannerUrl: t.bannerUrl || '',
        logoUrl: t.logoUrl || '',
        entryFee: baseEntryFee,
        baseEntryFee,
        isFreeEntry: t.isFreeEntry ?? t.paymentConfiguration?.isFreeEntry ?? false,
        currency: t.currency || 'INR',
        capacity: finalCapacity,
        registeredCount: t.registeredCount || 0,
        paymentConfiguration: t.paymentConfiguration || {},
        events: mappedEvents,
        documents: t.documents || [],
      };
    } catch (err) {
      console.error('getTournamentDetail error:', err);
      return null;
    }
  }

  static async getTournamentDetail(id: string) {
    return new PlayerService().getTournamentDetail(id);
  }
  async submitRegistration(tournamentId: string, eventIds: string[], partnerId?: string, docUrl?: string, paymentProofUrl?: string, paymentUtr?: string) {
    try {
      const res = await fetch(`/api/tournaments/${tournamentId}/registrations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ eventIds, partnerId, docUrl, paymentProofUrl, paymentUtr })
      });
      const data = await res.json();
      if (data.success) {
        let id = 'reg_default';
        if (data.registrations && data.registrations.length > 0) {
          id = data.registrations[0]._id || data.registrations[0].id;
        } else if (data.data && (data.data._id || data.data.id)) {
          id = data.data._id || data.data.id;
        }
        return { id, registrations: data.registrations || [data.data] };
      }
    } catch (err) {
      console.warn('[PlayerService] submitRegistration API failed, using dev mock:', err);
    }
    // Dev fallback
    const mockId = `mock_reg_${Date.now()}`;
    return { id: mockId, registrations: [{ _id: mockId, tournamentId, eventIds, status: 'Pending' }] };
  }
  static async submitRegistration(tournamentId: string, eventIds: string[], partnerId?: string, docUrl?: string, paymentProofUrl?: string, paymentUtr?: string) {
    return new PlayerService().submitRegistration(tournamentId, eventIds, partnerId, docUrl, paymentProofUrl, paymentUtr);
  }
  async processPayment(tournamentId: string, amount: number, utr: string, screenshotUrl: string) {
    try {
      const res = await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // send cookies for auth
        body: JSON.stringify({ tournamentId, amount, utr: utr || `DEV_${Date.now()}`, screenshotUrl })
      });
      const data = await res.json();
      if (data.success) {
        return { invoice: data.payment, transaction: data.payment };
      }
    } catch (err) {
      console.warn('[PlayerService] processPayment API failed, using dev mock:', err);
    }
    // Dev fallback mock
    const mockPayment = {
      _id: `mock_pay_${Date.now()}`,
      id: `mock_pay_${Date.now()}`,
      tournamentId,
      amount,
      utr: utr || `DEV_${Date.now()}`,
      screenshotUrl,
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    return { invoice: mockPayment, transaction: mockPayment };
  }
  static async processPayment(tournamentId: string, amount: number, utr: string, screenshotUrl: string) {
    return new PlayerService().processPayment(tournamentId, amount, utr, screenshotUrl);
  }
  async getTransactions(...args: any[]) {
    return [
      {
        transaction: {
          id: 'txn_101',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 1500,
          currency: 'INR',
          status: 'COMPLETED',
          description: 'Registration: Badminton Pollachi Test Match',
          type: 'REGISTRATION',
          paymentMethod: 'UPI',
          refundStatus: 'NOT_APPLICABLE'
        },
        invoice: {
          id: 'inv_101',
          status: 'PAID',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          items: [{ description: 'Badminton Pollachi Test Match - Men\'s Singles Open', amount: 1500 }],
          baseAmount: 1500,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: 1500,
          currency: 'INR',
        }
      },
      {
        transaction: {
          id: 'txn_102',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          amount: 500,
          currency: 'INR',
          status: 'COMPLETED',
          description: 'Registration: Men\'s Singles Open',
          type: 'REGISTRATION',
          paymentMethod: 'Credit Card',
          refundStatus: 'NOT_APPLICABLE'
        },
        invoice: {
          id: 'inv_102',
          status: 'PAID',
          createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
          items: [{ description: 'Summer Smash 2026 - Men\'s Doubles', amount: 500 }],
          baseAmount: 500,
          discountAmount: 0,
          taxAmount: 0,
          totalAmount: 500,
          currency: 'INR',
        }
      }
    ];
  }
  static async getTransactions(...args: any[]) { return new PlayerService().getTransactions(...args); }

  async getMyTournaments(...args: any[]) {
    return [
      {
        id: 't_mock_1',
        title: 'Badminton Pollachi Test Match',
        sport: 'Badminton',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'RegistrationClosed',
        venueName: 'Pollachi Stadium',
        events: [{ name: "Men's Singles Open", status: 'Registered' }],
      },
      {
        id: 't_mock_2',
        title: 'Summer Smash 2026',
        sport: 'Tennis',
        startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
        venueName: 'Main Sports Complex',
        events: [{ name: "Men's Doubles", status: 'Winner' }],
      }
    ];
  }
  static async getMyTournaments(...args: any[]) { return new PlayerService().getMyTournaments(...args); }

  async getWithdrawals(...args: any[]) { return [] as any; }
  static async getWithdrawals(...args: any[]) { return [] as any; }
  async submitWithdrawal(...args: any[]) { return {} as any; }
  static async submitWithdrawal(...args: any[]) { return {} as any; }
  async searchAllPlayers(...args: any[]) { return [] as any; }
  static async searchAllPlayers(...args: any[]) { return [] as any; }
  async getCertificates(...args: any[]) { return [] as any; }
  static async getCertificates(...args: any[]) { return [] as any; }

  async getMyMatches(...args: any[]) {
    return [
      {
        id: 'm_mock_1',
        tournamentName: 'Badminton Pollachi Test Match',
        eventName: "Men's Singles Open",
        round: 'Round of 16',
        scheduledTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Scheduled',
        court: 'Court 1',
        opponent: { name: 'Rahul Kumar', seed: 4 }
      },
      {
        id: 'm_mock_2',
        tournamentName: 'Summer Smash 2026',
        eventName: "Men's Doubles",
        round: 'Finals',
        scheduledTime: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'Completed',
        court: 'Center Court',
        opponent: { name: 'Team Alpha', seed: 2 },
        score: '21-19, 21-15',
        result: 'Win'
      }
    ];
  }
  static async getMyMatches(...args: any[]) { return new PlayerService().getMyMatches(...args); }

  async getBracketData(...args: any[]) { return {} as any; }
  static async getBracketData(...args: any[]) { return {} as any; }
  async getScheduleTimeline(...args: any[]) { return [] as any; }
  static async getScheduleTimeline(...args: any[]) { return [] as any; }
  async getQRPass(...args: any[]) { return {} as any; }
  static async getQRPass(...args: any[]) { return {} as any; }
  async getSubmittedFeedback(...args: any[]) { return [] as any; }
  static async getSubmittedFeedback(...args: any[]) { return [] as any; }
  async submitFeedback(...args: any[]) { return {} as any; }
  static async submitFeedback(...args: any[]) { return {} as any; }
  async searchPartners(...args: any[]) { return [] as any; }
  static async searchPartners(...args: any[]) { return [] as any; }

  async getNotifications(...args: any[]) {
    return [
      {
        id: 'notif_1',
        title: 'Match Scheduled',
        message: 'Your Round of 16 match is scheduled for tomorrow at 10:00 AM on Court 1.',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false,
        type: 'MATCH_UPDATE',
      },
      {
        id: 'notif_2',
        title: 'Registration Confirmed',
        message: 'Your registration for Badminton Pollachi Test Match is confirmed.',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        read: true,
        type: 'SYSTEM',
      }
    ];
  }
  static async getNotifications(...args: any[]) { return new PlayerService().getNotifications(...args); }
}

export const playerService = new PlayerService();
