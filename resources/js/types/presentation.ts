import React from "react";

export type SlideLayout = 
  | "hero" | "split_text_visual" | "math_deep_dive" | "grid_cards" 
  | "architecture_flow" | "terminal_simulation" | "center_focus" 
  | "code_snippet" | "graph_visual" | "pipeline_flow" | "landscape_visual"
  | "system_visual" | "mobile_visual" | "matrix_visual" | "notebook_viewer";
  

export interface SlideItem {
  icon?: React.ReactNode;
  title: string;
  desc: string;
  footer?: string;
}

export interface SlideData {
  id: string;
  category: string;
  title: string;
  subtitle?: string;
  layout: SlideLayout;
  content?: React.ReactNode; // For freeform content
  left?: React.ReactNode;    // For split layouts
  right?: React.ReactNode;   // For split layouts
  items?: SlideItem[];       // For grids
  mathBlock?: string;        // For math slides
  codeSnippet?: string;
  highlightLines?: number[]; // For code blocks
  notebookPath?: string;  // For notebook viewer
  absolutePath?: string; // For landscape visuals
}