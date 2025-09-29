import { z } from "zod";
import { publicProcedure } from "@/backend/trpc/create-context";

const getUsersInputSchema = z.object({
  search: z.string().optional(),
  role: z.enum(['admin', 'creator', 'listener', 'moderator']).optional(),
  status: z.enum(['active', 'suspended', 'pending', 'banned']).optional(),
  limit: z.number().min(1).max(100).default(50),
  offset: z.number().min(0).default(0),
});

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.enum(['admin', 'creator', 'listener', 'moderator']),
  status: z.enum(['active', 'suspended', 'pending', 'banned']),
  joinDate: z.string(),
  lastActive: z.string(),
  country: z.string(),
  totalStreams: z.number(),
  uploads: z.number(),
  subscription: z.enum(['free', 'premium', 'pro']),
  reports: z.number(),
});

const getUsersOutputSchema = z.object({
  users: z.array(userSchema),
  total: z.number(),
  hasMore: z.boolean(),
});

// Mock data for now - replace with actual database queries
const mockUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'admin' as const, status: 'active' as const, joinDate: '2023-01-15', lastActive: '2 hours ago', country: 'US', totalStreams: 15420, uploads: 0, subscription: 'pro' as const, reports: 0 },
  { id: '2', name: 'Bob Smith', email: 'bob@example.com', role: 'creator' as const, status: 'active' as const, joinDate: '2023-03-22', lastActive: '1 day ago', country: 'UK', totalStreams: 8930, uploads: 47, subscription: 'premium' as const, reports: 2 },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', role: 'listener' as const, status: 'suspended' as const, joinDate: '2023-06-10', lastActive: '1 week ago', country: 'CA', totalStreams: 2340, uploads: 0, subscription: 'free' as const, reports: 5 },
  { id: '4', name: 'Diana Prince', email: 'diana@example.com', role: 'creator' as const, status: 'active' as const, joinDate: '2023-02-08', lastActive: '3 hours ago', country: 'AU', totalStreams: 12890, uploads: 23, subscription: 'premium' as const, reports: 0 },
  { id: '5', name: 'Eve Wilson', email: 'eve@example.com', role: 'moderator' as const, status: 'active' as const, joinDate: '2023-01-30', lastActive: '30 minutes ago', country: 'DE', totalStreams: 5670, uploads: 0, subscription: 'pro' as const, reports: 0 },
  { id: '6', name: 'Frank Miller', email: 'frank@example.com', role: 'creator' as const, status: 'active' as const, joinDate: '2023-04-12', lastActive: '5 hours ago', country: 'FR', totalStreams: 11230, uploads: 34, subscription: 'premium' as const, reports: 1 },
  { id: '7', name: 'Grace Lee', email: 'grace@example.com', role: 'listener' as const, status: 'active' as const, joinDate: '2023-07-20', lastActive: '1 hour ago', country: 'KR', totalStreams: 6780, uploads: 0, subscription: 'free' as const, reports: 0 },
  { id: '8', name: 'Henry Davis', email: 'henry@example.com', role: 'creator' as const, status: 'pending' as const, joinDate: '2023-09-15', lastActive: '2 days ago', country: 'JP', totalStreams: 890, uploads: 5, subscription: 'free' as const, reports: 0 },
];

export const getUsersProcedure = publicProcedure
  .input(getUsersInputSchema)
  .output(getUsersOutputSchema)
  .query(async ({ input }) => {
    console.log('[Admin] Getting users with filters:', input);
    
    let filteredUsers = mockUsers;
    
    // Apply search filter
    if (input.search) {
      const searchLower = input.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user => 
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply role filter
    if (input.role) {
      filteredUsers = filteredUsers.filter(user => user.role === input.role);
    }
    
    // Apply status filter
    if (input.status) {
      filteredUsers = filteredUsers.filter(user => user.status === input.status);
    }
    
    const total = filteredUsers.length;
    const paginatedUsers = filteredUsers.slice(input.offset, input.offset + input.limit);
    const hasMore = input.offset + input.limit < total;
    
    return {
      users: paginatedUsers,
      total,
      hasMore,
    };
  });