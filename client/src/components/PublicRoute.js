'use client';

/**
 * PublicRoute Component
 * Allows access to both authenticated users and guests
 * No redirect needed - guests can always access
 */

export default function PublicRoute({ children }) {
  return children;
}
