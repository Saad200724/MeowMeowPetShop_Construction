// Fallback authentication system for when Supabase isn't working
interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role: string;
}

const USERS_STORAGE_KEY = 'meow_users';

// Get users from localStorage
function getUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save users to localStorage
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

// Fallback sign up
export async function fallbackSignUp(
  email: string, 
  password: string, 
  firstName?: string, 
  lastName?: string
) {
  const users = getUsers();
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return { 
      data: null, 
      error: { message: 'User already exists with this email' } 
    };
  }
  
  // Create new user
  const newUser: User = {
    id: Date.now().toString(),
    email,
    firstName,
    lastName,
    name: firstName && lastName ? `${firstName} ${lastName}` : firstName || lastName || '',
    role: 'user'
  };
  
  // Store password separately (in real app, this would be hashed)
  const passwords = JSON.parse(localStorage.getItem('meow_passwords') || '{}');
  passwords[email] = password;
  localStorage.setItem('meow_passwords', JSON.stringify(passwords));
  
  users.push(newUser);
  saveUsers(users);
  
  // Store as current user
  localStorage.setItem('auth_user', JSON.stringify(newUser));
  
  return { 
    data: { user: newUser }, 
    error: null 
  };
}

// Fallback sign in
export async function fallbackSignIn(email: string, password: string) {
  const users = getUsers();
  const passwords = JSON.parse(localStorage.getItem('meow_passwords') || '{}');
  
  const user = users.find(u => u.email === email);
  if (!user || passwords[email] !== password) {
    return { 
      data: null, 
      error: { message: 'Invalid email or password' } 
    };
  }
  
  // Store as current user
  localStorage.setItem('auth_user', JSON.stringify(user));
  
  return { 
    data: { user }, 
    error: null 
  };
}