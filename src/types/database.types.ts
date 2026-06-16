export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      funkos: {
        Row: {
          category: string
          created_at: string
          description: string
          featured: boolean
          id: number
          imgSrc: string[]
          name: string
          price: number
          stock: number
        }
        Insert: {
          category: string
          created_at?: string
          description: string
          featured?: boolean
          id?: number
          imgSrc: string[]
          name: string
          price: number
          stock: number
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          featured?: boolean
          id?: number
          imgSrc?: string[]
          name?: string
          price?: number
          stock?: number
        }
        Relationships: []
      }
      orders: {
        Row: {
          buyer: Json
          created_at: string
          id: string
          items: Json
          total: number
          user_id: string | null
        }
        Insert: {
          buyer: Json
          created_at?: string
          id?: string
          items: Json
          total: number
          user_id?: string | null
        }
        Update: {
          buyer?: Json
          created_at?: string
          id?: string
          items?: Json
          total?: number
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string
          phone: string
          avatar_url: string
          address: string
          city: string
          country: string
          postal_code: string
          updated_at: string
          created_at: string
        }
        Insert: {
          id: string
          full_name?: string
          phone?: string
          avatar_url?: string
          address?: string
          city?: string
          country?: string
          postal_code?: string
          updated_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          phone?: string
          avatar_url?: string
          address?: string
          city?: string
          country?: string
          postal_code?: string
          updated_at?: string
          created_at?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          user_id: string
          funko_id: number
          created_at: string
        }
        Insert: {
          user_id: string
          funko_id: number
          created_at?: string
        }
        Update: {
          user_id?: string
          funko_id?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_funko_id_fkey"
            columns: ["funko_id"]
            isOneToOne: false
            referencedRelation: "funkos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_order: {
        Args: { buyer: Json; items: Json; total: number }
        Returns: {
          order_id: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof Database
}
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
