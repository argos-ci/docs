import React from "react";
import ChevronRight from "@site/src/components/ChevronRight";
import Link from "@docusaurus/Link";

export const CardImage = (props) => (
  <img
    style={{
      maxHeight: 25,
      maxWidth: 25,
      margin: "auto",
      filter: "saturate(0%)",
    }}
    {...props}
  />
);

export const CardTitle = (props) => (
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

export const CardLink = (props) => (
  <Link
    className="cardLink"
    style={{ textDecoration: "none", borderRadius: 8 }}
    {...props}
  />
);

export const CardArrow = (props) => (
  <ChevronRight className="arrow" width="16" {...props} />
);

export const Card = (props) => (
  <div
    className="bordered rounded"
    style={{ padding: "10px 15px" }}
    {...props}
  />
);

export const Cards = (props) => (
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

export const CardBody = (props) => (
  <div
    style={{
      width: "100%",
      display: "grid",
      gridTemplateColumns: "auto 16px",
      alignItems: "center",
      gap: 16,
    }}
    {...props}
  />
);

export const IllustratedCardBody = (props) => (
  <div
    style={{
      width: "100%",
      display: "grid",
      gridTemplateColumns: "25px auto 16px",
      alignItems: "center",
      gap: 16,
    }}
    {...props}
  />
);

export const LinkCard = ({ link, image, children }) => {
  const PickedCardBody = image ? IllustratedCardBody : CardBody;

  return (
    <CardLink to={link}>
      <Card>
        <PickedCardBody>
          {image ? <CardImage src={image} /> : null}
          <CardTitle>{children}</CardTitle>
          <CardArrow />
        </PickedCardBody>
      </Card>
    </CardLink>
  );
};
