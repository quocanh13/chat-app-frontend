export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: API_BASE_URL + '/auth/login',
    REGISTER: API_BASE_URL + '/auth/register',
  },
};

export const INVALID_SCHEMA_MESSAGE = {
    MIN_LENGTH(field: string, len: number){
        return `${field} must contain more than ${len} character`
    },
    MAX_LENGTH(field: string, len: number){
        return `${field} must contain less than ${len} character`
    },
    USERNAME_REGEX: "Username can only contain letters (a-z, A-Z) and numbers (0-9)",
    NAME_REGEX: "Name must not contain digit (0-9) and special symbol"
}