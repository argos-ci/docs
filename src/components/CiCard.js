import React from "react";
import ChevronRight from "@site/src/components/ChevronRight";

export const CiCardImage = (props) => (
  <div
    className="ciCardImage"
    style={{
      width: 25,
      height: 25,
      display: "flex",
      alignItems: "center",
      filter: "saturate(0%)",
    }}
    {...props}
  />
);

export const CiCardTitle = (props) => (
  <h4
    style={{
      lineHeight: "1.5em",
      fontWeight: 600,
      whiteSpace: "nowrap",
      marginBottom: 0,
    }}
    {...props}
  />
);

export const CICardLink = (props) => (
  <a
    className="ciCardLink"
    style={{ textDecoration: "none", borderRadius: 8 }}
    {...props}
  />
);

export const CiArrow = (props) => (
  <ChevronRight className="arrow" width="16" {...props} />
);

export const CiBody = (props) => (
  <div style={{ display: "flex", gap: 16 }} {...props} />
);

export const CiCard = (props) => (
  <div
    className="bordered rounded"
    style={{
      display: "flex",
      justifyContent: "space-between",
      gap: 16,
      padding: "10px 15px",
    }}
    {...props}
  />
);

export const CiCards = (props) => (
  <ul
    style={{
      paddingLeft: 0,
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      marginBottom: 32,
      gridColumnGap: 16,
      gridRowGap: 16,
    }}
    {...props}
  />
);
