import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { api } from '../../api/client'

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: '/api/',
    credentials: 'include'
  }),
  endpoints: (builder) => ({
    getRooms: builder.query({
      query: () => 'chat/rooms'
    })
  })
})

export const { useGetRoomsQuery } = chatApi

