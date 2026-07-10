export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

interface GetMessageByGroupIdInput{
    groupId: number,
    offset: number,
    limit: number
}

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: API_BASE_URL + '/auth/login',
        REGISTER: API_BASE_URL + '/auth/register',
    },
    USER: {
        GET_ME : API_BASE_URL + `/users/me`,
        GET_MY_GROUP_LIST : API_BASE_URL + `/users/me/groups`,
        GET_USER_BY_ID(userId: number) { return API_BASE_URL + `/users/${userId}` },
        PUT_USER_BY_ID(userId: number) { return API_BASE_URL + `users/${userId}` }
    },
    GROUP: {
        GET_GROUP_BY_ID(groupId: number) { return API_BASE_URL + `/groups/${groupId}` },
        CREATE_GROUP: API_BASE_URL + "/groups"
    },
    MESSAGE: {
        GET_MESSAGE_BY_GROUP_ID(input: GetMessageByGroupIdInput) { 
            return API_BASE_URL + `/groups/${input.groupId}/messages?offset=${input.offset}&limit=${input.limit}` 
        },
        POST_MESSAGE(groupId: number) { return API_BASE_URL + `/groups/${groupId}/messages` }
    }
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