export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  role: UserRole;
}

export interface UserRole {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  name: string;
  type: string;
  description: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  firstName: string;
  lastName: string;
  confirmPassword: string;
  role: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshTokenResponse {
  access: {
    token: string;
    expires: string;
  };
}

// Interface pour la structure d'erreur de validation dans un champ
export interface ValidationFieldError {
  field: string;
  messages: string[];
  value: any;
}

// Interface pour les erreurs de validation (utilisée dans 'details')
export interface ValidationErrorDetails {
  errors: ValidationFieldError[];
}

// Interface pour les erreurs API
export interface ApiError {
  status: number;
  code: string;
  message: string;
  timestamp: number;
  details?: any; // Champ optionnel pour les détails supplémentaires d'erreur
} 