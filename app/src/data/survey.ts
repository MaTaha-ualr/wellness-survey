import { resolvePublicAsset } from '@/lib/assets';

export interface Question {
  id: string;
  num: number;
  text: string;
  hint?: string;
  type: 'single' | 'multi' | 'scale' | 'likert' | 'open';
  options?: string[];
  hasOther?: boolean;
  otherLabel?: string;
  maxSelect?: number;
  scaleLabels?: string[];
  likertLabels?: string[];
  items?: string[];
}

export interface SurveySection {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  questions: Question[];
  image: string;
  panelColor: string;
  imagePosition: 'left' | 'right';
  tone?: 'light' | 'dark';
}

export type MatrixAnswer = Record<string, number>;
export type QuestionValue = string | string[] | MatrixAnswer | undefined;
export type SurveyAnswers = Record<string, QuestionValue>;
export type OtherTexts = Record<string, string | undefined>;

export interface AudioRecording {
  blob: Blob;
  url: string;
}

export type AudioRecordings = Record<string, AudioRecording | null | undefined>;

export const SURVEY_SECTIONS: SurveySection[] = [
  {
    id: 'about',
    emoji: '\u{1F33B}',
    title: 'ABOUT YOU',
    subtitle: "Let's start with the basics",
    image: resolvePublicAsset('images/about_you_photo.jpg'),
    panelColor: 'bg-panel-teal',
    imagePosition: 'right',
    tone: 'light',
    questions: [
      {
        id: 'q1',
        num: 1,
        text: 'Which age group are you in?',
        type: 'single',
        options: ['13-15', '16-18', '19-21', '22-24', '25+'],
      },
      {
        id: 'q2',
        num: 2,
        text: 'What gender do you identify with?',
        hint: "Select all that apply - this helps us understand who we're reaching",
        type: 'multi',
        options: ['Female', 'Male', 'Non-binary / gender non-conforming', 'Prefer not to say'],
        hasOther: true,
        otherLabel: 'Prefer to self-describe',
      },
      {
        id: 'q3',
        num: 3,
        text: 'Which best describes your current situation?',
        hint: "Select all that apply - there's no wrong combination",
        type: 'multi',
        options: [
          'In high school',
          'In college / university',
          'Working full-time or part-time',
          'Not currently in school or working',
          'Student-athlete',
          'Caregiver (for family members)',
        ],
      },
    ],
  },
  {
    id: 'feeling',
    emoji: '\u{1F497}',
    title: "HOW YOU'VE BEEN FEELING",
    subtitle: 'No judgment here - just checking in',
    image: resolvePublicAsset('images/feeling_photo.jpg'),
    panelColor: 'bg-panel-purple',
    imagePosition: 'left',
    tone: 'light',
    questions: [
      {
        id: 'q4',
        num: 4,
        text: 'Over the past few weeks, how often have you experienced any of the following?',
        hint: 'Be honest - there are no right or wrong answers',
        type: 'scale',
        scaleLabels: ['Never', 'Rarely', 'Sometimes', 'Often', 'Almost every day'],
        items: [
          'Stress or feeling overwhelmed',
          'Anxiety or excessive worry',
          'Loneliness or social isolation',
          'Low mood or sadness',
          'Difficulty focusing or staying motivated',
          'Burnout or emotional exhaustion',
          'Pressure to perform (school, work, sports, family)',
        ],
      },
      {
        id: 'q5',
        num: 5,
        text: "When you're going through a difficult time, what do you usually do to cope?",
        hint: 'Select all that apply - there are no wrong answers',
        type: 'multi',
        options: [
          'Talk to a friend or peer',
          'Talk to a family member',
          'Exercise or physical activity',
          'Creative outlets (art, music, writing)',
          'Social media or online communities',
          'Gaming or entertainment',
          'Journaling or reflection',
          'Meditation or breathing exercises',
          'Wellness apps (meditation, journaling, etc.)',
          'Nothing - I tend to keep it to myself',
        ],
        hasOther: true,
      },
    ],
  },
  {
    id: 'support',
    emoji: '\u{1F331}',
    title: 'YOUR EXPERIENCE WITH SUPPORT',
    subtitle: "We want to understand what you've been through",
    image: resolvePublicAsset('images/support_photo.jpg'),
    panelColor: 'bg-panel-yellow',
    imagePosition: 'right',
    tone: 'dark',
    questions: [
      {
        id: 'q6',
        num: 6,
        text: 'Have you ever talked to a professional about your mental health - like a therapist, counselor, or psychiatrist?',
        type: 'single',
        options: [
          'Yes, and it was helpful',
          "Yes, but it wasn't a great experience",
          "I tried, but couldn't access it (cost, availability, stigma)",
          "No, but I've wanted to",
          "No, and I haven't felt the need to",
        ],
      },
      {
        id: 'q7',
        num: 7,
        text: 'What gets in the way of getting help when you need it?',
        hint: 'Select all that apply',
        type: 'multi',
        options: [
          "Cost - I can't afford it",
          "I don't know where to start or what's available",
          'Fear of judgment or stigma',
          'Lack of support from family or friends',
          'It feels too formal or clinical',
          "I don't want to be labeled or diagnosed",
          'Long wait times or limited availability',
          `I don't feel like my situation is "bad enough"`,
          "I'm not sure I can trust someone with my struggles",
          'My culture or background discourages seeking help',
        ],
        hasOther: true,
      },
      {
        id: 'q8',
        num: 8,
        text: 'How do you feel about the following statements?',
        hint: 'Optional - rate each one honestly',
        type: 'likert',
        likertLabels: ['Strongly disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly agree'],
        items: [
          "I'd prefer support that doesn't feel like a doctor's appointment",
          "I'd feel more comfortable talking to someone my age than a professional",
          "I'm more likely to seek help if it's free or low-cost",
          "I'd rather use an app or online resource than meet in person",
          `I worry that getting help means something is "wrong with me"`,
          "I'd engage more if a trusted person in my life referred me",
        ],
      },
    ],
  },
  {
    id: 'want',
    emoji: '\u2728',
    title: "WHAT YOU'D ACTUALLY WANT",
    subtitle: 'Dream it up - what would ideal support look like?',
    image: resolvePublicAsset('images/want_photo.jpg'),
    panelColor: 'bg-panel-pink',
    imagePosition: 'left',
    tone: 'light',
    questions: [
      {
        id: 'q9',
        num: 9,
        text: 'What type of mental wellness support sounds most appealing to you?',
        hint: 'Pick your top 3',
        type: 'multi',
        maxSelect: 3,
        options: [
          'One-on-one peer support or mentorship',
          'Group conversations with peers',
          'Workshops or skill-building sessions (stress, confidence, resilience)',
          'Self-guided app or online tools',
          'Text or chat-based support',
          'Access to vetted resources and reading materials',
          'Connection to professional help when needed',
        ],
      },
      {
        id: 'q10',
        num: 10,
        text: 'Where would you feel most comfortable accessing mental wellness support?',
        hint: 'Select all that apply',
        type: 'multi',
        options: [
          'At school / on campus',
          'At a community center',
          'Online or via app (from home)',
          'Through a dedicated youth wellness space',
          'Via text or chat (no video or in-person required)',
          'Through a trusted friend or peer referral',
        ],
        hasOther: true,
      },
      {
        id: 'q11',
        num: 11,
        text: 'What would help you feel comfortable enough to actually open up?',
        hint: 'Select all that apply',
        type: 'multi',
        options: [
          'Complete anonymity',
          'Knowing the person has been through similar experiences',
          'A judgment-free, non-clinical environment',
          'Clear privacy and confidentiality policies',
          'Being able to stop or opt out at any time',
          'Cultural or identity representation in the people providing support',
        ],
      },
    ],
  },
  {
    id: 'engage',
    emoji: '\u{1F4F1}',
    title: 'HOW YOU LEARN & ENGAGE',
    subtitle: 'Where do you actually spend your time?',
    image: resolvePublicAsset('images/engage_photo.jpg'),
    panelColor: 'bg-panel-blue',
    imagePosition: 'right',
    tone: 'light',
    questions: [
      {
        id: 'q12',
        num: 12,
        text: 'Where do you go when you want to learn about mental health or wellness?',
        hint: 'Select all that apply',
        type: 'multi',
        options: [
          'TikTok',
          'Instagram',
          'YouTube',
          'Reddit or online forums',
          'Podcasts',
          'Websites or blogs',
          'AI tools (ChatGPT, Snapchat AI, etc.)',
          'Friends or word of mouth',
          'School or academic resources',
          "I don't actively seek this type of content",
        ],
        hasOther: true,
      },
      {
        id: 'q13',
        num: 13,
        text: 'What kind of mental wellness content do you actually watch, read, or interact with?',
        hint: 'Select all that apply',
        type: 'multi',
        options: [
          'Personal stories from people my age',
          'Practical tips or how-tos (managing anxiety, sleep, stress)',
          'Short-form videos or reels',
          'Quizzes or self-assessments',
          'Live Q&As or events',
          'Memes or relatable content',
          'Humor or lighthearted takes on serious topics',
          'Inspiring or motivational content',
          "I don't really engage with mental wellness content",
        ],
      },
    ],
  },
  {
    id: 'voice',
    emoji: '\u{1F4AC}',
    title: 'YOUR VOICE',
    subtitle: 'This is the most important part',
    image: resolvePublicAsset('images/voice_photo.jpg'),
    panelColor: 'bg-panel-purple',
    imagePosition: 'left',
    tone: 'light',
    questions: [
      {
        id: 'q14',
        num: 14,
        text: 'If you could tell adults one thing about what young people actually need when it comes to mental wellness - what would it be?',
        hint: "Share anything on your mind. We're listening.",
        type: 'open',
      },
    ],
  },
];

export const TOTAL_QUESTIONS = SURVEY_SECTIONS.reduce(
  (count, section) => count + section.questions.length,
  0,
);
