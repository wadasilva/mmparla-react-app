import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const router = {
      location: useLocation(),
      navigate: useNavigate(),
      params: useParams(),
    };

    return <Component {...props} router={router} />;
  }

  return ComponentWithRouterProp;
}
