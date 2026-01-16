import axios from 'axios';

// Define types for user and auth response
interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  // Note: role may be handled separately depending on user type
}

interface AuthResponse {
  success: boolean;
  token?: string;
  user?: User;
  error?: string;
}

class AuthService {
  private API_BASE_URL: string;
  private TOKEN_KEY = 'auth_token';
  private USER_KEY = 'user_data';

  constructor() {
    this.API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  }

  // Login user and store JWT token
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/v1/candidate/login`, {
        email,
        password
      });

      // Backend returns 'candidate' but frontend expects 'user' - map it for compatibility
      if (response.data.token && response.data.success) {
        const userData = response.data.candidate || response.data.user;
        this.setAuthToken(response.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        return {
          success: true,
          token: response.data.token,
          user: userData
        };
      }

      // Handle error response
      if (response.data.error) {
        return { success: false, error: response.data.error };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || error.message || 'Login failed' 
      };
    }
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/v1/candidate/register`, {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        // Map role to appropriate fields for candidate registration
        phone: '',
        location: '',
        experience_years: 0,
        technical_skills: '',
        education_level: '',
        seniority_level: '',
        // Note: role is typically assigned by the backend or stored separately
      });

      // Handle error response first
      if (response.data.error || !response.data.success) {
        const errorMsg = response.data.error || 'Registration failed';
        return { success: false, error: errorMsg };
      }

      // Backend returns: {"success": True, "message": "...", "candidate_id": "..."}
      // Registration successful - auto-login the user
      if (response.data.success && response.data.candidate_id) {
        // Try to auto-login after successful registration
        return await this.login(userData.email, userData.password);
      }

      // If backend returns candidate object directly (for compatibility)
      if (response.data.success && response.data.candidate) {
        return await this.login(userData.email, userData.password);
      }

      // If backend returns token directly
      if (response.data.token) {
        const userData = response.data.candidate || response.data.user;
        this.setAuthToken(response.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(userData));
        return {
          success: true,
          token: response.data.token,
          user: userData
        };
      }

      // If we have success but no candidate_id or token, still try to login
      if (response.data.success) {
        return await this.login(userData.email, userData.password);
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Registration error:', error);
      // Handle duplicate email error
      const errorMsg = error.response?.data?.error || error.response?.data?.message || error.message || 'Registration failed';
      
      // Check for email already registered error
      if (errorMsg.includes('already registered') || 
          errorMsg.includes('Email already registered') ||
          errorMsg.includes('already exists')) {
        return { success: false, error: 'This email is already registered. Please use a different email or login instead.' };
      }
      
      return { 
        success: false, 
        error: errorMsg
      };
    }
  }

  // Logout user and clear stored data
  logout(): void {
    this.removeAuthToken();
    localStorage.removeItem(this.USER_KEY);
  }

  // Get stored JWT token
  getAuthToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Set JWT token in localStorage and axios defaults
  setAuthToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  // Remove JWT token from storage and axios defaults
  removeAuthToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    delete axios.defaults.headers.common['Authorization'];
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    if (!token) return false;

    // Check if token is expired
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
  }

  // Get stored user data
  getUserData(): User | null {
    const userData = localStorage.getItem(this.USER_KEY);
    return userData ? JSON.parse(userData) : null;
  }


}

export default new AuthService();