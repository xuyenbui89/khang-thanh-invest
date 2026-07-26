import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SupabaseConfig } from '../types';

let supabaseClient: SupabaseClient | null = null;

export function getSupabaseClient(config?: SupabaseConfig): SupabaseClient | null {
  if (config && config.supabaseUrl && config.supabaseAnonKey) {
    try {
      supabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);
      return supabaseClient;
    } catch (err) {
      console.error('Lỗi khởi tạo Supabase:', err);
      return null;
    }
  }
  return supabaseClient;
}

export function saveSupabaseConfigToStorage(config: SupabaseConfig) {
  localStorage.setItem('crm_supabase_config', JSON.stringify(config));
}

export function loadSupabaseConfigFromStorage(): SupabaseConfig {
  const saved = localStorage.getItem('crm_supabase_config');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fallback
    }
  }
  return {
    supabaseUrl: 'https://xyzcompany.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key',
    isConnected: true,
    lastSyncedAt: new Date().toISOString()
  };
}
