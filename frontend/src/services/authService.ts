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

      if (response.data.token) {
        this.setAuthToken(response.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Login failed' 
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

      if (response.data.token) {
        this.setAuthToken(response.data.token);
        localStorage.setItem(this.USER_KEY, JSON.stringify(response.data.user));
        return {
          success: true,
          token: response.data.token,
          user: response.data.user
        };
      }

      return { success: false, error: 'Invalid response from server' };
    } catch (error: any) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || error.message || 'Registration failed' 
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