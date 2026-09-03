import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'am'

/* ---------------------------------------------------------------------------
   Translation dictionary.
   Amharic strings are written for natural reading, not literal translation.
   Ge'ez numerals are used for calendar/date figures in Amharic mode.
--------------------------------------------------------------------------- */

const en = {
  names: { first: 'Bemnu', second: 'Mitsi' },
  verse: {
    ref: 'Psalm 119:65',
    text: '“O Lord, you have dealt well with your servant, according to your word.”',
  },
  hero: {
    eyebrow: 'The Wedding Of',
    celebrating: 'We are celebrating our wedding on',
    date: 'September 20, 2026',
    dateEth: 'Meskerem 10, 2019 E.C.',
    location: 'Addis Ababa, Ethiopia',
    time: '9:00 LT',
    scroll: 'Scroll',
    slideOf: 'of',
    openPhoto: 'Open photograph',
    prevPhoto: 'Previous photo',
    nextPhoto: 'Next photo',
  },
  categories: ['Ceremony', 'Our Story', 'The Journey', 'Moments', 'Reception', 'Forever'],
  locations: ['Addis Ababa', 'Ethiopia', 'Home', 'Forever', 'Ketena 2', 'Ethiopia'],
  gallery: {
    eyebrow: 'Captured Moments',
    title: 'Our Gallery',
  },
  countdown: {
    eyebrow: 'Counting Down To',
    date: 'September 20, 2026',
    dateSub: 'Meskerem 10, 2019 E.C.',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    passed: 'Today We Celebrate',
  },
  calendar: {
    eyebrow: 'The Ethiopian Calendar',
    title: 'Meskerem 2019',
    titleSub: 'Year 2019 Ethiopian Calendar',
    weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    legend: 'The Wedding Day',
    note: 'Meskerem 10, 2019 E.C. falls on September 20, 2026.',
    awaiting: 'The awaited day',
  },
  events: {
    eyebrow: 'Together With Our Families',
    lead: 'We joyfully invite you to celebrate our wedding',
    invitation:
      'Together with our families, we respectfully invite you to the wedding ceremony of our children Bemnu & Mitsi. The ceremony will be held on Sunday, Meskerem 10, 2019 E.C., at 9:00 local time at Ketena 2 Full Gospel Believer Church, in the Covenant Order. We would be honoured to have you with us.',
    date: 'September 20, 2026',
    dateEth: 'Meskerem 10, 2019 E.C.',
    venue1: 'Ketena 2 Full Gospel',
    venue2: 'Believer Church',
    time: '3:00 PM',
  },
  wishes: {
    eyebrow: 'Guest Wishes',
    title: 'Leave Your Wishes',
    desc: 'Leave us your good wishes, messages, and blessings in the space below.',
    nameLabel: 'Your Name',
    namePlaceholder: 'Enter your name',
    wishLabel: 'Your Wish',
    wishPlaceholder: 'Write your message...',
    submit: 'Send Wish',
    sending: 'Sending',
    errName: 'Please enter your name.',
    errWish: 'Please write a wish to share.',
    errGeneric: "We couldn't send your wish. Please try again.",
    thanks: 'Thank You',
    thanksBody: 'Your wish has been received with love.',
    again: 'Send another wish',
    mapButton: 'Open in Google Maps',
  },
  footer: {
    withLove: 'With Love',
    message: "We can't wait to celebrate with you.",
  },
}

