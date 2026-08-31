'use client'

import { create } from 'zustand'
import toast from 'react-hot-toast'

const mockData = {
  knowledgeItems: [
    {
      _id: '1',
      title: 'React Performance Optimization',
      content: 'Memoization, code splitting, and virtualization techniques for improving React app performance.',
      type: 'note',
      tags: ['react', 'performance', 'frontend'],
      views: 42,
      isFavorite: true,
      isArchived: false,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      _id: '2',
      title: 'The Future of AI in Development',
      content: 'https://github.blog/ai-future-development',
      type: 'link',
      tags: ['ai', 'development', 'future'],
      views: 28,
      isFavorite: false,
      isArchived: false,
      createdAt: '2024-01-14T14:20:00Z'
    },
    {
      _id: '3',
      title: 'Database Indexing Strategies',
      content: 'Understanding different indexing strategies and when to use them for optimal query performance.',
      type: 'insight',
      tags: ['database', 'performance', 'backend'],
      views: 35,
      isFavorite: true,
      isArchived: false,
      createdAt: '2024-01-13T09:15:00Z'
    },
    {
      _id: '4',
      title: 'TypeScript Best Practices',
      content: 'Advanced TypeScript patterns and practices for robust type safety.',
      type: 'note',
      tags: ['typescript', 'best-practices'],
      views: 31,
      isFavorite: false,
      isArchived: false,
      createdAt: '2024-01-12T16:45:00Z'
    },
    {
      _id: '5',
      title: 'Next.js 14 New Features',
      content: 'https://nextjs.org/blog/next-14',
      type: 'link',
      tags: ['nextjs', 'react', 'framework'],
      views: 56,
      isFavorite: true,
      isArchived: false,
      createdAt: '2024-01-11T11:10:00Z'
    },
    {
      _id: '6',
      title: 'Monorepo Architecture',
      content: 'Benefits and implementation of monorepos for large-scale applications.',
      type: 'insight',
      tags: ['architecture', 'monorepo', 'scalability'],
      views: 23,
      isFavorite: false,
      isArchived: true,
      createdAt: '2024-01-10T13:25:00Z'
    }
  ],
  stats: {
    total: 156,
    notes: 78,
    links: 45,
    insights: 33
  }
}

export const useKnowledgeStore = create((set) => ({
  knowledgeItems: [],
  stats: {
    total: 0,
    notes: 0,
    links: 0,
    insights: 0
  },
  isLoading: false,

  fetchKnowledge: async () => {
    set({ isLoading: true })

    // Simulate API call
    setTimeout(() => {
      set({
        knowledgeItems: mockData.knowledgeItems,
        stats: mockData.stats,
        isLoading: false
      })
    }, 1000)
  },

  addKnowledge: async (item) => {
    set((state) => ({
      knowledgeItems: [item, ...state.knowledgeItems],
      stats: {
        ...state.stats,
        total: state.stats.total + 1,
        [item.type + 's']: state.stats[item.type + 's'] + 1
      }
    }))

    toast.success('Knowledge item added successfully!')
  },

  deleteKnowledge: async (id) => {
    set((state) => {
      const item = state.knowledgeItems.find(item => item._id === id)
      const newItems = state.knowledgeItems.filter(item => item._id !== id)

      return {
        knowledgeItems: newItems,
        stats: item ? {
          ...state.stats,
          total: state.stats.total - 1,
          [item.type + 's']: state.stats[item.type + 's'] - 1
        } : state.stats
      }
    })

    toast.success('Knowledge item deleted!')
  },

  toggleFavorite: async (id) => {
    set((state) => ({
      knowledgeItems: state.knowledgeItems.map(item =>
        item._id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    }))

    toast.success('Favorite status updated!')
  }
}))