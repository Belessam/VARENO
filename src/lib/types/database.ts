/**
 * VARENO Database Types
 *
 * Auto-generated types for Supabase schema.
 * These mirror the SQL schema defined in supabase/migrations/.
 * Regenerate with: supabase gen types typescript --local
 *
 * For now, these are manually defined to match the migration.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          price_piastres: number;
          sku: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          price_piastres: number;
          sku: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          price_piastres?: number;
          sku?: string;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: number;
          order_reference: string;
          customer_name: string;
          phone: string;
          email: string;
          city: string;
          area_district: string;
          street_address: string;
          payment_method: string;
          payment_status: string;
          order_status: string;
          quantity: number;
          unit_price_piastres: number;
          total_amount_piastres: number;
          instapay_proof_path: string | null;
          instapay_sender_name: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          order_reference: string;
          customer_name: string;
          phone: string;
          email: string;
          city: string;
          area_district: string;
          street_address: string;
          payment_method: string;
          payment_status?: string;
          order_status?: string;
          quantity?: number;
          unit_price_piastres: number;
          total_amount_piastres: number;
          instapay_proof_path?: string | null;
          instapay_sender_name?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          order_reference?: string;
          customer_name?: string;
          phone?: string;
          email?: string;
          city?: string;
          area_district?: string;
          street_address?: string;
          payment_method?: string;
          payment_status?: string;
          order_status?: string;
          quantity?: number;
          unit_price_piastres?: number;
          total_amount_piastres?: number;
          instapay_proof_path?: string | null;
          instapay_sender_name?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: number;
          product_id: string;
          product_name: string;
          quantity: number;
          unit_price_piastres: number;
          total_price_piastres: number;
        };
        Insert: {
          id?: number;
          order_id: number;
          product_id: string;
          product_name: string;
          quantity?: number;
          unit_price_piastres: number;
          total_price_piastres: number;
        };
        Update: {
          id?: number;
          order_id?: number;
          product_id?: string;
          product_name?: string;
          quantity?: number;
          unit_price_piastres?: number;
          total_price_piastres?: number;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
