import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

interface TranslationResource {
  translation: Record<string, string>
}

interface Resources {
  en: TranslationResource
  ar: TranslationResource
}

const resources: Resources = {
  en: {
    translation: {
      // App
      appName: 'Screen Scene ',
      
      // Navigation
      home: 'Home',
      favorites: 'Favorites',
      profile: 'Profile',
      search: 'Search',
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      
      // Common
      loading: 'Loading...',
      error: 'Error',
      retry: 'Retry',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
      submit: 'Submit',
      
      // Authentication
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      welcomeBack: 'Welcome Back',
      createAccount: 'Create Account',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      signInToAccount: 'Sign in to your account',
      or: 'Or',
      createNewAccount: 'create a new account',
      enterEmail: 'Enter your email',
      enterPassword: 'Enter your password',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot your password?',
      signingIn: 'Signing in...',
      signUpHere: 'Sign up here',
      signInHere: 'Sign in here',
      emailRequired: 'Email is required',
      validEmailRequired: 'Please enter a valid email address',
      passwordRequired: 'Password is required',
      passwordMinLength: 'Password must be at least 6 characters',
      createPassword: 'Create a password',
      confirmYourPassword: 'Confirm your password',
      firstNameRequired: 'First name is required',
      firstNameMinLength: 'First name must be at least 2 characters',
      lastNameRequired: 'Last name is required',
      lastNameMinLength: 'Last name must be at least 2 characters',
      confirmPasswordRequired: 'Please confirm your password',
      passwordsDoNotMatch: 'Passwords do not match',
      termsRequired: 'You must agree to the terms and conditions',
      creatingAccount: 'Creating your account...',
      createYourAccount: 'Create your account',
      signInToExisting: 'sign in to your existing account',
      passwordStrength: {
        veryWeak: 'Very Weak',
        weak: 'Weak',
        fair: 'Fair',
        good: 'Good',
        strong: 'Strong'
      },
      
      // Movies & Shows
      movies: 'Movies',
      shows: 'TV Shows',
      genres: 'Genres',
      year: 'Year',
      rating: 'Rating',
      overview: 'Overview',
      cast: 'Cast',
      reviews: 'Reviews',
      addReview: 'Add Review',
      yourReview: 'Your Review',
      addToFavorites: 'Add to Favorites',
      removeFromFavorites: 'Remove from Favorites',
      releaseDate: 'Release Date',
      runtime: 'Runtime',
      director: 'Director',
      
      // Filters
      allGenres: 'All Genres',
      allYears: 'All Years',
      filterBy: 'Filter by',
      sortBy: 'Sort by',
      popularity: 'Popularity',
      voteAverage: 'Rating',
      
      // Messages
      addedToFavorites: 'Added to favorites',
      removedFromFavorites: 'Removed from favorites',
      reviewAdded: 'Review added successfully',
      reviewUpdated: 'Review updated successfully',
      signInSuccess: 'Signed in successfully',
      signUpSuccess: 'Account created successfully',
      noResults: 'No results found',
      noFavorites: 'No favorites yet',
      
      // Home page
      browseAndSearch: 'Browse and search movies',
      searchMovies: 'Search movies...',
      filters: 'Filters',
      clear: 'Clear',
      
      // Movie detail page
      backToMovies: 'Back to Movies',
      movieNotFound: 'Movie not found',
      signInToAddFavorites: 'Please sign in to add favorites',
      
      // Language
      language: 'Language',
      english: 'English',
      arabic: 'العربية',
    }
  },
  ar: {
    translation: {
      // App
      appName: 'تطبيق الأفلام',
      
      // Navigation
      home: 'الرئيسية',
      favorites: 'المفضلة',
      profile: 'الملف الشخصي',
      search: 'بحث',
      signIn: 'تسجيل الدخول',
      signUp: 'إنشاء حساب',
      signOut: 'تسجيل الخروج',
      
      // Common
      loading: 'جاري التحميل...',
      error: 'خطأ',
      retry: 'إعادة المحاولة',
      cancel: 'إلغاء',
      save: 'حفظ',
      delete: 'حذف',
      edit: 'تعديل',
      submit: 'إرسال',
      
      // Authentication
      email: 'البريد الإلكتروني',
      password: 'كلمة المرور',
      confirmPassword: 'تأكيد كلمة المرور',
      firstName: 'الاسم الأول',
      lastName: 'اسم العائلة',
      welcomeBack: 'مرحباً بعودتك',
      createAccount: 'إنشاء حساب',
      alreadyHaveAccount: 'لديك حساب بالفعل؟',
      dontHaveAccount: 'ليس لديك حساب؟',
      signInToAccount: 'تسجيل الدخول إلى حسابك',
      or: 'أو',
      createNewAccount: 'إنشاء حساب جديد',
      enterEmail: 'أدخل بريدك الإلكتروني',
      enterPassword: 'أدخل كلمة المرور',
      rememberMe: 'تذكرني',
      forgotPassword: 'نسيت كلمة المرور؟',
      signingIn: 'جاري تسجيل الدخول...',
      signUpHere: 'سجل هنا',
      signInHere: 'سجل دخول هنا',
      emailRequired: 'البريد الإلكتروني مطلوب',
      validEmailRequired: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
      passwordRequired: 'كلمة المرور مطلوبة',
      passwordMinLength: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل',
      createPassword: 'إنشاء كلمة مرور',
      confirmYourPassword: 'تأكيد كلمة المرور',
      firstNameRequired: 'الاسم الأول مطلوب',
      firstNameMinLength: 'الاسم الأول يجب أن يكون حرفين على الأقل',
      lastNameRequired: 'اسم العائلة مطلوب',
      lastNameMinLength: 'اسم العائلة يجب أن يكون حرفين على الأقل',
      confirmPasswordRequired: 'يرجى تأكيد كلمة المرور',
      passwordsDoNotMatch: 'كلمات المرور غير متطابقة',
      termsRequired: 'يجب الموافقة على الشروط والأحكام',
      creatingAccount: 'جاري إنشاء حسابك...',
      createYourAccount: 'إنشاء حسابك',
      signInToExisting: 'تسجيل الدخول إلى حسابك الموجود',
      passwordStrength: {
        veryWeak: 'ضعيف جداً',
        weak: 'ضعيف',
        fair: 'متوسط',
        good: 'جيد',
        strong: 'قوي'
      },
      
      // Movies & Shows
      movies: 'أفلام',
      shows: 'مسلسلات',
      genres: 'التصنيفات',
      year: 'السنة',
      rating: 'التقييم',
      overview: 'نظرة عامة',
      cast: 'طاقم التمثيل',
      reviews: 'المراجعات',
      addReview: 'إضافة مراجعة',
      yourReview: 'مراجعتك',
      addToFavorites: 'إضافة للمفضلة',
      removeFromFavorites: 'إزالة من المفضلة',
      releaseDate: 'تاريخ الإصدار',
      runtime: 'مدة العرض',
      director: 'المخرج',
      
      // Filters
      allGenres: 'جميع التصنيفات',
      allYears: 'جميع السنوات',
      filterBy: 'تصفية حسب',
      sortBy: 'ترتيب حسب',
      popularity: 'الشعبية',
      voteAverage: 'التقييم',
      
      // Messages
      addedToFavorites: 'تم إضافته للمفضلة',
      removedFromFavorites: 'تم إزالته من المفضلة',
      reviewAdded: 'تم إضافة المراجعة بنجاح',
      reviewUpdated: 'تم تحديث المراجعة بنجاح',
      signInSuccess: 'تم تسجيل الدخول بنجاح',
      signUpSuccess: 'تم إنشاء الحساب بنجاح',
      noResults: 'لا توجد نتائج',
      noFavorites: 'لا توجد مفضلة حتى الآن',
      
      // Home page
      browseAndSearch: 'تصفح وابحث عن الأفلام',
      searchMovies: 'ابحث عن الأفلام...',
      filters: 'المرشحات',
      clear: 'مسح',
      
      // Movie detail page
      backToMovies: 'العودة إلى الأفلام',
      movieNotFound: 'لم يتم العثور على الفيلم',
      signInToAddFavorites: 'يرجى تسجيل الدخول لإضافة المفضلة',
      
      // Language
      language: 'اللغة',
      english: 'English',
      arabic: 'العربية',
    }
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
    },
    interpolation: {
      escapeValue: false,
    },
  })

// Update document direction based on language
i18n.on('languageChanged', (lng: string) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
})

// Set initial direction
document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = i18n.language

export default i18n