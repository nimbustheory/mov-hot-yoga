import { useState, useEffect, useCallback, createContext, useContext, useRef, useMemo } from "react";
import {
  Home, Calendar, TrendingUp, Users, CreditCard, CalendarDays,
  Menu, X, Bell, Settings, Shield, ChevronRight, ChevronDown, Clock,
  PartyPopper, ArrowUpRight, ArrowDownRight, Award, DollarSign, LayoutDashboard,
  UserCheck, Megaphone, LogOut, Plus, Edit3, Send, Check, Search, Copy, Info,
  CheckCircle, UserPlus, Heart, Flame, Star, Sun, Moon, Wind, Sparkles,
  Mountain, Leaf, Music, Gift, Share2, MapPin, Coffee, Dumbbell, Zap
} from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

// ═══════════════════════════════════════════════════════════════
//  STUDIO_IMAGES — Real image URLs from Möv's Squarespace CDN
// ═══════════════════════════════════════════════════════════════
const STUDIO_IMAGES = {
  hero: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/755a6cdc-bda8-470e-9d49-7483c7532585/041325_MOV_740.jpg",
  hotRoom: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/3c0f72ab-b3de-4551-8ef4-193a8978de8f/DSC03039-Enhanced-NR.jpeg",
  founders: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/d5406a5d-6ae5-47c9-8ced-10a3eee39f7c/Groupcopy.jpeg",
  grandOpening: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/d74959d7-a038-4178-a903-f427234e6044/mov_hot_yoga_grand_opening82.jpg",
  liveClass: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/4cbf98ff-153c-411e-be7e-a8dbaef5a2d4/Live+class+photo+at+mov+hot+yoga+and+barre.jpg",
  sculpt: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/0bb18355-fcdb-4ce8-ba0d-bd9af9d8ddcd/DSC02998.jpeg",
  restorative: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/aab60ad9-601a-403d-aad9-0b7ff43a7002/DSC_6160.JPG",
  barre: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/a33a5160-67b9-4a27-b264-db014acebc3a/DSC_6321.JPG",
  aboutHero: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/b5d22544-8661-4d96-b2e4-234ec2a0865f/mov_hot_yoga_grand_opening51.jpg",
  cafe: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/e9b3fac1-67ad-40fe-9b0a-023088021bcf/Lunchtime+Mov+marketplace+cafe.jpeg",
  community: "https://images.squarespace-cdn.com/content/v1/65e8cb9d0402967b88ee0bd6/e824b946-7f53-407c-8ef7-839a8ca02077/4G9A9674.jpg",
};

// ═══════════════════════════════════════════════════════════════
//  STUDIO_CONFIG — Möv Hot Yoga + Barre, Minneapolis MN
// ═══════════════════════════════════════════════════════════════
const STUDIO_CONFIG = {
  name: "MÖV",
  subtitle: "HOT YOGA + BARRE",
  tagline: "Connection happens when we join one breath with another.",
  logoMark: "M",
  logoImage: null,
  description: "More than a workout — your community for connection, belonging, and transformation in Minneapolis' Uptown.",
  heroLine1: "READY,",
  heroLine2: "SET, MÖV",

  address: { street: "3252-B W Lake St", city: "Minneapolis", state: "MN", zip: "55416" },
  phone: "(612) 920-3004",
  email: "hello@movhotyoga.com",
  neighborhood: "Uptown, Minneapolis",
  website: "https://movhotyoga.com",
  social: { instagram: "@movhotyoga" },

  theme: {
    accent:     { h: 12,  s: 72, l: 52 },   // Warm coral/terracotta
    accentAlt:  { h: 40,  s: 70, l: 50 },   // Amber gold
    warning:    { h: 350, s: 65, l: 50 },    // Rose pink
    primary:    { h: 20,  s: 8,  l: 10 },    // Warm charcoal
    surface:    { h: 30,  s: 18, l: 97 },    // Warm cream
    surfaceDim: { h: 25,  s: 14, l: 93 },    // Warm off-white
  },

  features: {
    workshops: true,
    retreats: false,
    soundBaths: false,
    teacherTrainings: false,
    practiceTracking: true,
    communityFeed: true,
    guestPasses: true,
    milestones: true,
    cafe: true,
    barre: true,
    volunteerProgram: true,
  },

  classCapacity: 35,
  specialtyCapacity: 20,
};

// ═══════════════════════════════════════════════════════════════
//  THEME SYSTEM
// ═══════════════════════════════════════════════════════════════
const hsl = (c, a) => a !== undefined ? `hsla(${c.h},${c.s}%,${c.l}%,${a})` : `hsl(${c.h},${c.s}%,${c.l}%)`;
const hslShift = (c, lShift) => `hsl(${c.h},${c.s}%,${Math.max(0, Math.min(100, c.l + lShift))}%)`;

const T = {
  accent: hsl(STUDIO_CONFIG.theme.accent),
  accentDark: hslShift(STUDIO_CONFIG.theme.accent, -12),
  accentLight: hslShift(STUDIO_CONFIG.theme.accent, 30),
  accentGhost: hsl(STUDIO_CONFIG.theme.accent, 0.08),
  accentBorder: hsl(STUDIO_CONFIG.theme.accent, 0.18),
  success: hsl(STUDIO_CONFIG.theme.accentAlt),
  successGhost: hsl(STUDIO_CONFIG.theme.accentAlt, 0.08),
  successBorder: hsl(STUDIO_CONFIG.theme.accentAlt, 0.18),
  warning: hsl(STUDIO_CONFIG.theme.warning),
  warningGhost: hsl(STUDIO_CONFIG.theme.warning, 0.08),
  warningBorder: hsl(STUDIO_CONFIG.theme.warning, 0.2),
  bg: hsl(STUDIO_CONFIG.theme.primary),
  bgCard: hsl(STUDIO_CONFIG.theme.surface),
  bgDim: hsl(STUDIO_CONFIG.theme.surfaceDim),
  text: "#2a2220",
  textMuted: "#7a6e68",
  textFaint: "#a89e98",
  border: "#e8e0d8",
  borderLight: "#f2ece6",
};

