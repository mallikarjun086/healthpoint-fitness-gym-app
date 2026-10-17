/**
 * HealthPoint Fitness - Cross-Platform Automated E2E Test Suite (Node.js)
 * Validates REST Endpoints, Authentication, Kinematics, Biometrics, and Microservice Integration.
 */

const http = require('http');

const BASE_URL = process.env.BACKEND_URL || 'http://localhost:8085/api';
let authToken = '';
let userId = null;

console.log('=================================================================');
console.log('    HEALTHPOINT FITNESS - CROSS-PLATFORM AUTOMATED TEST SUITE    ');
console.log('=================================================================\n');

function makeRequest(urlStr, method = 'GET', data = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : {};
          resolve({ statusCode: res.statusCode, body: json });
        } catch (e) {
          resolve({ statusCode: res.statusCode, rawBody: body });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  let passed = 0;
  let failed = 0;

  async function testStep(name, fn) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.log(`[FAIL] ${name}: ${err.message}`);
      failed++;
    }
  }

  // Step 1: Backend Health Check
  await testStep('1. Backend Server Health (/healthz)', async () => {
    const res = await makeRequest(`${BASE_URL.replace('/api', '')}/healthz`);
    if (res.statusCode !== 200) throw new Error(`Status ${res.statusCode}`);
  });

  // Step 2: Member Registration
  const randomEmail = `athlete_${Date.now()}@healthpoint.com`;
  await testStep('2. User Registration (/api/auth/register)', async () => {
    const res = await makeRequest(`${BASE_URL}/auth/register`, 'POST', {
      name: 'Apex Runner',
      email: randomEmail,
      password: 'password123',
      phoneNumber: '+1-555-0199',
    });
    if (res.statusCode !== 200 || !res.body.userId) throw new Error(JSON.stringify(res.body));
  });

  // Step 3: Authentication & Token Issuance
  await testStep('3. User Authentication & JWT Issuance (/api/auth/login)', async () => {
    const res = await makeRequest(`${BASE_URL}/auth/login`, 'POST', {
      email: randomEmail,
      password: 'password123',
    });
    if (res.statusCode !== 200 || !res.body.token) throw new Error(JSON.stringify(res.body));
    authToken = res.body.token;
    userId = res.body.user.id;
    if (res.body.user.password) throw new Error('SECURITY VULNERABILITY: Password hash returned in auth response!');
  });

  // Step 4: User Profile Verification
  await testStep('4. User Profile (/api/auth/me)', async () => {
    const res = await makeRequest(`${BASE_URL}/auth/me`, 'GET', null, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 || !res.body.id) throw new Error(JSON.stringify(res.body));
    if (res.body.password) throw new Error('SECURITY VULNERABILITY: Password hash returned in profile response!');
  });

  // Step 5: Exercise Catalog Retrieval
  await testStep('5. Exercise Catalog & Biomechanical Ranges (/api/exercises)', async () => {
    const res = await makeRequest(`${BASE_URL}/exercises`, 'GET', null, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 || !Array.isArray(res.body)) throw new Error(`Status ${res.statusCode}`);
  });

  // Step 6: Biometric Recovery & Readiness Engine
  await testStep('6. Recovery Readiness Engine (/api/biometrics/readiness/today)', async () => {
    const res = await makeRequest(`${BASE_URL}/biometrics/readiness/today?userId=${userId}`, 'GET', null, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 || typeof res.body.readinessScore !== 'number') throw new Error(JSON.stringify(res.body));
  });

  // Step 7: Trainer Authentication & Roster Access
  let trainerToken = '';
  let trainerUserId = null;
  await testStep('7. Trainer Auth & Roster (/api/auth/login as TRAINER)', async () => {
    const res = await makeRequest(`${BASE_URL}/auth/login`, 'POST', { email: 'trainer@hp.com', password: 'password123' });
    if (res.statusCode !== 200 || res.body.user?.role !== 'TRAINER') throw new Error(`Status ${res.statusCode} Role ${res.body.user?.role}`);
    trainerToken = res.body.token;
    trainerUserId = res.body.user?.id;
  });

  // Step 8: Admin Authentication & System Access
  let adminToken = '';
  await testStep('8. Admin Auth & Privilege (/api/auth/login as ADMIN)', async () => {
    const res = await makeRequest(`${BASE_URL}/auth/login`, 'POST', { email: 'admin@hp.com', password: 'password123' });
    if (res.statusCode !== 200 || res.body.user?.role !== 'ADMIN') throw new Error(`Status ${res.statusCode} Role ${res.body.user?.role}`);
    adminToken = res.body.token;
  });

  // Step 9: AI Goal & Split Generator
  await testStep('9. AI Goal & Hypertrophy Split Architect (/api/goals/setup)', async () => {
    const res = await makeRequest(`${BASE_URL}/goals/setup`, 'POST', {
      heightCm: 178,
      weightKg: 75,
      experienceLevel: 'INTERMEDIATE',
      goalType: 'AESTHETIC',
      sportName: 'Hypertrophy Bodybuilding'
    }, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 || !res.body.dailyCalories) throw new Error(JSON.stringify(res.body));
  });

  // Step 10: AI Voice Agent Query
  await testStep('10. AI Voice Agent Query Processing (/api/ai/voice-agent/chat)', async () => {
    const res = await makeRequest(`${BASE_URL}/ai/voice-agent/chat`, 'POST', {
      transcript: 'I feel fatigued, do I need a deload?',
      userId: userId,
      role: 'MEMBER'
    }, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 || !res.body.spokenResponse) throw new Error(JSON.stringify(res.body));
  });

  // Step 11: Biomechanical Live Workout Summary Logging
  await testStep('11. Biomechanical Live Workout Telemetry (/api/live-workout/summary)', async () => {
    const res = await makeRequest(`${BASE_URL}/live-workout/summary`, 'POST', {
      exerciseName: 'SQUAT',
      repsCompleted: 10,
      formScore: 94,
      durationSeconds: 45,
      faultCounts: { KNEE_VALGUS: 0 }
    }, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 && res.statusCode !== 201) throw new Error(`Status ${res.statusCode}`);
  });

  // Step 12: Workout Logging
  await testStep('12. Workout Routine Logging (/api/workout/logs/add)', async () => {
    const res = await makeRequest(`${BASE_URL}/workout/logs/add`, 'POST', {
      userId: userId,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      completionPercentage: 100,
      notes: 'Heavy Push day completed with maximum intensity.'
    }, { Authorization: `Bearer ${authToken}` });
    if (res.statusCode !== 200 || !res.body.id) throw new Error(JSON.stringify(res.body));
  });

  // Step 13: Class Booking Reservation
  await testStep('13. Class Booking Lifecycle (/api/classes/upcoming & /book)', async () => {
    const upcomingRes = await makeRequest(`${BASE_URL}/classes/upcoming`, 'GET', null, { Authorization: `Bearer ${authToken}` });
    if (upcomingRes.statusCode !== 200 || !Array.isArray(upcomingRes.body) || upcomingRes.body.length === 0) {
      throw new Error('No upcoming classes found');
    }
    const sessionId = upcomingRes.body[0].id;
    const bookRes = await makeRequest(`${BASE_URL}/classes/book`, 'POST', {
      userId: userId,
      classSessionId: sessionId
    }, { Authorization: `Bearer ${authToken}` });
    if (bookRes.statusCode !== 200 || !bookRes.body.id) throw new Error(JSON.stringify(bookRes.body));
  });

  // Step 14: Trainer Diet Plan Creation
  await testStep('14. Trainer Diet Plan Authoring (/api/diet/create)', async () => {
    const res = await makeRequest(`${BASE_URL}/diet/create`, 'POST', {
      userId: userId,
      title: 'Championship Cut Blueprint',
      description: 'High protein macro plan authored by Master Trainer',
      calories: 2400,
      protein: 190,
      carbs: 230,
      fat: 60,
      mealType: 'NON_VEG',
      items: 'Meal 1 (Oats & Whey) | Meal 2 (Chicken & Rice) | Meal 3 (Eggs & Toast)',
      isActive: true
    }, { Authorization: `Bearer ${trainerToken}` });
    if (res.statusCode !== 200 || !res.body.id) throw new Error(JSON.stringify(res.body));
  });

  // Step 15: Safety Escalation Logging & Resolution
  await testStep('15. Clinical Safety Escalation & Resolution (/api/safety/pain-report & /resolve)', async () => {
    const reportRes = await makeRequest(`${BASE_URL}/safety/pain-report`, 'POST', {
      userId: userId,
      bodyPart: 'LOWER_BACK',
      painLevel: 5,
      exerciseName: 'Conventional Deadlift',
      notes: 'Felt slight lumbar fatigue'
    }, { Authorization: `Bearer ${authToken}` });
    if (reportRes.statusCode !== 200) throw new Error(JSON.stringify(reportRes.body));

    const escId = reportRes.body.escalation?.id;
    if (escId) {
      const resolveRes = await makeRequest(`${BASE_URL}/safety/resolve/${escId}`, 'POST', {
        trainerId: trainerUserId || 2,
        trainerResponse: 'Prescribed glute bridging warm-up and reduced axial loading load by 20%.'
      }, { Authorization: `Bearer ${trainerToken}` });
      if (resolveRes.statusCode !== 200) throw new Error(JSON.stringify(resolveRes.body));
    }
  });

  // Step 16: Payment Order Generation & Sandbox Verification
  await testStep('16. Payment Order Generation & Sandbox Verification (/api/payments)', async () => {
    const orderRes = await makeRequest(`${BASE_URL}/payments/create-order`, 'POST', {
      userId: userId,
      amount: 2999,
      currency: 'INR',
      paymentFor: 'MEMBERSHIP',
      referenceId: 3
    }, { Authorization: `Bearer ${authToken}` });
    if (orderRes.statusCode !== 200 || !orderRes.body.orderId) throw new Error(JSON.stringify(orderRes.body));

    const verifyRes = await makeRequest(`${BASE_URL}/payments/verify`, 'POST', {
      razorpayOrderId: orderRes.body.orderId,
      razorpayPaymentId: `pay_sim_${Date.now()}`,
      razorpaySignature: `sig_sim_${Date.now()}`,
      userId: userId,
      paymentFor: 'MEMBERSHIP',
      referenceId: 3
    }, { Authorization: `Bearer ${authToken}` });
    if (verifyRes.statusCode !== 200 || !verifyRes.body.success) throw new Error(JSON.stringify(verifyRes.body));
  });

  console.log('\n=================================================================');
  console.log(`    ALL PILLARS VALIDATED: ${passed} PASSED | ${failed} FAILED               `);
  console.log('=================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Unhandled Test Failure:', err);
  process.exit(1);
});
