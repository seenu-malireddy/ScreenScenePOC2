import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth } from '../config/firebase'
import { User, SignUpData } from '../types'
const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
  const displayName = firebaseUser.displayName || ''
  const [firstName, ...lastNameParts] = displayName.split(' ')
  
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    firstName: firstName || '',
    lastName: lastNameParts.join(' ') || '',
    createdAt: firebaseUser.metadata.creationTime || new Date().toISOString()
  }
}

export class FirebaseAuthService {
  static async signUp(userData: SignUpData): Promise<User> {
    try {
      const { email, password, firstName, lastName } = userData
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      const displayName = `${firstName} ${lastName}`.trim()
      await updateProfile(firebaseUser, { displayName })
      await sendEmailVerification(firebaseUser)
      
      return convertFirebaseUser(firebaseUser)
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          throw new Error('An account with this email already exists')
        case 'auth/weak-password':
          throw new Error('Password should be at least 6 characters')
        case 'auth/invalid-email':
          throw new Error('Invalid email address')
        default:
          throw new Error(error.message || 'Failed to create account')
      }
    }
  }

  static async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return convertFirebaseUser(userCredential.user)
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          throw new Error('Invalid email or password')
        case 'auth/user-disabled':
          throw new Error('This account has been disabled')
        case 'auth/too-many-requests':
          throw new Error('Too many failed attempts. Please try again later')
        default:
          throw new Error(error.message || 'Failed to sign in')
      }
    }
  }

  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to sign out')
    }
  }

  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('No user logged in')
      }

      if (userData.firstName || userData.lastName) {
        const currentDisplayName = currentUser.displayName || ''
        const [currentFirstName, ...currentLastNameParts] = currentDisplayName.split(' ')
        
        const firstName = userData.firstName || currentFirstName
        const lastName = userData.lastName || currentLastNameParts.join(' ')
        const newDisplayName = `${firstName} ${lastName}`.trim()
        
        await updateProfile(currentUser, { displayName: newDisplayName })
      }

      return convertFirebaseUser(currentUser)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to update profile')
    }
  }

  static async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      switch (error.code) {
        case 'auth/user-not-found':
          throw new Error('No account found with this email address')
        case 'auth/invalid-email':
          throw new Error('Invalid email address')
        default:
          throw new Error(error.message || 'Failed to send password reset email')
      }
    }
  }

  static async sendEmailVerification(): Promise<void> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new Error('No user logged in')
      }
      await sendEmailVerification(currentUser)
    } catch (error: any) {
      throw new Error(error.message || 'Failed to send verification email')
    }
  }

  static getCurrentUser(): User | null {
    const firebaseUser = auth.currentUser
    return firebaseUser ? convertFirebaseUser(firebaseUser) : null
  }

  static onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      const user = firebaseUser ? convertFirebaseUser(firebaseUser) : null
      callback(user)
    })
  }

  static isAuthenticated(): boolean {
    return !!auth.currentUser
  }

  static isEmailVerified(): boolean {
    return auth.currentUser?.emailVerified || false
  }
}

export default FirebaseAuthService