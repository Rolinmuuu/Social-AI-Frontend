/// <reference types="react-scripts" />

declare module "*.css" {
  const classes: Record<string, string>;
  export default classes;
}

declare module "*.svg" {
  import React from "react";
  const content: React.FC<React.SVGProps<SVGSVGElement>>;
  export default content;
}
