import {
  PlayerProfile,
  PlayerRanking,
  PlayerNotification,
  PlayerTournament,
  PlayerMatch,
  DiscoverTournament,
  TournamentDetail,
  RegistrationReview,
  Invoice,
  Transaction,
  QRPass,
  BracketData,
  TimelineCourtSchedule,
  PlayerCertificate,
  TimelineEvent,
  PlayerFeedback,
  WithdrawalRequest,
  SessionDevice,
} from '../types';

/**
 * PlayerService
 *
 * Single source of truth for all player-domain data.
 * Currently uses strictly typed mock implementations.
 * Methods can be swapped with `fetchApi` calls without changing any UI.
 *
 * Future Backend Integration:
 *   - GET /api/players/:userId/profile
 *   - GET /api/players/:userId/rankings
 *   - GET /api/players/:userId/notifications
 *   - GET /api/players/:userId/tournaments
 *   - GET /api/players/:userId/matches
 *   - GET /api/tournaments?status=RegistrationOpen (Discover)
 *   - GET /api/tournaments/:id (Tournament Detail)
 */
export class PlayerService {
  // ─────────────────────────────────────────────────────────────────────
  // Profile
  // ─────────────────────────────────────────────────────────────────────

  static async getProfile(userId: string): Promise<PlayerProfile> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/profile
    void userId;
    return {
      id: 'plr_12345',
      userId,
      fullName: 'Alex Johnson',
      bio: 'Competitive tennis and pickleball player based in Seattle. Ranked top 10 in the Pacific Northwest district.',
      city: 'Seattle',
      state: 'WA',
      country: 'USA',
      email: 'alex.johnson@example.com',
      phone: '+1 (206) 555-0147',
      stats: {
        matchesPlayed: 42,
        matchesWon: 28,
        winRatio: 66.67,
        tournamentsEntered: 12,
        tournamentsWon: 3,
      },
      medals: {
        gold: 3,
        silver: 4,
        bronze: 1,
      },
      medicalDetails: {
        bloodGroup: 'O+',
        allergies: 'Peanuts',
        conditions: 'Asthma (Mild)',
        medications: 'Inhaler (as needed)',
      },
      emergencyContact: {
        name: 'Jane Johnson',
        relation: 'Spouse',
        phone: '+1 (206) 555-0199',
      },
      clubName: 'Seattle Tennis Club',
      coachName: 'Coach Robert Smith',
      achievements: [
        { title: 'Pacific NW Singles Champion', date: '2025-06-15', description: 'Won the men\'s singles open draw.' },
        { title: 'Cascade Doubles Runner Up', date: '2024-09-10', description: 'Reached the final of the doubles draw.' }
      ],
      documents: [
        { title: 'Identity Proof (Driver License)', type: 'Identity', url: '#', verified: true },
        { title: 'Medical Fitness Certificate', type: 'Medical', url: '#', verified: true }
      ],
      security: {
        twoFactorEnabled: true,
      }
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // Rankings
  // ─────────────────────────────────────────────────────────────────────

  static async getRankings(userId: string): Promise<PlayerRanking[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/rankings
    void userId;
    return [
      {
        categoryId: 'cat_mens_singles_open',
        categoryName: "Men's Singles – Open",
        points: 1250,
        districtRank: 4,
        stateRank: 12,
        nationalRank: 145,
        history: [
          { month: 'Mar', points: 900 },
          { month: 'Apr', points: 1050 },
          { month: 'May', points: 1100 },
          { month: 'Jun', points: 1200 },
          { month: 'Jul', points: 1250 },
        ],
      },
      {
        categoryId: 'cat_mens_doubles_open',
        categoryName: "Men's Doubles – Open",
        points: 870,
        districtRank: 7,
        stateRank: 24,
        nationalRank: null,
        history: [
          { month: 'Mar', points: 600 },
          { month: 'Apr', points: 720 },
          { month: 'May', points: 780 },
          { month: 'Jun', points: 830 },
          { month: 'Jul', points: 870 },
        ],
      },
      {
        categoryId: 'cat_pickleball_mixed',
        categoryName: 'Pickleball – Mixed Doubles',
        points: 540,
        districtRank: 11,
        stateRank: null,
        nationalRank: null,
        history: [
          { month: 'May', points: 200 },
          { month: 'Jun', points: 380 },
          { month: 'Jul', points: 540 },
        ],
      },
    ];
  }

  // ─────────────────────────────────────────────────────────────────────
  // Notifications
  // ─────────────────────────────────────────────────────────────────────

  static async getNotifications(userId: string): Promise<PlayerNotification[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/notifications
    void userId;
    const now = Date.now();
    return [
      {
        id: 'notif_1',
        type: 'MATCH',
        title: 'Match Schedule Updated',
        message: 'Your match against Marcus Chen has been moved to Court 4 at 2:30 PM. Please arrive 15 minutes early.',
        isRead: false,
        createdAt: new Date(now - 1000 * 60 * 30).toISOString(), // 30 min ago
      },
      {
        id: 'notif_2',
        type: 'TOURNAMENT',
        title: 'Registration Confirmed',
        message: 'You have successfully registered for the Summer Open 2026. Your player ID is #PLR-4821.',
        isRead: false,
        createdAt: new Date(now - 1000 * 60 * 60 * 3).toISOString(), // 3 h ago
      },
      {
        id: 'notif_3',
        type: 'PAYMENT',
        title: 'Payment Received',
        message: 'Your entry fee of $45.00 for Summer Open 2026 has been processed successfully.',
        isRead: true,
        createdAt: new Date(now - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      },
      {
        id: 'notif_4',
        type: 'TOURNAMENT',
        title: 'West Coast Championships – Registration Opens Tomorrow',
        message: 'Registration for the West Coast Championships opens on Aug 1st. Don\'t miss your spot!',
        isRead: true,
        createdAt: new Date(now - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      },
      {
        id: 'notif_5',
        type: 'SYSTEM',
        title: 'Profile Incomplete',
        message: 'Please complete your player profile to be eligible for ranked tournaments.',
        isRead: true,
        createdAt: new Date(now - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      },
    ];
  }

  // ─────────────────────────────────────────────────────────────────────
  // My Tournaments
  // ─────────────────────────────────────────────────────────────────────

  static async getMyTournaments(userId: string): Promise<PlayerTournament[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/tournaments
    void userId;
    const now = Date.now();
    return [
      {
        id: 'tour_summer_open_2026',
        title: 'Summer Open 2026',
        startDate: new Date(now + 86400000 * 12).toISOString(),
        endDate: new Date(now + 86400000 * 17).toISOString(),
        venueName: 'Downtown Arena',
        location: 'Seattle, WA',
        status: 'REGISTERED',
        sport: 'Tennis',
      },
      {
        id: 'tour_pacific_classic_2026',
        title: 'Pacific Classic 2026',
        startDate: new Date(now + 86400000 * 45).toISOString(),
        endDate: new Date(now + 86400000 * 48).toISOString(),
        venueName: 'Westside Sports Center',
        location: 'Portland, OR',
        status: 'PENDING_PAYMENT',
        sport: 'Pickleball',
      },
      {
        id: 'tour_spring_classic_2026',
        title: 'Spring Classic 2026',
        startDate: new Date(now - 86400000 * 30).toISOString(),
        endDate: new Date(now - 86400000 * 28).toISOString(),
        venueName: 'Northside Club',
        location: 'Portland, OR',
        status: 'COMPLETED',
        sport: 'Tennis',
      },
      {
        id: 'tour_winter_cup_2025',
        title: 'Winter Cup 2025',
        startDate: new Date(now - 86400000 * 90).toISOString(),
        endDate: new Date(now - 86400000 * 87).toISOString(),
        venueName: 'Central Club',
        location: 'Bellevue, WA',
        status: 'COMPLETED',
        sport: 'Badminton',
      },
    ];
  }

  // ─────────────────────────────────────────────────────────────────────
  // My Matches
  // ─────────────────────────────────────────────────────────────────────

  static async getMyMatches(userId: string): Promise<PlayerMatch[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/matches
    void userId;
    const now = Date.now();
    return [
      {
        id: 'match_1',
        tournamentId: 'tour_summer_open_2026',
        tournamentName: 'Summer Open 2026',
        eventId: 'evt_mens_singles',
        eventName: "Men's Singles",
        opponentName: 'Marcus Chen',
        scheduledTime: new Date(now + 86400000 * 5 + 1000 * 60 * 60 * 14).toISOString(), // 5 days, 2pm
        venueName: 'Downtown Arena',
        playingAreaName: 'Court 4',
        roundName: 'Round of 32',
        status: 'UPCOMING',
      },
      {
        id: 'match_2',
        tournamentId: 'tour_summer_open_2026',
        tournamentName: 'Summer Open 2026',
        eventId: 'evt_mens_doubles',
        eventName: "Men's Doubles",
        opponentName: 'Ryan & James Park',
        scheduledTime: new Date(now + 86400000 * 6 + 1000 * 60 * 60 * 10).toISOString(),
        venueName: 'Downtown Arena',
        playingAreaName: 'Court 1',
        roundName: 'Round of 16',
        status: 'UPCOMING',
      },
      {
        id: 'match_3',
        tournamentId: 'tour_spring_classic_2026',
        tournamentName: 'Spring Classic 2026',
        eventId: 'evt_mens_singles_sc',
        eventName: "Men's Singles",
        opponentName: 'David Kim',
        scheduledTime: new Date(now - 86400000 * 28).toISOString(),
        venueName: 'Northside Club',
        playingAreaName: 'Court 2',
        roundName: 'Quarterfinal',
        status: 'COMPLETED',
        score: '6-4, 7-5',
        result: 'WIN',
      },
      {
        id: 'match_4',
        tournamentId: 'tour_spring_classic_2026',
        tournamentName: 'Spring Classic 2026',
        eventId: 'evt_mens_singles_sc',
        eventName: "Men's Singles",
        opponentName: 'Jason Wu',
        scheduledTime: new Date(now - 86400000 * 29).toISOString(),
        venueName: 'Northside Club',
        playingAreaName: 'Court 3',
        roundName: 'Semifinal',
        status: 'COMPLETED',
        score: '3-6, 4-6',
        result: 'LOSS',
      },
    ];
  }

  // ─────────────────────────────────────────────────────────────────────
  // Discover Tournaments
  // ─────────────────────────────────────────────────────────────────────

  static async discoverTournaments(
    _params?: { query?: string; sport?: string; location?: string }
  ): Promise<DiscoverTournament[]> {
    // MOCK IMPLEMENTATION — future: GET /api/tournaments?status=RegistrationOpen&visibility=Public
    const now = Date.now();
    return [
      {
        id: 'tour_summer_open_2026',
        title: 'Summer Open 2026',
        startDate: new Date(now + 86400000 * 21).toISOString(),
        endDate: new Date(now + 86400000 * 26).toISOString(),
        registrationDeadline: new Date(now + 86400000 * 14).toISOString(),
        location: 'Seattle, WA',
        venueName: 'Downtown Arena',
        sports: ['Tennis', 'Pickleball'],
        prizePool: '$10,000',
        entryFee: 45,
        currency: 'USD',
        capacity: 256,
        registeredCount: 187,
        status: 'REGISTRATION_OPEN',
        organizerName: 'PNTA',
        tags: ['Featured', 'Multi-Sport'],
      },
      {
        id: 'tour_west_coast_championships',
        title: 'West Coast Championships',
        startDate: new Date(now + 86400000 * 45).toISOString(),
        endDate: new Date(now + 86400000 * 50).toISOString(),
        registrationDeadline: new Date(now + 86400000 * 35).toISOString(),
        location: 'San Francisco, CA',
        venueName: 'Bay Area Sports Complex',
        sports: ['Badminton', 'Table Tennis'],
        entryFee: 35,
        currency: 'USD',
        capacity: 512,
        registeredCount: 210,
        status: 'REGISTRATION_OPEN',
        organizerName: 'WCA Federation',
        tags: ['Regional'],
      },
      {
        id: 'tour_city_pro_qualifier',
        title: 'City Pro League Qualifier',
        startDate: new Date(now + 86400000 * 60).toISOString(),
        endDate: new Date(now + 86400000 * 63).toISOString(),
        registrationDeadline: new Date(now + 86400000 * 50).toISOString(),
        location: 'Portland, OR',
        venueName: 'Central Club',
        sports: ['Tennis'],
        prizePool: '$5,000',
        entryFee: 60,
        currency: 'USD',
        capacity: 128,
        registeredCount: 74,
        status: 'REGISTRATION_OPEN',
        organizerName: 'City Pro League',
        tags: ['Qualifier', 'Pro'],
      },
      {
        id: 'tour_pacific_open_2026',
        title: 'Pacific Open 2026',
        startDate: new Date(now + 86400000 * 90).toISOString(),
        endDate: new Date(now + 86400000 * 95).toISOString(),
        registrationDeadline: new Date(now + 86400000 * 75).toISOString(),
        location: 'Los Angeles, CA',
        venueName: 'LA Sports Arena',
        sports: ['Tennis', 'Badminton', 'Squash'],
        prizePool: '$25,000',
        entryFee: 75,
        currency: 'USD',
        capacity: 400,
        registeredCount: 95,
        status: 'UPCOMING',
        organizerName: 'Pacific Sports Council',
        tags: ['Featured', 'Multi-Sport', 'International'],
      },
      {
        id: 'tour_nw_doubles_classic',
        title: 'NW Doubles Classic',
        startDate: new Date(now + 86400000 * 30).toISOString(),
        endDate: new Date(now + 86400000 * 32).toISOString(),
        registrationDeadline: new Date(now + 86400000 * 20).toISOString(),
        location: 'Bellevue, WA',
        venueName: 'Eastside Racquet Club',
        sports: ['Tennis', 'Pickleball'],
        entryFee: 50,
        currency: 'USD',
        capacity: 64,
        registeredCount: 58,
        status: 'REGISTRATION_OPEN',
        organizerName: 'NW Sports',
        tags: ['Doubles Only'],
      },
      {
        id: 'tour_emerald_city_classic',
        title: 'Emerald City Classic',
        startDate: new Date(now + 86400000 * 15).toISOString(),
        endDate: new Date(now + 86400000 * 18).toISOString(),
        registrationDeadline: new Date(now + 86400000 * 7).toISOString(),
        location: 'Seattle, WA',
        venueName: 'Seattle Tennis Club',
        sports: ['Tennis'],
        prizePool: '$3,000',
        entryFee: 40,
        currency: 'USD',
        capacity: 96,
        registeredCount: 89,
        status: 'REGISTRATION_OPEN',
        organizerName: 'STC',
        tags: ['Local'],
      },
    ];
  }

  // ─────────────────────────────────────────────────────────────────────
  // Tournament Detail
  // ─────────────────────────────────────────────────────────────────────

  static async getTournamentDetail(id: string): Promise<TournamentDetail | null> {
    // MOCK IMPLEMENTATION — future: GET /api/tournaments/:id (public endpoint)
    const tournaments = await PlayerService.discoverTournaments();
    const base = tournaments.find((t) => t.id === id);
    if (!base) return null;

    return {
      ...base,
      organizerName: base.organizerName ?? 'DAFT Arena',
      description:
        `${base.title} is one of the premier events on the DAFT Arena calendar. ` +
        `Open to players of all skill levels, this tournament guarantees a minimum of two matches per event entered. ` +
        `Early registration is strongly recommended as draws fill up quickly. ` +
        `All matches are officiated by certified referees.`,
      baseEntryFee: base.entryFee ?? 0,
      currency: base.currency ?? 'USD',
      venueAddress: `${base.venueName}, ${base.location}`,
      events: [
        {
          id: `${id}_ms`,
          name: "Men's Singles – Open",
          category: 'Open',
          entryFee: base.entryFee ?? 0,
          maxParticipants: 64,
          currentParticipants: 38,
        },
        {
          id: `${id}_ws`,
          name: "Women's Singles – Open",
          category: 'Open',
          entryFee: base.entryFee ?? 0,
          maxParticipants: 64,
          currentParticipants: 29,
        },
        {
          id: `${id}_md`,
          name: "Men's Doubles – Open",
          category: 'Open',
          entryFee: Math.round((base.entryFee ?? 0) * 1.5),
          maxParticipants: 32,
          currentParticipants: 14,
        },
        {
          id: `${id}_xd`,
          name: 'Mixed Doubles – Open',
          category: 'Open',
          entryFee: Math.round((base.entryFee ?? 0) * 1.5),
          maxParticipants: 32,
          currentParticipants: 18,
        },
      ],
      documents: [
        { title: 'Tournament Prospectus', url: '#', type: 'Prospectus' },
        { title: 'Rulebook 2026', url: '#', type: 'Rulebook' },
      ],
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // Phase 8 Ecosystem Additions
  // ─────────────────────────────────────────────────────────────────────

  static async searchPartners(query: string): Promise<{ id: string; fullName: string; city: string }[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/search?role=player&query=:query
    const partners = [
      { id: 'plr_partner_1', fullName: 'John Doe', city: 'Seattle' },
      { id: 'plr_partner_2', fullName: 'Jane Smith', city: 'Bellevue' },
      { id: 'plr_partner_3', fullName: 'Michael Chang', city: 'Tacoma' },
      { id: 'plr_partner_4', fullName: 'Emily Davis', city: 'Redmond' },
      { id: 'plr_partner_5', fullName: 'David Lee', city: 'Seattle' },
    ];
    if (!query) return partners;
    const q = query.toLowerCase();
    return partners.filter(p => p.fullName.toLowerCase().includes(q) || p.city.toLowerCase().includes(q));
  }

  static async submitRegistration(
    tournamentId: string,
    selectedEvents: string[],
    partnerId?: string,
    documentUrl?: string
  ): Promise<RegistrationReview> {
    // MOCK IMPLEMENTATION — future: POST /api/tournaments/:id/registrations
    const tournaments = await PlayerService.discoverTournaments();
    const base = tournaments.find((t) => t.id === tournamentId);
    
    let partnerName = undefined;
    if (partnerId) {
      const partners = await PlayerService.searchPartners('');
      partnerName = partners.find(p => p.id === partnerId)?.fullName;
    }

    const baseFee = base?.entryFee ?? 40;
    const totalFee = selectedEvents.length * baseFee;

    return {
      id: `reg_${Math.random().toString(36).substr(2, 9)}`,
      tournamentId,
      tournamentTitle: base?.title ?? 'Tournament Entry',
      selectedEvents,
      partnerId,
      partnerName,
      documentUrl,
      totalFee,
      status: 'PENDING_PAYMENT',
      createdAt: new Date().toISOString()
    };
  }

  static async processPayment(
    registrationId: string,
    baseAmount: number,
    discountAmount: number,
    taxAmount: number,
    totalAmount: number,
    currency: string,
    couponCode?: string,
    method: 'CARD' | 'UPI' | 'NETBANKING' = 'CARD'
  ): Promise<{ invoice: Invoice; transaction: Transaction }> {
    // MOCK IMPLEMENTATION — future: POST /api/payments/checkout
    const invoiceId = `inv_${Math.random().toString(36).substr(2, 9)}`;
    const txId = `tx_${Math.random().toString(36).substr(2, 9)}`;

    const invoice: Invoice = {
      id: invoiceId,
      registrationId,
      baseAmount,
      discountAmount,
      taxAmount,
      totalAmount,
      currency,
      couponCode,
      status: 'PAID',
      createdAt: new Date().toISOString()
    };

    const transaction: Transaction = {
      id: txId,
      invoiceId,
      amount: totalAmount,
      status: 'SUCCESS',
      method,
      referenceId: `REF_${Math.floor(100000000 + Math.random() * 900000000)}`,
      refundStatus: 'NOT_APPLICABLE',
      createdAt: new Date().toISOString()
    };

    return { invoice, transaction };
  }

  static async getTransactions(userId: string): Promise<{ invoice: Invoice; transaction: Transaction }[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/transactions
    void userId;
    return [
      {
        invoice: {
          id: 'inv_cascade_2026',
          registrationId: 'reg_cascade_2026',
          baseAmount: 60,
          discountAmount: 10,
          taxAmount: 4,
          totalAmount: 54,
          currency: 'USD',
          couponCode: 'EARLYBIRD',
          status: 'PAID',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        },
        transaction: {
          id: 'tx_cascade_2026',
          invoiceId: 'inv_cascade_2026',
          amount: 54,
          status: 'SUCCESS',
          method: 'CARD',
          referenceId: 'REF_981249015',
          refundStatus: 'NOT_APPLICABLE',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
        }
      },
      {
        invoice: {
          id: 'inv_emerald_city_2026',
          registrationId: 'reg_emerald_city_2026',
          baseAmount: 40,
          discountAmount: 0,
          taxAmount: 3,
          totalAmount: 43,
          currency: 'USD',
          status: 'PAID',
          createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
        },
        transaction: {
          id: 'tx_emerald_city_2026',
          invoiceId: 'inv_emerald_city_2026',
          amount: 43,
          status: 'SUCCESS',
          method: 'UPI',
          referenceId: 'REF_110948271',
          refundStatus: 'NOT_APPLICABLE',
          createdAt: new Date(Date.now() - 86400000 * 12).toISOString()
        }
      }
    ];
  }

  static async getQRPass(registrationId: string): Promise<QRPass> {
    // MOCK IMPLEMENTATION — future: GET /api/registrations/:registrationId/pass
    return {
      passId: `pass_${registrationId}`,
      registrationId,
      playerName: 'Alex Johnson',
      playerId: 'PLR_12345',
      tournamentTitle: 'Cascade Tennis Classic',
      venueName: 'Seattle Tennis Club',
      venueAddress: '922 11th Ave E, Seattle, WA 98102',
      events: ["Men's Singles – Open", "Men's Doubles – Open"],
      scheduleDates: 'August 10 – August 14, 2026',
      emergencyContact: {
        name: 'Jane Johnson',
        phone: '+1 (206) 555-0199'
      },
      qrCodeValue: `daft-pass://reg/${registrationId}`
    };
  }

  static async getBracketData(eventId: string): Promise<BracketData> {
    // MOCK IMPLEMENTATION — future: GET /api/brackets?eventId=:eventId
    void eventId;
    return {
      bracketId: `brk_${eventId}`,
      type: 'SingleElimination',
      rounds: [
        {
          roundName: 'Quarterfinals',
          matches: [
            {
              id: 'm_q1',
              player1: { name: 'Alex Johnson (You)', id: 'plr_12345' },
              player2: { name: 'John Doe', id: 'plr_partner_1' },
              status: 'COMPLETED',
              scheduledTime: '10:00 AM',
              courtName: 'Court 1',
              nextMatchId: 'm_s1'
            },
            {
              id: 'm_q2',
              player1: { name: 'Jane Smith' },
              player2: { name: 'Michael Chang' },
              status: 'COMPLETED',
              scheduledTime: '11:30 AM',
              courtName: 'Court 2',
              nextMatchId: 'm_s1'
            },
            {
              id: 'm_q3',
              player1: { name: 'Emily Davis' },
              player2: { name: 'David Lee' },
              status: 'COMPLETED',
              scheduledTime: '01:00 PM',
              courtName: 'Court 1',
              nextMatchId: 'm_s2'
            },
            {
              id: 'm_q4',
              player1: { name: 'Sarah Connor' },
              player2: { name: 'Kyle Reese' },
              status: 'COMPLETED',
              scheduledTime: '02:30 PM',
              courtName: 'Court 3',
              nextMatchId: 'm_s2'
            }
          ]
        },
        {
          roundName: 'Semifinals',
          matches: [
            {
              id: 'm_s1',
              player1: { name: 'Alex Johnson (You)', id: 'plr_12345' },
              player2: { name: 'Jane Smith' },
              status: 'SCHEDULED',
              scheduledTime: 'Tomorrow 10:00 AM',
              courtName: 'Court 1',
              nextMatchId: 'm_f'
            },
            {
              id: 'm_s2',
              player1: { name: 'Emily Davis' },
              player2: { name: 'Sarah Connor' },
              status: 'SCHEDULED',
              scheduledTime: 'Tomorrow 11:30 AM',
              courtName: 'Court 2',
              nextMatchId: 'm_f'
            }
          ]
        },
        {
          roundName: 'Finals',
          matches: [
            {
              id: 'm_f',
              player1: { name: 'TBD' },
              player2: { name: 'TBD' },
              status: 'SCHEDULED',
              scheduledTime: 'Sunday 02:00 PM',
              courtName: 'Center Court'
            }
          ]
        }
      ]
    };
  }

  static async getScheduleTimeline(tournamentId: string): Promise<TimelineCourtSchedule[]> {
    // MOCK IMPLEMENTATION — future: GET /api/tournaments/:tournamentId/schedule-timeline
    const baseMatches = await PlayerService.getMyMatches('plr_12345');
    const playerMatch = baseMatches.find(m => m.tournamentId === tournamentId) ?? baseMatches[0];

    return [
      {
        courtName: 'Court 1 (Center)',
        slots: [
          { time: '09:00 AM', match: { ...playerMatch, id: 'slot_1', opponentName: 'John Doe', scheduledTime: '09:00 AM', roundName: 'Round of 16' } },
          { time: '10:30 AM' },
          { time: '12:00 PM', match: { ...playerMatch, id: 'slot_2', opponentName: 'Jane Smith', scheduledTime: '12:00 PM', roundName: 'Quarterfinals' }, conflict: true },
          { time: '01:30 PM' }
        ]
      },
      {
        courtName: 'Court 2',
        slots: [
          { time: '09:00 AM' },
          { time: '10:30 AM', match: { ...playerMatch, id: 'slot_3', opponentName: 'Michael Chang', scheduledTime: '10:30 AM', roundName: 'Consolation QF' } },
          { time: '12:00 PM' },
          { time: '01:30 PM' }
        ]
      },
      {
        courtName: 'Court 3',
        slots: [
          { time: '09:00 AM' },
          { time: '10:30 AM' },
          { time: '12:00 PM' },
          { time: '01:30 PM', match: { ...playerMatch, id: 'slot_4', opponentName: 'David Lee', scheduledTime: '01:30 PM', roundName: 'Consolation SF' } }
        ]
      }
    ];
  }

  static async saveProfile(userId: string, data: Partial<PlayerProfile>): Promise<PlayerProfile> {
    // MOCK IMPLEMENTATION — future: PATCH /api/players/:userId/profile
    const current = await PlayerService.getProfile(userId);
    return {
      ...current,
      ...data,
      medicalDetails: data.medicalDetails ? { ...current.medicalDetails, ...data.medicalDetails } as unknown : current.medicalDetails,
      emergencyContact: data.emergencyContact ? { ...current.emergencyContact, ...data.emergencyContact } as unknown : current.emergencyContact,
    };
  }

  // ─────────────────────────────────────────────────────────────────────
  // Phase 9 Completed Player Ecosystem Additions
  // ─────────────────────────────────────────────────────────────────────

  static async getCertificates(userId: string): Promise<PlayerCertificate[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/certificates
    void userId;
    return [
      {
        id: 'cert_1',
        type: 'WINNER',
        tournamentId: 'tour_spring_classic_2026',
        tournamentTitle: 'Spring Classic 2026',
        issueDate: '2026-05-18',
        recipientName: 'Alex Johnson',
        description: "Champion of Men's Singles – Open category.",
        medalType: 'gold'
      },
      {
        id: 'cert_2',
        type: 'RUNNER_UP',
        tournamentId: 'tour_winter_cup_2025',
        tournamentTitle: 'Winter Cup 2025',
        issueDate: '2025-11-20',
        recipientName: 'Alex Johnson',
        description: "Runner Up in Badminton Men's Doubles category.",
        medalType: 'silver'
      },
      {
        id: 'cert_3',
        type: 'PARTICIPATION',
        tournamentId: 'tour_summer_open_2026',
        tournamentTitle: 'Summer Open 2026',
        issueDate: '2026-07-20',
        recipientName: 'Alex Johnson',
        description: 'Successful participation in Tennis Singles category.',
        medalType: 'none'
      }
    ];
  }

  static async getTimeline(userId: string): Promise<TimelineEvent[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/timeline
    void userId;
    const now = new Date();
    return [
      {
        id: 't_1',
        type: 'REGISTRATION',
        title: 'Registered for Summer Open 2026',
        description: "Submitted category selections for Men's Singles & Men's Doubles.",
        timestamp: new Date(now.getTime() - 86400000 * 10).toISOString(),
        referenceId: 'reg_summer_open_2026'
      },
      {
        id: 't_2',
        type: 'PAYMENT',
        title: 'Payment Completed',
        description: 'Successfully paid tournament entry fees of $45.00.',
        timestamp: new Date(now.getTime() - 86400000 * 10 + 1000 * 60 * 10).toISOString(),
        referenceId: 'tx_summer_open_2026'
      },
      {
        id: 't_3',
        type: 'DRAW_RELEASED',
        title: 'Bracket Draw Released',
        description: 'The Men\'s Singles Open bracket has been officially published.',
        timestamp: new Date(now.getTime() - 86400000 * 5).toISOString(),
        referenceId: 'brk_summer_open_2026'
      },
      {
        id: 't_4',
        type: 'MATCH_SCHEDULED',
        title: 'Match Scheduled',
        description: 'Round of 32 scheduled against Marcus Chen at Court 4 (2:30 PM).',
        timestamp: new Date(now.getTime() - 86400000 * 4).toISOString(),
        referenceId: 'match_1'
      },
      {
        id: 't_5',
        type: 'MATCH_COMPLETED',
        title: 'Match Completed',
        description: 'Defeated David Kim (6-4, 7-5) in Spring Classic Quarterfinals.',
        timestamp: new Date(now.getTime() - 86400000 * 30).toISOString(),
        referenceId: 'match_3'
      },
      {
        id: 't_6',
        type: 'RANKING_UPDATED',
        title: 'National Ranking Updated',
        description: 'Moved up to Rank #145 in Men\'s Singles Open category.',
        timestamp: new Date(now.getTime() - 86400000 * 2).toISOString()
      },
      {
        id: 't_7',
        type: 'CERTIFICATE_ISSUED',
        title: 'Winner Certificate Issued',
        description: 'Accolade certificate generated for Cascade Tennis Classic.',
        timestamp: new Date(now.getTime() - 86400000 * 1).toISOString(),
        referenceId: 'cert_1'
      }
    ];
  }

  static async submitFeedback(
    userId: string,
    data: { tournamentId: string; tournamentTitle: string; ratings: { tournament: number; venue: number; officials: number }; type: 'FEEDBACK' | 'COMPLAINT' | 'SUGGESTION'; message: string }
  ): Promise<PlayerFeedback> {
    // MOCK IMPLEMENTATION — future: POST /api/players/:userId/feedback
    return {
      id: `fb_${Math.random().toString(36).substr(2, 9)}`,
      tournamentId: data.tournamentId,
      tournamentTitle: data.tournamentTitle,
      ratings: data.ratings,
      type: data.type,
      message: data.message,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString()
    };
  }

  static async getSubmittedFeedback(userId: string): Promise<PlayerFeedback[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/feedback
    void userId;
    return [
      {
        id: 'fb_1',
        tournamentId: 'tour_spring_classic_2026',
        tournamentTitle: 'Spring Classic 2026',
        ratings: { tournament: 5, venue: 4, officials: 5 },
        type: 'FEEDBACK',
        message: 'Excellent officiating and court schedules. The check-in wizard worked flawlessly.',
        status: 'REVIEWED',
        createdAt: '2026-05-20T10:00:00Z'
      },
      {
        id: 'fb_2',
        tournamentId: 'tour_winter_cup_2025',
        tournamentTitle: 'Winter Cup 2025',
        ratings: { tournament: 3, venue: 3, officials: 2 },
        type: 'COMPLAINT',
        message: 'Match schedule delayed by 2 hours on Day 2 due to referee conflict.',
        status: 'SUBMITTED',
        createdAt: '2025-11-25T14:30:00Z'
      }
    ];
  }

  static async submitWithdrawal(
    userId: string,
    data: { registrationId: string; tournamentTitle: string; reason: string; details?: string }
  ): Promise<WithdrawalRequest> {
    // MOCK IMPLEMENTATION — future: POST /api/players/:userId/withdrawals
    void userId;
    return {
      id: `wth_${Math.random().toString(36).substr(2, 9)}`,
      registrationId: data.registrationId,
      tournamentTitle: data.tournamentTitle,
      reason: data.reason,
      details: data.details,
      status: 'REQUESTED',
      requestedAt: new Date().toISOString()
    };
  }

  static async getWithdrawals(userId: string): Promise<WithdrawalRequest[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/withdrawals
    void userId;
    return [
      {
        id: 'wth_1',
        registrationId: 'reg_pacific_classic_2026',
        tournamentTitle: 'Pacific Classic 2026',
        reason: 'Injury / Medical reasons',
        details: 'Sprained wrist during training exercise.',
        status: 'REQUESTED',
        requestedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ];
  }

  static async searchAllPlayers(
    query?: string,
    filters?: { state?: string; club?: string; sport?: string }
  ): Promise<PlayerProfile[]> {
    // MOCK IMPLEMENTATION — future: GET /api/players
    const baseList: PlayerProfile[] = [
      {
        id: 'plr_12345',
        userId: 'u_1',
        fullName: 'Alex Johnson (You)',
        bio: 'Competitive tennis and pickleball player based in Seattle.',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        email: 'alex.johnson@example.com',
        phone: '+1 (206) 555-0147',
        stats: { matchesPlayed: 42, matchesWon: 28, winRatio: 66.67, tournamentsEntered: 12, tournamentsWon: 3 },
        medals: { gold: 3, silver: 4, bronze: 1 },
        clubName: 'Seattle Tennis Club',
        coachName: 'Coach Robert Smith',
        medicalDetails: { bloodGroup: 'O+' }
      },
      {
        id: 'plr_2',
        userId: 'u_2',
        fullName: 'Marcus Chen',
        bio: 'Avid badminton and tennis singles draft competitor.',
        city: 'San Francisco',
        state: 'CA',
        country: 'USA',
        email: 'marcus.chen@example.com',
        stats: { matchesPlayed: 56, matchesWon: 41, winRatio: 73.21, tournamentsEntered: 15, tournamentsWon: 5 },
        medals: { gold: 5, silver: 2, bronze: 3 },
        clubName: 'Bay Area Badminton Club',
        coachName: 'Coach Lee',
        medicalDetails: { bloodGroup: 'A+' }
      },
      {
        id: 'plr_3',
        userId: 'u_3',
        fullName: 'John Doe',
        bio: 'Tennis amateur and doubles partner specialist.',
        city: 'Seattle',
        state: 'WA',
        country: 'USA',
        stats: { matchesPlayed: 24, matchesWon: 14, winRatio: 58.33, tournamentsEntered: 8, tournamentsWon: 1 },
        medals: { gold: 1, silver: 1, bronze: 2 },
        clubName: 'Seattle Tennis Club'
      },
      {
        id: 'plr_4',
        userId: 'u_4',
        fullName: 'Jane Smith',
        bio: 'State-level singles tennis competitor.',
        city: 'Bellevue',
        state: 'WA',
        country: 'USA',
        stats: { matchesPlayed: 38, matchesWon: 22, winRatio: 57.89, tournamentsEntered: 10, tournamentsWon: 2 },
        medals: { gold: 2, silver: 3, bronze: 1 },
        clubName: 'Bellevue Tennis Club'
      }
    ];

    let filtered = baseList;
    if (query) {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => p.fullName.toLowerCase().includes(q) || p.bio?.toLowerCase().includes(q));
    }
    if (filters?.state) {
      filtered = filtered.filter(p => p.state === filters.state);
    }
    if (filters?.club) {
      filtered = filtered.filter(p => p.clubName === filters.club);
    }
    return filtered;
  }

  static async exportPlayerData(userId: string): Promise<string> {
    // MOCK IMPLEMENTATION — future: GET /api/players/:userId/export
    const profile = await PlayerService.getProfile(userId);
    const rankings = await PlayerService.getRankings(userId);
    const matches = await PlayerService.getMyMatches(userId);
    
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      profile,
      rankings,
      matches
    }, null, 2);
  }
}
