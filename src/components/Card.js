import React from "react";
import { ChevronRight } from "@site/src/components/icons/ChevronRight";
import Link from "@docusaurus/Link";

export const CardImageContainer = (props) => (
  <div
    style={{
      width: 40,
      height: 35,
      display: "flex",
      justifyItems: "center",
    }}
    {...props}
  />
);

export const CardImage = (props) => (
  <img
    style={{
      maxHeight: 35,
      maxWidth: 30,
      margin: "auto",
    }}
    {...props}
  />
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
    style={{
      padding: "10px 15px",
      minHeight: 80,
      display: "flex",
      alignItems: "center",
    }}
    {...props}
  />
);

export const Cards = (props) => (
  <ul
    style={{
      paddingLeft: 0,
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(200px, 300px))",
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

export const LinkCard = ({ to, image, children }) => {
  const PickedCardBody = image ? IllustratedCardBody : CardBody;

  return (
    <CardLink to={to}>
      <Card>
        <PickedCardBody>
          {image ? (
            <CardImageContainer>
              <CardImage src={image} />
            </CardImageContainer>
          ) : null}
          <CardTitle>{children}</CardTitle>
          <CardArrow />
        </PickedCardBody>
      </Card>
    </CardLink>
  );
};
