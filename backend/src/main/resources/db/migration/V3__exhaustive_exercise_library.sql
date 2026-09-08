-- HealthPoint Fitness - Complete Workout Content System Migration
-- Flyway Migration V3: Exhaustive Exercise Schema & Seed Dataset

-- 1. Alter exercises table with biomechanical fields
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS primary_muscle_group VARCHAR(100);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS secondary_muscle_groups VARCHAR(255);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS equipment_required VARCHAR(100);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS difficulty VARCHAR(50) DEFAULT 'INTERMEDIATE';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'STRENGTH';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS instructions TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS animated_demo_reference VARCHAR(100);
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS safe_joint_angle_ranges TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS common_mistakes TEXT;
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS tempo VARCHAR(50) DEFAULT '3-0-1-0';
ALTER TABLE exercises ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;

-- 2. Create custom_workouts table
CREATE TABLE IF NOT EXISTS custom_workouts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    difficulty VARCHAR(50) DEFAULT 'INTERMEDIATE',
    category VARCHAR(50) DEFAULT 'STRENGTH',
    target_muscle_group VARCHAR(100),
    estimated_duration_minutes INT DEFAULT 45,
    workout_data_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_exercises_muscle ON exercises(primary_muscle_group);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment_required);
CREATE INDEX IF NOT EXISTS idx_custom_workouts_user ON custom_workouts(user_id);

-- 3. Exhaustive Seed Dataset for Exercises (60 Balanced Biomechanical Movements)

