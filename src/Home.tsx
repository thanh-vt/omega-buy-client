import React from "react";
import { withTranslation } from "react-i18next";

class Home extends React.Component<any, any> {
  render(): React.ReactNode {
    return <h2>{this.props.t('common:title.home')}</h2>;
  }
}

export default withTranslation('common') (Home);
