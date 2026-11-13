import { Children } from "react";

export const Step = (props) => <div {...props} />;
export const StepTitle = (props) => (
  <div style={{ fontSize: 18, marginBottom: 4, fontWeight: 500 }} {...props} />
);
export const StepContent = (props) => <div className="paragraph" {...props} />;
const StepNumber = ({ children, ...props }) => (
  <div
    style={{
      fontSize: 32,
      minWidth: "40px",
      alignItems: "center",
      justifyContent: "center",
      borderRight: "1px solid white",
      height: 40,
      display: "flex",
      alignItems: "center",
      justifyContent: "left",
    }}
    {...props}
  >
    {children}
  </div>
);
const List = (props) => (
  <ul
    style={{
      listStyle: "none",
      display: "flex",
      flexDirection: "column",
      gap: 20,
      marginBottom: 40,
      listStyleType: "none",
      paddingLeft: 30,
    }}
    {...props}
  />
);

const ListItem = (props) => (
  <li
    className="border rounded"
    style={{
      padding: "10px 20px",
      display: "flex",
      gap: 30,
      alignItems: "center",
    }}
    {...props}
  />
);

export const StepList = ({ children }) => {
  const arrayChildren = Children.toArray(children);
  return (
    <List>
      {Children.map(arrayChildren, (child, index) => (
        <ListItem>
          <StepNumber>{index + 1}</StepNumber>
          {child}
        </ListItem>
      ))}
    </List>
  );
};