-- CHEST (5 Exercises)
INSERT INTO exercises (id, name, primary_muscle_group, secondary_muscle_groups, equipment_required, difficulty, category, instructions, animated_demo_reference, safe_joint_angle_ranges, common_mistakes, tempo, sets, reps, rest_time, muscle_impact, form_cues, video_url, thumbnail_url)
VALUES
(1, 'Incline Dumbbell Bench Press', 'CHEST', 'Triceps Brachii, Anterior Deltoid', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH', 
 '1. Set bench to 30-degree incline. 2. Retract and depress scapula. 3. Lower dumbbells with 45-degree elbow tuck until level with chest. 4. Press dumbbells up in a natural converging arc without locking out abruptly.',
 'bench-press', '{"elbow_flexion": [45, 90], "shoulder_abduction": [30, 75], "bench_angle": [30, 35]}',
 'Bench incline >45 degrees shifting stress to front delts; flaring elbows to 90 degrees risking subacromial impingement.', '3-0-1-0', 4, 10, '90s', 'Pectoralis Major (Clavicular Head), Front Delts', 'Keep wrists stacked above elbows and maintain foot arch drive.', 'https://www.youtube.com/embed/8iPEnn-ltC8', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(2, 'Barbell Flat Bench Press', 'CHEST', 'Triceps, Anterior Deltoid', 'Barbell', 'INTERMEDIATE', 'STRENGTH',
 '1. Lie with eyes under the bar. 2. Establish 5 points of contact. 3. Unrack with tight upper back. 4. Lower bar to lower sternum. 5. Drive feet into floor and press upward.',
 'bench-press', '{"elbow_flexion": [45, 90], "shoulder_abduction": [45, 75], "wrist_extension": [0, 15]}',
 'Bouncing barbell off sternum; lifting hips off bench; uneven left/right lockout.', '3-1-1-0', 4, 8, '120s', 'Pectoralis Major (Sternal Head), Triceps', 'Tuck shoulder blades into back pockets before unracking.', 'https://www.youtube.com/embed/rT7DgCr-3pg', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

(3, 'Standing Low-to-High Cable Fly', 'CHEST', 'Anterior Deltoids, Biceps Short Head', 'Cables', 'BEGINNER', 'STRENGTH',
 '1. Position pulleys at floor level. 2. Stagger feet for balance. 3. Sweep handles upward and inward towards eye level with slightly bent elbows. 4. Squeeze upper chest fibers for 1 second.',
 'cable-lateral-raise', '{"elbow_flexion": [15, 25], "shoulder_flexion": [0, 80]}',
 'Turning movement into a bicep curl; using excessive momentum.', '2-1-1-1', 3, 12, '60s', 'Pectoralis Major (Upper Clavicular)', 'Imagine scooping a giant sphere upward while keeping chest puffed.', 'https://www.youtube.com/embed/taI4XduLpBe', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(4, 'Weighted Chest Dips', 'CHEST', 'Triceps Brachii, Anterior Deltoid', 'Bodyweight', 'ADVANCED', 'STRENGTH',
 '1. Mount dip bars with locked arms. 2. Lean torso 30 degrees forward. 3. Lower until shoulder joint is slightly below elbow crease (90 degrees). 4. Press back up through lower chest fibers.',
 'pushup-standard', '{"torso_lean_forward": [25, 35], "elbow_flexion": [85, 95]}',
 'Remaining completely vertical (which shifts load to triceps); cutting depth prematurely.', '3-0-1-1', 4, 8, '90s', 'Lower Pectoralis Major (Costal Head)', 'Look slightly downward to maintain forward torso tilt throughout the set.', 'https://www.youtube.com/embed/2z8JmcrW-As', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800'),

(5, 'Deficit Push-Up on Parallelettes', 'CHEST', 'Serratus Anterior, Core, Triceps', 'Bodyweight', 'BEGINNER', 'HOME_WORKOUT',
 '1. Place hands on elevated handles wider than shoulders. 2. Maintain rigid plank from ears to heels. 3. Descend chest deep past hand level into full pectoral stretch. 4. Push up aggressively.',
 'pushup-standard', '{"elbow_flexion": [45, 95], "lumbar_extension": [0, 5]}',
 'Sagging hips; flaring elbows wide; chin poking forward.', '3-1-1-0', 3, 15, '60s', 'Full Pectoralis Major & Core Stability', 'Squeeze glutes and brace abs as if preparing for a punch.', 'https://www.youtube.com/embed/IODxDxX7oi4', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800'),

-- BACK (5 Exercises)
(6, 'Conventional Barbell Deadlift', 'BACK', 'Gluteus Maximus, Hamstrings, Trapezius', 'Barbell', 'ADVANCED', 'STRENGTH',
 '1. Barbell over mid-foot. 2. Hinge at hips and grip bar. 3. Pull slack out of the bar. 4. Wedge hips down, lock lats, and drive the floor away with your legs.',
 'deadlift-conventional', '{"hip_flexion": [45, 90], "knee_flexion": [60, 100], "lumbar_flexion": [0, 0]}',
 'Rounding lumbar spine; jerking bar without slack pull; hyperextending at top.', '1-0-1-0', 4, 6, '180s', 'Spinal Erectors, Latissimus Dorsi, Trapezius', 'Think of deadlifting as leg-pressing the earth downward.', 'https://www.youtube.com/embed/op9kVnSso6Q', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(7, 'Wide-Grip Lat Pulldown', 'BACK', 'Teres Major, Biceps, Rhomboids', 'Cables', 'BEGINNER', 'STRENGTH',
 '1. Grip bar slightly wider than shoulder width. 2. Lean back 10-15 degrees. 3. Depress scapula and pull elbows down into back pockets until bar grazes clavicle.',
 'pullup-strict', '{"torso_lean": [10, 20], "elbow_flexion": [45, 90]}',
 'Pulling behind neck; swinging torso backward 45 degrees to cheat weight.', '3-0-1-1', 4, 10, '90s', 'Latissimus Dorsi, Teres Major', 'Lead with your elbows, not your hands.', 'https://www.youtube.com/embed/CAwf7n6Luuc', 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&q=80&w=800'),

(8, 'Chest-Supported T-Bar Row', 'BACK', 'Rhomboids, Mid/Lower Trapezius, Rear Delts', 'Machine', 'INTERMEDIATE', 'STRENGTH',
 '1. Position chest firmly on pad. 2. Flare elbows at 45-60 degrees. 3. Row handles backward, squeezing shoulder blades together for 1 full second.',
 'bent-over-row', '{"elbow_flexion": [45, 90], "scapular_retraction": [15, 30]}',
 'Lifting chest off pad to use lower back momentum; shrugging shoulders up.', '2-1-1-1', 4, 10, '90s', 'Rhomboids, Trapezius, Latissimus Dorsi', 'Pinch an imaginary pencil between your shoulder blades at peak.', 'https://www.youtube.com/embed/GZbfZ033f74', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'),

(9, 'Heavy Barbell Shrugs', 'BACK', 'Levator Scapulae, Forearms', 'Barbell', 'BEGINNER', 'STRENGTH',
 '1. Hold barbell with shoulder-width grip. 2. Slight 5-degree torso lean. 3. Elevate shoulders straight up towards ears. 4. Hold peak for 2 seconds before lowering.',
 'deadlift-conventional', '{"scapular_elevation": [20, 45], "elbow_flexion": [0, 0]}',
 'Rolling shoulders in a circle; bending elbows to lift weight.', '2-2-1-0', 4, 12, '75s', 'Upper Trapezius', 'Move strictly up and down like on rails.', 'https://www.youtube.com/embed/cJRVVxmytaM', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

(10, 'Strict Bodyweight Pull-Ups', 'BACK', 'Biceps, Core, Posterior Deltoids', 'Bodyweight', 'ADVANCED', 'STRENGTH',
 '1. Pronated grip slightly outside shoulders. 2. Dead hang with active shoulders. 3. Pull chest up to bar while keeping legs quiet and core engaged.',
 'pullup-strict', '{"elbow_flexion": [30, 100], "shoulder_adduction": [0, 90]}',
 'Kipping with legs; failing to achieve full elbow extension at bottom.', '3-0-1-0', 4, 8, '120s', 'Latissimus Dorsi & Back Width', 'Drive elbows into the floor as you pull upward.', 'https://www.youtube.com/embed/eGo4IYlbE5g', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

-- SHOULDERS (5 Exercises)
(11, 'Standing Barbell Overhead Press (OHP)', 'SHOULDERS', 'Triceps, Serratus Anterior, Upper Chest', 'Barbell', 'ADVANCED', 'STRENGTH',
 '1. Grip bar just outside shoulders. 2. Squeeze glutes and core tight. 3. Press bar vertically clearing chin. 4. Lock out with head pushing through the window.',
 'overhead-press', '{"elbow_extension": [0, 180], "lumbar_extension": [0, 5]}',
 'Hyperextending lumbar spine; turning lift into an incline bench press.', '3-0-1-0', 4, 6, '120s', 'Anterior & Lateral Deltoids', 'Keep ribs pulled down towards pelvis throughout the press.', 'https://www.youtube.com/embed/2yjwXTZQDDI', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

(12, 'Cable Lean-Away Lateral Raise', 'SHOULDERS', 'Trapezius', 'Cables', 'INTERMEDIATE', 'STRENGTH',
 '1. Set cable low. 2. Hold post and lean 15 degrees away. 3. Raise cable in the scapular plane (30 deg forward) to shoulder height. 4. Lower under control.',
 'cable-lateral-raise', '{"shoulder_abduction": [0, 90], "scapular_plane": [30, 35]}',
 'Using swinging momentum; raising higher than parallel causing impingement.', '2-1-1-1', 4, 12, '60s', 'Lateral Deltoids (Shoulder Cap)', 'Pour the water slightly with hands at the peak.', 'https://www.youtube.com/embed/PPrzBWZDOhA', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

(13, 'Rope Face Pull with External Rotation', 'SHOULDERS', 'Rhomboids, Infraspinatus, Teres Minor', 'Cables', 'BEGINNER', 'MOBILITY',
 '1. Set pulley at eye level with rope. 2. Pull rope toward forehead while externally rotating thumbs backward like a double bicep pose.',
 'cable-lateral-raise', '{"shoulder_external_rotation": [45, 90], "elbow_flexion": [80, 100]}',
 'Leading with wrists instead of elbows and external rotators.', '2-1-1-1', 4, 15, '60s', 'Posterior Deltoids & Rotator Cuff', 'Split the rope apart as you reach forehead level.', 'https://www.youtube.com/embed/rep-qVOkqgk', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(14, 'Seated Dumbbell Arnold Press', 'SHOULDERS', 'Triceps Brachii, Upper Pectorals', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH',
 '1. Start dumbbells in front of shoulders with palms facing you. 2. Press overhead while rotating palms forward at the top.',
 'overhead-press', '{"shoulder_flexion": [0, 180], "wrist_rotation": [0, 180]}',
 'Dropping elbows below chest on start; arching off backrest.', '3-0-1-0', 4, 10, '90s', 'Anterior & Medial Deltoids', 'Smooth, continuous rotational spiral from bottom to top.', 'https://www.youtube.com/embed/3ml7BH7mNwQ', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(15, 'Incline Rear Delt Dumbbell Fly', 'SHOULDERS', 'Rhomboids, Trapezius', 'Dumbbells', 'BEGINNER', 'STRENGTH',
 '1. Lie chest-down on 30-degree incline bench. 2. Arms hang down with slight bend. 3. Sweep weights outward in wide arc leading with pinkies.',
 'cable-lateral-raise', '{"horizontal_abduction": [0, 90], "elbow_angle": [15, 20]}',
 'Bending elbows into a row; jerking torso off pad.', '2-1-1-1', 3, 15, '60s', 'Posterior Deltoid (Rear Shoulder)', 'Focus on flying arms wide rather than lifting weights high.', 'https://www.youtube.com/embed/0G2_XV7slIg', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

-- BICEPS (5 Exercises)
(16, 'Incline Dumbbell Biceps Curl', 'BICEPS', 'Brachialis, Forearm Flexors', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH',
 '1. Set bench to 45-55 degrees. 2. Let arms hang in full passive stretch. 3. Curl dumbbells up while supinating wrists, keeping upper arms pinned.',
 'bicep-curl', '{"elbow_flexion": [0, 140], "shoulder_extension": [20, 30]}',
 'Swinging elbows forward to engage front delts; bouncing at bottom.', '3-1-1-0', 4, 10, '75s', 'Biceps Brachii (Long Head Stretch)', 'Keep elbows pointing vertically toward the floor at all times.', 'https://www.youtube.com/embed/soxrZlIl35U', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

(17, 'EZ-Bar Preacher Curl', 'BICEPS', 'Brachialis', 'Barbell', 'BEGINNER', 'STRENGTH',
 '1. Rest upper arms securely against preacher pad. 2. Lower bar until arms are almost fully extended. 3. Curl bar to vertical without lifting elbows off pad.',
 'bicep-curl', '{"elbow_flexion": [15, 135], "shoulder_fixation": [0, 0]}',
 'Hyperextending elbows at the bottom under heavy load.', '3-0-1-1', 4, 10, '75s', 'Biceps Brachii (Short Head Peak)', 'Squeeze biceps hard before the bar passes vertical line of tension.', 'https://www.youtube.com/embed/fIWP-FRFNU0', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(18, 'Standing Neutral-Grip Hammer Curl', 'BICEPS', 'Brachioradialis, Forearms', 'Dumbbells', 'BEGINNER', 'STRENGTH',
 '1. Stand upright holding dumbbells with palms facing each other. 2. Curl dumbbells upward keeping thumbs pointing to ceiling. 3. Lower under strict 3s tempo.',
 'bicep-curl', '{"elbow_flexion": [0, 135], "wrist_neutral": [0, 0]}',
 'Rocking body back and forth; flaring elbows out.', '3-0-1-0', 4, 12, '60s', 'Brachialis & Brachioradialis (Arm Thickness)', 'Keep palms facing inward throughout the entire repetition.', 'https://www.youtube.com/embed/zC3nLlEvin4', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

(19, 'Bayesian Cable Bicep Curl', 'BICEPS', 'Brachialis', 'Cables', 'INTERMEDIATE', 'STRENGTH',
 '1. Face away from low cable tower. 2. Step forward into slight stretch. 3. Curl cable handle forward and upward while maintaining shoulder extension.',
 'bicep-curl', '{"elbow_flexion": [0, 140], "shoulder_extension": [15, 25]}',
 'Stepping back losing cable tension; leaning torso forward.', '3-1-1-0', 3, 12, '60s', 'Biceps Long Head (Maximum Stretch Tension)', 'Constant cable tension at the extreme lengthened range.', 'https://www.youtube.com/embed/6kALZikXxLs', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(20, 'Seated Concentration Curl', 'BICEPS', 'Brachialis', 'Dumbbells', 'BEGINNER', 'STRENGTH',
 '1. Sit on bench, brace elbow against inner thigh. 2. Fully extend arm down. 3. Curl dumbbell to face while squeezing bicep peak.',
 'bicep-curl', '{"elbow_flexion": [0, 145], "hip_brace": [0, 0]}',
 'Using shoulder rotation to assist; lifting elbow off inner thigh.', '2-1-1-1', 3, 12, '60s', 'Biceps Peak Contraction', 'Lock the upper arm firmly against your inner quad.', 'https://www.youtube.com/embed/Jvj2wV0vOYU', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

-- TRICEPS (5 Exercises)
(21, 'Dual Cable Cross-Body Triceps Extension', 'TRICEPS', 'Anconeus', 'Cables', 'INTERMEDIATE', 'STRENGTH',
 '1. Set dual pulleys at top. 2. Grab left cable with right hand, right cable with left. 3. Keep upper arms aligned with torso cables, extend elbows outward and down.',
 'tricep-pushdown', '{"elbow_extension": [45, 180], "shoulder_angle": [0, 15]}',
 'Letting elbows flare forward; allowing shoulders to roll inward.', '2-1-1-1', 4, 12, '60s', 'Triceps (Lateral & Medial Heads)', 'Locks the triceps in natural scapular alignment with zero elbow joint friction.', 'https://www.youtube.com/embed/vB5OHsJ3EME', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(22, 'Overhead Rope Cable Triceps Extension', 'TRICEPS', 'Anconeus', 'Cables', 'INTERMEDIATE', 'STRENGTH',
 '1. Set pulley at chest height. 2. Face away from stack, pull rope overhead in staggered stance. 3. Extend forearms forward and spread rope ends at lockout.',
 'tricep-pushdown', '{"elbow_extension": [45, 175], "shoulder_flexion": [150, 180]}',
 'Flaring elbows wide; hyperextending lower back.', '3-1-1-0', 4, 12, '75s', 'Triceps Brachii (Long Head Stretch)', 'Maximizes hypertrophy via deep long head stretch overhead.', 'https://www.youtube.com/embed/ns-RGsbYeKA', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

(23, 'Lying Barbell Skull Crushers', 'TRICEPS', 'Anconeus', 'Barbell', 'ADVANCED', 'STRENGTH',
 '1. Lie on flat bench holding EZ-bar with narrow grip. 2. Angle upper arms back 10 degrees. 3. Bend elbows lowering bar to crown of head. 4. Extend back to top.',
 'tricep-pushdown', '{"elbow_flexion": [45, 120], "shoulder_angle": [10, 20]}',
 'Lowering bar to forehead (risks impact); allowing upper arms to drift forward.', '3-0-1-0', 4, 10, '90s', 'Triceps Long & Medial Heads', 'Keep elbows pointed straight toward the ceiling throughout.', 'https://www.youtube.com/embed/d_KZxkY_0cM', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

(24, 'Close-Grip Barbell Bench Press', 'TRICEPS', 'Pectoralis Major, Anterior Delts', 'Barbell', 'INTERMEDIATE', 'STRENGTH',
 '1. Lie on bench with hands shoulder-width apart. 2. Lower bar to lower sternum with elbows tucked close to ribcage. 3. Press up locking out triceps.',
 'bench-press', '{"elbow_flexion": [45, 90], "grip_width_cm": [35, 45]}',
 'Gripping too narrow (<20cm) straining wrists; bouncing bar.', '3-1-1-0', 4, 8, '90s', 'Triceps Heavy Mechanical Overload', 'Keep elbows brushing against ribcage on the descent.', 'https://www.youtube.com/embed/nEF0bv2FW94', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'),

(25, 'Straight Bar Cable Tricep Pushdown', 'TRICEPS', 'Anconeus', 'Cables', 'BEGINNER', 'STRENGTH',
 '1. Stand tall with slight forward hinge. 2. Pin elbows to ribs. 3. Push bar down until elbows lock, flexing triceps hard at bottom.',
 'tricep-pushdown', '{"elbow_extension": [60, 180], "elbow_drift": [0, 0]}',
 'Letting elbows travel up and down with each rep; using body weight to push.', '2-1-1-1', 4, 12, '60s', 'Triceps Lateral Head', 'Keep your upper body completely stationary.', 'https://www.youtube.com/embed/2-LAMcpzODU', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

-- FOREARMS (5 Exercises)
(26, 'Seated Barbell Wrist Curl & Finger Extension', 'FOREARMS', 'Finger Flexors', 'Barbell', 'BEGINNER', 'STRENGTH',
 '1. Rest forearms on thighs with wrists over knees. 2. Open hands letting bar roll into fingertips. 3. Curl fingers back into palm and flex wrists upward.',
 'bicep-curl', '{"wrist_flexion": [-45, 60], "finger_curl": [0, 90]}',
 'Lifting forearms off thighs; jerky rapid bouncing.', '2-1-1-1', 4, 15, '60s', 'Flexor Carpi Radialis & Deep Grip', 'Full range of motion from fingertips to peak wrist curl.', 'https://www.youtube.com/embed/3VQu_pnS2m4', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(27, 'Standing Reverse EZ-Bar Curl', 'FOREARMS', 'Brachialis, Biceps', 'Barbell', 'INTERMEDIATE', 'STRENGTH',
 '1. Grip EZ bar with overhand pronated grip. 2. Keep upper arms pinned at sides. 3. Curl bar up to chest height without wrist extension breakdown.',
 'bicep-curl', '{"elbow_flexion": [0, 135], "wrist_pronation": [90, 90]}',
 'Allowing wrists to bend backward under load; swinging elbows.', '3-0-1-0', 4, 12, '60s', 'Brachioradialis & Forearm Extensors', 'Squeeze the bar as hard as possible throughout the movement.', 'https://www.youtube.com/embed/nRgxYX2Ve9w', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

(28, 'Heavy Dumbbell Farmer Walk', 'FOREARMS', 'Traps, Core, Glutes', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH',
 '1. Pick up heavy pair of dumbbells with deadlift mechanics. 2. Stand tall with shoulders back and core braced. 3. Walk in controlled heel-to-toe strides for distance.',
 'deadlift-conventional', '{"shoulder_depression": [10, 20], "torso_lateral_tilt": [0, 0]}',
 'Slumping shoulders forward; rushing stride causing weights to swing.', 'Distance-Based', 4, 50, '90s', 'Crushing Grip & Full Body Anti-Lateral Flexion', 'Walk as if balancing a glass of water on your head.', 'https://www.youtube.com/embed/Fkzk_RqlYig', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(29, 'Active Dead Hang with Scapular Retraction', 'FOREARMS', 'Lats, Shoulder Capsule', 'Bodyweight', 'BEGINNER', 'MOBILITY',
 '1. Grip pull-up bar firmly with pronated grip. 2. Hang with arms fully extended. 3. Engage shoulders slightly without bending elbows, breathing rhythmically.',
 'pullup-strict', '{"shoulder_elevation": [170, 180], "grip_duration_sec": [30, 90]}',
 'Holding breath; swinging legs.', 'Timed-Hold', 3, 45, '60s', 'Grip Endurance & Shoulder Joint Decompression', 'Deep diaphragmatic breathing while maintaining vise grip.', 'https://www.youtube.com/embed/nO4gQf8N2gU', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(30, 'Plate Pinch Grip Hold', 'FOREARMS', 'Thumb Adductors & Deep Finger Flexors', 'Weight Plate', 'BEGINNER', 'HOME_WORKOUT',
 '1. Place two smooth weight plates together smooth side out. 2. Pinch them between fingers and thumb. 3. Lift to knee height and hold for time.',
 'deadlift-conventional', '{"thumb_pinch_force": [50, 100], "hold_sec": [20, 45]}',
 'Resting plates against legs to take off load.', 'Timed-Hold', 3, 30, '60s', 'Pinch Grip Strength', 'Directly strengthens hand tendons and stabilizer muscles.', 'https://www.youtube.com/embed/qg_iX3l0Z6E', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

-- CORE (5 Exercises)
(31, 'Hanging Leg and Pelvic Raise', 'CORE', 'Hip Flexors, Forearms', 'Bodyweight', 'ADVANCED', 'CORE',
 '1. Hang from bar with active shoulders. 2. Flex hips and curl pelvis upward toward chest, rounding lower lumbar slightly at the top for true ab recruitment.',
 'hanging-leg-raise', '{"hip_flexion": [0, 120], "pelvic_posterior_tilt": [15, 30]}',
 'Swinging with momentum; arching lower back at bottom.', '2-1-1-1', 4, 12, '75s', 'Rectus Abdominis (Lower Region)', 'Focus on bringing your belt buckle towards your chin.', 'https://www.youtube.com/embed/hdng3Nm1x_E', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=800'),

(32, 'Kneeling Cable High-Pulley Crunch', 'CORE', 'Obliques', 'Cables', 'INTERMEDIATE', 'CORE',
 '1. Kneel with rope attachment behind neck. 2. Fix hip position in space. 3. Flex spine forward like rolling into a ball, driving elbows toward thighs.',
 'hanging-leg-raise', '{"spinal_flexion": [0, 45], "hip_angle_fixed": [90, 90]}',
 'Sitting back onto heels turning movement into hip hinge.', '2-1-1-1', 4, 15, '60s', 'Rectus Abdominis (Upper Region)', 'Exhale completely at the bottom of the crunch.', 'https://www.youtube.com/embed/2fO5aA7bW7E', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(33, 'Ab Wheel Rollout with Posterior Pelvic Tilt', 'CORE', 'Transverse Abdominis, Lats, Shoulders', 'Bodyweight', 'ADVANCED', 'CORE',
 '1. Kneel on mat with hips tucked. 2. Roll wheel forward maintaining hollow body posture. 3. Reach as far as possible without lower back sagging, pull back with abs.',
 'hanging-leg-raise', '{"shoulder_flexion": [90, 180], "lumbar_extension": [0, 0]}',
 'Letting lumbar spine arch/dip toward the floor; pulling back with hips.', '3-1-1-0', 4, 10, '90s', 'Deep Transverse Abdominis & Core Bracing', 'Squeeze glutes tight before rolling out.', 'https://www.youtube.com/embed/rqiTPdK1c_I', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&q=80&w=800'),

(34, 'Cable Pallof Press with Isometric Hold', 'CORE', 'Obliques, Glutes', 'Cables', 'BEGINNER', 'CORE',
 '1. Stand perpendicular to cable with handle at sternum. 2. Press handle straight out away from chest resisting torso rotation. 3. Hold for 2 seconds and return.',
 'hanging-leg-raise', '{"torso_rotation": [0, 0], "shoulder_flexion": [0, 90]}',
 'Letting cable twist torso toward the stack; twisting hips.', '2-2-1-0', 3, 12, '60s', 'Anti-Rotational Core Strength', 'Lock your pelvis square to the wall in front of you.', 'https://www.youtube.com/embed/5_8qozWY32Y', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(35, 'Side Plank with Hip Abduction', 'CORE', 'Gluteus Medius, Quadratus Lumborum', 'Bodyweight', 'INTERMEDIATE', 'CORE',
 '1. Lie on side supported by forearm and edge of bottom foot. 2. Lift hips into straight diagonal line. 3. Raise top leg in controlled abduction.',
 'hanging-leg-raise', '{"lateral_spine_angle": [0, 0], "hip_abduction": [0, 30]}',
 'Dropping bottom hip toward floor; rolling chest forward.', 'Timed-Hold', 3, 40, '45s', 'Obliques & Lateral Hip Stabilizers', 'Keep neck in line with spine and look straight ahead.', 'https://www.youtube.com/embed/N_sO_m7v0e0', 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800'),

-- GLUTES (5 Exercises)
(36, 'Barbell Hip Thrust with Glute Peak Contraction', 'GLUTES', 'Hamstrings, Adductors', 'Barbell', 'INTERMEDIATE', 'STRENGTH',
 '1. Upper back on bench under shoulder blades. 2. Barbell padded over hips. 3. Drive through heels until hips are in full extension with vertical shins. 4. Squeeze glutes for 2s.',
 'hip-thrust', '{"hip_extension": [0, 180], "knee_angle_at_top": [85, 95]}',
 'Hyperextending lumbar spine; placing feet too far forward or too close.', '2-2-1-0', 4, 10, '120s', 'Gluteus Maximus (Peak Hypertrophy)', 'Keep chin tucked to chest throughout the thrust.', 'https://www.youtube.com/embed/SEdqd1n0cvg', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(37, 'Bulgarian Split Squat with Forward Hip Hinge', 'GLUTES', 'Quadriceps, Adductors', 'Dumbbells', 'ADVANCED', 'STRENGTH',
 '1. Rear foot elevated on bench. 2. Lean torso 20 degrees forward over lead thigh to bias glutes. 3. Lower hips until back knee hovers above ground. 4. Drive through front heel.',
 'squat-olympic', '{"front_knee_flexion": [70, 90], "torso_lean": [15, 25]}',
 'Knee caving inward (valgus collapse); staying too upright loading only quads.', '3-1-1-0', 4, 8, '90s', 'Gluteus Maximus & Medius (Unilateral Balance)', 'Push your hips back as you descend.', 'https://www.youtube.com/embed/2C-uNgKwPLE', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'),

(38, 'Standing Cable Glute Kickback', 'GLUTES', 'Hamstrings', 'Cables', 'BEGINNER', 'STRENGTH',
 '1. Attach ankle strap to low cable. 2. Hinge torso forward 30 degrees. 3. Kick leg backward and slightly outward along glute fiber angle, squeezing for 1 second.',
 'hip-thrust', '{"hip_extension": [0, 30], "lumbar_extension": [0, 0]}',
 'Arching lower back to kick higher; bending knee during extension.', '2-1-1-1', 3, 15, '60s', 'Gluteus Maximus & Upper Glute Shelf', 'Keep your core braced so movement occurs solely at the hip joint.', 'https://www.youtube.com/embed/kYvO3d2hS_I', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(39, 'Deficit Reverse Lunges with Dumbbells', 'GLUTES', 'Quads, Calves', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH',
 '1. Stand on a 3-inch elevated platform. 2. Step back with one leg, sinking into deep deficit hip stretch. 3. Push through front heel to return to platform.',
 'squat-olympic', '{"front_hip_flexion": [90, 110], "knee_flexion": [80, 100]}',
 'Slamming back knee onto floor; pushing off rear toe instead of front heel.', '3-0-1-0', 4, 10, '90s', 'Glute Max (Deep Lengthened Range)', 'Take a long step back to optimize the glute stretch.', 'https://www.youtube.com/embed/QE_hU8XgJzQ', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(40, 'Seated Machine Glute Abduction', 'GLUTES', 'Tensor Fasciae Latae', 'Machine', 'BEGINNER', 'STRENGTH',
 '1. Sit with back against pad (or lean slightly forward). 2. Push pads outward with outer knees. 3. Squeeze side glutes at end range for 2s.',
 'hip-thrust', '{"hip_abduction": [0, 45], "hip_flexion": [60, 90]}',
 'Using sudden jerky bouncing; failing to pause at full abduction.', '2-2-1-0', 4, 15, '60s', 'Gluteus Medius & Minimus', 'Focus on pushing with your outer knees rather than your feet.', 'https://www.youtube.com/embed/h0rI76v8J4g', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

-- QUADS (5 Exercises)
(41, 'High-Bar Olympic Back Squat', 'QUADS', 'Gluteus Maximus, Adductors, Core', 'Barbell', 'ADVANCED', 'STRENGTH',
 '1. Barbell across upper trapezius. 2. 360-degree breath & intra-abdominal brace. 3. Break at hips and knees simultaneously, descend below parallel with upright torso. 4. Drive up through mid-foot.',
 'squat-olympic', '{"knee_flexion": [90, 130], "hip_flexion": [80, 110], "torso_angle": [60, 80]}',
 'Knee caving (valgus); heels rising; excessive forward collapse of chest.', '3-1-1-0', 4, 8, '150s', 'Quadriceps (All 4 Heads) & Full Lower Body', 'Spread the floor with your feet as you stand.', 'https://www.youtube.com/embed/ultWZbUMPL8', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(42, '45-Degree Leg Press (Quad Focus)', 'QUADS', 'Glutes, Adductors', 'Machine', 'INTERMEDIATE', 'STRENGTH',
 '1. Place feet low and shoulder-width on platform. 2. Release safety catches. 3. Lower sled until knees reach 90 degrees without lower back peeling off seat. 4. Press back up without locking knees.',
 'squat-olympic', '{"knee_flexion": [80, 110], "lumbar_contact": [100, 100]}',
 'Allowing pelvis to tuck under (butt wink) at bottom; hyperextending knees at top.', '3-1-1-0', 4, 12, '90s', 'Quadriceps Isolation with Zero Spinal Loading', 'Keep tailbone firmly pinned to the bottom seat pad.', 'https://www.youtube.com/embed/IZxyjW7MPJQ', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'),

(43, 'Linear Hack Squat', 'QUADS', 'Glutes', 'Machine', 'INTERMEDIATE', 'STRENGTH',
 '1. Back against pad, shoulders locked under pads. 2. Feet lower on plate. 3. Squat down with deep knee flexion. 4. Drive through midfoot.',
 'squat-olympic', '{"knee_flexion": [90, 125], "torso_support": [100, 100]}',
 'Heels rising off platform; letting knees cave inward.', '3-1-1-0', 4, 10, '120s', 'Vastus Lateralis & Rectus Femoris (Quad Sweep)', 'Descend with strict control to maximize quad stretch.', 'https://www.youtube.com/embed/0tn5K9NlCfo', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(44, 'Seated Leg Extension with Iso-Hold', 'QUADS', 'None', 'Machine', 'BEGINNER', 'STRENGTH',
 '1. Align knee joint axis with machine pivot point. 2. Grip handles to lock hips down. 3. Extend legs to 180 degrees, flexing quads hard for 2s before lowering.',
 'squat-olympic', '{"knee_extension": [90, 180], "hip_fixation": [90, 90]}',
 'Kicking up with fast momentum; lifting hips off seat.', '2-2-1-0', 4, 12, '60s', 'Rectus Femoris Isolation (Peak Contraction)', 'Hold the peak lockout for two seconds on every rep.', 'https://www.youtube.com/embed/YyvSfVjQeL0', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(45, 'Dumbbell Walking Lunges', 'QUADS', 'Glutes, Hamstrings, Calves', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH',
 '1. Hold dumbbells at sides. 2. Take deliberate stride forward, descending until back knee is 1 inch off floor. 3. Step smoothly into next stride.',
 'squat-olympic', '{"knee_flexion": [80, 90], "torso_angle": [75, 85]}',
 'Letting front knee track wildly past toes without heel plant; torso wobbling.', 'Continuous', 4, 20, '90s', 'Dynamic Quad & Glute Hypertrophy', 'Keep footsteps shoulder-width wide for maximum balance.', 'https://www.youtube.com/embed/L8fvypPrzzs', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

-- HAMSTRINGS (5 Exercises)
(46, 'Dumbbell Romanian Deadlift (RDL)', 'HAMSTRINGS', 'Gluteus Maximus, Erector Spinae', 'Dumbbells', 'INTERMEDIATE', 'STRENGTH',
 '1. Soft bend in knees. 2. Push hips back towards wall like closing a car door with glutes. 3. Skim dumbbells along thighs until deep hamstring stretch. 4. Drive hips forward.',
 'romanian-deadlift', '{"hip_flexion": [0, 90], "knee_flexion": [15, 25], "spine_neutral": [0, 0]}',
 'Squatting the weight down; rounding lumbar spine; letting dumbbells drift forward.', '3-1-1-0', 4, 10, '90s', 'Hamstrings (Biceps Femoris & Semitendinosus)', 'Movement is pure horizontal hip hinge, not a vertical squat.', 'https://www.youtube.com/embed/JCXUYuzwNrM', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'),

(47, 'Seated Leg Curl with Dorsiflexion', 'HAMSTRINGS', 'Calves (Gastrocnemius)', 'Machine', 'BEGINNER', 'STRENGTH',
 '1. Lock thigh pad down firmly. 2. Flex feet (dorsiflex toes toward shins). 3. Curl pad down toward seat under knees. 4. Squeeze for 1s, return with 3s tempo.',
 'romanian-deadlift', '{"knee_flexion": [0, 110], "hip_flexion": [80, 90]}',
 'Allowing thighs to rise off pad; pointing toes down (plantarflexion) taking load off hamstrings.', '3-0-1-1', 4, 12, '60s', 'Hamstring Short-Head & Knee Flexion', 'Seated position places hamstrings in pre-stretched hip flexion.', 'https://www.youtube.com/embed/ELOCsoDSmrg', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

(48, 'Lying Prone Leg Curl', 'HAMSTRINGS', 'Gastrocnemius', 'Machine', 'BEGINNER', 'STRENGTH',
 '1. Lie prone on bench, pad above heels. 2. Press hips down into pad. 3. Curl pad up until heels almost touch glutes.',
 'romanian-deadlift', '{"knee_flexion": [0, 120], "hip_elevation": [0, 0]}',
 'Arching lower back and lifting hips to initiate the curl.', '3-0-1-1', 4, 10, '60s', 'Hamstrings Distal Hypertrophy', 'Keep your hips glued to the bench throughout.', 'https://www.youtube.com/embed/1Tq3EDt4306', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(49, 'Nordic Hamstring Bodyweight Curl', 'HAMSTRINGS', 'Glutes, Core', 'Bodyweight', 'ADVANCED', 'STRENGTH',
 '1. Kneel on pad with ankles securely locked down. 2. Maintain straight line from knees to head. 3. Lower torso forward under strict eccentric hamstring control.',
 'romanian-deadlift', '{"knee_extension": [90, 180], "hip_extension": [180, 180]}',
 'Bending at hips (breaking the straight line); dropping without control.', '4-0-1-0', 3, 6, '120s', 'Eccentric Hamstring Strength & Injury Prevention', 'Control the descent as far as possible before catching yourself.', 'https://www.youtube.com/embed/kYg4B7YQ_dY', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(50, 'Barbell Good Mornings', 'HAMSTRINGS', 'Erector Spinae, Gluteus Maximus', 'Barbell', 'INTERMEDIATE', 'STRENGTH',
 '1. Barbell resting on upper back. 2. Soft knee bend. 3. Hinge hips backward until torso is nearly parallel to floor. 4. Drive hips forward to stand.',
 'romanian-deadlift', '{"hip_flexion": [0, 85], "knee_flexion": [15, 20], "spine_neutral": [0, 0]}',
 'Squatting knees forward; rounding spine with heavy load.', '3-1-1-0', 4, 10, '90s', 'Posterior Chain Kinetic Integrity', 'Push your glutes straight back toward the rear wall.', 'https://www.youtube.com/embed/YA-h3n9L4YU', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800'),

-- CALVES (5 Exercises)
(51, 'Standing Single-Leg Calf Raise on Deficit Block', 'CALVES', 'Soleus', 'Dumbbells', 'BEGINNER', 'STRENGTH',
 '1. Ball of foot on block. 2. Lower heel into full 3s deficit stretch. 3. Drive up onto big toe, squeezing calf peak for 2 seconds.',
 'standing-calf-raise', '{"ankle_dorsiflexion": [-25, 0], "ankle_plantarflexion": [0, 45]}',
 'Bouncing at bottom without pausing; rolling onto outer pinky toe.', '3-2-1-2', 4, 15, '60s', 'Gastrocnemius (Medial & Lateral Heads)', 'Pause at the bottom to eliminate the Achilles tendon bounce reflex.', 'https://www.youtube.com/embed/gwLzBJYoWlI', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

(52, 'Seated Machine Soleus Calf Raise', 'CALVES', 'Tibialis Posterior', 'Machine', 'BEGINNER', 'STRENGTH',
 '1. Sit with knee pad locked above knees at 90 degrees. 2. Drop heels into deep stretch. 3. Drive upward into peak contraction.',
 'standing-calf-raise', '{"ankle_plantarflexion": [-20, 40], "knee_flexion": [90, 90]}',
 'Short half-reps; rapid uncontrolled bouncing.', '3-1-1-1', 4, 15, '60s', 'Soleus (Deep Lower Calf Width)', 'Bent knees take gastrocnemius off tension, isolating the soleus.', 'https://www.youtube.com/embed/JbyjNymZOt0', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(53, 'Leg Press Toe Press', 'CALVES', 'Soleus', 'Machine', 'INTERMEDIATE', 'STRENGTH',
 '1. Balls of feet on lower lip of leg press sled with heels hanging off. 2. Keep knees softly unlocked. 3. Press sled away using only ankle plantarflexion.',
 'standing-calf-raise', '{"ankle_flexion": [-20, 40], "knee_fixed": [170, 170]}',
 'Bending and extending knees turning it into a mini leg press.', '3-1-1-1', 4, 15, '60s', 'Gastrocnemius Heavy Loading', 'Keep knees locked in a fixed soft angle throughout.', 'https://www.youtube.com/embed/e_5fP4p_n9A', 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&q=80&w=800'),

(54, 'Donkey Calf Raise', 'CALVES', 'Soleus, Hamstrings', 'Machine', 'INTERMEDIATE', 'STRENGTH',
 '1. Hinge forward 90 degrees at hips with back flat. 2. Place balls of feet on block and pad across lower back. 3. Lower heels deep, drive up onto toes.',
 'standing-calf-raise', '{"ankle_flexion": [-25, 45], "hip_hinge": [90, 90]}',
 'Bending knees; shifting hips back and forth.', '3-1-1-1', 4, 12, '60s', 'Upper Gastrocnemius Stretch-Loading', 'Hip flexion puts hamstrings on stretch, enhancing calf activation.', 'https://www.youtube.com/embed/q_e97_gPkWw', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(55, 'Double-Under Jump Rope Conditioning', 'CALVES', 'Cardiovascular, Forearms', 'Bodyweight', 'ADVANCED', 'HIIT',
 '1. Hold jump rope handles at hip level. 2. Jump with stiff ankles, bounding on balls of feet. 3. Spin rope twice per jump with rapid wrist flicks.',
 'standing-calf-raise', '{"ankle_plyo_stiffness": [100, 100], "ground_contact_sec": [0.1, 0.2]}',
 'Bending knees excessively into a squat; jumping with heavy heels.', 'Intervals', 5, 50, '45s', 'Calf Elastic Tendon Stiffness & Anaerobic Capacity', 'Stay light and springy on the balls of your feet.', 'https://www.youtube.com/embed/hNuY4_KkZ6I', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800'),

-- FULL BODY & COMPOUND (5 Exercises)
(56, 'Olympic Clean and Push Press', 'COMPOUND', 'Hamstrings, Glutes, Delts, Traps, Triceps, Core', 'Barbell', 'ADVANCED', 'STRENGTH',
 '1. Pull bar from floor with triple extension of ankles, knees, hips. 2. Catch in front rack. 3. Dip knees 2 inches and drive bar overhead.',
 'olympic-clean', '{"triple_extension": [170, 180], "front_rack_elbows": [80, 90]}',
 'Catching bar with wrists bent; pressing with arms before leg drive finishes.', '1-0-1-0', 4, 5, '150s', 'Full Body Kinetic Chain Power', 'Explosive hip extension drives the bar upward.', 'https://www.youtube.com/embed/mSi7bBshK70', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(57, 'Barbell Thruster (Front Squat to Overhead Press)', 'COMPOUND', 'Quads, Glutes, Anterior Deltoids, Triceps, Core', 'Barbell', 'ADVANCED', 'HIIT',
 '1. Clean bar to front rack. 2. Perform deep front squat. 3. Stand explosively using momentum to launch barbell directly into overhead press.',
 'squat-olympic', '{"squat_depth": [90, 120], "press_lockout": [0, 180]}',
 'Pausing at the top of the squat separating the movements; rounding upper back.', '1-0-1-0', 4, 10, '90s', 'Total Body Metabolic Output & Power', 'One fluid explosive motion from the bottom of the squat to overhead.', 'https://www.youtube.com/embed/L219ltL15zk', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800'),

(58, 'Russian Kettlebell Swing', 'COMPOUND', 'Glutes, Hamstrings, Core, Lats', 'Kettlebell', 'BEGINNER', 'HIIT',
 '1. Stand with kettlebell 1 foot in front. 2. Hike kettlebell between legs with deep hip hinge. 3. Snap hips forward explosively floating kettlebell to chest height.',
 'hip-thrust', '{"hip_hinge": [45, 90], "knee_flexion": [15, 25], "arm_pull": [0, 0]}',
 'Squatting instead of hinging; lifting bell with shoulders instead of hip snap.', '1-0-1-0', 4, 20, '60s', 'Posterior Chain Explosive Power', 'Your arms are merely ropes; the power comes purely from your glute snap.', 'https://www.youtube.com/embed/YSxHifyI6s8', 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800'),

(59, 'Trap Bar (Hex Bar) Deadlift', 'COMPOUND', 'Quads, Glutes, Hamstrings, Traps, Core', 'Barbell', 'INTERMEDIATE', 'STRENGTH',
 '1. Stand inside hex bar centered. 2. Grip handles, drop hips into hybrid squat/hinge. 3. Drive floor away standing upright.',
 'deadlift-conventional', '{"hip_flexion": [60, 90], "knee_flexion": [70, 100]}',
 'Letting knees cave; jerking without pulling handle slack.', '2-0-1-0', 4, 6, '120s', 'Full Body Maximum Safe Overload', 'Combines the best of squats and deadlifts with minimal spinal shear.', 'https://www.youtube.com/embed/W5qC8b_4oF0', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800'),

(60, 'Snatch-Grip Barbell High Pull', 'COMPOUND', 'Trapezius, Posterior Delts, Hamstrings, Glutes', 'Barbell', 'ADVANCED', 'STRENGTH',
 '1. Wide snatch grip on barbell. 2. Hinge to mid-thigh. 3. Jump and extend violently, pulling elbows high and wide to chest level.',
 'olympic-clean', '{"triple_extension": [170, 180], "elbow_high_pull": [80, 100]}',
 'Pulling solely with arms; curling wrists downward.', '1-0-1-0', 4, 5, '120s', 'Upper Back & Posterior Chain Explosiveness', 'Keep the bar brushing close to your shirt as it rises.', 'https://www.youtube.com/embed/l592kG_yR8w', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800')
ON CONFLICT (id) DO UPDATE SET
    primary_muscle_group = EXCLUDED.primary_muscle_group,
    secondary_muscle_groups = EXCLUDED.secondary_muscle_groups,
    equipment_required = EXCLUDED.equipment_required,
    difficulty = EXCLUDED.difficulty,
    category = EXCLUDED.category,
    instructions = EXCLUDED.instructions,
    animated_demo_reference = EXCLUDED.animated_demo_reference,
    safe_joint_angle_ranges = EXCLUDED.safe_joint_angle_ranges,
    common_mistakes = EXCLUDED.common_mistakes,
    tempo = EXCLUDED.tempo,
    sets = EXCLUDED.sets,
    reps = EXCLUDED.reps,
    rest_time = EXCLUDED.rest_time,
    muscle_impact = EXCLUDED.muscle_impact,
    form_cues = EXCLUDED.form_cues,
    video_url = EXCLUDED.video_url,
    thumbnail_url = EXCLUDED.thumbnail_url;
