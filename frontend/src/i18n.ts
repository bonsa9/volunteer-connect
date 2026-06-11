import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      hero: {
        description: 'Browse campaigns, sign up for opportunities, and track your volunteer impact across Ethiopia.',
      },
      browse: {
        title: 'Find campaigns near you',
        description: 'Search volunteer campaigns by location, skills, and schedule with real-time matching.',
      },
      feature: {
        map: {
          title: 'Map-based discovery',
          description: 'Explore campaigns on an interactive map of Ethiopia and join ones that fit your availability.',
        },
        gamification: {
          title: 'Earn rewards',
          description: 'Collect points, badges, and levels as you contribute hours to meaningful campaigns.',
        },
      },
    },
  },
  am: {
    translation: {
      hero: {
        description: 'ከኢትዮጵያ ውስጥ የተለያዩ ድርጅቶችን በመጣጣት የሚረዱ እና ጊዜዎን የሚያሳይ የፈለጉትን ማዕከላዊ እድሎችን ይፈልጉ።',
      },
      browse: {
        title: 'ቅርብ የሚገኙ የማስተዋወቅ ማስታወቂያዎችን ይፈልጉ',
        description: 'በአካባቢ፣ ክህሎት እና ሰዓት መሰረት የተስማሚ ማስተዋወቅ እድሎችን በእውነተኛ ጊዜ ይፈልጉ።',
      },
      feature: {
        map: {
          title: 'በካርታ ላይ የማሰባሰብ እድል',
          description: 'በኢትዮጵያ ካርታ ላይ የሚገኙ የመርሃ ግብሮችን ያሳዩ እና ከሚሰሩበት ጊዜ ጋር የሚስማሩ ይምረጡ።',
        },
        gamification: {
          title: 'የተከናወኑ ሽልማቶች',
          description: 'ሰዓታት ሲያከናውኑ ነገሮች እና ደረጃ ይሰብሱ።',
        },
      },
    },
  },
  om: {
    translation: {
      hero: {
        description: 'Hojiiwwan eenyummeessaa fi hirmaatotaaf mijataa taʼaniif fageenya fi tajaajila saʼaa irratti hundaaʼe barbaadi.',
      },
      browse: {
        title: 'Tarkaanfii si bira jiru argadhu',
        description: 'Hojii dorgommii naannoo, dandeettii, fi sagantaa irratti hundaaʼee yeroodhaan argadhu.',
      },
      feature: {
        map: {
          title: 'Argannoo kaartaa',
          description: 'Hojiiwwan Itoophiyaa kaartaa irratti argaman sakattaʼi fi kan siif taʼan filadhu.',
        },
        gamification: {
          title: 'Badhaasa argadhu',
          description: 'Saʼaawwan gumaachuudhaan dhibbeentaa, baajji fi sadarkaa argadhu.',
        },
      },
    },
  },
  ti: {
    translation: {
      hero: {
        description: 'ብሄረሰብ እና ደንበኞች በኢትዮጵያ እድሎችን በካርታ ላይ ማሳየት እና መቅየር ይችላሉ።',
      },
      browse: {
        title: 'ከእርስዎ የቅርብ የማስተዋወቅ እድሎችን ያግኙ',
        description: 'በአካባቢ፣ ችሎታ፣ እና ሰዓት መሠረት የሚስማሩ እድሎችን በእውነተኛ ጊዜ ይፈልጉ።',
      },
      feature: {
        map: {
          title: 'የካርታ ማሳያ',
          description: 'በኢትዮጵያ ካርታ ላይ የሚገኙ እድሎችን ይሰምዱ።',
        },
        gamification: {
          title: 'ሽልማትን ያገኙ',
          description: 'በሰዓታት ማስገኛ የእንቅስቃሴ ነጥብ ይሰብሱ።',
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
