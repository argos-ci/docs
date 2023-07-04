import React from "react";

import argosEmblem from "@site/src/img/argos-emblem.png";

export const ArgosBanner = () => (
  <div className="argosBanner">
    <img src={argosEmblem} style={{ width: 30, marginRight: 4 }} />
    Covered by <span style={{ fontWeight: 500 }}>Argos</span>
  </div>
);
