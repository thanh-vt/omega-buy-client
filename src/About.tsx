import React from "react";
import { withTranslation } from "react-i18next";

class About extends React.Component<any, any> {
  render(): React.ReactNode {
    return <h2>About</h2>;
  }
}

export default withTranslation('common') (About);
