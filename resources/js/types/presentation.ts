import React from "react";

export type SlideLayout = 
  | "hero" 
  | "split_text_visual" 
  | "math_deep_dive" 
  | "grid_cards" 
  | "architecture_flow" 
  | "terminal_simulation"
  | "center_focus"
  | "code_layout"
  | "graph_layout"
  | "pipeline_layout"
  | "landscape_layout";

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
}