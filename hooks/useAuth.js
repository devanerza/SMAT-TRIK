import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';

const SESSION_TIMEOUT_MS = 8 * 60 * 60 * 1000;

function getStoredSession() {
  try {
    const raw = localStorage.getItem('ac_session_start');
    return raw ? parseInt(raw, 10) : null;
  } catch {
    return null;
  }
}

function setStoredSession() {
  try {
    localStorage.setItem('ac_session_start', String(Date.now()));
  } catch {
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem('ac_session_start');
  } catch {
  }
}

function isSessionExpired() {
  const start = getStoredSession();
  if (!start) return true;
  return Date.now() - start > SESSION_TIMEOUT_MS;
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRole = useCallback(async (userId) => {
    const { data } = await supabase
      .from('user_details')
      .select('role')
      .eq('id', userId)
      .single();
    return data?.role || 'customer';
  }, []);

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session || isSessionExpired()) {
        if (session) {
          await supabase.auth.signOut();
        }
        clearStoredSession();
        if (mounted) {
          setUser(null);
          setRole(null);
          setLoading(false);
        }
        return;
      }

      setStoredSession();
      const userRole = await fetchRole(session.user.id);
      if (mounted) {
        setUser(session.user);
        setRole(userRole);
        setLoading(false);
      }
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setStoredSession();
          const userRole = await fetchRole(session.user.id);
          if (mounted) {
            setUser(session.user);
            setRole(userRole);
          }
        } else if (event === 'SIGNED_OUT') {
          clearStoredSession();
          if (mounted) {
            setUser(null);
            setRole(null);
          }
        }
        if (mounted) setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchRole]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { error: 'Email atau password salah' };
    }

    if (data.session) {
      setStoredSession();
      const userRole = await fetchRole(data.session.user.id);
      setUser(data.session.user);
      setRole(userRole);
    }

    return { error: null };
  }, [fetchRole]);

  const signOut = useCallback(async () => {
    clearStoredSession();
    await supabase.auth.signOut();
    setUser(null);
    setRole(null);
  }, []);

  return { user, role, loading, signIn, signOut };
}
