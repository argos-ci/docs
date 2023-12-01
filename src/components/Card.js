import React from "react";
import { ChevronRight } from "@site/src/components/icons/ChevronRight";
import Link from "@docusaurus/Link";

export const CardImage = (props) => (
  <img style={{ maxHeight: 30, maxWidth: 30 }} {...props} />
);

export const CardTitle = (props) => <h4 className="title4" {...props} />;

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
    className="bordered rounded border-active"
    style={{ padding: "20px 24px", height: 115 }}
    {...props}
  />
);

export const Cards = (props) => (
  <ul
    style={{
      paddingLeft: 0,
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(200px, 1fr))",
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
      display: "flex",
      flexDirection: "column",
      gap: 24,
      justifyContent: "center",
      height: "100%",
    }}
    {...props}
  />
);

export const IllustratedCardBody = (props) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 24,
    }}
    {...props}
  />
);

export const LinkCard = ({ to, image, children }) => {
  const PickedCardBody = image ? IllustratedCardBody : CardBody;

  return (
    <CardLink to={to}>
      <Card>
        <PickedCardBody>
          {image ? (
            <div style={{ height: 25 }}>
              <CardImage src={image} />
            </div>
          ) : null}
          <CardTitle>{children}</CardTitle>
        </PickedCardBody>
      </Card>
    </CardLink>
  );
};
