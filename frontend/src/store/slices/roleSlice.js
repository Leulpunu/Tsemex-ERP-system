import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { logout } from './authSlice'

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions)
  if (result?.error?.status === 401) {
    api.dispatch(logout())
  }
  return result
}

export const roleApi = createApi({
  reducerPath: 'roleApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Role'],
  endpoints: (builder) => ({
    getRoles: builder.query({
      query: () => 'roles',
      providesTags: ['Role']
    }),
    createRole: builder.mutation({
      query: (role) => ({
        url: 'roles',
        method: 'POST',
        body: role,
      }),
      invalidatesTags: ['Role']
    }),
    updateRole: builder.mutation({
      query: ({ id, data }) => ({
        url: `roles/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Role']
    }),
    deleteRole: builder.mutation({
      query: (id) => ({
        url: `roles/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Role']
    }),
    getRoleUsers: builder.query({
      query: (id) => `roles/${id}/users`,
      providesTags: ['Role']
    }),
    assignRoleToUser: builder.mutation({
      query: ({ id, userId }) => ({
        url: `roles/${id}/assign`,
        method: 'POST',
        body: { userId }
      }),
      invalidatesTags: ['Role']
    }),
  }),
})

export const { 
  useGetRolesQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetRoleUsersQuery,
  useAssignRoleToUserMutation 
} = roleApi