// ═══════════════════════════════════════════════════════════════
//  DATE HELPERS
// ═══════════════════════════════════════════════════════════════
const today = new Date().toISOString().split("T")[0];
const offsetDate = (d) => { const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().split("T")[0]; };
const formatDateShort = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
const formatDateLong = (s) => { const d = new Date(s + "T00:00:00"); return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }); };
const fmtTime = (t) => { const [h, m] = t.split(":"); const hr = +h; return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`; };

// ═══════════════════════════════════════════════════════════════
//  MOCK DATA — Möv Hot Yoga + Barre content
// ═══════════════════════════════════════════════════════════════
const TEACHERS = [
  { id: "t1", firstName: "Latricia", lastName: "Askew", role: "Co-Founder & Teacher", certs: ["RYT-200", "Hot Yoga Specialist"], specialties: ["MÖV Classic", "Hot Yoga", "Community Building"], yearsTeaching: 12, bio: "Latricia co-founded MÖV in 2023 with a mission to create a space where people feel a profound sense of connectedness and belonging. She teaches MÖV Classic with a focus on breath, alignment, and presence.", photo: "" },
  { id: "t2", firstName: "Sonya", lastName: "Baron", role: "Lead Teacher", certs: ["E-RYT-500", "YACEP"], specialties: ["MÖV Flow", "Vinyasa", "Ashtanga"], yearsTeaching: 15, bio: "Sonya brings deep expertise in vinyasa and ashtanga traditions. Her flow classes are creative, challenging, and set to playlists that make you lose yourself in the movement. A Twin Cities yoga fixture.", photo: "" },
  { id: "t3", firstName: "Erika", lastName: "Hansen", role: "Teacher", certs: ["RYT-200", "Barre Certified"], specialties: ["MÖV Barre", "MÖV Sculpt", "Pilates"], yearsTeaching: 8, bio: "Erika's barre and sculpt classes draw on her background in Pilates and fitness. Expect precision, creativity, and an upbeat energy that will push you to your edge while keeping you grounded.", photo: "" },
  { id: "t4", firstName: "Jennifer", lastName: "Kosch", role: "Teacher", certs: ["RYT-200", "Restorative Yoga"], specialties: ["MÖV Candlelight", "Restorative", "Slow Flow"], yearsTeaching: 10, bio: "Jennifer creates deeply restorative experiences. Her candlelight classes are a journey inward — calming music, dim lighting, and minimal weight-bearing postures designed to help you truly decompress.", photo: "" },
  { id: "t5", firstName: "Katlyn", lastName: "Daoust", role: "Teacher", certs: ["RYT-200", "Hot Yoga"], specialties: ["MÖV Classic", "MÖV Flow", "Hot Yoga"], yearsTeaching: 6, bio: "Katlyn's teaching is rooted in attention to detail and clear instruction. Her MÖV Classic classes honor the set sequence with precision, while her flow classes let her creative side shine.", photo: "" },
  { id: "t6", firstName: "Dave", lastName: "Driver", role: "Teacher", certs: ["RYT-200"], specialties: ["MÖV Classic", "Hot Yoga", "Breath Work"], yearsTeaching: 9, bio: "Dave brings a grounding, steady energy to the hot room. His teaching emphasizes breath as the foundation of practice, and his classes create a meditative space within the intensity of the heat.", photo: "" },
  { id: "t7", firstName: "Rebecca", lastName: "Strand", role: "Teacher", certs: ["RYT-200", "Sculpt & Barre"], specialties: ["MÖV Sculpt", "MÖV Barre", "Strength Training"], yearsTeaching: 7, bio: "Rebecca's sculpt classes combine foundational yoga postures with conditioning exercises targeting specific muscle groups. No weights, no jumping — just body weight, resistance, and serious results.", photo: "" },
  { id: "t8", firstName: "Courtney", lastName: "Coldwell", role: "Teacher", certs: ["RYT-200", "Ashtanga"], specialties: ["MÖV Ashtanga", "MÖV Flow", "Traditional Practice"], yearsTeaching: 11, bio: "Courtney leads MÖV's Ashtanga classes with reverence for the traditional set sequence. Her teaching connects breath to movement in a way that makes familiar postures feel brand new every time.", photo: "" },
];

const TODAYS_FOCUS = {
  id: "focus-today", date: today, name: "Heat & Heart Flow", type: "FLOW",
  style: "MÖV Flow", temp: "~101°F", duration: 60,
  description: "A powerful vinyasa practice linking breath with postures that build throughout class. Today's flow explores heart-opening backbends, creative transitions, and deep hip work set to an energizing playlist.",
  intention: "Connection happens when we join one breath with another. When we link one posture to the next.",
  teacherTip: "Use the consent circles on your mat if you'd like hands-on assists. This is your practice — honor it.",
  playlist: "Warm Honey — MÖV Spotify",
};

const PAST_PRACTICES = [
  { id: "p-y1", date: offsetDate(-1), name: "Candlelight Melt", type: "RESTORE", style: "MÖV Candlelight", temp: "Warm", duration: 60, description: "Minimal weight-bearing postures, deep stretching, and a dreamy meditative state. Candles, calming music, and space to journey inward.", intention: "Surrender to stillness. Let the world slow down.", teacherTip: "There's no wrong way to do this class. If you fall asleep, consider it a success." },
  { id: "p-y2", date: offsetDate(-2), name: "Sculpt & Sweat", type: "SCULPT", style: "MÖV Sculpt", temp: "~101°F", duration: 60, description: "Foundational yoga postures combined with conditioning exercises. Body weight and resistance in the heat. No jumping, no cardio bursts — just focused strength.", intention: "Strength isn't just muscle. It's showing up." },
  { id: "p-y3", date: offsetDate(-3), name: "Classic Standing Series", type: "CLASSIC", style: "MÖV Classic", temp: "~101°F", duration: 60, description: "The foundational hot yoga standing series — focused breathwork with longer posture holds. Set, predictable, accessible. The sequence that started it all.", intention: "Through repetition, we find freedom." },
];

const UPCOMING_PRACTICE = { id: "p-tmrw", date: offsetDate(1), name: "Slow Flow Sunday", type: "SLOW", style: "MÖV Slow Flow", temp: "~101°F", duration: 75, description: "An all-levels vinyasa with a slower pace made to help you mellow. Deep stretching, vital breathwork, foundational postures. Dim lighting and candles set the mood.", intention: "Slow is not less. Slow is more.", teacherTip: "Stay with your exhale. Let it be longer than your inhale." };

const CLASSES_TODAY = [
  { id: "cl1", time: "06:00", type: "MÖV Classic (60)", coach: "Dave Driver", capacity: 35, registered: 30, waitlist: 0 },
  { id: "cl2", time: "07:15", type: "MÖV Flow (60)", coach: "Sonya Baron", capacity: 35, registered: 35, waitlist: 4 },
  { id: "cl3", time: "09:00", type: "MÖV Classic (45)", coach: "Katlyn Daoust", capacity: 35, registered: 28, waitlist: 0 },
  { id: "cl4", time: "10:15", type: "MÖV Barre (60)", coach: "Erika Hansen", capacity: 20, registered: 18, waitlist: 0 },
  { id: "cl5", time: "12:00", type: "MÖV Flow (60)", coach: "Latricia Askew", capacity: 35, registered: 22, waitlist: 0 },
  { id: "cl6", time: "16:30", type: "MÖV Sculpt (60)", coach: "Rebecca Strand", capacity: 35, registered: 32, waitlist: 0 },
  { id: "cl7", time: "17:45", type: "MÖV Classic (60)", coach: "Courtney Coldwell", capacity: 35, registered: 35, waitlist: 5 },
  { id: "cl8", time: "19:15", type: "MÖV Candlelight (60)", coach: "Jennifer Kosch", capacity: 35, registered: 26, waitlist: 0 },
];

const WEEKLY_SCHEDULE = [
  { day: "Monday", classes: [{ time: "06:00", type: "MÖV Classic (60)", coach: "Dave" }, { time: "07:15", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "09:00", type: "MÖV Classic (45)", coach: "Katlyn" }, { time: "10:15", type: "MÖV Barre (60)", coach: "Erika" }, { time: "12:00", type: "MÖV Flow (60)", coach: "Latricia" }, { time: "16:30", type: "MÖV Sculpt (60)", coach: "Rebecca" }, { time: "17:45", type: "MÖV Classic (60)", coach: "Courtney" }, { time: "19:15", type: "MÖV Candlelight (60)", coach: "Jennifer" }] },
  { day: "Tuesday", classes: [{ time: "06:00", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "07:15", type: "MÖV Classic (60)", coach: "Katlyn" }, { time: "09:00", type: "MÖV Sculpt (60)", coach: "Rebecca" }, { time: "10:15", type: "MÖV Barre (60)", coach: "Erika" }, { time: "12:00", type: "MÖV Classic (45)", coach: "Dave" }, { time: "16:30", type: "MÖV Flow (60)", coach: "Latricia" }, { time: "17:45", type: "MÖV Classic (60)", coach: "Courtney" }] },
  { day: "Wednesday", classes: [{ time: "06:00", type: "MÖV Classic (60)", coach: "Dave" }, { time: "07:15", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "09:00", type: "MÖV Classic (45)", coach: "Katlyn" }, { time: "10:15", type: "MÖV Barre (60)", coach: "Erika" }, { time: "12:00", type: "MÖV Ashtanga (75)", coach: "Courtney" }, { time: "16:30", type: "MÖV Sculpt (60)", coach: "Rebecca" }, { time: "17:45", type: "MÖV Flow (60)", coach: "Latricia" }, { time: "19:15", type: "MÖV Slow Flow (60)", coach: "Jennifer" }] },
  { day: "Thursday", classes: [{ time: "06:00", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "07:15", type: "MÖV Classic (60)", coach: "Dave" }, { time: "09:00", type: "MÖV Sculpt (60)", coach: "Rebecca" }, { time: "10:15", type: "MÖV Barre (60)", coach: "Erika" }, { time: "12:00", type: "MÖV Classic (45)", coach: "Katlyn" }, { time: "16:30", type: "MÖV Flow (60)", coach: "Latricia" }, { time: "17:45", type: "MÖV Classic (60)", coach: "Courtney" }] },
  { day: "Friday", classes: [{ time: "06:00", type: "MÖV Classic (60)", coach: "Dave" }, { time: "07:15", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "09:00", type: "MÖV Classic (45)", coach: "Katlyn" }, { time: "12:00", type: "MÖV Flow (60)", coach: "Latricia" }, { time: "16:30", type: "MÖV Candlelight (60)", coach: "Jennifer" }] },
  { day: "Saturday", classes: [{ time: "07:00", type: "MÖV Classic (60)", coach: "Dave" }, { time: "08:30", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "10:00", type: "Intro to Hot Yoga (60)", coach: "Katlyn" }, { time: "10:00", type: "MÖV Barre (60)", coach: "Rebecca" }, { time: "11:30", type: "MÖV Ashtanga (75)", coach: "Courtney" }] },
  { day: "Sunday", classes: [{ time: "08:00", type: "MÖV Classic (60)", coach: "Latricia" }, { time: "09:30", type: "MÖV Flow (60)", coach: "Sonya" }, { time: "10:00", type: "MÖV Barre (60)", coach: "Erika" }, { time: "11:00", type: "Intro to Hot Yoga (60)", coach: "Katlyn" }, { time: "17:00", type: "MÖV Slow Flow (75)", coach: "Jennifer" }] },
];

const COMMUNITY_FEED = [
  { id: "cf1", user: "Amanda F.", milestone: "100 Classes", message: "This is hands-down my favorite yoga studio in the Twin Cities. 100 classes in and I can't imagine life without this community.", date: today, celebrations: 42 },
  { id: "cf2", user: "Marcus T.", milestone: "30-Day Streak", message: "30 days on the mat at MÖV. The heat, the teachers, the tea after class — it all adds up to something special.", date: today, celebrations: 28 },
  { id: "cf3", user: "Paige P.", milestone: "First Barre!", message: "Finally tried barre and my legs are SHAKING. Rebecca's class was incredible. Coming back Thursday!", date: offsetDate(-1), celebrations: 35 },
  { id: "cf4", user: "Dan H.", milestone: "1 Year Member", message: "One year at MÖV. I came for the hot yoga and stayed for the community. And the cafe smoothies.", date: offsetDate(-1), celebrations: 51 },
];

const MILESTONE_BADGES = {
  "First Class": { icon: Leaf, color: T.accent },
  "10 Classes": { icon: Wind, color: T.accent },
  "50 Classes": { icon: Mountain, color: T.accent },
  "100 Classes": { icon: Sun, color: T.success },
  "7-Day Streak": { icon: Flame, color: T.warning },
  "30-Day Streak": { icon: Sparkles, color: T.warning },
  "First Barre": { icon: Dumbbell, color: "#8b5cf6" },
  "Heat Seeker": { icon: Zap, color: "#e05535" },
  "1 Year Member": { icon: Award, color: T.success },
};

const EVENTS = [
  { id: "ev1", name: "Simpson Housing Volunteer Cook Night", date: offsetDate(6), startTime: "16:30", type: "Volunteer", description: "Join fellow MÖV community members to prepare and serve meals at Simpson Housing shelter. A beautiful way to take yoga off the mat and connect with our wider Minneapolis community.", fee: 0, maxParticipants: 12, registered: 8, status: "Sign Up Open" },
  { id: "ev2", name: "Summer Solstice Flow on the Greenway", date: "2026-06-20", startTime: "07:00", type: "Special Event", description: "Celebrate the longest day with a sunrise MÖV Flow on the Midtown Greenway, right outside our patio doors. Complimentary smoothies from MÖV Marketplace after class.", fee: 15, maxParticipants: 50, registered: 36, status: "Registration Open" },
  { id: "ev3", name: "Candlelight + Sound Journey", date: "2026-05-09", startTime: "19:00", type: "Workshop", description: "An extended candlelight restorative session paired with live crystal bowl sound healing. Two hours of deep rest and vibrational therapy.", fee: 40, maxParticipants: 30, registered: 24, status: "Registration Open" },
  { id: "ev4", name: "MÖV x MÖV Marketplace: Nourish Night", date: "2026-05-16", startTime: "18:00", type: "Community Event", description: "Slow Flow class followed by a communal dinner at MÖV Marketplace Cafe. Vegan-friendly scratch-made menu, conversation, and community.", fee: 35, maxParticipants: 25, registered: 19, status: "Open" },
];

const MEMBERSHIP_TIERS = [
  { id: "m1", name: "Drop In", type: "drop-in", price: 35, period: "per class", features: ["1 class credit", "Expires 1 month after purchase", "Transferable to a guest"], popular: false },
  { id: "m2", name: "5 Class Card", type: "pack", price: 125, period: "5 classes", features: ["$25 per class", "7-day advance booking", "Expires 3 months after purchase"], popular: false },
  { id: "m3", name: "10 Class Card", type: "pack", price: 225, period: "10 classes", features: ["$22.50 per class", "7-day advance booking", "Expires 6 months after purchase"], popular: false },
  { id: "m4", name: "Monthly Membership", type: "unlimited", price: 135, period: "/month", features: ["Unlimited classes", "10-day advance booking", "1 guest pass per month", "Cancel anytime", "Complimentary tea after class"], popular: true },
  { id: "m5", name: "Annual Membership", type: "annual", price: 1380, period: "/year", features: ["Only $115/month", "Unlimited classes", "12 guest passes up front", "10-day advance booking", "No auto-renew"], popular: false },
  { id: "m6", name: "One Month Unlimited", type: "single-month", price: 150, period: "/month", features: ["Unlimited classes", "10-day advance booking", "Does not auto-renew", "Great for visitors"], popular: false },
];

const ANNOUNCEMENTS = [
  { id: "a1", title: "Join the MÖVment Newsletter!", message: "Stay connected with announcements about special classes, sales, studio events, and more. Sign up at the front desk or on our website.", type: "celebration", pinned: true },
  { id: "a2", title: "Quiet Hot Room Policy", message: "As a reminder, MÖV observes a quiet hot room. Please save conversations for the lounge area where complimentary tea awaits after class.", type: "info", pinned: false },
];

const MEMBERS_DATA = [
  { id: "mem1", name: "Amanda Fischer", email: "amanda@email.com", membership: "Monthly", status: "active", joined: "2023-06-15", checkIns: 342, lastVisit: today },
  { id: "mem2", name: "Marcus Torres", email: "marcus@email.com", membership: "Monthly", status: "active", joined: "2024-01-20", checkIns: 198, lastVisit: offsetDate(-1) },
  { id: "mem3", name: "Paige Peterson", email: "paige@email.com", membership: "10 Class Card", status: "active", joined: "2026-01-10", checkIns: 8, lastVisit: offsetDate(-1) },
  { id: "mem4", name: "Dan Humphrey", email: "dan@email.com", membership: "Annual", status: "active", joined: "2025-03-01", checkIns: 156, lastVisit: today },
  { id: "mem5", name: "Luiza Kovacs", email: "luiza@email.com", membership: "Monthly", status: "active", joined: "2024-04-12", checkIns: 267, lastVisit: today },
  { id: "mem6", name: "Krystal Nguyen", email: "krystal@email.com", membership: "Monthly", status: "frozen", joined: "2023-10-01", checkIns: 112, lastVisit: offsetDate(-21) },
  { id: "mem7", name: "Ed Donovan", email: "ed@email.com", membership: "Annual", status: "active", joined: "2024-09-01", checkIns: 189, lastVisit: offsetDate(-2) },
  { id: "mem8", name: "Megan Kim", email: "megan@email.com", membership: "Monthly", status: "active", joined: "2023-08-15", checkIns: 378, lastVisit: today },
];

const ADMIN_METRICS = {
  activeMembers: 248, memberChange: 18,
  todayCheckIns: 94, weekCheckIns: 586,
  monthlyRevenue: 38200, revenueChange: 13.5,
  renewalRate: 92.4, cafeRevenue: 8400,
};

const ADMIN_CHARTS = {
  attendance: [
    { day: "Mon", total: 96, avg: 12 }, { day: "Tue", total: 82, avg: 12 },
    { day: "Wed", total: 90, avg: 11 }, { day: "Thu", total: 88, avg: 13 },
    { day: "Fri", total: 72, avg: 14 }, { day: "Sat", total: 104, avg: 21 },
    { day: "Sun", total: 78, avg: 16 },
  ],
  revenue: [
    { month: "Jun", revenue: 24800 }, { month: "Jul", revenue: 26200 },
    { month: "Aug", revenue: 28400 }, { month: "Sep", revenue: 30100 },
    { month: "Oct", revenue: 31600 }, { month: "Nov", revenue: 33200 },
    { month: "Dec", revenue: 31800 }, { month: "Jan", revenue: 34600 },
    { month: "Feb", revenue: 36800 }, { month: "Mar", revenue: 38200 },
  ],
  classPopularity: [
    { name: "6:00 AM", pct: 86 }, { name: "7:15 AM", pct: 98 },
    { name: "9:00 AM", pct: 78 }, { name: "10:15 AM", pct: 88 },
    { name: "12:00 PM", pct: 62 }, { name: "4:30 PM", pct: 92 },
    { name: "5:45 PM", pct: 100 }, { name: "7:15 PM", pct: 74 },
  ],
  membershipBreakdown: [
    { name: "Monthly", value: 128, color: T.accent },
    { name: "Annual", value: 52, color: T.success },
    { name: "Class Cards", value: 44, color: T.warning },
    { name: "One Month", value: 12, color: "#8b5cf6" },
    { name: "Drop-In", value: 12, color: T.textMuted },
  ],
};

// ═══════════════════════════════════════════════════════════════
//  APP CONTEXT
// ═══════════════════════════════════════════════════════════════
const AppContext = createContext(null);

// ═══════════════════════════════════════════════════════════════
//  PAGE HERO COMPONENT
// ═══════════════════════════════════════════════════════════════
function PageHero({ title, subtitle, image }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = image && !imgFailed;
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onerror = () => setImgFailed(true);
    }
  }, [image]);
  return (
    <div style={{ position: "relative", minHeight: 220, display: "flex", alignItems: "flex-end", padding: "28px 20px 24px", background: showImage ? "none" : `linear-gradient(165deg, ${T.bg} 0%, hsl(18,10%,14%) 100%)`, color: "#fff", overflow: "hidden", marginBottom: 16 }}>
      {showImage && (
        <>
          <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
        </>
      )}
      <div style={{ position: "relative" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 34, margin: 0, fontWeight: 700, letterSpacing: "-0.02em" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 14, color: "#d8cec8", margin: "4px 0 0" }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CONSUMER PAGES
// ═══════════════════════════════════════════════════════════════

function HomePage() {
  const { classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed } = useContext(AppContext);
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
  const upcoming = CLASSES_TODAY.filter(c => c.time >= currentTime).slice(0, 4);

  return (
    <div className="pb-6">
      {/* Hero */}
      <section style={{ position: "relative", color: "#fff", padding: "36px 22px", minHeight: 260, display: "flex", alignItems: "flex-end", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.hero})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} />
        <div style={{ position: "relative" }}>
          <p style={{ color: T.accent, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8 }}>{formatDateLong(today)}</p>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 48, lineHeight: 0.95, letterSpacing: "-0.02em", margin: 0, fontWeight: 700 }}>
            {STUDIO_CONFIG.heroLine1}<br/>
            <span style={{ color: T.accent, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 52 }}>{STUDIO_CONFIG.heroLine2}</span>
          </h1>
          <p style={{ color: "#c8b8b0", fontSize: 13, maxWidth: 280, marginTop: 10, lineHeight: 1.5 }}>{STUDIO_CONFIG.description}</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section style={{ padding: "0 16px", marginTop: -16, position: "relative", zIndex: 10 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {[
            { icon: Calendar, label: "Reserve", page: "schedule", color: T.accent },
            { icon: Flame, label: "Practice", page: "practice", color: T.success },
            { icon: Heart, label: "Community", page: "community", color: T.warning },
            { icon: Coffee, label: "Cafe", page: "cafe", color: "#8b5cf6" },
          ].map(a => (<QuickAction key={a.label} {...a} />))}
        </div>
      </section>

      {/* Today's Practice Focus */}
      <section style={{ padding: "0 16px", marginTop: 24 }}>
        <SectionHeader title="Today's Practice" linkText="All Classes" linkPage="classes" />
        <PracticeCardFull practice={TODAYS_FOCUS} variant="featured" />
      </section>

      {/* Upcoming Classes */}
      <section style={{ padding: "0 16px", marginTop: 28 }}>
        <SectionHeader title="Upcoming Classes" linkText="Full Schedule" linkPage="schedule" />
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {upcoming.length > 0 ? upcoming.map(c => {
            const regs = (classRegistrations[c.id] || 0);
            const totalReg = c.registered + regs;
            const isFull = totalReg >= c.capacity;
            return (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 44 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, color: T.text, fontWeight: 700 }}>{fmtTime(c.time).split(":")[0]}</span>
                  <span style={{ display: "block", fontSize: 11, color: T.textMuted }}>{fmtTime(c.time).slice(-5)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 600, color: T.text, fontSize: 14, margin: 0 }}>{c.type}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{c.coach.split(" ")[0]}</p>
                </div>
                <div style={{ textAlign: "right", marginRight: 8 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: isFull ? T.warning : totalReg >= c.capacity * 0.8 ? T.success : T.accent }}>{totalReg}/{c.capacity}</span>
                  {c.waitlist > 0 && <span style={{ display: "block", fontSize: 11, color: T.textFaint }}>+{c.waitlist} waitlist</span>}
                </div>
                <button onClick={() => openReservation({ ...c, date: today })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: isFull ? T.bgDim : T.accent, color: isFull ? T.textMuted : "#fff", transition: "all 0.15s" }}>
                  {isFull ? "Waitlist" : "Reserve"}
                </button>
              </div>
            );
          }) : (<EmptyState icon={Moon} message="No more classes today" sub="See tomorrow's schedule" />)}
        </div>
      </section>

      {/* Community Feed */}
      {STUDIO_CONFIG.features.communityFeed && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Community" linkText="View All" linkPage="community" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {COMMUNITY_FEED.slice(0, 3).map(item => {
              const myC = feedCelebrations[item.id] || 0;
              return (
                <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", background: `linear-gradient(135deg, ${T.successGhost}, transparent)`, border: `1px solid ${T.successBorder}`, borderRadius: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.success, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Sparkles size={18} color="#fff" /></div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{item.user} <span style={{ color: T.success }}>{item.milestone}</span></p>
                    <p style={{ fontSize: 12, color: "#6b5e58", margin: "2px 0 0", lineHeight: 1.4 }}>{item.message.length > 60 ? item.message.slice(0, 60) + "…" : item.message}</p>
                  </div>
                  <button onClick={() => celebrateFeed(item.id)} style={{ padding: 8, borderRadius: 8, border: "none", background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                    <Heart size={18} color={T.success} fill={myC > 0 ? T.success : "none"} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Announcements */}
      {ANNOUNCEMENTS.length > 0 && (
        <section style={{ padding: "0 16px", marginTop: 28 }}>
          <SectionHeader title="Announcements" />
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ANNOUNCEMENTS.map(a => (
              <div key={a.id} style={{ padding: "14px 16px", borderRadius: 12, borderLeft: `4px solid ${a.type === "celebration" ? T.accent : T.textMuted}`, background: a.type === "celebration" ? T.accentGhost : T.bgDim }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: T.text, margin: 0 }}>{a.title}</h3>
                    <p style={{ fontSize: 13, color: "#6b5e58", margin: "4px 0 0" }}>{a.message}</p>
                  </div>
                  {a.pinned && <span style={{ fontSize: 11, fontWeight: 600, color: T.accent, background: T.accentGhost, padding: "2px 8px", borderRadius: 99 }}>Pinned</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section style={{ padding: "0 16px", marginTop: 28 }}><CTACard /></section>
    </div>
  );
}

function ClassesPage() {
  const [expandedPractice, setExpandedPractice] = useState(null);
  const allPractices = [TODAYS_FOCUS, ...PAST_PRACTICES, UPCOMING_PRACTICE].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      <PageHero title="Classes" subtitle="Past, present, and upcoming practice" image={STUDIO_IMAGES.hotRoom} />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {allPractices.map(p => (<PracticeCardFull key={p.id} practice={p} expanded={expandedPractice === p.id} onToggle={() => setExpandedPractice(expandedPractice === p.id ? null : p.id)} />))}
      </div>
    </div>
  );
}

function SchedulePage() {
  const [selectedDay, setSelectedDay] = useState(new Date().getDay() === 0 ? 6 : new Date().getDay() - 1);
  const { openReservation } = useContext(AppContext);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return (
    <div>
      <PageHero title="Schedule" subtitle="Reserve your spot — 40+ classes weekly" image={STUDIO_IMAGES.liveClass} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "flex", gap: 4, marginBottom: 16, overflowX: "auto", paddingBottom: 4 }}>
          {days.map((d, i) => (<button key={d} onClick={() => setSelectedDay(i)} style={{ padding: "8px 14px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", background: selectedDay === i ? T.accent : T.bgDim, color: selectedDay === i ? "#fff" : T.textMuted }}>{d}</button>))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {WEEKLY_SCHEDULE[selectedDay]?.classes.map((cls, i) => {
            const isSpecial = cls.type.includes("Candlelight") || cls.type.includes("Slow") || cls.type.includes("Barre") || cls.type.includes("Ashtanga") || cls.type.includes("Intro");
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12 }}>
                <div style={{ textAlign: "center", minWidth: 56 }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: T.text, fontWeight: 700 }}>{fmtTime(cls.time)}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: T.text, margin: 0 }}>{cls.type}</p>
                    {isSpecial && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", padding: "1px 6px", borderRadius: 4, background: T.warningGhost, color: T.warning }}>Special</span>}
                  </div>
                  {cls.coach && <p style={{ fontSize: 12, color: T.textMuted, margin: "3px 0 0" }}>{cls.coach}</p>}
                </div>
                <button onClick={() => openReservation({ id: `sched-${selectedDay}-${i}`, time: cls.time, type: cls.type, coach: cls.coach || "TBD", capacity: cls.type.includes("Barre") ? STUDIO_CONFIG.specialtyCapacity : STUDIO_CONFIG.classCapacity, registered: Math.floor(Math.random() * 10) + 18, waitlist: 0, dayLabel: dayNames[selectedDay] })} style={{ padding: "8px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: T.accent, color: "#fff" }}>Reserve</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PracticePage() {
  const [activeTab, setActiveTab] = useState("log");
  const [reflection, setReflection] = useState({ energy: 4, focus: 4, notes: "" });
  const [saved, setSaved] = useState(null);
  const handleSave = () => { setSaved("log"); setTimeout(() => setSaved(null), 2000); setReflection({ energy: 4, focus: 4, notes: "" }); };
  const streakDays = 16; const totalClasses = 108;
  return (
    <div>
      <PageHero title="My Practice" subtitle="Track your journey and celebrate growth" image={STUDIO_IMAGES.sculpt} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
          {[{ icon: Flame, val: streakDays, label: "Day Streak", ghost: T.accentGhost, bdr: T.accentBorder, clr: T.accent },
            { icon: Star, val: totalClasses, label: "Total Classes", ghost: T.successGhost, bdr: T.successBorder, clr: T.success },
            { icon: Mountain, val: 7, label: "Milestones", ghost: T.warningGhost, bdr: T.warningBorder, clr: T.warning }].map((s,i) => (
            <div key={i} style={{ background: s.ghost, border: `1px solid ${s.bdr}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
              <s.icon size={20} color={s.clr} style={{ margin: "0 auto 4px" }} />
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 700, color: T.text }}>{s.val}</div>
              <div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: T.bgDim, borderRadius: 10, padding: 4 }}>
          {[{ id: "log", label: "Reflection" }, { id: "milestones", label: "Milestones" }].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === tab.id ? T.bgCard : "transparent", color: activeTab === tab.id ? T.text : T.textMuted, boxShadow: activeTab === tab.id ? "0 1px 3px rgba(0,0,0,.06)" : "none" }}>{tab.label}</button>
          ))}
        </div>
        {activeTab === "log" && (
          <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><Leaf size={18} color={T.accent} /><h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Post-Practice Reflection</h3></div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[{ label: "Energy Level", key: "energy", colors: [T.accent, T.accent], icons: [Moon, Sun, Sparkles] },
                { label: "Focus & Presence", key: "focus", colors: [T.success, T.success], icons: [Wind, Heart, Sparkles] }].map(row => (
                <div key={row.key}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{row.label}</label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {[1,2,3,4,5].map(n => { const Icon = n <= 2 ? row.icons[0] : n <= 4 ? row.icons[1] : row.icons[2]; const active = reflection[row.key] >= n; return (
                      <button key={n} onClick={() => setReflection({...reflection, [row.key]: n})} style={{ width: 44, height: 44, borderRadius: 10, border: `1px solid ${active ? row.colors[0] : T.border}`, background: active ? (row.key === "energy" ? T.accentGhost : T.successGhost) : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={18} color={active ? row.colors[0] : T.textFaint} />
                      </button>
                    );})}
                  </div>
                </div>
              ))}
              <InputField label="Notes / Gratitude" value={reflection.notes} onChange={v => setReflection({...reflection, notes: v})} placeholder="What came up for you on the mat today?" multiline />
              <button onClick={handleSave} style={{ padding: "12px 0", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: "0.03em", fontSize: 17 }}>
                {saved === "log" ? <><Check size={16} style={{ display: "inline", verticalAlign: "middle" }} /> Saved</> : "Save Reflection"}
              </button>
            </div>
          </div>
        )}
        {activeTab === "milestones" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {Object.entries(MILESTONE_BADGES).map(([name, badge]) => {
              const earned = ["First Class","10 Classes","50 Classes","100 Classes","7-Day Streak","30-Day Streak","First Barre"].includes(name);
              return (
                <div key={name} style={{ background: earned ? T.bgCard : T.bgDim, border: `1px solid ${earned ? badge.color + "30" : T.border}`, borderRadius: 12, padding: "16px 14px", textAlign: "center", opacity: earned ? 1 : 0.5 }}>
                  <badge.icon size={28} color={earned ? badge.color : T.textFaint} style={{ marginBottom: 8 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 11, color: T.textMuted, margin: "4px 0 0" }}>{earned ? <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>Earned <Check size={10} /></span> : "Keep going"}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CommunityPage() {
  const { feedCelebrations, celebrateFeed } = useContext(AppContext);
  return (
    <div>
      <PageHero title="Community" subtitle="Celebrate each other's journey in the MÖVment" image={STUDIO_IMAGES.community} />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {COMMUNITY_FEED.map(item => {
          const myC = feedCelebrations[item.id] || 0;
          return (
            <div key={item.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{item.user[0]}</div>
                <div><p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: T.text }}>{item.user}</p><p style={{ fontSize: 12, color: T.textMuted, margin: "1px 0 0" }}>{formatDateShort(item.date)}</p></div>
                <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.successGhost, color: T.success }}>{item.milestone}</span>
              </div>
              <p style={{ fontSize: 14, color: "#4a3e38", lineHeight: 1.5, margin: "0 0 12px" }}>{item.message}</p>
              <button onClick={() => celebrateFeed(item.id)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 8, border: `1px solid ${myC > 0 ? T.successBorder : T.border}`, background: myC > 0 ? T.successGhost : "transparent", cursor: "pointer" }}>
                <Heart size={16} color={T.success} fill={myC > 0 ? T.success : "none"} />
                <span style={{ fontSize: 13, fontWeight: 600, color: T.success }}>{item.celebrations + myC}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TeachersPage() {
  const [expandedTeacher, setExpandedTeacher] = useState(null);
  return (
    <div>
      <PageHero title="Teachers" subtitle="Meet the humans who make MÖV so magical" image={STUDIO_IMAGES.aboutHero} />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {TEACHERS.map(teacher => {
          const expanded = expandedTeacher === teacher.id;
          return (
            <div key={teacher.id} onClick={() => setExpandedTeacher(expanded ? null : teacher.id)} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 22, color: "#fff", flexShrink: 0, fontWeight: 700 }}>{teacher.firstName[0]}{teacher.lastName[0]}</div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{teacher.firstName} {teacher.lastName}</h3>
                  <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
                  <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>{teacher.yearsTeaching} years teaching</p>
                </div>
                <ChevronDown size={18} color={T.textFaint} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
              </div>
              {expanded && (
                <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${T.borderLight}`, paddingTop: 14 }}>
                  <p style={{ fontSize: 13, color: "#5a4e48", lineHeight: 1.6, margin: "0 0 12px" }}>{teacher.bio}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>{teacher.specialties.map(s => (<span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>{s}</span>))}</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{teacher.certs.map(c => (<span key={c} style={{ fontSize: 11, fontWeight: 600, padding: "3px 8px", borderRadius: 6, background: T.bgDim, color: T.textMuted }}>{c}</span>))}</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MembershipPage() {
  return (
    <div>
      <PageHero title="Membership" subtitle="Practice on your own terms" image={STUDIO_IMAGES.grandOpening} />
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: T.bgCard, border: `1px solid ${tier.popular ? T.accent : T.border}`, borderRadius: 14, padding: "20px 18px", position: "relative", overflow: "hidden" }}>
            {tier.popular && (<div style={{ position: "absolute", top: 12, right: -28, background: T.accent, color: "#fff", fontSize: 10, fontWeight: 700, padding: "3px 32px", transform: "rotate(45deg)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Popular</div>)}
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, margin: "0 0 4px", color: T.text, fontWeight: 700 }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 38, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (<li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13, color: "#5a4e48" }}><CheckCircle size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}</li>))}
            </ul>
            <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", background: tier.popular ? T.accent : T.bg, color: "#fff" }}>Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function CafePage() {
  return (
    <div>
      <PageHero title="MÖV Marketplace" subtitle="Vegan-friendly cafe & grocer, on-site" image={STUDIO_IMAGES.cafe} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "20px 18px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center" }}><Coffee size={24} color={T.accent} /></div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: T.text }}>Post-Class Nourishment</h3>
              <p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Right inside the studio</p>
            </div>
          </div>
          <p style={{ fontSize: 14, color: "#5a4e48", lineHeight: 1.6, margin: "0 0 14px" }}>MÖV Marketplace Cafe is a vegan-friendly cafe and grocer located inside the studio. Find scratch-made breakfast and lunch, grab-and-go goodies, smoothies, salads, wraps, and artisanal pantry provisions.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {["Smoothies & Fresh Juices", "Made-to-Order Breakfast & Lunch", "Grab-and-Go Salads & Wraps", "Artisanal Pantry & Home Goods", "Giftable Items & Provisions"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#5a4e48" }}>
                <CheckCircle size={14} color={T.accent} style={{ flexShrink: 0 }} />{item}
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(18,10%,14%))`, borderRadius: 14, padding: "20px 18px", color: "#fff", textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#c8b8b0", margin: "0 0 14px", lineHeight: 1.5 }}>Complimentary herbal tea is served in our studio "living room" after every class. Stay, chat, and connect with fellow practitioners.</p>
          <p style={{ fontSize: 12, color: T.accent, fontWeight: 600 }}>themarketplacebymov.com</p>
        </div>
      </div>
    </div>
  );
}

function EventsPage() {
  return (
    <div>
      <PageHero title="Events" subtitle="Workshops, community nights, and volunteer opportunities" image={STUDIO_IMAGES.barre} />
      <div style={{ padding: "0 16px" }}>
        {EVENTS.map(ev => (
          <div key={ev.id} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(18,10%,14%))`, padding: "20px 18px", color: "#fff" }}>
              <span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.accent }}>{ev.type}</span>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, margin: "6px 0 4px", fontWeight: 700 }}>{ev.name}</h3>
              <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 13, color: "#c8b8b0" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Calendar size={14} /> {formatDateShort(ev.date)}</span>
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={14} /> {fmtTime(ev.startTime)}</span>
              </div>
            </div>
            <div style={{ padding: "16px 18px" }}>
              <p style={{ fontSize: 13, color: "#5a4e48", lineHeight: 1.6, margin: "0 0 14px" }}>{ev.description}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                <StatBox label="Price" value={ev.fee === 0 ? "Free" : `$${ev.fee}`} />
                <StatBox label="Spots" value={`${ev.registered}/${ev.maxParticipants}`} />
              </div>
              <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: "none", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'Syne', sans-serif", background: T.accent, color: "#fff" }}>{ev.fee === 0 ? "Sign Up" : "Register Now"}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GuestPassesPage() {
  const [copied, setCopied] = useState(false);
  const passCode = "MOV-FRIEND-2026";
  return (
    <div>
      <PageHero title="Guest Passes" subtitle="Share the MÖVment with someone you love" image={STUDIO_IMAGES.restorative} />
      <div style={{ padding: "0 16px" }}>
        <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(18,10%,14%))`, borderRadius: 14, padding: "24px 20px", color: "#fff", textAlign: "center", marginBottom: 16 }}>
          <Gift size={32} color={T.accent} style={{ marginBottom: 12 }} />
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, margin: "0 0 8px", fontWeight: 700 }}>Bring a Friend</h3>
          <p style={{ fontSize: 13, color: "#c8b8b0", maxWidth: 280, margin: "0 auto 20px", lineHeight: 1.5 }}>Members get 1 guest pass per month. Share your practice with someone special.</p>
          <div style={{ background: "rgba(255,255,255,.08)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontFamily: "monospace", fontSize: 18, letterSpacing: "0.08em", color: T.accent }}>{passCode}</span>
            <button onClick={() => { navigator.clipboard?.writeText(passCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }} style={{ padding: "6px 10px", borderRadius: 6, border: "none", background: T.accent, color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>{copied ? <Check size={14} /> : <Copy size={14} />}</button>
          </div>
          <p style={{ fontSize: 12, color: "#7a6e68" }}>1 of 1 pass remaining this month</p>
        </div>
        <div style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: "16px 18px" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 8px", color: T.text }}>How It Works</h3>
          {["Share your pass code with a friend", "They book online using the guest pass option", "Their first class is included — any format", "Both of you earn a community milestone!"].map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 0" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.accent, flexShrink: 0 }}>{i + 1}</div>
              <p style={{ fontSize: 13, color: "#5a4e48", margin: 0, lineHeight: 1.5 }}>{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  ADMIN PAGES
// ═══════════════════════════════════════════════════════════════
function AdminDashboard() {
  const metrics = [
    { label: "Active Members", value: ADMIN_METRICS.activeMembers, change: `+${ADMIN_METRICS.memberChange}`, positive: true, icon: Users, color: T.accent },
    { label: "Today's Check-ins", value: ADMIN_METRICS.todayCheckIns, change: `${ADMIN_METRICS.weekCheckIns} this week`, positive: true, icon: Calendar, color: T.success },
    { label: "Monthly Revenue", value: `$${ADMIN_METRICS.monthlyRevenue.toLocaleString()}`, change: `+${ADMIN_METRICS.revenueChange}%`, positive: true, icon: DollarSign, color: T.warning },
    { label: "Cafe Revenue", value: `$${ADMIN_METRICS.cafeRevenue.toLocaleString()}`, change: "MÖV Marketplace", positive: true, icon: Coffee, color: "#8b5cf6" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div><h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Dashboard</h1><p style={{ fontSize: 13, color: T.textMuted, margin: "4px 0 0" }}>Welcome back. Here's what's happening at {STUDIO_CONFIG.name}.</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
        {metrics.map((m, i) => (
          <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: `${m.color}18`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}><m.icon size={18} color={m.color} /></div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, color: T.text, fontWeight: 700 }}>{m.value}</div>
            <span style={{ display: "flex", alignItems: "center", fontSize: 12, fontWeight: 600, color: "#16a34a", marginTop: 4 }}><ArrowUpRight size={12} /> {m.change}</span>
            <p style={{ fontSize: 13, color: T.textMuted, margin: "6px 0 0" }}>{m.label}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 14 }}>
        <AdminCard title="Weekly Attendance"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={ADMIN_CHARTS.attendance}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="day" stroke={T.textMuted} fontSize={12} /><YAxis stroke={T.textMuted} fontSize={12} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: T.text }} /><Bar dataKey="total" fill={T.accent} radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div></AdminCard>
        <AdminCard title="Revenue Trend"><div style={{ height: 220 }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={ADMIN_CHARTS.revenue}><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis dataKey="month" stroke={T.textMuted} fontSize={12} /><YAxis stroke={T.textMuted} fontSize={12} tickFormatter={v => `$${v / 1000}k`} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: T.text }} formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} /><defs><linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.accent} stopOpacity={0.3} /><stop offset="100%" stopColor={T.accent} stopOpacity={0} /></linearGradient></defs><Area type="monotone" dataKey="revenue" stroke={T.accent} fill="url(#revGrad)" /></AreaChart></ResponsiveContainer></div></AdminCard>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        <AdminCard title="Membership Breakdown">
          <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ADMIN_CHARTS.membershipBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={4}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => (<Cell key={i} fill={e.color} />))}</Pie><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: T.text }} /></PieChart></ResponsiveContainer></div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>{ADMIN_CHARTS.membershipBreakdown.map((e, i) => (<div key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}><div style={{ width: 8, height: 8, borderRadius: "50%", background: e.color }} /><span style={{ fontSize: 11, color: T.textMuted }}>{e.name} ({e.value})</span></div>))}</div>
        </AdminCard>
        <AdminCard title="Class Popularity (% Capacity)"><div style={{ height: 210 }}><ResponsiveContainer width="100%" height="100%"><BarChart data={ADMIN_CHARTS.classPopularity} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /><XAxis type="number" domain={[0, 100]} stroke={T.textMuted} fontSize={12} tickFormatter={v => `${v}%`} /><YAxis type="category" dataKey="name" stroke={T.textMuted} fontSize={11} width={60} /><Tooltip contentStyle={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, color: T.text }} formatter={(v) => [`${v}%`, "Capacity"]} /><Bar dataKey="pct" radius={[0, 4, 4, 0]}>{ADMIN_CHARTS.classPopularity.map((e, i) => (<Cell key={i} fill={e.pct >= 90 ? T.warning : e.pct >= 70 ? T.success : T.accent} />))}</Bar></BarChart></ResponsiveContainer></div></AdminCard>
      </div>
    </div>
  );
}

function AdminMembersPage() {
  const [search, setSearch] = useState("");
  const filtered = MEMBERS_DATA.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Members</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff" }}><Search size={16} color={T.textMuted} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." style={{ background: "transparent", border: "none", color: T.text, fontSize: 13, outline: "none", width: 120 }} /></div>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Member", "Plan", "Status", "Check-ins", "Last Visit"].map(h => (<th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>))}</tr></thead>
          <tbody>{filtered.map(m => (
            <tr key={m.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 32, height: 32, borderRadius: 8, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{m.name.split(" ").map(n => n[0]).join("")}</div><div><p style={{ color: T.text, fontWeight: 600, margin: 0, fontSize: 13 }}>{m.name}</p><p style={{ color: T.textMuted, fontSize: 11, margin: "1px 0 0" }}>{m.email}</p></div></div></td>
              <td style={{ padding: "12px 16px", color: T.textMuted, fontSize: 12 }}>{m.membership}</td>
              <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: m.status === "active" ? `${T.accent}20` : `${T.warning}20`, color: m.status === "active" ? T.accent : T.warning }}>{m.status}</span></td>
              <td style={{ padding: "12px 16px", color: T.textMuted, fontFamily: "monospace" }}>{m.checkIns}</td>
              <td style={{ padding: "12px 16px", color: T.textMuted, fontSize: 12 }}>{formatDateShort(m.lastVisit)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminSchedulePage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Schedule Management</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Class</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Time", "Class", "Teacher", "Capacity", "Registered", "Status"].map(h => (<th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>))}</tr></thead>
          <tbody>{CLASSES_TODAY.map(c => (
            <tr key={c.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px 16px", color: T.text, fontFamily: "monospace" }}>{fmtTime(c.time)}</td>
              <td style={{ padding: "12px 16px", color: T.text, fontWeight: 600 }}>{c.type}</td>
              <td style={{ padding: "12px 16px", color: T.textMuted }}>{c.coach}</td>
              <td style={{ padding: "12px 16px", color: T.textMuted }}>{c.capacity}</td>
              <td style={{ padding: "12px 16px" }}><span style={{ fontFamily: "monospace", fontWeight: 600, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered}/{c.capacity}</span></td>
              <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: c.registered >= c.capacity ? `${T.warning}20` : `${T.accent}20`, color: c.registered >= c.capacity ? T.warning : T.accent }}>{c.registered >= c.capacity ? "Full" : "Open"}</span></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminBroadcastPage() {
  const [message, setMessage] = useState(""); const [audience, setAudience] = useState("all");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Broadcast & Notifications</h1>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
        <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, margin: "0 0 12px" }}>New Broadcast</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input placeholder="Title" style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: T.text, fontSize: 13, outline: "none" }} />
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Message..." rows={4} style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, color: T.text, fontSize: 13, outline: "none", resize: "vertical", fontFamily: "inherit" }} />
          <div style={{ display: "flex", gap: 6 }}>{["all", "monthly", "annual", "class cards"].map(a => (<button key={a} onClick={() => setAudience(a)} style={{ padding: "6px 12px", borderRadius: 6, border: "none", fontSize: 12, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", background: audience === a ? T.accent : "#f3f4f6", color: audience === a ? "#fff" : T.textMuted }}>{a}</button>))}</div>
          <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Send size={16} /> Send Broadcast</button>
        </div>
      </div>
    </div>
  );
}

function AdminTeachersPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Teachers</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Teacher</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 14 }}>
        {TEACHERS.map(teacher => (
          <div key={teacher.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#fff", fontWeight: 700, flexShrink: 0 }}>{teacher.firstName[0]}{teacher.lastName[0]}</div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: T.text }}>{teacher.firstName} {teacher.lastName}</h3>
                <p style={{ fontSize: 13, color: T.accent, fontWeight: 600, margin: "2px 0 0" }}>{teacher.role}</p>
              </div>
              <button style={{ padding: 6, borderRadius: 6, border: `1px solid #e5e7eb`, background: "#fff", cursor: "pointer" }}><Edit3 size={14} color={T.textMuted} /></button>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>{teacher.specialties.map(s => (<span key={s} style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>{s}</span>))}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: T.textMuted }}>{teacher.yearsTeaching} years teaching</span>
              <div style={{ display: "flex", gap: 4 }}>{teacher.certs.map(c => (<span key={c} style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#f3f4f6", color: T.textMuted }}>{c}</span>))}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminEventsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Events</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Create Event</button>
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ borderBottom: "1px solid #e5e7eb" }}>{["Event", "Type", "Date", "Spots", "Price", "Status", "Actions"].map(h => (<th key={h} style={{ padding: "12px 16px", textAlign: "left", color: T.textMuted, fontWeight: 600, fontSize: 11, textTransform: "uppercase" }}>{h}</th>))}</tr></thead>
          <tbody>{EVENTS.map(ev => (
            <tr key={ev.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
              <td style={{ padding: "12px 16px", color: T.text, fontWeight: 600 }}>{ev.name}</td>
              <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: T.accentGhost, color: T.accent }}>{ev.type}</span></td>
              <td style={{ padding: "12px 16px", color: T.textMuted, fontSize: 12 }}>{formatDateShort(ev.date)}</td>
              <td style={{ padding: "12px 16px", color: T.textMuted, fontFamily: "monospace" }}>{ev.registered}/{ev.maxParticipants}</td>
              <td style={{ padding: "12px 16px", color: T.text, fontWeight: 600 }}>{ev.fee === 0 ? "Free" : `$${ev.fee}`}</td>
              <td style={{ padding: "12px 16px" }}><span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 11, fontWeight: 600, background: "#dcfce7", color: "#16a34a" }}>{ev.status}</span></td>
              <td style={{ padding: "12px 16px" }}><div style={{ display: "flex", gap: 4 }}><button style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid #e5e7eb`, background: "#fff", cursor: "pointer", fontSize: 11, color: T.textMuted }}>Edit</button><button style={{ padding: "4px 8px", borderRadius: 4, border: `1px solid #e5e7eb`, background: "#fff", cursor: "pointer", fontSize: 11, color: T.warning }}>Cancel</button></div></td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}

function AdminPricingPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Pricing</h1>
        <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 600, fontSize: 13, cursor: "pointer" }}><Plus size={16} /> Add Plan</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {MEMBERSHIP_TIERS.map(tier => (
          <div key={tier.id} style={{ background: "#fff", border: `1px solid ${tier.popular ? T.accent : "#e5e7eb"}`, borderRadius: 12, padding: 20, position: "relative" }}>
            {tier.popular && (<span style={{ position: "absolute", top: 12, right: 12, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 6, background: T.accentGhost, color: T.accent }}>Popular</span>)}
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, margin: "0 0 4px", color: T.text, fontWeight: 700 }}>{tier.name}</h3>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 12 }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 32, color: T.accent, fontWeight: 700 }}>${tier.price}</span>
              <span style={{ fontSize: 13, color: T.textMuted }}>{tier.period}</span>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 16px" }}>
              {tier.features.map((f, i) => (<li key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0", fontSize: 13, color: T.textMuted }}><CheckCircle size={14} color={T.accent} style={{ flexShrink: 0 }} />{f}</li>))}
            </ul>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid #e5e7eb`, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.textMuted }}>Edit</button>
              <button style={{ flex: 1, padding: "8px 0", borderRadius: 6, border: `1px solid #e5e7eb`, background: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, color: T.warning }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminSettingsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, color: T.text, margin: 0 }}>Settings</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 14 }}>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Studio Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Studio Name</label><input defaultValue={STUDIO_CONFIG.name + " " + STUDIO_CONFIG.subtitle} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Address</label><input defaultValue={`${STUDIO_CONFIG.address.street}, ${STUDIO_CONFIG.address.city}, ${STUDIO_CONFIG.address.state} ${STUDIO_CONFIG.address.zip}`} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Phone</label><input defaultValue={STUDIO_CONFIG.phone} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} /></div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Email</label><input defaultValue={STUDIO_CONFIG.email} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} /></div>
            </div>
            <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Save Changes</button>
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>App Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[{ label: "Enable Guest Passes", checked: STUDIO_CONFIG.features.guestPasses }, { label: "Community Feed", checked: STUDIO_CONFIG.features.communityFeed }, { label: "Practice Tracking", checked: STUDIO_CONFIG.features.practiceTracking }, { label: "Milestone Badges", checked: STUDIO_CONFIG.features.milestones }, { label: "Cafe Section", checked: STUDIO_CONFIG.features.cafe }].map((setting, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontSize: 14, color: T.text }}>{setting.label}</span>
                <div style={{ width: 44, height: 24, borderRadius: 12, background: setting.checked ? T.accent : "#d1d5db", position: "relative", cursor: "pointer" }}><div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: setting.checked ? 23 : 3, boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
          <h3 style={{ color: T.text, fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Capacity & Scheduling</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Default Class Capacity</label><input type="number" defaultValue={STUDIO_CONFIG.classCapacity} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.05em" }}>Specialty Class Capacity</label><input type="number" defaultValue={STUDIO_CONFIG.specialtyCapacity} style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 14, color: T.text, outline: "none", boxSizing: "border-box" }} /></div>
            <button style={{ padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════
function SectionHeader({ title, linkText, linkPage }) { const { setPage } = useContext(AppContext); return (<div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 26, margin: 0, fontWeight: 600 }}>{title}</h2>{linkText && (<button onClick={() => setPage(linkPage)} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, fontWeight: 600, color: T.accent, background: "none", border: "none", cursor: "pointer" }}>{linkText} <ChevronRight size={16} /></button>)}</div>); }

function QuickAction({ icon: Icon, label, page, color }) { const { setPage } = useContext(AppContext); return (<button onClick={() => setPage(page)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", background: T.bgCard, borderRadius: 12, border: "none", cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}><div style={{ width: 40, height: 40, borderRadius: 10, background: color, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={20} color="#fff" /></div><span style={{ fontSize: 11, fontWeight: 600, color: T.text }}>{label}</span></button>); }

function PracticeCardFull({ practice, variant, expanded, onToggle }) {
  const isFeatured = variant === "featured"; const isExpanded = expanded !== undefined ? expanded : isFeatured;
  const typeColors = { FLOW: T.accent, CLASSIC: T.success, SCULPT: T.warning, RESTORE: "#8b5cf6", SLOW: "#3b82f6", BARRE: "#ec4899" };
  return (
    <div onClick={onToggle} style={{ background: T.bgCard, border: `1px solid ${T.border}`, borderLeft: `4px solid ${typeColors[practice.type] || T.accent}`, borderRadius: 12, padding: isFeatured ? "18px 18px" : "14px 16px", cursor: onToggle ? "pointer" : "default" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: isExpanded ? 10 : 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            {practice.date === today ? (<span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: T.accentGhost, color: T.accent }}>TODAY</span>) : (<span style={{ fontSize: 12, color: T.textMuted, fontWeight: 600 }}>{formatDateShort(practice.date)}</span>)}
            <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: `${typeColors[practice.type] || T.accent}12`, color: typeColors[practice.type] || T.accent }}>{practice.style}</span>
            {practice.duration && <span style={{ fontSize: 11, color: T.textFaint }}>{practice.duration} min</span>}
          </div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: isFeatured ? 28 : 22, margin: 0, color: T.text, fontWeight: 600 }}>{practice.name}</h3>
        </div>
        {onToggle && <ChevronDown size={18} color={T.textFaint} style={{ transform: isExpanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />}
      </div>
      {isExpanded && (
        <div>
          {practice.temp && (<div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}><Sun size={14} color={T.success} /><span style={{ fontSize: 12, fontWeight: 600, color: T.success }}>{practice.temp}</span></div>)}
          <p style={{ fontSize: 14, color: "#5a4e48", lineHeight: 1.6, margin: "0 0 12px" }}>{practice.description}</p>
          {practice.intention && (<div style={{ padding: "10px 12px", background: T.accentGhost, borderRadius: 8, marginBottom: 8 }}><span style={{ fontSize: 11, fontWeight: 700, color: T.accent, textTransform: "uppercase", letterSpacing: "0.05em" }}>Intention</span><p style={{ fontSize: 13, color: "#5a4e48", margin: "4px 0 0", lineHeight: 1.5, fontStyle: "italic" }}>{practice.intention}</p></div>)}
          {practice.teacherTip && (<div style={{ padding: "10px 12px", background: T.successGhost, borderRadius: 8 }}><span style={{ fontSize: 11, fontWeight: 700, color: T.success, textTransform: "uppercase", letterSpacing: "0.05em" }}>Teacher's Note</span><p style={{ fontSize: 13, color: "#5a4e48", margin: "4px 0 0", lineHeight: 1.5 }}>{practice.teacherTip}</p></div>)}
        </div>
      )}
    </div>
  );
}

function StatBox({ label, value }) { return (<div style={{ background: T.bgDim, borderRadius: 8, padding: "10px 12px", textAlign: "center" }}><div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 700, color: T.text }}>{value}</div><div style={{ fontSize: 11, color: T.textMuted, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div></div>); }
function EmptyState({ icon: Icon, message, sub }) { return (<div style={{ textAlign: "center", padding: "32px 16px", background: T.bgCard, borderRadius: 12, border: `1px solid ${T.border}` }}><Icon size={28} color={T.textFaint} style={{ marginBottom: 8 }} /><p style={{ fontWeight: 600, fontSize: 14, color: T.textMuted, margin: 0 }}>{message}</p>{sub && <p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>{sub}</p>}</div>); }
function InputField({ label, value, onChange, placeholder, multiline }) { const common = { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${T.border}`, background: T.bgDim, fontSize: 14, color: T.text, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }; return (<div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</label>{multiline ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...common, resize: "vertical" }} /> : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={common} />}</div>); }
function CTACard() { const { setPage } = useContext(AppContext); return (<div style={{ position: "relative", borderRadius: 14, padding: "24px 20px", color: "#fff", textAlign: "center", overflow: "hidden" }}><div style={{ position: "absolute", inset: 0, backgroundImage: `url(${STUDIO_IMAGES.grandOpening})`, backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.7)" }} /><div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 50%, rgba(0,0,0,0.45) 100%)" }} /><div style={{ position: "relative" }}><Leaf size={28} color={T.accent} style={{ marginBottom: 8 }} /><h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, margin: "0 0 8px", fontWeight: 700 }}>New to MÖV?</h3><p style={{ fontSize: 13, color: "#c8b8b0", margin: "0 0 16px", lineHeight: 1.5 }}>Get your first month of unlimited classes for only $49. Hot yoga, barre, candlelight, sculpt — try it all.</p><button onClick={() => setPage("membership")} style={{ padding: "12px 32px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontSize: 16, fontFamily: "'Syne', sans-serif" }}>Join the MÖVment</button></div></div>); }
function AdminCard({ title, children }) { return (<div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 18 }}><h3 style={{ color: T.text, fontSize: 15, fontWeight: 700, margin: "0 0 14px" }}>{title}</h3>{children}</div>); }

function ReservationModal({ classData, onConfirm, onClose }) {
  const [confirmed, setConfirmed] = useState(false); const totalReg = classData.registered + (classData.waitlist || 0); const isFull = totalReg >= classData.capacity; const spotsLeft = classData.capacity - classData.registered; const dateLabel = classData.date ? formatDateShort(classData.date) : classData.dayLabel || "This week";
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, padding: "24px 20px 36px" }}>
        {!confirmed ? (<>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, margin: 0, color: T.text, fontWeight: 700 }}>Confirm Reservation</h2><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} color={T.textMuted} /></button></div>
          <div style={{ background: T.bgDim, borderRadius: 14, padding: "18px 16px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}><div style={{ width: 52, height: 52, borderRadius: 12, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Calendar size={24} color="#fff" /></div><div style={{ flex: 1 }}><h3 style={{ fontSize: 17, fontWeight: 700, color: T.text, margin: "0 0 3px" }}>{classData.type}</h3><p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{classData.coach}</p></div></div>
            <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Clock size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: T.text }}>{fmtTime(classData.time)}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><CalendarDays size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: T.text }}>{dateLabel}</span></div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Users size={16} color={T.textMuted} /><span style={{ fontSize: 14, color: isFull ? T.warning : spotsLeft <= 5 ? T.success : T.text }}>{isFull ? "Full — you'll join the waitlist" : `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} remaining`}</span></div>
            </div>
          </div>
          <button onClick={() => { setConfirmed(true); onConfirm(classData.id); }} style={{ width: "100%", padding: "14px 0", borderRadius: 10, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontFamily: "'Syne', sans-serif", fontSize: 18 }}>{isFull ? "Join Waitlist" : "Confirm Reservation"}</button>
        </>) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: T.accentGhost, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><Check size={32} color={T.accent} /></div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, margin: "0 0 8px", color: T.text, fontWeight: 700 }}>{isFull ? "On the Waitlist" : "You're In!"}</h2>
            <p style={{ fontSize: 14, color: T.textMuted, margin: "0 0 20px" }}>{classData.type} · {fmtTime(classData.time)} · {dateLabel}</p>
            <button onClick={onClose} style={{ padding: "12px 32px", borderRadius: 8, border: "none", fontWeight: 700, cursor: "pointer", background: T.accent, color: "#fff", fontSize: 15 }}>Done</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsModal({ onClose }) {
  const [n1, setN1] = useState(true); const [n2, setN2] = useState(true); const [n3, setN3] = useState(true); const [n4, setN4] = useState(false);
  const Toggle = ({ active, onClick }) => (<button onClick={onClick} style={{ width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer", background: active ? T.accent : T.border, position: "relative", transition: "background 0.2s" }}><div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: active ? 23 : 3, transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,.15)" }} /></button>);
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "85vh", overflow: "auto", padding: "20px 20px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 26, margin: 0, fontWeight: 700 }}>Settings</h2><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button></div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Profile</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${T.accent}, ${T.accentDark})`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 20, color: "#fff", fontWeight: 700 }}>AF</div><div><p style={{ fontWeight: 700, margin: 0, fontSize: 15 }}>Amanda Fischer</p><p style={{ fontSize: 12, color: T.textMuted, margin: "2px 0 0" }}>Monthly Member · Since Jun 2023</p></div></div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Studio</h3>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0" }}><MapPin size={14} color={T.accent} /><span style={{ fontSize: 13, color: T.text }}>{STUDIO_CONFIG.address.street}, {STUDIO_CONFIG.address.city} {STUDIO_CONFIG.address.state}</span></div>
        </div>
        <div style={{ padding: "14px 0", borderBottom: `1px solid ${T.borderLight}` }}>
          <h3 style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: T.textMuted, margin: "0 0 10px" }}>Notifications</h3>
          {[{ label: "Class Reminders", a: n1, t: () => setN1(!n1) }, { label: "Community Milestones", a: n2, t: () => setN2(!n2) }, { label: "Events & Workshops", a: n3, t: () => setN3(!n3) }, { label: "Volunteer Opportunities", a: n4, t: () => setN4(!n4) }].map(n => (<div key={n.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0" }}><span style={{ fontSize: 14, color: T.text }}>{n.label}</span><Toggle active={n.a} onClick={n.t} /></div>))}
        </div>
        <div style={{ padding: "14px 0" }}><p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{STUDIO_CONFIG.name} {STUDIO_CONFIG.subtitle} App v1.0</p><p style={{ fontSize: 12, color: T.textFaint, margin: "4px 0 0" }}>Uptown, Minneapolis</p></div>
        <button style={{ width: "100%", padding: "12px 0", borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", color: T.accent, fontWeight: 700, fontSize: 14, cursor: "pointer", marginTop: 8 }}>Sign Out</button>
      </div>
    </div>
  );
}

function NotificationsModal({ onClose }) {
  const notifs = [
    { id: "n1", title: "Class Reminder", message: "MÖV Flow starts in 1 hour — spot reserved", time: "1 hour ago", read: false },
    { id: "n2", title: "Milestone!", message: "You hit 100 Classes! You're officially a MÖV veteran.", time: "Today", read: false },
    { id: "n3", title: "Volunteer Opportunity", message: "Simpson Housing cook night — 4 spots left this month", time: "Yesterday", read: true },
    { id: "n4", title: "Streak Alert", message: "16-day streak! The mat misses you when you're gone.", time: "2 days ago", read: true },
  ];
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: T.bgCard, borderRadius: "20px 20px 0 0", width: "100%", maxWidth: 390, maxHeight: "80vh", overflow: "auto", padding: "20px 20px 36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: 24, margin: 0, fontWeight: 700 }}>Notifications</h2><button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${T.border}`, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><X size={18} /></button></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {notifs.map(n => (<div key={n.id} style={{ padding: "12px 14px", borderRadius: 10, background: n.read ? "transparent" : T.accentGhost, border: `1px solid ${n.read ? T.border : T.accentBorder}` }}><div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ fontSize: 13, fontWeight: 700, color: T.text }}>{n.title}</span><span style={{ fontSize: 11, color: T.textFaint }}>{n.time}</span></div><p style={{ fontSize: 13, color: T.textMuted, margin: 0 }}>{n.message}</p></div>))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
//  MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("home");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [classRegistrations, setClassRegistrations] = useState({});
  const [reservationClass, setReservationClass] = useState(null);
  const [feedCelebrations, setFeedCelebrations] = useState({});
  const contentRef = useRef(null);

  useEffect(() => { window.scrollTo(0, 0); if (contentRef.current) contentRef.current.scrollTop = 0; }, [page]);
  const registerForClass = useCallback((classId) => { setClassRegistrations(prev => ({ ...prev, [classId]: (prev[classId] || 0) + 1 })); }, []);
  const openReservation = useCallback((classData) => { setReservationClass(classData); }, []);
  const celebrateFeed = useCallback((feedId) => { setFeedCelebrations(prev => ({ ...prev, [feedId]: (prev[feedId] || 0) + 1 })); }, []);
  const unreadCount = 2;

  const mainTabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "classes", label: "Classes", icon: CalendarDays },
    { id: "practice", label: "Practice", icon: TrendingUp },
    { id: "membership", label: "Plans", icon: CreditCard },
    { id: "more", label: "More", icon: Menu },
  ];
  const moreItems = [
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "community", label: "Community", icon: Heart },
    { id: "teachers", label: "Teachers", icon: Users },
    { id: "cafe", label: "Cafe", icon: Coffee },
    { id: "events", label: "Events", icon: PartyPopper },
    { id: "guest-passes", label: "Guest Passes", icon: Gift },
  ];
  const adminTabs = [
    { id: "admin-dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "admin-members", label: "Members", icon: UserCheck },
    { id: "admin-schedule", label: "Schedule", icon: Calendar },
    { id: "admin-teachers", label: "Teachers", icon: Users },
    { id: "admin-events", label: "Events", icon: CalendarDays },
    { id: "admin-pricing", label: "Pricing", icon: CreditCard },
    { id: "admin-broadcast", label: "Broadcast", icon: Megaphone },
    { id: "admin-settings", label: "Settings", icon: Settings },
  ];
  const isMoreActive = moreItems.some(item => item.id === page);

  const renderPage = () => {
    switch (page) {
      case "home": return <HomePage />; case "classes": return <ClassesPage />; case "schedule": return <SchedulePage />;
      case "practice": return <PracticePage />; case "community": return <CommunityPage />; case "teachers": return <TeachersPage />;
      case "membership": return <MembershipPage />; case "cafe": return <CafePage />; case "events": return <EventsPage />;
      case "guest-passes": return <GuestPassesPage />;
      case "admin-dashboard": return <AdminDashboard />; case "admin-members": return <AdminMembersPage />;
      case "admin-schedule": return <AdminSchedulePage />; case "admin-teachers": return <AdminTeachersPage />;
      case "admin-events": return <AdminEventsPage />; case "admin-pricing": return <AdminPricingPage />;
      case "admin-broadcast": return <AdminBroadcastPage />; case "admin-settings": return <AdminSettingsPage />;
      default: return <HomePage />;
    }
  };

  if (isAdmin) {
    return (
      <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
        <div style={{ minHeight: "100vh", background: "#f3f4f6", fontFamily: "'DM Sans', system-ui, sans-serif", display: "flex" }}>
          <aside style={{ width: 240, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", position: "fixed", top: 0, bottom: 0 }}>
            <div style={{ padding: "16px 14px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #e5e7eb" }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
              <div><span style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: T.text, display: "block", lineHeight: 1, fontWeight: 700 }}>{STUDIO_CONFIG.name}</span><span style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>Admin Portal</span></div>
            </div>
            <nav style={{ flex: 1, padding: "12px 8px", overflow: "auto" }}>
              <p style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, padding: "0 10px", margin: "0 0 8px" }}>Management</p>
              {adminTabs.map(tab => { const active = page === tab.id; return (<button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: active ? T.accentGhost : "transparent", color: active ? T.accent : T.textMuted, fontSize: 13, fontWeight: active ? 600 : 400, cursor: "pointer", marginBottom: 2, textAlign: "left" }}><tab.icon size={18} /><span>{tab.label}</span>{active && <ChevronRight size={14} style={{ marginLeft: "auto", opacity: 0.6 }} />}</button>); })}
            </nav>
            <div style={{ borderTop: "1px solid #e5e7eb", padding: "10px 8px" }}><button onClick={() => { setIsAdmin(false); setPage("home"); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 8, border: "none", background: "transparent", color: T.textMuted, fontSize: 13, cursor: "pointer", textAlign: "left" }}><LogOut size={18} /><span>Exit Admin</span></button></div>
          </aside>
          <main style={{ flex: 1, marginLeft: 240, padding: 24, overflow: "auto" }}>{renderPage()}</main>
        </div>
      </AppContext.Provider>
    );
  }

  const featureList = [
    "Full class schedule with real-time availability",
    "One-tap class reservations and waitlist",
    "Practice tracking with streaks and milestones",
    "Community feed with celebrations",
    "Teacher profiles with specialties and bios",
    "Events, workshops, and volunteer sign-ups",
    "Guest pass sharing for members",
    "Push notifications for class reminders",
    "Membership management and pricing tiers",
    "MÖV Marketplace cafe integration",
    "Admin dashboard with analytics",
    "Member management and broadcasting tools",
  ];

  return (
    <AppContext.Provider value={{ page, setPage, classRegistrations, registerForClass, openReservation, feedCelebrations, celebrateFeed }}>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f3f4f6", fontFamily: "'DM Sans', system-ui, sans-serif" }}>

        {/* LEFT SIDEBAR */}
        <aside style={{ width: 280, flexShrink: 0, background: "#fff", borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflow: "auto" }}>
          <div style={{ padding: "24px 20px", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
              <div>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, color: T.text, display: "block", lineHeight: 1, fontWeight: 700 }}>{STUDIO_CONFIG.name}</span>
                <span style={{ fontSize: 9, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.12em" }}>{STUDIO_CONFIG.subtitle}</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, margin: 0 }}>{STUDIO_CONFIG.description}</p>
          </div>
          <div style={{ flex: 1, padding: "20px 20px 16px" }}>
            <h3 style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: T.textMuted, margin: "0 0 12px" }}>App Features</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {featureList.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <CheckCircle size={14} color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: 13, color: T.text, lineHeight: 1.4 }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ padding: "16px 20px", borderTop: "1px solid #e5e7eb" }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: T.textMuted, margin: 0 }}>BUILT BY LUMI &mdash; LUMICLASS.APP</p>
          </div>
        </aside>

        {/* CENTER — PHONE MOCKUP */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "32px 24px" }}>
          <div style={{ width: 390, flexShrink: 0, background: T.bgDim, borderRadius: 32, boxShadow: "0 8px 40px rgba(0,0,0,.12), 0 2px 8px rgba(0,0,0,.06)", overflow: "hidden", position: "relative", border: "6px solid #1a1a1a" }}>
            {/* Notch */}
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 120, height: 24, background: "#1a1a1a", borderRadius: "0 0 16px 16px", zIndex: 40 }} />
            <div ref={contentRef} style={{ height: "85vh", maxHeight: 812, overflow: "auto" }}>
              <header style={{ position: "sticky", top: 0, zIndex: 30, background: T.bg, color: "#fff", padding: "10px 14px", paddingTop: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Syne', sans-serif", fontSize: 18, color: "#fff", fontWeight: 700 }}>{STUDIO_CONFIG.logoMark}</div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, lineHeight: 1, letterSpacing: "-0.01em", fontWeight: 700 }}>{STUDIO_CONFIG.name}</span>
                    <span style={{ fontSize: 8, color: "#7a6e68", textTransform: "uppercase", letterSpacing: "0.15em" }}>{STUDIO_CONFIG.subtitle}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: T.accent }}><Shield size={20} /></button>
                  <button onClick={() => setShowNotifications(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff", position: "relative" }}><Bell size={20} />{unreadCount > 0 && <span style={{ position: "absolute", top: 4, right: 4, width: 14, height: 14, borderRadius: "50%", background: T.accent, fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>{unreadCount}</span>}</button>
                  <button onClick={() => setShowSettings(true)} style={{ padding: 8, borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#fff" }}><Settings size={20} /></button>
                </div>
              </header>
              <main style={{ paddingBottom: 80 }}>{renderPage()}</main>
            </div>
            {showMore && (<div onClick={() => setShowMore(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)", zIndex: 40 }}><div onClick={e => e.stopPropagation()} style={{ position: "absolute", bottom: 68, left: 16, right: 16, background: T.bgCard, borderRadius: 16, padding: "14px 12px", boxShadow: "0 8px 32px rgba(0,0,0,.15)" }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 6px 8px" }}><span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600 }}>More</span><button onClick={() => setShowMore(false)} style={{ padding: 4, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer" }}><X size={18} color={T.textMuted} /></button></div><div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{moreItems.map(item => { const active = page === item.id; return (<button key={item.id} onClick={() => { setPage(item.id); setShowMore(false); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "14px 8px", borderRadius: 10, border: "none", cursor: "pointer", background: active ? T.accentGhost : T.bgDim, color: active ? T.accent : T.textMuted }}><item.icon size={22} /><span style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</span></button>); })}</div></div></div>)}
            <nav style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30, background: T.bgCard, borderTop: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-around", padding: "6px 4px 10px" }}>
                {mainTabs.map(tab => { const active = tab.id === "more" ? (isMoreActive || showMore) : page === tab.id;
                  if (tab.id === "more") return (<button key={tab.id} onClick={() => setShowMore(true)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}><tab.icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span></button>);
                  return (<button key={tab.id} onClick={() => setPage(tab.id)} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "6px 12px", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: active ? T.accent : T.textFaint }}><tab.icon size={20} strokeWidth={active ? 2.5 : 2} /><span style={{ fontSize: 10, fontWeight: active ? 700 : 500 }}>{tab.label}</span></button>);
                })}
              </div>
            </nav>
            {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
            {showNotifications && <NotificationsModal onClose={() => setShowNotifications(false)} />}
            {reservationClass && <ReservationModal classData={reservationClass} onConfirm={registerForClass} onClose={() => setReservationClass(null)} />}
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <aside style={{ width: 300, flexShrink: 0, background: "#fff", borderLeft: "1px solid #e5e7eb", display: "flex", flexDirection: "column", height: "100vh", position: "sticky", top: 0, overflow: "auto" }}>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Admin Dashboard Card */}
            <div style={{ background: `linear-gradient(135deg, ${T.bg}, hsl(18,10%,14%))`, borderRadius: 14, padding: "20px 18px", color: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center" }}><Shield size={18} color="#fff" /></div>
                <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, margin: 0, fontWeight: 700 }}>Admin Dashboard</h3>
              </div>
              <p style={{ fontSize: 13, color: "#c8b8b0", lineHeight: 1.5, margin: "0 0 14px" }}>Full studio management built in -- member analytics, schedule management, broadcast messaging, and revenue tracking.</p>
              <button onClick={() => { setIsAdmin(true); setPage("admin-dashboard"); }} style={{ width: "100%", padding: "10px 0", borderRadius: 8, border: "none", background: T.accent, color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Open Admin</button>
            </div>

            {/* Built for Studio Card */}
            <div style={{ background: T.accentGhost, border: `1px solid ${T.accentBorder}`, borderRadius: 14, padding: "20px 18px" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, margin: "0 0 8px", color: T.text, fontWeight: 700 }}>Built for {STUDIO_CONFIG.name}</h3>
              <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, margin: "0 0 12px" }}>This app was custom-designed for MÖV Hot Yoga + Barre in Uptown Minneapolis. It reflects their unique class formats, community-first culture, and on-site MÖV Marketplace cafe.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {["MÖV Classic, Flow, Barre, Sculpt, Candlelight formats", "8+ instructors with specialized training", "Simpson Housing volunteer integration", "MÖV Marketplace cafe ordering", "Hot room capacity management (35 spots)"].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 12, color: T.text, lineHeight: 1.4 }}>
                    <CheckCircle size={12} color={T.accent} style={{ flexShrink: 0, marginTop: 2 }} /><span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* All-in-One Platform Card */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 18px" }}>
              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, margin: "0 0 8px", color: T.text, fontWeight: 700 }}>All-in-One Platform</h3>
              <p style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.6, margin: "0 0 12px" }}>Replace your patchwork of scheduling tools, email platforms, and member databases with one unified studio app.</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[{ icon: Calendar, label: "Scheduling" }, { icon: Users, label: "Members" }, { icon: TrendingUp, label: "Analytics" }, { icon: Megaphone, label: "Messaging" }, { icon: CreditCard, label: "Payments" }, { icon: Heart, label: "Community" }].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 10px", background: "#f9fafb", borderRadius: 8 }}>
                    <item.icon size={14} color={T.accent} />
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

      </div>
    </AppContext.Provider>
  );
}