const am: typeof en = {
  names: { first: 'በእምኑ', second: 'ምፂ' },
  verse: {
    ref: 'መዝሙረ ዳዊት ፻፲፱፥ ፷፭',
    text: '«አቤቱ፥ እንደ ቃልህ ለባሪያህ መልካም አደረግህ።»',
  },
  hero: {
    eyebrow: 'የጋብቻ በዓል',
    celebrating: 'የጋብቻችንን በዓል እንከብራለን',
    date: 'መስከረም ፲፣ ፳፻፲፱ ዓ.ም.',
    dateEth: 'መስከረም ፲',
    location: 'አዲስ አበባ፣ ኢትዮጵያ',
    time: 'ከቀኑ ፱ ሰዓት',
    scroll: 'ወደ ታች',
    slideOf: 'ከ',
    openPhoto: 'ፎቶግራፉን ክፈት',
    prevPhoto: 'ያለፈው ፎቶ',
    nextPhoto: 'ቀጣይ ፎቶ',
  },
  categories: ['ሥነ ሥርዓት', 'ታሪካችን', 'ጉዞያችን', 'ገጽታዎች', 'ድግስ', 'ለዘላለም'],
  locations: ['አዲስ አበባ', 'ኢትዮጵያ', 'ቤት', 'ለዘላለም', 'ቀጠና 2', 'ኢትዮጵያ'],
  gallery: {
    eyebrow: 'የተያዙ አፍታዎች',
    title: 'የፎቶ ማሳያ',
  },
  countdown: {
    eyebrow: 'ወደ ጋብቻችን የቀረው ጊዜ',
    date: 'መስከረም 10፣ 2019 ዓ.ም.',
    dateSub: 'መስከረም 10',
    days: 'ቀን',
    hours: 'ሰዓት',
    minutes: 'ደቂቃ',
    seconds: 'ሰከንድ',
    passed: 'ዛሬ እንከብራለን',
  },
  calendar: {
    eyebrow: 'በኢትዮጵያ ዘመን አቆጣጠር',
    title: 'መስከረም ፳፻፲፱',
    titleSub: 'በኢትዮጵያ ዘመን አቆጣጠር ፳፻፲፱ ዓ.ም.',
    weekdays: ['እሑ', 'ሰኞ', 'ማክ', 'ረቡ', 'ሐሙ', 'ዓር', 'ቅዳ'],
    legend: 'የጋብቻ ቀን',
    note: 'የጋብቻ ቀን መስከረም ፲፣ ፳፻፲፱ ዓ.ም. ነው።',
    awaiting: 'የሚጠበቀው ቀን',
  },
  events: {
    eyebrow: 'ከቤተሰባችን ጋር',
    lead: 'ለጋብቻችን እንዲያከብሩን በሙሉ እንጋብዛለን',
    invitation:
      'ለ ክቡር እንግዳችን የማክበር ሰላምታችንን እያቀረብን የልጆቻችን በእምነት አሰፋ እና ምጽአት ሺሰማ የጋብቻ ስነ ሥርዓት የሚከናወነው እሁድ መስከረም ፲ ቀን ፳፻፲፱ ዓ.ም. ሲሆን ከቀኑ በ፱ ሰዓት በቀጠና ሁለት ሙሉ ወንጌል ቤተ ክርስቲያን በሚኖረው የቃል ኪዳን ሥርዓት ከ__________ ጋር እንዲገኙልን በአክብሮት ጠርተንዎታል።',
    date: 'መስከረም ፲፣ ፳፻፲፱ ዓ.ም.',
    dateEth: 'መስከረም ፲',
    venue1: 'ቀጠና 2 ሙሉ ወንጌል',
    venue2: 'አማኞች ቤተ ክርስቲያን',
    time: 'ከቀኑ ፱ ሰዓት',
  },
  wishes: {
    eyebrow: 'የእንግዶች ምኞት',
    title: 'ምኞቶን ያስቀምጡ',
    desc: 'በታች ባለው ክፍት ቦታ መልካም ምኞቶን፣ መልእክቶን እንዲሁም ምርቃቶን ያስቀምጡልን።',
    nameLabel: 'ስምዎ',
    namePlaceholder: 'ስምዎን ያስገቡ',
    wishLabel: 'ምኞትዎ',
    wishPlaceholder: 'መልእክትዎን ይጻፉ...',
    submit: 'ምኞት ላክ',
    sending: 'በመላክ ላይ',
    errName: 'እባክዎ ስምዎን ያስገቡ።',
    errWish: 'እባክዎ የሚያጋሩትን ምኞት ይጻፉ።',
    errGeneric: 'ምኞትዎን መላክ አልቻልንም። እባክዎ እንደገና ይሞክሩ።',
    thanks: 'እጅግ አመሰግናለን',
    thanksBody: 'ምኞትዎ በፍቅር ተቀብለናል።',
    again: 'ሌላ ምኞት ላክ',
    mapButton: 'Google Maps ይክፈቱ',
  },
  footer: {
    withLove: 'በፍቅር',
    message: 'ከእርስዎ ጋር ለመደሰት በጉጉት እንጠብቃለን።',
  },
}

export type Dict = typeof en

const dictionaries: Record<Lang, Dict> = { en, am }

const STORAGE_KEY = 'mb-lang'

interface LangContextValue {
  lang: Lang
  isAm: boolean
  setLang: (lang: Lang) => void
  t: Dict
}

const LangContext = createContext<LangContextValue | null>(null)

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'am'
    /* Amharic is the default; English only when the visitor explicitly chose it */
    return window.localStorage.getItem(STORAGE_KEY) === 'en' ? 'en' : 'am'
  })

  useEffect(() => {
    document.documentElement.lang = lang === 'am' ? 'am' : 'en'
    window.localStorage.setItem(STORAGE_KEY, lang)
  }, [lang])

  const value = useMemo<LangContextValue>(
    () => ({
      lang,
      isAm: lang === 'am',
      setLang: setLangState,
      t: dictionaries[lang],
    }),
    [lang],
  )

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>
}

/* eslint-disable-next-line react-refresh/only-export-components -- context + hook live together by design */
export function useLang(): LangContextValue {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>')
  return ctx
}