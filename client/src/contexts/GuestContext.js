'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const GuestContext = createContext();

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function GuestProvider({ children }) {
  const [isGuest, setIsGuest] = useState(true);
  const [guestSessionId, setGuestSessionId] = useState(null);
  const [guestFavorites, setGuestFavorites] = useState([]);
  const [guestStats, setGuestStats] = useState({
    viewCount: 0,
    searchCount: 0,
    favoriteCount: 0
  });
  const [loading, setLoading] = useState(false);

  // Initialize guest session
  useEffect(() => {
    const initGuestSession = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem('authToken');
        if (token) {
          setIsGuest(false);
          return;
        }

        // Get or create guest session
        let sessionId = localStorage.getItem('guestSessionId');
        if (!sessionId) {
          sessionId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          localStorage.setItem('guestSessionId', sessionId);
        }

        setGuestSessionId(sessionId);
        setIsGuest(true);

        // Fetch guest data
        await fetchGuestData(sessionId);
      } catch (error) {
        console.error('Guest session init error:', error);
      }
    };

    initGuestSession();
  }, []);

  const fetchGuestData = async (sessionId) => {
    try {
      // Fetch favorites
      const favRes = await fetch(`${API_BASE_URL}/guest/favorites`, {
        credentials: 'include'
      });
      if (favRes.ok) {
        const favData = await favRes.json();
        setGuestFavorites(favData.data?.favorites || []);
      }

      // Fetch stats
      const statsRes = await fetch(`${API_BASE_URL}/guest/stats`, {
        credentials: 'include'
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setGuestStats(statsData.data || {});
      }
    } catch (error) {
      console.error('Error fetching guest data:', error);
    }
  };

  const addFavorite = async (knowledgeId) => {
    if (!isGuest) {
      // For authenticated users, use AuthContext
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/guest/favorites/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knowledgeId }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to add favorite');

      setGuestFavorites(prev => 
        prev.includes(knowledgeId) ? prev : [...prev, knowledgeId]
      );
      toast.success('Added to favorites');
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast.error('Failed to add favorite');
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (knowledgeId) => {
    if (!isGuest) {
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/guest/favorites/remove`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ knowledgeId }),
        credentials: 'include'
      });

      if (!res.ok) throw new Error('Failed to remove favorite');

      setGuestFavorites(prev => prev.filter(id => id !== knowledgeId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast.error('Failed to remove favorite');
    } finally {
      setLoading(false);
    }
  };

  const trackSearch = async (query) => {
    if (!isGuest || !guestSessionId) return;

    try {
      await fetch(`${API_BASE_URL}/guest/search/track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        credentials: 'include'
      });
    } catch (error) {
      console.error('Error tracking search:', error);
    }
  };

  const isFavorite = (knowledgeId) => {
    return guestFavorites.includes(knowledgeId);
  };

  const value = {
    isGuest,
    guestSessionId,
    guestFavorites,
    guestStats,
    loading,
    addFavorite,
    removeFavorite,
    trackSearch,
    isFavorite,
    fetchGuestData
  };

  return (
    <GuestContext.Provider value={value}>
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const context = useContext(GuestContext);
  if (!context) {
    throw new Error('useGuest must be used within GuestProvider');
  }
  return context;
}
