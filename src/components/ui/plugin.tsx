"use client";

import React, { useEffect } from "react";
import "@jup-ag/plugin/css";

export default function PluginComponent() {
  useEffect(() => {
    import("@jup-ag/plugin").then((mod) => {
      const { init } = mod;
      init({
        displayMode: "widget",
        integratedTargetId: "jupiter-plugin",
      });
    });
  }, []);

  return (
    <div>
      <div id="jupiter-plugin" />
    </div>
  );
}
