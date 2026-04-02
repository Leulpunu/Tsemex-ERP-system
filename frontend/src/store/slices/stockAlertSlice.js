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

export const stockAlertApi = createApi({
  reducerPath: 'stockAlertApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['StockAlert'],
  endpoints: (builder) => ({
    getStockAlerts: builder.query({
      query: () => 'stock-alerts',
      providesTags: ['StockAlert']
    }),
    generateAlerts: builder.mutation({
      query: () => ({
        url: 'stock-alerts/generate',
        method: 'POST',
      }),
      invalidatesTags: ['StockAlert']
    }),
    resolveAlert: builder.mutation({
      query: (id) => ({
        url: `stock-alerts/${id}/resolve`,
        method: 'PATCH',
      }),
      invalidatesTags: ['StockAlert']
    }),
    getAlertCount: builder.query({
      query: () => 'stock-alerts/count',
    }),
  }),
})

export const { 
  useGetStockAlertsQuery,
  useGenerateAlertsMutation,
  useResolveAlertMutation,
  useGetAlertCountQuery 
} = stockAlertApi

