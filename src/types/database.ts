// Hand-authored Supabase schema types.
// Source of truth: supabase/migrations/0002_memory_schema.sql,
// 0003_storage.sql, 0004_collection_meta.sql.
// Keep in sync when the schema changes.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MemoryType =
  | "screenshot"
  | "note"
  | "document"
  | "link"
  | "image"
  | "discussion"
  | "email"
  | "archive";

export type ProcessingStatus = "pending" | "processing" | "ready" | "failed";

export type RelationshipType =
  | "related_to"
  | "references"
  | "derived_from"
  | "contradicts";

export type RelationshipCreator = "user" | "ai";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_path: string | null;
          preferences: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          avatar_path?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          avatar_path?: string | null;
          preferences?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      memories: {
        Row: {
          id: string;
          user_id: string;
          type: MemoryType;
          title: string;
          description: string | null;
          source_url: string | null;
          source_domain: string | null;
          content_text: string | null;
          extracted_text: string | null;
          ai_summary: string | null;
          metadata: Json;
          processing_status: ProcessingStatus;
          processing_error_code: string | null;
          favorite: boolean;
          captured_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: MemoryType;
          title: string;
          description?: string | null;
          source_url?: string | null;
          source_domain?: string | null;
          content_text?: string | null;
          extracted_text?: string | null;
          ai_summary?: string | null;
          metadata?: Json;
          processing_status?: ProcessingStatus;
          processing_error_code?: string | null;
          favorite?: boolean;
          captured_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: MemoryType;
          title?: string;
          description?: string | null;
          source_url?: string | null;
          source_domain?: string | null;
          content_text?: string | null;
          extracted_text?: string | null;
          ai_summary?: string | null;
          metadata?: Json;
          processing_status?: ProcessingStatus;
          processing_error_code?: string | null;
          favorite?: boolean;
          captured_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      memory_files: {
        Row: {
          id: string;
          user_id: string;
          memory_id: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          checksum: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          memory_id: string;
          storage_path: string;
          original_filename: string;
          mime_type: string;
          size_bytes: number;
          checksum?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          memory_id?: string;
          storage_path?: string;
          original_filename?: string;
          mime_type?: string;
          size_bytes?: number;
          checksum?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          normalized_name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          normalized_name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          normalized_name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      memory_tags: {
        Row: {
          memory_id: string;
          tag_id: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          memory_id: string;
          tag_id: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          memory_id?: string;
          tag_id?: string;
          user_id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          cover_memory_id: string | null;
          emoji: string;
          ai_generated: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          cover_memory_id?: string | null;
          emoji?: string;
          ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          cover_memory_id?: string | null;
          emoji?: string;
          ai_generated?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      collection_memories: {
        Row: {
          collection_id: string;
          memory_id: string;
          user_id: string;
          added_at: string;
        };
        Insert: {
          collection_id: string;
          memory_id: string;
          user_id: string;
          added_at?: string;
        };
        Update: {
          collection_id?: string;
          memory_id?: string;
          user_id?: string;
          added_at?: string;
        };
        Relationships: [];
      };
      memory_relationships: {
        Row: {
          id: string;
          user_id: string;
          source_memory_id: string;
          target_memory_id: string;
          relationship_type: RelationshipType;
          created_by: RelationshipCreator;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_memory_id: string;
          target_memory_id: string;
          relationship_type: RelationshipType;
          created_by?: RelationshipCreator;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_memory_id?: string;
          target_memory_id?: string;
          relationship_type?: RelationshipType;
          created_by?: RelationshipCreator;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      set_updated_at: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      handle_new_user: {
        Args: Record<string, never>;
        Returns: unknown;
      };
    };
    Enums: {
      memory_type: MemoryType;
      processing_status: ProcessingStatus;
      relationship_type: RelationshipType;
      relationship_creator: RelationshipCreator;
    };
    CompositeTypes: Record<string, never>;
  };
}

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type MemoryRow = Database["public"]["Tables"]["memories"]["Row"];
export type MemoryFileRow = Database["public"]["Tables"]["memory_files"]["Row"];
export type TagRow = Database["public"]["Tables"]["tags"]["Row"];
export type CollectionRow = Database["public"]["Tables"]["collections"]["Row"];
export type MemoryRelationshipRow =
  Database["public"]["Tables"]["memory_relationships"]["Row"];
